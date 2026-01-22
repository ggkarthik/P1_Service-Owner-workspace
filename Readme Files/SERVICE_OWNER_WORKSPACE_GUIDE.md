# 🎯 Service Owner Workspace - Quick Navigation Guide

## 🚀 Getting Started

### Access the Workspace

1. **Open the Dashboard**: Navigate to http://localhost:3000 (the browser preview should already be open)

2. **Find the Navigation**: Look at the left sidebar

3. **Click on Service Owner**: 
   ```
   Left Sidebar:
   ├── Main
   │   └── Dashboard
   ├── Service Owner  ← Click here!
   │   └── Service Owner Workspace
   └── Security
       ├── Security
       ├── Open Source Security
       └── Base Image Management
   ```

4. **Click "Service Owner Workspace"**: Opens the main workspace interface

---

## 🎨 Interface Overview

### Top Section: Service Selector

```
┌─────────────────────────────────────────────────────────────┐
│ SELECT A SERVICE                                             │
├─────────────────────────────────────────────────────────────┤
│  [frontend]      [cartservice]    [productcatalog...]       │
│   CRITICAL         HIGH              MEDIUM                  │
│   Go • 7 vulns    C# • 5 vulns     Go • 4 vulns            │
│                                                              │
│  [currencyservice] [paymentservice] [shippingservice]       │
│   MEDIUM           CRITICAL         LOW                      │
│  ...and 6 more services                                     │
└─────────────────────────────────────────────────────────────┘
```

**Instructions**:
- Click on any service card to view its risk profile
- Services are color-coded by risk level
- Selected service will have a purple border

---

### View Toggle Buttons

```
┌─────────────────────────────────────────────────────────────┐
│  [HIGH-LEVEL VIEW] [GRANULAR VIEW]                          │
└─────────────────────────────────────────────────────────────┘
```

**Instructions**:
- Click "HIGH-LEVEL VIEW" for executive dashboard
- Click "GRANULAR VIEW" for detailed vulnerability table
- Active view is highlighted in purple

---

## 📊 High-Level View Layout

```
┌────────────────────────────────────────────────────────────────┐
│ RISK OVERVIEW (Purple Gradient Hero Card)                      │
│                                                                 │
│  SERVICE RISK SCORE                      [Trend Chart]         │
│         85                               30 days →            │
│  BUSINESS IMPACT: CRITICAL                                     │
└────────────────────────────────────────────────────────────────┘

┌──────────────────────────────┐ ┌──────────────────────────────┐
│ SERVICE COMPOSITION          │ │ EXPOSURE OVERVIEW            │
│                              │ │                              │
│     [Service Box]            │ │ Critical  █████ 2            │
│         ↓                    │ │ High      ████████ 3         │
│  [Dep1] [Dep2] [Dep3]       │ │ Medium    ████ 2             │
│                              │ │ Low       ░░ 0               │
│  Language: Go                │ │                              │
└──────────────────────────────┘ └──────────────────────────────┘

┌──────────────────────────────┐ ┌──────────────────────────────┐
│ REMEDIATION PROGRESS         │ │ COMPLIANCE POSTURE           │
│                              │ │                              │
│    0      48h      3         │ │      [Circle Chart]          │
│ Breaches  MTTR  Teams        │ │          84                  │
│                              │ │                              │
│ Open: 4                      │ │ 3 Frameworks                 │
│ In Progress: 3               │ │ 3 Failed Controls            │
└──────────────────────────────┘ └──────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ AI INSIGHTS & RECOMMENDATIONS (Pink Gradient)                  │
│                                                                 │
│ ⚠️ Vulnerabilities likely to be exploited up 25% in 30 days   │
│ ⚡ Attack surface increased by 15% in the last 14 days        │
│                                                                 │
│ Next Best Actions:                                             │
│ • Patch critical assets immediately to reduce risk by 45%     │
│   (Priority: High, Impact: Critical)                           │
│                                                                 │
│           [VIEW DETAILED VULNERABILITIES]                      │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ CONVERSATIONAL COPILOT                                         │
├────────────────────────────────────────────────────────────────┤
│ AI: Hello! I'm your Security Copilot...                       │
│                                                                 │
│ [Type your question here...]                      [SEND]       │
└────────────────────────────────────────────────────────────────┘
```

### What to Do in High-Level View:

1. **Check Risk Score**: Large number shows overall risk (0-100)
2. **Review Trend**: See if risk is increasing or decreasing
3. **Examine Composition**: Understand service dependencies
4. **Analyze Exposure**: Review vulnerability distribution
5. **Track Remediation**: Monitor MTTR and team progress
6. **Check Compliance**: Ensure adherence to frameworks
7. **Read AI Insights**: Review predictions and recommendations
8. **Ask Questions**: Use the copilot to get more information

---

## 🔍 Granular View Layout

```
┌────────────────────────────────────────────────────────────────┐
│ 🛡️ Vulnerabilities for frontend          [BACK TO OVERVIEW]  │
├────────────────────────────────────────────────────────────────┤
│ [All (7)] [Critical (2)] [High (3)] [Medium (2)] [Low (0)]    │
├────────────────────────────────────────────────────────────────┤
│ ID              │ Type           │ Severity │ CVSS │ Package   │
│─────────────────┼────────────────┼──────────┼──────┼──────────│
│ VULN-FRONT-001  │ SQL Injection  │ CRITICAL │ 9.2  │ express  │
│ VULN-FRONT-002  │ XSS            │ HIGH     │ 7.5  │ react    │
│ VULN-FRONT-003  │ CSRF           │ HIGH     │ 6.8  │ django   │
│ ...                                                             │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ AI RECOMMENDATIONS                                             │
├────────────────────────────────────────────────────────────────┤
│ ⚠️ Patch critical assets immediately to reduce risk by 45%    │
│    Priority: High | Impact: Critical | Effort: Low            │
│                                                                 │
│ ⚡ Update express to version 4.18.2 to fix 5 vulnerabilities │
│    Priority: High | Impact: High | Effort: Medium             │
└────────────────────────────────────────────────────────────────┘
```

### What to Do in Granular View:

1. **Filter by Severity**: Click severity buttons to focus on specific vulnerabilities
2. **Review Table**: Examine each vulnerability's details
3. **Sort Columns**: Click column headers to sort (if implemented)
4. **Check Status**: See which vulnerabilities are Open vs. In Progress
5. **View Details**: Click "View Details" button for more information
6. **Read Recommendations**: Review AI suggestions for remediation
7. **Plan Actions**: Prioritize based on severity and impact

---

## 💬 Using the AI Copilot

### Example Conversations

**Query 1: Risk Assessment**
```
You: What is my current risk score?

AI: The frontend service currently has a risk score of 85, 
    which is classified as Critical. This is primarily due to 
    7 vulnerabilities, including 2 critical and 3 high severity issues.
```

**Query 2: Vulnerability Count**
```
You: How many critical vulnerabilities do I have?

AI: There are 7 total vulnerabilities in the frontend service. 
    The breakdown is: 2 Critical, 3 High, 2 Medium, and 0 Low. 
    I recommend prioritizing the Critical vulnerabilities first.
```

**Query 3: Recommendations**
```
You: What should I prioritize?

AI: Based on my analysis, here's my top recommendation: 
    Patch critical assets immediately to reduce risk by 45%. 
    This has a High priority and Critical business impact.
```

**Query 4: Compliance**
```
You: What is the compliance status?

AI: The frontend service has a compliance adherence score of 84%, 
    with 3 failed controls and 2 policy violations. 
    The applicable frameworks are: PCI-DSS, SOC 2, ISO 27001.
```

**Query 5: MTTR**
```
You: What is the MTTR?

AI: The Mean Time To Remediate (MTTR) for frontend is 48 hours. 
    There are currently 3 vulnerabilities in progress and 1 overdue 
    item assigned to 3 teams.
```

### Tips for Better Interactions:

- ✅ Ask specific questions about risk, vulnerabilities, compliance
- ✅ Use keywords like "risk", "vulnerability", "recommend", "MTTR"
- ✅ Questions can be casual: "What should I do?" or formal
- ✅ The AI has context about the selected service
- ❌ Don't expect real-time data (it's based on generated data)

---

## 🎯 Common Workflows

### Workflow 1: Quick Risk Assessment (5 minutes)

1. Select service with highest risk (e.g., frontend - Critical)
2. Check risk score and trend
3. Review AI insights
4. Ask copilot: "What should I prioritize?"
5. Note top recommendations

### Workflow 2: Vulnerability Review (15 minutes)

1. Select service to review
2. Switch to Granular View
3. Filter by "Critical" vulnerabilities
4. Review each vulnerability's details
5. Check assigned teams
6. Read AI recommendations
7. Plan remediation actions

### Workflow 3: Compliance Audit (10 minutes)

1. Select service for audit
2. View compliance posture (84% score)
3. Note failed controls count
4. Ask copilot: "What is the compliance status?"
5. Review applicable frameworks
6. Check policy violations
7. Plan corrective actions

### Workflow 4: Team Coordination (10 minutes)

1. Select service
2. Check remediation progress
3. Note MTTR and team assignments
4. Review overdue vulnerabilities
5. Switch to Granular View
6. Filter by "Open" status (if implemented)
7. Assign or reassign as needed

---

## 🎨 Color Legend

### Risk Levels
- 🔴 **Critical** (80-100): Immediate action required
- 🟠 **High** (60-79): Urgent attention needed
- 🟡 **Medium** (40-59): Should be addressed soon
- 🟢 **Low** (0-39): Monitor and plan

### Vulnerability Severity
- 🔴 **Critical**: Red badge, immediate patching
- 🟠 **High**: Orange badge, urgent remediation
- 🟡 **Medium**: Yellow badge, schedule fix
- 🟢 **Low**: Green badge, backlog item

### Status Indicators
- 🔴 **Open**: Not yet addressed (red background)
- 🟠 **In Progress**: Being worked on (orange background)
- 🟢 **Resolved**: Fixed and verified (green background)
- 🔵 **Mitigated**: Risk reduced (blue background)

---

## 🔄 Refreshing Data

To generate fresh risk data:

```bash
# Run the data generation script
python3 generate_service_owner_data.py

# Refresh the browser to see new data
# Or use the convenient launch script:
./run_service_owner_workspace.sh
```

---

## 📱 Mobile & Responsive

The workspace is responsive and works on:
- ✅ Desktop (1920x1080+)
- ✅ Laptop (1366x768+)
- ✅ Tablet (768x1024+)
- ✅ Mobile (375x667+)

**Note**: Best viewed on desktop for full experience.

---

## 🆘 Troubleshooting

### Issue: "No service owner data available"
**Solution**: Run `python3 generate_service_owner_data.py`

### Issue: Service selection not working
**Solution**: Check browser console for errors, refresh page

### Issue: AI Copilot not responding
**Solution**: Ensure you've selected a service first

### Issue: Styles not loading
**Solution**: Clear browser cache, restart npm server

### Issue: Data looks stale
**Solution**: Generate fresh data and refresh browser

---

## 🎓 Learning Resources

### Key Concepts Explained

**Risk Score (0-100)**:
- Calculated based on vulnerabilities, business criticality, and exposure
- Higher scores = more critical to address
- Updated daily (in real implementation)

**MTTR (Mean Time To Remediate)**:
- Average time to fix vulnerabilities
- Measured in hours
- Lower is better (faster remediation)

**Business Criticality**:
- Critical: Core business function
- High: Important but not mission-critical
- Medium: Supporting function
- Low: Nice-to-have functionality

**Compliance Frameworks**:
- PCI-DSS: Payment card security
- SOC 2: Service organization controls
- ISO 27001: Information security management
- GDPR: Data protection regulation

---

## 🎉 Tips for Success

1. **Start with High-Level View**: Get the big picture first
2. **Use Filters Wisely**: Focus on Critical and High severity
3. **Leverage AI Insights**: They provide valuable context
4. **Chat Often**: The copilot is there to help
5. **Track Trends**: Monitor 30-day risk changes
6. **Check MTTR**: Ensure timely remediation
7. **Review Regularly**: Weekly check-ins recommended
8. **Share with Team**: Use for collaborative planning

---

*Happy Risk Managing! 🎯*

For more details, see:
- `SERVICE_OWNER_WORKSPACE.md` - Full documentation
- `SERVICE_OWNER_WORKSPACE_SUMMARY.md` - Implementation details
