const scenarios = {
  executive: {
    title: "Executive performance view",
    label: "Illustrative baseline",
    values: [86, 76, 72, 82],
    decision: "BUILD",
    tone: "success",
    copy: "Clear decision owner and business outcome; validate the source definitions, then release with an adoption review."
  },
  selfservice: {
    title: "Self-service supplier dataset",
    label: "Illustrative scenario",
    values: [74, 62, 58, 55],
    decision: "VALIDATE",
    tone: "warning",
    copy: "The value is credible, but definition ownership and repeat-user behavior need evidence before broad release."
  },
  agent: {
    title: "AI-assisted exception triage",
    label: "Illustrative scenario",
    values: [82, 48, 64, 46],
    decision: "SEQUENCE",
    tone: "hold",
    copy: "Sequence behind data quality, human authority, and evaluation work. A bounded pilot can test the operating contract."
  },
  urgent: {
    title: "Urgent dashboard correction",
    label: "Illustrative scenario",
    values: [67, 92, 90, 78],
    decision: "BUILD",
    tone: "success",
    copy: "Time-sensitive and low ambiguity. Fix quickly, record the root cause, and prevent recurrence through a reusable control."
  }
};

const stageNames = ["outcome", "evidence", "delivery", "adoption"];
const toneMap = {
  success: ["var(--soft-lime)", "var(--success)"],
  warning: ["#fff3d6", "var(--warning)"],
  hold: ["var(--soft-violet)", "var(--hold)"],
  stop: ["#ffe6eb", "var(--stop)"]
};

function getGateCount(score) {
  if (score >= 75) return 2;
  if (score >= 55) return 1;
  return 0;
}

function getStageState(score) {
  const gateCount = getGateCount(score);
  if (gateCount === 2) return "ready";
  if (gateCount === 1) return "partial";
  return "blocked";
}

function deriveDecision(values) {
  const [outcome, evidence, delivery, adoption] = values;
  if (outcome < 45) {
    return {
      decision: "STOP",
      tone: "stop",
      copy: "The request does not yet justify scarce delivery capacity. Clarify the decision and value before committing."
    };
  }
  if (evidence < 55 || adoption < 50) {
    return {
      decision: "VALIDATE",
      tone: "warning",
      copy: "The opportunity is plausible, but one bounded validation should prove evidence readiness or adoption ownership."
    };
  }
  if (delivery < 55) {
    return {
      decision: "SEQUENCE",
      tone: "hold",
      copy: "Sequence the work behind a dependency, capacity constraint, or release-readiness requirement."
    };
  }
  return {
    decision: "BUILD",
    tone: "success",
    copy: "Outcome, evidence, delivery path, and adoption ownership are strong enough to commit."
  };
}

function updateStageColumn(stageName, score) {
  const column = document.querySelector(`.route-col[data-stage="${stageName}"]`);
  if (!column) return;

  const gateCount = getGateCount(score);
  const state = getStageState(score);
  column.dataset.state = state;
  column.setAttribute(
    "aria-label",
    `${stageName} score ${score}; ${gateCount} of 2 gates active`
  );

  const scoreNode = column.querySelector(".stage-score");
  if (scoreNode) scoreNode.textContent = score;

  column.querySelectorAll(".gate").forEach((gate, index) => {
    gate.classList.toggle("active", index < gateCount);
  });
}

function updateHero(decision, values) {
  const decisionCopy = {
    BUILD: "Ready to commit",
    VALIDATE: "Prove before scale",
    SEQUENCE: "Resolve dependency",
    STOP: "Clarify or stop"
  };

  stageNames.forEach((stageName, index) => updateStageColumn(stageName, values[index]));

  const badge = document.querySelector(".decision-badge");
  if (badge) {
    const tone = {
      BUILD: "success",
      VALIDATE: "warning",
      SEQUENCE: "hold",
      STOP: "stop"
    }[decision] || "success";
    badge.textContent = decision;
    badge.style.background = toneMap[tone][0];
    badge.style.color = toneMap[tone][1];
  }

  const copyNode = document.getElementById("heroDecisionCopy");
  if (copyNode) copyNode.textContent = decisionCopy[decision] || "";
}

function derive() {
  const sliders = [...document.querySelectorAll(".criterion input")];
  if (!sliders.length) return;

  const values = sliders.map((slider) => Number(slider.value));
  document.querySelectorAll(".criterion output").forEach((output, index) => {
    output.textContent = values[index];
  });

  const result = deriveDecision(values);
  const box = document.getElementById("disposition");
  if (box) {
    box.style.background = toneMap[result.tone][0];
    box.style.borderColor = toneMap[result.tone][1];
    const title = box.querySelector("strong");
    const copy = box.querySelector("p");
    if (title) {
      title.textContent = result.decision;
      title.style.color = toneMap[result.tone][1];
    }
    if (copy) copy.textContent = result.copy;
  }

  updateHero(result.decision, values);
}

function loadScenario(key) {
  const scenario = scenarios[key];
  if (!scenario) return;

  document.querySelectorAll(".artifact-tab").forEach((button) => {
    const active = button.dataset.scenario === key;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", active);
  });

  document.querySelectorAll(".request-card").forEach((button) => {
    button.classList.toggle("active", button.dataset.scenario === key);
  });

  const title = document.getElementById("scenarioTitle");
  const label = document.getElementById("scenarioLabel");
  if (title) title.textContent = scenario.title;
  if (label) label.textContent = scenario.label;

  document.querySelectorAll(".criterion input").forEach((slider, index) => {
    slider.value = scenario.values[index];
  });

  derive();
}

function init() {
  document.querySelectorAll(".artifact-tab").forEach((button) => {
    button.addEventListener("click", () => loadScenario(button.dataset.scenario));
  });

  document.querySelectorAll(".criterion input").forEach((slider) => {
    slider.addEventListener("input", derive);
  });

  document.getElementById("resetBaseline")?.addEventListener("click", () => {
    loadScenario("executive");
  });

  document.querySelectorAll(".request-card").forEach((button) => {
    button.addEventListener("click", () => loadScenario(button.dataset.scenario));
  });

  document.querySelector(".menu-button")?.addEventListener("click", (event) => {
    const nav = document.querySelector(".nav-links");
    if (!nav) return;
    nav.classList.toggle("open");
    event.currentTarget.setAttribute("aria-expanded", nav.classList.contains("open"));
  });

  loadScenario("executive");
}

if (typeof document !== "undefined") init();
if (typeof module !== "undefined") {
  module.exports = { getGateCount, getStageState, deriveDecision };
}
