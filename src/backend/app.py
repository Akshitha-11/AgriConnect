from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from PIL import Image
import numpy as np
import io
import os

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "OPTIONS"]}})
print("Loading model...")
try:
    model = tf.keras.models.load_model('fruit_grade_model.keras')
    print("Model loaded successfully")
except Exception as e:
    print(f"Error loading model: {str(e)}")
    raise

def preprocess_image(image):
    print("\n=== Image Preprocessing ===")
    try:
        if image.mode != 'RGB':
            print(f"Converting image from {image.mode} to RGB")
            image = image.convert('RGB')
        
        # Resize 
        print(f"Original image size: {image.size}")
        image = image.resize((224, 224))
        print(f"Resized image size: {image.size}")
    
        img_array = np.array(image)
        print(f"Image array shape: {img_array.shape}")
        print(f"Image array dtype: {img_array.dtype}")
        print(f"Image array min/max: {np.min(img_array)}, {np.max(img_array)}")
        
        img_array = img_array.astype(np.float32)
        img_array = (img_array - np.min(img_array)) / (np.max(img_array) - np.min(img_array))
        print(f"After contrast enhancement - min/max: {np.min(img_array)}, {np.max(img_array)}")
        
        # Normalize pixel values
        img_array = img_array / 255.0
        print(f"After normalization - min/max: {np.min(img_array)}, {np.max(img_array)}")
        
        img_array = np.expand_dims(img_array, axis=0)
        print(f"Final preprocessed image shape: {img_array.shape}")
        return img_array
    except Exception as e:
        print(f"Error in preprocessing: {str(e)}")
        raise

@app.route('/api/grade-quality', methods=['POST', 'OPTIONS'])
def grade_quality():
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        print("\n=== New Request ===")
        print(f"Request headers: {dict(request.headers)}")
        print(f"Request form data: {request.form}")
        print(f"Request files: {request.files}")
        
        if 'image' not in request.files:
            print("No image provided in request")
            return jsonify({'error': 'No image provided'}), 400

        image_file = request.files['image']
        print(f"Image file received: {image_file.filename}")
        
        if not image_file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            print("Invalid file type")
            return jsonify({'error': 'Invalid file type. Please upload a PNG, JPG, or JPEG image.'}), 400

        try:
            image_data = image_file.read()
            if not image_data:
                return jsonify({'error': 'Empty image file'}), 400
                
            image = Image.open(io.BytesIO(image_data))
            print(f"Image opened successfully. Size: {image.size}, Mode: {image.mode}")
        except Exception as e:
            print(f"Error opening image: {str(e)}")
            return jsonify({'error': 'Invalid image file'}), 400

        try:
            processed_image = preprocess_image(image)
        except Exception as e:
            print(f"Error in preprocessing: {str(e)}")
            return jsonify({'error': 'Error processing image'}), 500

        print("\n=== Model Prediction ===")
        try:
            prediction = model.predict(processed_image, verbose=1)
            print(f"Raw prediction output: {prediction}")
            print(f"Prediction shape: {prediction.shape}")
        except Exception as e:
            print(f"Error in model prediction: {str(e)}")
            return jsonify({'error': 'Error in quality assessment'}), 500

        if len(prediction[0]) != 3:
            print(f"Unexpected prediction shape: {prediction.shape}")
            return jsonify({'error': 'Model output format error'}), 500
            
        class_names = ['A', 'B', 'C']
        predicted_index = np.argmax(prediction[0])
        grade = class_names[predicted_index]
        confidence_score = float(np.max(prediction[0]))
        print(f"\n=== Prediction Results ===")
        print(f"Predicted class: {grade}")
        print(f"Confidence score: {confidence_score}")
        print(f"All class probabilities: {prediction[0].tolist()}")

        #label-mapping
        grade_mapping = {
            "A": "Grade A - Premium Quality",
            "B": "Grade B - Good Quality",
            "C": "Grade C - Average or Poor Quality"
        }

        result = {
            'predicted_class': grade_mapping[grade],
            'confidence': f"{confidence_score*100:.2f}%",
            'raw_probabilities': prediction[0].tolist(),
            'debug_info': {
                'image_size': image.size,
                'image_mode': image.mode,
                'preprocessed_shape': processed_image.shape,
                'all_class_probabilities': prediction[0].tolist()
            }
        }
        print(f"\n=== Final Response ===")
        print(f"Returning result: {result}")
        return jsonify(result)

    except Exception as e:
        print(f"Error occurred: {str(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        return jsonify({
            'error': 'Failed to process image',
            'details': str(e)
        }), 500

if __name__ == '__main__':
    print("Starting Flask server...")
    # Run on all available network interfaces with debug mode
    app.run(host='0.0.0.0', port=5000, debug=True, threaded=True) 
