# Speech Implementation Options

This application supports two options for natural voice generation in conversational mode:

## Option 1: Eleven Labs API (Recommended for Production)

Eleven Labs provides high-quality, natural-sounding voices that greatly enhance the user experience.

### Setup:

1. Sign up for an account at [Eleven Labs](https://elevenlabs.io/)
2. Get your API key from the profile settings
3. Add your API key to the `.env` file:

```
ELEVEN_LABS_API_KEY=your_actual_eleven_labs_api_key_here
```

### Features:
- High-quality, natural-sounding voices
- Multiple voice options
- Customizable voice parameters
- Low latency streaming

### Voice Used:
- Voice ID: `21m00Tcm4TlvDq8ikWAM` (Rachel - a clear, expressive voice)
- Model: `eleven_monolingual_v1`

## Option 2: Web Speech API (Free Alternative)

The Web Speech API is built into most modern browsers and provides a free alternative to commercial APIs.

### Setup:
No additional setup required - works out of the box with modern browsers.

### Features:
- Free to use
- No API key required
- Wide browser support
- Decent voice quality

### Limitations:
- Voice quality varies by browser
- Limited voice selection
- Less natural sounding than Eleven Labs
- No customization options

## How It Works

The application automatically uses Eleven Labs if an API key is provided in the `.env` file. If no API key is present, it falls back to the Web Speech API.

This dual approach allows you to:
1. Use the high-quality Eleven Labs voices in production
2. Test and develop using the free Web Speech API
3. Switch between options without code changes

## Configuration Examples

### Using Eleven Labs (Production):
```env
# .env file
OPENAI_API_KEY=your_openai_api_key_here
ELEVEN_LABS_API_KEY=your_eleven_labs_api_key_here
```

### Using Web Speech API (Development/Free):
```env
# .env file
OPENAI_API_KEY=your_openai_api_key_here
# ELEVEN_LABS_API_KEY is not set
```

## Browser Support

### Eleven Labs:
- Works in all modern browsers that support the Fetch API

### Web Speech API:
- Google Chrome 33+
- Microsoft Edge 14+
- Firefox 49+ (with `media.webspeech.synth.enabled` enabled in about:config)
- Safari 7+ (limited support)

## Troubleshooting

### No Audio in Conversational Mode:
1. Check if your browser supports the selected speech API
2. Verify API keys are correctly set in `.env`
3. Check browser console for error messages
4. Ensure microphone permissions are granted

### Poor Voice Quality with Web Speech API:
1. Try a different browser (Chrome generally has the best Web Speech API implementation)
2. Check if your system has high-quality voices installed
3. Some operating systems allow you to install additional voices

### Rate Limiting with Eleven Labs:
1. Check your Eleven Labs account for usage limits
2. Consider upgrading your Eleven Labs plan for higher limits
3. The application will automatically fall back to Web Speech API if Eleven Labs returns an error