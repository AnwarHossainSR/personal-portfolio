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
- [ ] **`analytics-platform` — see section 9.** This case study was rewritten
      once everviz was identified as the product; the questions that matter for
      it are there, not here.
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

**This section is superseded by section 9.** The case study was rewritten after
everviz was identified as the product, and the questions worth answering moved
there. The résumé line above is still the source; the framing it produced —
an internal metrics dashboard — turned out to be wrong for everviz.

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

## 9. everviz — newly named, needs your confirmation

Your GitHub access to the `Visual-Elements` organisation identified the product
behind the Craftsmen work: **everviz** (everviz.com), a data visualisation
platform by Visual Elements of Bergen, Norway, powered by Highcharts. It lets
journalists, analysts and broadcasters build charts, maps and tables without
code and publish them anywhere.

This is a material improvement — naming a real, public product beats "an
enterprise SaaS product" — but it introduced new claims:

- [ ] **The relationship.** The site now says "Craftsmen Ltd., on everviz
      (Visual Elements)". Confirm that is how to describe it. If Craftsmen is
      contracted by Visual Elements, say so plainly; if you are employed
      differently, correct it.
- [ ] **The `analytics-platform` case study was rewritten.** The earlier draft
      described an internal metrics dashboard — "customers see their own
      operational data". That was wrong for everviz, which is an authoring and
      publishing tool, not a dashboard. The new version describes building the
      editor. Confirm that is the work you do.
- [ ] **Both decisions in it are inferred from the public product**, not from
      anything you told me. "Curate the configuration surface rather than expose
      all of it" and "published output renders independently of the authoring
      service" are how the product visibly behaves — they are not confirmed as
      decisions you were part of. If you were not, say so and they should be
      rewritten or cut.
- [ ] **Your team description** says "product engineering team working with the
      everviz product group in Norway". Correct it if the arrangement differs.

### The VOD case study may be the same work

Your résumé lists a "Video-on-Demand (VOD) content delivery system using AWS
Media Services" at Craftsmen. The Visual-Elements organisation also contains an
export service described as being used for **location map videos**, and a chart
export server. Those may be the same work described two ways, or they may be
genuinely separate projects.

- [ ] If `vod-delivery` and the everviz export work are the same thing, the two
      case studies overlap and one should absorb the other — right now the site
      implies two independent systems.
- [ ] If they are separate, `vod-delivery` should say which product it belongs
      to, the way `analytics-platform` now does.

### What was deliberately left out

The organisation has around forty repositories and **all but six are private**.
Nothing internal is named on the site — no repository names, no service
topology, no infrastructure detail. Two reasons: a private repository link is a
404 for every visitor, and an employer's internal architecture is not yours to
publish. Everything cited is either the public product or its public
documentation.

You have no commits in the six public repositories, so there is no public code
artifact to link. The case study links to everviz.com instead, which is the
honest and more useful option — a hiring manager can see the product.

## 10. Default theme

The site now opens in **light** mode. The warm paper palette was designed
light-first, so this is the intended presentation; dark is a derived variant
and remains available from the toggle.

## 11. Claims you supplied directly — 9 September 2026

Everything in this section came from you in conversation, not from the résumé
or the public product. That makes you the source, which is the strongest kind
there is — but it also means nothing here was cross-checked, so the wording is
deliberately plain and stops where your statement stopped. Read each line and
confirm the site is not saying more than you did.

You said: *"we are doing ai, mcp server, map related stuffs etc … video export
generation etc"*, *"beanstalk, RDS, dynamo db etc"*, *"RDS, redis, mono repo,
distributed architecture, posthog"*, *"php, laravel, python"*, and
*"microservices, event driven architecture"*.

What went onto the site as a result:

- [ ] **`analytics-platform` is now the first case study**, ahead of
      `vod-delivery`. That is the one a reader sees first.
- [ ] **A third decision was added to it** — server-side export rendered from
      stored configuration, as an asynchronous job, rather than captured in the
      user's browser. This is written as a decision you were part of. If the
      export path was designed before you joined it, or works differently, it
      needs rewriting or cutting. **This is the highest-risk line in this
      section**: the same shape of claim produced three corrections earlier.
- [ ] **AI and an MCP server** are named in the case study, in your Craftsmen
      role, in the capabilities list and in the stack. The site says an MCP
      server lets an AI client drive the same API the editor drives. Confirm
      that is what it does, and that it exists in production rather than in
      progress — the site does not currently distinguish the two.
- [ ] **Maps** are named as part of the editor (charts, maps and tables), which
      matches the public everviz product.
- [ ] **Video export generation** is described as the export path producing a
      static image or a generated video. Confirm the video half is real and is
      yours, and see the note in section 9 about whether this and `vod-delivery`
      are the same work described twice — that overlap is now more visible, not
      less, because both case studies talk about video.
- [ ] **AWS services added**: Elastic Beanstalk, RDS, DynamoDB, SQS, alongside
      the Lambda, ECS, EC2, S3 and CloudFront already there. Beanstalk is
      described as "managed hosting for services that predate the container
      work" — that framing is inferred, not something you said. Correct it if
      the reason is different.
- [ ] **Redis, PostgreSQL on RDS, a monorepo, microservices, event-driven
      workflows and polyglot persistence** appear in the capabilities and in a
      new "Architecture" group in the stack section. These are the senior-level
      signals you asked for; they are also the ones an interviewer will open
      with, so each should be a system you can draw on a whiteboard.
- [ ] **PostHog** is described as product analytics behind interface decisions.
      If you have it installed but do not use it to settle design questions,
      soften that line.
- [ ] **PHP, Laravel and Python** are in the stack. Python is described as
      "Django and FastAPI services, and scripting around the pipelines" — the
      résumé supports Django and FastAPI; the scripting half is inferred.
- [ ] **`since:` years for the new stack entries** are inferred the same way as
      section 8 describes: Beanstalk, RDS + DynamoDB, Highcharts, PostHog and
      the monorepo are dated 2024 (your Craftsmen start), MCP servers 2025.
      Correct any that are wrong.

Two constraints were relaxed to fit this in, both of which were mine rather
than yours, and both are reversible:

- The capabilities list went from four entries to six.
- A case study's `stack` array can now hold twelve entries rather than eight.
  Twelve is close to the keyword-dump the cap existed to prevent; if the
  technology row under a case study starts reading as a list rather than as a
  description, cut it back.
