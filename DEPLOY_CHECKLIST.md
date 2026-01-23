# 🚀 Deployment Checklist - Sinsajo Workshop

## Pre-Deployment

### 1. Environment Variables
- [ ] Copy `.env.example` to `.env.local`
- [ ] Set all required environment variables in Vercel/hosting provider:
  - [ ] `NEXT_PUBLIC_BASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `STRIPE_WEBHOOK_SECRET`
  - [ ] `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
  - [ ] `PAYPAL_SECRET`
  - [ ] `OPENROUTER_API_KEY`
  - [ ] `RESEND_API_KEY`
  - [ ] `FROM_EMAIL`
  - [ ] `INTERNAL_API_KEY`
  - [ ] `ADMIN_API_KEY`

### 2. Supabase Setup
- [ ] Run migration `001_workshop_schema.sql`
- [ ] Run migration `002_hanna_analysis_enhanced.sql`
- [ ] Verify RLS policies are enabled
- [ ] Create admin user in `admin_users` table
- [ ] Test database connection

### 3. Stripe Setup
- [ ] Create product in Stripe Dashboard
- [ ] Configure webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
- [ ] Add webhook events:
  - [ ] `checkout.session.completed`
  - [ ] `checkout.session.expired`
  - [ ] `payment_intent.payment_failed`
  - [ ] `charge.refunded`
- [ ] Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`
- [ ] Test with Stripe CLI locally first

### 4. PayPal Setup
- [ ] Create app in PayPal Developer Dashboard
- [ ] Configure return/cancel URLs
- [ ] Switch from sandbox to live credentials
- [ ] Test payment flow

### 5. Resend Setup
- [ ] Verify domain in Resend Dashboard
- [ ] Create API key
- [ ] Test email sending

### 6. Build Check
```bash
npm run build
```
- [ ] No TypeScript errors
- [ ] No build warnings (or acceptable ones)
- [ ] Bundle size is reasonable

## Deployment Steps

### Vercel (Recommended)

1. **Connect Repository**
   ```bash
   vercel link
   ```

2. **Set Environment Variables**
   ```bash
   vercel env pull
   # Or set manually in Vercel Dashboard
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Configure Domain**
   - [ ] Add custom domain in Vercel
   - [ ] Update DNS records
   - [ ] Wait for SSL certificate

## Post-Deployment Testing

### Payment Flow
- [ ] Test Stripe checkout (use test card 4242 4242 4242 4242)
- [ ] Verify webhook receives `checkout.session.completed`
- [ ] Confirm registration created in database
- [ ] Verify confirmation email sent
- [ ] Check email arrives correctly

### PayPal Flow
- [ ] Test PayPal checkout
- [ ] Verify registration created
- [ ] Check confirmation email

### Onboarding Form
- [ ] Complete full onboarding form
- [ ] Verify profile saved to database
- [ ] Check completion percentage

### Admin Panel
- [ ] Access `/admin` page
- [ ] View statistics
- [ ] Run Hanna analysis
- [ ] Check participant list

### Hanna Chat
- [ ] Test chat widget
- [ ] Verify AI responses
- [ ] Test voice features (if supported in browser)

### Email Templates
- [ ] Test confirmation email
- [ ] Verify all links work
- [ ] Check mobile rendering

## Monitoring

### Set Up Alerts
- [ ] Stripe webhook failures
- [ ] Supabase connection issues
- [ ] High error rate in logs

### Analytics
- [ ] Enable Vercel Analytics
- [ ] Set up Google Analytics (optional)
- [ ] Configure conversion tracking

## Security Checklist

- [ ] All API keys are in environment variables (not committed)
- [ ] Admin routes are protected
- [ ] CORS is properly configured
- [ ] RLS is enabled on all tables
- [ ] No sensitive data in client-side code
- [ ] Rate limiting on API routes (consider adding)

## Rollback Plan

If issues arise:
1. Revert to previous deployment in Vercel
2. Check Supabase logs for database issues
3. Verify environment variables are correct
4. Check Stripe/PayPal dashboards for payment issues

## Support Contacts

- **Supabase**: support@supabase.io
- **Stripe**: https://support.stripe.com
- **Vercel**: https://vercel.com/support
- **Resend**: https://resend.com/support

---

## Quick Commands

```bash
# Local development
npm run dev

# Build for production
npm run build

# Check types
npm run typecheck

# Deploy to Vercel
vercel --prod

# View logs
vercel logs

# View environment variables
vercel env ls
```

---

*Last updated: January 2026*
