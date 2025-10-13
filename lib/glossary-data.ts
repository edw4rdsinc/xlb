// XL Benefits Stop-Loss Insurance Glossary Data
// Categorized terms for searchable, filterable glossary

export interface GlossaryTerm {
  term: string;
  slug: string;
  category: string;
  definition: string;
  relatedTerms?: string[];
  relatedContent?: {
    type: 'blog' | 'whitepaper' | 'tool';
    title: string;
    url: string;
  }[];
}

export const glossaryCategories = [
  'All Terms',
  'Funding Models',
  'Financial Mechanics',
  'Key Players & Roles',
  'Risk Management',
  'Stop-Loss Insurance',
  'Regulatory & Compliance',
  'Pharmacy Benefits',
  'Cost Containment',
  'Claims & Administration'
] as const;

export type GlossaryCategory = typeof glossaryCategories[number];

export const glossaryTerms: GlossaryTerm[] = [
  // FUNDING MODELS
  {
    term: 'Self-Funded Plan',
    slug: 'self-funded-plan',
    category: 'Funding Models',
    definition: 'A financing arrangement in which an employer assumes the direct financial risk for providing healthcare benefits to its employees. Rather than paying a fixed premium to an insurance carrier, the employer (plan sponsor) pays for each medical and pharmacy claim as it is incurred. The employer collects contributions from enrollees and combines them with corporate funds to pay healthcare claims. This approach grants significant control over plan design, allowing customization of benefits, provider networks, and cost-sharing structures. Self-funded plans are primarily governed by ERISA and are exempt from most state insurance laws and premium taxes.',
    relatedTerms: ['Fully-Insured Plan', 'Level-Funded Plan', 'ERISA', 'Plan Sponsor'],
    relatedContent: [
      {
        type: 'tool',
        title: 'Self-Funding Feasibility Quiz',
        url: '/solutions/self-funding-feasibility'
      },
      {
        type: 'whitepaper',
        title: 'Self-Funding Strategies for Brokers',
        url: '/resources/white-papers#self-funding-strategies'
      }
    ]
  },
  {
    term: 'Self-Insured Plan',
    slug: 'self-insured-plan',
    category: 'Funding Models',
    definition: 'Another term for Self-Funded Plan. A health plan in which the employer assumes direct financial risk for employee healthcare claims rather than purchasing insurance from a carrier.',
    relatedTerms: ['Self-Funded Plan']
  },
  {
    term: 'Fully-Insured Plan',
    slug: 'fully-insured-plan',
    category: 'Funding Models',
    definition: 'The traditional model of employer-sponsored health coverage where the employer contracts with a licensed insurance carrier and pays a fixed, predetermined premium (typically monthly). In exchange, the insurance carrier assumes full financial and legal liability for all covered medical claims and administrative costs. The key differentiator is the transfer of risk: the employer transfers the risk of high claims to the carrier, resulting in predictable costs but eliminating the opportunity to benefit directly from favorable claims experience.',
    relatedTerms: ['Self-Funded Plan', 'Level-Funded Plan', 'Premium']
  },
  {
    term: 'Level-Funded Plan',
    slug: 'level-funded-plan',
    category: 'Funding Models',
    definition: 'A hybrid financing model that blends the cost-saving potential of self-funding with the budget predictability of fully-insured plans. The employer pays a fixed monthly amount that bundles estimated claims costs, administrative fees, and integrated stop-loss insurance. The employer is technically self-funding the claims portion. If actual claims are lower than the funded amount, the employer receives a refund of the surplus. If claims exceed the funded amount, integrated stop-loss insurance covers the excess. This structure is often positioned as an ideal stepping-stone for smaller employers transitioning to self-funding.',
    relatedTerms: ['Self-Funded Plan', 'Fully-Insured Plan', 'Stop-Loss Insurance']
  },
  {
    term: 'Minimum Premium Plan (MPP)',
    slug: 'minimum-premium-plan',
    category: 'Funding Models',
    definition: 'A variation of self-funding where the employer and an insurance carrier agree that the employer will directly pay all claims up to a specified aggregate funding level. The carrier\'s liability begins only after total claims exceed this threshold. The insurer typically provides claims processing and administrative services for the entire plan. Because the employer retains the majority of claims risk below the attachment point, MPPs are categorized as self-insured plans for regulatory purposes.',
    relatedTerms: ['Self-Funded Plan', 'Aggregate Stop-Loss']
  },

  // FINANCIAL MECHANICS
  {
    term: 'Fixed Costs',
    slug: 'fixed-costs',
    category: 'Financial Mechanics',
    definition: 'Predictable, non-claim-related expenses that a self-funded employer pays on a recurring basis. These include TPA fees, stop-loss insurance premiums, provider network access fees, and charges for ancillary services like utilization management or disease management programs. Fixed costs are known in advance and can be budgeted with certainty.',
    relatedTerms: ['Variable Costs', 'TPA', 'Stop-Loss Insurance']
  },
  {
    term: 'Variable Costs',
    slug: 'variable-costs',
    category: 'Financial Mechanics',
    definition: 'The core financial risk retained by a self-funded employer, representing direct payments for medical and pharmacy claims submitted by employees and dependents. Unlike fixed costs, these expenses are inherently unpredictable and can fluctuate dramatically from month to month. The ultimate financial success of a self-funded plan hinges on the employer\'s ability to manage and control variable costs, thereby realizing savings compared to the built-in risk margin of a fully-insured premium.',
    relatedTerms: ['Fixed Costs', 'Claims', 'High-Cost Claimant']
  },
  {
    term: 'Claims',
    slug: 'claims',
    category: 'Claims & Administration',
    definition: 'A formal request for payment submitted by a healthcare provider (or plan member) to the plan administrator (TPA) for covered services rendered. Claims represent the variable costs in a self-funded plan and are the primary driver of financial volatility.',
    relatedTerms: ['Expected Claims', 'High-Cost Claimant', 'TPA', 'Variable Costs']
  },
  {
    term: 'Expected Claims',
    slug: 'expected-claims',
    category: 'Financial Mechanics',
    definition: 'The actuarially projected dollar amount of claims that a plan anticipates paying during a given plan year. This forecast is based on the group\'s historical claims experience (credibility), demographic makeup of the employee population (age, gender, location), and plan design specifics (deductibles, copayments). Expected claims serve as the foundation for the plan\'s budget, determining employee contributions and setting attachment points for aggregate stop-loss insurance.',
    relatedTerms: ['Claims', 'Aggregate Stop-Loss', 'Underwriting']
  },
  {
    term: 'High-Cost Claimant (HCC)',
    slug: 'high-cost-claimant',
    category: 'Financial Mechanics',
    definition: 'An individual plan participant whose medical and/or pharmacy claims are exceptionally high within a single plan year, often defined as exceeding $100,000, $250,000, or even $1 million. The number of claimants with costs greater than $250,000 has nearly doubled since 2015. HCCs can represent up to 35% of a plan\'s total healthcare costs and are a primary driver of financial volatility and a significant concern for self-funded employers.',
    relatedTerms: ['Specific Stop-Loss', 'Laser', 'Gene Therapy', 'Specialty Drugs'],
    relatedContent: [
      {
        type: 'blog',
        title: 'Managing High-Cost Claimants in Self-Funded Plans',
        url: '/resources/blog'
      }
    ]
  },
  {
    term: 'Reserves',
    slug: 'reserves',
    category: 'Financial Mechanics',
    definition: 'Funds that a self-funded employer sets aside to cover anticipated claim liabilities, also called contingency reserves. The primary purpose is to ensure the plan has sufficient liquid assets to pay claims as processed and to cover liability for claims that have been incurred but not yet reported or paid (IBNR). Establishing adequate reserves is a cornerstone of prudent financial management for self-funded plans, allowing the plan to absorb high claim months without disrupting corporate cash flow.',
    relatedTerms: ['IBNR', 'Cash Flow', 'Plan Sponsor']
  },
  {
    term: 'Incurred But Not Reported (IBNR)',
    slug: 'ibnr',
    category: 'Financial Mechanics',
    definition: 'A financial accounting estimate of the plan\'s liability for claims that have been incurred (medical service has been provided) but have not yet been reported to or paid by the TPA. IBNR represents a significant financial liability arising from the inherent "lag" in the claims payment cycle—the period between when service is rendered and when the claim is submitted, processed, and paid. This lag can range from days to several months. Accurately accounting for IBNR is critical at year-end or if the plan is being terminated.',
    relatedTerms: ['Reserves', 'Run-Out', 'Lag Report', 'TPA']
  },
  {
    term: 'Incurred But Not Paid (IBNP)',
    slug: 'ibnp',
    category: 'Financial Mechanics',
    definition: 'Another term for IBNR (Incurred But Not Reported), representing the estimated liability for healthcare services that have been provided but not yet paid by the plan.',
    relatedTerms: ['IBNR', 'Reserves']
  },

  // KEY PLAYERS & ROLES
  {
    term: 'Plan Sponsor',
    slug: 'plan-sponsor',
    category: 'Key Players & Roles',
    definition: 'The employer or organization (corporation, partnership, non-profit) that establishes and maintains an employee benefit plan. In a self-funded plan, the plan sponsor is the central risk-bearing entity, ultimately responsible for funding the plan and paying all covered claims. The plan sponsor also serves as the plan\'s primary fiduciary.',
    relatedTerms: ['Plan Administrator', 'Fiduciary', 'Self-Funded Plan']
  },
  {
    term: 'Plan Administrator',
    slug: 'plan-administrator',
    category: 'Key Players & Roles',
    definition: 'The person or entity designated by the plan\'s legal documents as responsible for day-to-day management and operation of the plan. While the plan sponsor (employer) is often the named plan administrator in documents, actual administrative functions are typically delegated to a professional Third-Party Administrator (TPA) in most self-funded arrangements.',
    relatedTerms: ['Plan Sponsor', 'TPA', 'Fiduciary']
  },
  {
    term: 'Plan Participant',
    slug: 'plan-participant',
    category: 'Key Players & Roles',
    definition: 'An employee or former employee who is, or may become, eligible to receive benefits from the plan.',
    relatedTerms: ['Beneficiary', 'Plan Sponsor']
  },
  {
    term: 'Beneficiary',
    slug: 'beneficiary',
    category: 'Key Players & Roles',
    definition: 'A person, typically a dependent such as a spouse or child, who is designated by a participant to receive benefits or is eligible for coverage under the employee\'s plan.',
    relatedTerms: ['Plan Participant', 'Dependent Coverage']
  },
  {
    term: 'Fiduciary',
    slug: 'fiduciary',
    category: 'Key Players & Roles',
    definition: 'Under ERISA, any person or entity that exercises discretionary authority or control over management of a benefit plan or disposition of its assets. This legal status is based on functions performed, not titles. The plan sponsor is always a fiduciary. Individuals who make key decisions—such as selecting service providers, determining investment policies, or deciding which benefits to offer—are also fiduciaries. This designation carries significant legal obligation: fiduciaries must act prudently with the sole purpose of providing benefits to participants and defraying reasonable plan expenses, the highest standard of care under law.',
    relatedTerms: ['Plan Sponsor', 'ERISA', 'Fiduciary Responsibility']
  },
  {
    term: 'Fiduciary Responsibility',
    slug: 'fiduciary-responsibility',
    category: 'Key Players & Roles',
    definition: 'The legal duty of loyalty and prudence required of plan fiduciaries under ERISA. Fiduciaries must act with the sole and exclusive purpose of providing benefits to plan participants and defraying reasonable administrative expenses. A breach of fiduciary responsibility can result in significant personal liability.',
    relatedTerms: ['Fiduciary', 'ERISA', 'Plan Sponsor']
  },
  {
    term: 'Third-Party Administrator (TPA)',
    slug: 'tpa',
    category: 'Key Players & Roles',
    definition: 'An organization hired by a self-funded employer to manage the administrative functions of its health plan. The TPA provides administrative services but does not assume insurance risk; risk remains entirely with the employer. Core services include claims processing and adjudication, member services (ID cards, customer service, EOBs), eligibility management, and financial/utilization reporting. Modern TPAs often serve as a central hub, helping plan sponsors select, contract with, and coordinate other essential vendors including provider networks, stop-loss insurance, PBMs, and utilization review services.',
    relatedTerms: ['ASO', 'Claims', 'Plan Administrator', 'Self-Funded Plan'],
    relatedContent: [
      {
        type: 'whitepaper',
        title: 'Stop-Loss 101: A Broker\'s Complete Guide',
        url: '/resources/white-papers#stop-loss-101'
      }
    ]
  },
  {
    term: 'Administrative Services Only (ASO)',
    slug: 'aso',
    category: 'Key Players & Roles',
    definition: 'The contractual arrangement between a self-funded employer and a TPA. The term emphasizes that the TPA provides administrative services only but does not assume any insurance risk; risk for claims remains entirely with the employer.',
    relatedTerms: ['TPA', 'Self-Funded Plan']
  },

  // RISK MANAGEMENT - STOP-LOSS INSURANCE
  {
    term: 'Stop-Loss Insurance',
    slug: 'stop-loss-insurance',
    category: 'Stop-Loss Insurance',
    definition: 'Insurance purchased by a self-funded employer that provides reimbursement for catastrophic claims exceeding a predetermined deductible or attachment point. Also known as excess risk insurance. This is NOT health insurance for employees, but reinsurance for the employer\'s plan, providing a crucial financial backstop against exceptionally high claims. The legal obligation to pay providers remains with the self-funded plan; the stop-loss policy then reimburses the employer after the claim has been paid and the deductible met.',
    relatedTerms: ['Specific Stop-Loss', 'Aggregate Stop-Loss', 'Self-Funded Plan', 'Deductible'],
    relatedContent: [
      {
        type: 'whitepaper',
        title: 'Stop-Loss 101: A Broker\'s Complete Guide',
        url: '/resources/white-papers#stop-loss-101'
      }
    ]
  },
  {
    term: 'Specific Stop-Loss (SSL)',
    slug: 'specific-stop-loss',
    category: 'Stop-Loss Insurance',
    definition: 'Also called Individual Stop-Loss (ISL). Provides protection against the financial impact of a high claim from a single plan participant. The policy has a specific deductible (e.g., $75,000, $100,000, or more) applying to each individual covered by the plan. When an individual\'s eligible claims exceed this deductible during the contract period, the stop-loss carrier reimburses the employer for the amount paid above the deductible. Essential for protecting against the financial shock of a single catastrophic health event such as premature birth, major trauma, or complex cancer treatment.',
    relatedTerms: ['Stop-Loss Insurance', 'Aggregate Stop-Loss', 'Deductible', 'High-Cost Claimant']
  },
  {
    term: 'Individual Stop-Loss (ISL)',
    slug: 'individual-stop-loss',
    category: 'Stop-Loss Insurance',
    definition: 'Another term for Specific Stop-Loss (SSL). Insurance that protects against high claims from a single individual.',
    relatedTerms: ['Specific Stop-Loss', 'Stop-Loss Insurance']
  },
  {
    term: 'Aggregate Stop-Loss',
    slug: 'aggregate-stop-loss',
    category: 'Stop-Loss Insurance',
    definition: 'Insurance that provides a ceiling on the total dollar amount of eligible claims an employer would pay for the entire group during a contract period. Protects against higher-than-expected frequency of claims where numerous claims not reaching the specific deductible can collectively create significant financial loss. The threshold (aggregate attachment point) is typically set at a percentage (e.g., 125%) of total expected claims, often expressed as a Monthly Aggregate Corridor or Monthly Attachment Factor (dollar amount per employee per month). If total paid claims exceed this attachment point by year-end, the carrier reimburses the employer for the excess.',
    relatedTerms: ['Stop-Loss Insurance', 'Specific Stop-Loss', 'Expected Claims', 'Attachment Point']
  },
  {
    term: 'Deductible',
    slug: 'deductible',
    category: 'Stop-Loss Insurance',
    definition: 'In stop-loss insurance, the deductible is the amount of claims the employer must pay before the stop-loss carrier begins reimbursement. For Specific Stop-Loss, this applies per individual. For Aggregate Stop-Loss, this is the total claims threshold for the entire group. The selection of appropriate deductible levels is a critical strategic decision balancing premium cost against retained risk.',
    relatedTerms: ['Specific Stop-Loss', 'Aggregate Stop-Loss', 'Attachment Point'],
    relatedContent: [
      {
        type: 'tool',
        title: 'Deductible Optimization Analyzer',
        url: '/solutions/deductible-optimization'
      }
    ]
  },
  {
    term: 'Attachment Point',
    slug: 'attachment-point',
    category: 'Stop-Loss Insurance',
    definition: 'The claim level at which stop-loss insurance coverage begins. For Specific Stop-Loss, this is the individual deductible amount. For Aggregate Stop-Loss, this is the total claims threshold calculated based on expected claims for the entire group.',
    relatedTerms: ['Deductible', 'Specific Stop-Loss', 'Aggregate Stop-Loss']
  },
  {
    term: 'Laser',
    slug: 'laser',
    category: 'Stop-Loss Insurance',
    definition: 'A specific provision in a stop-loss renewal policy that singles out an individual with a known, high-cost, ongoing medical condition. For this individual, the stop-loss carrier imposes a much higher specific deductible than for the rest of the group, or may exclude them from specific coverage altogether. This "lasers in" on known high risk, isolating it from the general pool and transferring more of that specific risk back to the employer. In competitive markets, carriers may offer "no new lasers at renewal" or "laser-free renewal" guarantees as valuable policy features, providing employers with greater budget stability.',
    relatedTerms: ['Specific Stop-Loss', 'High-Cost Claimant', 'Renewal', 'Underwriting']
  },
  {
    term: 'Run-In',
    slug: 'run-in',
    category: 'Stop-Loss Insurance',
    definition: 'A stop-loss contract provision covering claims that were incurred before the policy\'s effective date but are paid during the current policy period. Essential for providing seamless coverage for the claim "lag" when an employer switches from one stop-loss carrier to another, ensuring old claims paid by the new TPA are eligible for reimbursement.',
    relatedTerms: ['Run-Out', 'IBNR', 'Contract Basis']
  },
  {
    term: 'Run-Out',
    slug: 'run-out',
    category: 'Stop-Loss Insurance',
    definition: 'A stop-loss contract provision covering claims that were incurred during the policy period but are paid after the policy has terminated. Also called Terminal Liability Option (TLO). This protects the employer from late-arriving claims submitted and paid during the months following contract end. Standard run-out periods are often three to six months.',
    relatedTerms: ['Run-In', 'Terminal Liability', 'IBNR']
  },
  {
    term: 'Terminal Liability',
    slug: 'terminal-liability',
    category: 'Stop-Loss Insurance',
    definition: 'The plan\'s liability for claims incurred during a policy period but paid after the policy terminates. Addressed through Run-Out contract provisions.',
    relatedTerms: ['Run-Out', 'IBNR']
  },
  {
    term: 'Advanced Funding',
    slug: 'advanced-funding',
    category: 'Stop-Loss Insurance',
    definition: 'A crucial cash-flow protection feature in stop-loss policies. Under standard reimbursement, the employer must first pay a large claim in full and then submit for reimbursement. With advanced funding, the stop-loss carrier advances funds for the portion of the claim exceeding the specific deductible, allowing the employer to pay the provider without fronting the full catastrophic amount. This feature is now standard in many policies.',
    relatedTerms: ['Specific Stop-Loss', 'Cash Flow']
  },
  {
    term: 'Plan Mirroring',
    slug: 'plan-mirroring',
    category: 'Stop-Loss Insurance',
    definition: 'A contractual principle stating that the stop-loss policy will cover the same benefits, terms, and conditions as the employer\'s underlying Summary Plan Description (SPD) or Plan Document. If the stop-loss policy does not accurately "mirror" the plan document, a coverage gap can occur where a service is legitimately covered and paid by the employer\'s plan but deemed ineligible for reimbursement by the stop-loss carrier, leaving the employer with unexpected, uninsured liability.',
    relatedTerms: ['Stop-Loss Insurance', 'SPD', 'Plan Document']
  },

  // ALTERNATIVE RISK FINANCING
  {
    term: 'Captive Insurance',
    slug: 'captive-insurance',
    category: 'Risk Management',
    definition: 'A licensed insurance company wholly owned and controlled by its insureds, with the primary purpose of insuring the risks of its owners. In employee benefits, an employer can form a captive insurance subsidiary to formalize its self-insured risk. Instead of simply retaining risk on its balance sheet, the employer pays a premium to its own captive, which acts as the insurer for a defined risk layer. This structure formalizes risk funding, provides direct access to the reinsurance market, and can offer tax advantages and global cash management opportunities.',
    relatedTerms: ['Group Captive', 'Self-Funded Plan', 'Alternative Risk Financing']
  },
  {
    term: 'Group Captive',
    slug: 'group-captive',
    category: 'Risk Management',
    definition: 'An alternative risk financing arrangement where multiple employers band together to become collective owners of a single captive insurance company. This allows smaller or mid-sized employers lacking scale for a single-parent captive to pool risks, share in underwriting profit and investment income, and gain benefits of a formal risk financing vehicle. Group captives are often an excellent stepping-stone for employers transitioning from fully-insured plans, providing a layer of shared risk protection against claim volatility.',
    relatedTerms: ['Captive Insurance', 'Self-Funded Plan', 'Risk Pool']
  },
  {
    term: 'Pooled Stop-Loss Programs',
    slug: 'pooled-stop-loss',
    category: 'Risk Management',
    definition: 'Arrangements allowing multiple employers to combine their stop-loss coverage into a single, larger pool to achieve greater risk diversification and premium stability. Unlike group captives, employers in a pool do not create or own a separate insurance company; instead, they participate in a program offered by an insurer or program manager. Designed to offer mid-market plan sponsors long-term rate stability and potential rewards or dividends based on favorable performance of both their own group and the overall pool.',
    relatedTerms: ['Stop-Loss Insurance', 'Group Captive', 'Risk Pool']
  },

  // REGULATORY & COMPLIANCE
  {
    term: 'Employee Retirement Income Security Act (ERISA)',
    slug: 'erisa',
    category: 'Regulatory & Compliance',
    definition: 'The cornerstone federal law setting minimum standards for most voluntarily established employee benefit plans in the private sector, including health and welfare benefit plans. Enacted in 1974 to protect interests of plan participants and beneficiaries. Key requirements include reporting and disclosure (SPD, Form 5500), fiduciary standards, grievance and appeals process, and preemption of most state insurance laws. ERISA applies to virtually all private-sector employers regardless of size, but not to governmental or church plans.',
    relatedTerms: ['Fiduciary', 'SPD', 'Plan Document', 'Preemption', 'Self-Funded Plan']
  },
  {
    term: 'ERISA Preemption',
    slug: 'erisa-preemption',
    category: 'Regulatory & Compliance',
    definition: 'A key feature of ERISA that exempts self-funded plans from most state-level health insurance laws, including benefit mandates, premium taxes, and other regulations. This federal oversight provides a uniform regulatory environment, which is a considerable advantage for employers operating in multiple states. The exemption from state premium taxes (generally 2-3% of premium value) represents direct and tangible cost savings.',
    relatedTerms: ['ERISA', 'Self-Funded Plan', 'State Mandates']
  },
  {
    term: 'Affordable Care Act (ACA)',
    slug: 'aca',
    category: 'Regulatory & Compliance',
    definition: 'Federal law enacted in 2010 introducing sweeping healthcare reforms applying to both fully-insured and self-funded plans. While self-funded plans remain exempt from state insurance law, they must comply with numerous ACA provisions including: prohibition on pre-existing condition exclusions, no lifetime or annual dollar limits on essential health benefits, coverage for preventive services without cost-sharing, out-of-pocket maximums, dependent coverage to age 26, employer shared responsibility provision for applicable large employers, and extensive reporting requirements.',
    relatedTerms: ['Essential Health Benefits', 'Out-of-Pocket Maximum', 'Preventive Services', 'ERISA']
  },
  {
    term: 'Consolidated Omnibus Budget Reconciliation Act (COBRA)',
    slug: 'cobra',
    category: 'Regulatory & Compliance',
    definition: 'Federal law requiring most group health plans to offer employees and families the opportunity to temporarily continue group health coverage when coverage would otherwise be lost due to qualifying events. Qualifying events include voluntary or involuntary termination (except gross misconduct), reduction in hours, death of covered employee, divorce or legal separation, and child losing dependent status. COBRA continuation coverage is typically available for 18-36 months depending on the qualifying event. Individuals electing COBRA pay the full cost of coverage plus a small administrative fee.',
    relatedTerms: ['Qualifying Event', 'Continuation Coverage'],
    relatedContent: [
      {
        type: 'tool',
        title: 'COBRA Premium Calculator',
        url: '/solutions/cobra-calculation-challenges'
      },
      {
        type: 'whitepaper',
        title: 'COBRA Compliance in Self-Funded Plans',
        url: '/resources/white-papers#cobra-compliance'
      }
    ]
  },
  {
    term: 'Qualifying Event',
    slug: 'qualifying-event',
    category: 'Regulatory & Compliance',
    definition: 'A specific life event that triggers eligibility for COBRA continuation coverage. Examples include termination of employment, reduction in work hours, death of the covered employee, divorce or legal separation, Medicare entitlement, and a dependent child losing eligibility under the plan.',
    relatedTerms: ['COBRA', 'Continuation Coverage']
  },
  {
    term: 'Health Insurance Portability and Accountability Act (HIPAA)',
    slug: 'hipaa',
    category: 'Regulatory & Compliance',
    definition: 'Federal law with two primary components: "Portability" provisions protecting individuals\' ability to maintain health coverage when changing or losing jobs, and "Accountability" provisions establishing national standards to protect privacy and security of individuals\' health information (Protected Health Information or PHI). Self-funded plan sponsors and their business associates (like TPAs) are "covered entities" under HIPAA and must comply with strict rules regarding use, disclosure, and safeguarding of PHI.',
    relatedTerms: ['PHI', 'Protected Health Information', 'Covered Entity']
  },
  {
    term: 'Protected Health Information (PHI)',
    slug: 'phi',
    category: 'Regulatory & Compliance',
    definition: 'Individually identifiable health information held or transmitted by a covered entity or its business associate, in any form or media. This includes demographic data, medical history, test results, insurance information, and other data relating to an individual\'s health status or healthcare services. HIPAA establishes strict rules for how PHI must be protected and when it may be used or disclosed.',
    relatedTerms: ['HIPAA', 'Covered Entity', 'Business Associate']
  },
  {
    term: 'Plan Document',
    slug: 'plan-document',
    category: 'Regulatory & Compliance',
    definition: 'The formal, written instrument governing the operation and administration of an employee benefit plan. The single most important legal document for any self-funded plan. Defines in detail: eligibility requirements, benefits provided, funding arrangements, procedures for allocating and delegating responsibilities, claims and appeals process, and procedures for amending or terminating the plan. The Plan Document is the ultimate authority in any dispute over benefits.',
    relatedTerms: ['SPD', 'Summary Plan Description', 'ERISA']
  },
  {
    term: 'Summary Plan Description (SPD)',
    slug: 'spd',
    category: 'Regulatory & Compliance',
    definition: 'An ERISA-required document that must be provided to all plan participants, explaining key features of the plan in language understandable to the average participant. Must include information such as eligibility, covered benefits, how to file a claim, and a statement of participant rights under ERISA. While the SPD is a summary, it is a critical legal document. If there is conflict between the SPD and formal Plan Document, courts have in many cases ruled in favor of the SPD language.',
    relatedTerms: ['Plan Document', 'ERISA', 'SBC']
  },
  {
    term: 'Summary of Benefits and Coverage (SBC)',
    slug: 'sbc',
    category: 'Regulatory & Compliance',
    definition: 'A standardized document required by the ACA that all group health plans must provide to applicants and enrollees. Uses a uniform format and glossary to help individuals compare different health plans on an apples-to-apples basis. Provides a snapshot of benefits and cost-sharing including deductibles, copayments, and out-of-pocket maximums, plus coverage examples for common medical scenarios like having a baby or managing type 2 diabetes.',
    relatedTerms: ['ACA', 'SPD', 'Essential Health Benefits']
  },
  {
    term: 'Essential Health Benefits (EHBs)',
    slug: 'essential-health-benefits',
    category: 'Regulatory & Compliance',
    definition: 'Ten categories of services that health plans must cover under the ACA: ambulatory patient services, emergency services, hospitalization, maternity and newborn care, mental health and substance use disorder services, prescription drugs, rehabilitative and habilitative services, laboratory services, preventive and wellness services, and pediatric services including oral and vision care. While large group and self-funded plans are not strictly required to cover all EHBs, if they cover a benefit in an EHB category, that benefit is subject to certain ACA rules like prohibition on annual/lifetime dollar limits and annual out-of-pocket maximum.',
    relatedTerms: ['ACA', 'Out-of-Pocket Maximum', 'Benchmark Plan']
  },
  {
    term: 'Out-of-Pocket Maximum (OOPM)',
    slug: 'out-of-pocket-maximum',
    category: 'Regulatory & Compliance',
    definition: 'An ACA-mandated cap on the amount a participant is required to pay in a year for in-network essential health benefits. Once this limit is reached, the plan must pay 100% of covered services for the remainder of the plan year. The OOPM is indexed annually and represents an important consumer protection limiting financial exposure.',
    relatedTerms: ['ACA', 'Essential Health Benefits', 'Cost-Sharing']
  },
  {
    term: 'Nondiscrimination Testing',
    slug: 'nondiscrimination-testing',
    category: 'Regulatory & Compliance',
    definition: 'Testing required under the Internal Revenue Code to ensure self-funded plans (particularly those with tax-advantaged benefits like FSAs under a Section 125 Cafeteria Plan) do not unfairly favor highly compensated employees (HCEs) or key employees over the non-highly compensated population. If a plan fails these tests, tax advantages may be lost for the highly compensated group.',
    relatedTerms: ['Highly Compensated Employee', 'Section 125', 'Cafeteria Plan']
  },

  // PHARMACY BENEFITS
  {
    term: 'Pharmacy Benefit Manager (PBM)',
    slug: 'pbm',
    category: 'Pharmacy Benefits',
    definition: 'A specialized third-party administrator managing prescription drug benefits on behalf of health plans, including self-insured employers. PBMs act as intermediaries between plan sponsors, pharmaceutical manufacturers, and pharmacies. Core functions include claims adjudication, formulary management, rebate negotiation with manufacturers, pharmacy network contracting, utilization management (prior authorization, step therapy), and specialty pharmacy management. The three largest PBMs—Express Scripts (Cigna), CVS Caremark (CVS Health), and OptumRx (UnitedHealth Group)—process the vast majority of all prescription claims in the U.S.',
    relatedTerms: ['Formulary', 'Rebates', 'Specialty Pharmacy', 'Prior Authorization']
  },
  {
    term: 'Formulary',
    slug: 'formulary',
    category: 'Pharmacy Benefits',
    definition: 'A list of prescription drugs (generic and brand-name) covered by a health plan. Formularies are a primary cost control tool developed by a Pharmacy & Therapeutics (P&T) Committee of physicians and pharmacists who evaluate drugs based on clinical efficacy, safety, and cost. Formularies are typically structured in tiers determining member cost-sharing: Tier 1 (preferred generic, lowest copay), Tier 2 (preferred brand, higher copay), Tier 3 (non-preferred brand, highest copay), and Tier 4/Specialty Tier (high-cost specialty drugs, often requiring coinsurance).',
    relatedTerms: ['PBM', 'Tier', 'Specialty Drugs', 'P&T Committee']
  },
  {
    term: 'Rebates',
    slug: 'rebates',
    category: 'Pharmacy Benefits',
    definition: 'Discounts paid by pharmaceutical manufacturers to PBMs. In exchange for a rebate, a PBM places a manufacturer\'s drug on its formulary, often in a preferred tier, encouraging its use over competing drugs. The flow and transparency of rebate dollars is a subject of intense debate. PBMs argue rebates help lower overall drug costs, while critics contend the system incentivizes use of higher-priced drugs (generating larger rebates) and that a significant portion of rebate savings is often retained by the PBM rather than passed through to the plan sponsor or member.',
    relatedTerms: ['PBM', 'Formulary', 'Spread Pricing', 'Pass-Through Pricing']
  },
  {
    term: 'Spread Pricing',
    slug: 'spread-pricing',
    category: 'Pharmacy Benefits',
    definition: 'A PBM revenue model where the PBM charges the plan sponsor a higher price for a drug than it reimburses the pharmacy for dispensing that same drug. The difference, or "spread," is retained by the PBM as profit. Most common with generic drugs. For example, a PBM might charge a plan sponsor $20 for a generic prescription while reimbursing the pharmacy only $5, keeping the $15 spread. This practice has come under significant criticism for lack of transparency and inflating plan costs.',
    relatedTerms: ['PBM', 'Pass-Through Pricing', 'Transparency']
  },
  {
    term: 'Pass-Through Pricing',
    slug: 'pass-through-pricing',
    category: 'Pharmacy Benefits',
    definition: 'A transparent PBM pricing arrangement where the plan sponsor pays the PBM the same amount that the PBM pays the pharmacy, plus a fixed administrative fee per prescription. This model eliminates the "spread" and provides full transparency into actual drug costs, increasingly favored by sophisticated plan sponsors.',
    relatedTerms: ['Spread Pricing', 'PBM', 'Transparency']
  },
  {
    term: 'Specialty Drugs',
    slug: 'specialty-drugs',
    category: 'Pharmacy Benefits',
    definition: 'High-cost medications typically used to treat complex, chronic, or rare conditions such as cancer, rheumatoid arthritis, multiple sclerosis, hemophilia, or genetic disorders. Often require special handling, administration, or monitoring. Specialty drugs represent a disproportionately large and rapidly growing share of pharmacy spending, often 40-50% of total drug costs despite being used by only 1-2% of members. Defined by cost thresholds (e.g., >$1,000 per month) and clinical characteristics.',
    relatedTerms: ['Specialty Pharmacy', 'Gene Therapy', 'Cell Therapy', 'PBM', 'High-Cost Claimant']
  },
  {
    term: 'Specialty Pharmacy',
    slug: 'specialty-pharmacy',
    category: 'Pharmacy Benefits',
    definition: 'A pharmacy that specializes in dispensing and managing specialty drugs. Provides additional services beyond dispensing, including patient education, adherence monitoring, side effect management, and coordination with physicians. Many PBMs operate their own specialty pharmacy divisions and may contractually require plan members to use them for specialty drugs.',
    relatedTerms: ['Specialty Drugs', 'PBM', 'Utilization Management']
  },
  {
    term: 'Gene Therapy',
    slug: 'gene-therapy',
    category: 'Pharmacy Benefits',
    definition: 'Revolutionary medical treatments that modify or replace defective genes to treat or cure disease. While offering potential cures for previously untreatable conditions, gene therapies can cost over $4 million per treatment. A single patient requiring gene therapy has the potential to decimate a mid-sized employer\'s annual health plan budget, representing one of the most significant financial risks facing self-funded plans in 2025. Some stop-loss carriers are now contractually excluding these massive claims from the employer\'s experience when calculating renewal premiums.',
    relatedTerms: ['Cell Therapy', 'Specialty Drugs', 'High-Cost Claimant', 'Stop-Loss Insurance']
  },
  {
    term: 'Cell Therapy',
    slug: 'cell-therapy',
    category: 'Pharmacy Benefits',
    definition: 'Advanced medical treatments involving the transfer of living cells into a patient to treat disease. Similar to gene therapy, cell therapies represent breakthrough treatments with extraordinary costs, creating significant financial risk for self-funded plans.',
    relatedTerms: ['Gene Therapy', 'Specialty Drugs', 'High-Cost Claimant']
  },
  {
    term: 'Prior Authorization',
    slug: 'prior-authorization',
    category: 'Pharmacy Benefits',
    definition: 'A utilization management process requiring physicians to obtain approval from the plan before prescribing certain medications (typically high-cost or specialty drugs) or performing procedures. Used to ensure medical necessity and clinical appropriateness, and to encourage use of lower-cost alternatives when clinically equivalent.',
    relatedTerms: ['Utilization Management', 'Step Therapy', 'PBM', 'Precertification']
  },
  {
    term: 'Step Therapy',
    slug: 'step-therapy',
    category: 'Pharmacy Benefits',
    definition: 'A utilization management protocol requiring patients to try lower-cost medication options before "stepping up" to higher-cost alternatives. For example, requiring a trial of generic drugs before approving a brand-name drug. Designed to control costs while ensuring clinically appropriate care.',
    relatedTerms: ['Prior Authorization', 'Utilization Management', 'Formulary']
  },
  {
    term: 'Average Wholesale Price (AWP)',
    slug: 'awp',
    category: 'Pharmacy Benefits',
    definition: 'A published, reference price for prescription drugs that has been the primary benchmark used in PBM contracts for pricing and reimbursement for decades. PBM contracts typically define discounts as a percentage off AWP (e.g., AWP - 18% for brand drugs). However, AWP is often criticized as a "sticker price" bearing little relationship to actual acquisition cost, making it a controversial benchmark.',
    relatedTerms: ['PBM', 'Pharmacy Pricing', 'NADAC', 'MAC']
  },

  // COST CONTAINMENT & UTILIZATION MANAGEMENT
  {
    term: 'Utilization Review (UR)',
    slug: 'utilization-review',
    category: 'Cost Containment',
    definition: 'A set of techniques used by health plans to evaluate medical necessity, appropriateness, and efficiency of healthcare services based on established, evidence-based clinical guidelines. Also called Utilization Management (UM). The goal is to ensure plan participants receive high-quality, effective care while preventing overuse, misuse, or underuse of medical services, thereby managing costs. Key functions include precertification/prior authorization, concurrent review, and case management.',
    relatedTerms: ['Utilization Management', 'Prior Authorization', 'Case Management', 'Concurrent Review']
  },
  {
    term: 'Utilization Management (UM)',
    slug: 'utilization-management',
    category: 'Cost Containment',
    definition: 'Another term for Utilization Review (UR). The systematic evaluation of medical services to ensure they are medically necessary, appropriate, and cost-effective.',
    relatedTerms: ['Utilization Review', 'Prior Authorization', 'Case Management']
  },
  {
    term: 'Precertification',
    slug: 'precertification',
    category: 'Cost Containment',
    definition: 'A utilization management process requiring physicians to obtain approval from the plan before performing certain non-emergency procedures (such as elective surgery) or admitting a patient to the hospital. Also called Prior Authorization in medical contexts (distinct from pharmacy prior authorization).',
    relatedTerms: ['Prior Authorization', 'Utilization Management', 'Medical Necessity']
  },
  {
    term: 'Concurrent Review',
    slug: 'concurrent-review',
    category: 'Cost Containment',
    definition: 'A review conducted during a patient\'s hospital stay to assess the ongoing medical necessity of their admission and to plan for their discharge. Part of utilization management designed to prevent unnecessary inpatient days.',
    relatedTerms: ['Utilization Management', 'Case Management']
  },
  {
    term: 'Case Management',
    slug: 'case-management',
    category: 'Cost Containment',
    definition: 'A collaborative process providing support and coordination of care for individuals with complex, catastrophic, or chronic health conditions to ensure they receive appropriate care and to manage high costs. Case managers work with patients, families, and providers to coordinate services, prevent complications, and optimize outcomes while controlling costs.',
    relatedTerms: ['Utilization Management', 'Disease Management', 'High-Cost Claimant']
  },
  {
    term: 'Disease Management',
    slug: 'disease-management',
    category: 'Cost Containment',
    definition: 'Coordinated healthcare interventions and communications for populations with chronic conditions where patient self-care efforts are significant. Programs focus on preventing exacerbations and complications, educating and supporting patients in self-management, and optimizing evidence-based care. Common targets include diabetes, asthma, heart failure, and COPD.',
    relatedTerms: ['Case Management', 'Wellness Program', 'Population Health']
  },
  {
    term: 'Wellness Program',
    slug: 'wellness-program',
    category: 'Cost Containment',
    definition: 'Programs designed to promote health and prevent disease among plan members. May include health risk assessments, biometric screenings, fitness challenges, smoking cessation programs, weight management, stress management, and preventive care incentives. Can be used as a cost containment strategy by improving population health and reducing future claims.',
    relatedTerms: ['Preventive Services', 'Disease Management', 'Population Health']
  },
  {
    term: 'Reference-Based Pricing',
    slug: 'reference-based-pricing',
    category: 'Cost Containment',
    definition: 'A cost containment strategy where the plan sets a maximum payment amount (the "reference price") it will pay for a specific service or procedure, typically based on a percentage above Medicare rates or another benchmark. If the provider\'s charge exceeds the reference price, the member may be responsible for the difference (balance billing). This strategy bypasses traditional PPO network discounts and can generate significant savings but requires careful administration and member communication.',
    relatedTerms: ['Cost Containment', 'Balance Billing', 'Provider Network']
  },

  // PROVIDER NETWORKS & ACCESS
  {
    term: 'Provider Network',
    slug: 'provider-network',
    category: 'Claims & Administration',
    definition: 'A group of physicians, hospitals, laboratories, and other healthcare providers that have contracted with an insurance carrier or TPA to provide services to plan members at discounted, pre-negotiated rates. Self-funded employers typically "rent" access to an established provider network through their TPA. The choice of network is a critical plan design decision impacting member access to care and potential cost savings.',
    relatedTerms: ['PPO', 'EPO', 'HMO', 'TPA', 'Network Discount']
  },
  {
    term: 'PPO (Preferred Provider Organization)',
    slug: 'ppo',
    category: 'Claims & Administration',
    definition: 'The most flexible network type, allowing members to see both in-network and out-of-network providers. The plan provides a higher level of benefits (lower cost-sharing) when members use in-network providers, creating a strong financial incentive to do so. No primary care physician gatekeeper required. Most common network model for self-funded plans.',
    relatedTerms: ['Provider Network', 'EPO', 'HMO', 'In-Network', 'Out-of-Network']
  },
  {
    term: 'EPO (Exclusive Provider Organization)',
    slug: 'epo',
    category: 'Claims & Administration',
    definition: 'A more restrictive network model functioning like an HMO but typically not requiring a primary care physician gatekeeper. Services are generally only covered when received from in-network providers; out-of-network care is usually not covered except in cases of true emergency.',
    relatedTerms: ['Provider Network', 'PPO', 'HMO', 'In-Network']
  },
  {
    term: 'HMO (Health Maintenance Organization)',
    slug: 'hmo',
    category: 'Claims & Administration',
    definition: 'A network model often requiring members to select a Primary Care Physician (PCP) who acts as a "gatekeeper," managing the member\'s care and providing referrals to see specialists within the network. Out-of-network care is typically not covered. Generally offers the lowest premiums but least flexibility.',
    relatedTerms: ['Provider Network', 'PPO', 'EPO', 'Primary Care Physician']
  },
  {
    term: 'In-Network',
    slug: 'in-network',
    category: 'Claims & Administration',
    definition: 'Healthcare providers that have a contract with the plan\'s network to provide services at pre-negotiated, discounted rates. Members receive the financial benefit of these discounts and typically have lower out-of-pocket costs when using in-network providers.',
    relatedTerms: ['Provider Network', 'Out-of-Network', 'PPO']
  },
  {
    term: 'Out-of-Network',
    slug: 'out-of-network',
    category: 'Claims & Administration',
    definition: 'Healthcare providers that do not have a contract with the plan\'s network. Services from out-of-network providers typically result in higher out-of-pocket costs for members and may not be covered at all depending on the plan type (EPO, HMO). May also expose members to balance billing.',
    relatedTerms: ['Provider Network', 'In-Network', 'Balance Billing', 'PPO']
  },
  {
    term: 'Balance Billing',
    slug: 'balance-billing',
    category: 'Claims & Administration',
    definition: 'The practice where a provider bills a patient for the difference between the provider\'s charge and the amount the plan has paid. Most common with out-of-network providers who are not bound by network contract rates. Some states have balance billing protections, and the federal No Surprises Act (2022) provides protections against surprise balance billing in certain emergency and non-emergency situations.',
    relatedTerms: ['Out-of-Network', 'Provider Network', 'No Surprises Act']
  },

  // ADDITIONAL KEY TERMS
  {
    term: 'Explanation of Benefits (EOB)',
    slug: 'eob',
    category: 'Claims & Administration',
    definition: 'A statement sent to a plan member after a claim has been processed, explaining how the claim was adjudicated. Shows the date of service, provider name, amount charged, amount allowed by the plan, amount paid by the plan, and amount the member owes. Not a bill, but an informational document showing how benefits were applied.',
    relatedTerms: ['Claims', 'TPA', 'Adjudication']
  },
  {
    term: 'Medical Necessity',
    slug: 'medical-necessity',
    category: 'Claims & Administration',
    definition: 'Healthcare services or supplies needed to diagnose or treat an illness, injury, condition, disease, or its symptoms that meet accepted standards of medicine. Plans typically only cover services deemed medically necessary. Determinations are based on clinical guidelines and are often a point of dispute in claims denials.',
    relatedTerms: ['Utilization Review', 'Prior Authorization', 'Claims Denial']
  },
  {
    term: 'Coinsurance',
    slug: 'coinsurance',
    category: 'Claims & Administration',
    definition: 'The percentage of covered medical expenses that a plan member is required to pay after meeting the deductible. For example, with 80/20 coinsurance, the plan pays 80% and the member pays 20% of covered services until the out-of-pocket maximum is reached.',
    relatedTerms: ['Copayment', 'Deductible', 'Out-of-Pocket Maximum', 'Cost-Sharing']
  },
  {
    term: 'Copayment (Copay)',
    slug: 'copayment',
    category: 'Claims & Administration',
    definition: 'A fixed dollar amount that a plan member pays for a covered service, typically at the time of service. For example, a $30 copay for a doctor visit or a $10 copay for a generic prescription. Copays may or may not count toward the deductible, depending on plan design.',
    relatedTerms: ['Coinsurance', 'Deductible', 'Cost-Sharing']
  },
  {
    term: 'Cost-Sharing',
    slug: 'cost-sharing',
    category: 'Claims & Administration',
    definition: 'The portion of healthcare costs that a plan member must pay out-of-pocket. Includes deductibles, copayments, and coinsurance. Cost-sharing is capped annually by the out-of-pocket maximum under the ACA.',
    relatedTerms: ['Deductible', 'Copayment', 'Coinsurance', 'Out-of-Pocket Maximum']
  },
  {
    term: 'Preventive Services',
    slug: 'preventive-services',
    category: 'Regulatory & Compliance',
    definition: 'Healthcare services designed to prevent illness or detect health problems early when they are most treatable. Under the ACA, non-grandfathered plans must cover a range of preventive services without any cost-sharing (no deductible, copay, or coinsurance). Examples include annual wellness visits, immunizations, cancer screenings, and certain preventive medications.',
    relatedTerms: ['ACA', 'Wellness Program', 'Essential Health Benefits']
  },
  {
    term: 'Underwriting',
    slug: 'underwriting',
    category: 'Risk Management',
    definition: 'The process by which a stop-loss carrier or insurer evaluates the risk of insuring a group and determines appropriate pricing (premium rates) and terms. For stop-loss insurance, underwriting considers the group\'s demographics, historical claims experience, industry, plan design, and known high-risk individuals. Underwriting results in the quoted premium and may include lasers or exclusions.',
    relatedTerms: ['Stop-Loss Insurance', 'Laser', 'Premium', 'Risk Assessment']
  },
  {
    term: 'Premium',
    slug: 'premium',
    category: 'Financial Mechanics',
    definition: 'In a fully-insured plan, the fixed amount an employer pays to an insurance carrier for coverage. In a self-funded context, typically refers to the amount paid for stop-loss insurance coverage. Premiums are determined through underwriting and represent the price of transferring risk to an insurer.',
    relatedTerms: ['Fully-Insured Plan', 'Stop-Loss Insurance', 'Underwriting']
  },
  {
    term: 'Credibility',
    slug: 'credibility',
    category: 'Risk Management',
    definition: 'In actuarial and underwriting terms, the statistical reliability of a group\'s historical claims experience for predicting future claims. Larger groups have higher credibility because their experience is more statistically stable. Smaller groups have lower credibility, meaning their past experience is less predictive of future costs. Affects how underwriters price stop-loss insurance and how heavily they weight the group\'s own experience versus industry benchmarks.',
    relatedTerms: ['Underwriting', 'Expected Claims', 'Group Size']
  },
  {
    term: 'Renewal',
    slug: 'renewal',
    category: 'Risk Management',
    definition: 'The process of continuing coverage with a stop-loss carrier or insurer for a new policy period. Renewals involve re-underwriting the group based on updated experience, demographics, and market conditions. Renewal rates may increase significantly if the group experienced high claims or has known high-risk individuals (which may trigger lasers). Competitive market conditions and the group\'s negotiating position affect renewal terms.',
    relatedTerms: ['Underwriting', 'Laser', 'Stop-Loss Insurance', 'Premium']
  },
  {
    term: 'Actuarial',
    slug: 'actuarial',
    category: 'Financial Mechanics',
    definition: 'Relating to the statistical calculation of risk and premiums in insurance. Actuarial analysis uses mathematics, statistics, and financial theory to assess financial impacts of uncertain future events. Actuaries develop pricing models, calculate expected claims, set reserves, and determine appropriate stop-loss deductibles and attachment points.',
    relatedTerms: ['Expected Claims', 'Underwriting', 'Reserves', 'Credibility']
  },

  // ADDITIONAL PHARMACY PRICING TERMS
  {
    term: 'Wholesale Acquisition Cost (WAC)',
    slug: 'wac',
    category: 'Pharmacy Benefits',
    definition: 'The price that a drug manufacturer charges to a wholesaler for a drug. WAC is considered a more direct measure of a manufacturer\'s price than AWP, as it does not include the markups that are often built into the AWP calculation. Some newer PBM contracts are moving toward WAC-based pricing to improve transparency and reduce the pricing spread between what the plan pays and what the PBM pays to pharmacies.',
    relatedTerms: ['AWP', 'PBM', 'MAC', 'Spread Pricing']
  },
  {
    term: 'Maximum Allowable Cost (MAC)',
    slug: 'mac',
    category: 'Pharmacy Benefits',
    definition: 'Maximum Allowable Cost (MAC) pricing is used for generic drugs that are available from multiple manufacturers (multi-source generics). A PBM creates a MAC list that sets the maximum reimbursement amount for a group of chemically equivalent generic drugs. This prevents the plan from paying a high price for a generic drug when a lower-cost, identical alternative is available. PBMs have significant discretion in how they create and update their MAC lists, which can be a source of disputes with pharmacies and a point of negotiation for plan sponsors.',
    relatedTerms: ['PBM', 'AWP', 'WAC', 'Generic Drugs']
  },
  {
    term: 'Quantity Limits',
    slug: 'quantity-limits',
    category: 'Pharmacy Benefits',
    definition: 'Restrictions on the amount of a particular medication that will be covered over a specific period of time (e.g., 30 pills per month). These limits are often in place for safety reasons, to prevent stockpiling and waste, or to control costs for medications that may be prone to overuse.',
    relatedTerms: ['Prior Authorization', 'Step Therapy', 'Utilization Management']
  },
  {
    term: 'MAC Effective Rate (MER)',
    slug: 'mac-effective-rate',
    category: 'Pharmacy Benefits',
    definition: 'The Maximum Allowable Cost (MAC) list sets the reimbursement limit for generics. The MAC Effective Rate reflects the blended reimbursement across all MAC lists a PBM uses.',
    relatedTerms: ['MAC', 'PBM', 'Generic Drugs']
  },
  {
    term: 'Generic Substitution Rate (GSR)',
    slug: 'generic-substitution-rate',
    category: 'Pharmacy Benefits',
    definition: 'Measures how often brand-name prescriptions are replaced with clinically equivalent generics. A high substitution rate is critical for cost control and should be 98% or better.',
    relatedTerms: ['Generic Drugs', 'Brand-Name Drugs', 'Formulary', 'Cost Containment']
  },
  {
    term: 'Medication Possession Ratio (MPR)',
    slug: 'medication-possession-ratio',
    category: 'Pharmacy Benefits',
    definition: 'A key measure of medication adherence, MPR calculates the proportion of time a patient has access to their medication. An effective plan should target an MPR of 80% or better.',
    relatedTerms: ['Medication Therapy Management', 'Disease Management', 'PBM']
  },
  {
    term: 'Rebate Yield',
    slug: 'rebate-yield',
    category: 'Pharmacy Benefits',
    definition: 'The percentage of rebates retained relative to total drug spend. It should be at least 20% of brand drug spend.',
    relatedTerms: ['Rebates', 'PBM', 'Brand-Name Drugs']
  },
  {
    term: 'Prior Authorization Approval Rate',
    slug: 'prior-authorization-approval-rate',
    category: 'Pharmacy Benefits',
    definition: 'Measures how often prior authorization (PA) requests are approved by the PBM. The benchmark should generally be below 65%.',
    relatedTerms: ['Prior Authorization', 'PBM', 'Utilization Management']
  },
  {
    term: 'Medication Therapy Management (MTM)',
    slug: 'medication-therapy-management',
    category: 'Pharmacy Benefits',
    definition: 'Programs that ensure patients, especially those with multiple chronic conditions, are on the right medications and taking them correctly.',
    relatedTerms: ['PBM', 'Disease Management', 'Medication Possession Ratio', 'Case Management']
  },
  {
    term: 'Specialty Dispensing Rate',
    slug: 'specialty-dispensing-rate',
    category: 'Pharmacy Benefits',
    definition: 'Measures (as a percentage) how often prescriptions for high-cost specialty drugs are filled by PBM-owned or preferred specialty pharmacies.',
    relatedTerms: ['Specialty Drugs', 'Specialty Pharmacy', 'PBM']
  },
  {
    term: 'Back-Billing',
    slug: 'back-billing',
    category: 'Pharmacy Benefits',
    definition: 'When PBMs withhold reimbursement to the pharmacy after the point of sale and keep those dollars without disclosing or sharing them with the plan sponsor.',
    relatedTerms: ['PBM', 'Spread Pricing', 'Transparency']
  },
  {
    term: 'Pharmacogenomics (PGx)',
    slug: 'pharmacogenomics',
    category: 'Pharmacy Benefits',
    definition: 'The study of how a person\'s genes influence drug effectiveness and safety.',
    relatedTerms: ['Medication Therapy Management', 'Specialty Drugs']
  },
  {
    term: 'Total Cost of Pharmacy Care (TCoPC)',
    slug: 'total-cost-of-pharmacy-care',
    category: 'Pharmacy Benefits',
    definition: 'Looks beyond the unit cost of prescriptions and considers the full impact of pharmacy care, including ingredient costs, claims management, clinical services, and medical costs avoided.',
    relatedTerms: ['PBM', 'Cost Containment', 'Medication Therapy Management']
  },

  // MEMBER EXPERIENCE & COST-SHARING
  {
    term: 'Deductible (Member)',
    slug: 'member-deductible',
    category: 'Claims & Administration',
    definition: 'A fixed dollar amount that a member must pay for covered healthcare services out-of-pocket before the health plan begins to pay. For example, if a plan has a $1,500 deductible, the member is responsible for the first $1,500 of their medical costs. After the deductible is met, the plan\'s coinsurance provisions take effect. Plans typically have separate deductibles for in-network vs. out-of-network services, and both an individual deductible and a family deductible. This is distinct from stop-loss deductibles, which apply to the employer\'s risk, not the member\'s.',
    relatedTerms: ['Coinsurance', 'Copayment', 'Out-of-Pocket Maximum', 'Cost-Sharing']
  },

  // CONSUMER-DIRECTED HEALTH PLANS
  {
    term: 'High-Deductible Health Plan (HDHP)',
    slug: 'hdhp',
    category: 'Claims & Administration',
    definition: 'A health plan with a higher deductible than traditional insurance plans. In exchange for the higher deductible, HDHPs typically have lower monthly premiums or employee contributions. To be considered a qualified HDHP that can be paired with a Health Savings Account (HSA), the plan must meet specific minimum deductible and maximum out-of-pocket limits set annually by the IRS. HDHPs are the foundation of Consumer-Directed Health Plans (CDHPs).',
    relatedTerms: ['HSA', 'CDHP', 'Deductible (Member)', 'Out-of-Pocket Maximum']
  },
  {
    term: 'Health Savings Account (HSA)',
    slug: 'hsa',
    category: 'Claims & Administration',
    definition: 'A tax-advantaged personal savings account that an individual can use to pay for qualified medical expenses. To be eligible to contribute to an HSA, an individual must be enrolled in a qualified High-Deductible Health Plan (HDHP). HSAs offer a triple tax advantage: contributions are tax-deductible, the funds grow tax-free, and withdrawals for qualified medical expenses are tax-free. The account is owned by the employee and is portable, meaning the funds remain with the employee even if they change jobs or leave the workforce. Both the employee and the employer can contribute to an HSA, up to an annual limit set by the IRS.',
    relatedTerms: ['HDHP', 'HRA', 'FSA', 'CDHP']
  },
  {
    term: 'Health Reimbursement Arrangement (HRA)',
    slug: 'hra',
    category: 'Claims & Administration',
    definition: 'An employer-funded account that employees can use to pay for qualified medical expenses. Unlike an HSA, an HRA is owned and funded solely by the employer; employees cannot contribute. The employer sets the rules for the HRA, including the annual contribution amount and what expenses are eligible for reimbursement. Funds left in an HRA at the end of the year can often be rolled over to the next year, but the account is not portable and is forfeited if the employee leaves the company.',
    relatedTerms: ['HSA', 'FSA', 'HDHP']
  },
  {
    term: 'Flexible Spending Account (FSA)',
    slug: 'fsa',
    category: 'Claims & Administration',
    definition: 'An employer-sponsored account that allows employees to set aside their own money on a pre-tax basis to pay for qualified medical or dependent care expenses. Because the contributions are made before taxes are calculated, FSAs reduce an employee\'s taxable income. The primary drawback of an FSA is the "use-it-or-lose-it" rule: funds not used by the end of the plan year (or a short grace period, if offered) are generally forfeited to the employer.',
    relatedTerms: ['HSA', 'HRA', 'Section 125', 'Cafeteria Plan']
  },
  {
    term: 'Consumer-Directed Health Plan (CDHP)',
    slug: 'cdhp',
    category: 'Claims & Administration',
    definition: 'A type of plan design that pairs a High-Deductible Health Plan (HDHP) with a tax-advantaged savings or spending account (HSA, HRA, or FSA). The goal is to give members more control over their healthcare spending and to encourage them to be more cost-conscious consumers of healthcare. CDHPs aim to reduce unnecessary utilization by requiring members to have "skin in the game" through higher deductibles.',
    relatedTerms: ['HDHP', 'HSA', 'HRA', 'FSA']
  },

  // EMERGING TRENDS
  {
    term: 'Navigation Services',
    slug: 'navigation-services',
    category: 'Cost Containment',
    definition: 'An emerging solution designed to address the complexity of the healthcare system for members. A navigation partner acts as a dedicated concierge or advocate for members, helping them find high-quality, cost-effective in-network providers, understand their benefits, resolve billing issues, and access clinical support programs. By providing a more streamlined and supportive member experience, these services aim to guide members to better health decisions, which can lead to higher engagement, improved health outcomes, and lower costs for the plan.',
    relatedTerms: ['Case Management', 'Utilization Management', 'Member Experience']
  },
  {
    term: 'Point Solution Fatigue',
    slug: 'point-solution-fatigue',
    category: 'Claims & Administration',
    definition: 'The market for employee benefits has seen an explosion of "point solutions"—narrowly focused vendors that offer a specific service, such as a diabetes management program, a virtual physical therapy app, or a mental health platform. While these solutions can add value, employers and employees are increasingly experiencing "point solution fatigue" from the administrative burden of managing dozens of separate vendors and the confusion of navigating a fragmented landscape of different apps and programs. This has led to a growing demand for integrated platforms and navigation services that can consolidate these offerings into a single, cohesive member experience.',
    relatedTerms: ['Navigation Services', 'Vendor Management', 'Integration']
  },
  {
    term: 'Section 125 / Cafeteria Plan',
    slug: 'section-125',
    category: 'Regulatory & Compliance',
    definition: 'Section 125 of the Internal Revenue Code allows employers to offer employees a choice between receiving cash compensation or selecting from a menu of pre-tax benefits, such as health insurance premiums, FSAs, and HSAs. This arrangement is commonly called a "Cafeteria Plan." By allowing employees to pay for certain benefits with pre-tax dollars, Section 125 plans reduce both employee and employer payroll taxes. However, these plans are subject to strict nondiscrimination testing requirements.',
    relatedTerms: ['FSA', 'HSA', 'Nondiscrimination Testing', 'Pre-Tax Benefits']
  },
  {
    term: 'Generic Drugs',
    slug: 'generic-drugs',
    category: 'Pharmacy Benefits',
    definition: 'Medications that contain the same active ingredient as a brand-name drug but are sold under their chemical name rather than a brand name. Generic drugs are typically much less expensive than brand-name drugs because they do not require the same level of investment in research, development, and marketing. Generics must be bioequivalent to their brand-name counterparts, meaning they work in the same way and provide the same clinical benefit. Encouraging generic drug use is a key cost-containment strategy for pharmacy benefits.',
    relatedTerms: ['Formulary', 'MAC', 'Brand-Name Drugs', 'Tier']
  },
  {
    term: 'Brand-Name Drugs',
    slug: 'brand-name-drugs',
    category: 'Pharmacy Benefits',
    definition: 'Medications that are sold under a trademarked brand name by the pharmaceutical company that originally researched and developed the drug. Brand-name drugs are typically more expensive than generic equivalents because manufacturers are recouping their research and development costs and generating profit during the period of patent protection. When a drug\'s patent expires, generic versions can be produced, usually leading to significant cost savings.',
    relatedTerms: ['Generic Drugs', 'Formulary', 'Specialty Drugs', 'Rebates']
  },
  {
    term: 'Tier',
    slug: 'tier',
    category: 'Pharmacy Benefits',
    definition: 'A category within a pharmacy benefit formulary that determines the member\'s cost-sharing for a particular drug. A typical tiered formulary structure includes: Tier 1 (preferred generic drugs with lowest copay), Tier 2 (preferred brand-name drugs with moderate copay), Tier 3 (non-preferred brand-name drugs with high copay), and Tier 4/Specialty Tier (high-cost specialty drugs, often requiring coinsurance rather than a flat copay). The tier placement of a drug is a key driver of both member out-of-pocket costs and plan costs.',
    relatedTerms: ['Formulary', 'Coinsurance', 'Copayment', 'Specialty Drugs']
  },
  {
    term: 'P&T Committee',
    slug: 'p-and-t-committee',
    category: 'Pharmacy Benefits',
    definition: 'Pharmacy and Therapeutics (P&T) Committee. A group of physicians and pharmacists employed by or contracted with a PBM or health plan who are responsible for developing and maintaining the plan\'s drug formulary. The P&T Committee evaluates drugs based on clinical efficacy, safety, and cost to determine which medications should be covered and at what tier level. This committee provides the clinical governance for formulary decisions.',
    relatedTerms: ['Formulary', 'PBM', 'Tier', 'Clinical Guidelines']
  },
  {
    term: 'Covered Entity',
    slug: 'covered-entity',
    category: 'Regulatory & Compliance',
    definition: 'Under HIPAA, a covered entity is a health plan, healthcare clearinghouse, or healthcare provider that transmits health information electronically. Self-funded plan sponsors and their TPAs are considered covered entities and must comply with HIPAA\'s privacy and security rules for protecting Protected Health Information (PHI).',
    relatedTerms: ['HIPAA', 'PHI', 'Business Associate', 'Protected Health Information']
  },
  {
    term: 'Business Associate',
    slug: 'business-associate',
    category: 'Regulatory & Compliance',
    definition: 'Under HIPAA, a business associate is a person or entity that performs certain functions or activities on behalf of, or provides certain services to, a covered entity that involve the use or disclosure of Protected Health Information (PHI). TPAs, PBMs, and other vendors that handle PHI for a self-funded plan are business associates. Covered entities must have written Business Associate Agreements (BAAs) with these vendors specifying how PHI will be protected.',
    relatedTerms: ['HIPAA', 'PHI', 'Covered Entity', 'TPA']
  },
  {
    term: 'Dependent Coverage',
    slug: 'dependent-coverage',
    category: 'Regulatory & Compliance',
    definition: 'Health insurance coverage extended to eligible family members of the employee, including spouses, children, and in some cases domestic partners. The ACA requires plans that offer dependent coverage to allow children to remain on a parent\'s plan until age 26, regardless of student status, marital status, or financial dependency.',
    relatedTerms: ['ACA', 'Beneficiary', 'Qualifying Event']
  },
  {
    term: 'No Surprises Act',
    slug: 'no-surprises-act',
    category: 'Regulatory & Compliance',
    definition: 'Federal legislation enacted in 2022 that protects patients from surprise medical bills in certain situations, particularly for emergency services and non-emergency services provided by out-of-network providers at in-network facilities. The law limits what out-of-network providers can balance bill patients and establishes an independent dispute resolution process for payment disputes between providers and health plans.',
    relatedTerms: ['Balance Billing', 'Out-of-Network', 'Emergency Services']
  },
  {
    term: 'Continuation Coverage',
    slug: 'continuation-coverage',
    category: 'Regulatory & Compliance',
    definition: 'The right to temporarily continue group health coverage after a qualifying event that would otherwise result in loss of coverage. COBRA is the federal law requiring most employers to offer continuation coverage. The individual electing continuation coverage typically pays the full premium plus a small administrative fee.',
    relatedTerms: ['COBRA', 'Qualifying Event', 'Premium']
  },
  {
    term: 'Highly Compensated Employee (HCE)',
    slug: 'hce',
    category: 'Regulatory & Compliance',
    definition: 'For purposes of nondiscrimination testing under the Internal Revenue Code, a highly compensated employee is generally defined as an employee who owned more than 5% of the company at any time during the year or preceding year, or who received compensation above a certain threshold (indexed annually). Plans with tax-advantaged benefits must pass nondiscrimination tests to ensure HCEs are not receiving disproportionate benefits.',
    relatedTerms: ['Nondiscrimination Testing', 'Section 125', 'Key Employee']
  },
  {
    term: 'Key Employee',
    slug: 'key-employee',
    category: 'Regulatory & Compliance',
    definition: 'For purposes of nondiscrimination testing, a key employee is an employee who is an officer of the company with annual compensation exceeding a certain threshold (indexed annually), or who owns more than 5% of the company, or who owns more than 1% of the company and has annual compensation exceeding a certain threshold. This classification is used in testing self-insured medical reimbursement plans.',
    relatedTerms: ['Highly Compensated Employee', 'Nondiscrimination Testing']
  },
  {
    term: 'Pre-Tax Benefits',
    slug: 'pre-tax-benefits',
    category: 'Regulatory & Compliance',
    definition: 'Employee benefits that are paid for with pre-tax dollars, meaning the cost of the benefit is deducted from the employee\'s gross income before income taxes and payroll taxes are calculated. This reduces the employee\'s taxable income and can result in significant tax savings. Common pre-tax benefits include health insurance premiums, HSA contributions, and FSA contributions. These benefits are typically offered through a Section 125 Cafeteria Plan.',
    relatedTerms: ['Section 125', 'FSA', 'HSA', 'Cafeteria Plan']
  }
];

// Helper function to get terms by category
export function getTermsByCategory(category: GlossaryCategory): GlossaryTerm[] {
  if (category === 'All Terms') {
    return glossaryTerms;
  }
  return glossaryTerms.filter(term => term.category === category);
}

// Helper function to search terms
export function searchTerms(query: string): GlossaryTerm[] {
  const lowerQuery = query.toLowerCase();
  return glossaryTerms.filter(
    term =>
      term.term.toLowerCase().includes(lowerQuery) ||
      term.definition.toLowerCase().includes(lowerQuery)
  );
}

// Helper function to get a single term by slug
export function getTermBySlug(slug: string): GlossaryTerm | undefined {
  return glossaryTerms.find(term => term.slug === slug);
}

// Helper function to get related terms
export function getRelatedTerms(term: GlossaryTerm): GlossaryTerm[] {
  if (!term.relatedTerms) return [];
  return glossaryTerms.filter(t => term.relatedTerms?.includes(t.term));
}
