const scenarios = {
  executive: {
    title: 'Unified executive operating view',
    summary: 'A cross-functional view intended to clarify one recurring operating decision—not become another status dashboard.',
    ready: 'Shape next',
    owned: 'Build now',
    decision: 'Where leadership attention should move this week',
    evidence: 'Decision cadence, data reconciliation, repeat use',
    release: 'Validated definitions + access + named meeting owner'
  },
  selfservice: {
    title: 'Analyst self-service dataset',
    summary: 'A reusable dataset with definitions, lineage, access, and support boundaries that reduces one-off report requests.',
    ready: 'Shape next',
    owned: 'Build now',
    decision: 'Which questions analysts can answer without a new ticket',
    evidence: 'Reuse, support demand, query success, definition exceptions',
    release: 'Data contract + steward + usage documentation'
  },
  automation: {
    title: 'Exception workflow automation',
    summary: 'An automation that routes a recurring exception only after ownership, failure handling, and human override are explicit.',
    ready: 'Explore',
    owned: 'Shape next',
    decision: 'Which exception is safe and valuable to automate',
    evidence: 'Cycle time, rework, override rate, exception closure',
    release: 'Failure path + owner + rollback + operating evidence'
  },
  ai: {
    title: 'AI-assisted decision workflow',
    summary: 'An AI-enabled intervention bounded to one workflow, one human authority point, and one measurable operating outcome.',
    ready: 'Explore',
    owned: 'Shape next',
    decision: 'Where AI can improve judgment without obscuring authority',
    evidence: 'Use, quality, escalation, error pattern, outcome evidence',
    release: 'Evaluation + human authority + monitoring + adoption owner'
  }
};
let currentScenario = 'executive';
let ownerConfirmed = true;
let readyConfirmed = true;
function renderScenario(){
  const s = scenarios[currentScenario];
  document.querySelectorAll('.scenario-tab').forEach(b=>b.setAttribute('aria-selected', String(b.dataset.scenario===currentScenario)));
  const owner = document.querySelector('#ownerSwitch');
  const ready = document.querySelector('#readySwitch');
  if(owner) owner.setAttribute('aria-pressed', String(ownerConfirmed));
  if(ready) ready.setAttribute('aria-pressed', String(readyConfirmed));
  const disposition = ownerConfirmed && readyConfirmed ? s.owned : (!ownerConfirmed && !readyConfirmed ? 'Hold' : s.ready);
  document.querySelector('#disposition').textContent = disposition;
  document.querySelector('#resultTitle').textContent = s.title;
  document.querySelector('#resultSummary').textContent = s.summary;
  document.querySelector('#decisionText').textContent = s.decision;
  document.querySelector('#evidenceText').textContent = s.evidence;
  document.querySelector('#releaseText').textContent = s.release;
  document.querySelectorAll('.route-step').forEach((el,i)=>el.classList.toggle('active', i <= (disposition==='Build now'?4:disposition==='Shape next'?3:disposition==='Explore'?2:1)));
}
document.querySelectorAll('.scenario-tab').forEach(b=>b.addEventListener('click',()=>{currentScenario=b.dataset.scenario;renderScenario();}));
const ownerSwitch=document.querySelector('#ownerSwitch');
if(ownerSwitch) ownerSwitch.addEventListener('click',()=>{ownerConfirmed=!ownerConfirmed;renderScenario();});
const readySwitch=document.querySelector('#readySwitch');
if(readySwitch) readySwitch.addEventListener('click',()=>{readyConfirmed=!readyConfirmed;renderScenario();});
const reset=document.querySelector('#resetScenario');
if(reset) reset.addEventListener('click',()=>{currentScenario='executive';ownerConfirmed=true;readyConfirmed=true;renderScenario();});

const proofData={
  vape:{org:'Vape-Jet',role:'Director of Operations · 2025–Present',bullets:['Leads AI-first operating transformation across production, purchasing, quality, support, customer success, engineering issue flow, Odoo, Jira, HubSpot, Slack, telemetry, and AI-assisted workflows.','Connects factory, field, customer, and machine-fleet signals into prioritized work, dashboards, standard work, training, and accountability.'],transfer:'Directly relevant to intake, prioritization, blocker removal, cross-functional release readiness, adoption, and feedback loops.'},
  dudeworth:{org:'DudeWorth',role:'Founder / AI & Automation Advisor · 2017–Present',bullets:['Develops readiness and opportunity frameworks spanning value, feasibility, data readiness, governance, adoption burden, reuse, and time-to-value.','Designs agentic workflow patterns using structured context, human judgment, escalation, evaluation, and governance rails.'],transfer:'Directly relevant to forming opinions on what should be built, bounding AI-enabled solutions, and defining evidence before scale.'},
  amazon:{org:'Amazon',role:'Operations Management / Site Leader · 2014–2018',bullets:['Led launch and execution for Amazon Prime Pittsburgh in a 24/7 customer-backward environment supporting approximately five million second-day orders annually.','Built operating routines, throughput visibility, escalation paths, standard work, and Gemba-based improvement.'],transfer:'Relevant to decision cadence, operational transparency, rapid escalation, and maintaining momentum without process theater.'},
  compunetics:{org:'Compunetics',role:'Director of Operations and Engineering Management · 2000–2013',bullets:['Led engineering, manufacturing, quality, customer delivery, and complex technical programs in advanced electronics and high-reliability environments.','Built quality systems, root-cause practices, performance measures, and process controls across technical and operating teams.'],transfer:'Relevant to translating ambiguity into executable work, release-quality discipline, and technical/business trust.'}
};
function renderProof(key){
  const d=proofData[key]; if(!d) return;
  document.querySelectorAll('.proof-rail button').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.proof===key)));
  document.querySelector('#proofOrg').textContent=d.org;
  document.querySelector('#proofRole').textContent=d.role;
  document.querySelector('#proofBullets').innerHTML=d.bullets.map(x=>`<li>${x}</li>`).join('');
  document.querySelector('#proofTransfer').textContent=d.transfer;
}
document.querySelectorAll('.proof-rail button').forEach(b=>b.addEventListener('click',()=>renderProof(b.dataset.proof)));

const mobileToggle=document.querySelector('.mobile-toggle');
if(mobileToggle) mobileToggle.addEventListener('click',()=>{
  const nav=document.querySelector('.nav-links'); const open=nav.classList.toggle('open'); mobileToggle.setAttribute('aria-expanded',String(open));
});
if(document.querySelector('#resultTitle')) renderScenario();
