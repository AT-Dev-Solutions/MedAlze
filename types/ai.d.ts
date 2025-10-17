declare module '@google/generative-ai' {
  export class GoogleGenerativeAI {
    constructor(apiKey: string);
    getGenerativeModel(config: { model: string }): GenerativeModel;
  }

  export interface GenerativeModel {
    generateContent(prompt: string): Promise<GenerateContentResponse>;
  }

  export interface GenerateContentResponse {
    response: {
      text(): string;
    };
  }
}

declare module '@tensorflow-models/mobilenet' {
  export interface ModelPrediction {
    className: string;
    probability: number;
  }

  export interface MobileNet {
    classify(img: HTMLImageElement | ImageData | any): Promise<ModelPrediction[]>;
  }

  export function load(): Promise<MobileNet>;
}