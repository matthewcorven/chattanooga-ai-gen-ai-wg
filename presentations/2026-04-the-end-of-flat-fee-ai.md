---
marp: true
theme: ai-night
paginate: true
size: 16:9
title: The End of Flat-Fee AI
description: How frontier AI access became more metered, gated, and controlled in April 2026
author: AI Night
footer: AI Night Meetup | April 22, 2026
---

<!-- _class: lead -->

# The End of Flat-Fee AI

How frontier AI access became more metered, gated, and controlled

<!-- cover-links -->

---

## Tonight's Claim

- Several frontier AI products are moving away from simple flat-fee access toward tiered, metered, or gated availability. <sup><a href="#appendix-a01">A01</a></sup><sup><a href="#appendix-a02">A02</a></sup><sup><a href="#appendix-a04">A04</a></sup>
- Across these examples, labs are combining larger infrastructure commitments, gated rollout, and more explicit runtime controls. <sup><a href="#appendix-a03">A03</a></sup><sup><a href="#appendix-a05">A05</a></sup><sup><a href="#appendix-a06">A06</a></sup>

---

## GitHub Made It Obvious

- GitHub's current docs show Claude Opus 4.7 is not included on individual Pro, while Pro+ advertises full access to available models. <sup><a href="#appendix-a01">A01</a></sup>
- The same docs put Pro at 300 premium requests per month, Pro+ at 1,500, with paid overages and a temporary pause on new Pro, Pro+, and student sign-ups starting Apr. 20, 2026. <sup><a href="#appendix-a01">A01</a></sup>

---

## Anthropic Made It Obvious Too

- Anthropic now lets paid Claude users continue past included limits through extra usage billed at standard API rates. <sup><a href="#appendix-a02">A02</a></sup>
- That gives paid Claude plans an included-usage model with optional metered overage, spending caps, and auto-reload. <sup><a href="#appendix-a02">A02</a></sup>

---

## The Economics Underneath It

- Amazon is investing $5B in Anthropic now, with up to $20B more tied to commercial milestones, while Anthropic commits to more than $100B of AWS spend over 10 years. <sup><a href="#appendix-a03">A03</a></sup>
- The deal also includes up to 5 GW of Trainium capacity, underscoring the infrastructure scale behind frontier access. <sup><a href="#appendix-a03">A03</a></sup>

---

## Some Access Is Being Gated For Safety

- Anthropic says Mythos Preview found thousands of high-severity vulnerabilities and is not planned for general availability. <sup><a href="#appendix-a04">A04</a></sup>
- Instead, access is being limited to Project Glasswing partners and additional participants during the research preview, with token pricing for participants afterward. <sup><a href="#appendix-a04">A04</a></sup>

---

## The Runtime Is Getting More Controlled Too

- Anthropic Managed Agents argues for durable session logs, decoupled harnesses, isolated sandboxes, and credentials kept out of generated-code environments. <sup><a href="#appendix-a05">A05</a></sup>
- OpenAI's updated Agents SDK makes the same move with separated harness and compute plus native sandboxes for long-running work. <sup><a href="#appendix-a06">A06</a></sup>

---

## What This Means For Teams

- The practical question is increasingly not just which model is best, but which access model your plan, budget, and risk posture can support. <sup><a href="#appendix-a01">A01</a></sup><sup><a href="#appendix-a02">A02</a></sup><sup><a href="#appendix-a04">A04</a></sup>
- Model access, usage limits, and runtime controls can materially shape a workflow even when the model itself improves. <sup><a href="#appendix-a01">A01</a></sup><sup><a href="#appendix-a02">A02</a></sup><sup><a href="#appendix-a05">A05</a></sup><sup><a href="#appendix-a06">A06</a></sup>

---

## Close

- These sources point to frontier AI becoming more capable, more infrastructure-intensive, and more security-sensitive at the same time. <sup><a href="#appendix-a03">A03</a></sup><sup><a href="#appendix-a04">A04</a></sup>
- Across these examples, the product pattern is shifting toward gated rollout, metered use, and more explicit control surfaces. <sup><a href="#appendix-a01">A01</a></sup><sup><a href="#appendix-a02">A02</a></sup><sup><a href="#appendix-a05">A05</a></sup><sup><a href="#appendix-a06">A06</a></sup>

---

## Appendix

Use the superscript source links on factual bullets to jump to the supporting appendix page.

---

<a id="appendix-a01"></a>

## Appendix A01

- Claim: GitHub Copilot's current docs make frontier access more explicitly tiered, with Opus 4.7 excluded from individual Pro and premium requests split sharply between Pro and Pro+.
- [GitHub Docs: About individual GitHub Copilot plans and benefits](https://docs.github.com/en/copilot/concepts/billing/individual-plans)
- [GitHub Docs: Requests in GitHub Copilot](https://docs.github.com/en/copilot/concepts/billing/copilot-requests)
- [GitHub Docs: Supported AI models in GitHub Copilot](https://docs.github.com/en/copilot/reference/ai-models/supported-models)

---

<a id="appendix-a02"></a>

## Appendix A02

- Claim: Anthropic now frames paid Claude plans as included usage plus optional extra usage billed at API rates with spending controls.
- [Claude Pricing](https://claude.com/pricing)
- [Anthropic Support: Manage extra usage for paid Claude plans](https://support.claude.com/en/articles/12429409-manage-extra-usage-for-paid-claude-plans)

---

<a id="appendix-a03"></a>

## Appendix A03

- Claim: Amazon and Anthropic's expanded compute partnership shows the infrastructure scale sitting underneath frontier model access.
- [Amazon: Amazon and Anthropic expand strategic collaboration](https://www.aboutamazon.com/news/company-news/amazon-invests-additional-5-billion-anthropic-ai)

---

<a id="appendix-a04"></a>

## Appendix A04

- Claim: Anthropic is restricting Mythos Preview to a defensive-security initiative rather than releasing it generally, while describing unusually strong cyber capabilities.
- [Anthropic: Project Glasswing](https://www.anthropic.com/glasswing)

---

<a id="appendix-a05"></a>

## Appendix A05

- Claim: Anthropic's Managed Agents architecture is explicitly about safer, more durable, and more controllable long-running agent execution.
- [Anthropic Engineering: Scaling Managed Agents: Decoupling the brain from the hands](https://www.anthropic.com/engineering/managed-agents)

---

<a id="appendix-a06"></a>

## Appendix A06

- Claim: OpenAI's updated Agents SDK pushes in the same direction with separated harness/compute and native sandbox execution.
- [OpenAI: The next evolution of the Agents SDK](https://openai.com/index/the-next-evolution-of-the-agents-sdk/)
