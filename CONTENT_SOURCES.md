# Content sources and reconciliation

Every professional claim on this site comes from one of three sources, in this order of authority:

1. **Kunal Goenka's LinkedIn profile** ([linkedin.com/in/kunalgoenka23](https://www.linkedin.com/in/kunalgoenka23/)), as supplied by Kunal in November 2026. LinkedIn blocks automated access, so the profile text was provided directly.
2. **The résumé PDF** in `public/files/kunal-goenka-resume.pdf`, used only for technical detail LinkedIn doesn't contradict.
3. **The previous version of this portfolio** (v1, Kunal's own writing), used only for engineering rationale LinkedIn doesn't contradict.

All content lives in typed data files under `src/data/`. `tests/unit/content.test.ts` pins role and education dates to LinkedIn and fails the build if any claim listed below as removed reappears.

## Discrepancies found and how they were resolved

| Topic | LinkedIn | Older material | Resolution |
| --- | --- | --- | --- |
| Agentic RAG hallucination reduction | No figure given | Portfolio v1: 60%. Résumé: 35% | **Removed.** No number is published until Kunal confirms one. |
| ELORA F1 score | "F1-scores ranging from 0.90–0.98 across evaluated NLP tasks" | v1 and résumé: F1 "lifted from 0.90 to 0.98" | **LinkedIn wording.** The range covers different tasks; it is not a before-and-after improvement. |
| ELORA NLP tasks | Translation, NER, ethics classification, thematic prediction | v1: theme, sentiment, operational risk | **LinkedIn tasks.** |
| Recruiting platform adoption | 630+ hiring managers | v1 also claimed 100+ intern requests in the first month and 1,200+ résumés stored | **Extra figures removed** (not on LinkedIn). |
| Recruiting platform team size | Not stated | Résumé: directed a 7-person team | Kept, from the résumé. |
| Safety manual search | "airline safety manuals spanning 3,000+ pages" | Résumé: "airline maintenance manuals" | **LinkedIn wording.** |
| Boeing roles and dates | EAI&D Jan 2026–Present (Arlington); ELORA Jul 2025–Jan 2026 (Charleston) | Résumé: one role, Jul 2025–Present | **LinkedIn.** Shown as two roles under one employer. |
| Georgia Tech dates | Aug 2026 – May 2028 | Résumé: Aug 2025 – Present | **LinkedIn.** |
| NCR cycle time | 80 → 4 hours "per aircraft program monthly" | Same figures, without "monthly" | LinkedIn wording, including "each month". |
| NCR human review band | Not stated | v1: mid-confidence results went to human review | **Removed** from the NCR case study. |
| Phone number | Not public on the profile | Was in the v1 structured data | **Removed** from the site. |

## Résumé re-supplied (November 2026)

Kunal pasted the current résumé text again and confirmed the rule: **where it conflicts with LinkedIn, LinkedIn wins**; every other résumé detail is used. The conflicts are unchanged from the table above (35% hallucination figure, F1 "lifted from 0.90 to 0.98", single Boeing role from July 2025, Georgia Tech from August 2025). Non-conflicting résumé positioning now in the site description: MCP integrations and enterprise RAG in regulated environments like Azure Government Cloud, taken from problem discovery to production.

## Card metrics by mode

Each project card shows one figure, with a technical figure in Engineer mode (`card` in `src/data/projects.ts`). All come from LinkedIn or non-conflicting résumé lines:

| Project | Default | Engineer mode |
| --- | --- | --- |
| NCR parts matching | 95% less engineering cycle time | 80 → 4 h per aircraft program, each month |
| Recruiting platform | 630+ hiring managers | 7-person team directed (résumé) |
| Multilingual survey NLP | 100K+ responses in 10+ languages | F1 0.90–0.98 across evaluated tasks |
| Document ingestion | 4,500+ knowledge objects | <1.2 s P95 retrieval latency |
| Skill gap MVP | Under 6 weeks to MVP | 5-person team led |
| Safety manual search, DineSmart | 3,000+ pages; 48 hours | No separate figure exists, so the default stays |
| Agentic RAG | None | None, until a figure is approved |

## Technical detail taken from the résumé

These details appear on the résumé and nowhere contradict LinkedIn: LangGraph state machines, cross-encoder reranking, and LLM-as-a-judge evaluation (agentic RAG); FastAPI and Docker (document ingestion); fine-tuned RoBERTa (ELORA); OpenTelemetry.

## Not included

- **Lessons learned** per project: no source material exists, so none were written. The case studies show Kunal's stated *decisions* instead.
- **DineSmart repository link**: the public repo's README currently contains unresolved merge-conflict markers. It's worth cleaning up before linking it.
- **VT Tech Fellows Patent Analysis** (a LinkedIn attachment): no description is available.

## Action items for Kunal

- [ ] Update the résumé PDF. It still says Georgia Tech Aug 2025, a 35% hallucination reduction, and an F1 that was "lifted from 0.90 to 0.98".
- [ ] Confirm whether a hallucination-reduction figure is approved for public use, and which one.
- [ ] Clean up the DineSmart repository README if you want it linked.
