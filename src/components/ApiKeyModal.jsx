import React, { useState } from 'react';
import { 
  KeyRound, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ExternalLink,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { testGeminiConnection } from '../services/geminiService';

export default function ApiKeyModal({ 
  isOpen, 
  onClose, 
  apiKey, 
  onSaveKey, 
  activeModel, 
  onSelectModel 
}) {
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [selectedModel, setSelectedModel] = useState(activeModel || 'gemini-2.5-flash');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleTest = async () => {
    if (!inputKey.trim()) {
      setTestResult({ success: false, message: 'Please enter a Gemini API Key first.' });
      return;
    }
    setTesting(true);
    setTestResult(null);
    const result = await testGeminiConnection(inputKey.trim(), selectedModel);
    setTesting(false);
    setTestResult(result);
  };

  const handleSave = () => {
    onSaveKey(inputKey.trim());
    onSelectModel(selectedModel);
    onClose();
  };

  const handleClear = () => {
    setInputKey('');
    onSaveKey('');
    setTestResult(null);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1.5rem'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '560px',
        width: '100%',
        padding: '1.75rem',
        position: 'relative',
        boxShadow: 'var(--shadow-lg)',
        background: 'rgba(255, 255, 255, 0.95)',
        border: '1px solid rgba(226, 232, 240, 0.9)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(99, 102, 241, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(99, 102, 241, 0.25)'
            }}>
              <KeyRound size={20} color="var(--accent-indigo)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Gemini API Settings</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Configure Google Gemini for live agent reasoning & tool calling
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.35rem', borderRadius: 'var(--radius-sm)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Informational Callout */}
        <div style={{
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1rem',
          marginBottom: '1.25rem',
          fontSize: '0.82rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-start'
        }}>
          <Sparkles size={18} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: 'var(--text-main)' }}>Dual Execution Engine:</strong>
            <p style={{ color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
              If you leave this blank, CivicPulse will seamlessly use its <strong>High-Fidelity Local Agent Engine</strong> with full ReAct traces and tool calls. Providing a key unlocks live Gemini model inference!
            </p>
          </div>
        </div>

        {/* Model Selection */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>
            Gemini Model:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {[
              { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', desc: 'Latest, fast & agentic optimized' },
              { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', desc: 'High-throughput stable model' }
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedModel(m.id)}
                className={`btn btn-secondary ${selectedModel === m.id ? 'active-model' : ''}`}
                style={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'left',
                  borderColor: selectedModel === m.id ? 'var(--accent-indigo)' : 'rgba(226, 232, 240, 0.8)',
                  background: selectedModel === m.id ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.85)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: '100%' }}>
                  <Cpu size={14} color={selectedModel === m.id ? 'var(--accent-indigo)' : 'var(--text-muted)'} />
                  <strong style={{ fontSize: '0.85rem' }}>{m.name}</strong>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {m.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* API Key Input */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Google Gemini API Key:</label>
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noreferrer"
              style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-indigo)', fontWeight: 600 }}
            >
              Get Free Key from Google AI Studio <ExternalLink size={12} />
            </a>
          </div>
          <input
            id="input-gemini-api-key"
            type="password"
            placeholder="AIzaSy..."
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid rgba(226, 232, 240, 0.95)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-main)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.875rem',
              outline: 'none',
              transition: 'border-color var(--transition-fast)'
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.4rem' }}>
            <ShieldCheck size={14} color="var(--accent-emerald)" />
            <span style={{ fontSize: '0.73rem', color: 'var(--text-dim)' }}>
              Keys are stored only in your local browser storage (localStorage) and never transmitted to external third parties.
            </span>
          </div>
        </div>

        {/* Test Result Message */}
        {testResult && (
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: testResult.success ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
            border: `1px solid ${testResult.success ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
            color: testResult.success ? '#34d399' : '#fb7185'
          }}>
            {testResult.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{testResult.message}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
          <div>
            {inputKey && (
              <button 
                type="button" 
                onClick={handleClear} 
                className="btn btn-secondary btn-sm"
                style={{ color: 'var(--accent-rose)', borderColor: 'rgba(244, 63, 94, 0.2)' }}
              >
                Clear Key
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              id="btn-test-connection"
              type="button"
              onClick={handleTest}
              disabled={testing || !inputKey.trim()}
              className="btn btn-secondary"
            >
              {testing ? 'Testing...' : 'Test Connection'}
            </button>
            <button
              id="btn-save-key"
              type="button"
              onClick={handleSave}
              className="btn btn-primary"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
