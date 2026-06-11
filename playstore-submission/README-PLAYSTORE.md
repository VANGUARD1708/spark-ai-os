# SPARK — Google Play Store Submission Guide

Your app is live at: **https://spark-commerce-os--johnjunel1708.replit.app**

## Package Name

**`com.spark.businessos`**

Use this exact package name when PWA Builder / Bubblewrap asks for it. It cannot be changed after your first upload.

## Step 1: Generate Android Package (.aab)

### Option A: Use PWA Builder (Easiest — 2 minutes)
1. Go to https://www.pwabuilder.com
2. Enter your URL: `https://spark-commerce-os--johnjunel1708.replit.app`
3. Click "Start"
4. Scroll to "Android" section → click "Package for Store"
5. Download the `.aab` file

### Option B: Use Bubblewrap CLI (Requires Node.js)
```bash
# 1. Install Bubblewrap globally
npm install -g @bubblewrap/cli

# 2. Initialize project from your manifest
bubblewrap init \
  --manifest https://spark-commerce-os--johnjunel1708.replit.app/manifest.json \
  --host https://spark-commerce-os--johnjunel1708.replit.app

# 3. When prompted, enter:
#    - App name: SPARK
#    - Short name: SPARK
#    - Package ID: com.spark.businessos
#    - Display mode: standalone
#    - JDK: Yes (let it auto-install)
#    - Android SDK: Yes (let it auto-install)

# 4. Build the package
bubblewrap build

# Output: app-release-signed.aab (this is your Play Store upload file)
```

## Step 2: Upload to Google Play Console

1. Go to https://play.google.com/console
2. Click "Create app"
3. Fill in:
   - App name: `SPARK`
   - Default language: `English (United States)`
   - App or game: `App`
   - Free or paid: `Free`
   - Declarations: Check all required boxes

4. In "Store presence" → "Main store listing":
   - **Short description**: AI-powered business operating system for creators
   - **Full description**: (see below)
   - **App icon**: Upload `playstore-icon.png` (512x512)
   - **Feature graphic**: Upload `feature-graphic.png` (1024x500)
   - **Phone screenshots**: Upload `screenshot-phone-1.png`, `screenshot-phone-2.png`, and `dashboard-mobile.jpg` (2-8 phone screenshots)
   - **Tablet screenshots**: Upload `screenshot-tablet-1.png` and `dashboard-desktop.jpg` (optional but recommended)
   - **Video**: Optional, skip for now

5. In "App content" section:
   - **Privacy policy**: Add a link to your privacy policy (create a simple page at /privacy if needed)
   - **Ads**: No, this app does not contain ads
   - **Content rating**: Category: Business/Finance, Everyone
   - **Target audience**: 18+
   - **News apps**: No
   - **COVID-19**: No
   - **Data safety**: Fill in the form (location: No, personal info: No, financial info: No, etc.)

6. In "Production" → "Create new release":
   - Upload the `.aab` file from Step 1
   - Release name: `1.0.0`
   - Release notes: "Initial release of SPARK — AI Business Operating System"
   - Review and rollout

7. Submit for review

## Full Description (Copy & Paste)

```
SPARK is your AI-powered business operating system. Turn raw ideas into profitable creator businesses — from market research to brand building to viral content creation.

What you can do with SPARK:

✦ FIND OPPORTUNITIES
• Trend Radar — real-time AI analysis of trending niches
• Winning Products — AI-analyzed opportunities ranked by demand
• Idea Generator ‒ generate profitable business concepts

✦ BUILD YOUR BRAND
• Brand Builder — AI-generated identity, messaging, and visual systems
• Bundle Builder — create product offers with pricing and bonuses
• Offer Builder — digital product generator with full structure

✦ CREATE VIRAL CONTENT
• Viral Hooks — scroll-stopping hooks for TikTok, Instagram, and YouTube
• TikTok Scripts — AI-generated video scripts with structure
• Ad Generator — platform-specific ad copy for TikTok, Instagram, Facebook, Google

✦ LAUNCH & SCALE
• Campaign Manager — plan and track marketing campaigns
• Content Calendar — 7-day planner with AI suggestions
• Scheduling — post calendar with optimal time slots
• Email/SMS — campaign templates and automations

✦ ANALYZE & OPTIMIZE
• Analytics Dashboard — track generation activity and growth
• A/B Testing — test hooks, prices, and CTAs
• Revenue Forecast — 6-month projections with scenarios
• AI Recommendations — personalized next steps

✦ AI AGENTS
• Research Agent — finds profitable niches
• Brand Agent — builds your identity
• Content Agent — creates viral content
• Sales Agent — optimizes conversions

✦ EVOLUTION SUITE
• Creator DNA — discover your archetype
• Audience Map — understand your segments
• Attention Map — optimize video retention
• Growth Evolution — track your journey

FREE PLAN:
• 5 idea generations per day
• 3 bundle builds per day
• 3 TikTok scripts per day
• 5 viral hook sets per day
• Save up to 10 ideas
• 7-day content planner
• Standard AI model

PRO PLAN ($29/month):
• Unlimited everything
• Priority AI model (fastest)
• Brand builder, storefront builder
• Analytics, A/B testing, AI insights
• API access + priority support

SPARK evolves your ideas into businesses, brands, and social growth systems.
```

## Assets Checklist

All assets are in the `playstore-submission/` folder:

| Asset | File | Dimensions | Required |
|-------|------|------------|----------|
| App Icon | `playstore-icon.png` | 512x512 | Yes |
| Feature Graphic | `feature-graphic.png` | 1024x500 | Yes |
| Phone Screenshot 1 | `screenshot-phone-1.png` | 9:16 | Yes |
| Phone Screenshot 2 | `screenshot-phone-2.png` | 9:16 | Yes |
| Phone Screenshot 3 | `dashboard-mobile.jpg` | 402x874 | Yes |
| Tablet Screenshot 1 | `screenshot-tablet-1.png` | 16:9 | Recommended |
| Tablet Screenshot 2 | `dashboard-desktop.jpg` | 1280x720 | Recommended |
| Real Trending | `trending.jpg` | 1280x720 | Optional |
| Real Ad Generator | `ad-generator.jpg` | 1280x720 | Optional |
| Real Pricing | `pricing.jpg` | 1280x720 | Optional |
| Real Command | `command-center.jpg` | 1280x720 | Optional |

## Common Issues

**App not showing in Play Store search?**
- Wait 24-48 hours after approval for indexing

**AAB upload fails?**
- Make sure the .aab file is from the latest PWA Builder build
- Check that the signing key is valid (PWA Builder auto-signs)

**Privacy policy required?**
- Create a simple page at `/privacy` on your app
- Example: https://spark-commerce-os--johnjunel1708.replit.app/privacy

## Contact

Need help? The SPARK team is here: [your support email]
