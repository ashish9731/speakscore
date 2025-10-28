#!/bin/bash

# Communication Assessment App Deployment Script

echo "Starting Communication Assessment App deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "Node.js is not installed. Please install Node.js and try again."
    exit 1
fi

echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"

# Install backend dependencies
echo "Installing backend dependencies..."
npm install

# Check if installation was successful
if [ $? -ne 0 ]; then
    echo "Failed to install backend dependencies."
    exit 1
fi

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd client
npm install

# Check if installation was successful
if [ $? -ne 0 ]; then
    echo "Failed to install frontend dependencies."
    exit 1
fi

cd ..

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    echo "PORT=5000" > .env
    echo "GOOGLE_APPLICATION_CREDENTIALS=./config/google-credentials.json" >> .env
    echo "OPENAI_API_KEY=your_openai_api_key_here" >> .env
    echo "JWT_SECRET=communication_assessment_secret_key" >> .env
    echo "CORS_ORIGIN=http://localhost:3000" >> .env
fi

echo "Building frontend..."
cd client
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "Failed to build frontend."
    exit 1
fi

cd ..

echo "Deployment completed successfully!"
echo ""
echo "To start the application, run:"
echo "npm start"
echo ""
echo "Then open your browser to http://localhost:5000"
echo ""
echo "Note: You will need to:"
echo "1. Set up Google Cloud credentials for TTS"
echo "2. Add your OpenAI API key to the .env file"