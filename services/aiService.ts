import { GoogleGenerativeAI } from '@google/generative-ai';
import { DetectedAnomaly } from '@/types';
import Constants from 'expo-constants';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { decode } from 'jpeg-js';
import { storage } from '@/config/firebase';
import { ref, getDownloadURL } from 'firebase/storage';

const genAI = new GoogleGenerativeAI(
  Constants.expoConfig?.extra?.EXPO_PUBLIC_GEMINI_API_KEY ||
  process.env.EXPO_PUBLIC_GEMINI_API_KEY || ''
);

let model: tf.GraphModel | null = null;

const IMAGE_SIZE = 224; // MobileNetV2 default input size
const NUM_CHANNELS = 3;
const MODEL_STORAGE_PATH = 'models/chest-xray/model.json';

const getModelUrl = async (): Promise<string> => {
  try {
    const modelRef = ref(storage, MODEL_STORAGE_PATH);
    const modelUrl = await getDownloadURL(modelRef);
    return modelUrl;
  } catch (error) {
    console.error('Error getting model URL:', error);
    throw new Error('Failed to access the AI model');
  }
};

const initializeModel = async () => {
  if (!model) {
    await tf.ready();
    try {
      await tf.setBackend('webgl');
      const modelUrl = await getModelUrl();
      
      // Configure model loading to handle Firebase Storage URLs
      const modelLoadingOptions = {
        requestInit: {
          headers: {
            'Cache-Control': 'no-cache',
          },
        },
      };
      
      model = await tf.loadGraphModel(modelUrl, modelLoadingOptions);
      console.log('MobileNetV2 model loaded successfully');
    } catch (error) {
      console.error('Error loading model:', error);
      throw new Error('Failed to load AI model');
    }
  }
  return model;
};

const preprocessImage = async (tensor: tf.Tensor3D): Promise<tf.Tensor4D> => {
  try {
    // Resize the image to match the model's expected input size
    const resized = tf.image.resizeBilinear(tensor, [IMAGE_SIZE, IMAGE_SIZE]);
    
    // Normalize pixel values to [0, 1]
    const normalized = tf.div(resized, 255.0);
    
    // Add batch dimension and ensure type is Tensor4D
    const batched = tf.expandDims(normalized, 0) as tf.Tensor4D;
    
    // Clean up intermediate tensors
    resized.dispose();
    normalized.dispose();
    
    return batched;
  } catch (error) {
    console.error('Error preprocessing image:', error);
    throw error;
  }
};

const imageToTensor = async (imageUri: string): Promise<tf.Tensor3D> => {
  try {
    if (Platform.OS === 'web') {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const tensor = tf.browser.fromPixels(img);
          resolve(tensor);
        };
        img.onerror = reject;
        img.src = imageUri;
      });
    } else {
      const imageBase64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: 'base64',
      });

      const imageBuffer = Uint8Array.from(atob(imageBase64), c => c.charCodeAt(0));
      const rawImageData = decode(imageBuffer, { useTArray: true });

      const { width, height, data } = rawImageData;
      const buffer = new Uint8Array(width * height * 3);
      let offset = 0;

      for (let i = 0; i < data.length; i += 4) {
        buffer[offset++] = data[i];
        buffer[offset++] = data[i + 1];
        buffer[offset++] = data[i + 2];
      }

      return tf.tensor3d(buffer, [height, width, 3]);
    }
  } catch (error) {
    console.error('Error converting image to tensor:', error);
    throw error;
  }
};

const ANOMALY_CLASSES = [
  'Atelectasis',
  'Cardiomegaly',
  'Consolidation',
  'Edema',
  'Effusion',
  'Emphysema',
  'Fibrosis',
  'Hernia',
  'Infiltration',
  'Mass',
  'Nodule',
  'Pleural_Thickening',
  'Pneumonia',
  'Pneumothorax',
  'Normal'
] as const;

type AnomalyClass = typeof ANOMALY_CLASSES[number];

const LOCATIONS_MAP: Record<AnomalyClass, string[]> = {
  'Atelectasis': [
    'Lower lung zones',
    'Right middle lobe',
    'Left lower lobe'
  ],
  'Cardiomegaly': [
    'Cardiac silhouette',
    'Mediastinal contour'
  ],
  'Consolidation': [
    'Right lung field',
    'Left lung field',
    'Bilateral lung bases'
  ],
  'Edema': [
    'Bilateral perihilar regions',
    'Lower lung zones',
    'Peripheral lung fields'
  ],
  'Effusion': [
    'Right costophrenic angle',
    'Left costophrenic angle',
    'Bilateral pleural spaces'
  ],
  'Emphysema': [
    'Upper lung zones',
    'Bilateral lung fields',
    'Peripheral lung regions'
  ],
  'Fibrosis': [
    'Lower lung zones',
    'Peripheral lung fields',
    'Bilateral lung bases'
  ],
  'Hernia': [
    'Diaphragmatic contour',
    'Lower chest region'
  ],
  'Infiltration': [
    'Right lung field',
    'Left lung field',
    'Perihilar regions'
  ],
  'Mass': [
    'Right lung field',
    'Left lung field',
    'Hilar region'
  ],
  'Nodule': [
    'Upper lung zones',
    'Middle lung zones',
    'Lower lung zones'
  ],
  'Pleural_Thickening': [
    'Right pleural surface',
    'Left pleural surface',
    'Bilateral pleural spaces'
  ],
  'Pneumonia': [
    'Right lung field',
    'Left lung field',
    'Bilateral lung bases'
  ],
  'Pneumothorax': [
    'Right pleural space',
    'Left pleural space',
    'Apical region'
  ],
  'Normal': [
    'Clear lung fields',
    'Normal cardiac silhouette',
    'Clear costophrenic angles'
  ]
};

const DESCRIPTIONS_MAP: Record<AnomalyClass, string> = {
  'Atelectasis': 'Areas of collapsed or poorly ventilated lung tissue, potentially indicating underlying obstruction or compression.',
  'Cardiomegaly': 'Enlarged cardiac silhouette suggesting possible heart enlargement, requiring correlation with clinical findings.',
  'Consolidation': 'Dense opacity indicating airspace filling, typically associated with infection or inflammation.',
  'Edema': 'Increased interstitial markings and fluid accumulation suggesting pulmonary edema, requires assessment of cardiac function.',
  'Effusion': 'Fluid accumulation in pleural space affecting lung expansion and respiratory function.',
  'Emphysema': 'Increased lucency and altered lung architecture indicating airspace enlargement and tissue destruction.',
  'Fibrosis': 'Scarring and architectural distortion of lung tissue suggesting chronic inflammatory or fibrotic process.',
  'Hernia': 'Abnormal protrusion through the diaphragm, potentially affecting cardiopulmonary function.',
  'Infiltration': 'Patchy opacities suggesting inflammatory or infectious process with varied distribution.',
  'Mass': 'Well-defined opacity requiring further investigation to determine nature and malignancy potential.',
  'Nodule': 'Small rounded opacity requiring follow-up to assess stability and characteristics.',
  'Pleural_Thickening': 'Abnormal thickening of pleural surfaces suggesting chronic inflammatory or fibrotic changes.',
  'Pneumonia': 'Consolidative changes indicating active infection requiring appropriate antimicrobial therapy.',
  'Pneumothorax': 'Air in pleural space causing lung collapse, requires immediate evaluation of extent and intervention if necessary.',
  'Normal': 'No significant abnormalities detected. Lung fields are clear with normal cardiac silhouette and costophrenic angles.'
};

export const detectAnomalies = async (imageUri: string): Promise<DetectedAnomaly[]> => {
  try {
    await initializeModel();

    if (!model) {
      throw new Error('Model failed to initialize');
    }

    const imageTensor = await imageToTensor(imageUri);
    const preprocessedImage = await preprocessImage(imageTensor);
    
    // Run inference
    const logits = model.predict(preprocessedImage) as tf.Tensor;
    const probabilities = tf.softmax(logits);
    const probabilitiesData = await probabilities.data();

    // Clean up tensors
    imageTensor.dispose();
    preprocessedImage.dispose();
    logits.dispose();
    probabilities.dispose();

    // Get all predictions above threshold
    const CONFIDENCE_THRESHOLD = 0.5; // Adjust based on model performance
    const detectedConditions: Array<{ class: AnomalyClass; probability: number }> = [];
    
    for (let i = 0; i < probabilitiesData.length; i++) {
      if (probabilitiesData[i] >= CONFIDENCE_THRESHOLD) {
        detectedConditions.push({
          class: ANOMALY_CLASSES[i],
          probability: probabilitiesData[i]
        });
      }
    }

    // If no significant findings or only low confidence predictions
    if (detectedConditions.length === 0 || 
        (detectedConditions.length === 1 && detectedConditions[0].class === 'Normal')) {
      return [{
        type: 'Normal',
        location: LOCATIONS_MAP['Normal'][0],
        confidence: detectedConditions.length > 0 ? detectedConditions[0].probability : 0.95,
        description: DESCRIPTIONS_MAP['Normal']
      }];
    }

    // Sort detectedConditions by confidence
    const sortedConditions = detectedConditions.sort((a, b) => b.probability - a.probability);

    // Create anomalies for each detected condition
    const anomalies: DetectedAnomaly[] = [];
    
    for (const condition of sortedConditions) {
      if (condition.class === 'Normal') continue; // Skip Normal if other conditions are found
      
      const locations = LOCATIONS_MAP[condition.class];
      
      // Add findings for each relevant location
      locations.forEach((location: string, index: number) => {
        anomalies.push({
          type: condition.class,
          location: location,
          confidence: condition.probability * (1 - index * 0.1), // Slightly decrease confidence for secondary locations
          description: index === 0 ? 
            DESCRIPTIONS_MAP[condition.class] : 
            `Additional ${condition.class.toLowerCase()} findings in this region.`
        });
      });
    }

    return anomalies;
  } catch (error) {
    console.error('Error detecting anomalies:', error);
    throw new Error('Failed to analyze X-ray image. Please try again.');
  }
};

export const analyzeMedicalImage = async (detectedAnomalies: DetectedAnomaly[]): Promise<string> => {
  try {
    const modelInstance = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const anomaliesDescription = detectedAnomalies.map((anomaly, index) =>
      `${index + 1}. Type: ${anomaly.type}\n   Location: ${anomaly.location}\n   Confidence: ${(anomaly.confidence * 100).toFixed(1)}%\n   Description: ${anomaly.description}`
    ).join('\n\n');

    const prompt = `As a medical AI assistant, provide a detailed analysis of the following X-ray findings:

Detected Anomalies:
${anomaliesDescription}

Please provide:
1. A comprehensive interpretation of these findings
2. Possible differential diagnoses
3. Recommended follow-up actions or additional tests
4. Important considerations for the treating physician

Keep the response professional, clear, and structured for medical professionals.`;

    const result = await modelInstance.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error analyzing with Gemini:', error);
    throw new Error('Failed to generate AI analysis. Please try again.');
  }
};
