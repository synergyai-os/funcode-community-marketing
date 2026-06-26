# How we got funcode.club online — and why the fix lives in our brain, not my memory

_Draft community post. Voice: STD-4 (playful yet humble). Theme: STR-5 (governance over prompting). Status: draft for Randy._

---

So funcode.club wouldn't go live.

Railway kept trying to deploy and kept giving up. The kind of thing that makes you want to close the laptop and pretend it's tomorrow's problem. We're figuring this out in the open, so here's exactly what happened — the messy version, not the highlight reel.

## The move that mattered

I didn't try to guess my way out of it. I told my AI agent: "it won't deploy, go find the actual logs." And instead of throwing five plausible fixes at the wall, it went and *read the build logs* — the real ones, from the failed deploy.

That's the whole trick, honestly. Don't argue with the machine about what *might* be wrong. Go look at what *is* wrong.

## What was actually broken (three small, sneaky things)

None of these were visible in the code. That's why it stung.

1. **It was building from the wrong folder.** Our app lives in `web/`, but Railway was looking at the repo's front door, found no app, and shrugged.
2. **The wrong "adapter."** The app was set up to auto-detect its host — except that auto-detector doesn't know Railway exists, so it quietly built *nothing you could actually run*.
3. **The wrong door number.** Our domain knocks on port 8080; the app was answering on 3000. Build goes green, site stays dark.

Tiny settings. Big silence. Each one would've cost a fresh round of head-scratching to anyone who hit it next.

## The synergy bit

This is the part I actually care about. Me and the agent each did the thing we're good at:

- **I** knew the goal, smelled that something was off, and pointed it at the exact Railway service when it couldn't find it.
- **It** pulled the logs, found the root cause instead of a symptom, fixed it, and put the site live — then sanity-checked that funcode.club really answered with a 200.

Human judgment + agent grind. Neither of us gets there alone that fast.

## The lesson worth keeping

Here's the FunCode-y twist. We didn't just fix it and move on. We noticed the agent had to *rediscover* stuff we sort of already knew — so we wrote it down where it belongs: in our shared brain (our Product Brain "Chain").

There's now a **Deployment** owner and a plain-language **standard** that says: build from `web/`, use the Node adapter, listen on 8080 — with the exact error messages baked in, so the next time anyone (human or agent) sees that error, the fix is one search away.

That's the bet we keep making: **governance over prompting.** Re-prompting fixes a moment. Writing it into the brain fixes it forever. Less "why is this broken *again*," more "oh, the brain already knows."

## Come poke at it

funcode.club is live now. It's not finished — nothing here ever really is — and that's kind of the point. If you've ever lost an afternoon to a deploy that swore it was fine, you'll fit right in. Come build with us.
