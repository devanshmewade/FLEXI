// Comprehensive Civic Knowledge Base & Municipal Database for Agentic AI
export const CIVIC_KNOWLEDGE_BASE = [
  {
    id: 'KB-PW-01',
    category: 'Public Works & Infrastructure',
    topic: 'Pothole & Road Hazard Protocols',
    summary: 'Standard Operating Procedure for reporting and repairing damaged roadways, potholes, and open trenches.',
    slaHours: 24, // Priority 1 (Arterial), 48h for residential
    bylawReference: 'Municipal Roads & Infrastructure Maintenance Act, Section 14(b)',
    mandatoryActions: ['Geotag location', 'Assign road inspection engineer', 'Issue emergency patch workorder'],
    eligibleRemedies: ['Cold mix asphalt emergency patch', 'Full resurfacing if crater > 1.5m diameter'],
    department: 'Department of Public Works (DPW)'
  },
  {
    id: 'KB-PW-02',
    category: 'Public Works & Infrastructure',
    topic: 'Streetlight Failure & Dark Spots',
    summary: 'Resolution protocol for non-functional streetlights, timer malfunctions, and dark corridor public safety concerns.',
    slaHours: 36,
    bylawReference: 'Urban Public Safety & Lighting Standard, Regulation 7.2',
    mandatoryActions: ['Verify circuit breaker feeder', 'Dispatch pole technician', 'Replace LED fixture/photocell'],
    department: 'Department of Public Works (Electrical Wing)'
  },
  {
    id: 'KB-SAN-01',
    category: 'Sanitation & Solid Waste Management',
    topic: 'Garbage Overflow & Illegal Dumping',
    summary: 'Enforcement and cleanup procedures for overflowing community bins, open dumpsites, and missed door-to-door waste collection.',
    slaHours: 12,
    bylawReference: 'Solid Waste Management Bylaws, Chapter 4 (Clean City Mandate)',
    mandatoryActions: ['Dispatch compactor vehicle', 'Disinfect dumpsite area with bleaching agent', 'Notify ward sanitation supervisor'],
    department: 'Health & Sanitation Directorate'
  },
  {
    id: 'KB-SAN-02',
    category: 'Sanitation & Solid Waste Management',
    topic: 'Stormwater Drain & Sewer Clogging',
    summary: 'Protocols for handling clogged culverts, sewage overflow, and pre-monsoon desilting requests.',
    slaHours: 18,
    bylawReference: 'Drainage & Sewage Public Health Code, Section 22',
    mandatoryActions: ['Deploy suction-jetting machine', 'Inspect downstream blockage', 'Report structural pipe rupture if detected'],
    department: 'Health & Sanitation Directorate'
  },
  {
    id: 'KB-WAT-01',
    category: 'Public Utilities (Water & Energy)',
    topic: 'Water Supply Contamination & Turbidity',
    summary: 'Emergency containment protocol when citizen reports brown, foul-smelling, or mud-contaminated tap water.',
    slaHours: 6, // Critical public health
    bylawReference: 'Safe Drinking Water Guarantee Protocol, Act Section 3(a)',
    mandatoryActions: ['Issue boil-water precautionary advisory', 'Dispatch water quality testing team for coliform check', 'Isolate affected pipeline valve', 'Deploy emergency clean drinking water tanker'],
    department: 'Water Supply & Sewerage Board'
  },
  {
    id: 'KB-WAT-02',
    category: 'Public Utilities (Water & Energy)',
    topic: 'Erroneous / Abnormal Water & Power Billing',
    summary: 'Dispute redressal framework for meter reading spikes exceeding 25% of 6-month historical average.',
    slaHours: 72,
    bylawReference: 'Consumer Utility Rights & Fair Billing Regulations, Rule 9',
    mandatoryActions: ['Freeze penalty interest during dispute', 'Schedule physical meter recalibration test', 'Issue provisional adjusted bill'],
    department: 'Revenue & Utility Billing Cell'
  },
  {
    id: 'KB-WEL-01',
    category: 'Citizen Welfare & Social Schemes',
    topic: 'Senior Citizen Dignity Pension & Healthcare Scheme',
    summary: 'Eligibility verification and direct-benefit application process for senior citizens residing in municipal limits.',
    slaHours: 96,
    bylawReference: 'National Social Assistance Policy & Municipal Welfare Grant 2024',
    eligibilityRules: {
      minimumAge: 60,
      maximumAnnualIncome: 300000, // in INR
      residencyYearsRequired: 3,
      requiredDocuments: ['Aadhaar Card / National ID', 'Income Certificate', 'Bank Passbook Copy', 'Recent Passport Photograph']
    },
    benefits: 'Monthly financial stipend of ₹3,500 + Free medical checkups at all civic dispensaries',
    department: 'Social Welfare & Community Development'
  },
  {
    id: 'KB-WEL-02',
    category: 'Citizen Welfare & Social Schemes',
    topic: 'Urban Affordable Housing & Shelter Assistance',
    summary: 'Financial subsidy and rental support for economically weaker sections (EWS) facing eviction or living in dilapidated dwellings.',
    slaHours: 120,
    bylawReference: 'Civic Housing Equity & Slum Rehabilitation Ordinance, Sec 11',
    eligibilityRules: {
      maximumAnnualIncome: 250000,
      mustNotOwnPaccaHouse: true,
      requiredDocuments: ['National ID', 'Income & Caste Certificate', 'Ration Card (BPL/AAY)']
    },
    department: 'Social Welfare & Community Development'
  },
  {
    id: 'KB-CERT-01',
    category: 'Certificates & Public Records',
    topic: 'Birth, Death & Marriage Digital Certificate Issuance',
    summary: 'Automated document verification and certified QR-stamped copy issuance pipeline for vital public records.',
    slaHours: 48,
    bylawReference: 'Registration of Births and Deaths Act & Digital Citizen Services Rule 4',
    requiredDocuments: ['Hospital discharge slip / Institutional report', 'Parents / Spouse identification proof'],
    department: 'Vital Statistics & Registrar Office'
  },
  {
    id: 'KB-SAF-01',
    category: 'Emergency & Public Safety',
    topic: 'Hazardous Open Manholes & Hanging Live Wires',
    summary: 'Zero-tolerance emergency protocol for immediate physical barricading and 4-hour containment of life-threatening public hazards.',
    slaHours: 4, // Extremely critical
    bylawReference: 'Urban Disaster Prevention & Public Safety Mandate, Directive 1',
    mandatoryActions: ['Immediate automated siren/alert to nearest ward patrol', 'Barricade within 60 minutes', 'Seal with reinforced concrete cover'],
    department: 'Disaster Management & Emergency Response'
  }
];

// Municipal Administrative Wards Directory
export const MUNICIPAL_WARDS = [
  { id: 'WARD-04', name: 'Central Commercial & Civic District', zonalOfficer: 'Eng. Rajesh Sharma', phone: '+91-11-2301-4411', depot: 'North Central Maintenance Depot' },
  { id: 'WARD-07', name: 'East Green Valley Residential Zone', zonalOfficer: 'Smt. Ananya Sen', phone: '+91-11-2301-7722', depot: 'East Valley Works Depot' },
  { id: 'WARD-12', name: 'West Industrial & Tech Park Corridor', zonalOfficer: 'Er. Vikram Malhotra', phone: '+91-11-2301-8833', depot: 'West Sector Engineering Station' },
  { id: 'WARD-15', name: 'Old Heritage Town & Riverside Suburb', zonalOfficer: 'Shri Farhan Qureshi', phone: '+91-11-2301-9944', depot: 'Riverfront Civic Services Yard' }
];

// Diverse Realistic Citizen Query Presets
export const CITIZEN_QUERY_PRESETS = [
  {
    id: 'preset-pothole',
    label: '🚨 Deep Pothole & Road Hazard (P1 Critical)',
    category: 'Public Works & Infrastructure',
    icon: 'AlertTriangle',
    query: 'There is a huge 2-meter deep pothole right in front of Sunrise Apartment on 5th Main Road, Ward 12. Two two-wheelers skidded last night and someone got injured. Water is accumulating inside it. Please repair it immediately before a fatal accident happens!',
    ward: 'WARD-12',
    urgencyHint: 'High Priority (P1) - Public Safety Risk'
  },
  {
    id: 'preset-welfare',
    label: '👵 Senior Citizen Pension Scheme Eligibility',
    category: 'Citizen Welfare & Social Schemes',
    icon: 'HeartHandshake',
    query: 'I am Ramesh Kumar, 64 years old, living in Ward 07 for the past 12 years. My annual family income is ₹1,80,000 from small retail. Am I eligible for the Senior Citizen Healthcare and Dignity Pension Scheme? What exact documents do I need to submit to enroll?',
    ward: 'WARD-07',
    urgencyHint: 'Standard (P3) - Scheme Verification & Guidance'
  },
  {
    id: 'preset-water',
    label: '💧 Contaminated Tap Water & Mud Smell (P1 Critical)',
    category: 'Public Utilities (Water & Energy)',
    icon: 'Droplets',
    query: 'Since yesterday evening, tap water supplied to Sector B of Ward 15 is completely brown, muddy, and smelling like sewage. Families with small children cannot cook or drink. We urgently need water testing and clean drinking water tankers dispatched!',
    ward: 'WARD-15',
    urgencyHint: 'Critical Emergency (P1) - Public Health Hazard'
  },
  {
    id: 'preset-garbage',
    label: '🗑️ Garbage Overflow Near Public School',
    category: 'Sanitation & Solid Waste Management',
    icon: 'Trash2',
    query: 'The community garbage dump outside Govt High School in Ward 04 has not been cleared for 4 days. Stray dogs and cattle are scattering waste onto the main road. The stench is unbearable for schoolchildren. Kindly arrange compactor truck clearance today.',
    ward: 'WARD-04',
    urgencyHint: 'High (P2) - Public Sanitation Risk'
  },
  {
    id: 'preset-billing',
    label: '⚡ 400% Electricity Bill Anomaly Dispute',
    category: 'Public Utilities (Water & Energy)',
    icon: 'Zap',
    query: 'My residential electricity bill for Consumer No. EL-88392 in Ward 07 came to ₹24,800 this month, whereas our average for the last 2 years has never exceeded ₹2,200. We were out of town for 15 days! The meter reading seems completely faulty. Please audit this bill.',
    ward: 'WARD-07',
    urgencyHint: 'Medium (P2) - Billing Dispute Audit'
  },
  {
    id: 'preset-manhole',
    label: '⚠️ Open Manhole on Main Pedestrian Walkway',
    category: 'Emergency & Public Safety',
    icon: 'ShieldAlert',
    query: 'A heavy storm drain manhole cover is missing near the bus stop on Ward 12 Main Avenue. It is pitch dark at night and pedestrians can fall into the 10-foot drop. Barricade and replace the cover urgently!',
    ward: 'WARD-12',
    urgencyHint: 'P1 Emergency - Zero Tolerance Hazard'
  }
];

// Initial mock tickets for the Officer Dashboard
export const INITIAL_OFFICER_TICKETS = [
  {
    ticketId: 'CIVIC-2025-W12-1082',
    citizenName: 'Anonymous Citizen (Redacted)',
    category: 'Public Works & Infrastructure',
    wardId: 'WARD-12',
    wardName: 'West Industrial & Tech Park Corridor',
    summary: 'Road cave-in and asphalt failure near Metro Pillar 142',
    priority: 'P1-CRITICAL',
    status: 'DISPATCHED_WORKORDER',
    slaRemainingHours: 14,
    autonomousConfidence: 96,
    assignedDept: 'Department of Public Works (DPW)',
    hitlStatus: 'AUTO_APPROVED',
    createdAt: '2025-10-04T18:30:00Z',
    actionsTaken: ['Geotagged to Ward 12', 'Dispatched Workorder #WO-771', 'SMS notification sent to 3 ward supervisors']
  },
  {
    ticketId: 'CIVIC-2025-W07-1083',
    citizenName: 'Sunita Devi (PII Verified)',
    category: 'Citizen Welfare & Social Schemes',
    wardId: 'WARD-07',
    wardName: 'East Green Valley Residential Zone',
    summary: 'Senior Citizen Pension Scheme application assistance & document verification',
    priority: 'P3-STANDARD',
    status: 'RESOLVED',
    slaRemainingHours: 82,
    autonomousConfidence: 94,
    assignedDept: 'Social Welfare & Community Development',
    hitlStatus: 'COMPLETED',
    createdAt: '2025-10-05T06:15:00Z',
    actionsTaken: ['Verified Aadhaar & Income eligibility', 'Generated Enrollment Form #SF-991', 'Dispatched instruction checklist']
  },
  {
    ticketId: 'CIVIC-2025-W15-1084',
    citizenName: 'Kunal Verma',
    category: 'Public Utilities (Water & Energy)',
    wardId: 'WARD-15',
    wardName: 'Old Heritage Town & Riverside Suburb',
    summary: 'Sewage seepage detected in tap water pipeline',
    priority: 'P1-CRITICAL',
    status: 'IN_OFFICER_REVIEW',
    slaRemainingHours: 3,
    autonomousConfidence: 89,
    assignedDept: 'Water Supply & Sewerage Board',
    hitlStatus: 'PENDING_OFFICER_APPROVAL',
    createdAt: '2025-10-05T09:00:00Z',
    actionsTaken: ['Issued boil-water precautionary alert', 'Water tanker dispatch order drafted', 'Awaiting Officer sign-off for pipe shutoff']
  },
  {
    ticketId: 'CIVIC-2025-W04-1085',
    citizenName: 'Pooja Hegde',
    category: 'Sanitation & Solid Waste Management',
    wardId: 'WARD-04',
    wardName: 'Central Commercial & Civic District',
    summary: 'Illegal commercial biomedical waste dumping behind clinic',
    priority: 'P2-HIGH',
    status: 'IN_OFFICER_REVIEW',
    slaRemainingHours: 19,
    autonomousConfidence: 88,
    assignedDept: 'Health & Sanitation Directorate',
    hitlStatus: 'PENDING_OFFICER_APPROVAL',
    createdAt: '2025-10-05T08:20:00Z',
    actionsTaken: ['Hazardous waste protocol flagged', 'Drafted penalty inspection notice', 'Assigned Sanitation Inspector #SI-04']
  }
];
