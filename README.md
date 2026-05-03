# TruthGuard 360

TruthGuard 360 is a modern, full-stack application designed to detect and flag fake news or misleading content. It uses a Machine Learning pipeline (TF-IDF + Logistic Regression) for text analysis, provides URL scraping capabilities, and includes a UI for audio/image metadata verification.

## Features
- **Raw Text Analysis**: Deep linguistic pattern analysis for pasted content.
- **URL Analysis**: Automatically scrapes news articles and checks source credibility.
- **Audio Verification**: Placeholder logic for analyzing transcribed audio clips.
- **Visual Feedback**: Real-time confidence scores and "Misinfo Score" indicators.
- **Explainability**: Identifies specific triggers (clickbait, sensationalism) used in the analysis.

## Prerequisites
- Python 3.8+
- Node.js 16+
- npm (Node Package Manager)

## Installation

### 1. Backend Setup
Navigate to the `backend` directory:
    cd backend

Install dependencies:
    pip install -r requirements.txt

Train the Machine Learning model:
    python ml/train.py

Run migrations:
    python manage.py migrate

Start the Django server:
    python manage.py runserver

### 2. Frontend Setup
In a new terminal, navigate to the `frontend` directory:
    cd frontend

Install dependencies:
    npm install

Start the development server:
    npm start

## How to Use
1. Open [http://localhost:3000](http://localhost:3000) in your browser.
2. Choose your input type: **Raw Text**, **News URL**, or **Audio Clip**.
3. Enter the content you wish to verify.
    - *Example (Fake):* "Shocking! Secret miracle water cures everything instantly!"
    - *Example (Real):* "NASA rover finds evidence of ancient water on Mars surface"
4. Click **Perform Verification** to see the results.

## Project Structure
- `backend/api/`: Django app handling requests and communication with the ML layer.
- `backend/ml/`: Machine learning logic, including training scripts and the predictor.
- `frontend/src/`: React application with Tailwind CSS styling and frontend components.

## Troubleshooting
- **CORS Errors**: If the frontend cannot reach the backend, ensure `CORS_ALLOW_ALL_ORIGINS` is set to `True` in `backend/truthguard/settings.py`.
- **Model Missing**: If you get a "Model not trained" error, make sure you ran `python ml/train.py` inside the backend directory.
- **Port Conflict**: If port 8000 (Django) or 3000 (React) is busy, the apps might not start. Make sure no other services are running on those ports.

- ##Live Demo
- https://truthguard-frontend.onrender.com
