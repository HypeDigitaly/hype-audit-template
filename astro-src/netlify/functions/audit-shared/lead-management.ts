// =============================================================================
// LEAD MANAGEMENT - Storage and tracking for audit leads
// =============================================================================
// Functions for storing leads in Netlify Blobs and submitting to Netlify Forms
// =============================================================================

import { getLeadsStore } from './storage';
import type { AuditLead, AuditFormData } from './types';
import { clientConfig } from '../_config/client';

// =============================================================================
// LEAD ID GENERATION
// =============================================================================

/**
 * Generate unique lead ID using timestamp and random string
 */
export function generateLeadId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `lead-${timestamp}-${random}`;
}

// =============================================================================
// LEAD STORAGE
// =============================================================================

/**
 * Store lead data persistently in Netlify Blobs
 * Also updates the leads index for easy retrieval
 */
export async function storeLead(lead: AuditLead): Promise<void> {
  try {
    const store = getLeadsStore();

    // Store individual lead with metadata
    await store.set(lead.id, JSON.stringify(lead), {
      metadata: {
        email: lead.email,
        companyName: lead.companyName,
        submittedAt: lead.submittedAt
      }
    });

    // Update leads index for easy retrieval
    let leadsIndex: string[] = [];
    try {
      const existingIndex = await store.get('_leads_index');
      if (existingIndex) {
        leadsIndex = JSON.parse(existingIndex);
      }
    } catch {
      // Index doesn't exist yet, start fresh
    }

    leadsIndex.unshift(lead.id); // Add new lead at beginning
    await store.set('_leads_index', JSON.stringify(leadsIndex));

    console.log(`[Leads] Lead stored successfully: ${lead.id}`);
  } catch (error) {
    console.error('[Leads] Failed to store lead:', error);
    // Don't throw - lead storage failure shouldn't break the audit flow
  }
}

// =============================================================================
// NETLIFY FORMS SUBMISSION
// =============================================================================

/**
 * Submit form data to Netlify Forms for dashboard visibility
 * This creates a record in Netlify Forms dashboard
 */
export async function submitToNetlifyForms(formData: AuditFormData): Promise<void> {
  try {
    const formBody = new URLSearchParams({
      'form-name': 'audit',
      'email': formData.email,
      'website': formData.website,
      'companyName': formData.companyName,
      'city': formData.city,
      'biggestPainPoint': formData.biggestPainPoint || '',
      'currentTools': formData.currentTools || '',
      'language': formData.language
    });

    const response = await fetch(`${clientConfig.siteUrl}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody.toString()
    });

    if (response.ok) {
      console.log('[Netlify Forms] Audit form submission recorded successfully');
    } else {
      console.warn(`[Netlify Forms] Submission returned status ${response.status}`);
    }
  } catch (error) {
    console.error('[Netlify Forms] Failed to submit to Netlify Forms:', error);
    // Don't throw - Netlify Forms failure shouldn't break the audit flow
  }
}
