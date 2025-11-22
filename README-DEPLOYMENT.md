# 🚀 Deployment Guide - Sinsajo Creators Landing Page

## 📋 Prerequisites

Before deploying to production, ensure you have:

1. ✅ GitHub repository created
2. ✅ Vercel account connected to GitHub
3. ✅ Supabase project created
4. ✅ OpenAI API key
5. ✅ Web3Forms access key

---

## 🔐 Environment Variables Setup

### Required Environment Variables

Add these to your Vercel project settings under **Settings → Environment Variables**:

```bash
# OpenAI API Key for Hanna AI Agent
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Web3Forms Email Integration
WEB3FORMS_KEY=4f88d91a-eb37-4f27-b034-0f31161d286c

# Next.js Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app

# Google Analytics (optional)
NEXT_PUBLIC_GA_ID=your_ga_id_here
```

---

## 📧 Web3Forms Email Configuration

### How it works:

When a user submits the contact form:
1. Lead data is validated with Zod schema
2. Email is sent to `sales@sinsajocreators.com` via Web3Forms API
3. Lead is saved to Supabase database
4. User receives success confirmation

### Email Template:

```
NUEVO LEAD - Sinsajo Creators

Nombre: [User Name]
Email: [User Email]
Empresa: [Company]
Teléfono: [Phone]
Desafío: [Challenge Description]

Fecha: [Timestamp]
```

### Setup Steps:

1. **Get Web3Forms Access Key** (already done ✅)
   - Visit: https://web3forms.com
   - Sign up and verify email
   - Copy your access key: `4f88d91a-eb37-4f27-b034-0f31161d286c`

2. **Add to Vercel Environment Variables**
   - Go to: https://vercel.com/dashboard
   - Select your project
   - Settings → Environment Variables
   - Add: `WEB3FORMS_KEY` = `4f88d91a-eb37-4f27-b034-0f31161d286c`
   - Apply to: Production, Preview, Development

3. **Verify Email Delivery**
   - After deployment, submit a test lead
   - Check `sales@sinsajocreators.com` inbox
   - Also check Supabase database table `leads`

---

## 🗄️ Supabase Database Setup

### Create `leads` table:

```sql
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  phone TEXT NOT NULL,
  challenge TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (optional)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policy for service role (API can insert)
CREATE POLICY "Allow service role insert"
ON leads
FOR INSERT
TO service_role
WITH CHECK (true);
```

### Get Supabase Credentials:

1. Go to: https://supabase.com/dashboard/project/_/settings/api
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon/Public Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🤖 OpenAI API Setup

### Get OpenAI API Key:

1. Visit: https://platform.openai.com/api-keys
2. Create new secret key
3. Copy and add to Vercel: `OPENAI_API_KEY`

### Hanna AI Configuration:

- Model: `gpt-4-turbo-preview`
- Temperature: `0.7`
- Max Tokens: `500`
- System Prompt: Configured in `/app/api/chat/route.ts`

---

## 📱 Contact Information

Verify these details are correct in the codebase:

- **Email**: sales@sinsajocreators.com
- **Phone**: +1 (609) 288-5466
- **WhatsApp**: https://wa.me/16092885466
- **Location**: Iowa, United States

### Files to check:

- [components/layout/Footer.tsx](components/layout/Footer.tsx:69-86)
- [components/chat/ChatWidget.tsx](components/chat/ChatWidget.tsx:202-217)
- [app/api/chat/route.ts](app/api/chat/route.ts:20-23)

---

## 🚀 Deployment Steps

### Option 1: Deploy via Vercel Dashboard

1. Go to: https://vercel.com/new
2. Import GitHub repository: `sinsajocreatorsia/landingpagesinsajo`
3. Configure environment variables (see above)
4. Click **Deploy**

### Option 2: Deploy via Git Push (Automatic)

```bash
# Push to main branch triggers automatic deployment
git push origin main
```

### Option 3: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

---

## ✅ Post-Deployment Checklist

After deployment, verify:

- [ ] Website loads at production URL
- [ ] Header logo displays correctly
- [ ] Hero section shows "We Make Your Brand Fly" slogan
- [ ] AI Robot is draggable and visible on right side
- [ ] Hanna ChatWidget is draggable and positioned bottom-right
- [ ] ChatWidget has online indicator (green dot)
- [ ] Contact form submits successfully
- [ ] Email arrives at `sales@sinsajocreators.com`
- [ ] Lead is saved in Supabase `leads` table
- [ ] Hanna AI chat responds correctly
- [ ] WhatsApp and Email buttons work in chat
- [ ] All animations work smoothly
- [ ] Mobile responsive design works

---

## 🐛 Troubleshooting

### Email not sending?

- Verify `WEB3FORMS_KEY` is set in Vercel environment variables
- Check Vercel deployment logs for errors
- Test Web3Forms API key at: https://web3forms.com/test

### Hanna AI not responding?

- Verify `OPENAI_API_KEY` is set in Vercel
- Check OpenAI API usage limits
- Review Vercel function logs

### Leads not saving to Supabase?

- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Check Supabase table `leads` exists
- Review Supabase RLS policies

### Build failures?

- Check Vercel deployment logs
- Verify all dependencies in `package.json`
- Ensure TypeScript errors are resolved

---

## 📊 Monitoring

### Vercel Analytics

- View at: https://vercel.com/dashboard/analytics
- Monitor: Page views, response times, errors

### Supabase Dashboard

- View at: https://supabase.com/dashboard
- Monitor: Database queries, API requests

### Web3Forms Dashboard

- View at: https://web3forms.com/dashboard
- Monitor: Email deliveries, bounce rates

---

## 🔄 Update Production

To update the live site:

```bash
# Make your changes
git add .
git commit -m "your commit message"
git push origin main

# Vercel will automatically deploy
```

---

## 📞 Support

For issues or questions:

- **Email**: sales@sinsajocreators.com
- **WhatsApp**: +1 (609) 288-5466
- **GitHub**: https://github.com/sinsajocreatorsia/landingpagesinsajo

---

**Last Updated**: 2025-01-22
**Version**: 2.0
**Status**: ✅ Ready for Production
