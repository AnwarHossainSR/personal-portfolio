# Content confirmation checklist

Every statement on this site was drafted from two sources: `public/resume.pdf`
and the project descriptions in the pre-rebuild `src/data/projects.ts`. Nothing
was invented — but "derived from your CV" is not the same as "true", and you are
the only person who can tell the difference.

**Nothing here is a number.** All three case studies ship as
`evidence: "qualitative"`, which the content schema enforces to mean zero
numeric claims. That is deliberate: a metric you cannot source is the exact
failure this rebuild removed. When you have real figures with the method behind
them, change a case study's `evidence` to `"measured"` and add its `results`
array — the schema will reject the change if any result lacks a method.

Work through the sections below. Anything you cannot defend for forty-five
minutes in an interview should be cut, not softened.

## 0. The question to ask before any of the others

For each of the three case studies, answer this first, because everything
below it depends on the answer:

- [ ] **`vod-delivery` — did you build a video ingest, encoding and delivery
      path on AWS Media Services?** If the work was narrower than that (say you
      integrated with a pipeline someone else designed), the `scope` and `role`
      fields need rewriting before anything else.
- [ ] **`analytics-platform` — did you own both the dashboard and the API
      behind it?** The case study's whole argument is a decision about where
      aggregation happens, which only makes sense if you owned both sides. If
      you owned only the front end, this becomes a different, smaller story.
- [ ] **`release-path` — did you introduce Terraform and the CI/CD pipeline,
      as opposed to working within ones already in place?** The résumé says you
      provisioned environments with Terraform and engineered the pipelines;
      confirm that means you established them.

A first draft of these case studies asserted several specifics the résumé does
not support — that existing infrastructure was *imported* into Terraform state
rather than rebuilt, that the analytics dashboard *became slow as data grew*
and now *caps rendered resolution*, and that the team had *no media
specialists*. All three have been removed, because none of them could be traced
to a source. If any of them is in fact true, it is worth putting back — a
specific story beats a general one, and those were the most interesting claims
in the drafts. But put them back because they happened, not because they read
well.

---

## 1. Identity — decide these first

These conflict between your resume and the site as it stands.

| Field | `public/resume.pdf` says | Site currently says | Decide |
| --- | --- | --- | --- |
| Name | Anwar Hossain Sarker | Md. Anwar Hossain | |
| Current title | Senior Full Stack Engineer (summary) / Software Development Engineer II — Full Stack (Craftsmen entry) | Senior Software Engineer | |
| Years of experience | 5+ years | 6+ years | |
| Annonlab dates | March 2021 — August 2021 | "2020 – 2021", described as "1 year" | |
| Company name | Annonlab | Annon Lab | |

The site now uses the resume's dates and titles, because a recruiter reads both
documents and a mismatch is the kind of thing that gets asked about. If you
prefer the other set of values, change them in **both** places, not one.

## 2. Your resume needs the same treatment as the site

`public/resume.pdf`, Achievements section, currently claims:

- "serverless platforms on AWS processing thousands of concurrent requests with **99.9% uptime**"
- "VOD streaming infrastructure ... serving real-time content delivery **at scale**"

These are unsourced numbers of exactly the kind the site rebuild removed. A
reader who visits the site and then opens the résumé will notice that the site
is careful about evidence and the résumé is not, and the résumé is the one that
looks worse. Either source them or reword them.

Also in the résumé: "cutting release cycle time by approximately **40%**". That
one may well be real — if you can say how it was measured (what the cycle time
was before, after, over what period), it belongs in the `release-path` case
study as a measured result, and it is the single strongest number you have.

## 3. Case study: `vod-delivery`

Drafted from the résumé line: *"Designed and deployed a Video-on-Demand (VOD)
content delivery system using AWS Media Services, handling encoding, storage,
and adaptive streaming pipelines."*

Confirm each:

- [ ] You owned ingest, encoding orchestration, storage lifecycle and CDN delivery — and **not** the player or the surrounding product UI. The `scope` field says exactly this. Correct it if the boundary was different.
- [ ] The choice of managed AWS Media Services **over self-hosted FFmpeg workers** was a real decision you made or were part of, and the reason given (not wanting to operate a transcode farm alongside the product) is the real reason.
- [ ] The stated cost of that choice — managed-service premium per minute, limited codec/packaging control — is one you would actually name.
- [ ] Adaptive bitrate over a single rendition, served through CloudFront rather than straight from S3, is what actually happened.
- [ ] The reflection says storage lifecycle deserves to be settled with the encoding ladder rather than after it. It is written as a judgement, not as a claim that you got it wrong. **A borrowed regret is the easiest thing in the world to be caught out on** — if you do not hold this view, replace it with one you do.
- [ ] Team description is deliberately vague ("product engineering team ... colleagues either side of it") because I do not know the headcount. Put the real composition in.

## 4. Case study: `analytics-platform`

Drafted from the résumé line: *"Built a production SaaS data visualization
platform using React.js and Highcharts, delivering enterprise analytics
dashboards with real-time data rendering."*

Confirm each:

- [ ] You owned the dashboard front end **and** the query/aggregation API behind it, but not the upstream data collection or storage schema.
- [ ] Server-side aggregation over sending raw rows to the browser was a real decision, and the payload-scales-with-customer-data reasoning is the real reason.
- [ ] The second decision now says the dashboards **refresh on an interval** rather than pushing over a persistent connection. Confirm which one the product does. If it genuinely streams, this decision inverts and the tradeoff changes with it.
- [ ] The reflection is about the coupling cost of server-side aggregation. Confirm you would actually stand behind it, and replace it if a real regret from this work comes to mind.
- [ ] Highcharts is named in the stack because your résumé names it. Keep or drop.

## 5. Case study: `release-path`

Drafted from three résumé lines: Terraform provisioning "reducing environment
drift", CI/CD pipelines on GitHub Actions and the Serverless Framework, and
serverless microservices with event-driven AWS workflows.

Confirm each:

- [ ] Before Terraform, environments were provisioned through the console and steps were kept in a runbook or in people's heads. The first decision contrasts those two, so if the prior state was something else, say what it was.
- [ ] The second decision says releases went from manual to fully automated through GitHub Actions and the Serverless Framework. Confirm that is the change you made.
- [ ] The reflection is now a general judgement about ordering rather than a claim that you personally got the order wrong. If you did hit that problem, saying so directly is stronger — but only if you did.
- [ ] Consider whether this third slot is better spent on a **BJIT** story instead. All three case studies are currently Craftsmen work. Your BJIT years are where you won Best Employee of the Year 2023, and a case study spanning two employers reads as a broader track record. The polyglot-persistence work ("matching database choice to workload characteristics") is the obvious candidate.

## 6. Roles — `src/data/roles.ts`

- [ ] Craftsmen scope: "SaaS analytics product and a video-on-demand delivery system, plus the AWS infrastructure and deploy pipelines" — correct?
- [ ] BJIT scope: "e-commerce, logistics and enterprise products in Agile squads" — correct?
- [ ] Annonlab is deliberately given one impact line and two lines of scope. Early roles earn less space than current ones; giving a five-month first job the same weight as a senior role is itself a junior signal. Confirm you are happy with that.
- [ ] **Best Employee of the Year 2023 (BJIT)** is now on the site as a real, attributable award — it sits where the fabricated "certifications" used to be. Confirm the year and the exact award name.
- [ ] Your résumé says "Delivered 10+ full-stack web applications" at BJIT. The site says "across e-commerce, logistics and enterprise domains" without the count, because "10+" is the same uncheckable shape as the "50+ projects" counter the rebuild removed. Restore the number only if you want to defend it.

## 7. Things deliberately left off the site

Say if you want any of these back:

- **Phone number.** Removed. A public number on a portfolio attracts recruiter cold-calls, not the senior conversations the site is built for. Your résumé still carries it, which is the right place.
- **Education and CGPA.** AIUB BSc Computer Science, 3.92/4.00, plus perfect HSC/SSC scores. Strong, but academic scores stop carrying weight several years into a career and reading as though they still do is a junior signal. They remain on the résumé.
- **The full technology list.** Your résumé names Go, Vue, Django, FastAPI, Kafka, RabbitMQ, Kubernetes, Azure, Cognito, Firebase and more. The site's stack section lists what you use regularly, grouped by purpose. Breadth belongs on the résumé; the site is for depth.
- **The YouTube channel.** Now one sentence in About, framed as teaching rather than as a portfolio item.

## 8. Dates in the stack section

Every `since:` year in `src/data/stack.ts` is inferred from your employment
dates, not from a source that records when you actually started using each
technology. They are currently anchored so that nothing predates March 2021
(your first professional role) and the AWS and Terraform work sits inside your
Craftsmen tenure. Correct any that are wrong — these are cheap to check and
the kind of small inconsistency an attentive reader notices.
