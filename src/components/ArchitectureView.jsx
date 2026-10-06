import React from 'react';
import { 
  Cpu, 
  Workflow, 
  Layers, 
  ShieldCheck, 
  Database, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Terminal, 
  Code2,
  FileCheck
} from 'lucide-react';

export default function ArchitectureView() {
  const agentSpecs = [
    {
      name: 'Agent 1: Triage & Intent Classifier',
      role: 'Perception & Intake Specialist',
      reasoningPattern: 'Few-shot Intent Classification & Urgency Scoring',
      tools: ['None (Pure Neural Perception)'],
      output: 'Civic Category, Priority (P1-P3), Ward Tag, Urgency Score (0-100), Sentiment',
      color: 'var(--accent-blue)'
    },
    {
      name: 'Agent 2: Guardrail & PII Redactor',
      role: 'Privacy & Safety Compliance Officer',
      reasoningPattern: 'Regex & Named-Entity PII Redaction Guardrail',
      tools: ['regex_pii_scanner', 'compliance_checker'],
      output: 'Sanitized query text with masked Aadhaar, SSN, and mobile numbers for public logging',
      color: 'var(--accent-rose)'
    },
    {
      name: 'Agent 3: Knowledge & Rules Retriever (RAG)',
      role: 'Civic Charter & Bylaw Specialist',
      reasoningPattern: 'Grounded Retrieval-Augmented Generation (RAG)',
      tools: ['municipal_bylaw_lookup', 'welfare_criteria_matcher'],
      output: 'Exact Bylaw references, mandated SLA hours (4h - 96h), scheme eligibility checklist',
      color: 'var(--accent-amber)'
    },
    {
      name: 'Agent 4: Action & Automation Executor',
      role: 'Civic Workflow & Tool Dispatcher',
      reasoningPattern: 'Autonomous Function Calling / Tool Execution',
      tools: ['create_civic_ticket', 'lookup_ward_jurisdiction', 'dispatch_field_workorder', 'dispatch_multichannel_alert'],
      output: 'Cryptographically signed ticket ID, depot workorder #, multi-channel citizen SMS dispatch',
      color: 'var(--accent-cyan)'
    },
    {
      name: 'Agent 5: Resolution & HITL Synthesizer',
      role: 'Grievance Redressal & Redressal Officer',
      reasoningPattern: 'Reflection & Multi-Source Synthesis with Human-in-the-Loop Gate',
      tools: ['generate_official_receipt', 'escalate_to_human_officer'],
      output: 'Official citizen redressal letter, confidence rating, printable PDF docket',
      color: 'var(--accent-emerald)'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Title */}
      <div className="glass-panel" style={{
        padding: '2rem',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.08) 100%)',
        borderLeft: '4px solid var(--accent-indigo)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <span className="badge badge-agent">Subject: Agentic AI & Automation</span>
          <span className="badge badge-standard">System Specification</span>
        </div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 800, margin: 0 }}>
          Agentic AI System Architecture & Multi-Agent Swarm
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, margin: '0.5rem 0 0 0' }}>
          Complete technical explanation of how autonomous perception, the ReAct (Reasoning + Acting) loop, tool invocation schemas, and human-in-the-loop governance operate in CivicPulse AI.
        </p>
      </div>

      {/* Comparison: Chatbot vs Agentic AI */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Workflow size={20} color="var(--accent-cyan)" />
          Traditional LLM Chatbot vs Autonomous Agentic AI System
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Traditional Chatbot */}
          <div style={{
            background: 'rgba(244, 63, 94, 0.05)',
            border: '1px solid rgba(244, 63, 94, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem'
          }}>
            <h4 style={{ color: '#fb7185', fontSize: '1.05rem', marginBottom: '0.75rem' }}>
              ❌ Traditional Chatbot (Static LLM)
            </h4>
            <ul style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
              <li><strong>Passive:</strong> Only produces conversational text; cannot execute actions in the physical or digital world.</li>
              <li><strong>No Tools:</strong> Cannot interact with databases, municipal ERPs, or dispatch SMS alerts.</li>
              <li><strong>Hallucination Prone:</strong> May invent fictitious welfare policies or promise impossible resolution timelines.</li>
              <li><strong>No Governance:</strong> Doesn't redact citizen PII or enforce human-in-the-loop oversight.</li>
            </ul>
          </div>

          {/* Agentic AI */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.05)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem'
          }}>
            <h4 style={{ color: '#34d399', fontSize: '1.05rem', marginBottom: '0.75rem' }}>
              ✅ Autonomous Agentic AI (CivicPulse)
            </h4>
            <ul style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
              <li><strong>Proactive & Action-Oriented:</strong> Autonomously creates tickets, maps GIS wards, and dispatches field workorders.</li>
              <li><strong>Tool Use & APIs:</strong> Executes discrete functions (`create_civic_ticket`, `dispatch_workorder`).</li>
              <li><strong>Grounded RAG:</strong> Directly references municipal legal bylaws and citizen charter SLAs.</li>
              <li><strong>HITL Supervisor:</strong> Distinguishes routine auto-resolutions from emergency cases requiring officer sign-off.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Multi-Agent Swarm Pipeline Specifications */}
      <div>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers size={20} color="var(--accent-blue)" />
          Multi-Agent Pipeline & Specialized Personas
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {agentSpecs.map((agent, index) => (
            <div
              key={agent.name}
              className="glass-panel"
              style={{
                padding: '1.5rem',
                borderLeft: `4px solid ${agent.color}`,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1rem'
              }}
            >
              <div>
                <span className="badge badge-standard" style={{ fontSize: '0.68rem', marginBottom: '0.35rem' }}>
                  Stage {index + 1}
                </span>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0.2rem 0' }}>
                  {agent.name}
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                  Role: <strong>{agent.role}</strong>
                </p>
              </div>

              <div>
                <strong style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Reasoning Architecture
                </strong>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', marginTop: '0.25rem' }}>
                  {agent.reasoningPattern}
                </p>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                  {agent.tools.map((t) => (
                    <span key={t} style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      color: 'var(--accent-cyan)'
                    }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <strong style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Output / State Mutation
                </strong>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {agent.output}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The ReAct Loop Diagram & Tool Schema */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Terminal size={20} color="var(--accent-violet)" />
          Autonomous Tool Execution & ReAct Schema (Reasoning + Acting)
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Every tool executed by the Action Agent follows a strict JSON-RPC schema compatible with Gemini Function Calling:
        </p>

        <div style={{
          background: 'rgba(0, 0, 0, 0.5)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--bg-glass-border)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          lineHeight: 1.6,
          color: '#a5b4fc',
          overflowX: 'auto'
        }}>
{`// Example Tool Schema: create_civic_ticket()
{
  "name": "create_civic_ticket",
  "description": "Registers an official tracked grievance in municipal database with automated SLA",
  "parameters": {
    "type": "OBJECT",
    "properties": {
      "wardId": { "type": "STRING", "description": "e.g. WARD-12 (West Industrial)" },
      "category": { "type": "STRING", "description": "Public Works | Sanitation | Water" },
      "priority": { "type": "STRING", "enum": ["P1-CRITICAL", "P2-HIGH", "P3-STANDARD"] },
      "slaHours": { "type": "INTEGER", "description": "Calculated resolution timeline in hours" }
    },
    "required": ["wardId", "priority", "slaHours"]
  }
}`}
        </div>
      </div>
    </div>
  );
}
