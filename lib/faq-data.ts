// FAQ Data for XL Benefits
// Comprehensive FAQ content organized by category

export type FAQCategory =
  | 'All Questions'
  | 'Stop-Loss Insurance Basics'
  | 'Tools & Calculators'
  | 'Working with XL Benefits'
  | 'Technical & Advanced Topics';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: Exclude<FAQCategory, 'All Questions'>;
  relatedLinks?: Array<{
    title: string;
    url: string;
    type: 'tool' | 'blog' | 'whitepaper' | 'team' | 'page';
  }>;
}

export const faqCategories: FAQCategory[] = [
  'All Questions',
  'Stop-Loss Insurance Basics',
  'Tools & Calculators',
  'Working with XL Benefits',
  'Technical & Advanced Topics',
];

export const faqItems: FAQItem[] = [
  // Stop-Loss Insurance Basics
  {
    id: 'what-is-stop-loss',
    question: 'What is stop-loss insurance?',
    answer: `Stop-loss insurance is a critical risk management tool for self-funded employer health plans. It protects employers from catastrophic healthcare claims by reimbursing them when claims exceed predetermined limits. Think of it as insurance for your self-insured health plan—it caps your maximum financial exposure while allowing you to retain the cost savings and flexibility of self-funding.

There are two main types: Specific stop-loss covers individual high-cost claimants (like a cancer diagnosis or premature birth), while Aggregate stop-loss protects against unexpectedly high total claims across your entire employee population. Most self-funded employers carry both types of coverage to comprehensively manage their risk.`,
    category: 'Stop-Loss Insurance Basics',
    relatedLinks: [
      { title: 'Stop-Loss 101 White Paper', url: '/resources/white-papers', type: 'whitepaper' },
      { title: 'Self-Funding Readiness Assessment', url: '/toolkit/self-funding-readiness', type: 'tool' },
    ],
  },
  {
    id: 'when-consider-stop-loss',
    question: 'When should my clients consider stop-loss coverage?',
    answer: `Your clients should consider stop-loss coverage whenever they're exploring self-funding their health plan. This typically makes sense for groups with 50+ employees, though we've successfully placed coverage for groups as small as 25 when the demographics and cash flow support it.

The sweet spot is when a client has stable cash flow, a relatively healthy employee population, and wants more control over their healthcare spending. We often see fully-insured employers making the switch when they're frustrated by annual renewal increases that don't reflect their actual claims experience. However, timing matters—some groups benefit from delaying self-funding by 12-18 months to address known risks or improve their financial position.

Want to evaluate if a specific client is ready? Use our Self-Funding Readiness Assessment tool to get a preliminary evaluation.`,
    category: 'Stop-Loss Insurance Basics',
    relatedLinks: [
      { title: 'Self-Funding Readiness Assessment', url: '/toolkit/self-funding-readiness', type: 'tool' },
      { title: 'Talk to Jennifer Baird', url: '/team', type: 'team' },
    ],
  },
  {
    id: 'specific-vs-aggregate',
    question: "What's the difference between specific and aggregate stop-loss?",
    answer: `Specific stop-loss (also called individual stop-loss) protects against high claims from individual employees. If you have a $50,000 specific deductible and an employee incurs $200,000 in medical costs, your stop-loss carrier reimburses you $150,000. This is your protection against the "shock claims"—the NICU baby, the cancer diagnosis, the transplant.

Aggregate stop-loss protects against unexpectedly high total claims across your entire group. If your expected claims for the year are $1 million and your aggregate attachment point is set at 125% ($1.25 million), the carrier reimburses you for total paid claims exceeding that threshold. This protects against scenarios like a bad flu season, multiple moderate claims, or general adverse selection.

Most self-funded employers need both. Specific handles the catastrophic individual events, while aggregate protects against the cumulative "death by a thousand cuts" scenario. The deductible levels you choose determine your premium cost and risk retention.`,
    category: 'Stop-Loss Insurance Basics',
    relatedLinks: [
      { title: 'Deductible Optimization Tool', url: '/toolkit/deductible-optimizer', type: 'tool' },
      { title: 'Aggregating Specific Calculator', url: '/toolkit/aggregating-specific', type: 'tool' },
    ],
  },
  {
    id: 'stop-loss-vs-traditional',
    question: 'How is stop-loss different from traditional health insurance?',
    answer: `Stop-loss insurance doesn't cover your employees—it covers your company. Traditional health insurance is a contract between the insurer and the employee (with the employer paying premiums). Stop-loss is a reinsurance contract between the stop-loss carrier and the employer, reimbursing the employer for large claims.

Your employees never interact with the stop-loss carrier. They continue to use their health plan ID cards (issued by your TPA), visit the same doctors, and submit claims the same way. The stop-loss carrier operates behind the scenes, reimbursing your company when individual or total claims exceed your deductible thresholds.

This distinction is important: stop-loss carriers underwrite your group's risk and set deductibles and premiums based on your demographics and claims history. They're evaluating the employer's financial exposure, not providing direct medical benefits to employees.`,
    category: 'Stop-Loss Insurance Basics',
  },
  {
    id: 'attachment-point',
    question: 'What is a stop-loss attachment point?',
    answer: `The attachment point is the threshold at which your stop-loss coverage begins to reimburse claims. For aggregate coverage, it's the total claim dollar amount your group must exceed before reimbursement kicks in. For example, with a 125% aggregate attachment point and $1M in expected claims, you'd need to exceed $1.25M in total paid claims before the carrier reimburses you.

The attachment point is directly tied to your expected claims and margin. A lower attachment point (like 110%) means the carrier starts reimbursing sooner, but your premium will be higher. A higher attachment point (like 130%) reduces your premium but increases your financial risk.

Choosing the right attachment point is a balance between premium cost and risk tolerance. We typically recommend modeling several scenarios to see how different attachment points impact your worst-case financial exposure.`,
    category: 'Stop-Loss Insurance Basics',
    relatedLinks: [
      { title: 'Aggregating Specific Calculator', url: '/toolkit/aggregating-specific', type: 'tool' },
    ],
  },
  {
    id: 'who-needs-stop-loss',
    question: 'Who needs stop-loss insurance?',
    answer: `Any employer with a self-funded health plan needs stop-loss insurance. While it's technically optional, going without stop-loss coverage is extraordinarily risky—a single catastrophic claim could bankrupt even a financially strong company.

Self-funding is most common among mid-to-large employers (50+ employees) who want greater control over their healthcare spending and benefits design. These groups use stop-loss to cap their maximum exposure while retaining the cost savings potential of self-funding.

We also work with smaller groups (25-50 employees) when they have favorable demographics, strong cash reserves, and a clear understanding of the risks. However, for these smaller groups, the stop-loss premiums are higher and the margin for savings is narrower—careful analysis is essential before making the jump.`,
    category: 'Stop-Loss Insurance Basics',
    relatedLinks: [
      { title: 'Self-Funding Readiness Assessment', url: '/toolkit/self-funding-readiness', type: 'tool' },
    ],
  },

  // Tools & Calculators
  {
    id: 'cobra-calculator',
    question: 'How does the Fully Insured Equivalent Rate Calculator work?',
    answer: `Our Fully Insured Equivalent Rate Calculator helps you quickly determine the compliant monthly premium to charge employees electing continuation coverage. You input the employer's monthly premium cost for the plan, and the calculator applies the maximum 2% administrative fee allowed under federal law.

For example, if the employer pays $800/month for single coverage, the fully insured equivalent rate would be $816/month ($800 × 1.02). The calculator handles family tiers automatically and gives you print-ready rates to provide to the plan administrator or terminating employees.

This tool is popular because rate calculations must be precise—undercharging violates IRS rules, while overcharging can trigger penalties. It's a simple tool that ensures compliance and saves brokers time on a routine administrative task.`,
    category: 'Tools & Calculators',
    relatedLinks: [
      { title: 'Fully Insured Equivalent Rate Calculator', url: '/toolkit/cobra-rate-calculator', type: 'tool' },
    ],
  },
  {
    id: 'right-deductible',
    question: 'What factors determine the right stop-loss deductible?',
    answer: `The right specific deductible depends on three main factors: your group's risk tolerance, cash flow capacity, and premium budget. A lower deductible (like $30,000) means lower risk exposure but higher premiums. A higher deductible (like $100,000) reduces your premium but increases the amount you'll pay before stop-loss kicks in.

We typically recommend modeling multiple deductible scenarios—$40K, $50K, $60K, etc.—to see how premium costs change and what your worst-case exposure would be. For example, with 100 employees and a $50,000 specific deductible, your maximum risk is roughly $5 million (100 × $50K) in a catastrophic scenario where every employee hits the deductible. That's unlikely, but you need the cash reserves to handle it.

For aggregate attachment points, we look at your expected claims, desired margin (110%-130%), and historical claims volatility. Groups with stable, predictable claims can often accept higher attachment points, while those with volatility benefit from lower attachment points despite the higher premium.`,
    category: 'Tools & Calculators',
    relatedLinks: [
      { title: 'Deductible Optimization Tool', url: '/toolkit/deductible-optimizer', type: 'tool' },
      { title: 'Talk to Steve Caler', url: '/team', type: 'team' },
    ],
  },
  {
    id: 'self-funding-readiness',
    question: 'How do I know if my client is ready for self-funding?',
    answer: `Our Self-Funding Readiness Assessment evaluates the key factors: employee count, cash flow stability, risk tolerance, and claims history. Generally, groups with 50+ employees, stable financials, and a desire for cost control and flexibility are good candidates.

However, raw eligibility isn't the whole story. We've seen groups that meet the basic criteria but aren't ready due to pending large claims, upcoming workforce reductions, or insufficient administrative infrastructure. Conversely, we've helped 35-life groups successfully self-fund when the circumstances aligned.

The assessment tool gives you a preliminary score, but the real value comes from a conversation with our team. We'll review your client's specific situation, model different scenarios, and help you determine if self-funding makes sense now—or if waiting 12-18 months would position them better. Want to discuss a specific client? Schedule a conversation with Jennifer or Steve.`,
    category: 'Tools & Calculators',
    relatedLinks: [
      { title: 'Self-Funding Readiness Assessment', url: '/toolkit/self-funding-readiness', type: 'tool' },
      { title: 'Schedule a Conversation', url: '/contact', type: 'page' },
    ],
  },
  {
    id: 'aggregating-specific',
    question: 'What is the Aggregating Specific Calculator used for?',
    answer: `The Aggregating Specific Calculator helps you model how individual specific claims accumulate toward your aggregate attachment point. This is critical because many brokers don't realize that specific stop-loss reimbursements reduce your aggregate exposure.

Here's how it works: If you have a $50,000 specific deductible and an employee incurs $200,000 in claims, you pay the first $50,000 and the specific stop-loss carrier pays $150,000. For aggregate purposes, your claims are only $50,000, not $200,000—because the specific carrier covered the rest.

The calculator lets you input your expected claims, specific deductible, aggregate attachment point, and potential large claims to see how they interact. This helps you understand your true worst-case exposure and whether your aggregate attachment point provides adequate protection given your specific deductible level.`,
    category: 'Tools & Calculators',
    relatedLinks: [
      { title: 'Aggregating Specific Calculator', url: '/toolkit/aggregating-specific', type: 'tool' },
    ],
  },
  {
    id: 'calculator-accuracy',
    question: 'How accurate are your online calculators?',
    answer: `Our calculators provide accurate estimates based on the inputs you provide, but they're designed for preliminary analysis—not final quoting. The Fully Insured Equivalent Rate Calculator is precise because it's a straightforward math formula (premium × 1.02). The deductible optimizer and aggregating specific tools are modeling tools that help you understand relationships between variables.

For actual stop-loss quotes, we need to underwrite the specific group—reviewing census data, claims history, industry, and geographic location. Carrier appetites, underwriting guidelines, and market conditions all affect final pricing in ways that a calculator can't capture.

Think of the calculators as conversation starters and planning tools. They help you quickly assess feasibility and model scenarios, but you'll always want to get formal quotes from carriers before presenting a recommendation to your client. We're happy to run those quotes for you at no cost.`,
    category: 'Tools & Calculators',
  },

  // Working with XL Benefits
  {
    id: 'cost-to-work',
    question: 'How much does it cost to work with XL Benefits?',
    answer: `There's no cost to work with XL Benefits. We're compensated directly by the stop-loss carriers on placed business, just like any MGA. You don't pay us consulting fees, subscription fees, or platform fees—our compensation comes from standard carrier commissions.

This means you get full access to our expertise, quoting platform, toolkit resources, and ongoing support at no cost. We succeed when you succeed, so we're incentivized to help you win and retain business.

Some MGAs charge for premium tools or dedicated support—we don't. Whether you place one case a year or fifty, you get the same level of service and access to the full XL Benefits toolkit.`,
    category: 'Working with XL Benefits',
    relatedLinks: [
      { title: 'How We Help Brokers', url: '/how-we-help', type: 'page' },
    ],
  },
  {
    id: 'what-makes-different',
    question: 'What makes XL Benefits different from other MGAs?',
    answer: `Most MGAs focus purely on quoting and placement—sending you a spreadsheet of carrier options and calling it a day. We take a consultative approach, helping you evaluate whether self-funding is right for each client, optimize deductible levels, and navigate complex scenarios like pending large claims or multi-state groups.

We've also invested heavily in tools and resources that make your job easier. Our online calculators, white papers, glossary, and case studies are designed to help you educate clients, model scenarios, and position yourself as a trusted expert. Many brokers tell us they use our tools even when they're not actively quoting stop-loss.

Finally, we prioritize relationships over transactions. You'll work with the same team members—Daron, Jennifer, and Steve—who get to know your book of business and can provide personalized guidance. We're not a call center; we're a boutique MGA that treats every broker relationship as a long-term partnership.`,
    category: 'Working with XL Benefits',
    relatedLinks: [
      { title: 'Meet the Team', url: '/team', type: 'team' },
      { title: 'Browse the Toolkit', url: '/toolkit', type: 'page' },
    ],
  },
  {
    id: 'quote-speed',
    question: 'How quickly can I get a stop-loss quote?',
    answer: `For most standard cases, we can turn around initial quotes within 24-48 hours of receiving complete census and claims data. "Complete" is the key word—incomplete submissions slow everything down. We need accurate employee census (age, gender, zip code), 12-24 months of claims history, and current plan design details.

Complex cases—like groups with known large claimants, pending medical leaves, or unique plan designs—may take 3-5 business days as we work with carriers to get proper underwriting. We'll always communicate timelines upfront so you can set expectations with your client.

Want faster quotes? Submit clean data. We've created a submission checklist that outlines exactly what carriers need, which eliminates the back-and-forth and speeds up the process. Our team will also scrub your submission before sending it to carriers to catch any potential issues.`,
    category: 'Working with XL Benefits',
    relatedLinks: [
      { title: 'Contact Us for Quote Checklist', url: '/contact', type: 'page' },
    ],
  },
  {
    id: 'state-coverage',
    question: 'Do you work with brokers in all states?',
    answer: `Yes, we work with brokers nationwide. Stop-loss insurance is regulated at the state level, and carrier availability varies by state, but we have access to a broad panel of carriers with coverage in all 50 states.

Some states have unique regulatory requirements—California, New York, and New Jersey have more restrictive rules around self-funding and stop-loss—but we navigate those complexities regularly. We'll guide you through state-specific requirements and connect you with carriers that have appetite and expertise in your market.

We also handle multi-state groups, which can be tricky since stop-loss contracts need to comply with regulations in each state where employees are located. If you have a multi-state case, let us know upfront so we can engage carriers with the right licensing and experience.`,
    category: 'Working with XL Benefits',
  },
  {
    id: 'post-placement-support',
    question: 'What kind of support do you provide after placement?',
    answer: `Our support doesn't end when the policy is bound. We assist with mid-year changes (additions, terminations, plan design adjustments), renewal strategy, claims issue resolution, and carrier communication throughout the policy year.

If a large claim hits and you need help navigating the claims reimbursement process, we're there. If your client is frustrated with their TPA and wants to explore alternatives, we can introduce options. If you're unsure how to position the renewal when claims are up 20%, we'll help you model scenarios and craft the narrative.

We also proactively reach out as renewals approach to discuss strategy and timing. Many brokers appreciate having a thought partner who knows the case history and can help them think through positioning, carrier alternatives, and deductible adjustments. You're not on an island—we're in it with you for the long haul.`,
    category: 'Working with XL Benefits',
    relatedLinks: [
      { title: 'Meet the Team', url: '/team', type: 'team' },
    ],
  },
  {
    id: 'tools-without-client',
    question: 'Can I access your tools without becoming a client?',
    answer: `Absolutely. All of our online tools—Fully Insured Equivalent Rate Calculator, Self-Funding Readiness Assessment, Deductible Optimizer, and more—are freely available to all brokers. You don't need to create an account, submit a case, or commit to anything to use them.

We built these tools because we believe in adding value to the broker community, whether or not you're placing business with us today. If the tools help you serve your clients better and position you as an expert, that's a win. Many brokers use our resources for months before they have a stop-loss opportunity, and that's perfectly fine.

When you do have a case you'd like to quote, we're here. But in the meantime, use the tools, share them with colleagues, and let us know if there's a resource or calculator you'd find helpful that we haven't built yet.`,
    category: 'Working with XL Benefits',
    relatedLinks: [
      { title: 'Explore the Toolkit', url: '/toolkit', type: 'page' },
    ],
  },

  // Technical & Advanced Topics
  {
    id: 'calculate-aggregate-attachment',
    question: 'How do I calculate aggregate attachment points?',
    answer: `The aggregate attachment point is calculated by taking your expected claims for the policy year and multiplying by a margin factor (typically 110%-130%). For example, if your expected claims are $1 million and you choose a 125% attachment point, your aggregate deductible is $1.25 million.

Expected claims are typically provided by your TPA based on historical claims experience, adjusted for plan changes, demographic shifts, and trend. Carriers may adjust this number based on their underwriting, especially if they see risk factors the TPA didn't account for.

The margin you choose (110% vs. 125% vs. 130%) directly impacts your premium and risk. A 110% margin means the carrier starts reimbursing sooner but charges a higher premium. A 130% margin reduces premium but increases your financial exposure. We recommend modeling multiple scenarios to find the sweet spot for your client's risk tolerance and budget.`,
    category: 'Technical & Advanced Topics',
    relatedLinks: [
      { title: 'Aggregating Specific Calculator', url: '/toolkit/aggregating-specific', type: 'tool' },
      { title: 'Schedule a Strategy Call', url: '/contact', type: 'page' },
    ],
  },
  {
    id: 'carrier-evaluation',
    question: 'What should I look for in a stop-loss carrier?',
    answer: `Financial stability is non-negotiable—you need a carrier with strong AM Best ratings (A- or better) because they'll be on the hook for potentially millions in claims reimbursements. Beyond financials, consider the carrier's reputation for claims payment speed and accuracy. A carrier that slow-pays or disputes legitimate claims creates headaches for you and your client.

Also evaluate their underwriting appetite and expertise in your client's industry and group size. Some carriers specialize in small groups (25-100), while others prefer large cases (500+). Some have expertise in high-risk industries like manufacturing or construction, while others avoid them.

Finally, consider service and communication. Do they have dedicated account managers? How responsive are they to mid-year changes and inquiries? We maintain relationships with a broad panel of carriers and can guide you toward those that align best with your client's needs and your service expectations.`,
    category: 'Technical & Advanced Topics',
    relatedLinks: [
      { title: 'Carrier Directory', url: '/resources/carrier-directory', type: 'page' },
      { title: 'Talk to Daron Pitts', url: '/team', type: 'team' },
    ],
  },
  {
    id: 'lasering-process',
    question: 'How does the lasering process work?',
    answer: `Lasering (also called specific deductible increases) is when a carrier raises the specific deductible for a particular individual due to known health conditions or ongoing high-cost treatment. For example, if your standard specific deductible is $50,000 but an employee has ongoing cancer treatment, the carrier might "laser" that individual at $100,000 or $150,000.

The lasering process typically happens during underwriting when the carrier identifies high-risk individuals from medical history or prescription drug data. The carrier may also laser individuals mid-year if a large claim occurs and is likely to continue (like a transplant or chronic condition requiring ongoing expensive treatment).

Lasers can be for one year or "lifetime" (meaning they follow the individual as long as they're on the plan). They're a risk management tool for carriers, but they can be controversial—some states restrict or prohibit lasering, and employers sometimes push back on aggressive lasering. We help you navigate these situations and negotiate with carriers when appropriate.`,
    category: 'Technical & Advanced Topics',
  },
  {
    id: 'common-exclusions',
    question: 'What are common stop-loss exclusions?',
    answer: `Most stop-loss policies exclude claims that fall outside the employer's underlying health plan. If the health plan doesn't cover a service (like cosmetic surgery or experimental treatments), the stop-loss carrier won't reimburse it either. This is called the "follower form" principle—stop-loss follows the plan.

Other common exclusions include claims incurred before the policy effective date (prior to the "incurred date"), expenses for individuals not actively enrolled in the plan, and claims related to intentionally self-inflicted injuries. Some policies also exclude transplants, bariatric surgery, or fertility treatments unless specifically included (often for an additional premium).

Always review the policy's exclusions and limitations carefully, especially for complex groups or unique plan designs. If your client's health plan covers services that carriers commonly exclude, you may need to negotiate inclusion or find a carrier with more flexible terms.`,
    category: 'Technical & Advanced Topics',
  },
  {
    id: 'explain-to-client',
    question: 'How do I explain stop-loss to a self-funded client?',
    answer: `Use simple analogies. We often explain it like this: "You're self-insuring your health plan, which means you pay claims directly instead of paying premiums to an insurance company. Stop-loss is your safety net—it caps your maximum financial exposure by reimbursing you when claims get unexpectedly high."

Then break down specific vs. aggregate: "Specific stop-loss protects you from individual catastrophic claims, like if an employee has a premature baby or gets diagnosed with cancer. Aggregate protects you from lots of smaller claims adding up to more than you expected—like a bad flu season."

Use real numbers to make it concrete. "With a $50,000 specific deductible, if an employee incurs $300,000 in claims, you pay the first $50,000 and the stop-loss carrier pays the remaining $250,000. For aggregate, if your expected claims are $1 million and your attachment point is $1.25 million, the carrier reimburses you for total claims above that threshold." Most clients grasp it quickly when you use their actual numbers.`,
    category: 'Technical & Advanced Topics',
    relatedLinks: [
      { title: 'Self-Funding Readiness Assessment', url: '/toolkit/self-funding-readiness', type: 'tool' },
      { title: 'Stop-Loss 101 White Paper', url: '/resources/white-papers', type: 'whitepaper' },
    ],
  },
  {
    id: 'underwriting-timeline',
    question: "What's the typical underwriting timeline?",
    answer: `For a standard case with clean data, expect 24-48 hours for initial quotes. Final underwriting and binding can take another 3-5 business days once you've selected a carrier. So from initial submission to bound policy, you're looking at roughly 1-2 weeks for straightforward cases.

Complex cases take longer. Groups with known large claimants, significant claims volatility, or unique plan designs may require 2-3 weeks as carriers dig into medical records, prescription histories, and custom contract language. Multi-state groups can also add time due to regulatory complexity.

To speed things up, submit complete, accurate data from the start. Incomplete census information, missing claims data, or vague plan design details create back-and-forth that delays quotes by days or weeks. We'll provide you with a submission checklist that outlines exactly what carriers need, which eliminates surprises and keeps the process moving.`,
    category: 'Technical & Advanced Topics',
    relatedLinks: [
      { title: 'Contact Us for Submission Checklist', url: '/contact', type: 'page' },
    ],
  },
];

// Utility functions
export function getQuestionsByCategory(category: Exclude<FAQCategory, 'All Questions'>): FAQItem[] {
  return faqItems.filter(item => item.category === category);
}

export function searchQuestions(query: string): FAQItem[] {
  const lowerQuery = query.toLowerCase();
  return faqItems.filter(
    item =>
      item.question.toLowerCase().includes(lowerQuery) ||
      item.answer.toLowerCase().includes(lowerQuery)
  );
}
