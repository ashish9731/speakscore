#!/bin/bash

# Communication Assessment App Startup Script

echo "Starting Communication Assessment App..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Warning: .env file not found. Using default configuration."
    echo "PORT=5000" > .env
    echo "GOOGLE_APPLICATION_CREDENTIALS=./config/google-credentials.json" >> .env
    echo "OPENAI_API_KEY=your_openai_api_key_here" >> .env
    echo "JWT_SECRET=communication_assessment_secret_key" >> .env
    echo "CORS_ORIGIN=http://localhost:3000" >> .env
fi

# Start the application
echo "Starting server on port 5000..."
node server.js