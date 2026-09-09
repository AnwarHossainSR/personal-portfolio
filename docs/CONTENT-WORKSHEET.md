# Content worksheet

Fill this in before writing any case study. The content schema rejects
placeholder text, so anything unanswered here blocks the build — which is the
point. Answer in plain sentences; polish happens later.

## Rules

- **Anonymise, don't invent.** "A media client" is fine. A made-up number is not.
- **If you can't source a number, say the thing qualitatively.** The schema
  supports `evidence: "qualitative"` precisely so you never have to reach for a
  figure you can't defend in an interview.
- **Only claim what you owned.** Every case study has a `scope` field whose job
  is to say where your boundary was. Naming the boundary is a seniority signal.
- **Assume you will be asked about every sentence for 45 minutes.**
- **Never type these tokens, even as placeholders:** `TODO`, `TBD`,
  `Lorem ipsum`, `example.com`, `FIXME`, `<<REPLACE>>`. The build fails on
  them anywhere in content.

## Positioning (one set)

1. In one sentence, what kind of problem do you get hired to solve? Not a stack
   list — a problem shape. ("I make media and commerce backends survive
   traffic and change" is a problem shape.)
2. What are the three things you want a hiring manager to remember? Max three.
3. What are you deliberately *not* claiming? (Naming this keeps the positioning
   honest and makes the three above sharper.)
4. Current availability, in one line, with an honest response time.

## Per case study — pick exactly 3

Choose the three you can talk about for 45 minutes. Prefer the ones with
constraints and a hard decision over the ones with the biggest logos.

### Identity
1. Slug (kebab-case, becomes the URL).
2. Title — an *outcome*, not a product name. "Cutting failed video ingests by
   rebuilding the upload path", not "VOD Platform".
3. One-sentence summary a hiring manager could repeat to a colleague.
4. Organisation (anonymise if needed), domain, period, team composition.
5. **Role:** what you were responsible for on this engagement — not your job
   title.
6. **Scope:** what did you own? What did you explicitly not own?
7. **Stack:** the 3–8 technologies you used on this specific project, not
   your full skill list.

### Context (aim for 3–5 sentences)
8. What was the situation before you touched it?
9. Who was hurting, and how did that show up in the business?
10. Why was it worth engineering time?

### Constraints (at least 2, one sentence each)
11. Time, headcount, budget, legacy systems, compliance, uptime requirements,
    team skill mix — what boxed the solution in?

### Decisions (1–4; this is the most valuable section on the site)
For each:
12. The question you had to answer, phrased as a question.
13. What you chose.
14. **At least one alternative you rejected, and why.** This is mandatory.
15. **What the choice cost you.** Every real decision costs something —
    complexity, latency, money, flexibility, or someone's time. Name it.

### Results
16. Evidence level: `measured` (you have real numbers), `estimated` (you have a
    defensible approximation and will say so), or `qualitative` (no numbers).
17. If measured or estimated, per metric: what was measured, the before value,
    the after value, and **how it was measured** — instrument, window, baseline.
    Example: "p95 checkout latency, CloudWatch, 30 days either side of the
    cutover, same traffic mix."

### Reflection
18. What would you do differently? Be specific and slightly uncomfortable.
    Vague humility reads as false; a concrete regret reads as calibration.

### Links
19. Any public artefact: repo, post, talk, docs. If there is none, leave it
    empty. **Do not link a GitHub profile as if it were the project.**

## Roles (for the About page)

For each of the three roles:
1. Scope — team size, systems owned, what you were accountable for.
2. Two or three impact statements. Same rule as results: a number needs a
   method, or it stays qualitative.
3. The technologies you actually used day to day. Not everything you touched.

## Stack

List technologies grouped by *what you use them for*, not by proficiency.
No "Expert / Advanced / Intermediate" — the site no longer has that concept.
For each: what you build with it, and roughly since when.

## Writing (optional, high leverage)

One engineering note beats another project card. If you have one, it needs:
a title, a summary, a published date, and the piece itself. If you have none
yet, leave the notes registry empty — the route and nav item stay hidden until
a note exists.
