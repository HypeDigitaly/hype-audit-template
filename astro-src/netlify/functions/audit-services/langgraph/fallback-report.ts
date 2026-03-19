// =============================================================================
// FALLBACK REPORT - Fallback report generation when LLM fails
// =============================================================================

import type { AuditFormInputs } from './types';
import type {
  AuditReportData,
  AuditQuestion,
  AIOpportunity,
  RecommendedTool,
  ROIEstimate,
  ExpectedBenefitsSummary,
  OpportunityBenefit,
  ImplementationTimelinePhase,
  RiskAssessmentItem
} from '../html-report-generator';
import {
  detectBusinessType,
  getBusinessTypeMetrics
} from '../glossary';

// =============================================================================
// FALLBACK BENEFITS SUMMARY GENERATION
// =============================================================================

/**
 * Generate fallback benefits summary if LLM doesn't provide one
 * NOW BUSINESS-TYPE AWARE - generates benefits based on detected industry
 */
export function generateFallbackBenefitsSummary(
  opportunities: AIOpportunity[],
  roiEstimate: ROIEstimate | undefined,
  formData: AuditFormInputs,
  detectedIndustry?: string
): ExpectedBenefitsSummary {
  const isCzech = formData.language === 'cs';
  const companyName = formData.companyName;

  // Detect business type from industry
  const businessType = detectBusinessType(detectedIndustry || formData.industry);
  const metricsConfig = getBusinessTypeMetrics(businessType);

  console.log(`[Agent] Generating fallback benefits for business type: ${businessType}`);

  // Calculate totals from opportunities
  const totalHours = opportunities.reduce((sum, opp) => sum + (opp.estimatedSavingsHoursPerWeek || 0), 0);
  const hourlyRate = roiEstimate?.defaultHourlyRate || (isCzech ? 500 : 50);
  const yearlyTimeSavings = totalHours * 52 * hourlyRate;

  const benefits: OpportunityBenefit[] = [];

  // Generate benefits based on business type
  // CONSERVATIVE ESTIMATES - always use ranges, never too high
  switch (businessType) {
    case 'community_membership':
      // Conservative estimates for communities - exactly 4 benefits
      benefits.push(
        { type: 'member_acquisition', value: '10-25', unit: isCzech ? 'členů/měsíc' : 'members/month', label: isCzech ? 'Noví členové' : 'New Members', icon: '👥' },
        { type: 'churn_reduction', value: '15-30', unit: '%', label: isCzech ? 'Snížení odchodu členů' : 'Reduced Member Churn', icon: '🔒' },
        { type: 'member_engagement', value: '+20-35', unit: '%', label: isCzech ? 'Zapojení členů' : 'Member Engagement', icon: '🎯' },
        { type: 'time_savings', value: '8-15', unit: isCzech ? 'h/týden' : 'h/week', label: isCzech ? 'Úspora času na správě' : 'Admin Time Saved', icon: '⏱️' }
      );
      break;

    case 'ecommerce':
      // Conservative estimates for e-commerce - exactly 4 benefits
      const minRevenue = Math.round(yearlyTimeSavings * 0.8 / 1000) * 1000;
      const maxRevenue = Math.round(yearlyTimeSavings * 1.5 / 1000) * 1000;
      benefits.push(
        { type: 'revenue_increase', value: `${Math.max(50, (minRevenue / 1000)).toFixed(0)}K-${Math.max(100, (maxRevenue / 1000)).toFixed(0)}K`, unit: isCzech ? 'Kč/rok' : '$/year', label: isCzech ? 'Nárůst tržeb' : 'Revenue Increase', icon: '💰' },
        { type: 'conversion_rate', value: '+10-20', unit: '%', label: isCzech ? 'Více platících zákazníků' : 'More Paying Customers', icon: '📈' },
        { type: 'new_customers', value: '10-25', unit: isCzech ? 'zákazníků/měsíc' : 'customers/month', label: isCzech ? 'Noví zákazníci' : 'New Customers', icon: '🎯' },
        { type: 'cart_abandonment_reduction', value: '15-25', unit: '%', label: isCzech ? 'Méně opuštěných košíků' : 'Reduced Cart Abandonment', icon: '🛒' }
      );
      break;

    case 'education':
      // Conservative estimates for education - exactly 4 benefits
      benefits.push(
        { type: 'student_acquisition', value: '10-20', unit: isCzech ? 'studentů/měsíc' : 'students/month', label: isCzech ? 'Noví studenti' : 'New Students', icon: '🎓' },
        { type: 'course_completion', value: '+15-25', unit: '%', label: isCzech ? 'Dokončení kurzů' : 'Course Completion', icon: '✅' },
        { type: 'customer_satisfaction', value: '+10-20', unit: isCzech ? 'bodů' : 'points', label: isCzech ? 'Spokojenost studentů' : 'Student Satisfaction', icon: '⭐' },
        { type: 'time_savings', value: '8-15', unit: isCzech ? 'h/týden' : 'h/week', label: isCzech ? 'Úspora času na administrativě' : 'Admin Time Saved', icon: '⏱️' }
      );
      break;

    case 'software_it':
      // Conservative estimates for software/IT - exactly 4 benefits
      const minCost = Math.round(yearlyTimeSavings * 0.5 / 1000) * 1000;
      const maxCost = Math.round(yearlyTimeSavings * 0.9 / 1000) * 1000;
      benefits.push(
        { type: 'time_savings', value: '10-20', unit: isCzech ? 'h/týden' : 'h/week', label: isCzech ? 'Úspora času vývojářů' : 'Developer Time Saved', icon: '⏱️' },
        { type: 'cost_reduction', value: `${Math.max(30, (minCost / 1000)).toFixed(0)}K-${Math.max(60, (maxCost / 1000)).toFixed(0)}K`, unit: isCzech ? 'Kč/rok' : '$/year', label: isCzech ? 'Snížení nákladů' : 'Cost Reduction', icon: '💰' },
        { type: 'error_reduction', value: '20-35', unit: '%', label: isCzech ? 'Méně chyb v kódu' : 'Fewer Code Errors', icon: '🐛' },
        { type: 'response_time', value: '15-25', unit: '%', label: isCzech ? 'Rychlejší dodání' : 'Faster Delivery', icon: '🚀' }
      );
      break;

    default:
      // Conservative estimates for default/generic businesses - exactly 4 benefits
      const minYearly = Math.round(yearlyTimeSavings * 0.5 / 1000) * 1000;
      const maxYearly = Math.round(yearlyTimeSavings * 0.9 / 1000) * 1000;
      benefits.push(
        { type: 'time_savings', value: '8-15', unit: isCzech ? 'h/týden' : 'h/week', label: isCzech ? 'Úspora času' : 'Time Savings', icon: '⏱️' },
        { type: 'revenue_increase', value: `${Math.max(40, (minYearly / 1000)).toFixed(0)}K-${Math.max(80, (maxYearly / 1000)).toFixed(0)}K`, unit: isCzech ? 'Kč/rok' : '$/year', label: isCzech ? 'Roční finanční přínos' : 'Annual Financial Benefit', icon: '💰' },
        { type: 'new_customers', value: '5-15', unit: isCzech ? 'zákazníků/měsíc' : 'customers/month', label: isCzech ? 'Noví zákazníci' : 'New Customers', icon: '🎯' },
        { type: 'error_reduction', value: '20-35', unit: '%', label: isCzech ? 'Méně chyb' : 'Fewer Errors', icon: '✅' }
      );
      break;
  }

  // Get business-type-specific intro text
  const introText = isCzech
    ? metricsConfig.valueProposition.cs.replace('{companyName}', companyName)
    : metricsConfig.valueProposition.en.replace('{companyName}', companyName);

  const fullIntroText = isCzech
    ? `Na této stránce naleznete předběžný AI audit vytvořený na míru pro ${companyName}. ${introText} Níže je shrnutí očekávaných přínosů po zavedení navrhovaných řešení:`
    : `On this page you will find a preliminary AI audit tailored for ${companyName}. ${introText} Below is a summary of expected benefits from implementing the proposed solutions:`;

  // Filter out any benefits with 0 or empty values, then take exactly 4
  const filteredBenefits = benefits.filter(b => {
    // Filter out 0, 0%, empty, or "0-0" type values
    const value = b.value?.toString() || '';
    return value !== '' &&
           value !== '0' &&
           value !== '0%' &&
           !value.match(/^0-0/) &&
           !value.match(/^\+?0%?$/);
  }).slice(0, 4); // EXACTLY 4 benefits

  return {
    introText: fullIntroText,
    benefits: filteredBenefits,
    disclaimer: isCzech
      ? '* Uvedené odhady vychází z průměrných hodnot podobných implementací v odvětví. Skutečné výsledky se mohou lišit dle specifických podmínek Vaší firmy a rozsahu implementace.'
      : '* These estimates are based on average values from similar implementations in the industry. Actual results may vary depending on your company\'s specific conditions and implementation scope.'
  };
}

// =============================================================================
// DEFAULT CONTENT GENERATORS
// =============================================================================

/**
 * Generate default audit questions
 */
export function generateDefaultQuestions(isCzech: boolean): AuditQuestion[] {
  return isCzech ? [
    { category: 'Role a tým', icon: '👥', questions: ['Jaké jsou hlavní odpovědnosti vašeho týmu?', 'Kolik času týdně strávíte rutinními úkoly?', 'Které činnosti by mohl někdo jiný dělat za vás?'] },
    { category: 'Pracovní postupy', icon: '⚙️', questions: ['Které činnosti se ve vaší firmě opakují nejčastěji?', 'Kde vidíte největší překážky v práci?', 'Které úkoly spotřebují nejvíce času?'] },
    { category: 'Nástroje a technologie', icon: '💻', questions: ['Jaké softwarové nástroje denně používáte?', 'Co vás na stávajících nástrojích nejvíce frustruje?', 'Probíhají důležité procesy mimo hlavní software (Excel, email)?'] },
    { category: 'Bezpečnost a AI Act', icon: '🛡️', questions: ['Víte, jaká rizika pro vás plynou z nové regulace EU AI Act?', 'Jak hlídáte, aby vaše firemní data neunikala do veřejných AI nástrojů?', 'Máte jasná pravidla pro to, které AI nástroje smí zaměstnanci používat?'] },
    { category: 'Kultura a vedení', icon: '🎯', questions: ['Jste připraveni vyžadovat používání AI i přes odpor některých lidí?', 'Jak naložíte s úsporou času – investujete ji do růstu, nebo do zeštíhlení týmu?', 'Máte plán, jak nahradit juniorské role výkonnějšími AI agenty?'] }
  ] : [
    { category: 'Role & Team', icon: '👥', questions: ['What are your team\'s primary responsibilities?', 'How much time per week do you spend on routine tasks?', 'Which activities could someone else do for you?'] },
    { category: 'Processes & Workflow', icon: '⚙️', questions: ['Which processes are most frequent in your company?', 'Where do you see the biggest bottlenecks?', 'Which tasks consume the most time?'] },
    { category: 'Tools & Technology', icon: '💻', questions: ['What software tools do you use daily?', 'What frustrates you most about current tools?', 'Do important processes happen outside main software (Excel, email)?'] },
    { category: 'Security & AI Act', icon: '🛡️', questions: ['Are you aware of the risks posed by the new EU AI Act regulation?', 'How do you prevent corporate data leakage into public AI tools?', 'Do you have clear rules on which AI tools employees are allowed to use?'] },
    { category: 'Culture & Leadership', icon: '🎯', questions: ['Are you ready to mandate AI use despite resistance from some staff?', 'How will you use time savings – invest in growth or downsize the team?', 'Do you have a plan to replace junior roles with high-performance AI agents?'] }
  ];
}

/**
 * Generate default AI opportunities
 */
export function generateDefaultOpportunities(isCzech: boolean): AIOpportunity[] {
  return isCzech ? [
    { title: 'AI Chatbot pro zákaznickou podporu (digitální recepční)', description: 'Chytrý AI asistent natrénovaný na vašich datech, který automaticky odpovídá na dotazy zákazníků 24/7 přes web i sociální sítě.', quadrant: 'quick_win', estimatedSavingsHoursPerWeek: 15, implementationEffort: 'low', aiType: 'genai' },
    { title: 'Automatický generátor obsahu a reklam', description: 'Pokročilý nástroj využívající generativní AI pro bleskovou tvorbu marketingových textů, příspěvků na sítě a reklamních sloganů.', quadrant: 'quick_win', estimatedSavingsHoursPerWeek: 7, implementationEffort: 'low', aiType: 'genai' },
    { title: 'AI asistent pro správu emailů', description: 'Inteligentní systém, který automaticky třídí příchozí emaily podle priority a tématu.', quadrant: 'quick_win', estimatedSavingsHoursPerWeek: 10, implementationEffort: 'low', aiType: 'genai' },
    { title: 'Automatické přepisy a shrnutí schůzek', description: 'AI nahrává a automaticky přepisuje vaše online i osobní schůzky do textu.', quadrant: 'quick_win', estimatedSavingsHoursPerWeek: 6, implementationEffort: 'low', aiType: 'genai' },
    { title: 'AI asistent pro tvorbu obsahu', description: 'Generativní AI, která pomáhá s psaním marketingových textů, příspěvků na sociální sítě a emailových kampaní.', quadrant: 'nice_to_have', estimatedSavingsHoursPerWeek: 5, implementationEffort: 'low', aiType: 'genai' },
    { title: 'Hlasový AI asistent pro telefonní hovory', description: 'Pokročilý hlasový AI agent, který přijímá a vyřizuje telefonní hovory.', quadrant: 'big_swing', estimatedSavingsHoursPerWeek: 12, implementationEffort: 'medium', aiType: 'genai' },
    { title: 'Automatické oslovování nových zákazníků', description: 'AI agent, který automaticky vyhledává potenciální zákazníky na webu a sociálních sítích.', quadrant: 'big_swing', estimatedSavingsHoursPerWeek: 8, implementationEffort: 'medium', aiType: 'hybrid' }
  ] : [
    { title: 'AI Chatbot for Customer Support', description: 'Smart AI assistant that automatically answers customer questions 24/7.', quadrant: 'quick_win', estimatedSavingsHoursPerWeek: 15, implementationEffort: 'low', aiType: 'genai' },
    { title: 'Automated Reporting and Dashboards', description: 'AI automatically generates regular reports from your data without manual work.', quadrant: 'quick_win', estimatedSavingsHoursPerWeek: 8, implementationEffort: 'low', aiType: 'automation' },
    { title: 'AI Email Management Assistant', description: 'Intelligent system that automatically sorts incoming emails by priority and topic.', quadrant: 'quick_win', estimatedSavingsHoursPerWeek: 10, implementationEffort: 'low', aiType: 'genai' },
    { title: 'Automatic Meeting Transcripts and Summaries', description: 'AI records and automatically transcribes your meetings into text.', quadrant: 'quick_win', estimatedSavingsHoursPerWeek: 6, implementationEffort: 'low', aiType: 'genai' },
    { title: 'AI Content Creation Assistant', description: 'Generative AI that helps with writing marketing copy.', quadrant: 'nice_to_have', estimatedSavingsHoursPerWeek: 5, implementationEffort: 'low', aiType: 'genai' },
    { title: 'Voice AI Assistant for Phone Calls', description: 'Advanced voice AI agent that receives and handles phone calls.', quadrant: 'big_swing', estimatedSavingsHoursPerWeek: 12, implementationEffort: 'medium', aiType: 'genai' },
    { title: 'B2B Outreach Automation', description: 'AI agent that automatically searches for potential customers.', quadrant: 'big_swing', estimatedSavingsHoursPerWeek: 8, implementationEffort: 'medium', aiType: 'hybrid' }
  ];
}

/**
 * Generate default recommended tools
 */
export function generateDefaultTools(isCzech: boolean): RecommendedTool[] {
  return [
    { name: 'ChatGPT / Claude', category: 'General AI', useCase: isCzech ? 'Obecný AI asistent pro psaní, analýzu a brainstorming' : 'General AI assistant for writing, analysis and brainstorming', url: 'https://chat.openai.com' },
    { name: 'Zapier / Make', category: 'Automation', useCase: isCzech ? 'Automatizace pracovních postupů mezi aplikacemi' : 'Workflow automation between applications', url: 'https://zapier.com' },
    { name: 'Notion AI', category: 'Productivity', useCase: isCzech ? 'AI dokumentace a znalostní báze' : 'AI-powered documentation and knowledge base', url: 'https://notion.so' },
    { name: 'Fireflies.ai', category: 'Meeting AI', useCase: isCzech ? 'Automatické přepisy a shrnutí schůzek' : 'Automatic meeting transcripts and summaries', url: 'https://fireflies.ai' },
    { name: 'Grammarly', category: 'Writing', useCase: isCzech ? 'AI kontrola gramatiky a stylu' : 'AI grammar and style checking', url: 'https://grammarly.com' }
  ];
}

/**
 * Generate default implementation timeline
 */
export function generateDefaultTimeline(isCzech: boolean): ImplementationTimelinePhase[] {
  return isCzech ? [
    { phase: 'quick_start', title: 'Rychlý start', duration: '1-2 týdny', items: ['Úvodní konzultace a definice priorit', 'Nasazení prvních AI nástrojů', 'Zaškolení klíčových zaměstnanců'] },
    { phase: 'short_term', title: 'Krátkodobě', duration: '1-3 měsíce', items: ['Implementace AI chatbota', 'Automatizace reportingu', 'Integrace s existujícími systémy'] },
    { phase: 'medium_term', title: 'Střednědobě', duration: '3-6 měsíců', items: ['Nasazení hlasového AI asistenta', 'Automatizace oslovování zákazníků', 'Rozšíření AI do dalších procesů'] },
    { phase: 'long_term', title: 'Dlouhodobě', duration: '6-12 měsíců', items: ['Komplexní AI transformace', 'Prediktivní analytika', 'Kontinuální optimalizace'] }
  ] : [
    { phase: 'quick_start', title: 'Quick Start', duration: '1-2 weeks', items: ['Initial consultation', 'Deploy first AI tools', 'Train key employees'] },
    { phase: 'short_term', title: 'Short Term', duration: '1-3 months', items: ['Implement AI chatbot', 'Automate reporting', 'System integrations'] },
    { phase: 'medium_term', title: 'Medium Term', duration: '3-6 months', items: ['Deploy voice AI', 'Automate outreach', 'Expand AI usage'] },
    { phase: 'long_term', title: 'Long Term', duration: '6-12 months', items: ['AI transformation', 'Predictive analytics', 'Continuous optimization'] }
  ];
}

/**
 * Generate default risk assessment
 */
export function generateDefaultRisks(isCzech: boolean): RiskAssessmentItem[] {
  return isCzech ? [
    { category: 'data_privacy', title: 'Ochrana firemních dat', severity: 'medium', description: 'Při používání AI nástrojů je důležité zajistit, aby citlivá firemní data nebyla sdílena s externími poskytovateli.', mitigation: 'Používejte AI nástroje s garancí ochrany dat nebo on-premise řešení.' },
    { category: 'employee_adoption', title: 'Přijetí zaměstnanci', severity: 'low', description: 'Někteří zaměstnanci mohou mít obavy z AI nebo odpor k novým technologiím.', mitigation: 'Komunikujte přínosy AI jako pomocníka, ne náhrady.' },
    { category: 'technical', title: 'Technická integrace', severity: 'low', description: 'Integrace AI do stávajících systémů může vyžadovat technické úpravy.', mitigation: 'Začněte s hotovými řešeními nevyžadujícími hlubokou integraci.' }
  ] : [
    { category: 'data_privacy', title: 'Company Data Protection', severity: 'medium', description: 'When using AI tools, it is important to ensure that sensitive data is not shared with external providers.', mitigation: 'Use AI tools with data protection guarantees or on-premise solutions.' },
    { category: 'employee_adoption', title: 'Employee Adoption', severity: 'low', description: 'Some employees may have concerns about AI or resistance to new technologies.', mitigation: 'Communicate the benefits of AI as an assistant, not a replacement.' },
    { category: 'technical', title: 'Technical Integration', severity: 'low', description: 'Integrating AI into existing systems may require technical adjustments.', mitigation: 'Start with ready-made solutions that do not require deep integration.' }
  ];
}

// =============================================================================
// MAIN FALLBACK REPORT GENERATOR
// =============================================================================

/**
 * Generate a fallback AuditReportData when agent fails
 */
export function generateAgentFallbackReport(formData: AuditFormInputs): AuditReportData {
  const isCzech = formData.language === 'cs';
  const reportId = `fallback-${Date.now().toString(36)}`;
  const generatedAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const defaultQuestions = generateDefaultQuestions(isCzech);
  const defaultOpportunities = generateDefaultOpportunities(isCzech);
  const defaultTools = generateDefaultTools(isCzech);
  const defaultTimeline = generateDefaultTimeline(isCzech);
  const defaultRisks = generateDefaultRisks(isCzech);

  const roiEstimate: ROIEstimate = {
    totalHoursSavedPerWeek: 75,
    defaultHourlyRate: isCzech ? 500 : 50,
    assumptions: isCzech
      ? ['Odhad na základě typických úspor v podobných firmách', 'Skutečné úspory se mohou lišit dle implementace']
      : ['Estimate based on typical savings in similar companies', 'Actual savings may vary based on implementation']
  };

  const expectedBenefitsSummary = generateFallbackBenefitsSummary(
    defaultOpportunities,
    roiEstimate,
    formData,
    formData.industry
  );

  const companyContext = isCzech
    ? `${formData.companyName} je firma působící v oblasti ${formData.industry || 'podnikání'} se sídlem v ${formData.city || 'České republice'}. Na základě dostupných informací jsme připravili předběžný přehled možností, jak by umělá inteligence mohla pomoci zefektivnit Vaše procesy. Pro přesnější analýzu doporučujeme osobní schůzku.`
    : `${formData.companyName} is a company operating in the ${formData.industry || 'business'} sector based in ${formData.city || 'the region'}. Based on available information, we have prepared a preliminary overview of how AI could help streamline your processes. For a more accurate analysis, we recommend a personal meeting.`;

  return {
    reportId,
    companyProfile: {
      name: formData.companyName,
      website: formData.website,
      city: formData.city,
      industry: formData.industry,
      detectedIndustry: formData.industry,
      description: isCzech
        ? `${formData.companyName} - pro detailnější analýzu nás kontaktujte.`
        : `${formData.companyName} - contact us for a more detailed analysis.`
    },
    companyContext,
    auditQuestions: defaultQuestions,
    aiOpportunities: defaultOpportunities,
    recommendedTools: defaultTools,
    roiEstimate,
    expectedBenefitsSummary,
    implementationTimeline: defaultTimeline,
    riskAssessment: defaultRisks,
    detectedTechnologies: [],
    appIntegrationOpportunities: [],
    hasOwnApplication: false,
    ownApplicationDetails: null,
    industryBenchmark: null,
    generatedAt,
    expiresAt,
    language: formData.language
  };
}
