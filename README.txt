DAI Research Portal — Smart (live AI) version for Netlify
=========================================================

This folder hosts the portal with the REAL Claude-powered Raffles, on a public
link anyone can open (no sign-in required for visitors).

What's inside:
  index.html                      → the website
  netlify/functions/raffles.mjs   → the secure backend that talks to Claude
  netlify.toml                    → tells Netlify where the function lives

HOW IT STAYS SECURE:
  The webpage never contains an API key. It calls the function, and the function
  holds the credentials on the server side, so nothing sensitive is exposed.

DEPLOY STEPS (about 5 minutes):
  1. Create a FREE account at netlify.com (email or Google sign-in).
  2. In your Netlify dashboard: Add new site -> Deploy manually.
  3. Drag THIS WHOLE FOLDER onto the drop zone. Wait for it to deploy.
  4. Enable AI: open Site configuration -> AI (or "AI features") and turn it ON.
     This lets Netlify run Claude for you, billed as Netlify credits.
     (Alternative: skip this and instead add an environment variable named
      ANTHROPIC_API_KEY set to a key from console.anthropic.com.)
  5. Trigger one more deploy (Deploys -> Trigger deploy -> Deploy site) so the
     AI credentials get picked up. Then open your site link and chat with Raffles.

TROUBLESHOOTING:
  - If Raffles replies but seems "simple," the function isn't reachable and the
    page fell back to keyword mode. Re-check steps 4 and 5.
  - If the page is blank, make sure index.html is at the top level of the folder.
