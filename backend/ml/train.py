import pandas as pd
import joblib
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

# Expanded sample dataset for better baseline performance
data = {
    'text': [
        "Breaking: Aliens land in New York City park and starts dancing", 
        "Government announces new tax plan for the fiscal year 2024",
        "Shocking! Drink this magic water to live for 200 years!",
        "Local library to host summer reading program for children",
        "Unbelievable: Scientist discovers pure gold mountains on the moon",
        "Study shows balanced diet improves heart health significantly",
        "Miracle cure for all cancers found in common backyard weed",
        "City council approves budget for new public transportation line",
        "NASA rover finds evidence of ancient water on Mars surface",
        "You won't believe what this celebrity did to lose 50 pounds in 2 days",
        "The President signed the executive order on environmental protection",
        "Secret society controls the weather using giant hidden mirrors"
    ],
    'label': [1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1] # 1: Fake, 0: Real
}

def train_model():
    print("Initiating model training...")
    df = pd.DataFrame(data)
    
    # ML Pipeline: TF-IDF + Logistic Regression
    # We use a simple pipeline that converts text to numbers then classifies
    model_pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(stop_words='english', ngram_range=(1, 2))),
        ('clf', LogisticRegression(C=1.0))
    ])
    
    model_pipeline.fit(df['text'], df['label'])
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(__file__), exist_ok=True)
    
    # Save the model
    model_path = os.path.join(os.path.dirname(__file__), 'model_pipeline.pkl')
    joblib.dump(model_pipeline, model_path)
    print(f"Model trained and saved successfully at {model_path}")

if __name__ == "__main__":
    train_model()
