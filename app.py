from flask import Flask, render_template, request, jsonify
import joblib
from nltk.corpus import stopwords
import nltk
nltk.download('stopwords')
import re

app = Flask(__name__)

# Load the trained model
model = joblib.load('spam_classifier_model.pkl')

# Preprocessing function for text
def preprocess_text(text):
    # Normalize text: lower case and remove punctuation
    text = text.lower()
    text = re.sub(r'[\W_]+', ' ', text)
    
    # Remove stop words
    stop_words = set(stopwords.words('english'))
    words = text.split()
    words = [word for word in words if word not in stop_words]
    return ' '.join(words)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    # Get input message from the form
    message = request.form['message']

    # Preprocess the input message
    preprocessed_message = preprocess_text(message)

    # Predict with the loaded model
    prediction = model.predict([preprocessed_message])[0]

    # Convert prediction to string ('Spam' or 'Not Spam')
    prediction_label = 'Spam' if prediction == 1 else 'Not Spam'

    return jsonify({'prediction': prediction_label})

if __name__ == '__main__':
    app.run(debug=True)
