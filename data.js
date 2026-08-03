/* ==========================================================================
   MERIDIAN — CONTENT DATA
   --------------------------------------------------------------------------
   Every piece of reference content on the page lives here so it can be
   updated without touching behaviour. Dates are ISO strings; the page derives
   past / next / future states from the clock at render time.

   Currency note: content reflects the position as at 3 August 2026. Regulatory
   dates move — verify against the issuing body before relying on any of it.
   ========================================================================== */
(function (global) {
  'use strict';

  /* ------------------------------------------------------------------------
     1. REGULATORY HORIZON
     EU AI Act milestones as amended by the Digital Omnibus on AI, adopted by
     Parliament on 16 June 2026 and the Council on 29 June 2026.
     ------------------------------------------------------------------------ */
  const HORIZON = {
    axisStart: '2024-08-01',
    axisEnd: '2028-08-02',
    milestones: [
      {
        date: '2024-08-01',
        title: 'AI Act enters into force',
        note: 'Regulation (EU) 2024/1689',
        flag: 'In force'
      },
      {
        date: '2025-02-02',
        title: 'Prohibitions and AI-literacy duties apply',
        note: 'Article 5 · Article 4',
        flag: 'Applied'
      },
      {
        date: '2025-08-02',
        title: 'General-purpose AI model obligations apply',
        note: 'Chapter V',
        flag: 'Applied'
      },
      {
        date: '2026-08-02',
        title: 'Transparency duties apply',
        note: 'Article 50 — chatbot disclosure, synthetic-media marking',
        flag: 'Applied'
      },
      {
        date: '2026-12-02',
        title: 'Marking duties reach legacy systems',
        note: 'Article 50(2) · new Article 5 prohibitions',
        flag: 'Next'
      },
      {
        date: '2027-08-02',
        title: 'Member States must run an AI regulatory sandbox',
        note: 'Article 57 · at least one per State',
        flag: 'Scheduled'
      },
      {
        date: '2027-12-02',
        title: 'High-risk duties apply — Annex III',
        note: 'Standalone systems · deferred 16 months',
        flag: 'Scheduled'
      },
      {
        date: '2028-08-02',
        title: 'High-risk duties apply — Annex I',
        note: 'AI embedded in regulated products, including medical devices',
        flag: 'Scheduled'
      }
    ]
  };

  /* ------------------------------------------------------------------------
     2. JURISDICTIONS
     lat / lon are real; the map projects them, so markers cannot drift out of
     sync with the text.
     ------------------------------------------------------------------------ */
  const JURISDICTIONS = [
    {
      id: 'eu',
      code: 'EU',
      name: 'European Union',
      short: 'European Union',
      instrument: 'AI Act, as amended by the Digital Omnibus',
      posture: 'Horizontal statute',
      lat: 50.85, lon: 4.35,
      thesis: 'The only jurisdiction regulating AI as a product category in its own right. For clinical AI it layers on top of the medical-device regime rather than replacing it.',
      rows: [
        ['Regulator', 'European Commission AI Office, national market-surveillance authorities, and notified bodies under MDR / IVDR'],
        ['Instrument', 'Regulation (EU) 2024/1689, amended by the Digital Omnibus on AI (adopted June 2026)'],
        ['Clinical AI', 'Most AI inside a medical device is high-risk through Annex I, assessed alongside MDR / IVDR conformity — one device, two overlapping regimes'],
        ['Applies now', 'Prohibitions and AI-literacy duties since February 2025; general-purpose model duties since August 2025; Article 50 transparency since 2 August 2026'],
        ['Watch', 'Annex I high-risk duties moved to 2 August 2028; Annex III standalone systems to 2 December 2027'],
        ['Exposure', 'Up to €35m or 7% of worldwide turnover for prohibited practices; €15m or 3% for high-risk and transparency breaches']
      ],
      link: 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj',
      linkLabel: 'Consolidated AI Act text, EUR-Lex'
    },
    {
      id: 'us',
      code: 'US',
      name: 'United States',
      short: 'United States',
      instrument: 'FD&C Act, HIPAA, and 50 state legislatures',
      posture: 'Sectoral, plus a state patchwork',
      lat: 38.9, lon: -77.04,
      thesis: 'No comprehensive federal AI statute. Device law governs the software, HIPAA governs the data, and the states govern the clinical decision — which is where the obligations are multiplying fastest.',
      rows: [
        ['Regulator', 'FDA (CDRH) for devices; HHS Office for Civil Rights for HIPAA; FTC for unfair or deceptive practices; state attorneys general'],
        ['Instrument', 'Food, Drug, and Cosmetic Act via 510(k), De Novo and PMA pathways, with Predetermined Change Control Plans for bounded model updates'],
        ['Federal posture', 'Executive Order 14365 (11 December 2025) directs a DOJ AI Litigation Task Force and a preemption push. A ten-year state moratorium was stripped from the 2025 budget bill 99–1'],
        ['State layer', '43 states introduced more than 240 AI bills in the first months of 2026. California requires disclosure when generative AI drafts clinical communications; Illinois and Nevada bar AI-delivered therapy; Utah permits it with disclosure'],
        ['Payer AI', 'CMS has set guardrails for Medicare Advantage prior authorisation, and several states now require human review of AI-driven denials'],
        ['Watch', 'xAI v. Weiser, filed in the District of Colorado in April 2026, tests the preemption theory. Colorado’s replacement duties begin January 2027']
      ],
      link: 'https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-enabled-medical-device-list',
      linkLabel: 'FDA AI-enabled medical device list'
    },
    {
      id: 'ca',
      code: 'CA',
      name: 'Canada',
      short: 'Canada',
      instrument: 'Medical Devices Regulations and MLMD guidance',
      posture: 'Device law and privacy, no AI statute',
      lat: 45.42, lon: -75.7,
      thesis: 'Canada tried a horizontal AI statute and abandoned it. Device regulation and privacy law now carry the whole load, with a decisive shift towards lifecycle oversight in 2026.',
      rows: [
        ['Regulator', 'Health Canada for devices; the Privacy Commissioner under PIPEDA; provincial commissioners and colleges for clinical practice'],
        ['Instrument', 'Food and Drugs Act with the Medical Devices Regulations, plus Pre-market Guidance for Machine Learning-Enabled Medical Devices, published 1 April 2026'],
        ['What changed', 'Machine learning must be declared explicitly. Class II–IV submissions are expected to evidence data quality, bias management, transparency and ongoing performance monitoring, with Predetermined Change Control Plans recognised'],
        ['Also 2026', 'Expanded Terms and Conditions authority from 1 January 2026, published on the Regulatory Decision Summary page, and mandatory Regulatory Enrolment Process from 1 April 2026'],
        ['The gap', 'The Artificial Intelligence and Data Act died on the Order Paper in January 2025 and will not be revived. PIPEDA and provincial health-privacy statutes such as Ontario’s PHIPA and Alberta’s HIA govern the data'],
        ['Practice layer', 'Provincial colleges have begun issuing their own standards on AI in clinical practice, which bind physicians directly']
      ],
      link: 'https://www.canada.ca/en/health-canada/services/drugs-health-products/medical-devices/application-information/guidance-documents/pre-market-guidance-machine-learning-enabled-medical-devices.html',
      linkLabel: 'Health Canada MLMD pre-market guidance'
    },
    {
      id: 'uk',
      code: 'UK',
      name: 'United Kingdom',
      short: 'United Kingdom',
      instrument: 'UK MDR 2002 and the AI Airlock',
      posture: 'Regulator-led, sandbox first',
      lat: 51.5, lon: -0.13,
      thesis: 'No AI Act. The UK is deliberately building evidence inside a sandbox before legislating, and exporting the results into international alignment work.',
      rows: [
        ['Regulator', 'MHRA for devices, with NICE on evaluation, CQC on providers, and NHS England on deployment'],
        ['Instrument', 'UK Medical Devices Regulations 2002, reformed through the Software and AI as a Medical Device change programme'],
        ['AI Airlock', 'A regulatory sandbox launched in May 2024 pairing developers, approved bodies and the NHS. Phase 2 ran to spring 2026 and focused on risk classification, change management, and bias and fairness metrics. A further £3.6m over three years was committed in April 2026'],
        ['Watch', 'The National Commission into the Regulation of AI in Healthcare, chaired by Professor Alastair Denniston and launched on 26 September 2025, is due to report in 2026 and will shape the new framework'],
        ['Alignment', 'The UK co-chairs IMDRF work on AI and machine learning, and an international reliance framework now aligns the MHRA with the FDA, Health Canada and the TGA'],
        ['Shared principles', 'Good Machine Learning Practice, Predetermined Change Control Plans and transparency guidelines, developed jointly with the FDA and Health Canada']
      ],
      link: 'https://medregs.blog.gov.uk/',
      linkLabel: 'MHRA MedRegs, regulatory commentary'
    },
    {
      id: 'who',
      code: 'WHO',
      name: 'World Health Organization',
      short: 'WHO · Geneva',
      instrument: 'Ethics and governance guidance for health AI',
      posture: 'Normative guidance',
      lat: 46.22, lon: 6.14,
      thesis: 'Not binding on anyone, and the most widely adopted text in the field. WHO supplies the vocabulary that national regulators, procurement teams and ethics boards actually argue in.',
      rows: [
        ['Instrument', 'Ethics and governance of artificial intelligence for health (2021), setting out six consensus principles'],
        ['Generative AI', 'Guidance on large multi-modal models (January 2024) adds more than forty recommendations for governments, developers and providers, covering models already in clinical use'],
        ['Global agenda', 'The 79th World Health Assembly, meeting 18–23 May 2026, took up harmonisation of regulatory approaches, governance and standards for data, digital health and AI in the health sector'],
        ['Force', 'None directly. Its weight comes from adoption: the principles are cited in national guidance, ethics review, and procurement conditions'],
        ['Equity focus', 'Explicit attention to the gap between where models are built and where they are deployed, and to the risk of exporting tools validated on unrepresentative populations']
      ],
      link: 'https://www.who.int/publications/i/item/9789240084759',
      linkLabel: 'WHO guidance on large multi-modal models'
    },
    {
      id: 'cn',
      code: 'CN',
      name: 'China',
      short: 'China',
      instrument: 'Generative AI measures, labelling rules, NMPA review',
      posture: 'Prescriptive, at service level',
      lat: 39.9, lon: 116.4,
      thesis: 'Regulates the service and the content, not only the product. Filing, security assessment and labelling duties sit alongside device approval, and they arrived earlier than almost anywhere else.',
      rows: [
        ['Regulator', 'Cyberspace Administration of China for AI services; NMPA for medical devices; National Health Commission for clinical application'],
        ['Instrument', 'Interim Measures for the Management of Generative AI Services, in force 15 August 2023, with labelling rules for AI-generated content from 1 September 2025'],
        ['Devices', 'NMPA review guidance sets out expectations for AI-enabled medical device submissions, including algorithm updates'],
        ['Distinctive', 'Algorithm filing and registration, security assessment before public release, and content-provenance duties are all separate obligations from device approval'],
        ['Practical effect', 'Compliance is front-loaded into launch approval rather than post-market surveillance']
      ],
      link: 'https://www.nmpa.gov.cn/',
      linkLabel: 'National Medical Products Administration'
    },
    {
      id: 'in',
      code: 'IN',
      name: 'India',
      short: 'India',
      instrument: 'AI Governance Guidelines and the DPDP Act',
      posture: 'Techno-legal, voluntary first',
      lat: 28.61, lon: 77.21,
      thesis: 'A deliberate decision not to legislate an AI Act. Principles and institutions first, with binding force borrowed from data-protection and intermediary law.',
      rows: [
        ['Instrument', 'India AI Governance Guidelines, released by MeitY on 5 November 2025 under the IndiaAI Mission: seven guiding principles, three new institutions, and a stated preference for sandboxes and self-certification over mandates'],
        ['Health-specific', 'ICMR Ethical Guidelines for AI in Biomedical Research and Healthcare (2023) govern research use; CDSCO regulates devices'],
        ['What binds', 'The Digital Personal Data Protection Act 2023 for personal data, and 2026 amendments to the intermediary rules requiring synthetically generated content to be labelled or carry provenance metadata'],
        ['Institutions', 'An inter-ministerial AI Governance Group, a Technology and Policy Expert Committee, and an AI Safety Institute'],
        ['Watch', 'Whether the voluntary layer hardens into statute, and how sector regulators use sandboxes for high-risk deployments']
      ],
      link: 'https://indiaai.gov.in/',
      linkLabel: 'IndiaAI Mission'
    },
    {
      id: 'au',
      code: 'AUS',
      name: 'Australia',
      short: 'Australia',
      instrument: 'Therapeutic Goods Act and voluntary standard',
      posture: 'Existing law first, guardrails consulted',
      lat: -35.28, lon: 149.13,
      thesis: 'Technology-neutral by design: use the regulators you already have, and add statutory guardrails only where a real gap is demonstrated.',
      rows: [
        ['Regulator', 'Therapeutic Goods Administration for software as a medical device; OAIC for privacy'],
        ['Instrument', 'Therapeutic Goods Act with the SaMD framework, alongside a Voluntary AI Safety Standard published in September 2024'],
        ['Under consultation', 'Mandatory guardrails for AI in high-risk settings, covering testing, transparency, data governance, human oversight, accountability, incident reporting and conformity assessment'],
        ['Open question', 'Whether guardrails are folded into existing sectoral law, coordinated across regulators, or given a standalone Act with a dedicated regulator'],
        ['Capability', 'An Australian AI Safety Institute to provide independent technical analysis']
      ],
      link: 'https://www.tga.gov.au/',
      linkLabel: 'Therapeutic Goods Administration'
    },
    {
      id: 'au-cont',
      code: 'AU',
      name: 'African Union',
      short: 'African Union',
      instrument: 'Continental Artificial Intelligence Strategy',
      posture: 'Continental strategy, capacity first',
      lat: 9.03, lon: 38.74,
      thesis: 'The governance question here is not conformity assessment. It is whether tools validated elsewhere work at all on the populations that carry the largest share of global disease burden.',
      rows: [
        ['Instrument', 'Continental Artificial Intelligence Strategy, adopted in July 2024, with national strategies at varying stages across member states'],
        ['Emphasis', 'Capability, data infrastructure, skills and data sovereignty ahead of product conformity regimes'],
        ['Reality', 'Most member states have no AI-specific device pathway, so imported tools arrive with the validation evidence of their country of origin'],
        ['Why it matters', 'Models trained predominantly on high-income-country data are least reliable where they are most needed. Procurement conditions, not statutes, are where that gets fixed first'],
        ['Leverage', 'Regional harmonisation and pooled procurement give smaller regulators evidentiary demands they could not make alone']
      ],
      link: 'https://au.int/',
      linkLabel: 'African Union'
    }
  ];

  /* ------------------------------------------------------------------------
     3. ETHICS — the six WHO consensus principles, each paired with the
     failure it exists to prevent and the control that catches it.
     ------------------------------------------------------------------------ */
  const ETHICS = [
    {
      icon: 'M8 3v6a4 4 0 0 0 8 0V3M12 13v8M8 21h8',
      title: 'Protect human autonomy',
      body: 'People keep control of clinical decisions and of their data. Delegation to a model is a choice a patient and clinician make knowingly, not a default set by procurement.',
      fail: 'Consent collapses into a checkbox, and nobody tells the patient a model shaped the recommendation. The control is disclosure at the point of care and a human who can actually be reached.'
    },
    {
      icon: 'M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10z',
      title: 'Promote well-being, safety and the public interest',
      body: 'A tool has to improve outcomes for patients, not only throughput for the institution. Safety is a claim that has to keep being true after deployment.',
      fail: 'Performance decays as the population, scanner or workflow shifts, and nobody is watching. The control is prospective monitoring against a performance floor agreed before go-live.'
    },
    {
      icon: 'M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6zm10 2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
      title: 'Ensure transparency and intelligibility',
      body: 'Enough published information for a clinician to know what the tool was built for, what it was validated on, and where it should not be trusted.',
      fail: '“The model flagged it” enters the record with no version, inputs or confidence attached, so the decision cannot be reconstructed. The control is model documentation plus version logging in the health record.'
    },
    {
      icon: 'M12 3l8 4v6c0 4.4-3.4 7.4-8 8-4.6-.6-8-3.6-8-8V7l8-4zm-2.2 9.2l1.9 1.9 3.6-3.9',
      title: 'Foster responsibility and accountability',
      body: 'Someone is answerable when the tool contributes to harm, and that person is identifiable before anything goes wrong rather than after.',
      fail: 'Liability diffuses between vendor, health system and clinician until nobody owns the outcome. The control is a named accountable owner, contractual allocation of risk, and a real incident-reporting route.'
    },
    {
      icon: 'M9 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm9 3a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM2 20c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5M17 20c0-2 .6-3.5 2-4.4',
      title: 'Ensure inclusiveness and equity',
      body: 'The tool works across the population that will actually be exposed to it — by age, sex, ethnicity, comorbidity, language and care setting.',
      fail: 'Aggregate accuracy looks strong while performance quietly drops for the groups least represented in training data. The control is subgroup performance reporting, demanded as a condition of purchase.'
    },
    {
      icon: 'M21 12a9 9 0 1 1-3.3-7M21 3v6h-6',
      title: 'Promote responsive and sustainable AI',
      body: 'Tools are monitored, updated, and retired deliberately. Systems and staff are resourced for the work the tool creates as well as the work it removes.',
      fail: 'Pilots accumulate, none reach scale, and abandoned tools leave clinicians distrustful of the next one. The control is a decommissioning plan and honest total-cost accounting from the outset.'
    }
  ];

  /* ------------------------------------------------------------------------
     4. TIMELINE — soft law to binding statute, 2019 to 2028
     ------------------------------------------------------------------------ */
  const TIMELINE = [
    { date: 'May 2019', who: 'OECD', title: 'AI Principles adopted', body: 'The first intergovernmental standard on AI, and the source of the vocabulary — human-centred, transparent, robust, accountable — that later instruments inherit. Updated in 2024.' },
    { date: 'Jun 2021', who: 'WHO', title: 'Ethics and governance of AI for health', body: 'Six consensus principles for health AI, produced with a multidisciplinary expert group. Still the most cited normative reference in clinical AI governance.' },
    { date: 'Nov 2021', who: 'UNESCO', title: 'Recommendation on the Ethics of AI', body: 'Adopted by all member states, extending ethical commitments into education, research and cultural policy alongside health.' },
    { date: 'Jan 2023', who: 'NIST', title: 'AI Risk Management Framework 1.0', body: 'Govern, Map, Measure, Manage. Voluntary, and it became the operational spine of most enterprise AI risk programmes, including in health systems.' },
    { date: 'Aug 2023', who: 'China', title: 'Generative AI measures take effect', body: 'The Interim Measures for the Management of Generative AI Services impose filing, security assessment and content duties on providers — well ahead of comparable rules elsewhere.' },
    { date: 'Jan 2024', who: 'WHO', title: 'Guidance on large multi-modal models', body: 'More than forty recommendations addressing generative AI already circulating in clinical settings: diagnosis support, patient-facing symptom queries, clerical work, education and research.' },
    { date: 'May 2024', who: 'MHRA', title: 'AI Airlock opens', body: 'A regulatory sandbox for AI as a medical device, pairing developers with approved bodies and the NHS to generate evidence rather than wait for it.' },
    { date: 'Jul 2024', who: 'African Union', title: 'Continental AI Strategy adopted', body: 'A capacity-and-sovereignty framing of AI governance, aimed at building the conditions for safe adoption rather than only conditions for market entry.' },
    { date: 'Aug 2024', who: 'EU', title: 'AI Act enters into force', body: 'The first comprehensive horizontal AI regulation, with obligations phased across four years and clinical AI captured largely through the medical-device annex.' },
    { date: 'Sep 2024', who: 'Council of Europe', title: 'Framework Convention on AI opens for signature', body: 'The first binding international treaty on artificial intelligence, oriented to human rights, democracy and the rule of law.' },
    { date: 'Feb 2025', who: 'EU', title: 'Prohibitions and AI-literacy duties apply', body: 'Unacceptable-risk practices become unlawful, and providers and deployers must ensure staff operating AI systems are sufficiently AI-literate.' },
    { date: 'Aug 2025', who: 'EU', title: 'General-purpose AI model obligations apply', body: 'Documentation, copyright policy and systemic-risk duties attach to foundation-model providers — the layer most clinical generative tools are built on.' },
    { date: 'Nov 2025', who: 'EU · India', title: 'Two divergent moves in one month', body: 'The Commission proposes the Digital Omnibus on AI on 19 November, conceding that implementation is behind schedule. MeitY publishes India’s AI Governance Guidelines on 5 November, declining to legislate at all.' },
    { date: 'Dec 2025', who: 'US', title: 'Executive Order 14365', body: 'Directs a DOJ litigation task force against state AI laws, a Commerce review, and conditions on some federal funding — after a legislated moratorium failed in the Senate 99–1.' },
    { date: 'Apr 2026', who: 'Health Canada', title: 'Machine-learning device guidance published', body: 'Pre-market expectations for Class II–IV machine-learning devices, with change-control plans, bias management and lifecycle monitoring. Mandatory electronic submissions and expanded licence conditions land the same season.' },
    { date: 'Jun 2026', who: 'EU', title: 'Digital Omnibus on AI adopted', body: 'Parliament endorses the final text on 16 June and the Council approves on 29 June. High-risk deadlines move; transparency duties do not.' },
    { date: '2 Aug 2026', who: 'EU', title: 'Article 50 transparency duties apply', body: 'Disclosure that a person is interacting with an AI system, machine-readable marking of synthetic content, and notice for emotion-recognition and biometric-categorisation systems.' },
    { date: '2 Dec 2027', who: 'EU', title: 'Annex III high-risk duties apply', body: 'Standalone high-risk systems — including tools used in access to essential services — reach full compliance obligations after a sixteen-month deferral.', future: true },
    { date: '2 Aug 2028', who: 'EU', title: 'Annex I high-risk duties apply', body: 'AI embedded in products already regulated under EU product-safety law, medical devices among them. The last clock, and the one that governs most clinical AI.', future: true }
  ];

  /* ------------------------------------------------------------------------
     5. FOUR REGULATORY POSTURES
     dial = relative prescriptiveness, 1–5, for orientation only.
     ------------------------------------------------------------------------ */
  const COMPARE = [
    {
      flag: 'EU',
      title: 'Comprehensive statute',
      dial: 5,
      mech: 'A single risk-tiered law over all sectors, enforced through conformity assessment and turnover-based penalties.',
      rows: [
        ['Trigger', 'Risk tier of the intended use'],
        ['Clinical AI', 'High-risk via the medical-device annex'],
        ['Strength', 'One vocabulary, extraterritorial reach'],
        ['Strain', 'Standards and authorities arrived late; deadlines slipped twice']
      ]
    },
    {
      flag: 'US',
      title: 'Sectoral and state-led',
      dial: 2,
      mech: 'Device law for the software, privacy law for the data, and state statutes for the clinical and payer decision.',
      rows: [
        ['Trigger', 'Intended use, plus the patient’s state'],
        ['Clinical AI', 'Device pathway, or nothing at all'],
        ['Strength', 'Fast market entry, deep device expertise'],
        ['Strain', 'Conflicting state duties and an unresolved preemption fight']
      ]
    },
    {
      flag: 'CA · UK',
      title: 'Lifecycle device oversight',
      dial: 3,
      mech: 'No AI statute. Existing device regulators extend their remit across the product lifecycle, with sandboxes and licence conditions doing the work.',
      rows: [
        ['Trigger', 'Medical-device definition'],
        ['Clinical AI', 'Change-control plans and post-market duties'],
        ['Strength', 'Proportionate, adapts without new legislation'],
        ['Strain', 'Tools outside the device definition stay unaddressed']
      ]
    },
    {
      flag: 'CN',
      title: 'Service-level prescription',
      dial: 4,
      mech: 'Providers file algorithms, pass security assessment and label outputs before launch, separately from device approval.',
      rows: [
        ['Trigger', 'Offering a service to the public'],
        ['Clinical AI', 'Device review plus service-level duties'],
        ['Strength', 'Provenance and accountability built in early'],
        ['Strain', 'Front-loaded approval, lighter post-market feedback']
      ]
    }
  ];

  /* ------------------------------------------------------------------------
     6. WHERE FRAMEWORKS CONVERGE
     ------------------------------------------------------------------------ */
  const PRINCIPLES = [
    { k: 'Oversight', t: 'A human in a position to disagree', d: 'Not a rubber stamp. Every framework requires that a person can override the system and has the standing, time and information to do it.' },
    { k: 'Data', t: 'Provenance and representativeness', d: 'Where training data came from, who it represents, and who it omits. The most common reason a validated tool fails in a new clinic.' },
    { k: 'Disclosure', t: 'The user knows it is AI', d: 'Now a hard legal duty in the EU and several US states, and a professional obligation almost everywhere else.' },
    { k: 'Lifecycle', t: 'Approval is not the finish line', d: 'Change-control plans, post-market surveillance and performance monitoring have become the centre of gravity in device regulation.' },
    { k: 'Risk tiering', t: 'Obligation scales with consequence', d: 'Every serious framework grades duties by how much harm a wrong output can do, however differently they draw the lines.' },
    { k: 'Reporting', t: 'Incidents travel upward', d: 'A route for clinicians to report AI-related harm, and a duty on someone to act on it. The weakest link in most deployments today.' }
  ];

  /* ------------------------------------------------------------------------
     7. OUTLOOK
     ------------------------------------------------------------------------ */
  const RISKS = [
    { t: 'Silent degradation', d: 'Performance drifts as case mix, equipment, coding practice or referral patterns change. Nothing alarms; accuracy simply erodes, and only prospective monitoring will catch it.' },
    { t: 'Automation bias', d: 'Clinicians defer to a confident output, and the tool becomes the decision rather than an input to it. Documented for both professionals and patients, and worse under time pressure.' },
    { t: 'The scope gap', d: 'Scribes, inbox drafters, triage chatbots and coding assistants often sit outside the medical-device definition, so they carry no pre-market evidence duty while shaping clinical work daily.' },
    { t: 'Evidence thinness', d: 'A large share of authorised tools reached market on retrospective data, without prospective clinical evaluation or reported subgroup performance.' },
    { t: 'Equity inversion', d: 'Tools are trained where data is abundant and deployed where need is greatest. Performance is worst for the populations with the least representation and the fewest alternatives.' },
    { t: 'Procurement asymmetry', d: 'A hospital committee negotiating with a vendor rarely has the technical standing to demand the right evidence, and vendors are rarely obliged to volunteer it.' }
  ];

  const OPPS = [
    { t: 'Detection at population scale', d: 'Screening and triage tools genuinely extend specialist reach — the strongest evidence base in the field, and the reason radiology dominates every authorisation list.' },
    { t: 'Returning time to clinicians', d: 'Documentation and administrative load is where generative tools have the clearest near-term case, provided accuracy and accountability are measured rather than assumed.' },
    { t: 'Reach into under-served settings', d: 'Where specialists are scarce, a validated tool changes what care is possible at all. This is also where validation evidence is thinnest, which makes it a governance priority rather than a footnote.' },
    { t: 'Reducing unwarranted variation', d: 'Consistent application of guidelines is a quality gain in its own right, and easier to audit in software than in habit.' },
    { t: 'Change control as quality machinery', d: 'A well-written change-control plan is the first mechanism that makes continuous improvement legal and legible. Fewer than two percent of authorised devices have one — which makes it an opening, not a ceiling.' },
    { t: 'Measurement infrastructure', d: 'Governance forces health systems to build monitoring they never had for human decisions either. Some of the durable gains will come from the instrumentation, not the models.' }
  ];

  /* ------------------------------------------------------------------------
     8. PRIMARY SOURCES
     ------------------------------------------------------------------------ */
  const RESOURCES = [
    {
      group: 'Instruments and guidance',
      items: [
        { t: 'Regulation (EU) 2024/1689 — the AI Act', m: 'EUR-Lex · consolidated text', href: 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj' },
        { t: 'Ethics and governance of AI for health: large multi-modal models', m: 'WHO · 2024', href: 'https://www.who.int/publications/i/item/9789240084759' },
        { t: 'Ethics and governance of artificial intelligence for health', m: 'WHO · 2021 · six principles', href: 'https://www.who.int/publications/i/item/9789240029200' },
        { t: 'Pre-market guidance for machine learning-enabled medical devices', m: 'Health Canada · April 2026', href: 'https://www.canada.ca/en/health-canada/services/drugs-health-products/medical-devices/application-information/guidance-documents/pre-market-guidance-machine-learning-enabled-medical-devices.html' },
        { t: 'AI Risk Management Framework', m: 'NIST · Govern, Map, Measure, Manage', href: 'https://www.nist.gov/itl/ai-risk-management-framework' },
        { t: 'OECD AI Principles', m: 'OECD · 2019, updated 2024', href: 'https://oecd.ai/en/ai-principles' }
      ]
    },
    {
      group: 'Regulators and standards bodies',
      items: [
        { t: 'AI-enabled medical device list', m: 'FDA · CDRH', href: 'https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-enabled-medical-device-list' },
        { t: 'MedRegs — regulatory commentary', m: 'MHRA', href: 'https://medregs.blog.gov.uk/' },
        { t: 'AI Airlock sandbox programme report', m: 'MHRA · pilot findings', href: 'https://assets.publishing.service.gov.uk/media/68ee1fb88427701993d5e02c/AI_Airlock_Sandbox_Programme_Report_Final.pdf' },
        { t: 'International Medical Device Regulators Forum', m: 'IMDRF · GMLP and AI/ML work', href: 'https://www.imdrf.org/' },
        { t: 'Therapeutic Goods Administration', m: 'Australia · software as a medical device', href: 'https://www.tga.gov.au/' },
        { t: 'National Medical Products Administration', m: 'China · device review', href: 'https://www.nmpa.gov.cn/' }
      ]
    },
    {
      group: 'Organisations and trackers',
      items: [
        { t: 'HealthAI — the global agency for responsible AI in health', m: 'Geneva · regulatory capacity', href: 'https://healthai.agency/' },
        { t: 'Health AI Policy Tracker', m: 'Manatt Health · US federal and state', href: 'https://www.manatt.com/insights/newsletters/health-highlights/manatt-health-health-ai-policy-tracker' },
        { t: 'Recommendation on the Ethics of AI', m: 'UNESCO · 193 member states', href: 'https://www.unesco.org/en/artificial-intelligence/recommendation-ethics' },
        { t: 'Artificial intelligence work programme', m: 'Council of Europe · Framework Convention', href: 'https://www.coe.int/en/web/artificial-intelligence' },
        { t: 'Practice standard on artificial intelligence', m: 'CPSBC · a provincial college example', href: 'https://www.cpsbc.ca/files/pdf/CPSBC-PG-Artificial-Intelligence.pdf' },
        { t: 'IndiaAI Mission', m: 'MeitY · governance guidelines', href: 'https://indiaai.gov.in/' }
      ]
    }
  ];

  /* ------------------------------------------------------------------------
     9. FAQ
     ------------------------------------------------------------------------ */
  const FAQ = [
    {
      q: 'Is our tool a medical device?',
      a: [
        'Intended purpose decides, not the technology. If the software is intended for diagnosis, prevention, monitoring, prediction, prognosis, treatment or alleviation of disease, it is almost certainly a device in the EU, US, UK, Canada and Australia.',
        'The same model can fall on either side of the line depending on the claim you make. A tool that flags a finding for a clinician is usually a device; a tool that transcribes a consultation usually is not. Marketing copy has repeatedly pulled products into scope that engineering never intended.'
      ]
    },
    {
      q: 'The EU deferred the high-risk rules. Does that mean we can pause?',
      a: [
        'No. The deferral is specific. Standalone high-risk systems under Annex III moved to 2 December 2027, and AI embedded in regulated products under Annex I — the route most clinical AI travels — moved to 2 August 2028.',
        'Article 50 transparency duties were not deferred and have applied since 2 August 2026. Prohibited practices, AI-literacy duties and general-purpose model obligations were already in force. Stale compliance calendars are now the more common failure than late preparation.'
      ]
    },
    {
      q: 'What is a Predetermined Change Control Plan, and do we need one?',
      a: [
        'A PCCP specifies in advance what will change in your model after authorisation — retraining cadence, the data used, the performance bounds that must hold, and how you will verify them. With one, bounded updates can ship without a new submission. Without one, retraining means going back to the regulator.',
        'The FDA, MHRA and Health Canada developed the concept jointly, so a well-written plan can serve more than one submission. They remain rare: roughly 26 authorised US devices had one as of May 2025, under two percent of the AI-enabled total. If your product roadmap assumes model updates, this is the document that makes them lawful.'
      ]
    },
    {
      q: 'Does the AI Act apply to a hospital, or only to vendors?',
      a: [
        'Both, in different roles. Providers — those who develop or place a system on the market — carry the heaviest duties. Deployers, which includes health systems using a high-risk tool, carry their own: human oversight, use in line with the instructions, input-data relevance, log retention, and informing affected people in certain cases.',
        'Two things change your role. Putting your name on a system, or modifying its intended purpose, can make a deployer into a provider. Fine-tuning a model on local data is the most common way that line gets crossed by accident.'
      ]
    },
    {
      q: 'What should a governance committee ask a vendor for?',
      a: [
        'Intended use and contraindications in writing. The validation population, described precisely enough to compare against yours. Performance disaggregated by the subgroups you actually serve. The regulatory status and pathway, with the authorisation document. Whether a change-control plan exists and what it permits. How and when you will be told the model changed. What the tool logs, and whether you can get those logs out.',
        'If a vendor cannot answer the subgroup question, that is itself the finding.'
      ]
    },
    {
      q: 'Where does privacy law sit relative to AI law?',
      a: [
        'Underneath all of it, and often binding sooner. Health data processing needs a lawful basis regardless of whether an AI statute applies: GDPR in the EU, HIPAA and state law in the US, PIPEDA with provincial health statutes such as Ontario’s PHIPA and Alberta’s HIA in Canada, and the DPDP Act in India.',
        'Secondary use for model training is the pressure point. Consent obtained for care rarely covers development, de-identification is weaker than most teams assume for rich clinical data, and cross-border training raises transfer questions that no AI-specific instrument resolves for you.'
      ]
    },
    {
      q: 'Nobody regulates our ambient scribe. Is that a problem?',
      a: [
        'It is the central unresolved problem. Tools that draft notes, replies and referral letters shape the record that every later decision rests on, yet usually sit outside the device definition and so carry no pre-market evidence requirement.',
        'Governance has to come from somewhere else: procurement conditions, professional-college standards, local evaluation before rollout, disclosure to patients, and an audit trail that shows what was generated and who approved it. Several jurisdictions now require the disclosure element by statute, and states are legislating fastest in exactly this space.'
      ]
    }
  ];

  global.MERIDIAN_DATA = { HORIZON, JURISDICTIONS, ETHICS, TIMELINE, COMPARE, PRINCIPLES, RISKS, OPPS, RESOURCES, FAQ };

})(window);
