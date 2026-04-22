# Case Studies — Copy Source of Truth

---

## Spritz Finance

**Role:** Principal Product Designer
**Timeline:** Nov 2024 – Nov 2025
**Teams:** Product, Engineering, Marketing

Spritz bridges the gap between crypto and everyday financial life, allowing users to pay bills, off-ramp to their bank, and spend globally via a Visa card, all funded by crypto. I joined as the sole product designer at a pivotal moment, just as a new brand identity had been developed by an external agency and the entire product needed to be rebuilt around it. Over the following year, I led design across the full app suite, establishing the system foundations and carrying that through into every major feature and flow across the product.

### Brand & Design System

The new brand marked a decisive shift in how Spritz positioned itself. What had previously felt like a soft, fintech-adjacent product became darker, more restrained, and aligned with crypto-native expectations. My role was to translate that identity into a system that could support a complex and rapidly evolving product surface. I designed Aperol, a comprehensive design system built in Figma that defined colour, typography, iconography, variables, and a complete component library. Motion was treated as a first class concern, with interaction behaviour defined through spring physics so that overlays and transitions felt consistent and responsive across contexts. The system was adopted across design, engineering, and marketing, becoming the shared foundation for how the product was built, extended, and maintained.

**Carousel captions:**
- Aperol design system. Covering foundations, variables, and a full component library built for scale.
- Motion specification. Using spring physics to define consistent interaction behaviour across the product.
- Dashboard before and after. Showing the shift from a softer fintech aesthetic to a more restrained, crypto-native language.

### Onboarding & KYC

Spritz served two fundamentally different audiences, crypto-native users connecting wallets and new users entering through more traditional signup methods. I designed a unified authentication flow that handled both without compromise, supporting email, Google, Apple, and wallet connections across multiple chains within a single coherent entry point. Early in the experience, a welcome screen captured user intent and routed users based on their goals, feeding directly into backend segmentation and lifecycle systems to create a clearer connection between onboarding and long-term engagement. KYC had previously been fragmented across the product, appearing in different forms depending on where users encountered it. I consolidated this into a single, predictable flow that could be invoked consistently wherever verification was required, reducing confusion and improving completion. A persistent getting started checklist anchored the early experience, tracking progress across account creation, verification, and first transaction while reinforcing momentum through visible rewards.

**Carousel captions:**
- Unified authentication flow. Supporting both traditional and wallet-based entry points.
- Intent capture. Routing users based on goals and feeding segmentation data into lifecycle systems.
- KYC pre-screen. Setting expectations before entering verification.
- Getting started checklist. With progress tracking, error states, and reward incentives.

### Cards

The Spritz card was one of the most complex areas of the product and did not fully exist when I joined. I designed the experience end to end, shaping the journey from initial selection through onboarding, activation, and ongoing management. Users were guided through card type decisions with clear trade-offs surfaced in context, followed by compliance requirements and a structured onboarding sequence that made the process legible without oversimplifying it. The experience accounted for multiple states over time, from application through to delivery and activation, ensuring that users always understood where they were without needing to navigate across different parts of the product. The payment flow unified wallet pay and blockchain pay into a single surface, handling asset selection, rewards, fees, and confirmation within a mobile-optimised layout. The intention was to remove fragmentation and allow complex actions to be completed within a single, coherent context.

**Carousel captions:**
- Card selection. Virtual and physical options presented with clear trade-offs.
- Custom card design. The Spritz Visa across physical and virtual formats.
- Progressive card states. Reflecting status from application to activation.
- Activation flow. With delivery context and simple verification.
- Card detail. Combining controls, wallet integration, and transaction history.

### Core Flows

Off-ramp was the primary revenue driver, yet the existing experience was shallow and disconnected. I redesigned it as a complete account management surface, introducing method selection, settlement transparency, and localisation for markets such as South America. The core payment flow was rebuilt from the ground up, replacing an inconsistent and fragile implementation with a single, coherent interface that handled crypto asset selection, fiat conversion, rewards, fees, and context-specific actions. This structure was applied consistently across off-ramp, bill pay, card top-up, and crypto purchases, creating a shared logic across the product. Other flows followed the same approach. Bill pay surfaced key information such as balances and due dates more clearly, while swaps were simplified into a focused single-screen experience that reduced friction between intent and completion.

**Carousel captions:**
- Off-ramp. Redesigned as a full account management surface with settlement clarity and market localisation.
- Payment flow. Unifying wallet and blockchain interactions in a single responsive interface.
- Bill pay. With clearer structure and reduced friction.
- Swaps. Supporting cross-chain transactions with simplified confirmation.

### Growth & Retention

Growth work focused on creating direct feedback loops and making incentives more legible. I introduced a persistent in-app feedback mechanism that gave users a direct line to the team from anywhere in the product. The framing encouraged users to explain how they would use a feature and why, filtering for more useful signal and becoming a valuable internal input. The referral system and rewards dashboard were refined to make progress and incentives easier to understand and act on. During a period where a third-party provider froze user funds, I designed a dedicated crisis communication interface that clearly separated itself from the core product experience. The emphasis was on clarity and trust, explaining the situation directly while guiding users through recovery options in a controlled and compliant way.

**Carousel captions:**
- In-app feedback. Designed to capture high-quality user input.
- Referral & Rewards. With clearer progress and incentive structures.
- Crisis communication. Designed for clarity, separation, and trust.

### Outro

Spritz was a full system rebuild delivered by a single designer across brand, product, and growth. The work established a consistent foundation across a complex surface area spanning payments, compliance, and crypto interactions. The most meaningful outcome was not any individual feature, but the coherence of the system as a whole, creating a product that felt deliberate, legible, and scalable, and providing a foundation the team could continue to build on.

---

## Journey (YC W21)

**Role:** Senior Product Designer
**Timeline:** Sep 2022 – Dec 2023
**Teams:** Founders, Product, Engineering, AI/ML

Journey helped teams explain complex ideas at the moments that matter most, whether onboarding, proposals, or introductions where clarity directly shapes outcome. I co-led the design of Journey 2.0 alongside the founding designer, rethinking the product as a flexible block-based system supported by integrated AI and a deeper analytics layer. The architecture we established became the foundation inherited by the acquiring company following Journey's acquisition.

### Understanding the Space

To ground the work, I audited products such as Notion, Pitch, and Coda to understand how leading tools approached flexible content creation. A consistent pattern emerged. While these tools had evolved powerful systems for authorship, they largely neglected the reading experience. Structure, pacing, and clarity for the recipient were often secondary considerations.

Journey approached the problem differently. The goal was not only to give creators flexibility, but to ensure that what they produced was clear and compelling when consumed. Designing for both sides of that equation became a defining principle for the product.

**Carousel captions:**
- Competitive analysis highlighting the gap between flexible creation and effective reading experiences.
- Reader experience comparison showing how existing tools prioritised authorship over consumption.

### Design Direction

The core shift was moving away from rigid presentation structures toward something more fluid. A block-based canvas allowed structure to emerge from content rather than forcing content into predefined layouts. This enabled creators to move non-linearly, combining text, media, and interactive elements in ways that reflected how ideas are actually communicated.

Onboarding was designed to meet users at different levels of confidence. Some needed structure, others needed speed, and others needed a place to start. Multiple entry points addressed this directly, allowing creators to begin with templates, generate drafts using AI, or start from a blank canvas without friction.

To support visual coherence, I designed an intelligent theming system that could derive brand identity from a company domain. This allowed every Journey to feel considered and aligned without requiring design expertise, reducing the gap between intention and execution.

**Carousel captions:**
- Block canvas editor enabling modular, non-linear storytelling.
- Onboarding entry points supporting templates, AI generation, and blank canvas workflows.
- Automated theming system generating brand coherence from a company domain.

### Validation

We tested multiple approaches to both the canvas and the onboarding experience. Variations ranged from more structured layouts to fully open systems, as well as different ways of introducing users to the product. The combination of a block-based canvas with guided entry points consistently performed best. Users reached their first publish faster, abandoned less frequently at the blank state, and reported greater confidence in what they were creating.

**Carousel captions:**
- Usability testing sessions observing interaction across different canvas approaches.
- Performance metrics showing improved time to first publish with guided onboarding.

### Solution

Replacing the fixed slide model with a fluid block system allowed creators to assemble narratives that adapted naturally to context. Text, video, embeds, and interactive elements could be combined freely, with the layout responding across screen sizes without manual adjustment. The result was a format that felt less like a presentation and more like a living document, capable of expanding or contracting depending on the needs of the moment.

The reading experience was designed with equal care. Content was structured for clarity, pacing, and engagement, ensuring that recipients could move through ideas without friction regardless of device or depth of interaction.

**Carousel captions:**
- Journey 2.0 introducing a responsive, context-aware storytelling format.
- Recipient experience designed for clarity, pacing, and engagement.
- Interactive content blocks enriching narrative depth.

### AI Across the Full Loop

AI was integrated across both creation and consumption, rather than treated as an isolated feature. On the creation side, users could describe what they wanted to communicate and receive a structured draft that could be refined in context. Inline tools allowed for iterative editing at the level of individual blocks, supporting a more fluid workflow.

On the consumption side, an Ask Anything panel allowed recipients to query the content directly, transforming reading into an interactive experience. Each of these surfaces was designed to feel native to the product, ensuring that AI enhanced the workflow rather than interrupting it.

**Carousel captions:**
- AI-assisted creation enabling rapid drafting of structured narratives.
- Inline editing tools supporting contextual refinement.
- Ask Anything panel allowing readers to interact directly with content.

### Analytics

A redesigned analytics layer gave creators visibility into how their content was being experienced. Engagement could be understood at the level of individual blocks, revealing where attention was sustained and where it dropped off. Reader behaviour, time spent, and interaction patterns became visible in a way that had previously been opaque.

This turned each Journey into a feedback loop. Instead of publishing and guessing, creators could observe how their ideas landed and refine accordingly.

**Carousel captions:**
- Analytics dashboard providing a comprehensive view of engagement.
- Block-level metrics showing where attention is gained or lost.
- Reader journey visualisation identifying drop-off points.

### Impact

The redesign led to faster time to first publish by aligning onboarding with different user needs and reducing friction at the starting point. Blank state abandonment decreased as creators were given clearer ways to begin, whether through templates or AI-assisted drafts. The block-based system increased confidence by allowing ideas to take shape more naturally, while AI features deepened both creation and consumption. The resulting architecture became the strategic foundation for acquisition, with the 2.0 system forming the basis of what the acquiring team inherited.

**Carousel captions:**
- Engagement metrics showing improved creator and reader behaviour.
- Acquisition timeline highlighting the product's strategic value.
- System architecture supporting scalability and future development.

### Outcome

Journey reinforced the importance of designing for both creation and consumption as a single system. By combining flexibility, intelligence, and clear feedback loops, the product enabled teams to communicate complex ideas with greater clarity and confidence.

---

## Kurtosys

**Roles:** Product Designer – Lead Product Designer
**Timeline:** Nov 2018 – Feb 2021
**Teams:** Product, Engineering, Marketing, Client Services

Kurtosys is a digital experience platform for the asset management industry, enabling fund managers to distribute data, documents, and insights to institutional investors globally. I joined in 2018 as a product designer and grew into the role of lead product designer, ultimately becoming responsible for the design language, core platform, and key client experiences across the business.

### From Fragmentation to System

My first project was a reporting tool for BNY Mellon. It was already underway, but lacked coherence in both product thinking and execution. I took ownership of the design and, in parallel, began contributing directly to the frontend codebase. That overlap quickly became a defining advantage. Decisions collapsed faster, feedback loops tightened, and the quality of the product improved as design and implementation moved together rather than in sequence.

At the same time, I began refining the core platform. What started as small visual adjustments exposed deeper structural issues. The product had evolved without a unifying logic, with multiple navigation systems, inconsistent branding, and no shared hierarchy across the interface. I approached it as a system problem, working layer by layer through typography, colour, layout, and components until the product resolved into a single, coherent language. This work led to a promotion into the core product team, with responsibility for design across the entire platform.

**Carousel captions:**
- Before. The platform showing fragmented navigation, overlapping product identities, and no shared hierarchy.
- After. The application resolved into a unified shell with a consistent type system and a single navigation model.
- Design System. Foundational components and patterns used across product and marketing.

### A System Designed to Scale

As the company grew, consistency became an operational requirement rather than a visual preference. I built the Kurtosys Design System as a shared foundation across design, engineering, and marketing, defining typography, colour, iconography, and a comprehensive component library that extended from core interface elements to complex data visualisation patterns.

The system went beyond interface components. I designed a modular library of financial charts and ESG reporting tools, along with a catalogue of composable Studio Apps that allowed teams to assemble client-facing products without writing code. For a company of roughly 200 people, it became the single source of truth for how Kurtosys products were built and experienced.

**Carousel captions:**
- Foundations. Typography, colour, and core visual language.
- Component Library. Reusable interface patterns built for scale.
- Data Visualisation System. Financial and ESG reporting.
- Studio Apps. Modular composition of client experiences.

### Kapital: One System, Many Expressions

On top of this foundation, I designed Kapital, a white-label product layer that allowed Kurtosys to deploy tailored client portals from a shared system. The architecture was deliberately simple. A single system was extended into multiple branded implementations, allowing each client to express their identity while inheriting the same underlying structure, components, and interaction patterns.

Clients including BNP Paribas, SALI, OP, and BNY Mellon each received a distinct visual language, while the core experience remained consistent. The product surface covered the full investor journey, including dashboards, fund discovery, portfolio tools, document management, and advanced analytics. One of the more complex features was the Optimizer, a two-step portfolio construction tool based on mean-variance optimisation. It allowed users to define constraints, explore the efficient frontier, and apply portfolio allocations directly. Every surface, including responsive and print outputs, was designed as part of a cohesive system.

**Carousel captions:**
- Architecture. A shared system branching into client-specific implementations.
- Template library. Login, dashboard, fund centre, portfolio tools, and document management, restyled per client.
- Optimizer. Constraint setup, efficient frontier exploration, and portfolio selection.
- Client Implementations. SALI, BNY Mellon, BNP Paribas, and OP.

### Designing at Institutional Scale

Client work introduced a different level of complexity, shaped by data density, regulation, and context. For SALI, I designed a full investor portal including authentication, portfolio tools, and administrative controls suited to a regulated environment. For BNY Mellon, I designed next-generation portfolio analytics and reporting tools, including large-scale correlation matrices and scenario analysis across dozens of funds. This pushed the limits of conventional interface design, requiring clarity under extreme data density.

For BNP Paribas, I adapted the system to support ESG-focused investment products, aligning the experience with their brand and strategy. For OP, I led multi-directional design explorations, developing and refining parallel concepts in close collaboration with the client. Across all engagements, the goal remained consistent. Complex financial systems needed to feel structured, legible, and usable.

**Carousel captions:**
- SALI Portal. Investor portal with fund discovery and portfolio tools.
- BNY Mellon. Performance analytics with interactive comparison.
- Complex Print Reports. High-density data visualisation across large fund sets.
- BNP Paribas Portal. ESG-focused portal experience.
- OP Portal. Design exploration across multiple directions.

### Extending the System Beyond Product

Later, my scope expanded into brand and marketing. I worked alongside an external brand lead on a company rebrand and later took full ownership, redesigning and building the Kurtosys website end-to-end. The work extended across product marketing, case studies, and a full documentation ecosystem including knowledge base and API documentation.

I also brought the design system into WordPress, aligning marketing output with the same principles used in the product. By the time I left, I was responsible for the full design surface of the company, spanning product, platform, brand, and client work.

**Carousel captions:**
- Website. Marketing pages and product narratives.
- Documentation. Knowledge base and API reference.
- Platform. Design system applied across the live product.
- System View. All components and visual language in a single context.

### Outro

I joined Kurtosys as a designer who could code and left having defined the systems that shaped the company's product and client experiences. The most meaningful outcome was not a single feature or release, but the adoption of a shared design language across the organisation and a system that continued to scale after I left.

---

## Peach Payments

**Role:** Senior Product Designer
**Timeline:** Mar 2021 – Sep 2022
**Teams:** Design lead across a three-person design function

Peach Payments is a payment orchestration platform serving Africa's leading enterprise merchants — from Superbalist and Travelstart to Computicket and iStore Group. When a new head of product joined from the US with a mandate to elevate design as a core function, he recruited me from Kurtosys to lead it. I joined in March 2021 as Senior Product Designer and spent the next 19 months building the design foundation the company needed to scale: a new brand direction, a cross-product design system, a rebuilt merchant dashboard, a redesigned onboarding flow, and a customer-facing checkout that finally worked on mobile.

### Brand & Design System

Peach was at the start of a rebrand when I joined. I helped narrow the agency shortlist, worked with the chosen agency to define the brand direction, then took over the inhouse execution alongside the marketing lead. The brand that emerged had energy but also tension — the bold, playful tone the marketing team favoured didn't always translate cleanly into product, where merchants needed to feel in control of serious financial operations. I defined a separate product aesthetic: more restrained, more precise, with the brand colour used as an accent rather than a statement.

From that product direction I built Peach Core — the core design system for all Peach Payments products. Peach Core covered foundations (8px spacing system, border radius, colour palette including a dynamic merchant token, typography scale, baseline grid), and a complete component library of 25+ components adopted by engineering across the dashboard, checkout, and marketing website. It wasn't just a Figma file — it became the shared visual language for everything the company shipped.

**Carousel captions:**
- Peach Core. The core design system for all Peach Payments products, designed in Figma.
- Foundations. Spacing multiples, 8px border radius, semantic colour palette, typography scale, baseline grid.
- Component Library. 25+ components including Alert, Button, Date picker, Modal, Table, Skeleton loader, Toast, and more.
- Full Component List. Production-complete coverage from Avatar to Tooltip.

### Dashboard

The merchant console I inherited was engineering-led, bloated, and clearly undesigned. Navigation read like a sitemap. Data was presented without hierarchy. Merchants complained, support tickets were high, and the product showed no evidence of design thinking at any meaningful level. The brief I set for myself was to replace it entirely.

The new dashboard was built as a full merchant operations platform. At its centre is a transactions surface with search, date filtering, advanced filters, a summary row that reflects active filter state, and a slide-out detail panel showing a rendered card visual, full customer and payment information, a complete audit timeline, and an inline refund flow. Payment Links brought the same pattern to link-based commerce — creation, multi-channel dispatch, status tracking, and settings in a coherent system. Team management introduced role-based permissions with a live preview of what each role grants before invites are sent.

Two decisions defined the product's character. The first was merchant theming: instead of logos, each merchant account gets a generated industry icon in a colour accent derived from their own brand. It kept the interface clean across thousands of merchants while still feeling personal. The second was the mobile dashboard — intentionally scoped to monitoring rather than full operations, but genuinely designed rather than reflowed. I also wrote production TypeScript alongside the engineering team, doing pixel-perfect frontend polish myself rather than accepting anything less through back-and-forth handoff.

**Carousel captions:**
- Before. Engineering-led, flat hierarchy, basic bar chart, no design system, beta banner still visible.
- Org Picker. Multi-entity architecture, industry icons, real merchants including iStore Group and Cape Union Mart Group.
- Transactions. Populated table, summary row with filter-aware totals, status pills, payment brand logos.
- Transaction Detail. Rendered card visual, customer details, payment info, audit timeline across Details and Updates tabs.
- Refund. Amount field with available balance, reason, free-text notes, appropriately weighted destructive CTA.
- Advanced Filters. Amount comparator, status, brand, transaction type — power-user depth without cluttering the default view.
- Payment Links. List view with sending channel badges, link detail across three tabs, create flow with live preview and file attachments.
- Team Settings. Role-based permission builder with live permission preview, member detail panel, destructive action confirmation modals.
- Mobile. iStore Cape Town instance, transaction list with currency flags, intentionally scoped for monitoring.
- Component Systems. Two product-specific libraries both drawing from Peach Core as foundation.

### Onboarding

Merchant onboarding was the first point of real friction in the Peach relationship. The existing flow generated significant drop-off and support load, partly because the product made no effort to orient new merchants or accommodate the range of business types that needed to sign up. The redesigned flow runs across five steps — Business information, Configuration, Business verification, Bank verification, Activate — with four distinct journey variants branching by business type: main, SME, registered business, and manual entry.

Every step was designed for both desktop and mobile from the outset. A persistent contextual help panel sits alongside the form on desktop, offering relevant links and a live chat trigger at each stage. The generated merchant icon appears from the first field entry, giving the brand identity a presence before onboarding is complete. Copy was written to feel human rather than procedural. The final activation step surfaces a full business summary before the commit, and the post-submission state sets clear expectations for what happens next. The redesign produced a measurable reduction in onboarding drop-off.

**Carousel captions:**
- Step 1. Business information, with the generated industry icon appearing from the first field entry and the contextual help panel alongside.
- Mobile. Sidebar nav, thumb-friendly form layout, consistent merchant identity across breakpoints.
- Business Verification. Minimal, focused step with manual verification escape hatch.
- Activate. Business summary accordion, terms of use, final commit with full pre-activation review.
- Post-Submission. Three-card next steps sequence setting expectations for review, integration, and first settlement.
- Flow Map. Four journey variants (Main, SME, Registered business, Manual entry) with desktop and mobile states across all steps.

### Checkout

The customer-facing checkout is the moment Peach's work becomes visible to millions of end consumers — every shopper paying through a Peach-powered merchant touches it. When I arrived it had been overlooked. Mobile in particular was unpolished in ways that showed: nobody had cared enough to close the gap between what was designed and what was implemented.

The redesigned checkout runs in three steps: select payment method, enter card details, confirm billing address. Apple Pay leads as a native full-width CTA where available. Alternative methods — Card, EFT Secure, Masterpass, 1Voucher, Mobicred — are presented in a clean grid with brand logos. A thin progress bar advances across the top of each step, keyed to the merchant's brand colour. CTAs shift colour at the final commit step — blue to green — signalling that something irreversible is about to happen. The success state is calm and clear, with an auto-redirect countdown and a manual fallback. I wrote the frontend TypeScript to bring the implementation to pixel-perfect standard where engineering capacity and technical constraints limited what could be pushed through normal handoff.

**Carousel captions:**
- Step 1. Payment method selection, Apple Pay as primary CTA, alternative methods in branded grid.
- Step 2. Card detail entry with real-time card brand detection, clean three-column secondary row.
- Step 3. Billing address confirmation, CTA shifts to green for the final payment commit.
- Success. Green checkmark, clear redirect messaging, calm and uncluttered.
- Mobile. All five states across iPhone Safari, genuinely adapted for touch rather than reflowed from desktop.

### Outro

Peach had the ingredients to build something good — the merchant base, the product breadth, the ambition. What it lacked was design infrastructure. In 19 months I built the system that gave the company a shared visual language, redesigned the products that mattered most to merchants and end customers, and raised the standard of what shipping meant at Peach. The work I did on Peach Core outlasted my tenure. The company has since raised significant funding and continued to grow. The foundation held.
