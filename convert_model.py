import tensorflow as tf
import tensorflowjs as tfjs

# Load the model
model = tf.keras.models.load_model('assets/models/mobilenetv2_finetune_best.h5', compile=False)

# Convert and save the model
tfjs.converters.save_keras_model(model, 'converted_model')