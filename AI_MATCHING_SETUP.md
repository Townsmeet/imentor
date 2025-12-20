# AI Mentor Matching Feature - Setup Guide

## Overview
This feature uses OpenRouter to provide AI-powered mentor matching through conversational interface.

## Setup Steps

### 1. Get OpenRouter API Key
1. Visit https://openrouter.ai/
2. Sign up for a free account
3. Go to Keys section and create a new API key
4. Copy the API key

### 2. Configure Environment Variables
Add to your `.env` file:
```bash
NUXT_OPENROUTER_API_KEY=your-openrouter-api-key-here
```

### 3. Apply Database Migration
Run the following command to create the AI matching tables:
```bash
pnpm db:push
```

This will create:
- `ai_matching_session` - Stores conversation sessions
- `ai_match_result` - Stores mentor recommendations
- `ai_match_feedback` - Stores user feedback on matches

### 4. Install Dependencies
The OpenAI SDK is already installed. If needed:
```bash
pnpm add openai
```

## Free Models for Testing

The implementation uses free models by default:
- **Chat**: `meta-llama/llama-3.2-3b-instruct:free`

Alternative free models available:
- `google/gemini-2.0-flash-exp:free`
- `qwen/qwen-2.5-7b-instruct:free`
- `microsoft/phi-3-mini-128k-instruct:free`

## Switching to Premium Models

To use premium models for better quality, update `/server/utils/openrouter.ts`:

```typescript
// Change FREE_MODELS.CHAT to PREMIUM_MODELS.CHAT in API endpoints
// Or set environment variable:
NUXT_AI_MODEL=anthropic/claude-3.5-sonnet
```

Premium model recommendations:
- **Best quality**: `anthropic/claude-3.5-sonnet` (~$3/1M tokens)
- **Fast & cheap**: `anthropic/claude-3-haiku` (~$0.25/1M tokens)
- **Balanced**: `openai/gpt-4o-mini` (~$0.15/1M tokens)

## How It Works

### 1. User Flow
1. User clicks "Find with AI" button on mentors page
2. AI chat modal opens with greeting
3. AI asks 3-4 questions about goals, skills, budget, etc.
4. User responds naturally in conversation
5. AI extracts preferences and generates matches
6. Top 5 mentors displayed with match scores and reasoning

### 2. Backend Process
1. **Session Creation** (`/api/ai/match/start.post.ts`)
   - Creates new session in database
   - Generates AI greeting

2. **Message Handling** (`/api/ai/match/message.post.ts`)
   - Processes user messages
   - Maintains conversation history
   - Determines when to show "Find Matches" button

3. **Recommendation** (`/api/ai/match/recommend.post.ts`)
   - Extracts structured preferences from conversation
   - Queries available mentors from database
   - Uses AI to score and rank mentors
   - Stores results with reasoning

### 3. Components
- `AIMentorMatcher.vue` - Chat interface modal
- `AIMatchResults.vue` - Display recommended mentors
- Integration in `/pages/mentors/index.vue`

## Cost Estimates

### Free Models (Testing)
- **Cost**: $0
- **Limits**: Rate limited, may have queues
- **Quality**: Good for testing, acceptable for MVP

### Premium Models (Production)
Per 1000 AI matches:
- Conversations: $10-30
- Scoring: $5-15
- **Total**: ~$15-45/month for 1000 matches

## Monitoring & Optimization

### Track Performance
- Monitor API costs in OpenRouter dashboard
- Check `ai_matching_session` table for completion rates
- Review `ai_match_feedback` for user satisfaction

### Optimization Tips
1. Cache mentor embeddings (future enhancement)
2. Use cheaper models for simple tasks
3. Implement request throttling
4. Add conversation length limits

## Future Enhancements

1. **Embeddings-based matching**
   - Pre-compute mentor embeddings
   - Use vector similarity for faster matching
   - Reduce AI API calls

2. **Learning from feedback**
   - Track which recommendations users select
   - Improve matching algorithm over time
   - Personalize based on user history

3. **Advanced features**
   - Personality matching
   - Success prediction
   - Multi-language support
   - Voice input

## Troubleshooting

### "AI service error"
- Check OpenRouter API key is set correctly
- Verify API key has credits (free tier)
- Check OpenRouter status page

### "No mentors found"
- Ensure mentors exist in database
- Check budget range isn't too restrictive
- Verify mentor profiles are complete

### Slow responses
- Free models may have queues
- Consider upgrading to premium models
- Check network connectivity

## Testing

1. **Manual Testing**:
   ```bash
   pnpm dev
   # Navigate to /mentors
   # Click "Find with AI"
   # Have a conversation
   ```

2. **Test Conversation**:
   - "I want to learn web development"
   - "I'm a beginner with some HTML knowledge"
   - "My budget is around $50-100 per hour"
   - Click "Find My Perfect Mentors"

3. **Verify**:
   - Check database for session records
   - Verify matches are displayed
   - Test clicking on mentor cards

## Support

For issues or questions:
- Check OpenRouter docs: https://openrouter.ai/docs
- Review server logs for errors
- Check browser console for frontend issues
