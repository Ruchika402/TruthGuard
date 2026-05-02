from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ml.predictor import TruthPredictor
from ml.utils import scrape_url, audio_to_text

# Initialize predictor globally
predictor = TruthPredictor()

class PredictTextView(APIView):
    def post(self, request):
        text = request.data.get('text', '')
        if not text:
            return Response({"error": "No text provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        result = predictor.predict(text)
        return Response(result)

class AnalyzeUrlView(APIView):
    def post(self, request):
        url = request.data.get('url', '')
        if not url:
            return Response({"error": "No URL provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        scraped_text = scrape_url(url)
        if not scraped_text:
            return Response({"error": "Failed to extract text from URL"}, status=status.HTTP_400_BAD_REQUEST)
            
        result = predictor.predict(scraped_text)
        
        # Add metadata specific to URL analysis
        trusted_domains = ['bbc.com', 'reuters.com', 'apnews.com', 'nytimes.com']
        result['domain_status'] = "Verified Source" if any(domain in url.lower() for domain in trusted_domains) else "Unverified Source"
        result['source_url'] = url
        
        return Response(result)

class PredictAudioView(APIView):
    def post(self, request):
        audio_file = request.FILES.get('audio')
        if not audio_file:
            return Response({"error": "No audio file provided"}, status=status.HTTP_400_BAD_REQUEST)
            
        extracted_text = audio_to_text(audio_file)
        result = predictor.predict(extracted_text)
        result['extracted_text'] = extracted_text
        return Response(result)
