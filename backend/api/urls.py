from django.urls import path
from .views import PredictTextView, AnalyzeUrlView, PredictAudioView

urlpatterns = [
    path('predict-text/', PredictTextView.as_view(), name='predict-text'),
    path('analyze-url/', AnalyzeUrlView.as_view(), name='analyze-url'),
    path('predict-audio/', PredictAudioView.as_view(), name='predict-audio'),
]
