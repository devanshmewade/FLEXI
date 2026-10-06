import React from 'react';
import { 
  Building2, 
  Bot, 
  LayoutDashboard, 
  BookOpen, 
  KeyRound, 
  Sun, 
  Moon,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  theme, 
  setTheme, 
  onOpenApiKeyModal, 
  hasApiKey,
  activeModel 
}) {
  const mainNavItems = [
    { id: 'citizen', label: 'Citizen Helpdesk', icon: Building2 },
    { id: 'officer', label: 'Officer Dashboard', icon: LayoutDashboard },
    { id: 'project-info', label: 'Project & Agent Specs', icon: BookOpen },
  ];

  return (
    <header className="navbar-container glass-panel no-print" style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      borderRadius: 0,
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      padding: '0.75rem 1.5rem',
      background: theme === 'dark' ? 'rgba(11, 15, 25, 0.85)' : 'rgba(234, 243, 252, 0.88)',
      backdropFilter: 'blur(20px) saturate(180%)',
      borderBottom: '1px solid var(--bg-glass-border)'
    }}>
      <div style={{
        maxWidth: '1300px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        {/* Brand / Logo */}
        <div 
          onClick={() => setActiveTab('citizen')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'var(--gradient-civic)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 12px rgba(37, 99, 235, 0.4)'
          }}>
            <Bot size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                CivicPulse <span style={{ color: 'var(--accent-blue)' }}>AI</span>
              </span>
              <span className="badge badge-standard" style={{ fontSize: '0.62rem', padding: '0.1rem 0.4rem' }}>
                Agentic AI
              </span>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>
              AI Citizen Query Resolution
            </p>
          </div>
        </div>

        {/* Simplified Navigation Tabs (3 items) */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          background: theme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(219, 234, 254, 0.5)',
          padding: '0.25rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--bg-glass-border)'
        }}>
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  border: 'none',
                  padding: '0.45rem 0.95rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.82rem'
                }}
              >
                <Icon size={15} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Tools: API Key Config & Theme Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            id="btn-gemini-config"
            onClick={onOpenApiKeyModal}
            className="btn btn-secondary btn-sm"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              borderColor: hasApiKey ? 'rgba(16, 185, 129, 0.4)' : 'rgba(59, 130, 246, 0.3)',
              background: hasApiKey ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.08)',
              fontSize: '0.78rem'
            }}
          >
            {hasApiKey ? (
              <>
                <CheckCircle2 size={14} color="var(--accent-emerald)" />
                <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>Gemini Ready</span>
              </>
            ) : (
              <>
                <Sparkles size={14} color="var(--accent-cyan)" />
                <span>API Key (Optional)</span>
              </>
            )}
            <KeyRound size={12} style={{ opacity: 0.7 }} />
          </button>

          <button
            id="btn-theme-toggle"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="btn btn-secondary btn-sm"
            title="Toggle Dark/Light Mode"
            style={{ padding: '0.4rem', width: '34px', height: '34px' }}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>
    </header>
  );
}
