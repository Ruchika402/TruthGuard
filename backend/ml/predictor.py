import joblib
import os

class TruthPredictor:
    def __init__(self):
        self.model_path = os.path.join(os.path.dirname(__file__), 'model_pipeline.pkl')
        self.model = self._load_model()

    def _load_model(self):
        if os.path.exists(self.model_path):
            return joblib.load(self.model_path)
        return None

    def predict(self, text):
        if not text:
            return {"error": "No text provided for analysis"}
            
        if not self.model:
            return {
                "error": "Model not trained. Please run backend/ml/train.py",
                "prediction": "Unknown",
                "confidence": 0,
                "explanation": ["Model file missing"]
            }
        
        # Get confidence probabilities
        prob = self.model.predict_proba([text])[0]
        prediction_idx = self.model.predict([text])[0]
        
        confidence = round(max(prob) * 100, 2)
        fake_score = round(prob[1] * 100, 2)
        
        prediction = "Fake" if prediction_idx == 1 else "Real"
        
        return {
            "prediction": prediction,
            "confidence": confidence,
            "fake_score": fake_score,
            "explanation": self.get_explanation(text, prediction)
        }

    def get_explanation(self, text, prediction):
        explanations = []
        text_lower = text.lower()
        
        # Heuristic rules
        clickbait_words = ['shocking', 'unbelievable', 'magic', 'miracle', 'never seen before', 'secret', 'exposed']
        if any(word in text_lower for word in clickbait_words):
            explanations.append("Contains sensationalist or clickbait terminology.")
        
        if len(text.split()) < 20:
             explanations.append("Content is suspiciously short for a news report.")
             
        if "!" in text and prediction == "Fake":
            explanations.append("Excessive use of exclamation marks is common in misleading content.")
            
        if not explanations:
            explanations.append("Analysis based on linguistic patterns and historical data traits.")
            
        return explanations
