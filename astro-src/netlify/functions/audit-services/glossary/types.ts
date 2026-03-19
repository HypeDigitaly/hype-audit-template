// =============================================================================
// GLOSSARY TYPES - Type definitions for glossary system
// =============================================================================

/**
 * Entry for a glossary term with label and tooltip
 */
export interface GlossaryEntry {
  /** Label to display (can include the original term in parentheses if needed) */
  label: string;
  /** Tooltip explanation for hover/help */
  tooltip: string;
}

/**
 * Bilingual glossary entry with Czech and English versions
 */
export interface BilingualGlossaryEntry {
  cs: GlossaryEntry;
  en: GlossaryEntry;
}

// =============================================================================
// KEY TYPES
// =============================================================================

/**
 * Benefit types used in opportunities and ROI calculations
 */
export type BenefitTypeKey =
  | 'time_savings'
  | 'lead_generation'
  | 'conversion_rate'
  | 'new_customers'
  | 'revenue_increase'
  | 'cost_reduction'
  | 'error_reduction'
  | 'customer_satisfaction'
  | 'response_time'
  | 'availability'
  // Community/Membership specific
  | 'member_acquisition'
  | 'churn_reduction'
  | 'member_engagement'
  | 'event_attendance'
  // E-commerce specific
  | 'products_sold'
  | 'cart_abandonment_reduction'
  // Education specific
  | 'student_acquisition'
  | 'course_completion';

/**
 * Quadrant keys for opportunity prioritization matrix
 */
export type QuadrantKey = 'quick_win' | 'big_swing' | 'nice_to_have' | 'deprioritize';

/**
 * Implementation type keys for app integration opportunities
 */
export type ImplementationTypeKey =
  | 'api_integration'
  | 'widget'
  | 'standalone_module'
  | 'voice_interface'
  | 'chatbot_embed';

/**
 * Technology category keys for detected technologies
 */
export type TechCategoryKey =
  | 'cms'
  | 'ecommerce'
  | 'crm'
  | 'erp'
  | 'custom_app'
  | 'framework'
  | 'database'
  | 'cloud'
  | 'other';

/**
 * Risk category keys for risk assessment
 */
export type RiskCategoryKey =
  | 'data_privacy'
  | 'employee_adoption'
  | 'technical'
  | 'regulatory'
  | 'financial';

/**
 * Business types that the system can detect
 */
export type BusinessType =
  | 'community_membership'    // Komunita, klub, spolek, membership
  | 'ecommerce'               // E-shop, online obchod
  | 'software_it'             // IT firma, software development
  | 'marketing_agency'        // Marketingová agentura
  | 'service_business'        // Služby (fitko, salon, autoservis, klinika)
  | 'manufacturing'           // Výroba, průmysl
  | 'education'               // Vzdělávání, kurzy, školy
  | 'healthcare'              // Zdravotnictví
  | 'finance'                 // Finance, účetnictví, pojišťovnictví
  | 'consulting'              // Poradenství, konzultace
  | 'real_estate'             // Reality, stavebnictví
  | 'logistics'               // Logistika, doprava
  | 'hospitality'             // Restaurace, hotely, kavárny
  | 'generic';                // Obecný/nezařazený

/**
 * Primary metrics configuration for each business type
 */
export interface BusinessTypeMetricsConfig {
  primaryMetrics: BenefitTypeKey[];
  secondaryMetrics: BenefitTypeKey[];
  headline: { cs: string; en: string };
  valueProposition: { cs: string; en: string };
}
