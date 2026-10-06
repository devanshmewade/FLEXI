import React, { useState } from 'react';
import { 
  FlaskConical, 
  Play, 
  Terminal, 
  CheckCircle2, 
  Sparkles, 
  Code2, 
  ShieldCheck, 
  BookOpen, 
  Wrench,
  Clock
} from 'lucide-react';
import { runTriageAgent, runGuardrailAgent, runKnowledgeAgent, CIVIC_TOOLS } from '../services/agentSystem';

export default function AgentPlayground({ hasApiKey }) {
  const [selectedAgent, setSelectedAgent] = useState('triage');
  const [testInput, setTestInput] = useState(
    'Dangerous open manhole near St. Mary School in Ward 04. Call citizen immediately at 9876543210 or Aadhaar 4492 8821 9912.'
  );
  const [isRunning, setIsRunning] = useState(false);
  const [agentOutput, setAgentOutput] = useState(null);
  const [executionTime, setExecutionTime] = useState(null);

  const handleRunAgent = async () => {
    setIsRunning(true);
    setAgentOutput(null);
    const start = performance.now();

    const dummyLog = () => {};

    try {
      if (selectedAgent === 'triage') {
        const res = await runTriageAgent(testInput, dummyLog, hasApiKey);
        setAgentOutput(res);
      } else if (selectedAgent === 'guardrail') {
        const res = await runGuardrailAgent(testInput, dummyLog);
        setAgentOutput(res);
      } else if (selectedAgent === 'knowledge') {
        const dummyTriage = { category: 'Public Works & Infrastructure' };
        const res = await runKnowledgeAgent(testInput, dummyTriage, dummyLog, hasApiKey);
        setAgentOutput(res);
      } else if (selectedAgent === 'action') {
        // Execute tool directly
        const toolRes = await CIVIC_TOOLS.create_civic_ticket.execute({
          wardId: 'WARD-12',
          slaHours: 24
        });
        const alertRes = await CIVIC_TOOLS.dispatch_multichannel_alert.execute({
          ticketId: toolRes.ticketId
        });
        setAgentOutput({ toolRes, alertRes });
      }
    } catch (err) {
      setAgentOutput({ error: err.message });
    }

    const elapsed = Math.round(performance.now() - start);
    setExecutionTime(elapsed);
    setIsRunning(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Banner */}
      <div className="glass-panel" style={{
        padding: '1.75rem 2rem',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.08) 100%)',
        borderLeft: '4px solid var(--accent-emerald)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
          <span className="badge badge-resolved">Interactive Testbed</span>
          <span className="badge badge-agent">Agent Unit Testing</span>
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>
          Agentic AI Playground & Unit Test Lab
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0.3rem 0 0 0' }}>
          Test individual autonomous agents in isolation. Inspect structured JSON payloads, execution times, and reasoning outputs.
        </p>
      </div>

      {/* Agent Selector Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {[
          { id: 'triage', name: 'Triage Agent', icon: Sparkles, desc: 'Intent & Urgency Classification' },
          { id: 'guardrail', name: 'Guardrail Agent', icon: ShieldCheck, desc: 'PII Redaction & Ethics' },
          { id: 'knowledge', name: 'Knowledge Agent', icon: BookOpen, desc: 'Municipal Bylaw & SLA RAG' },
          { id: 'action', name: 'Action Tool Agent', icon: Wrench, desc: 'Function Execution Test' }
        ].map((a) => {
          const Icon = a.icon;
          const isActive = selectedAgent === a.id;
          return (
            <button
              key={a.id}
              onClick={() => {
                setSelectedAgent(a.id);
                setAgentOutput(null);
              }}
              className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.65rem 1.1rem', borderRadius: 'var(--radius-md)' }}
            >
              <Icon size={16} />
              <span>{a.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Testing Panel */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Input Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>
              Agent Test Input:
            </label>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Testing Agent: <strong>{selectedAgent.toUpperCase()}</strong>
            </span>
          </div>

          <textarea
            rows={6}
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            style={{
              width: '100%',
              padding: '0.85rem',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid rgba(226, 232, 240, 0.95)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-main)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              lineHeight: 1.6,
              resize: 'vertical',
              outline: 'none',
              marginBottom: '1rem',
              flex: 1
            }}
          />

          <button
            onClick={handleRunAgent}
            disabled={isRunning || !testInput.trim()}
            className="btn btn-primary"
            style={{ alignSelf: 'flex-start' }}
          >
            {isRunning ? (
              <>
                <div className="animate-spin" style={{ width: '14px', height: '14px', border: '2px solid #ffffff', borderTopColor: 'transparent', borderRadius: '50%' }} />
                <span>Executing Agent...</span>
              </>
            ) : (
              <>
                <Play size={15} />
                <span>Run {selectedAgent.toUpperCase()} Agent</span>
              </>
            )}
          </button>
        </div>

        {/* Output Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Code2 size={16} color="var(--accent-cyan)" />
              Agent Structured JSON Output:
            </label>
            {executionTime !== null && (
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Clock size={13} /> {executionTime}ms
              </span>
            )}
          </div>

          <div style={{
            flex: 1,
            minHeight: '220px',
            background: 'rgba(0, 0, 0, 0.45)',
            border: '1px solid var(--bg-glass-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            color: '#a5b4fc',
            overflowY: 'auto',
            maxHeight: '380px'
          }}>
            {agentOutput ? (
              <pre style={{ margin: 0 }}>
                {JSON.stringify(agentOutput, null, 2)}
              </pre>
            ) : (
              <div style={{ color: 'var(--text-dim)', fontStyle: 'italic', paddingTop: '2rem', textAlign: 'center' }}>
                Click "Run Agent" to inspect output payload and latency.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
