---
marp: true
theme: ai-night
paginate: true
size: 16:9
title: The New AI Control Plane
description: A June 2026 scan of OS-native assistants, frontier AI access controls, and AI-search distribution
author: AI Night
footer: AI Night Meetup | June 2026
---

<!-- _class: lead -->

# The New AI Control Plane

Why this June window matters more than another model leaderboard

<!-- cover-links -->

---

## How To Read This Window

- The interesting shift is not just better models; it is who controls the interface, the access layer, and the discovery path. <sup><a href="#appendix-a01">A01</a></sup><sup><a href="#appendix-a03">A03</a></sup><sup><a href="#appendix-a04">A04</a></sup><sup><a href="#appendix-a05">A05</a></sup>
- Apple is pushing AI down into the OS, Anthropic is turning frontier capability into a governed product tier, and Adobe is treating AI answers as a new traffic surface. <sup><a href="#appendix-a01">A01</a></sup><sup><a href="#appendix-a02">A02</a></sup><sup><a href="#appendix-a03">A03</a></sup><sup><a href="#appendix-a05">A05</a></sup>
- That is a control-plane story, not just a model-race story. <sup><a href="#appendix-a02">A02</a></sup><sup><a href="#appendix-a04">A04</a></sup>

---

## Apple Makes The Assistant The OS

- Siri AI now combines personal context, onscreen awareness, broad web answers, and systemwide app actions across Apple devices. <sup><a href="#appendix-a01">A01</a></sup>
- Apple is explicitly splitting execution between on-device foundation models and Private Cloud Compute, making privacy architecture part of the product. <sup><a href="#appendix-a01">A01</a></sup>
- The rollout limits matter too: Siri AI is gated by newer hardware, delayed on iOS and iPadOS in the EU, and unavailable initially in China. <sup><a href="#appendix-a01">A01</a></sup>

---

## Anthropic's Bigger Claim Is Acceleration

- Anthropic says Claude now authors more than 80% of the code it merges to production. <sup><a href="#appendix-a02">A02</a></sup>
- Anthropic also says its typical engineer was merging about 8x as much code per day in Q2 2026 as in 2024, though it notes lines of code are an imperfect productivity measure. <sup><a href="#appendix-a02">A02</a></sup>
- The core argument is that the real governance problem is no longer a single model demo, but AI systems increasingly helping build their successors. <sup><a href="#appendix-a02">A02</a></sup>

---

## Fable 5 Is A Product-Design Signal

- Anthropic launched Fable 5 as a public Mythos-class model with classifiers that fall back to Opus 4.8 on cyber, biology and chemistry, and distillation-related requests. <sup><a href="#appendix-a03">A03</a></sup>
- It paired that launch with a mandatory 30-day trust-and-safety retention requirement for Mythos-class traffic to investigate jailbreaks and other misuse patterns that emerge across many requests. <sup><a href="#appendix-a03">A03</a></sup>
- Frontier access is now being sold with safety classifiers, retention terms, and trusted-access programs built into the SKU. <sup><a href="#appendix-a03">A03</a></sup>

---

## Then The Access Layer Became Politics

- On June 12, Anthropic said a U.S. export-control directive suspended access to Fable 5 and Mythos 5 by any foreign national, including foreign national Anthropic employees, and that the net effect was disabling the models for all customers. <sup><a href="#appendix-a04">A04</a></sup>
- Reuters then reported Microsoft was limiting employee use over the new retention policy while G7 leaders discussed a "trusted partners" path to broader access to advanced U.S. AI models. <sup><a href="#appendix-a04">A04</a></sup>
- The broader point is hard to miss: frontier-model availability is becoming a geopolitical control surface. <sup><a href="#appendix-a04">A04</a></sup>

---

## Adobe Thinks The Next SEO War Is AI Answers

- Adobe Brand Visibility combines Semrush AI visibility data with Adobe content-optimization workflows to show how brands appear across ChatGPT, Google AI Mode, Microsoft Copilot, and Perplexity. <sup><a href="#appendix-a05">A05</a></sup>
- Adobe says the product draws on nearly 300 million real-world AI search prompts and can connect optimization actions to bookings, pipeline, and revenue. <sup><a href="#appendix-a05">A05</a></sup>
- That is a strong sign that AI-mediated discovery is mature enough to get its own enterprise software category. <sup><a href="#appendix-a05">A05</a></sup>

---

## What Builders Should Watch Next

- Control is moving to three places at once: OS interfaces, access and governance layers, and AI-native discovery. <sup><a href="#appendix-a01">A01</a></sup><sup><a href="#appendix-a03">A03</a></sup><sup><a href="#appendix-a04">A04</a></sup><sup><a href="#appendix-a05">A05</a></sup>
- Products will differentiate less by "best model" alone and more by what can be trusted, deployed, and discovered. <sup><a href="#appendix-a02">A02</a></sup><sup><a href="#appendix-a04">A04</a></sup><sup><a href="#appendix-a05">A05</a></sup>
- The next quarter's question is not who has the smartest demo; it is who owns the control plane around it. <sup><a href="#appendix-a01">A01</a></sup><sup><a href="#appendix-a04">A04</a></sup><sup><a href="#appendix-a05">A05</a></sup>

---

## Appendix

Use the superscript links on factual bullets to jump to the supporting appendix page.

---

<a id="appendix-a01"></a>

## Appendix A01

- Claim cluster: Apple is turning Siri into an OS-native AI layer with personal context, onscreen awareness, system actions, Private Cloud Compute, and region-specific rollout limits.
- [Apple: WWDC26: Apple unveils next generation of Apple Intelligence, Siri AI, powerful parental controls, and an expansive set of software improvements](https://www.apple.com/newsroom/2026/06/apple-unveils-next-generation-of-apple-intelligence-siri-ai-and-more/)
- [Apple: Apple introduces Siri AI, a profoundly more capable and personal assistant](https://www.apple.com/newsroom/2026/06/apple-introduces-siri-ai-a-profoundly-more-capable-and-personal-assistant/)

---

<a id="appendix-a02"></a>

## Appendix A02

- Claim cluster: Anthropic argues AI is already accelerating AI development internally and that recursive self-improvement is becoming a serious governance question.
- [Anthropic Institute: When AI builds itself](https://www.anthropic.com/institute/recursive-self-improvement)
- [TechTimes: Anthropic Calls for Global Pause on AI Development Amid Rising Concern Over Self-Improving Models](https://www.techtimes.com/articles/317803/20260605/anthropic-calls-global-pause-ai-development-amid-rising-concern-over-self-improving-models.htm)

---

<a id="appendix-a03"></a>

## Appendix A03

- Claim cluster: Fable 5 was launched as a public Mythos-class product tier with built-in guardrails, fallbacks, retention, and trusted-access framing.
- [Anthropic: Claude Fable 5 and Claude Mythos 5](https://www.anthropic.com/news/claude-fable-5-mythos-5)
- [Reuters: Anthropic rolls out public version of Mythos without cybersecurity capability](https://www.reuters.com/technology/anthropic-rolls-out-public-version-mythos-without-cybersecurity-capability-2026-06-09/)

---

<a id="appendix-a04"></a>

## Appendix A04

- Claim cluster: After launch, Fable 5 and Mythos 5 became a live policy and geopolitical access dispute involving retention, foreign-national restrictions, and a possible trusted-partners scheme.
- [Anthropic: Statement on the US government directive to suspend access to Fable 5 and Mythos 5](https://www.anthropic.com/news/fable-mythos-access)
- [Reuters: Microsoft limits employee use of Anthropic's Claude Fable 5 over data retention concerns, The Verge reports](https://www.reuters.com/technology/microsoft-limits-employee-use-anthropics-claude-fable-5-over-data-retention-2026-06-10/)
- [Reuters: G7 leaders discuss 'trusted partners' access to cutting-edge US AI models, sources say](https://www.reuters.com/legal/government/g7-leaders-discuss-trusted-partners-access-cutting-edge-us-ai-models-sources-say-2026-06-16/)

---

<a id="appendix-a05"></a>

## Appendix A05

- Claim cluster: Adobe is productizing AI-search visibility as an enterprise workflow category, combining prompt-level visibility data with content optimization and revenue measurement.
- [Adobe: Introducing Adobe Brand Visibility: A Unified Solution for the AI Search Era](https://news.adobe.com/news/2026/06/introducing-adobe-brand-visibility)
