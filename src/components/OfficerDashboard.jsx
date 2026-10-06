import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Users, 
  MapPin, 
  Filter, 
  Search, 
  ShieldAlert, 
  ArrowRight, 
  X, 
  ThumbsUp, 
  RotateCcw,
  Sparkles,
  Building
} from 'lucide-react';
import { INITIAL_OFFICER_TICKETS } from '../data/civicData';

export default function OfficerDashboard({ tickets = [], onUpdateTicketStatus }) {
  const [ticketList, setTicketList] = useState(
    tickets.length > 0 ? tickets : INITIAL_OFFICER_TICKETS
  );
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTicketForReview, setActiveTicketForReview] = useState(null);
  const [officerNote, setOfficerNote] = useState('');

  // Update list when external tickets prop changes
  React.useEffect(() => {
    if (tickets && tickets.length > 0) {
      setTicketList(tickets);
    }
  }, [tickets]);

  // Compute metrics
  const totalCount = ticketList.length;
  const criticalCount = ticketList.filter(t => t.priority === 'P1-CRITICAL').length;
  const pendingHitlCount = ticketList.filter(t => t.hitlStatus === 'PENDING_OFFICER_APPROVAL').length;
  const autoApprovedCount = ticketList.filter(t => t.hitlStatus === 'AUTO_APPROVED' || t.status === 'RESOLVED').length;
  const autoResolutionRate = totalCount > 0 ? Math.round((autoApprovedCount / totalCount) * 100) : 82;

  // Filtered tickets
  const filteredTickets = ticketList.filter(ticket => {
    if (selectedFilter === 'CRITICAL' && ticket.priority !== 'P1-CRITICAL') return false;
    if (selectedFilter === 'PENDING_HITL' && ticket.hitlStatus !== 'PENDING_OFFICER_APPROVAL') return false;
    if (selectedFilter === 'RESOLVED' && ticket.status !== 'RESOLVED') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ticket.ticketId.toLowerCase().includes(q) ||
        ticket.wardName.toLowerCase().includes(q) ||
        ticket.category.toLowerCase().includes(q) ||
        ticket.summary.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleApproveTicket = (ticketId) => {
    const updated = ticketList.map(t => {
      if (t.ticketId === ticketId) {
        return {
          ...t,
          status: 'DISPATCHED_WORKORDER',
          hitlStatus: 'OFFICER_APPROVED',
          officerNotes: officerNote || 'Approved by Zonal Duty Officer'
        };
      }
      return t;
    });
    setTicketList(updated);
    if (onUpdateTicketStatus) onUpdateTicketStatus(updated);
    setActiveTicketForReview(null);
    setOfficerNote('');
  };

  const handleRejectTicket = (ticketId) => {
    const updated = ticketList.map(t => {
      if (t.ticketId === ticketId) {
        return {
          ...t,
          status: 'FLAGGED_INVESTIGATION',
          hitlStatus: 'OFFICER_REJECTED',
          officerNotes: officerNote || 'Flagged for physical manual site audit'
        };
      }
      return t;
    });
    setTicketList(updated);
    if (onUpdateTicketStatus) onUpdateTicketStatus(updated);
    setActiveTicketForReview(null);
    setOfficerNote('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '1.75rem 2rem',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(6, 182, 212, 0.06) 100%)',
        borderLeft: '4px solid var(--accent-indigo)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <span className="badge badge-standard">Municipal Command & Control</span>
              <span className="badge badge-agent">Human-in-the-Loop (HITL) Supervisor</span>
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>
              Autonomous Redressal & Officer Operations Center
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.3rem 0 0 0' }}>
              Real-time monitoring of agent-triaged grievances, autonomous field workorders, and officer verification queues.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
              Live System Status: <strong style={{ color: 'var(--accent-emerald)' }}>99.98% Operational</strong>
            </span>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '1rem'
      }}>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Total Grievances Processed
            </span>
            <Users size={18} color="var(--accent-blue)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {totalCount}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
            <TrendingUp size={13} /> +18.4% today via AI Agent Swarm
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Autonomous Automation Rate
            </span>
            <Sparkles size={18} color="var(--accent-cyan)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {autoResolutionRate}%
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem', display: 'block' }}>
            Resolved without human officer backlog
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              P1 Critical Emergencies
            </span>
            <AlertTriangle size={18} color="var(--accent-rose)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fb7185' }}>
            {criticalCount}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-rose)', marginTop: '0.25rem', display: 'block' }}>
            SLA target &lt; 24h (Automated Workorders Issued)
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Pending Officer Review (HITL)
            </span>
            <Clock size={18} color="var(--accent-amber)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24' }}>
            {pendingHitlCount}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', marginTop: '0.25rem', display: 'block' }}>
            High-urgency cases requiring officer sign-off
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: `All Queries (${ticketList.length})` },
              { id: 'PENDING_HITL', label: `Pending HITL Sign-off (${pendingHitlCount})` },
              { id: 'CRITICAL', label: `Critical P1 (${criticalCount})` },
              { id: 'RESOLVED', label: 'Resolved' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                className={`btn btn-sm ${selectedFilter === f.id ? 'btn-primary' : 'btn-secondary'}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', minWidth: '280px' }}>
            <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            <input
              type="text"
              placeholder="Search by Ticket ID, Ward, or Keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem 0.5rem 2.25rem',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(226, 232, 240, 0.95)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {filteredTickets.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No tickets match your filter criteria.
          </div>
        ) : (
          filteredTickets.map((t) => {
            const isCritical = t.priority === 'P1-CRITICAL';
            const isPendingHitl = t.hitlStatus === 'PENDING_OFFICER_APPROVAL';

            return (
              <div
                key={t.ticketId}
                className="glass-panel"
                style={{
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  borderLeft: isCritical ? '4px solid var(--accent-rose)' : isPendingHitl ? '4px solid var(--accent-amber)' : '4px solid var(--accent-emerald)'
                }}
              >
                <div style={{ maxWidth: '650px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--accent-cyan)' }}>
                      {t.ticketId}
                    </span>
                    <span className={isCritical ? 'badge badge-critical' : 'badge badge-standard'} style={{ fontSize: '0.65rem' }}>
                      {t.priority}
                    </span>
                    <span className="badge badge-agent" style={{ fontSize: '0.65rem' }}>
                      {t.category}
                    </span>
                    {isPendingHitl && (
                      <span className="badge badge-high" style={{ fontSize: '0.65rem' }}>
                        Officer Review Needed
                      </span>
                    )}
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, margin: '0.2rem 0' }}>
                    {t.summary}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MapPin size={13} color="var(--accent-blue)" /> {t.wardName} ({t.wardId})
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Building size={13} /> {t.assignedDept}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-amber)' }}>
                      <Clock size={13} /> SLA Remaining: ~{t.slaRemainingHours}h
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>
                      AI Confidence
                    </span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                      {t.autonomousConfidence}%
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveTicketForReview(t)}
                    className={`btn btn-sm ${isPendingHitl ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ minWidth: '130px' }}
                  >
                    <span>{isPendingHitl ? 'Review (HITL)' : 'Inspect Trace'}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Human-in-the-Loop (HITL) Drawer / Review Modal */}
      {activeTicketForReview && (
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
            maxWidth: '680px',
            width: '100%',
            padding: '2rem',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: 'rgba(255, 255, 255, 0.96)',
            border: '1px solid rgba(226, 232, 240, 0.95)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <span className="badge badge-high" style={{ marginBottom: '0.4rem' }}>
                  Human-In-The-Loop Approval Protocol
                </span>
                <h3 style={{ fontSize: '1.3rem', margin: 0 }}>
                  Review Docket: {activeTicketForReview.ticketId}
                </h3>
              </div>
              <button 
                onClick={() => setActiveTicketForReview(null)}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.35rem' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{
              background: 'rgba(241, 245, 249, 0.8)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem',
              fontSize: '0.85rem',
              lineHeight: 1.6
            }}>
              <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem' }}>
                Citizen Grievance Synopsis:
              </strong>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                {activeTicketForReview.summary}
              </p>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)', display: 'block', marginBottom: '0.5rem' }}>
                Automated Actions Prepared by Agent Swarm:
              </strong>
              <div style={{
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem',
                fontSize: '0.8rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem'
              }}>
                <div>• <strong>Assigned Ward:</strong> {activeTicketForReview.wardName} ({activeTicketForReview.wardId})</div>
                <div>• <strong>Assigned Directorate:</strong> {activeTicketForReview.assignedDept}</div>
                <div>• <strong>AI Confidence Score:</strong> {activeTicketForReview.autonomousConfidence}%</div>
                <div>• <strong>Recommended Action:</strong> Dispatch emergency field maintenance team within 4 hours.</div>
              </div>
            </div>

            {/* Officer Notes */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
                Zonal Officer Endorsement / Instructions:
              </label>
              <textarea
                rows={2}
                placeholder="E.g., Approved. Ensure site photo upload upon completion of repair."
                value={officerNote}
                onChange={(e) => setOfficerNote(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(226, 232, 240, 0.95)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => handleRejectTicket(activeTicketForReview.ticketId)}
                className="btn btn-secondary"
                style={{ color: 'var(--accent-rose)', borderColor: 'rgba(244, 63, 94, 0.3)' }}
              >
                <RotateCcw size={16} />
                <span>Escalate for Physical Audit</span>
              </button>
              <button
                onClick={() => handleApproveTicket(activeTicketForReview.ticketId)}
                className="btn btn-primary"
              >
                <ThumbsUp size={16} />
                <span>1-Click Endorse & Dispatch Crew</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
