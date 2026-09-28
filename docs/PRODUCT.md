# WakeBoard – Product spec

One app for cable and boat wakeboarders: learn tricks, track progression, find parks, compete, and buy/sell gear.

## 1. Trick library ("Learn")
- Every trick has: name + aliases, discipline (surface, air, kicker, box, rail), difficulty 1–5, approach edge, prerequisites.
- **Step-by-step breakdown**, each step split into what to do with the **handle / cable**, the **legs** (edge, weight, knees) and the **body** (shoulders, head, lean).
- **3D manikin**: an animated rider driven by pose keyframes (spin, invert, height, knee bend, lean, arm reach, hands on handle). Tap a step to freeze the manikin on that phase.
- Reference **videos** (pro demo + slow motion), common mistakes.
- Later: rider-submitted tips, voting, translations (FR / EN / DE / ES).

## 2. My trick list ("Progress")
- Put any trick on the list: `wishlist → learning → landed → mastered`.
- Count attempts, note **how you managed to land it**, attach a proof video.
- Stats: landed per season, streaks, suggested next trick (from prerequisites).

## 3. Spots map ("Spots")
- World map of cable parks, two-tower systems and boat spots (PostGIS, "near me").
- Park page: **schematic plan of the cable loop with every module** (kicker, slider, box, funbox, rail…) and its level.
- Practical info: opening hours, prices, rental, crowd level, live status reported by riders.
- Riders can suggest new spots/modules; park owners can claim and verify their park.

## 4. Challenges & contests ("Contests")
- **1-vs-1 challenge**: film a trick, send it to a rider, they have 7 days to answer.
- **Virtual contests**: video submissions over a period, judges or community vote.
- **Live contests**: organizer creates event at a spot, registration, heats, live scoring, results.

## 5. Marketplace & ads ("Market")
- Second-hand listings (boards, bindings, vests, wetsuits, helmets) with photos, price, condition, location.
- In-app chat between buyer and seller (phase 2), no payment handling at first.
- **Sponsored slots** for wakeboard brands and shops, clearly labelled, by placement (market, trick page, spots).

## Monetization
1. Brand advertising / sponsored listings.
2. Park premium page (verified, events, promotions).
3. Rider "Pro" subscription: offline videos, advanced stats, contest organizer tools.
