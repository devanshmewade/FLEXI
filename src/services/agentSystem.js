// Agentic AI Orchestration System for Citizen Query Resolution
// Features: Multi-Agent Swarm, ReAct Loop, PII Guardrail, Tool Execution, HITL Escalation

import { CIVIC_KNOWLEDGE_BASE, MUNICIPAL_WARDS } from '../data/civicData';
import { callGemini, getStoredApiKey } from './geminiService';

// Helper for simulated delay in realistic agent demonstration
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Tool Definitions for Autonomous Action Agent
export const CIVIC_TOOLS = {
  create_civic_ticket: {
    name: 'create_civic_ticket',
    description: 'Generates an official tracked municipal grievance ticket in the civic registry.',
    execute: async (params) => {
      const year = new Date().getFullYear();
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const wardCode = params.wardId ? params.wardId.replace('WARD-', 'W') : 'W00';
      const ticketId = `CIVIC-${year}-${wardCode}-${randomNum}`;
      return {
        ticketId,
        status: 'LOGGED_IN_SYSTEM',
        registrationTimestamp: new Date().toISOString(),
        digitalSignature: `SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        slaDeadlineHours: params.slaHours || 48
      };
    }
  },

  lookup_ward_jurisdiction: {
    name: 'lookup_ward_jurisdiction',
    description: 'Finds the zonal officer, maintenance depot, and emergency contacts for a given ward.',
    execute: async (params) => {
      const ward = MUNICIPAL_WARDS.find(
        (w) => w.id.toLowerCase() === (params.wardId || '').toLowerCase()
      ) || MUNICIPAL_WARDS[0];
      return {
        wardId: ward.id,
        wardName: ward.name,
        zonalOfficer: ward.zonalOfficer,
        contactPhone: ward.phone,
        depotAssigned: ward.depot
      };
    }
  },

  dispatch_field_workorder: {
    name: 'dispatch_field_workorder',
    description: 'Automates dispatch of field engineering or sanitation crew to physical site.',
    execute: async (params) => {
      const workOrderId = `WO-${Math.floor(100 + Math.random() * 900)}`;
      return {
        workOrderId,
        dispatchStatus: 'SCHEDULED_DISPATCH',
        crewType: params.crewType || 'Rapid Action Maintenance Crew',
        allocatedDepot: params.depot || 'Central Maintenance Depot',
        priorityCode: params.priority || 'P2',
        estimatedArrivalTime: 'Within 4-8 Hours'
      };
    }
  },

  verify_document_checklist: {
    name: 'verify_document_checklist',
    description: 'Audits submitted or required citizen documents against municipal welfare schemes.',
    execute: async (params) => {
      const required = params.requiredDocs || ['National ID / Aadhaar', 'Address Proof'];
      return {
        verificationStatus: 'CHECKLIST_COMPILED',
        mandatoryDocuments: required,
        onlineSubmissionPortal: 'https://citizen.municipal.gov/services/verify',
        physicalVerificationRequired: false
      };
    }
  },

  dispatch_multichannel_alert: {
    name: 'dispatch_multichannel_alert',
    description: 'Sends automated SMS, Email, and WhatsApp dispatch alerts to citizen & department head.',
    execute: async (params) => {
      return {
        channels: ['SMS_GATEWAY', 'CITIZEN_WHATSAPP_BOT', 'INTERNAL_SLACK_ZONAL'],
        messageReceiptId: `MSG-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        deliveryStatus: 'QUEUED_AND_SENT',
        timestamp: new Date().toLocaleTimeString()
      };
    }
  }
};

/**
 * 1. TRIAGE & INTENT CLASSIFICATION AGENT
 */
export async function runTriageAgent(query, onLog, useLiveGemini = false) {
  onLog({
    agent: 'Triage Agent',
    type: 'THOUGHT',
    message: 'Analyzing citizen query text to extract intent, category, ward, urgency, and sentiment...'
  });

  if (useLiveGemini) {
    try {
      const prompt = `Analyze this citizen query for municipal grievance resolution:
Query: "${query}"

Return ONLY a JSON object with this exact structure:
{
  "category": "Public Works & Infrastructure" | "Sanitation & Solid Waste Management" | "Public Utilities (Water & Energy)" | "Citizen Welfare & Social Schemes" | "Certificates & Public Records" | "Emergency & Public Safety",
  "priority": "P1-CRITICAL" | "P2-HIGH" | "P3-STANDARD",
  "urgencyScore": number (0 to 100),
  "detectedWard": string (e.g. "WARD-12" or "WARD-07" or "WARD-04" or "WARD-15" or "UNKNOWN"),
  "sentiment": "Urgent/Distressed" | "Frustrated" | "Inquisitive" | "Neutral",
  "entities": {
    "location": string,
    "hazardOrTopic": string,
    "affectedPeople": string
  },
  "initialThought": string
}`;
      const res = await callGemini({
        prompt,
        systemInstruction: 'You are the Chief Intake & Triage Agent for a City Municipal Corporation. Classify queries accurately.',
        responseFormat: 'json'
      });

      if (!res.parseError && res.category) {
        onLog({
          agent: 'Triage Agent',
          type: 'OUTPUT',
          message: `Identified Category: ${res.category} | Priority: ${res.priority} | Ward: ${res.detectedWard} (Urgency: ${res.urgencyScore}%)`,
          data: res
        });
        return res;
      }
    } catch (err) {
      onLog({
        agent: 'Triage Agent',
        type: 'WARNING',
        message: `Gemini live call error (${err.message}). Falling back to local reasoning engine.`
      });
    }
  }

  // Local Rule & NLP Engine fallback
  await sleep(600);
  const lower = query.toLowerCase();

  let category = 'Public Works & Infrastructure';
  let priority = 'P2-HIGH';
  let urgencyScore = 65;
  let detectedWard = 'WARD-12';
  let sentiment = 'Frustrated';

  if (lower.includes('pothole') || lower.includes('road') || lower.includes('crater') || lower.includes('skidded')) {
    category = 'Public Works & Infrastructure';
    priority = 'P1-CRITICAL';
    urgencyScore = 92;
    sentiment = 'Urgent/Distressed';
  } else if (lower.includes('water') || lower.includes('mud') || lower.includes('sewage in tap') || lower.includes('turbid')) {
    category = 'Public Utilities (Water & Energy)';
    priority = 'P1-CRITICAL';
    urgencyScore = 95;
    sentiment = 'Urgent/Distressed';
  } else if (lower.includes('pension') || lower.includes('welfare') || lower.includes('senior citizen') || lower.includes('subsidy')) {
    category = 'Citizen Welfare & Social Schemes';
    priority = 'P3-STANDARD';
    urgencyScore = 40;
    sentiment = 'Inquisitive';
  } else if (lower.includes('garbage') || lower.includes('trash') || lower.includes('dump') || lower.includes('stench')) {
    category = 'Sanitation & Solid Waste Management';
    priority = 'P2-HIGH';
    urgencyScore = 75;
    sentiment = 'Frustrated';
  } else if (lower.includes('electricity') || lower.includes('bill') || lower.includes('meter') || lower.includes('overcharge')) {
    category = 'Public Utilities (Water & Energy)';
    priority = 'P2-HIGH';
    urgencyScore = 70;
    sentiment = 'Frustrated';
  } else if (lower.includes('manhole') || lower.includes('wire') || lower.includes('shock') || lower.includes('fire')) {
    category = 'Emergency & Public Safety';
    priority = 'P1-CRITICAL';
    urgencyScore = 98;
    sentiment = 'Urgent/Distressed';
  }

  // Extract ward if mentioned
  const wardMatch = query.match(/ward\s*([0-9]{1,2})/i);
  if (wardMatch) {
    const num = wardMatch[1].padStart(2, '0');
    detectedWard = `WARD-${num}`;
  } else if (lower.includes('sunrise') || lower.includes('tech park')) {
    detectedWard = 'WARD-12';
  } else if (lower.includes('school') || lower.includes('commercial')) {
    detectedWard = 'WARD-04';
  } else if (lower.includes('heritage') || lower.includes('riverside')) {
    detectedWard = 'WARD-15';
  } else {
    detectedWard = 'WARD-07';
  }

  const result = {
    category,
    priority,
    urgencyScore,
    detectedWard,
    sentiment,
    entities: {
      location: detectedWard,
      hazardOrTopic: category,
      affectedPeople: priority === 'P1-CRITICAL' ? 'General Public & Motorists' : 'Individual Resident'
    },
    initialThought: `Citizen query indicates ${category} issue in ${detectedWard} with ${sentiment} sentiment. Priority assigned as ${priority}.`
  };

  onLog({
    agent: 'Triage Agent',
    type: 'OUTPUT',
    message: `Classified: ${category} | Priority: ${priority} | Ward: ${detectedWard} (Urgency: ${urgencyScore}/100)`,
    data: result
  });

  return result;
}

/**
 * 2. GUARDRAIL & PII PRIVACY AGENT
 */
export async function runGuardrailAgent(query, onLog) {
  onLog({
    agent: 'Guardrail Agent',
    type: 'THOUGHT',
    message: 'Auditing query for Personally Identifiable Information (PII), sensitive IDs, and compliance...'
  });

  await sleep(400);

  // Redact Aadhaar (12 digits), Phone numbers (10 digits), Bank accounts
  let redacted = query;
  const piiFound = [];

  // Phone numbers (e.g. +91-9876543210 or 9876543210)
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?(\d{10})/g;
  if (phoneRegex.test(query)) {
    piiFound.push('Contact Phone Number');
    redacted = redacted.replace(phoneRegex, '[REDACTED_PHONE_****]');
  }

  // Aadhaar or 12 digit IDs
  const idRegex = /\b\d{4}\s?\d{4}\s?\d{4}\b/g;
  if (idRegex.test(query)) {
    piiFound.push('National ID / Aadhaar Number');
    redacted = redacted.replace(idRegex, '[REDACTED_AADHAAR_****]');
  }

  const result = {
    safeForPublicLog: true,
    piiDetected: piiFound.length > 0,
    piiFields: piiFound,
    redactedText: redacted,
    complianceStatus: 'GOV_COMPLIANCE_PASSED'
  };

  onLog({
    agent: 'Guardrail Agent',
    type: 'OUTPUT',
    message: piiFound.length > 0 
      ? `PII Guardrail Triggered: Redacted ${piiFound.join(', ')} to preserve citizen privacy.`
      : 'Compliance Check: No sensitive PII detected. Safe for public municipal audit trail.',
    data: result
  });

  return result;
}

/**
 * 3. CIVIC KNOWLEDGE & RULES RETRIEVAL AGENT (RAG)
 */
export async function runKnowledgeAgent(query, triageResult, onLog, useLiveGemini = false) {
  onLog({
    agent: 'Knowledge Agent',
    type: 'THOUGHT',
    message: `Searching Municipal Knowledge Base for policies, SLAs, and bylaws matching "${triageResult.category}"...`
  });

  await sleep(500);

  // Match best KB entry
  let matchedEntry = CIVIC_KNOWLEDGE_BASE.find(
    (k) => k.category.toLowerCase() === triageResult.category.toLowerCase()
  ) || CIVIC_KNOWLEDGE_BASE[0];

  // Specific keyword check
  const lower = query.toLowerCase();
  if (lower.includes('water') && lower.includes('mud')) {
    matchedEntry = CIVIC_KNOWLEDGE_BASE.find((k) => k.id === 'KB-WAT-01') || matchedEntry;
  } else if (lower.includes('pension') || lower.includes('senior')) {
    matchedEntry = CIVIC_KNOWLEDGE_BASE.find((k) => k.id === 'KB-WEL-01') || matchedEntry;
  } else if (lower.includes('bill') || lower.includes('meter')) {
    matchedEntry = CIVIC_KNOWLEDGE_BASE.find((k) => k.id === 'KB-WAT-02') || matchedEntry;
  } else if (lower.includes('manhole') || lower.includes('wire')) {
    matchedEntry = CIVIC_KNOWLEDGE_BASE.find((k) => k.id === 'KB-SAF-01') || matchedEntry;
  }

  const result = {
    kbId: matchedEntry.id,
    topic: matchedEntry.topic,
    bylawReference: matchedEntry.bylawReference,
    mandatedSlaHours: matchedEntry.slaHours,
    department: matchedEntry.department,
    eligibilityRules: matchedEntry.eligibilityRules || null,
    mandatoryActions: matchedEntry.mandatoryActions || []
  };

  onLog({
    agent: 'Knowledge Agent',
    type: 'OUTPUT',
    message: `Retrieved Policy: [${matchedEntry.id}] ${matchedEntry.topic} | SLA: ${matchedEntry.slaHours}h | Bylaw: ${matchedEntry.bylawReference}`,
    data: result
  });

  return result;
}

/**
 * 4. AUTONOMOUS ACTION & TOOL EXECUTION AGENT
 */
export async function runActionAgent(query, triageResult, knowledgeResult, onLog) {
  onLog({
    agent: 'Action Agent',
    type: 'THOUGHT',
    message: 'Evaluating required autonomous automations and planning tool calls...'
  });

  await sleep(400);

  const toolExecutions = [];

  // 1. Tool Call: Create Official Ticket
  onLog({
    agent: 'Action Agent',
    type: 'TOOL_CALL',
    message: 'Invoking tool: create_civic_ticket()',
    tool: 'create_civic_ticket',
    args: { wardId: triageResult.detectedWard, slaHours: knowledgeResult.mandatedSlaHours }
  });
  await sleep(350);
  const ticketResult = await CIVIC_TOOLS.create_civic_ticket.execute({
    wardId: triageResult.detectedWard,
    slaHours: knowledgeResult.mandatedSlaHours
  });
  toolExecutions.push({ tool: 'create_civic_ticket', result: ticketResult });

  // 2. Tool Call: Ward Jurisdiction Lookup
  onLog({
    agent: 'Action Agent',
    type: 'TOOL_CALL',
    message: `Invoking tool: lookup_ward_jurisdiction(wardId="${triageResult.detectedWard}")`,
    tool: 'lookup_ward_jurisdiction',
    args: { wardId: triageResult.detectedWard }
  });
  await sleep(300);
  const wardResult = await CIVIC_TOOLS.lookup_ward_jurisdiction.execute({
    wardId: triageResult.detectedWard
  });
  toolExecutions.push({ tool: 'lookup_ward_jurisdiction', result: wardResult });

  // 3. Conditional Tool Call based on Category:
  if (triageResult.priority === 'P1-CRITICAL' || triageResult.category.includes('Public Works') || triageResult.category.includes('Sanitation')) {
    onLog({
      agent: 'Action Agent',
      type: 'TOOL_CALL',
      message: 'Invoking tool: dispatch_field_workorder()',
      tool: 'dispatch_field_workorder',
      args: {
        crewType: knowledgeResult.topic.includes('Water') ? 'Water Emergency Response Squad' : 'Road Engineering Unit',
        depot: wardResult.depotAssigned,
        priority: triageResult.priority
      }
    });
    await sleep(350);
    const workOrderResult = await CIVIC_TOOLS.dispatch_field_workorder.execute({
      crewType: knowledgeResult.topic.includes('Water') ? 'Water Emergency Response Squad' : 'Road Engineering Unit',
      depot: wardResult.depotAssigned,
      priority: triageResult.priority
    });
    toolExecutions.push({ tool: 'dispatch_field_workorder', result: workOrderResult });
  } else if (triageResult.category.includes('Welfare') || triageResult.category.includes('Certificate')) {
    onLog({
      agent: 'Action Agent',
      type: 'TOOL_CALL',
      message: 'Invoking tool: verify_document_checklist()',
      tool: 'verify_document_checklist',
      args: { scheme: knowledgeResult.topic }
    });
    await sleep(300);
    const docResult = await CIVIC_TOOLS.verify_document_checklist.execute({
      requiredDocs: knowledgeResult.eligibilityRules?.requiredDocuments
    });
    toolExecutions.push({ tool: 'verify_document_checklist', result: docResult });
  }

  // 4. Send Multi-channel Notification
  onLog({
    agent: 'Action Agent',
    type: 'TOOL_CALL',
    message: 'Invoking tool: dispatch_multichannel_alert()',
    tool: 'dispatch_multichannel_alert',
    args: { ticketId: ticketResult.ticketId, officer: wardResult.zonalOfficer }
  });
  await sleep(300);
  const alertResult = await CIVIC_TOOLS.dispatch_multichannel_alert.execute({
    ticketId: ticketResult.ticketId
  });
  toolExecutions.push({ tool: 'dispatch_multichannel_alert', result: alertResult });

  onLog({
    agent: 'Action Agent',
    type: 'OUTPUT',
    message: `Automations Completed: Generated Ticket [${ticketResult.ticketId}] & Dispatched alerts to ${wardResult.zonalOfficer}`,
    data: { ticketResult, wardResult, toolExecutions }
  });

  return {
    ticketResult,
    wardResult,
    toolExecutions
  };
}

/**
 * 5. RESOLUTION & HUMAN-IN-THE-LOOP (HITL) SYNTHESIS AGENT
 */
export async function runResolutionAgent({
  query,
  triageResult,
  guardrailResult,
  knowledgeResult,
  actionResult,
  onLog,
  useLiveGemini = false
}) {
  onLog({
    agent: 'Resolution Agent',
    type: 'THOUGHT',
    message: 'Synthesizing all agent observations, tool results, and policy citations into an official citizen resolution letter...'
  });

  const ticketId = actionResult.ticketResult.ticketId;
  const wardName = actionResult.wardResult.wardName;
  const officer = actionResult.wardResult.zonalOfficer;
  const slaHours = knowledgeResult.mandatedSlaHours;
  const workOrder = actionResult.toolExecutions.find((t) => t.tool === 'dispatch_field_workorder')?.result;

  if (useLiveGemini) {
    try {
      const prompt = `You are the Municipal Grievance Redressal Officer AI Agent.
Draft an official, compassionate, and precise resolution response to this citizen query:
Citizen Query: "${query}"
Ticket ID: ${ticketId}
Assigned Department: ${knowledgeResult.department}
Assigned Ward: ${wardName} (Officer: ${officer})
Priority: ${triageResult.priority}
Guaranteed SLA: ${slaHours} Hours
Policy Bylaw: ${knowledgeResult.bylawReference}
Workorder Dispatched: ${workOrder ? workOrder.workOrderId : 'N/A'}

Provide a well-structured official response covering:
1. Formal Acknowledgement & Ticket Details
2. Immediate Actions Triggered Autonomously
3. Next Steps & Timeline
4. Official Contact Information`;

      const geminiResponse = await callGemini({
        prompt,
        systemInstruction: 'You write formal, authoritative yet empathetic civic resolution notices on behalf of City Municipal Corporation.'
      });

      if (geminiResponse && geminiResponse.trim().length > 50) {
        onLog({
          agent: 'Resolution Agent',
          type: 'OUTPUT',
          message: `Generated Official Resolution Letter via Gemini (${geminiResponse.length} chars)`
        });
        return {
          ticketId,
          resolutionText: geminiResponse,
          confidenceScore: 97,
          escalateToHumanOfficer: triageResult.priority === 'P1-CRITICAL' && triageResult.urgencyScore > 90,
          slaTargetDate: new Date(Date.now() + slaHours * 3600 * 1000).toLocaleString()
        };
      }
    } catch (err) {
      onLog({
        agent: 'Resolution Agent',
        type: 'WARNING',
        message: `Gemini live call error (${err.message}). Using local synthesis template.`
      });
    }
  }

  await sleep(600);

  // High-fidelity local structured synthesis
  let actionsSummary = '';
  if (workOrder) {
    actionsSummary = `• Automated Field Work-Order #${workOrder.workOrderId} has been dispatched to the ${workOrder.allocatedDepot}.\n• Priority Level: ${triageResult.priority} (${workOrder.crewType} assigned).\n• On-site team dispatch notification sent to Zonal Officer ${officer}.`;
  } else if (knowledgeResult.eligibilityRules) {
    actionsSummary = `• Scheme Eligibility Audited: Verified age and income thresholds against ${knowledgeResult.bylawReference}.\n• Required Checklist: ${knowledgeResult.eligibilityRules.requiredDocuments.join(', ')}.\n• Pre-filled Enrollment Packet dispatched to citizen registered mobile and email.`;
  } else {
    actionsSummary = `• An inquiry dossier has been registered with ${knowledgeResult.department}.\n• Automated notification sent to Zonal Supervisor ${officer}.\n• Investigation logged under ${knowledgeResult.bylawReference}.`;
  }

  const resolutionText = `OFFICIAL CIVIC GRIEVANCE RESOLUTION NOTICE
Municipal Corporation of Metropolitan Governance

Dear Citizen,

We acknowledge receipt of your civic communication regarding ${triageResult.category} in ${wardName}.

TICKET IDENTIFIER: ${ticketId}
MANDATED SLA: ${slaHours} Hours (Target Resolution: ${new Date(Date.now() + slaHours * 3600 * 1000).toLocaleString()})
REGULATORY CITATION: ${knowledgeResult.bylawReference}

AUTONOMOUS ACTIONS EXECUTED:
${actionsSummary}

OFFICIAL CONTACT & ESCALATION:
Zonal Officer: ${officer}
Assigned Office: ${actionResult.wardResult.depotAssigned}
Emergency Helpline: ${actionResult.wardResult.contactPhone}

You may track the live progression of your workorder at any time using your Ticket ID: ${ticketId}.

Thank you for your active civic participation in building a cleaner, safer city.`;

  const needsHumanReview = triageResult.priority === 'P1-CRITICAL';

  onLog({
    agent: 'Resolution Agent',
    type: 'OUTPUT',
    message: `Resolution Synthesized. Ticket #${ticketId} created with ${slaHours}h SLA. ${needsHumanReview ? 'Flagged for Officer HITL Confirmation.' : 'Fully Auto-Resolved.'}`,
    data: { ticketId, slaHours, needsHumanReview }
  });

  return {
    ticketId,
    resolutionText,
    confidenceScore: needsHumanReview ? 91 : 98,
    escalateToHumanOfficer: needsHumanReview,
    slaTargetDate: new Date(Date.now() + slaHours * 3600 * 1000).toLocaleString()
  };
}

/**
 * MASTER ORCHESTRATOR PIPELINE
 */
export async function executeCitizenAgentPipeline({
  query,
  onStepUpdate,
  useGemini = false
}) {
  const traceLogs = [];
  const logCollector = (logEvent) => {
    const enriched = {
      ...logEvent,
      timestamp: new Date().toLocaleTimeString(),
      id: Math.random().toString(36).substring(2, 9)
    };
    traceLogs.push(enriched);
    if (onStepUpdate) {
      onStepUpdate(enriched, traceLogs);
    }
  };

  const startTime = Date.now();

  try {
    // Stage 1: Triage & Intent Classifier
    const triageResult = await runTriageAgent(query, logCollector, useGemini);

    // Stage 2: Guardrail & PII Redaction
    const guardrailResult = await runGuardrailAgent(query, logCollector);

    // Stage 3: Civic Knowledge Base (RAG)
    const knowledgeResult = await runKnowledgeAgent(query, triageResult, logCollector, useGemini);

    // Stage 4: Action & Automation Tool Calling
    const actionResult = await runActionAgent(query, triageResult, knowledgeResult, logCollector);

    // Stage 5: Resolution & HITL Redressal Synthesis
    const resolutionResult = await runResolutionAgent({
      query,
      triageResult,
      guardrailResult,
      knowledgeResult,
      actionResult,
      onLog: logCollector,
      useLiveGemini: useGemini
    });

    const executionTimeMs = Date.now() - startTime;

    return {
      success: true,
      executionTimeMs,
      triageResult,
      guardrailResult,
      knowledgeResult,
      actionResult,
      resolutionResult,
      traceLogs
    };
  } catch (err) {
    logCollector({
      agent: 'System Orchestrator',
      type: 'ERROR',
      message: `Agent Pipeline Error: ${err.message}`
    });
    return {
      success: false,
      error: err.message,
      traceLogs
    };
  }
}
