# Deploying to Vercel

## Quick Deploy

1. **Install Vercel CLI** (if not already installed):
```powershell
npm install -g vercel
```

2. **Login to Vercel**:
```powershell
vercel login
```

3. **Deploy**:
```powershell
vercel
```

For production deployment:
```powershell
vercel --prod
```

## Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository (GitHub, GitLab, or Bitbucket)
4. Vercel will auto-detect settings
5. Click "Deploy"

## Important Notes

### Session Storage Limitation
⚠️ **Warning**: The current implementation uses in-memory storage which means:
- Sessions and leaderboard data will **reset** when the serverless function restarts
- Data is **not persistent** across deployments
- Multiple serverless instances won't share data

### For Production Use - Add Persistent Storage

To make the app production-ready with persistent data, you should integrate one of these:

#### Option 1: Vercel KV (Recommended)
```powershell
# Install Vercel KV
npm install @vercel/kv
```

Then update `api/storage.js` to use Vercel KV instead of in-memory Maps.

#### Option 2: Redis (Upstash)
```powershell
npm install @upstash/redis
```

#### Option 3: Database (MongoDB, PostgreSQL, etc.)

### Environment Variables
If using external storage, add environment variables in Vercel dashboard:
1. Go to Project Settings
2. Navigate to Environment Variables
3. Add your database/KV credentials

## Vercel Configuration

The `vercel.json` file is configured to:
- Serve static files from `/public` directory
- Route API calls to `/api` serverless functions
- Handle dynamic routes for sessions

## Testing Locally with Vercel

```powershell
# Install dependencies
npm install

# Run with Vercel dev server
vercel dev
```

This will run the app locally using Vercel's runtime environment.

## Post-Deployment

After deployment, Vercel will provide you with a URL like:
```
https://your-project-name.vercel.app
```

Your quiz will be live and accessible at this URL!

## Custom Domain

To add a custom domain:
1. Go to Project Settings in Vercel
2. Navigate to Domains
3. Add your domain
4. Update DNS records as instructed

## Troubleshooting

### API Routes Not Working
- Check `vercel.json` configuration
- Ensure API files are in `/api` directory
- Check Vercel function logs in dashboard

### Sessions Not Persisting
- This is expected with in-memory storage
- Implement Vercel KV or external database for persistence

### CORS Errors
- CORS headers are already configured in API routes
- If issues persist, check browser console for specific errors
