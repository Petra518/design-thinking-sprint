const phases = [
  {
    id: "focus",
    name: "Fokus",
    minutes: 5,
    purpose: "Das Team legt Thema, Zielgruppe und Arbeitsrichtung fest.",
    prompt: "Beschreiben Sie das Thema so konkret, dass alle im Team am gleichen Fall arbeiten.",
    fields: [
      ["topic", "Unser Thema", "Produkt, Service, Prozess, Geschaeftsmodell oder interne Herausforderung."],
      ["audience", "Fuer wen gestalten wir?", "Kundinnen, Mitarbeitende, Partner, Fuehrungsteam, Oeffentlichkeit."],
      ["success", "Woran waere der Workshop erfolgreich?", "Was soll am Ende greifbar vorliegen?"]
    ]
  },
  {
    id: "empathize",
    name: "Verstehen",
    minutes: 15,
    purpose: "Das Team schaut auf Menschen, Situationen und Spannungen, bevor es Loesungen sucht.",
    prompt: "Sammeln Sie Beobachtungen, Beduerfnisse und Reibungen aus Sicht der betroffenen Personen.",
    fields: [
      ["people", "Betroffene Personen", "Wer erlebt das Problem direkt oder indirekt?"],
      ["needs", "Beduerfnisse", "Was wollen oder brauchen diese Personen wirklich?"],
      ["pains", "Reibungen", "Was ist heute muehsam, langsam, unklar oder frustrierend?"],
      ["insights", "Wichtige Einsichten", "Welche Muster oder Ueberraschungen erkennen Sie?", true]
    ]
  },
  {
    id: "define",
    name: "Challenge",
    minutes: 12,
    purpose: "Aus vielen Beobachtungen wird eine klare Design Challenge.",
    prompt: "Formulieren Sie das Kernproblem als offene Wie-koennten-wir-Frage.",
    fields: [
      ["problem", "Kernproblem", "Was ist das eigentliche Problem hinter dem sichtbaren Problem?", true],
      ["hmw", "Wie-koennten-wir-Frage", "Wie koennten wir [Zielgruppe] dabei unterstuetzen, [Beduerfnis], damit [Wert] entsteht?", true]
    ]
  },
  {
    id: "ideate",
    name: "Ideen",
    minutes: 18,
    purpose: "Das Team erzeugt mehrere Loesungswege, bevor eine Idee ausgewaehlt wird.",
    prompt: "Entwickeln Sie zuerst viele Ideen. Waehlen Sie danach eine Idee mit hoher Wirkung und guter Testbarkeit.",
    fields: [
      ["ideas", "Ideenliste", "Mindestens sechs Ideen, gerne roh und unfertig.", true],
      ["chosen", "Ausgewaehlte Idee", "Welche Idee wird weiterverfolgt und warum?", true],
      ["risk", "Wichtigste Annahme", "Welche Annahme muss stimmen, damit die Idee funktioniert?"]
    ]
  },
  {
    id: "prototype",
    name: "Prototyp",
    minutes: 25,
    purpose: "Die Idee wird als testbarer Prototyp greifbar gemacht.",
    prompt: "Beschreiben Sie eine einfache Version der Loesung, die schnell gezeigt, ausprobiert oder simuliert werden kann.",
    fields: [
      ["prototypeTitle", "Name des Prototyps", "Kurz, verstaendlich und merkfaehig."],
      ["prototype", "Was wird prototypisiert?", "Canvas, Ablauf, Mockup, Rollenspiel, Service-Skizze, Landingpage, Datenreport, Gespraechsleitfaden.", true],
      ["value", "Nutzenversprechen", "Welcher konkrete Wert entsteht und fuer wen?", true],
      ["resources", "Was braucht es?", "Daten, Personen, Material, Tools, Entscheidungen."]
    ]
  },
  {
    id: "test",
    name: "Test",
    minutes: 12,
    purpose: "Das Team plant den kleinsten sinnvollen Test und klare Erfolgskriterien.",
    prompt: "Planen Sie einen Test, der innerhalb von 30 Tagen echtes Lernen ermoeglicht.",
    fields: [
      ["testPlan", "30-Tage-Test", "Was testen Sie, mit wem, wann und in welcher Form?", true],
      ["measure", "Erfolgskriterium", "Woran merken Sie, dass der Prototyp hilfreich ist?"],
      ["nextStep", "Erster naechster Schritt", "Was passiert direkt nach dem Seminar?"]
    ]
  }
];

const state = {
  current: 0,
  completed: new Set(),
  data: {},
  timer: null,
  remaining: phases[0].minutes * 60
};

const phaseList = document.querySelector("#phaseList");
const form = document.querySelector("#phaseForm");
const phaseKicker = document.querySelector("#phaseKicker");
const phaseTitle = document.querySelector("#phaseTitle");
const phasePurpose = document.querySelector("#phasePurpose");
const phasePrompt = document.querySelector("#phasePrompt");
const phaseTime = document.querySelector("#phaseTime");
const timerBtn = document.querySelector("#timerBtn");
const progressText = document.querySelector("#progressText");
const progressBar = document.querySelector("#progressBar");
const summary = document.querySelector("#summary");
const topicInput = document.querySelector("#topicInput");
const teamInput = document.querySelector("#teamInput");

function load() {
  const saved = JSON.parse(localStorage.getItem("dt-sprint") || "{}");
  state.current = saved.current || 0;
  state.completed = new Set(saved.completed || []);
  state.data = saved.data || {};
  topicInput.value = saved.topic || "";
  teamInput.value = saved.team || "";
}

function save() {
  localStorage.setItem("dt-sprint", JSON.stringify({
    current: state.current,
    completed: [...state.completed],
    data: state.data,
    topic: topicInput.value,
    team: teamInput.value
  }));
}

function renderNav() {
  phaseList.innerHTML = "";
  phases.forEach((phase, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `phase-tab ${index === state.current ? "active" : ""} ${state.completed.has(phase.id) ? "done" : ""}`;
    button.innerHTML = `
      <span class="phase-number">${state.completed.has(phase.id) ? "OK" : index + 1}</span>
      <span>
        <span class="phase-name">${phase.name}</span>
        <span class="phase-minutes">${phase.minutes} Minuten</span>
      </span>
    `;
    button.addEventListener("click", () => {
      persistForm();
      state.current = index;
      stopTimer();
      render();
    });
    phaseList.appendChild(button);
  });
}

function renderForm(phase) {
  form.innerHTML = "";
  phase.fields.forEach(([key, label, hint, full]) => {
    const card = document.createElement("div");
    card.className = `field-card ${full ? "full" : ""}`;
    const value = state.data[key] || "";
    card.innerHTML = `
      <label for="${key}">${label}</label>
      <textarea id="${key}" data-key="${key}" placeholder="${hint}">${value}</textarea>
      <div class="hint">${hint}</div>
    `;
    form.appendChild(card);
  });
  form.querySelectorAll("textarea").forEach(area => {
    area.addEventListener("input", () => {
      state.data[area.dataset.key] = area.value;
      save();
      renderSummary();
    });
  });
}

function renderProgress() {
  const pct = Math.round((state.completed.size / phases.length) * 100);
  progressText.textContent = `${pct}%`;
  progressBar.style.width = `${pct}%`;
}

function renderSummary() {
  const sections = [
    ["Thema", topicInput.value || state.data.topic || "Noch offen"],
    ["Team", teamInput.value || "Noch offen"],
    ["Zielgruppe", state.data.audience],
    ["Beduerfnisse und Reibungen", joinValues(["needs", "pains", "insights"])],
    ["Design Challenge", state.data.hmw],
    ["Ausgewaehlte Idee", state.data.chosen],
    ["Prototyp", joinValues(["prototypeTitle", "prototype", "value"])],
    ["30-Tage-Test", joinValues(["testPlan", "measure", "nextStep"])]
  ];
  summary.innerHTML = sections.map(([title, text]) => `
    <section class="summary-section">
      <h3>${title}</h3>
      <p>${escapeHtml(text || "Noch offen")}</p>
    </section>
  `).join("");
}

function joinValues(keys) {
  return keys.map(key => state.data[key]).filter(Boolean).join("\n\n");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function persistForm() {
  form.querySelectorAll("textarea").forEach(area => {
    state.data[area.dataset.key] = area.value;
  });
  save();
}

function render() {
  const phase = phases[state.current];
  phaseKicker.textContent = `Phase ${state.current + 1} von ${phases.length}`;
  phaseTitle.textContent = phase.name;
  phasePurpose.textContent = phase.purpose;
  phasePrompt.textContent = phase.prompt;
  state.remaining = phase.minutes * 60;
  updateTimerLabel();
  renderNav();
  renderForm(phase);
  renderProgress();
  renderSummary();
  document.querySelector("#prevBtn").disabled = state.current === 0;
  document.querySelector("#nextBtn").disabled = state.current === phases.length - 1;
}

function updateTimerLabel() {
  const min = Math.floor(state.remaining / 60).toString().padStart(2, "0");
  const sec = (state.remaining % 60).toString().padStart(2, "0");
  phaseTime.textContent = `${min}:${sec}`;
}

function stopTimer() {
  if (state.timer) {
    clearInterval(state.timer);
    state.timer = null;
  }
  timerBtn.textContent = "Timer starten";
}

timerBtn.addEventListener("click", () => {
  if (state.timer) {
    stopTimer();
    return;
  }
  timerBtn.textContent = "Timer stoppen";
  state.timer = setInterval(() => {
    state.remaining = Math.max(0, state.remaining - 1);
    updateTimerLabel();
    if (state.remaining === 0) stopTimer();
  }, 1000);
});

document.querySelector("#prevBtn").addEventListener("click", () => {
  persistForm();
  state.current = Math.max(0, state.current - 1);
  stopTimer();
  render();
});

document.querySelector("#nextBtn").addEventListener("click", () => {
  persistForm();
  state.current = Math.min(phases.length - 1, state.current + 1);
  stopTimer();
  render();
});

document.querySelector("#completeBtn").addEventListener("click", () => {
  persistForm();
  state.completed.add(phases[state.current].id);
  if (state.current < phases.length - 1) state.current += 1;
  stopTimer();
  save();
  render();
});

document.querySelector("#copyBtn").addEventListener("click", async () => {
  persistForm();
  await navigator.clipboard.writeText(buildExportText());
  document.querySelector("#copyBtn").textContent = "Kopiert";
  setTimeout(() => document.querySelector("#copyBtn").textContent = "Kopieren", 1200);
});

document.querySelector("#downloadBtn").addEventListener("click", () => {
  persistForm();
  const blob = new Blob([buildExportText()], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const team = (teamInput.value || "Team").replace(/[^\w-]+/g, "_");
  link.href = url;
  link.download = `Design-Thinking-Sprint_${team}.txt`;
  link.click();
  URL.revokeObjectURL(url);
});

topicInput.addEventListener("input", () => {
  state.data.topic = topicInput.value;
  save();
  renderSummary();
});

teamInput.addEventListener("input", () => {
  save();
  renderSummary();
});

function buildExportText() {
  const lines = [
    "Design Thinking Sprint",
    `Thema: ${topicInput.value || "-"}`,
    `Team: ${teamInput.value || "-"}`,
    "",
    ...phases.flatMap(phase => [
      `## ${phase.name}`,
      ...phase.fields.map(([key, label]) => `${label}:\n${state.data[key] || "-"}`),
      ""
    ])
  ];
  return lines.join("\n");
}

load();
render();
