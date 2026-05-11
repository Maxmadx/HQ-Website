# Cloud Run Keep-Warm (Free) Guide

## Why

Cloud Run scales to zero after ~15 min of idle. The next request after that incurs a 1–2s cold start. Pinging the health endpoint every 5 min during business hours keeps a container warm — no cold starts for real users.

Cost: $0. Setup: ~5 min.

## Steps

1. Go to https://uptimerobot.com — sign up (free tier).
2. Create a new HTTP(S) monitor:
   - **Monitor type:** HTTP(S)
   - **Friendly name:** "HQ Aviation API keep-warm"
   - **URL:** `https://hq-website-4abc7.web.app/api/health`
   - **Monitoring interval:** 5 minutes (free tier allows down to this)
3. Save.
4. Verify the monitor is "Up" (green dot) within 5 minutes.

That's it. The ping costs ~8,640 requests/month, well within Cloud Run's 2M/month free tier (~0.4% of free allowance).

## Restrict to business hours (optional)

To save even those tiny pings, uptimerobot Pro has alert windows. Free tier pings 24/7. For HQ's traffic the 24/7 ping is fine.

## Removing keep-warm later

If you ever pay for Cloud Run `min-instances=1` (~$5/mo), delete the monitor — Cloud Run keeps itself warm.
