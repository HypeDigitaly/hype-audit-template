// =============================================================================
// TYPES - HTML Report data model interfaces
// =============================================================================

// =============================================================================
// DATA MODELS
// =============================================================================

export interface AuditQuestion {
  category: string;
  icon: string;
  questions: string[];
}

// =============================================================================
// v4 DATA MODELS - Expected Benefits System
// =============================================================================

export type BenefitType =
  | 'time_savings'        // Úspora času (h/týden)
  | 'lead_generation'     // Nové leady (počet/měsíc)
  | 'conversion_rate'     // Zvýšení konverzí (%)
  | 'new_customers'       // Noví zákazníci (počet/měsíc)
  | 'revenue_increase'    // Nárůst tržeb (Kč/rok nebo %)
  | 'cost_reduction'      // Snížení nákladů (Kč/rok nebo %)
  | 'error_reduction'     // Snížení chyb (%)
  | 'customer_satisfaction' // Zlepšení spokojenosti (NPS body nebo %)
  | 'response_time'       // Zrychlení odezvy (% nebo čas)
  | 'availability'        // Dostupnost (24/7, %)
  // NEW v6: Community/Membership specific
  | 'member_acquisition'  // Noví členové (počet/měsíc)
  | 'churn_reduction'     // Snížení odchodu členů (%)
  | 'member_engagement'   // Zapojení členů (%)
  | 'event_attendance'    // Účast na akcích (%)
  // NEW v6: E-commerce specific
  | 'products_sold'       // Prodané produkty (%)
  | 'cart_abandonment_reduction' // Méně opuštěných košíků (%)
  // NEW v6: Education specific
  | 'student_acquisition' // Noví studenti (počet/měsíc)
  | 'course_completion';  // Dokončení kurzů (%)

export interface OpportunityBenefit {
  type: BenefitType;
  value: string;          // "15-25", "30%", "24/7"
  unit: string;           // "h/týden", "leadů/měsíc", "%"
  label: string;          // "Úspora času", "Nové leady"
  icon: string;           // emoji
}

export interface AIOpportunity {
  title: string;
  shortDescription?: string;  // NEW v7: One-sentence product explanation (max 15 words)
  description: string;
  quadrant: 'quick_win' | 'big_swing' | 'nice_to_have' | 'deprioritize';
  estimatedSavingsHoursPerWeek: number;  // Zachováno pro zpětnou kompatibilitu
  implementationEffort: 'low' | 'medium' | 'high';
  aiType: 'automation' | 'ml' | 'genai' | 'hybrid';
  // NEW v4: Rozšířené přínosy
  expectedBenefits?: OpportunityBenefit[];  // Array konkrétních přínosů pro tuto příležitost
}

// Executive Summary - souhrnné přínosy pro celý report
export interface ExpectedBenefitsSummary {
  introText: string;      // Úvodní text pro Executive Summary
  benefits: OpportunityBenefit[];  // Souhrnné přínosy za celý report
  disclaimer: string;     // Disclaimer o odhadech
}

export interface RecommendedTool {
  name: string;
  category: string;
  useCase: string;
  url?: string;
}

export interface ROIEstimate {
  totalHoursSavedPerWeek: number;
  defaultHourlyRate: number;
  assumptions: string[];
}

export interface CompanyProfile {
  name: string;
  website: string;
  city: string;
  industry: string;
  detectedIndustry?: string;
  employeeEstimate?: string;
  description?: string;
}

export interface CompanyBranding {
  logo?: string;
  favicon?: string;
  primaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  confidence?: number;
}

// =============================================================================
// NEW v3 DATA MODELS
// =============================================================================

export interface DetectedTechnology {
  name: string;
  category: 'cms' | 'ecommerce' | 'crm' | 'erp' | 'custom_app' | 'framework' | 'database' | 'cloud' | 'other';
  confidence: 'high' | 'medium' | 'low';
  description?: string;
}

export interface AppIntegrationOpportunity {
  title: string;
  description: string;
  implementationType: 'api_integration' | 'widget' | 'standalone_module' | 'voice_interface' | 'chatbot_embed';
  estimatedEffort: 'low' | 'medium' | 'high';
  potentialImpact: string;
}

export interface IndustryBenchmark {
  aiAdoptionRate: number;
  topUseCases: string[];
  competitorInsights: string;
  marketTrend: string;
}

export interface ImplementationTimelinePhase {
  phase: 'quick_start' | 'short_term' | 'medium_term' | 'long_term';
  title: string;
  duration: string;
  items: string[];
}

export type ImplementationTimeline = ImplementationTimelinePhase[];

export interface RiskAssessmentItem {
  category: 'data_privacy' | 'employee_adoption' | 'technical' | 'regulatory' | 'financial';
  title: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  mitigation: string;
}

export type RiskAssessment = RiskAssessmentItem[];

// =============================================================================
// MAIN REPORT DATA INTERFACE
// =============================================================================

export interface AuditReportData {
  reportId: string;
  companyProfile: CompanyProfile;
  companyContext?: string; // Personalized intro paragraph about the company based on recent news/activities
  // New v3 fields
  detectedTechnologies?: DetectedTechnology[];
  hasOwnApplication?: boolean;
  ownApplicationDetails?: string | null;
  appIntegrationOpportunities?: AppIntegrationOpportunity[];
  industryBenchmark?: IndustryBenchmark | null;
  implementationTimeline?: ImplementationTimeline;
  riskAssessment?: RiskAssessment;
  // Company branding (Firecrawl API)
  companyBranding?: CompanyBranding;
  // NEW v4: Executive Summary s přínosy
  expectedBenefitsSummary?: ExpectedBenefitsSummary;
  // Existing fields
  auditQuestions: AuditQuestion[];
  aiOpportunities: AIOpportunity[];
  recommendedTools: RecommendedTool[];
  roiEstimate: ROIEstimate;
  generatedAt: string;
  expiresAt: string;
  language: 'cs' | 'en';
}

// =============================================================================
// TRANSLATIONS INTERFACE
// =============================================================================

export interface Translations {
  reportTitle: string;
  preAuditReport: string;
  generatedOn: string;
  expiresOn: string;
  reportId: string;
  companyProfile: string;
  website: string;
  city: string;
  industry: string;
  introTitle: string;
  introText: string;
  introCTA: string;
  questionsTitle: string;
  questionsSubtitle: string;
  opportunitiesTitle: string;
  opportunitiesSubtitle: string;
  matrixTitle: string;
  matrixSubtitle: string;
  quickWins: string;
  quickWinsTooltip: string;
  bigSwings: string;
  bigSwingsTooltip: string;
  niceToHaves: string;
  niceToHavesTooltip: string;
  deprioritize: string;
  deprioritizeTooltip: string;
  highImpact: string;
  lowImpact: string;
  lowEffort: string;
  highEffort: string;
  toolsTitle: string;
  toolsSubtitle: string;
  roiTitle: string;
  roiSubtitle: string;
  hourlyRate: string;
  hoursPerWeek: string;
  monthlySavings: string;
  yearlySavings: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: string;
  ctaContact: string;
  downloadPdf: string;
  poweredBy: string;
  assumptions: string;
  implementationEffort: string;
  low: string;
  medium: string;
  high: string;
  perWeek: string;
  hoursSaved: string;
  // New v3 translations
  technologiesTitle: string;
  technologiesSubtitle: string;
  appIntegrationTitle: string;
  appIntegrationSubtitle: string;
  appIntegrationNoApp: string;
  appIntegrationNoAppSubtitle: string;
  benchmarkTitle: string;
  benchmarkSubtitle: string;
  benchmarkAdoption: string;
  benchmarkUseCases: string;
  benchmarkCompetitors: string;
  benchmarkTrend: string;
  timelineTitle: string;
  timelineSubtitle: string;
  timelineQuickStart: string;
  timelineShortTerm: string;
  timelineMediumTerm: string;
  timelineLongTerm: string;
  riskTitle: string;
  riskSubtitle: string;
  riskDataPrivacy: string;
  riskEmployeeAdoption: string;
  riskTechnical: string;
  riskRegulatory: string;
  riskFinancial: string;
  riskMitigation: string;
  confidenceHigh: string;
  confidenceMedium: string;
  confidenceLow: string;
  // NEW v4: Executive Summary translations
  executiveSummaryTitle: string;
  executiveSummaryBenefitsHeadline: string;
  // v5: Enhanced benefit labels (jargon-free)
  expectedBenefitsLabel: string;
  benefitTimeSavings: string;
  benefitLeadGeneration: string;
  benefitConversionRate: string;
  benefitNewCustomers: string;
  benefitRevenueIncrease: string;
  benefitCostReduction: string;
  benefitErrorReduction: string;
  benefitCustomerSatisfaction: string;
  benefitResponseTime: string;
  benefitAvailability: string;
}
