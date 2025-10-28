# Setup Guide: Communication Assessment Interview Bot

## Prerequisites

Before setting up the application, ensure you have the following installed:

1. **Node.js** (Version 14 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (Usually comes with Node.js)
   - Verify installation: `npm --version`

3. **Git** (Optional, for version control)
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

4. **OpenAI API Key**
   - Sign up at: https://platform.openai.com/
   - Generate an API key from the dashboard

## Installation Steps

### 1. Clone or Download the Repository

```bash
# Using Git
git clone https://github.com/ashish9731/speakscore.git
cd speakscore

# Or download the ZIP file and extract it
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5001

# OpenAI API Key (required)
OPENAI_API_KEY=your_openai_api_key_here

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

Replace `your_openai_api_key_here` with your actual OpenAI API key.

### 3. Install Backend Dependencies

From the root directory:

```bash
npm install
```

### 4. Install Frontend Dependencies

```bash
cd client
npm install
cd ..
```

### 5. Verify Installation

Check that all dependencies are installed:

```bash
# In root directory
npm list

# In client directory
cd client
npm list
cd ..
```

## Running the Application

### Development Mode

#### Option 1: Separate Terminals (Recommended)

**Terminal 1 - Backend Server:**
```bash
npm start
```

**Terminal 2 - Frontend Development Server:**
```bash
cd client
npm start
```

#### Option 2: Using Concurrently

From the root directory:
```bash
npm run dev:full
```

### Production Mode

#### 1. Build the Frontend

```bash
cd client
npm run build
cd ..
```

#### 2. Start the Server

```bash
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

## Testing the Setup

### 1. Check Server Status

Open a browser and navigate to:
```
http://localhost:5001
```

You should see a message or the server response.

### 2. Check Frontend

Open a browser and navigate to:
```
http://localhost:3000
```

You should see the beautiful home page.

### 3. Test WebSocket Connection

1. Open the browser's developer tools (F12)
2. Go to the Console tab
3. Look for connection messages:
   - "Connected to server"
   - "Authenticated"

### 4. Test Microphone Access

1. Click "Begin Your Assessment Now"
2. Select an assessment mode
3. Click "Start Speaking"
4. Grant microphone permissions when prompted
5. Speak and check if recording works

## Common Setup Issues and Solutions

### 1. Port Already in Use

**Error**: `Error: listen EADDRINUSE: address already in use :::5001`

**Solution**:
1. Kill the process using the port:
   ```bash
   lsof -ti:5001 | xargs kill -9
   ```
2. Or change the port in `.env` file:
   ```env
   PORT=5002
   ```

### 2. Missing Dependencies

**Error**: Module not found errors

**Solution**:
1. Install missing packages:
   ```bash
   npm install package-name
   ```
2. Or reinstall all dependencies:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### 3. Environment Variables Not Loading

**Issue**: API keys not working

**Solution**:
1. Verify `.env` file is in the root directory
2. Check that variables are correctly formatted
3. Restart the server after changes

### 4. Frontend Build Failures

**Error**: Build errors or warnings

**Solution**:
1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```
2. Delete node_modules and reinstall:
   ```bash
   cd client
   rm -rf node_modules package-lock.json
   npm install
   ```

### 5. WebSocket Connection Failures

**Issue**: "Disconnected" status

**Solution**:
1. Check that backend server is running
2. Verify the port in AssessmentPage.js matches server port
3. Check browser console for specific error messages
4. Ensure CORS is properly configured

## Configuration Options

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| PORT | Server port | 5001 | No |
| OPENAI_API_KEY | OpenAI API key | None | Yes |
| CORS_ORIGIN | Allowed origins | http://localhost:3000 | No |

### Customization Options

1. **Change Server Port**:
   - Modify `PORT` in `.env`
   - Update WebSocket connection URL in [client/src/pages/AssessmentPage.js](file:///Users/ashishtiwari/Communication%20Assessment%20App/client/src/pages/AssessmentPage.js)

2. **Modify Assessment Topics**:
   - Edit conversationService.js
   - Add new topics to conversational flow

3. **Adjust Scoring Algorithm**:
   - Modify scoringService.js
   - Tune weights for different criteria

4. **Change UI Colors**:
   - Edit CSS files in client/src/
   - Modify gradient colors in HomePage.css

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Hosting Platforms

1. **Netlify**:
   - Build command: `cd client && npm run build`
   - Publish directory: `client/build`

2. **Heroku**:
   - Add buildpacks for Node.js
   - Set environment variables in dashboard

3. **Traditional Hosting**:
   - Build the frontend: `cd client && npm run build`
   - Upload build folder and server files
   - Configure web server to serve static files

## Maintenance

### Updating Dependencies

```bash
# Check for outdated packages
npm outdated

# Update packages
npm update

# For major version updates
npm install package@latest
```

### Monitoring

1. **Server Logs**:
   - Check terminal output for errors
   - Monitor connection status

2. **Frontend Logs**:
   - Browser console for JavaScript errors
   - Network tab for API calls

3. **Performance**:
   - Monitor response times
   - Check for memory leaks

## Backup and Recovery

### Backup Strategy

1. **Code Backup**:
   - Use Git for version control
   - Push to remote repository regularly

2. **Environment Configuration**:
   - Keep `.env` file secure
   - Document environment variables

### Recovery Process

1. **Code Recovery**:
   ```bash
   git clone repository-url
   npm install
   cd client
   npm install
   ```

2. **Configuration Recovery**:
   - Restore `.env` file
   - Reconfigure environment variables

## Security Considerations

### API Key Security

1. **Never commit API keys** to version control
2. **Use environment variables** for sensitive data
3. **Rotate keys** regularly
4. **Monitor usage** in OpenAI dashboard

### Data Privacy

1. **No permanent storage** of audio recordings
2. **Temporary processing** only
3. **Secure WebSocket connections**
4. **CORS protection** for API endpoints

## Support Resources

### Documentation
- [User Guide](USER_GUIDE.md)
- [Final Fixes Summary](FINAL_FIXES_SUMMARY.md)
- API Documentation (if available)

### Community Support
- GitHub Issues: https://github.com/ashish9731/speakscore/issues
- Stack Overflow (tag your questions appropriately)

### Professional Support
- Contact the development team
- Commercial support options (if available)

## Next Steps

After successful setup:

1. **Test all features** thoroughly
2. **Customize for your needs**
3. **Train users** with the User Guide
4. **Monitor performance** and usage
5. **Plan for updates** and maintenance

Congratulations! You've successfully set up the Communication Assessment Interview Bot. The application is now ready for use and provides a complete speech assessment solution with both conversational and single speaker modes.