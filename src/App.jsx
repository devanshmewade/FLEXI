import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ApiKeyModal from './components/ApiKeyModal';
import CitizenPortal from './components/CitizenPortal';
import OfficerDashboard from './components/OfficerDashboard';
import ArchitectureView from './components/ArchitectureView';
import AgentPlayground from './components/AgentPlayground';
import ProjectReport from './components/ProjectReport';
import { 
  getStoredApiKey, 
  saveStoredApiKey, 
  getStoredModel, 
  saveStoredModel 
} from './services/geminiService';
import { INITIAL_OFFICER_TICKETS } from './data/civicData';
import { Workflow, FlaskConical, FileText } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('citizen');
  const [projectSubTab, setProjectSubTab] = useState('architecture');
  const [theme, setTheme] = useState('light');
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [activeModel, setActiveModel] = useState(getStoredModel());
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [tickets, setTickets] = useState(INITIAL_OFFICER_TICKETS);

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Handle saving API key
  const handleSaveKey = (newKey) => {
    saveStoredApiKey(newKey);
    setApiKey(newKey);
  };

  // Handle model switch
  const handleSelectModel = (model) => {
    saveStoredModel(model);
    setActiveModel(model);
  };

  // Handle new ticket created by Citizen Agent Pipeline
  const handleNewTicketCreated = (newTicket) => {
    setTickets((prev) => [newTicket, ...prev]);
  };

  return (
    <div className="app-container">
      {/* Ambient Fluid Glow Lights */}
      <div className="ambient-glow-mesh no-print">
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
        <div className="ambient-orb ambient-orb-3" />
      </div>

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        setTheme={setTheme}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasApiKey={Boolean(apiKey && apiKey.trim())}
        activeModel={activeModel}
      />

      {/* Main Content Body */}
      <main className="main-content">
        {/* Tab 1: Citizen Helpdesk (Primary simple view) */}
        {activeTab === 'citizen' && (
          <CitizenPortal
            hasApiKey={Boolean(apiKey && apiKey.trim())}
            activeModel={activeModel}
            onNewTicketCreated={handleNewTicketCreated}
          />
        )}

        {/* Tab 2: Officer Dashboard */}
        {activeTab === 'officer' && (
          <OfficerDashboard
            tickets={tickets}
            onUpdateTicketStatus={(updated) => setTickets(updated)}
          />
        )}

        {/* Tab 3: Consolidated Project & Agent Specs */}
        {activeTab === 'project-info' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Clean Sub-tab Switcher */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '0.4rem',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '520px',
              margin: '0 auto',
              border: '1px solid var(--bg-glass-border)'
            }}>
              {[
                { id: 'architecture', label: 'Architecture & ReAct', icon: Workflow },
                { id: 'playground', label: 'Agent Lab', icon: FlaskConical },
                { id: 'report', label: 'Academic Report', icon: FileText }
              ].map((sub) => {
                const Icon = sub.icon;
                const isSubActive = projectSubTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setProjectSubTab(sub.id)}
                    className={`btn btn-sm ${isSubActive ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1, border: 'none', fontSize: '0.78rem' }}
                  >
                    <Icon size={14} />
                    <span>{sub.label}</span>
                  </button>
                );
              })}
            </div>

            {projectSubTab === 'architecture' && <ArchitectureView />}
            {projectSubTab === 'playground' && <AgentPlayground hasApiKey={Boolean(apiKey && apiKey.trim())} />}
            {projectSubTab === 'report' && <ProjectReport />}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="glass-panel no-print" style={{
        marginTop: 'auto',
        borderRadius: 0,
        borderBottom: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        padding: '1rem 2rem',
        fontSize: '0.78rem',
        color: 'var(--text-dim)',
        background: theme === 'dark' ? 'rgba(11, 15, 25, 0.95)' : 'rgba(255, 255, 255, 0.85)'
      }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <strong>CivicPulse AI</strong> • Agentic AI & Automation Project
          </div>
          <div>
            Google Gemini Powered • ReAct Multi-Agent Pipeline
          </div>
        </div>
      </footer>

      {/* Gemini API Key Configuration Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveKey={handleSaveKey}
        activeModel={activeModel}
        onSelectModel={handleSelectModel}
      />
    </div>
  );
}
