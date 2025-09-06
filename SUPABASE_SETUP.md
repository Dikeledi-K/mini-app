# Supabase Setup for iS'khaftin Farcaster Mini App

This guide will help you set up Supabase database integration for the iS'khaftin app.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. A new Supabase project created

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `iskhaftin-app`
   - Database Password: (choose a strong password)
   - Region: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be created (usually takes 1-2 minutes)

## Step 2: Set Up Database Schema

1. In your Supabase dashboard, go to the "SQL Editor" tab
2. Click "New Query"
3. Copy and paste the contents of `scripts/setup_database.sql`
4. Click "Run" to execute the script
5. This will create all necessary tables, policies, and sample data

## Step 3: Get API Keys

1. In your Supabase dashboard, go to "Settings" → "API"
2. Copy the following values:
   - Project URL (looks like: `https://your-project-id.supabase.co`)
   - Anon/Public Key (starts with `eyJ...`)

## Step 4: Configure Environment Variables

1. Create a `.env.local` file in your project root
2. Add the following content:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Optional: For development redirects
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/dashboard
```

Replace the values with your actual Supabase project details.

## Step 5: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/discover`
3. You should see the sample campaigns loaded
4. Try creating a new campaign at `http://localhost:3000/create`

## Step 6: Configure Storage (Optional)

If you want to upload campaign images:

1. In Supabase dashboard, go to "Storage"
2. Create a new bucket called `campaign-images`
3. Set the bucket to public
4. The app will automatically use this bucket for image uploads

## Database Schema Overview

### Users Table
- Stores user profiles (wallet addresses, Farcaster info)
- Email is optional for Farcaster mini app users
- Wallet address is the primary identifier

### Campaigns Table
- Stores crowdfunding campaigns
- Creator ID is optional (can be null for anonymous campaigns)
- Tracks goal amount, current amount, status, etc.

### Donations Table
- Stores donation records
- Links to campaigns and donors
- Tracks transaction hashes and status

## Troubleshooting

### Common Issues

1. **"Failed to fetch campaigns" error**
   - Check that your environment variables are set correctly
   - Verify the database schema was created successfully
   - Check the browser console for specific error messages

2. **"Permission denied" errors**
   - Ensure the database policies were created correctly
   - Check that RLS (Row Level Security) is enabled

3. **Image upload issues**
   - Make sure the `campaign-images` bucket exists in Supabase Storage
   - Check that the bucket is set to public

### Getting Help

- Check the Supabase logs in the dashboard under "Logs"
- Use the browser developer tools to see network requests
- Verify your environment variables are loaded correctly

## Security Notes

- The current setup is optimized for a Farcaster mini app with minimal authentication
- All policies allow public access for viewing and creating content
- In production, you may want to add more restrictive policies
- Never commit your `.env.local` file to version control
