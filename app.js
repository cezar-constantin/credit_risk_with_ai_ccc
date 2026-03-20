const STEP_DEFINITIONS = [
  {
    key: "preparation",
    label: "Data preparation",
    kicker: "Foundation",
    title: "Prepare the portfolio and engineer rating features",
    description:
      "Profile missingness, shape the development samples, and convert selected variables into a model-ready representation inspired by the WOE / IV workflow.",
  },
  {
    key: "estimation",
    label: "Estimation of rating model",
    kicker: "Model build",
    title: "Estimate the rating model and generate the scorecard logic",
    description:
      "Select the final drivers, fit a browser-side logistic scorecard, and translate the model into rating grades, scorecard contributions, and portable R code.",
  },
  {
    key: "validation",
    label: "Validation of rating model",
    kicker: "Challenge",
    title: "Validate discrimination power and rating stability",
    description:
      "Compare estimation and validation samples, inspect AR and SSI, and test whether the model remains stable outside the development sample.",
  },
  {
    key: "monitoring",
    label: "Monitoring of rating model",
    kicker: "Ongoing control",
    title: "Monitor drift, observed defaults, and rating migration pressure",
    description:
      "Score the latest population, compare it against the development sample, and surface potential drift before it becomes a governance issue.",
  },
  {
    key: "calibration",
    label: "Calibration of rating model",
    kicker: "Alignment",
    title: "Recalibrate the model to the portfolio anchor point",
    description:
      "Shift the PD curve toward an observed or user-defined anchor rate and inspect how the recalibration impacts ratings and migration patterns.",
  },
  {
    key: "basel3",
    label: "Basel III RWA",
    kicker: "Capital",
    title: "Translate calibrated risk estimates into Basel III RWAs",
    description:
      "Apply the mortgage IRB-style capital formula to the scored portfolio and summarize exposure, capital requirement, and implied risk weights.",
  },
  {
    key: "basel4",
    label: "Basel IV RWA",
    kicker: "Post-reform view",
    title: "Layer Basel IV floors, standardized RWAs, and the output floor",
    description:
      "Apply PD and LGD floors, compare IRB against the standardized approach, and quantify the impact of the output floor on portfolio RWAs.",
  },
]

const RATING_MASTER_SCALE = [
  { rating: "AAA", upper: 0.004, description: "Extremely low risk of default." },
  { rating: "AA", upper: 0.008, description: "Very low risk of default." },
  { rating: "A", upper: 0.016, description: "Low risk of default." },
  { rating: "BBB", upper: 0.032, description: "Moderate risk of default." },
  { rating: "BB", upper: 0.064, description: "Higher than average risk." },
  { rating: "B", upper: 0.128, description: "Significant risk of default." },
  { rating: "CCC", upper: 0.256, description: "High risk of default." },
  { rating: "CC", upper: 0.512, description: "Very high risk of default." },
  { rating: "C", upper: 1, description: "Extremely high risk of default." },
]

const DEFAULT_GLOBAL_CONFIG = {
  targetColumn: "",
  idColumn: "",
  dateColumn: "",
  exposureColumn: "",
  ltvColumn: "",
  exposureTypeColumn: "",
  lgdColumn: "",
  maturityColumn: "",
}

const DEFAULT_STEP_CONFIGS = {
  preparation: {
    missingStrategy: "median_mode",
    binCount: 5,
    trainShare: 60,
    validationShare: 20,
    monitoringShare: 10,
    calibrationShare: 10,
    selectedFeatures: [],
  },
  estimation: {
    ivThreshold: 0.05,
    maxFeatures: 6,
    ridge: 0.05,
    scoreOffset: 218,
    scoreFactor: -72,
    modelFeatures: [],
  },
  validation: {
    classificationThreshold: 0.5,
    ssiSmoothing: 0.000001,
  },
  monitoring: {
    sampleSource: "monitoring",
    driftThreshold: 0.1,
    defaultPdAlert: 1.25,
  },
  calibration: {
    sampleSource: "calibration",
    anchorSource: "observed",
    manualAnchorRate: 0.03,
  },
  basel3: {
    sampleSource: "all",
    pdSource: "calibrated",
    exposureMode: "column",
    constantExposure: 100000,
    lgdMode: "constant",
    constantLgd: 5,
    maturityMode: "constant",
    constantMaturity: 10,
  },
  basel4: {
    sampleSource: "all",
    pdSource: "calibrated",
    exposureMode: "column",
    constantExposure: 100000,
    lgdMode: "constant",
    constantLgd: 5,
    maturityMode: "constant",
    constantMaturity: 10,
    ltvMode: "column",
    constantLtv: 70,
    defaultExposureClass: "Private Residential",
    pdFloorBps: 5,
    outputFloor: 72.5,
    prreLgdFloor: 5,
    cipreLgdFloor: 15,
    pipreLgdFloor: 10,
  },
}

const DEFAULT_NOTES = {
  preparation: {
    code: "Add portfolio-specific preparation notes here. This section is preserved after Save & Sync.",
    methodology: "Add business rules, governance limits, or data lineage notes here.",
  },
  estimation: {
    code: "Document modeling decisions such as exclusions, challenger tests, or score scaling changes here.",
    methodology: "Capture model design choices, expert overlays, or approval remarks here.",
  },
  validation: {
    code: "Note validation overrides, benchmark models, or additional challenge tests here.",
    methodology: "Summarize independent review commentary or remediation expectations here.",
  },
  monitoring: {
    code: "Record monitoring thresholds, escalation rules, or reporting schedules here.",
    methodology: "Add monitoring governance, alert routing, or committee review notes here.",
  },
  calibration: {
    code: "Document the calibration anchor, timing, and any expert overrides here.",
    methodology: "Capture the business rationale for the chosen anchor point and migration tolerance.",
  },
  basel3: {
    code: "Note EAD, LGD, or maturity assumptions specific to the capital view here.",
    methodology: "Add references to regulatory interpretation, asset scope, or capital governance here.",
  },
  basel4: {
    code: "Document floor choices, exposure-class mapping, or output-floor assumptions here.",
    methodology: "Record Basel IV interpretation choices and portfolio segmentation notes here.",
  },
}

const HERO_EMPTY_MODEL_TEXT = "No model estimated"

const elements = {
  heroDataset: document.getElementById("hero-dataset"),
  heroRows: document.getElementById("hero-rows"),
  heroModelStatus: document.getElementById("hero-model-status"),
  workspaceStatus: document.getElementById("workspace-status"),
  fileInput: document.getElementById("file-input"),
  loadDemoButton: document.getElementById("load-demo-button"),
  resetButton: document.getElementById("reset-button"),
  exportFullRButton: document.getElementById("export-full-r-button"),
  exportFullPdfButton: document.getElementById("export-full-pdf-button"),
  datasetMetrics: document.getElementById("dataset-metrics"),
  globalFieldGrid: document.getElementById("global-field-grid"),
  datasetPreview: document.getElementById("dataset-preview"),
  previewCaption: document.getElementById("preview-caption"),
  stepShell: document.getElementById("active-step-shell"),
  toast: document.getElementById("toast"),
  tabButtons: Array.from(document.querySelectorAll(".tab-button")),
}

let toastTimer = null
let state = createInitialState()

bootstrap()

function bootstrap() {
  bindGlobalEvents()
  renderAll()
}

function createInitialState() {
  return {
    activeStep: "preparation",
    datasetName: "",
    rows: [],
    metadata: null,
    global: clone(DEFAULT_GLOBAL_CONFIG),
    steps: clone(DEFAULT_STEP_CONFIGS),
    notes: clone(DEFAULT_NOTES),
    documents: buildEmptyDocuments(),
    derived: {},
  }
}

function buildEmptyDocuments() {
  return STEP_DEFINITIONS.reduce((accumulator, stepDefinition) => {
    accumulator[stepDefinition.key] = {
      code: "",
      methodology: "",
    }
    return accumulator
  }, {})
}

function bindGlobalEvents() {
  elements.fileInput.addEventListener("change", handleFileInput)
  elements.loadDemoButton.addEventListener("click", () => {
    const demo = buildDemoDataset()
    hydrateDataset(demo.rows, demo.columns, "demo_credit_portfolio.csv")
    showToast("Demo portfolio loaded.")
  })
  elements.resetButton.addEventListener("click", () => {
    state = createInitialState()
    elements.fileInput.value = ""
    renderAll()
    showToast("Simulator reset.")
  })
  elements.exportFullRButton.addEventListener("click", () => {
    downloadTextFile("credit-risk-with-ai-full-pipeline.R", composeFullRScript())
  })
  elements.exportFullPdfButton.addEventListener("click", () => {
    exportMethodologyPdf(
      "credit-risk-with-ai-methodology.pdf",
      "Credit risk with AI - End-to-end methodology",
      composeFullMethodology()
    )
  })
  elements.globalFieldGrid.addEventListener("change", handleGlobalFieldChange)
  elements.stepShell.addEventListener("change", handleStepShellChange)
  elements.stepShell.addEventListener("input", handleStepShellInput)
  elements.stepShell.addEventListener("click", handleStepShellClick)

  elements.tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.activeStep = button.dataset.tabTarget
      renderTabs()
      renderActiveStep()
    })
  })
}

async function handleFileInput(event) {
  const file = event.target.files?.[0]
  if (!file) {
    return
  }

  try {
    const text = await file.text()
    const parsed = parseDelimitedText(text)
    hydrateDataset(parsed.rows, parsed.columns, file.name)
    showToast(`Loaded ${file.name}.`)
  } catch (error) {
    showToast(`Could not parse the uploaded file: ${error.message}`)
  }
}

function handleGlobalFieldChange(event) {
  const target = event.target
  if (target.dataset.action !== "set-global") {
    return
  }

  const configKey = target.dataset.globalKey
  state.global[configKey] = target.value
  reconcileSelections()
  recomputeAndRender("ui")
}

function handleStepShellChange(event) {
  const target = event.target
  const action = target.dataset.action

  if (action === "set-config") {
    const stepKey = target.dataset.stepKey
    const configKey = target.dataset.configKey
    state.steps[stepKey][configKey] = coerceInputValue(target)
    reconcileSelections()
    recomputeAndRender("ui")
    return
  }

  if (action === "toggle-feature") {
    toggleArrayValue(state.steps.preparation.selectedFeatures, target.value, target.checked)
    reconcileSelections()
    recomputeAndRender("ui")
    return
  }

  if (action === "toggle-model-feature") {
    toggleArrayValue(state.steps.estimation.modelFeatures, target.value, target.checked)
    reconcileSelections()
    recomputeAndRender("ui")
  }
}

function handleStepShellInput(event) {
  const target = event.target
  const action = target.dataset.action
  if (action !== "edit-document") {
    return
  }

  const stepKey = target.dataset.stepKey
  const documentType = target.dataset.documentType
  state.documents[stepKey][documentType] = target.value
}

function handleStepShellClick(event) {
  const trigger = event.target.closest("[data-action]")
  if (!trigger) {
    return
  }

  const action = trigger.dataset.action
  if (action === "save-document") {
    saveDocument(trigger.dataset.stepKey, trigger.dataset.documentType)
    return
  }
  if (action === "reset-document") {
    refreshDocumentsForStep(trigger.dataset.stepKey)
    renderActiveStep()
    showToast("Editor reset from the live simulator state.")
    return
  }
  if (action === "export-code") {
    const stepKey = trigger.dataset.stepKey
    const stepDefinition = getStepDefinition(stepKey)
    const fileName = `${sanitizeFileStem(stepDefinition.label)}.R`
    downloadTextFile(fileName, state.documents[stepKey].code)
    return
  }
  if (action === "export-methodology") {
    const stepKey = trigger.dataset.stepKey
    const stepDefinition = getStepDefinition(stepKey)
    const title = `${stepDefinition.label} - Methodology`
    const fileName = `${sanitizeFileStem(stepDefinition.label)}-methodology.pdf`
    exportMethodologyPdf(fileName, title, state.documents[stepKey].methodology)
  }
}

function hydrateDataset(rows, columns, datasetName) {
  state.datasetName = datasetName
  state.rows = rows
  state.metadata = analyzeDataset(rows, columns)
  autoMapColumns()
  reconcileSelections(true)
  recomputeAndRender("ui")
}

function autoMapColumns() {
  if (!state.metadata) {
    state.global = clone(DEFAULT_GLOBAL_CONFIG)
    return
  }

  const columns = state.metadata.columns
  const stats = state.metadata.columnMap

  state.global.targetColumn = findPreferredColumn(columns, [
    /default_flag/i,
    /default/i,
    /bad_flag/i,
    /target/i,
    /event/i,
  ])
  state.global.idColumn = findPreferredColumn(columns, [/client_id/i, /account/i, /loan_id/i, /customer/i, /^id$/i])
  state.global.dateColumn = findPreferredColumn(columns, [/observation_date/i, /date/i, /month/i, /year/i])
  state.global.exposureColumn = findPreferredColumn(columns, [/exposure/i, /ead/i, /balance/i, /loan_amount/i, /amount/i])
  state.global.ltvColumn = findPreferredColumn(columns, [/loan_to_value/i, /\bltv\b/i])
  state.global.exposureTypeColumn = findPreferredColumn(columns, [/mortgage_type/i, /exposure_type/i, /property_type/i])
  state.global.lgdColumn = findPreferredColumn(columns, [/\blgd\b/i, /loss_given_default/i])
  state.global.maturityColumn = findPreferredColumn(columns, [/maturity/i, /\btenor\b/i, /remaining_term/i])

  if (!state.global.targetColumn) {
    const binaryFallback = Object.values(stats).find((columnStat) => columnStat.type === "binary")
    state.global.targetColumn = binaryFallback?.name || ""
  }
}

function reconcileSelections(forceAutoFill = false) {
  if (!state.metadata) {
    return
  }

  const availableFeatures = getEligibleFeatures()
  const selectedPreparation = state.steps.preparation.selectedFeatures.filter((feature) => availableFeatures.includes(feature))
  const selectedEstimation = state.steps.estimation.modelFeatures.filter((feature) => availableFeatures.includes(feature))

  state.steps.preparation.selectedFeatures =
    forceAutoFill || !selectedPreparation.length ? autoSelectFeatures(availableFeatures) : selectedPreparation
  state.steps.estimation.modelFeatures =
    forceAutoFill || !selectedEstimation.length
      ? state.steps.preparation.selectedFeatures.slice(0, Math.min(availableFeatures.length, 8))
      : selectedEstimation

  for (const globalKey of Object.keys(DEFAULT_GLOBAL_CONFIG)) {
    const value = state.global[globalKey]
    if (value && !state.metadata.columns.includes(value)) {
      state.global[globalKey] = ""
    }
  }
}

function autoSelectFeatures(availableFeatures) {
  const featurePriority = [
    "Mortgage_Type",
    "Income_Bucket",
    "Loan_to_Value",
    "LTV_Bucket",
    "Marital_Status",
    "Delinquency",
    "Swiss_Canton",
    "Income",
    "Exposure",
  ]
  const prioritized = [
    ...featurePriority.filter((feature) => availableFeatures.includes(feature)),
    ...availableFeatures.filter((feature) => !featurePriority.includes(feature)),
  ]
  return prioritized.slice(0, 10)
}

function recomputeAndRender(source = "ui") {
  if (!state.metadata) {
    renderAll()
    return
  }

  const preparation = computePreparation()
  const estimation = computeEstimation(preparation)
  const validation = computeValidation(estimation)
  const monitoring = computeMonitoring(estimation)
  const calibration = computeCalibration(estimation)
  const basel3 = computeBasel3(estimation, calibration)
  const basel4 = computeBasel4(estimation, calibration)

  state.derived = {
    preparation,
    estimation,
    validation,
    monitoring,
    calibration,
    basel3,
    basel4,
  }

  refreshDocuments(source)
  renderAll()
}

function saveDocument(stepKey, documentType) {
  const text = state.documents[stepKey][documentType]
  const syncPayload = parseSyncPayload(text)
  if (!syncPayload) {
    showToast("The sync block could not be parsed. Please keep the JSON block valid.")
    return
  }

  if (syncPayload.global) {
    state.global = mergeWithTemplate(state.global, syncPayload.global, DEFAULT_GLOBAL_CONFIG)
  }
  if (syncPayload.config) {
    state.steps[stepKey] = mergeWithTemplate(state.steps[stepKey], syncPayload.config, DEFAULT_STEP_CONFIGS[stepKey])
  }

  const analystNotes = extractAnalystNotes(text)
  if (analystNotes !== null) {
    state.notes[stepKey][documentType] = analystNotes
  }

  reconcileSelections()
  recomputeAndRender("editor")
  showToast(`${getStepDefinition(stepKey).label} synced from ${documentType}.`)
}

function renderAll() {
  renderHero()
  renderWorkspace()
  renderTabs()
  renderActiveStep()
}

function renderHero() {
  const estimation = state.derived.estimation
  elements.heroDataset.textContent = state.datasetName || "Waiting for upload"
  elements.heroRows.textContent = state.rows.length ? `${formatInteger(state.rows.length)} loaded` : "0 loaded"

  if (estimation?.ready) {
    elements.heroModelStatus.textContent = `Live scorecard with ${estimation.finalFeatures.length} features`
  } else if (state.derived.preparation?.ready) {
    elements.heroModelStatus.textContent = "Data prepared, model not estimated"
  } else {
    elements.heroModelStatus.textContent = HERO_EMPTY_MODEL_TEXT
  }
}

function renderWorkspace() {
  const metadata = state.metadata
  elements.workspaceStatus.textContent = metadata
    ? state.global.targetColumn
      ? "Portfolio ready for modeling"
      : "Map the target column"
    : "Waiting for a dataset"

  elements.datasetMetrics.innerHTML = renderDatasetMetrics()
  elements.globalFieldGrid.innerHTML = renderGlobalFieldGrid()
  elements.previewCaption.textContent = metadata
    ? `${formatInteger(metadata.rows.length)} rows and ${formatInteger(metadata.columns.length)} columns available.`
    : "Load a portfolio to inspect its structure."
  elements.datasetPreview.innerHTML = metadata ? renderPreviewTable() : renderEmptyState("No dataset loaded yet.")
}

function renderTabs() {
  elements.tabButtons.forEach((button) => {
    const isActive = button.dataset.tabTarget === state.activeStep
    button.classList.toggle("is-active", isActive)
    button.setAttribute("aria-selected", String(isActive))
  })
}

function renderActiveStep() {
  const stepDefinition = getStepDefinition(state.activeStep)
  const derived = state.derived[state.activeStep]
  const statusText = derived?.ready ? "Live" : state.metadata ? "Needs attention" : "Template mode"

  elements.stepShell.innerHTML = `
    <section class="card step-card">
      <div class="section-heading">
        <div>
          <p class="section-kicker">${escapeHtml(stepDefinition.kicker)}</p>
          <h2>${escapeHtml(stepDefinition.title)}</h2>
        </div>
        <span class="status-pill">${escapeHtml(statusText)}</span>
      </div>
      <p class="helper-copy">${escapeHtml(stepDefinition.description)}</p>
      <div class="step-layout">
        <section class="control-column">
          ${renderStepControls(stepDefinition.key)}
        </section>
        <section class="result-column">
          ${renderStepResults(stepDefinition.key)}
        </section>
        <section class="editor-column">
          ${renderEditors(stepDefinition.key)}
        </section>
      </div>
    </section>
  `
}

function renderStepControls(stepKey) {
  switch (stepKey) {
    case "preparation":
      return renderPreparationControls()
    case "estimation":
      return renderEstimationControls()
    case "validation":
      return renderValidationControls()
    case "monitoring":
      return renderMonitoringControls()
    case "calibration":
      return renderCalibrationControls()
    case "basel3":
      return renderBasel3Controls()
    case "basel4":
      return renderBasel4Controls()
    default:
      return renderEmptyState("No controls defined.")
  }
}

function renderStepResults(stepKey) {
  switch (stepKey) {
    case "preparation":
      return renderPreparationResults()
    case "estimation":
      return renderEstimationResults()
    case "validation":
      return renderValidationResults()
    case "monitoring":
      return renderMonitoringResults()
    case "calibration":
      return renderCalibrationResults()
    case "basel3":
      return renderBasel3Results()
    case "basel4":
      return renderBasel4Results()
    default:
      return renderEmptyState("No outputs defined.")
  }
}

function renderEditors(stepKey) {
  const documents = state.documents[stepKey]
  const stepLabel = getStepDefinition(stepKey).label

  return `
    <article class="card editor-card">
      <div class="editor-header">
        <div>
          <p class="card-kicker">R implementation</p>
          <h3>${escapeHtml(stepLabel)} code</h3>
        </div>
        <div class="editor-toolbar">
          <button class="primary-button small-button" type="button" data-action="save-document" data-step-key="${stepKey}" data-document-type="code">Save &amp; Sync</button>
          <button class="ghost-button small-button" type="button" data-action="reset-document" data-step-key="${stepKey}" data-document-type="code">Reset</button>
          <button class="secondary-button small-button" type="button" data-action="export-code" data-step-key="${stepKey}">Export .R</button>
        </div>
      </div>
      <p class="editor-tip">Edit the sync JSON block or the analyst notes block, then click <strong>Save &amp; Sync</strong>.</p>
      <textarea class="editor-textarea" data-action="edit-document" data-step-key="${stepKey}" data-document-type="code" spellcheck="false">${escapeHtml(
        documents.code
      )}</textarea>
    </article>
    <article class="card editor-card">
      <div class="editor-header">
        <div>
          <p class="card-kicker">Methodology</p>
          <h3>${escapeHtml(stepLabel)} narrative</h3>
        </div>
        <div class="editor-toolbar">
          <button class="primary-button small-button" type="button" data-action="save-document" data-step-key="${stepKey}" data-document-type="methodology">Save &amp; Sync</button>
          <button class="ghost-button small-button" type="button" data-action="reset-document" data-step-key="${stepKey}" data-document-type="methodology">Reset</button>
          <button class="secondary-button small-button" type="button" data-action="export-methodology" data-step-key="${stepKey}">Export PDF</button>
        </div>
      </div>
      <p class="editor-tip">The methodology window mirrors the live setup and keeps a parseable state block at the top.</p>
      <textarea class="editor-textarea is-tall" data-action="edit-document" data-step-key="${stepKey}" data-document-type="methodology" spellcheck="false">${escapeHtml(
        documents.methodology
      )}</textarea>
    </article>
  `
}

function renderDatasetMetrics() {
  if (!state.metadata) {
    return [
      renderMetricTile("Rows", "0", "Upload a portfolio or load the demo sample."),
      renderMetricTile("Columns", "0", "Field mapping becomes available after upload."),
      renderMetricTile("Default rate", "n/a", "A binary target column is needed for model development."),
      renderMetricTile("Selected features", "0", "Choose the predictors in Data preparation."),
    ].join("")
  }

  const defaultRate = state.global.targetColumn
    ? mean(state.rows.map((row) => normalizeTargetValue(row[state.global.targetColumn])).filter((value) => value !== null))
    : null
  const selectedCount = state.steps.preparation.selectedFeatures.length

  return [
    renderMetricTile("Rows", formatInteger(state.metadata.rows.length), "Portfolio observations loaded in the browser."),
    renderMetricTile("Columns", formatInteger(state.metadata.columns.length), "Available fields for mapping and feature selection."),
    renderMetricTile(
      "Default rate",
      defaultRate === null ? "n/a" : formatPercent(defaultRate),
      "Based on the mapped target column."
    ),
    renderMetricTile("Selected features", formatInteger(selectedCount), "Current predictors chosen in Data preparation."),
  ].join("")
}

function renderGlobalFieldGrid() {
  const options = state.metadata ? state.metadata.columns : []
  return `
    ${renderGlobalSelectField("Target column", "targetColumn", options, state.global.targetColumn, "Used as the default / non-default flag.")}
    ${renderGlobalSelectField("ID column", "idColumn", options, state.global.idColumn, "Optional identifier for the portfolio rows.")}
    ${renderGlobalSelectField("Date column", "dateColumn", options, state.global.dateColumn, "Used for chronological splits when available.")}
    ${renderGlobalSelectField("Exposure column", "exposureColumn", options, state.global.exposureColumn, "Optional EAD source for Basel views.")}
    ${renderGlobalSelectField("LTV column", "ltvColumn", options, state.global.ltvColumn, "Optional LTV source for Basel IV segmentation.")}
    ${renderGlobalSelectField("Exposure type column", "exposureTypeColumn", options, state.global.exposureTypeColumn, "Optional mortgage or exposure class field.")}
    ${renderGlobalSelectField("LGD column", "lgdColumn", options, state.global.lgdColumn, "Optional LGD source for capital calculations.")}
    ${renderGlobalSelectField("Maturity column", "maturityColumn", options, state.global.maturityColumn, "Optional maturity source in years.")}
  `
}

function renderPreviewTable() {
  const columns = state.metadata.columns.slice(0, 8)
  const rows = state.rows.slice(0, 5)
  return renderTable(
    columns,
    rows.map((row) =>
      columns.reduce((accumulator, column) => {
        accumulator[column] = row[column]
        return accumulator
      }, {})
    )
  )
}

function renderPreparationControls() {
  const config = state.steps.preparation
  const features = getEligibleFeatures()

  return `
    <article class="card panel-card">
      <div class="panel-section">
        <p class="card-kicker">Parameters</p>
        <h3>Preparation settings</h3>
        <div class="field-grid compact-grid">
          ${renderConfigSelect("Missing value policy", "preparation", "missingStrategy", config.missingStrategy, [
            { value: "median_mode", label: "Median / mode imputation" },
            { value: "separate_bucket", label: "Separate missing bucket" },
          ])}
          ${renderConfigNumber("Binning depth", "preparation", "binCount", config.binCount, {
            min: 2,
            max: 10,
            step: 1,
          })}
          ${renderConfigNumber("Estimation share (%)", "preparation", "trainShare", config.trainShare, {
            min: 1,
            max: 98,
            step: 1,
          })}
          ${renderConfigNumber("Validation share (%)", "preparation", "validationShare", config.validationShare, {
            min: 1,
            max: 98,
            step: 1,
          })}
          ${renderConfigNumber("Monitoring share (%)", "preparation", "monitoringShare", config.monitoringShare, {
            min: 0,
            max: 98,
            step: 1,
          })}
          ${renderConfigNumber("Calibration share (%)", "preparation", "calibrationShare", config.calibrationShare, {
            min: 0,
            max: 98,
            step: 1,
          })}
        </div>
        <p class="inline-note">Shares are normalized to 100% before the simulator assigns the samples.</p>
      </div>
      <div class="panel-section">
        <p class="card-kicker">Human in the loop</p>
        <h3>Selected variables</h3>
        ${
          features.length
            ? `<div class="feature-list">${features
                .map((feature) => renderFeatureOption(feature, state.steps.preparation.selectedFeatures.includes(feature), "toggle-feature"))
                .join("")}</div>`
            : renderEmptyState("Load a dataset to choose predictors.")
        }
      </div>
    </article>
  `
}

function renderEstimationControls() {
  const config = state.steps.estimation
  const features = state.steps.preparation.selectedFeatures

  return `
    <article class="card panel-card">
      <div class="panel-section">
        <p class="card-kicker">Parameters</p>
        <h3>Estimation settings</h3>
        <div class="field-grid compact-grid">
          ${renderConfigNumber("Minimum IV", "estimation", "ivThreshold", config.ivThreshold, { min: 0, max: 1, step: 0.01 })}
          ${renderConfigNumber("Maximum features", "estimation", "maxFeatures", config.maxFeatures, { min: 1, max: 12, step: 1 })}
          ${renderConfigNumber("Ridge penalty", "estimation", "ridge", config.ridge, { min: 0, max: 1, step: 0.01 })}
          ${renderConfigNumber("Score offset", "estimation", "scoreOffset", config.scoreOffset, { min: 50, max: 500, step: 1 })}
          ${renderConfigNumber("Score factor", "estimation", "scoreFactor", config.scoreFactor, { min: -200, max: -10, step: 1 })}
        </div>
      </div>
      <div class="panel-section">
        <p class="card-kicker">Final drivers</p>
        <h3>Model feature shortlist</h3>
        ${
          features.length
            ? `<div class="feature-list">${features
                .map((feature) => renderFeatureOption(feature, state.steps.estimation.modelFeatures.includes(feature), "toggle-model-feature"))
                .join("")}</div>`
            : renderEmptyState("Choose variables in Data preparation first.")
        }
      </div>
    </article>
  `
}

function renderValidationControls() {
  const config = state.steps.validation
  return `
    <article class="card panel-card">
      <div class="panel-section">
        <p class="card-kicker">Parameters</p>
        <h3>Validation settings</h3>
        <div class="field-grid compact-grid">
          ${renderConfigPercent("Classification threshold", "validation", "classificationThreshold", config.classificationThreshold)}
          ${renderConfigNumber("SSI smoothing", "validation", "ssiSmoothing", config.ssiSmoothing, {
            min: 0.0000001,
            max: 0.1,
            step: 0.000001,
          })}
        </div>
      </div>
      <div class="panel-section">
        <p class="card-kicker">Review focus</p>
        <div class="callout-card">
          <strong>Independent challenge</strong>
          <p>Validation emphasizes AR consistency, distribution stability, and whether the validation sample still maps into the intended rating structure.</p>
        </div>
      </div>
    </article>
  `
}

function renderMonitoringControls() {
  const config = state.steps.monitoring
  return `
    <article class="card panel-card">
      <div class="panel-section">
        <p class="card-kicker">Parameters</p>
        <h3>Monitoring settings</h3>
        <div class="field-grid compact-grid">
          ${renderConfigSelect("Monitoring sample", "monitoring", "sampleSource", config.sampleSource, [
            { value: "monitoring", label: "Monitoring sample" },
            { value: "calibration", label: "Calibration sample" },
          ])}
          ${renderConfigNumber("SSI alert level", "monitoring", "driftThreshold", config.driftThreshold, { min: 0, max: 1, step: 0.01 })}
          ${renderConfigNumber("DR / PD alert factor", "monitoring", "defaultPdAlert", config.defaultPdAlert, { min: 1, max: 5, step: 0.05 })}
        </div>
      </div>
      <div class="panel-section">
        <p class="card-kicker">Review focus</p>
        <div class="callout-card">
          <strong>Early warning</strong>
          <p>The monitoring step looks for rating drift, weakening discrimination, and a widening gap between observed defaults and predicted PDs.</p>
        </div>
      </div>
    </article>
  `
}

function renderCalibrationControls() {
  const config = state.steps.calibration
  return `
    <article class="card panel-card">
      <div class="panel-section">
        <p class="card-kicker">Parameters</p>
        <h3>Calibration settings</h3>
        <div class="field-grid compact-grid">
          ${renderConfigSelect("Calibration sample", "calibration", "sampleSource", config.sampleSource, [
            { value: "calibration", label: "Calibration sample" },
            { value: "monitoring", label: "Monitoring sample" },
          ])}
          ${renderConfigSelect("Anchor source", "calibration", "anchorSource", config.anchorSource, [
            { value: "observed", label: "Observed default rate" },
            { value: "manual", label: "Manual target rate" },
          ])}
          ${renderConfigPercent("Manual anchor rate", "calibration", "manualAnchorRate", config.manualAnchorRate)}
        </div>
      </div>
      <div class="panel-section">
        <p class="card-kicker">Review focus</p>
        <div class="callout-card">
          <strong>Portfolio alignment</strong>
          <p>The simulator applies a logit shift so that the model aligns with an observed or policy-defined anchor point without breaking the ranking order.</p>
        </div>
      </div>
    </article>
  `
}

function renderBasel3Controls() {
  const config = state.steps.basel3
  return `
    <article class="card panel-card">
      <div class="panel-section">
        <p class="card-kicker">Parameters</p>
        <h3>Basel III settings</h3>
        <div class="field-grid compact-grid">
          ${renderConfigSelect("Portfolio sample", "basel3", "sampleSource", config.sampleSource, [
            { value: "all", label: "All rows" },
            { value: "estimation", label: "Estimation sample" },
            { value: "validation", label: "Validation sample" },
            { value: "monitoring", label: "Monitoring sample" },
            { value: "calibration", label: "Calibration sample" },
          ])}
          ${renderConfigSelect("PD source", "basel3", "pdSource", config.pdSource, [
            { value: "predicted", label: "Predicted PD" },
            { value: "calibrated", label: "Calibrated PD" },
          ])}
          ${renderConfigSelect("Exposure source", "basel3", "exposureMode", config.exposureMode, [
            { value: "column", label: "Mapped column" },
            { value: "constant", label: "Fixed value" },
          ])}
          ${renderConfigNumber("Constant exposure", "basel3", "constantExposure", config.constantExposure, { min: 1000, max: 10000000, step: 1000 })}
          ${renderConfigSelect("LGD source", "basel3", "lgdMode", config.lgdMode, [
            { value: "column", label: "Mapped column" },
            { value: "constant", label: "Fixed value" },
          ])}
          ${renderConfigNumber("Constant LGD (%)", "basel3", "constantLgd", config.constantLgd, { min: 1, max: 100, step: 0.5 })}
          ${renderConfigSelect("Maturity source", "basel3", "maturityMode", config.maturityMode, [
            { value: "column", label: "Mapped column" },
            { value: "constant", label: "Fixed value" },
          ])}
          ${renderConfigNumber("Constant maturity (years)", "basel3", "constantMaturity", config.constantMaturity, { min: 0.25, max: 30, step: 0.25 })}
        </div>
      </div>
    </article>
  `
}

function renderBasel4Controls() {
  const config = state.steps.basel4
  return `
    <article class="card panel-card">
      <div class="panel-section">
        <p class="card-kicker">Parameters</p>
        <h3>Basel IV settings</h3>
        <div class="field-grid compact-grid">
          ${renderConfigSelect("Portfolio sample", "basel4", "sampleSource", config.sampleSource, [
            { value: "all", label: "All rows" },
            { value: "estimation", label: "Estimation sample" },
            { value: "validation", label: "Validation sample" },
            { value: "monitoring", label: "Monitoring sample" },
            { value: "calibration", label: "Calibration sample" },
          ])}
          ${renderConfigSelect("PD source", "basel4", "pdSource", config.pdSource, [
            { value: "predicted", label: "Predicted PD" },
            { value: "calibrated", label: "Calibrated PD" },
          ])}
          ${renderConfigSelect("Exposure source", "basel4", "exposureMode", config.exposureMode, [
            { value: "column", label: "Mapped column" },
            { value: "constant", label: "Fixed value" },
          ])}
          ${renderConfigNumber("Constant exposure", "basel4", "constantExposure", config.constantExposure, { min: 1000, max: 10000000, step: 1000 })}
          ${renderConfigSelect("LGD source", "basel4", "lgdMode", config.lgdMode, [
            { value: "column", label: "Mapped column" },
            { value: "constant", label: "Fixed value" },
          ])}
          ${renderConfigNumber("Constant LGD (%)", "basel4", "constantLgd", config.constantLgd, { min: 1, max: 100, step: 0.5 })}
          ${renderConfigSelect("Maturity source", "basel4", "maturityMode", config.maturityMode, [
            { value: "column", label: "Mapped column" },
            { value: "constant", label: "Fixed value" },
          ])}
          ${renderConfigNumber("Constant maturity (years)", "basel4", "constantMaturity", config.constantMaturity, { min: 0.25, max: 30, step: 0.25 })}
          ${renderConfigSelect("LTV source", "basel4", "ltvMode", config.ltvMode, [
            { value: "column", label: "Mapped column" },
            { value: "constant", label: "Fixed value" },
          ])}
          ${renderConfigNumber("Constant LTV (%)", "basel4", "constantLtv", config.constantLtv, { min: 1, max: 100, step: 1 })}
          ${renderConfigSelect("Fallback exposure class", "basel4", "defaultExposureClass", config.defaultExposureClass, [
            { value: "Private Residential", label: "Private Residential" },
            { value: "Commercial Income Producing Real Estate", label: "Commercial Income Producing Real Estate" },
            { value: "Private Income Producing Real Estate", label: "Private Income Producing Real Estate" },
          ])}
          ${renderConfigNumber("PD floor (bps)", "basel4", "pdFloorBps", config.pdFloorBps, { min: 1, max: 100, step: 1 })}
          ${renderConfigNumber("Output floor (%)", "basel4", "outputFloor", config.outputFloor, { min: 1, max: 100, step: 0.5 })}
        </div>
        <div class="field-grid compact-grid">
          ${renderConfigNumber("PRRE LGD floor (%)", "basel4", "prreLgdFloor", config.prreLgdFloor, { min: 0, max: 100, step: 0.5 })}
          ${renderConfigNumber("CIPRE LGD floor (%)", "basel4", "cipreLgdFloor", config.cipreLgdFloor, { min: 0, max: 100, step: 0.5 })}
          ${renderConfigNumber("PIPRE LGD floor (%)", "basel4", "pipreLgdFloor", config.pipreLgdFloor, { min: 0, max: 100, step: 0.5 })}
        </div>
      </div>
    </article>
  `
}

function renderPreparationResults() {
  const preparation = state.derived.preparation
  if (!preparation?.ready) {
    return renderResultEmpty(preparation?.message || "Load a dataset and map the target column.")
  }

  return `
    <article class="card panel-card">
      ${renderMetricGrid([
        {
          label: "Selected variables",
          value: formatInteger(preparation.selectedFeatures.length),
          copy: "Predictors currently carried into the preparation workflow.",
        },
        {
          label: "Top IV feature",
          value: preparation.topIvFeatures[0] ? escapeHtml(preparation.topIvFeatures[0].name) : "n/a",
          copy: preparation.topIvFeatures[0] ? `IV ${formatDecimal(preparation.topIvFeatures[0].iv, 3)}` : "No active features.",
        },
        {
          label: "Missing policy",
          value: state.steps.preparation.missingStrategy === "median_mode" ? "Median / mode" : "Missing bucket",
          copy: "The transformation policy used before scoring.",
        },
        {
          label: "Rows prepared",
          value: formatInteger(preparation.rows.length),
          copy: "Observations carried through the sample split.",
        },
      ])}
      <div class="panel-subgrid two-up">
        <section class="table-card">
          <div class="mini-heading">
            <p class="card-kicker">Sample split</p>
            <h3>Assigned sub-populations</h3>
          </div>
          ${renderTable(
            ["Sample", "Rows", "Default rate"],
            preparation.splitSummary.map((item) => ({
              Sample: item.sampleLabel,
              Rows: formatInteger(item.count),
              "Default rate": item.defaultRate === null ? "n/a" : formatPercent(item.defaultRate),
            }))
          )}
        </section>
        <section class="table-card">
          <div class="mini-heading">
            <p class="card-kicker">Data quality</p>
            <h3>Highest missingness</h3>
          </div>
          ${renderTable(
            ["Column", "Type", "Missing rate"],
            preparation.missingSummary.map((item) => ({
              Column: item.name,
              Type: item.type,
              "Missing rate": formatPercent(item.missingRate),
            }))
          )}
        </section>
      </div>
      <section class="table-card">
        <div class="mini-heading">
          <p class="card-kicker">Predictive power</p>
          <h3>IV ladder</h3>
        </div>
        ${renderFeatureStrengthBars(preparation.topIvFeatures)}
      </section>
    </article>
  `
}

function renderEstimationResults() {
  const estimation = state.derived.estimation
  if (!estimation?.ready) {
    return renderResultEmpty(estimation?.message || "Estimate the model after preparing the data.")
  }

  return `
    <article class="card panel-card">
      ${renderMetricGrid([
        {
          label: "AUC",
          value: formatDecimal(estimation.estimationMetrics.auc, 3),
          copy: "Discrimination power on the estimation sample.",
        },
        {
          label: "Accuracy ratio",
          value: formatPercent(estimation.estimationMetrics.ar, 1),
          copy: "Computed as 2 * AUC - 1.",
        },
        {
          label: "Average PD",
          value: formatPercent(estimation.averagePd),
          copy: "Mean predicted PD in the development sample.",
        },
        {
          label: "Final features",
          value: formatInteger(estimation.finalFeatures.length),
          copy: "Variables surviving the IV threshold and the feature cap.",
        },
      ])}
      <div class="panel-subgrid two-up">
        <section class="table-card">
          <div class="mini-heading">
            <p class="card-kicker">Coefficients</p>
            <h3>Logistic scorecard weights</h3>
          </div>
          ${renderTable(
            ["Feature", "Coefficient", "IV"],
            estimation.coefficientRows.map((row) => ({
              Feature: row.feature,
              Coefficient: formatDecimal(row.coefficient, 4),
              IV: row.iv === null ? "n/a" : formatDecimal(row.iv, 3),
            }))
          )}
        </section>
        <section class="table-card">
          <div class="mini-heading">
            <p class="card-kicker">Rating profile</p>
            <h3>Estimation sample distribution</h3>
          </div>
          ${renderDistributionBars(estimation.ratingDistribution, "Estimation")}
        </section>
      </div>
      <section class="table-card">
        <div class="mini-heading">
          <p class="card-kicker">Scorecard</p>
          <h3>Bucket-level contributions</h3>
        </div>
        ${renderTable(
          ["Feature", "Bucket", "WOE", "Score"],
          estimation.scorecardRows.slice(0, 20).map((row) => ({
            Feature: row.feature,
            Bucket: row.bucket,
            WOE: formatDecimal(row.woe, 3),
            Score: formatInteger(row.score),
          }))
        )}
      </section>
    </article>
  `
}

function renderValidationResults() {
  const validation = state.derived.validation
  if (!validation?.ready) {
    return renderResultEmpty(validation?.message || "Validation will appear after model estimation.")
  }

  return `
    <article class="card panel-card">
      ${renderMetricGrid([
        {
          label: "Estimation AR",
          value: formatPercent(validation.estimationMetrics.ar, 1),
          copy: "Reference discrimination on the development sample.",
        },
        {
          label: "Validation AR",
          value: formatPercent(validation.validationMetrics.ar, 1),
          copy: "Observed discrimination on the independent sample.",
        },
        {
          label: "SSI",
          value: formatDecimal(validation.ssi, 3),
          copy: "System Stability Index across rating distributions.",
        },
        {
          label: "Threshold",
          value: formatPercent(state.steps.validation.classificationThreshold),
          copy: "Used for the confusion matrix below.",
        },
      ])}
      <section class="table-card">
        <div class="mini-heading">
          <p class="card-kicker">Distribution challenge</p>
          <h3>Estimation versus validation ratings</h3>
        </div>
        ${renderDistributionComparison(
          validation.distributionEstimation,
          validation.distributionValidation,
          "Estimation",
          "Validation"
        )}
      </section>
      <div class="panel-subgrid two-up">
        <section class="table-card">
          <div class="mini-heading">
            <p class="card-kicker">Confusion matrix</p>
            <h3>Validation sample</h3>
          </div>
          ${renderTable(["Prediction", "Count"], [
            { Prediction: "True positives", Count: formatInteger(validation.confusion.truePositive) },
            { Prediction: "False positives", Count: formatInteger(validation.confusion.falsePositive) },
            { Prediction: "True negatives", Count: formatInteger(validation.confusion.trueNegative) },
            { Prediction: "False negatives", Count: formatInteger(validation.confusion.falseNegative) },
          ])}
        </section>
        <section class="callout-card">
          <strong>${deriveValidationVerdict(validation)}</strong>
          <p>The simulator flags stability pressure when AR weakens sharply or SSI rises meaningfully above the smoothing-adjusted baseline.</p>
        </section>
      </div>
    </article>
  `
}

function renderMonitoringResults() {
  const monitoring = state.derived.monitoring
  if (!monitoring?.ready) {
    return renderResultEmpty(monitoring?.message || "Monitoring appears after estimation and a current-period sample.")
  }

  return `
    <article class="card panel-card">
      ${renderMetricGrid([
        {
          label: "Estimation AR",
          value: formatPercent(monitoring.estimationMetrics.ar, 1),
          copy: "Benchmark discrimination from the development sample.",
        },
        {
          label: `${capitalize(monitoring.sourceSample)} AR`,
          value: formatPercent(monitoring.monitoringMetrics.ar, 1),
          copy: "Current discrimination in the chosen monitoring sample.",
        },
        {
          label: "SSI",
          value: formatDecimal(monitoring.ssi, 3),
          copy: "Rating distribution drift versus the estimation sample.",
        },
        {
          label: "DR / PD factor",
          value: monitoring.drPdFactor === null ? "n/a" : formatDecimal(monitoring.drPdFactor, 2),
          copy: "Observed default rate divided by average predicted PD.",
        },
      ])}
      <section class="table-card">
        <div class="mini-heading">
          <p class="card-kicker">Distribution drift</p>
          <h3>Estimation versus monitoring ratings</h3>
        </div>
        ${renderDistributionComparison(
          monitoring.distributionEstimation,
          monitoring.distributionMonitoring,
          "Estimation",
          capitalize(monitoring.sourceSample)
        )}
      </section>
      <div class="panel-subgrid two-up">
        <section class="table-card">
          <div class="mini-heading">
            <p class="card-kicker">Calibration signal</p>
            <h3>Predicted versus observed by rating</h3>
          </div>
          ${renderTable(
            ["Rating", "Predicted PD", "Observed DR", "Rows"],
            monitoring.byRating.map((row) => ({
              Rating: row.rating,
              "Predicted PD": formatPercent(row.predictedPd),
              "Observed DR": formatPercent(row.observedRate),
              Rows: formatInteger(row.count),
            }))
          )}
        </section>
        <section class="callout-card">
          <strong>${deriveMonitoringVerdict(monitoring)}</strong>
          <p>Monitoring combines drift and calibration signals so the user can decide whether the model stays within governance tolerance or needs remediation.</p>
        </section>
      </div>
    </article>
  `
}

function renderCalibrationResults() {
  const calibration = state.derived.calibration
  if (!calibration?.ready) {
    return renderResultEmpty(calibration?.message || "Calibration appears after estimation and a populated monitoring sample.")
  }

  return `
    <article class="card panel-card">
      ${renderMetricGrid([
        {
          label: "Observed anchor",
          value: formatPercent(calibration.observedAnchor),
          copy: "Empirical default rate in the selected calibration sample.",
        },
        {
          label: "Target anchor",
          value: formatPercent(calibration.anchorRate),
          copy: "Observed or manual target used for the logit shift.",
        },
        {
          label: "Average PD before",
          value: formatPercent(calibration.averagePredictedPd),
          copy: "Average predicted PD before recalibration.",
        },
        {
          label: "Average PD after",
          value: formatPercent(calibration.averageCalibratedPd),
          copy: "Average calibrated PD after the shift.",
        },
      ])}
      <section class="table-card">
        <div class="mini-heading">
          <p class="card-kicker">Calibration curve</p>
          <h3>Predicted versus calibrated PDs</h3>
        </div>
        ${renderLineChart(calibration.linePoints, [
          { key: "predictedPd", label: "Predicted PD", color: "#1a35a8" },
          { key: "calibratedPd", label: "Calibrated PD", color: "#ff5a0a" },
        ])}
      </section>
      <section class="table-card">
        <div class="mini-heading">
          <p class="card-kicker">Migration matrix</p>
          <h3>Original versus calibrated ratings</h3>
        </div>
        ${renderMatrixTable(calibration.migrationMatrix)}
      </section>
    </article>
  `
}

function renderBasel3Results() {
  const basel3 = state.derived.basel3
  if (!basel3?.ready) {
    return renderResultEmpty(basel3?.message || "Basel III will appear once the portfolio has scored observations.")
  }

  return `
    <article class="card panel-card">
      ${renderMetricGrid([
        {
          label: "Total exposure",
          value: formatCurrencyCompact(basel3.totalExposure),
          copy: "Exposure at default carried into the IRB-style view.",
        },
        {
          label: "Total RWA",
          value: formatCurrencyCompact(basel3.totalRwa),
          copy: "Aggregate Basel III RWA under the chosen assumptions.",
        },
        {
          label: "Average risk weight",
          value: basel3.averageRiskWeight === null ? "n/a" : formatPercent(basel3.averageRiskWeight),
          copy: "Total RWA divided by total exposure.",
        },
        {
          label: "Average capital requirement",
          value: basel3.averageCapitalRequirement === null ? "n/a" : formatPercent(basel3.averageCapitalRequirement),
          copy: "Average K implied by the IRB function.",
        },
      ])}
      <section class="table-card">
        <div class="mini-heading">
          <p class="card-kicker">Risk concentration</p>
          <h3>Exposure and RWA by rating</h3>
        </div>
        ${renderTable(
          ["Rating", "Exposure", "RWA", "Risk weight"],
          basel3.byRating.map((row) => ({
            Rating: row.rating,
            Exposure: formatCurrencyCompact(row.exposure),
            RWA: formatCurrencyCompact(row.rwa),
            "Risk weight": row.exposure ? formatPercent(row.rwa / row.exposure) : "n/a",
          }))
        )}
      </section>
    </article>
  `
}

function renderBasel4Results() {
  const basel4 = state.derived.basel4
  if (!basel4?.ready) {
    return renderResultEmpty(basel4?.message || "Basel IV will appear once the portfolio has scored observations.")
  }

  return `
    <article class="card panel-card">
      ${renderMetricGrid([
        {
          label: "Standardized RWA",
          value: formatCurrencyCompact(basel4.standardizedRwa),
          copy: "Risk-weighted assets under the Basel IV standardized view.",
        },
        {
          label: "IRB RWA",
          value: formatCurrencyCompact(basel4.irbRwa),
          copy: "Risk-weighted assets after Basel IV parameter floors.",
        },
        {
          label: "Final RWA",
          value: formatCurrencyCompact(basel4.finalRwa),
          copy: "Final capital view after applying the output floor.",
        },
        {
          label: "Floor gap",
          value: formatCurrencyCompact(basel4.floorGap),
          copy: "Incremental RWA added by the output floor.",
        },
      ])}
      <section class="table-card">
        <div class="mini-heading">
          <p class="card-kicker">Exposure classes</p>
          <h3>Basel IV segmentation summary</h3>
        </div>
        ${renderTable(
          ["Exposure class", "Rows", "Exposure", "Standardized RWA", "IRB RWA"],
          basel4.byClass.map((row) => ({
            "Exposure class": row.exposureClass,
            Rows: formatInteger(row.count),
            Exposure: formatCurrencyCompact(row.exposure),
            "Standardized RWA": formatCurrencyCompact(row.standardizedRwa),
            "IRB RWA": formatCurrencyCompact(row.irbRwa),
          }))
        )}
      </section>
      <section class="callout-card">
        <strong>${basel4.floorGap > 0 ? "The output floor is binding." : "The IRB view remains above the output floor."}</strong>
        <p>The final Basel IV portfolio view compares floored IRB RWAs against the standardized benchmark and retains the more conservative total.</p>
      </section>
    </article>
  `
}

function renderResultEmpty(message) {
  return `<article class="card panel-card empty-panel"><div class="empty-state"><strong>Waiting for inputs</strong><p>${escapeHtml(
    message
  )}</p></div></article>`
}

function renderMetricGrid(items) {
  return `<div class="stat-grid">${items.map((item) => renderMetricTile(item.label, item.value, item.copy, true)).join("")}</div>`
}

function renderMetricTile(label, value, copy, inPanel = false) {
  return `
    <article class="${inPanel ? "stat-card" : "metric-tile"}">
      <span class="metric-label">${escapeHtml(label)}</span>
      <strong>${value}</strong>
      <p>${escapeHtml(copy)}</p>
    </article>
  `
}

function renderGlobalSelectField(label, configKey, options, selectedValue, helperCopy) {
  return `
    <label class="field-card">
      <span class="field-label">${escapeHtml(label)}</span>
      <select class="field-input" data-action="set-global" data-global-key="${configKey}">
        <option value="">Not mapped</option>
        ${options.map((option) => renderOption(option, selectedValue)).join("")}
      </select>
      <small>${escapeHtml(helperCopy)}</small>
    </label>
  `
}

function renderConfigSelect(label, stepKey, configKey, selectedValue, options) {
  return `
    <label class="field-card">
      <span class="field-label">${escapeHtml(label)}</span>
      <select class="field-input" data-action="set-config" data-step-key="${stepKey}" data-config-key="${configKey}">
        ${options.map((option) => `<option value="${escapeHtml(option.value)}" ${option.value === selectedValue ? "selected" : ""}>${escapeHtml(option.label)}</option>`).join("")}
      </select>
    </label>
  `
}

function renderConfigNumber(label, stepKey, configKey, value, options = {}) {
  return `
    <label class="field-card">
      <span class="field-label">${escapeHtml(label)}</span>
      <input
        class="field-input"
        type="number"
        value="${Number(value)}"
        data-action="set-config"
        data-step-key="${stepKey}"
        data-config-key="${configKey}"
        data-value-kind="number"
        min="${options.min ?? ""}"
        max="${options.max ?? ""}"
        step="${options.step ?? "any"}"
      />
    </label>
  `
}

function renderConfigPercent(label, stepKey, configKey, value) {
  return `
    <label class="field-card">
      <span class="field-label">${escapeHtml(label)}</span>
      <input
        class="field-input"
        type="number"
        value="${(Number(value) * 100).toFixed(2)}"
        data-action="set-config"
        data-step-key="${stepKey}"
        data-config-key="${configKey}"
        data-value-kind="percent"
        min="0"
        max="100"
        step="0.1"
      />
    </label>
  `
}

function renderFeatureOption(featureName, checked, action) {
  const columnStat = state.metadata?.columnMap[featureName]
  const metaCopy = columnStat
    ? `${capitalize(columnStat.type)} - ${formatPercent(columnStat.missingRate)} missing`
    : "Predictor"
  return `
    <label class="feature-option">
      <input type="checkbox" ${checked ? "checked" : ""} value="${escapeHtml(featureName)}" data-action="${action}" />
      <span class="feature-copy">
        <strong>${escapeHtml(featureName)}</strong>
        <small>${escapeHtml(metaCopy)}</small>
      </span>
    </label>
  `
}

function renderTable(columns, rows) {
  if (!rows.length) {
    return renderEmptyState("No rows available.")
  }

  return `
    <div class="table-scroll">
      <table class="data-table">
        <thead>
          <tr>${columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (row) => `
                <tr>
                  ${columns.map((column) => `<td>${escapeHtml(row[column] ?? "")}</td>`).join("")}
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `
}

function renderFeatureStrengthBars(featureMeta) {
  if (!featureMeta.length) {
    return renderEmptyState("No IV values are available yet.")
  }

  const maxIv = Math.max(...featureMeta.map((item) => item.iv), 0.001)
  return `
    <div class="bar-list">
      ${featureMeta
        .map((feature) => {
          const width = (feature.iv / maxIv) * 100
          return `
            <div class="bar-row">
              <div class="bar-header">
                <strong>${escapeHtml(feature.name)}</strong>
                <span>${formatDecimal(feature.iv, 3)}</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill" style="width:${width}%"></div>
              </div>
            </div>
          `
        })
        .join("")}
    </div>
  `
}

function renderDistributionBars(distribution, seriesLabel) {
  return `
    <div class="comparison-card">
      <div class="legend-row">
        <span class="legend-chip">${escapeHtml(seriesLabel)}</span>
      </div>
      <div class="bar-list">
        ${RATING_MASTER_SCALE.map((ratingStep) => {
          const value = distribution[ratingStep.rating] ?? 0
          return `
            <div class="bar-row">
              <div class="bar-header">
                <strong>${ratingStep.rating}</strong>
                <span>${formatPercent(value)}</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill" style="width:${value * 100}%"></div>
              </div>
            </div>
          `
        }).join("")}
      </div>
    </div>
  `
}

function renderDistributionComparison(firstDistribution, secondDistribution, firstLabel, secondLabel) {
  return `
    <div class="comparison-card">
      <div class="legend-row">
        <span class="legend-chip">${escapeHtml(firstLabel)}</span>
        <span class="legend-chip is-secondary">${escapeHtml(secondLabel)}</span>
      </div>
      <div class="comparison-list">
        ${RATING_MASTER_SCALE.map((ratingStep) => {
          const firstValue = firstDistribution[ratingStep.rating] ?? 0
          const secondValue = secondDistribution[ratingStep.rating] ?? 0
          return `
            <div class="comparison-row">
              <strong class="comparison-label">${ratingStep.rating}</strong>
              <div class="comparison-bars">
                <div class="comparison-track">
                  <div class="comparison-fill" style="width:${firstValue * 100}%"></div>
                </div>
                <span>${formatPercent(firstValue)}</span>
              </div>
              <div class="comparison-bars">
                <div class="comparison-track is-secondary">
                  <div class="comparison-fill is-secondary" style="width:${secondValue * 100}%"></div>
                </div>
                <span>${formatPercent(secondValue)}</span>
              </div>
            </div>
          `
        }).join("")}
      </div>
    </div>
  `
}

function renderLineChart(points, seriesDefinitions) {
  if (!points.length) {
    return renderEmptyState("No calibration curve is available.")
  }

  const width = 560
  const height = 260
  const padding = { top: 18, right: 18, bottom: 34, left: 46 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom
  const maxY = Math.max(
    ...points.flatMap((point) => seriesDefinitions.map((seriesDefinition) => point[seriesDefinition.key] ?? 0)),
    0.0001
  )

  const xCoordinate = (index) =>
    padding.left + (points.length === 1 ? chartWidth / 2 : (index / (points.length - 1)) * chartWidth)
  const yCoordinate = (value) => padding.top + chartHeight - (value / maxY) * chartHeight

  const polylines = seriesDefinitions
    .map((seriesDefinition) => {
      const coordinates = points
        .map((point, index) => `${xCoordinate(index)},${yCoordinate(point[seriesDefinition.key] ?? 0)}`)
        .join(" ")
      return `<polyline fill="none" stroke="${seriesDefinition.color}" stroke-width="3" points="${coordinates}" />`
    })
    .join("")

  const markers = seriesDefinitions
    .map((seriesDefinition) =>
      points
        .map(
          (point, index) =>
            `<circle cx="${xCoordinate(index)}" cy="${yCoordinate(point[seriesDefinition.key] ?? 0)}" r="4" fill="${seriesDefinition.color}" />`
        )
        .join("")
    )
    .join("")

  const xLabels = points
    .map(
      (point, index) =>
        `<text x="${xCoordinate(index)}" y="${height - 8}" text-anchor="middle" class="axis-label">${escapeHtml(point.label)}</text>`
    )
    .join("")

  return `
    <div class="line-chart">
      <div class="legend-row">
        ${seriesDefinitions
          .map(
            (seriesDefinition) =>
              `<span class="legend-chip" style="--legend-color:${seriesDefinition.color}">${escapeHtml(seriesDefinition.label)}</span>`
          )
          .join("")}
      </div>
      <svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Calibration curve">
        <line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${padding.top + chartHeight}" class="axis-line"></line>
        <line x1="${padding.left}" y1="${padding.top + chartHeight}" x2="${padding.left + chartWidth}" y2="${padding.top + chartHeight}" class="axis-line"></line>
        ${[0.25, 0.5, 0.75, 1]
          .map((tick) => {
            const y = yCoordinate(maxY * tick)
            return `<line x1="${padding.left}" y1="${y}" x2="${padding.left + chartWidth}" y2="${y}" class="grid-line"></line>`
          })
          .join("")}
        ${polylines}
        ${markers}
        ${xLabels}
      </svg>
    </div>
  `
}

function renderMatrixTable(matrix) {
  const columns = ["From / To", ...RATING_MASTER_SCALE.map((item) => item.rating)]
  const rows = RATING_MASTER_SCALE.map((rating) => {
    const output = { "From / To": rating.rating }
    RATING_MASTER_SCALE.forEach((targetRating) => {
      output[targetRating.rating] = formatInteger(matrix[rating.rating]?.[targetRating.rating] ?? 0)
    })
    return output
  })
  return renderTable(columns, rows)
}

function renderEmptyState(message) {
  return `<div class="empty-state"><p>${escapeHtml(message)}</p></div>`
}

function buildCodeDocument(stepKey) {
  const syncBlock = buildSyncBlock(stepKey, "code")
  const notesBlock = buildAnalystNotesBlock(stepKey, "code")
  const body = buildCodeBody(stepKey)
  return [syncBlock, "", notesBlock, "", body].join("\n")
}

function buildMethodologyDocument(stepKey) {
  const syncBlock = buildSyncBlock(stepKey, "methodology")
  const notesBlock = buildAnalystNotesBlock(stepKey, "methodology")
  const body = buildMethodologyBody(stepKey)
  return [syncBlock, "", body, "", notesBlock].join("\n")
}

function buildSyncBlock(stepKey, documentType) {
  const payload = {
    step: stepKey,
    global: state.global,
    config: state.steps[stepKey],
  }
  const json = JSON.stringify(payload, null, 2)

  if (documentType === "code") {
    return [
      "# CREDIT RISK WITH AI :: STATE JSON START",
      ...json.split("\n").map((line) => `# ${line}`),
      "# CREDIT RISK WITH AI :: STATE JSON END",
    ].join("\n")
  }

  return [
    "<!-- CREDIT RISK WITH AI :: STATE JSON START",
    json,
    "CREDIT RISK WITH AI :: STATE JSON END -->",
  ].join("\n")
}

function buildAnalystNotesBlock(stepKey, documentType) {
  const notes = state.notes[stepKey][documentType]

  if (documentType === "code") {
    return [
      "# CREDIT RISK WITH AI :: ANALYST NOTES START",
      ...notes.split("\n").map((line) => `# ${line}`),
      "# CREDIT RISK WITH AI :: ANALYST NOTES END",
    ].join("\n")
  }

  return [
    "## Analyst notes",
    "CREDIT RISK WITH AI :: ANALYST NOTES START",
    notes,
    "CREDIT RISK WITH AI :: ANALYST NOTES END",
  ].join("\n")
}

function buildCodeBody(stepKey) {
  const preparation = state.derived.preparation
  const estimation = state.derived.estimation
  const validation = state.derived.validation
  const monitoring = state.derived.monitoring
  const calibration = state.derived.calibration
  const basel3 = state.derived.basel3
  const basel4 = state.derived.basel4

  switch (stepKey) {
    case "preparation":
      return [
        "###############################################################################",
        "# Credit risk with AI - Data Preparation",
        "###############################################################################",
        "rm(list = ls())",
        "",
        "library(dplyr)",
        "library(readr)",
        "library(tidyr)",
        "library(caTools)",
        "",
        `dataset <- read_csv("${state.datasetName || "portfolio.csv"}")`,
        `target_column <- "${state.global.targetColumn || "Default_Flag"}"`,
        `selected_variables <- c(${state.steps.preparation.selectedFeatures.map((feature) => `"${feature}"`).join(", ")})`,
        `missing_strategy <- "${state.steps.preparation.missingStrategy}"`,
        `bin_count <- ${Math.round(state.steps.preparation.binCount)}`,
        `sample_shares <- c(estimation = ${formatDecimal(preparation?.shareConfig?.estimation ?? 0.6, 3)}, validation = ${formatDecimal(
          preparation?.shareConfig?.validation ?? 0.2,
          3
        )}, monitoring = ${formatDecimal(preparation?.shareConfig?.monitoring ?? 0.1, 3)}, calibration = ${formatDecimal(
          preparation?.shareConfig?.calibration ?? 0.1,
          3
        )})`,
        "",
        "calculate_missing <- function(df) {",
        "  colSums(is.na(df)) / nrow(df) * 100",
        "}",
        "",
        "calculate_woe <- function(data, feature, target) {",
        "  grouped <- data %>%",
        "    group_by(.data[[feature]]) %>%",
        "    summarise(",
        "      Good = sum(1 - .data[[target]], na.rm = TRUE),",
        "      Bad = sum(.data[[target]], na.rm = TRUE),",
        "      .groups = 'drop'",
        "    ) %>%",
        "    mutate(",
        "      WOE = -log((Bad / sum(Bad) + 1e-5) / (Good / sum(Good) + 1e-5)),",
        "      IV = (Good / sum(Good) - Bad / sum(Bad)) * WOE",
        "    )",
        "  grouped",
        "}",
        "",
        "missing_summary <- calculate_missing(dataset)",
        "print(sort(missing_summary, decreasing = TRUE))",
        "",
        "woe_iv_results <- lapply(selected_variables, function(variable_name) {",
        "  transformed <- calculate_woe(dataset, variable_name, target_column)",
        "  list(",
        "    variable = variable_name,",
        "    woe = transformed,",
        "    iv = sum(transformed$IV, na.rm = TRUE)",
        "  )",
        "})",
        "",
        "for (variable_name in selected_variables) {",
        "  woe_data <- calculate_woe(dataset, variable_name, target_column)",
        "  dataset <- dataset %>%",
        "    left_join(woe_data %>% select(!!sym(variable_name), WOE), by = variable_name) %>%",
        "    mutate(!!paste0('WOE_', variable_name) := WOE) %>%",
        "    select(-WOE)",
        "}",
        "",
        "set.seed(123)",
        "split_index <- sample.split(dataset[[target_column]], SplitRatio = sample_shares['estimation'])",
        "estimation_sample <- dataset[split_index, ]",
        "validation_sample <- dataset[!split_index, ]",
        "",
        "write_csv(dataset, 'processed_dataset.csv')",
        "write_csv(estimation_sample, 'estimation_sample.csv')",
        "write_csv(validation_sample, 'validation_sample.csv')",
        "",
        `# Browser summary: ${preparation?.ready ? `${preparation.rows.length} rows prepared and ${preparation.featureMeta.length} transformed features created.` : "Preparation pending."}`,
      ].join("\n")
    case "estimation":
      return [
        "###############################################################################",
        "# Credit risk with AI - Estimation of Rating Model",
        "###############################################################################",
        "rm(list = ls())",
        "",
        "library(dplyr)",
        "library(readr)",
        "library(pROC)",
        "",
        "estimation_sample <- read_csv('estimation_sample.csv')",
        `active_features <- c(${(estimation?.finalFeatures || []).map((feature) => `"WOE_${feature.name}"`).join(", ")})`,
        `iv_threshold <- ${formatDecimal(state.steps.estimation.ivThreshold, 3)}`,
        `ridge_penalty <- ${formatDecimal(state.steps.estimation.ridge, 3)}`,
        `score_offset <- ${formatDecimal(state.steps.estimation.scoreOffset, 3)}`,
        `score_factor <- ${formatDecimal(state.steps.estimation.scoreFactor, 3)}`,
        "",
        "estimation_input <- estimation_sample %>%",
        "  select(all_of(c('Default_Flag', active_features)))",
        "",
        "logit_model <- glm(Default_Flag ~ ., data = estimation_input, family = binomial())",
        "summary(logit_model)",
        "",
        "predicted_pd <- predict(logit_model, type = 'response')",
        "roc_curve <- roc(estimation_input$Default_Flag, predicted_pd)",
        "auc_value <- auc(roc_curve)",
        "accuracy_ratio <- 2 * auc_value - 1",
        "",
        "assign_ratings <- function(pd) {",
        "  case_when(",
        "    pd <= 0.004 ~ 'AAA',",
        "    pd <= 0.008 ~ 'AA',",
        "    pd <= 0.016 ~ 'A',",
        "    pd <= 0.032 ~ 'BBB',",
        "    pd <= 0.064 ~ 'BB',",
        "    pd <= 0.128 ~ 'B',",
        "    pd <= 0.256 ~ 'CCC',",
        "    pd <= 0.512 ~ 'CC',",
        "    TRUE ~ 'C'",
        "  )",
        "}",
        "",
        "scored_clients <- estimation_sample %>%",
        "  mutate(",
        "    PD = predicted_pd,",
        "    Score = round(score_offset + score_factor * qlogis(pmin(pmax(PD, 1e-6), 1 - 1e-6))),",
        "    Rating = assign_ratings(PD)",
        "  )",
        "",
        "write_csv(scored_clients, 'client_data_rated.csv')",
        "save(logit_model, file = 'regression.Rdata')",
        "",
        `# Browser summary: ${estimation?.ready ? `AUC ${formatDecimal(estimation.estimationMetrics.auc, 3)} with ${estimation.finalFeatures.length} active features.` : "Estimation pending."}`,
      ].join("\n")
    case "validation":
      return [
        "###############################################################################",
        "# Credit risk with AI - Validation of Rating Model",
        "###############################################################################",
        "rm(list = ls())",
        "",
        "library(dplyr)",
        "library(readr)",
        "library(pROC)",
        "",
        "estimation_sample <- read_csv('estimation_sample.csv')",
        "validation_sample <- read_csv('validation_sample.csv')",
        "load('regression.Rdata')",
        `classification_threshold <- ${formatDecimal(state.steps.validation.classificationThreshold, 4)}`,
        "",
        "validation_sample <- validation_sample %>%",
        "  mutate(predicted_pd = predict(logit_model, newdata = ., type = 'response'))",
        "",
        "calculate_ar <- function(data) {",
        "  roc_object <- roc(data$Default_Flag, data$predicted_pd)",
        "  2 * auc(roc_object) - 1",
        "}",
        "",
        "validation_ar <- calculate_ar(validation_sample)",
        "",
        "assign_ratings <- function(pd) {",
        "  case_when(",
        "    pd <= 0.004 ~ 'AAA',",
        "    pd <= 0.008 ~ 'AA',",
        "    pd <= 0.016 ~ 'A',",
        "    pd <= 0.032 ~ 'BBB',",
        "    pd <= 0.064 ~ 'BB',",
        "    pd <= 0.128 ~ 'B',",
        "    pd <= 0.256 ~ 'CCC',",
        "    pd <= 0.512 ~ 'CC',",
        "    TRUE ~ 'C'",
        "  )",
        "}",
        "",
        "validation_sample <- validation_sample %>%",
        "  mutate(",
        "    Rating = assign_ratings(predicted_pd),",
        "    Default_Prediction = if_else(predicted_pd >= classification_threshold, 1, 0)",
        "  )",
        "",
        "write_csv(validation_sample, 'validation_results.csv')",
        "",
        `# Browser summary: ${validation?.ready ? `Validation AR ${formatDecimal(validation.validationMetrics.ar, 3)} and SSI ${formatDecimal(validation.ssi, 3)}.` : "Validation pending."}`,
      ].join("\n")
    case "monitoring":
      return [
        "###############################################################################",
        "# Credit risk with AI - Monitoring of Rating Model",
        "###############################################################################",
        "rm(list = ls())",
        "",
        "library(dplyr)",
        "library(readr)",
        "library(pROC)",
        "",
        "estimation_sample <- read_csv('estimation_sample.csv')",
        `monitoring_sample <- read_csv('${state.steps.monitoring.sampleSource}_sample.csv')`,
        "load('regression.Rdata')",
        "",
        "monitoring_sample <- monitoring_sample %>%",
        "  mutate(predicted_pd = predict(logit_model, newdata = ., type = 'response'))",
        "",
        "calculate_ar <- function(data) {",
        "  roc_object <- roc(data$Default_Flag, data$predicted_pd)",
        "  2 * auc(roc_object) - 1",
        "}",
        "",
        "dr_pd_factor <- monitoring_sample %>%",
        "  summarise(factor = mean(Default_Flag, na.rm = TRUE) / mean(predicted_pd, na.rm = TRUE)) %>%",
        "  pull(factor)",
        "",
        "write_csv(monitoring_sample, 'monitoring_results.csv')",
        "",
        `# Browser summary: ${monitoring?.ready ? `Monitoring SSI ${formatDecimal(monitoring.ssi, 3)} and DR/PD factor ${formatDecimal(monitoring.drPdFactor, 2)}.` : "Monitoring pending."}`,
      ].join("\n")
    case "calibration":
      return [
        "###############################################################################",
        "# Credit risk with AI - Calibration of Rating Model",
        "###############################################################################",
        "rm(list = ls())",
        "",
        "library(dplyr)",
        "library(readr)",
        "",
        `calibration_sample <- read_csv('${state.steps.calibration.sampleSource}_sample.csv')`,
        "load('regression.Rdata')",
        "",
        "calibration_sample <- calibration_sample %>%",
        "  mutate(predicted_pd = predict(logit_model, newdata = ., type = 'response'))",
        "",
        `anchor_rate <- ${formatDecimal(calibration?.anchorRate ?? state.steps.calibration.manualAnchorRate, 6)}`,
        "portfolio_pd <- mean(calibration_sample$predicted_pd, na.rm = TRUE)",
        "shift <- qlogis(anchor_rate) - qlogis(portfolio_pd)",
        "",
        "calibration_sample <- calibration_sample %>%",
        "  mutate(",
        "    calibrated_pd = plogis(qlogis(pmin(pmax(predicted_pd, 1e-6), 1 - 1e-6)) + shift)",
        "  )",
        "",
        "write_csv(calibration_sample, 'calibrated_portfolio.csv')",
        "",
        `# Browser summary: ${calibration?.ready ? `Anchor ${formatPercent(calibration.anchorRate)} with shift ${formatDecimal(calibration.shift, 3)}.` : "Calibration pending."}`,
      ].join("\n")
    case "basel3":
      return [
        "###############################################################################",
        "# Credit risk with AI - Basel III RWA",
        "###############################################################################",
        "rm(list = ls())",
        "",
        "library(dplyr)",
        "library(readr)",
        "",
        "portfolio <- read_csv('calibrated_portfolio.csv')",
        `pd_column <- "${state.steps.basel3.pdSource === "calibrated" ? "calibrated_pd" : "predicted_pd"}"`,
        `constant_exposure <- ${formatDecimal(state.steps.basel3.constantExposure, 0)}`,
        `constant_lgd <- ${formatDecimal(state.steps.basel3.constantLgd, 2)}`,
        `constant_maturity <- ${formatDecimal(state.steps.basel3.constantMaturity, 2)}`,
        "",
        "calculate_irb_rwa_mortgage <- function(exposure, pd, lgd, maturity) {",
        "  rho <- 0.12 * (1 - exp(-50 * pd)) / (1 - exp(-50)) + 0.24 * (1 - (1 - exp(-50 * pd)) / (1 - exp(-50)))",
        "  b <- (0.11852 - 0.05478 * log(pd))^2",
        "  k <- (lgd * pnorm((1 - rho)^(-0.5) * qnorm(pd) + sqrt(rho / (1 - rho)) * qnorm(0.999)) - pd * lgd) *",
        "    (1 - 1.5 * b)^(-1) * (1 + (maturity - 2.5) * b)",
        "  k * 12.5 * exposure",
        "}",
        "",
        "portfolio <- portfolio %>%",
        "  mutate(",
        `    Exposure = if ('${state.global.exposureColumn}' != '' && '${state.steps.basel3.exposureMode}' == 'column') .data[['${state.global.exposureColumn}']] else constant_exposure,`,
        `    LGD = if ('${state.global.lgdColumn}' != '' && '${state.steps.basel3.lgdMode}' == 'column') .data[['${state.global.lgdColumn}']] / 100 else constant_lgd / 100,`,
        `    Maturity = if ('${state.global.maturityColumn}' != '' && '${state.steps.basel3.maturityMode}' == 'column') .data[['${state.global.maturityColumn}']] else constant_maturity,`,
        "    PD = .data[[pd_column]],",
        "    RWA = mapply(calculate_irb_rwa_mortgage, Exposure, PD, LGD, Maturity)",
        "  )",
        "",
        "write_csv(portfolio, 'basel3_rwa_results.csv')",
        "",
        `# Browser summary: ${basel3?.ready ? `Total Basel III RWA ${formatCurrencyCompact(basel3.totalRwa)}.` : "Basel III pending."}`,
      ].join("\n")
    case "basel4":
      return [
        "###############################################################################",
        "# Credit risk with AI - Basel IV RWA",
        "###############################################################################",
        "rm(list = ls())",
        "",
        "library(dplyr)",
        "library(readr)",
        "",
        "portfolio <- read_csv('calibrated_portfolio.csv')",
        `pd_floor_bps <- ${formatDecimal(state.steps.basel4.pdFloorBps, 0)}`,
        `output_floor <- ${formatDecimal(state.steps.basel4.outputFloor / 100, 3)}`,
        `fallback_exposure_class <- "${state.steps.basel4.defaultExposureClass}"`,
        "",
        "calculate_regulatory_lgd_floor <- function(exposure_type) {",
        "  case_when(",
        `    exposure_type == 'Private Residential' ~ ${formatDecimal(state.steps.basel4.prreLgdFloor / 100, 3)},`,
        `    exposure_type == 'Commercial Income Producing Real Estate' ~ ${formatDecimal(state.steps.basel4.cipreLgdFloor / 100, 3)},`,
        `    exposure_type == 'Private Income Producing Real Estate' ~ ${formatDecimal(state.steps.basel4.pipreLgdFloor / 100, 3)},`,
        `    TRUE ~ ${formatDecimal(state.steps.basel4.prreLgdFloor / 100, 3)}`,
        "  )",
        "}",
        "",
        "calculate_standardized_rwa <- function(exposure, ltv, exposure_type) {",
        "  risk_weight <- case_when(",
        "    exposure_type == 'Private Residential' & ltv <= 0.80 ~ 0.20,",
        "    exposure_type == 'Private Residential' ~ 0.70,",
        "    exposure_type == 'Commercial Income Producing Real Estate' & ltv <= 0.60 ~ 0.60,",
        "    exposure_type == 'Commercial Income Producing Real Estate' ~ 1.00,",
        "    exposure_type == 'Private Income Producing Real Estate' & ltv <= 0.60 ~ 0.50,",
        "    TRUE ~ 0.90",
        "  )",
        "  exposure * risk_weight",
        "}",
        "",
        "portfolio <- portfolio %>%",
        "  mutate(",
        `    Exposure_Type = if ('${state.global.exposureTypeColumn}' != '') .data[['${state.global.exposureTypeColumn}']] else fallback_exposure_class,`,
        `    LTV = if ('${state.global.ltvColumn}' != '' && '${state.steps.basel4.ltvMode}' == 'column') .data[['${state.global.ltvColumn}']] / 100 else ${formatDecimal(
          state.steps.basel4.constantLtv / 100,
          3
        )},`,
        "    PD = pmax(calibrated_pd, pd_floor_bps / 10000),",
        "    Regulatory_LGD_Floor = calculate_regulatory_lgd_floor(Exposure_Type),",
        "    Standardized_RWA = calculate_standardized_rwa(Exposure, LTV, Exposure_Type)",
        "  )",
        "",
        "write_csv(portfolio, 'basel4_rwa_results.csv')",
        "",
        `# Browser summary: ${basel4?.ready ? `Final Basel IV RWA ${formatCurrencyCompact(basel4.finalRwa)}.` : "Basel IV pending."}`,
      ].join("\n")
    default:
      return "# No code template available."
  }
}

function buildMethodologyBody(stepKey) {
  const preparation = state.derived.preparation
  const estimation = state.derived.estimation
  const validation = state.derived.validation
  const monitoring = state.derived.monitoring
  const calibration = state.derived.calibration
  const basel3 = state.derived.basel3
  const basel4 = state.derived.basel4

  switch (stepKey) {
    case "preparation":
      return [
        "# Methodology for Data Preparation",
        "",
        "## Objective",
        "Prepare the uploaded portfolio for rating model development through data profiling, missing-value treatment, variable transformation, and a controlled split into development, validation, monitoring, and calibration samples.",
        "",
        "## Current simulator configuration",
        `- Dataset: ${state.datasetName || "No dataset loaded"}`,
        `- Target variable: ${state.global.targetColumn || "Not mapped"}`,
        `- Selected variables: ${state.steps.preparation.selectedFeatures.join(", ") || "None selected"}`,
        `- Missing-value policy: ${state.steps.preparation.missingStrategy === "median_mode" ? "Median / mode imputation" : "Separate missing bucket"}`,
        `- Binning depth: ${formatInteger(state.steps.preparation.binCount)}`,
        `- Sample split: estimation ${formatPercent(preparation?.shareConfig?.estimation ?? 0.6, 1)}, validation ${formatPercent(
          preparation?.shareConfig?.validation ?? 0.2,
          1
        )}, monitoring ${formatPercent(preparation?.shareConfig?.monitoring ?? 0.1, 1)}, calibration ${formatPercent(
          preparation?.shareConfig?.calibration ?? 0.1,
          1
        )}`,
        "",
        "## Method",
        "1. Inspect the uploaded data set, record missingness, and infer variable types.",
        "2. Apply a consistent missing-value policy to categorical and numeric fields.",
        "3. Transform selected variables into preparation buckets suitable for WOE / IV analysis.",
        "4. Compute WOE and IV summaries so the user can keep only the strongest drivers.",
        "5. Split the portfolio into estimation, validation, monitoring, and calibration samples to support the full model lifecycle.",
        "",
        "## Current reading",
        `- Rows prepared: ${preparation?.ready ? formatInteger(preparation.rows.length) : "n/a"}`,
        `- Highest IV variable: ${preparation?.topIvFeatures?.[0] ? `${preparation.topIvFeatures[0].name} (${formatDecimal(preparation.topIvFeatures[0].iv, 3)})` : "n/a"}`,
        `- Most incomplete variable: ${preparation?.missingSummary?.[0] ? `${preparation.missingSummary[0].name} (${formatPercent(preparation.missingSummary[0].missingRate)})` : "n/a"}`,
      ].join("\n")
    case "estimation":
      return [
        "# Methodology for Estimation of Rating Models",
        "",
        "## Objective",
        "Estimate a logistic rating model on the prepared sample, retain the strongest variables, and translate the fitted relationship into PDs, scores, and rating grades.",
        "",
        "## Current simulator configuration",
        `- IV threshold: ${formatDecimal(state.steps.estimation.ivThreshold, 3)}`,
        `- Maximum model features: ${formatInteger(state.steps.estimation.maxFeatures)}`,
        `- Ridge penalty: ${formatDecimal(state.steps.estimation.ridge, 3)}`,
        `- Score scaling: offset ${formatDecimal(state.steps.estimation.scoreOffset, 0)} and factor ${formatDecimal(state.steps.estimation.scoreFactor, 0)}`,
        `- Feature shortlist: ${state.steps.estimation.modelFeatures.join(", ") || "None selected"}`,
        "",
        "## Method",
        "1. Start from the prepared WOE-style feature set produced in Data preparation.",
        "2. Keep variables that survive the IV threshold and the user-selected feature limit.",
        "3. Estimate a logistic regression for the default flag.",
        "4. Convert logits into PDs, scores, and final rating grades using the master scale.",
        "5. Produce a scorecard table so the logic can be ported into R and model documentation.",
        "",
        "## Current reading",
        `- Active model features: ${estimation?.ready ? estimation.finalFeatures.map((feature) => feature.name).join(", ") : "n/a"}`,
        `- Estimation AUC: ${estimation?.ready ? formatDecimal(estimation.estimationMetrics.auc, 3) : "n/a"}`,
        `- Estimation AR: ${estimation?.ready ? formatPercent(estimation.estimationMetrics.ar, 1) : "n/a"}`,
        `- Average PD: ${estimation?.ready ? formatPercent(estimation.averagePd) : "n/a"}`,
      ].join("\n")
    case "validation":
      return [
        "# Methodology for Validation of Rating Models",
        "",
        "## Objective",
        "Assess whether the rating model retains its discriminatory power and rating stability outside the development sample.",
        "",
        "## Current simulator configuration",
        `- Classification threshold: ${formatPercent(state.steps.validation.classificationThreshold)}`,
        `- SSI smoothing: ${formatDecimal(state.steps.validation.ssiSmoothing, 6)}`,
        "",
        "## Method",
        "1. Score the validation sample using the fitted logistic model.",
        "2. Compute AUC and derive the Accuracy Ratio for both estimation and validation samples.",
        "3. Map PDs to ratings and compare the resulting distributions.",
        "4. Calculate the System Stability Index to quantify distribution drift.",
        "5. Review the confusion matrix at the chosen threshold for an operational classification view.",
        "",
        "## Current reading",
        `- Estimation AR: ${validation?.ready ? formatPercent(validation.estimationMetrics.ar, 1) : "n/a"}`,
        `- Validation AR: ${validation?.ready ? formatPercent(validation.validationMetrics.ar, 1) : "n/a"}`,
        `- SSI: ${validation?.ready ? formatDecimal(validation.ssi, 3) : "n/a"}`,
        `- Validation verdict: ${validation?.ready ? deriveValidationVerdict(validation) : "n/a"}`,
      ].join("\n")
    case "monitoring":
      return [
        "# Methodology for Monitoring Rating Models",
        "",
        "## Objective",
        "Monitor the live population against the estimation sample to detect discrimination drift, distribution drift, and signs of PD misalignment.",
        "",
        "## Current simulator configuration",
        `- Monitoring sample: ${capitalize(state.steps.monitoring.sampleSource)}`,
        `- SSI alert level: ${formatDecimal(state.steps.monitoring.driftThreshold, 3)}`,
        `- DR / PD alert factor: ${formatDecimal(state.steps.monitoring.defaultPdAlert, 2)}`,
        "",
        "## Method",
        "1. Score the monitoring sample with the current model.",
        "2. Compare discrimination metrics between estimation and monitoring populations.",
        "3. Compare rating distributions and compute SSI.",
        "4. Contrast observed default rates with average predicted PDs.",
        "5. Summarize the evidence for stable performance, moderate drift, or escalation.",
        "",
        "## Current reading",
        `- Monitoring AR: ${monitoring?.ready ? formatPercent(monitoring.monitoringMetrics.ar, 1) : "n/a"}`,
        `- SSI: ${monitoring?.ready ? formatDecimal(monitoring.ssi, 3) : "n/a"}`,
        `- DR / PD factor: ${monitoring?.ready ? formatDecimal(monitoring.drPdFactor, 2) : "n/a"}`,
        `- Monitoring verdict: ${monitoring?.ready ? deriveMonitoringVerdict(monitoring) : "n/a"}`,
      ].join("\n")
    case "calibration":
      return [
        "# Methodology for Calibrating a Rating Model",
        "",
        "## Objective",
        "Recalibrate the score-to-PD mapping so that the average modeled PD aligns with the selected portfolio anchor point while keeping the ranking logic intact.",
        "",
        "## Current simulator configuration",
        `- Calibration sample: ${capitalize(state.steps.calibration.sampleSource)}`,
        `- Anchor source: ${state.steps.calibration.anchorSource === "manual" ? "Manual target" : "Observed default rate"}`,
        `- Manual anchor rate: ${formatPercent(state.steps.calibration.manualAnchorRate)}`,
        "",
        "## Method",
        "1. Score the chosen calibration sample with the current model.",
        "2. Measure the portfolio anchor point using the observed default rate or a manual policy target.",
        "3. Compute a logit shift equal to the difference between the target anchor and the average predicted PD.",
        "4. Apply the shift to every PD and remap ratings based on the recalibrated curve.",
        "5. Review the migration matrix and calibration curve before operational release.",
        "",
        "## Current reading",
        `- Observed anchor: ${calibration?.ready ? formatPercent(calibration.observedAnchor) : "n/a"}`,
        `- Target anchor: ${calibration?.ready ? formatPercent(calibration.anchorRate) : "n/a"}`,
        `- Average PD before: ${calibration?.ready ? formatPercent(calibration.averagePredictedPd) : "n/a"}`,
        `- Average PD after: ${calibration?.ready ? formatPercent(calibration.averageCalibratedPd) : "n/a"}`,
      ].join("\n")
    case "basel3":
      return [
        "# Methodology for Basel III Risk-Weighted Assets",
        "",
        "## Objective",
        "Translate the scored portfolio into a Basel III mortgage-style IRB capital view using PD, LGD, maturity, and EAD assumptions controlled by the user.",
        "",
        "## Current simulator configuration",
        `- Portfolio sample: ${capitalize(state.steps.basel3.sampleSource)}`,
        `- PD source: ${capitalize(state.steps.basel3.pdSource)}`,
        `- Exposure source: ${state.steps.basel3.exposureMode === "column" ? "Mapped column" : "Fixed value"}`,
        `- LGD source: ${state.steps.basel3.lgdMode === "column" ? "Mapped column" : "Fixed value"}`,
        `- Maturity source: ${state.steps.basel3.maturityMode === "column" ? "Mapped column" : "Fixed value"}`,
        "",
        "## Method",
        "1. Start from predicted or calibrated PDs, depending on the selected governance view.",
        "2. Resolve exposure, LGD, and maturity from mapped columns or constant assumptions.",
        "3. Apply the Basel III mortgage IRB function to compute capital requirement K and resulting RWA.",
        "4. Aggregate RWAs across the portfolio and inspect the implied average risk weight.",
        "",
        "## Current reading",
        `- Total exposure: ${basel3?.ready ? formatCurrencyCompact(basel3.totalExposure) : "n/a"}`,
        `- Total RWA: ${basel3?.ready ? formatCurrencyCompact(basel3.totalRwa) : "n/a"}`,
        `- Average risk weight: ${basel3?.ready ? formatPercent(basel3.averageRiskWeight) : "n/a"}`,
      ].join("\n")
    case "basel4":
      return [
        "# Methodology for Basel IV Risk-Weighted Assets",
        "",
        "## Objective",
        "Extend the capital view with Basel IV floors, standardized RWAs, exposure-class logic, and the portfolio-level output floor.",
        "",
        "## Current simulator configuration",
        `- Portfolio sample: ${capitalize(state.steps.basel4.sampleSource)}`,
        `- PD floor: ${formatInteger(state.steps.basel4.pdFloorBps)} bps`,
        `- Output floor: ${formatPercent(state.steps.basel4.outputFloor / 100, 1)}`,
        `- Fallback exposure class: ${state.steps.basel4.defaultExposureClass}`,
        "",
        "## Method",
        "1. Apply Basel IV floors to PD and LGD where relevant.",
        "2. Map the portfolio into standardized exposure classes and LTV segments.",
        "3. Compute standardized RWAs and compare them to the floored IRB view.",
        "4. Apply the output floor at portfolio level and retain the more conservative total.",
        "",
        "## Current reading",
        `- Standardized RWA: ${basel4?.ready ? formatCurrencyCompact(basel4.standardizedRwa) : "n/a"}`,
        `- Floored IRB RWA: ${basel4?.ready ? formatCurrencyCompact(basel4.irbRwa) : "n/a"}`,
        `- Final RWA: ${basel4?.ready ? formatCurrencyCompact(basel4.finalRwa) : "n/a"}`,
        `- Output floor gap: ${basel4?.ready ? formatCurrencyCompact(basel4.floorGap) : "n/a"}`,
      ].join("\n")
    default:
      return "# No methodology template available."
  }
}

function composeFullRScript() {
  return STEP_DEFINITIONS.map((stepDefinition) => state.documents[stepDefinition.key].code).join("\n\n")
}

function composeFullMethodology() {
  return STEP_DEFINITIONS.map((stepDefinition) => stripMethodologyArtifacts(state.documents[stepDefinition.key].methodology)).join("\n\n\n")
}

function parseSyncPayload(text) {
  const startMarker = "CREDIT RISK WITH AI :: STATE JSON START"
  const endMarker = "CREDIT RISK WITH AI :: STATE JSON END"
  const startIndex = text.indexOf(startMarker)
  const endIndex = text.indexOf(endMarker)

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    return null
  }

  const block = text
    .slice(startIndex + startMarker.length, endIndex)
    .split("\n")
    .map((line) => line.replace(/^\s*#\s?/, "").replace(/^\s*<!--\s?/, "").replace(/\s*-->\s*$/, ""))
    .join("\n")
    .trim()

  try {
    return JSON.parse(block)
  } catch (_error) {
    return null
  }
}

function extractAnalystNotes(text) {
  const startMarker = "CREDIT RISK WITH AI :: ANALYST NOTES START"
  const endMarker = "CREDIT RISK WITH AI :: ANALYST NOTES END"
  const startIndex = text.indexOf(startMarker)
  const endIndex = text.indexOf(endMarker)

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    return null
  }

  return text
    .slice(startIndex + startMarker.length, endIndex)
    .split("\n")
    .map((line) => line.replace(/^\s*#\s?/, ""))
    .join("\n")
    .trim()
}

function mergeWithTemplate(currentValue, nextValue, templateValue) {
  if (Array.isArray(templateValue)) {
    if (Array.isArray(nextValue)) {
      return nextValue.map((value) => String(value))
    }
    if (typeof nextValue === "string") {
      return nextValue
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean)
    }
    return currentValue
  }

  if (typeof templateValue === "number") {
    const parsed = Number(nextValue)
    return Number.isFinite(parsed) ? parsed : currentValue
  }

  if (typeof templateValue === "string") {
    return nextValue === null || nextValue === undefined ? currentValue : String(nextValue)
  }

  if (typeof templateValue === "boolean") {
    return typeof nextValue === "boolean" ? nextValue : Boolean(nextValue)
  }

  if (templateValue && typeof templateValue === "object") {
    return Object.keys(templateValue).reduce((accumulator, key) => {
      accumulator[key] = mergeWithTemplate(currentValue[key], nextValue?.[key], templateValue[key])
      return accumulator
    }, {})
  }

  return currentValue
}

function computePreparation() {
  if (!state.metadata || !state.global.targetColumn) {
    return {
      ready: false,
      message: "Select a binary target column to prepare the dataset.",
      featureMeta: [],
      rows: [],
      splitSummary: [],
      selectedFeatures: [],
    }
  }

  const targetColumn = state.global.targetColumn
  const selectedFeatures = state.steps.preparation.selectedFeatures.filter((feature) =>
    state.metadata.columns.includes(feature)
  )

  const shareConfig = normalizeSampleShares(state.steps.preparation)
  const sampleAssignments = buildSampleAssignments(shareConfig)
  const rows = state.rows.map((row, index) => ({
    ...row,
    __rowIndex: index,
    __target: normalizeTargetValue(row[targetColumn]),
    __sample: sampleAssignments[index],
  }))

  const featureMeta = selectedFeatures.map((featureName) => buildFeatureMeta(featureName, rows)).filter(Boolean)
  const featureMap = new Map(featureMeta.map((feature) => [feature.name, feature]))

  const preparedRows = rows.map((row) => {
    const transformed = {
      source: row,
      rowIndex: row.__rowIndex,
      sample: row.__sample,
      target: row.__target,
      bins: {},
      woe: {},
    }

    featureMeta.forEach((feature) => {
      const preparedValue = applyFeatureTransformation(feature, row[feature.name])
      transformed.bins[feature.name] = preparedValue.bucket
      transformed.woe[feature.name] = preparedValue.woe
    })

    return transformed
  })

  const splitSummary = summarizeSamples(preparedRows)
  const topIvFeatures = featureMeta
    .slice()
    .sort((left, right) => right.iv - left.iv)
    .slice(0, 8)
  const missingSummary = state.metadata.columnStats
    .slice()
    .sort((left, right) => right.missingRate - left.missingRate)
    .slice(0, 8)

  return {
    ready: featureMeta.length > 0,
    message: featureMeta.length ? "" : "Select at least one predictor to prepare the dataset.",
    shareConfig,
    selectedFeatures,
    featureMeta,
    featureMap,
    rows: preparedRows,
    splitSummary,
    topIvFeatures,
    missingSummary,
  }
}

function computeEstimation(preparation) {
  if (!preparation.ready) {
    return {
      ready: false,
      message: preparation.message || "Prepare the data first.",
      finalFeatures: [],
      predictedRows: [],
      scorecardRows: [],
    }
  }

  const selectedModelFeatures = state.steps.estimation.modelFeatures.filter((feature) =>
    preparation.featureMap.has(feature)
  )
  const rankedCandidates = selectedModelFeatures
    .map((feature) => preparation.featureMap.get(feature))
    .filter((feature) => feature.iv >= state.steps.estimation.ivThreshold)
    .sort((left, right) => right.iv - left.iv)

  const finalFeatures = (rankedCandidates.length ? rankedCandidates : preparation.featureMeta.slice().sort((a, b) => b.iv - a.iv)).slice(
    0,
    Math.max(1, Math.round(state.steps.estimation.maxFeatures))
  )

  const estimationRows = preparation.rows.filter((row) => row.sample === "estimation" && row.target !== null)
  const positiveCount = estimationRows.filter((row) => row.target === 1).length
  const negativeCount = estimationRows.filter((row) => row.target === 0).length

  if (!estimationRows.length || !positiveCount || !negativeCount || !finalFeatures.length) {
    return {
      ready: false,
      message: "The estimation sample needs both good and bad observations plus at least one active feature.",
      finalFeatures,
      predictedRows: [],
      scorecardRows: [],
    }
  }

  const designMatrix = estimationRows.map((row) => [1, ...finalFeatures.map((feature) => row.woe[feature.name] ?? 0)])
  const targets = estimationRows.map((row) => row.target)
  const model = fitLogisticRegression(designMatrix, targets, state.steps.estimation.ridge)

  if (!model.beta) {
    return {
      ready: false,
      message: model.error || "The browser-side logistic regression did not converge.",
      finalFeatures,
      predictedRows: [],
      scorecardRows: [],
    }
  }

  const predictedRows = preparation.rows.map((row) => {
    const logitValue =
      model.beta[0] +
      finalFeatures.reduce((sum, feature, featureIndex) => sum + (row.woe[feature.name] ?? 0) * model.beta[featureIndex + 1], 0)
    const predictedPd = sigmoid(logitValue)
    const score = Math.round(state.steps.estimation.scoreOffset + state.steps.estimation.scoreFactor * logitValue)
    return {
      ...row,
      logit: logitValue,
      predictedPd,
      score,
      rating: assignRating(predictedPd),
    }
  })

  const estimationPredictions = predictedRows.filter((row) => row.sample === "estimation" && row.target !== null)
  const estimationMetrics = computePerformanceMetrics(
    estimationPredictions.map((row) => row.target),
    estimationPredictions.map((row) => row.predictedPd)
  )

  const scorecardRows = buildScorecardRows(finalFeatures, model.beta)
  const coefficientRows = [
    { feature: "(Intercept)", coefficient: model.beta[0], iv: null },
    ...finalFeatures.map((feature, featureIndex) => ({
      feature: feature.name,
      coefficient: model.beta[featureIndex + 1],
      iv: feature.iv,
    })),
  ]

  return {
    ready: true,
    message: "",
    model,
    finalFeatures,
    predictedRows,
    estimationMetrics,
    coefficientRows,
    scorecardRows,
    averagePd: mean(estimationPredictions.map((row) => row.predictedPd)),
    averageScore: mean(estimationPredictions.map((row) => row.score)),
    ratingDistribution: computeRatingDistribution(estimationPredictions, "rating"),
    rowsBySample: summarizeSamples(predictedRows),
  }
}

function computeValidation(estimation) {
  if (!estimation.ready) {
    return {
      ready: false,
      message: estimation.message || "Estimate the model first.",
    }
  }

  const estimationRows = estimation.predictedRows.filter((row) => row.sample === "estimation" && row.target !== null)
  const validationRows = estimation.predictedRows.filter((row) => row.sample === "validation" && row.target !== null)

  if (!validationRows.length) {
    return {
      ready: false,
      message: "Allocate a validation sample in Data preparation to run validation.",
    }
  }

  const estimationMetrics = computePerformanceMetrics(
    estimationRows.map((row) => row.target),
    estimationRows.map((row) => row.predictedPd)
  )
  const validationMetrics = computePerformanceMetrics(
    validationRows.map((row) => row.target),
    validationRows.map((row) => row.predictedPd)
  )
  const distributionEstimation = computeRatingDistribution(estimationRows, "rating")
  const distributionValidation = computeRatingDistribution(validationRows, "rating")
  const ssi = computeStabilityIndex(
    distributionEstimation,
    distributionValidation,
    state.steps.validation.ssiSmoothing
  )
  const confusion = computeConfusionMatrix(validationRows, state.steps.validation.classificationThreshold)

  return {
    ready: true,
    message: "",
    estimationMetrics,
    validationMetrics,
    distributionEstimation,
    distributionValidation,
    ssi,
    confusion,
  }
}

function computeMonitoring(estimation) {
  if (!estimation.ready) {
    return {
      ready: false,
      message: estimation.message || "Estimate the model first.",
    }
  }

  const sourceSample = state.steps.monitoring.sampleSource
  const estimationRows = estimation.predictedRows.filter((row) => row.sample === "estimation" && row.target !== null)
  const monitoringRows = estimation.predictedRows.filter((row) => row.sample === sourceSample && row.target !== null)

  if (!monitoringRows.length) {
    return {
      ready: false,
      message: "Monitoring needs a populated monitoring or calibration sample.",
    }
  }

  const estimationMetrics = computePerformanceMetrics(
    estimationRows.map((row) => row.target),
    estimationRows.map((row) => row.predictedPd)
  )
  const monitoringMetrics = computePerformanceMetrics(
    monitoringRows.map((row) => row.target),
    monitoringRows.map((row) => row.predictedPd)
  )
  const distributionEstimation = computeRatingDistribution(estimationRows, "rating")
  const distributionMonitoring = computeRatingDistribution(monitoringRows, "rating")
  const ssi = computeStabilityIndex(
    distributionEstimation,
    distributionMonitoring,
    state.steps.validation.ssiSmoothing
  )
  const defaultRate = mean(monitoringRows.map((row) => row.target))
  const meanPredictedPd = mean(monitoringRows.map((row) => row.predictedPd))
  const drPdFactor = meanPredictedPd ? defaultRate / meanPredictedPd : null
  const byRating = summarizePredictedVsObservedByRating(monitoringRows, "rating", "predictedPd")

  return {
    ready: true,
    message: "",
    sourceSample,
    estimationMetrics,
    monitoringMetrics,
    distributionEstimation,
    distributionMonitoring,
    ssi,
    defaultRate,
    meanPredictedPd,
    drPdFactor,
    byRating,
  }
}

function computeCalibration(estimation) {
  if (!estimation.ready) {
    return {
      ready: false,
      message: estimation.message || "Estimate the model first.",
      calibratedRows: [],
    }
  }

  const sourceSample = state.steps.calibration.sampleSource
  const sourceRows = estimation.predictedRows.filter((row) => row.sample === sourceSample && row.target !== null)
  if (!sourceRows.length) {
    return {
      ready: false,
      message: "Calibration needs a monitoring or calibration sample with observed outcomes.",
      calibratedRows: [],
    }
  }

  const observedAnchor = mean(sourceRows.map((row) => row.target))
  const anchorRate =
    state.steps.calibration.anchorSource === "manual" ? state.steps.calibration.manualAnchorRate : observedAnchor
  const averagePredictedPd = mean(sourceRows.map((row) => row.predictedPd))

  if (!Number.isFinite(anchorRate) || !Number.isFinite(averagePredictedPd)) {
    return {
      ready: false,
      message: "Calibration needs valid predicted PDs and a valid anchor point.",
      calibratedRows: [],
    }
  }

  const shift = logit(clamp(anchorRate, 0.0001, 0.999)) - logit(clamp(averagePredictedPd, 0.0001, 0.999))
  const calibratedRows = estimation.predictedRows.map((row) => {
    const calibratedPd = sigmoid(logit(clamp(row.predictedPd, 0.000001, 0.999999)) + shift)
    return {
      ...row,
      calibratedPd,
      calibratedRating: assignRating(calibratedPd),
    }
  })

  const calibrationRows = calibratedRows.filter((row) => row.sample === sourceSample && row.target !== null)
  const migrationMatrix = buildMigrationMatrix(calibrationRows, "rating", "calibratedRating")
  const linePoints = buildCalibrationCurve(calibrationRows)
  const averageCalibratedPd = mean(calibrationRows.map((row) => row.calibratedPd))

  return {
    ready: true,
    message: "",
    sourceSample,
    anchorRate,
    observedAnchor,
    averagePredictedPd,
    averageCalibratedPd,
    shift,
    calibratedRows,
    migrationMatrix,
    linePoints,
  }
}

function computeBasel3(estimation, calibration) {
  const rows = calibration.ready ? calibration.calibratedRows : estimation.predictedRows
  if (!rows.length) {
    return {
      ready: false,
      message: "Estimate the model first so that the portfolio has PDs.",
      portfolioRows: [],
    }
  }

  const sampleRows = filterRowsBySample(rows, state.steps.basel3.sampleSource)
  if (!sampleRows.length) {
    return {
      ready: false,
      message: "Choose a sample with observations for Basel III.",
      portfolioRows: [],
    }
  }

  const portfolioRows = sampleRows
    .map((row) => {
      const exposure = resolveNumericParameter(row.source, state.global.exposureColumn, state.steps.basel3.exposureMode, state.steps.basel3.constantExposure)
      const lgdPercent = resolvePercentParameter(row.source, state.global.lgdColumn, state.steps.basel3.lgdMode, state.steps.basel3.constantLgd)
      const maturity = resolveNumericParameter(row.source, state.global.maturityColumn, state.steps.basel3.maturityMode, state.steps.basel3.constantMaturity)
      const pd = state.steps.basel3.pdSource === "calibrated" && row.calibratedPd ? row.calibratedPd : row.predictedPd

      if (!Number.isFinite(exposure) || !Number.isFinite(lgdPercent) || !Number.isFinite(maturity) || !Number.isFinite(pd)) {
        return null
      }

      const rwa = calculateBasel3Rwa(exposure, pd, lgdPercent / 100, maturity)
      return {
        ...row,
        exposure,
        lgdPercent,
        maturity,
        capitalRequirement: rwa / 12.5,
        rwa,
      }
    })
    .filter(Boolean)

  if (!portfolioRows.length) {
    return {
      ready: false,
      message: "Basel III needs valid exposure, LGD, maturity, and PD inputs.",
      portfolioRows: [],
    }
  }

  const totalExposure = sum(portfolioRows.map((row) => row.exposure))
  const totalRwa = sum(portfolioRows.map((row) => row.rwa))
  const averageRiskWeight = totalExposure ? totalRwa / totalExposure : null
  const averageCapitalRequirement = totalExposure
    ? sum(portfolioRows.map((row) => row.capitalRequirement)) / totalExposure
    : null
  const byRating = summarizeExposureByRating(portfolioRows, "rating", "rwa")

  return {
    ready: true,
    message: "",
    portfolioRows,
    totalExposure,
    totalRwa,
    averageRiskWeight,
    averageCapitalRequirement,
    byRating,
  }
}

function computeBasel4(estimation, calibration) {
  const rows = calibration.ready ? calibration.calibratedRows : estimation.predictedRows
  if (!rows.length) {
    return {
      ready: false,
      message: "Estimate the model first so that the portfolio has PDs.",
      portfolioRows: [],
    }
  }

  const sampleRows = filterRowsBySample(rows, state.steps.basel4.sampleSource)
  if (!sampleRows.length) {
    return {
      ready: false,
      message: "Choose a sample with observations for Basel IV.",
      portfolioRows: [],
    }
  }

  const portfolioRows = sampleRows
    .map((row) => {
      const exposure = resolveNumericParameter(row.source, state.global.exposureColumn, state.steps.basel4.exposureMode, state.steps.basel4.constantExposure)
      const rawLgd = resolvePercentParameter(row.source, state.global.lgdColumn, state.steps.basel4.lgdMode, state.steps.basel4.constantLgd)
      const maturity = resolveNumericParameter(row.source, state.global.maturityColumn, state.steps.basel4.maturityMode, state.steps.basel4.constantMaturity)
      const ltv = resolvePercentParameter(row.source, state.global.ltvColumn, state.steps.basel4.ltvMode, state.steps.basel4.constantLtv)
      const exposureClass = inferExposureClass(row.source[state.global.exposureTypeColumn], state.steps.basel4.defaultExposureClass)
      const regulatoryLgdFloor = lookupRegulatoryLgdFloor(exposureClass)
      const standardizedRiskWeight = lookupStandardizedRiskWeight(exposureClass, ltv / 100)
      const basePd = state.steps.basel4.pdSource === "calibrated" && row.calibratedPd ? row.calibratedPd : row.predictedPd
      const pdFloor = state.steps.basel4.pdFloorBps / 10000
      const flooredPd = Math.max(basePd, pdFloor)
      const flooredLgd = Math.max(rawLgd / 100, regulatoryLgdFloor)

      if (
        !Number.isFinite(exposure) ||
        !Number.isFinite(rawLgd) ||
        !Number.isFinite(maturity) ||
        !Number.isFinite(ltv) ||
        !Number.isFinite(basePd)
      ) {
        return null
      }

      const irbRwa = calculateBasel3Rwa(exposure, flooredPd, flooredLgd, maturity)
      const standardizedRwa = exposure * standardizedRiskWeight

      return {
        ...row,
        exposure,
        rawLgd,
        maturity,
        ltv,
        exposureClass,
        flooredPd,
        flooredLgd,
        irbRwa,
        standardizedRwa,
      }
    })
    .filter(Boolean)

  if (!portfolioRows.length) {
    return {
      ready: false,
      message: "Basel IV needs exposure, LTV, LGD, maturity, and PD inputs.",
      portfolioRows: [],
    }
  }

  const irbRwa = sum(portfolioRows.map((row) => row.irbRwa))
  const standardizedRwa = sum(portfolioRows.map((row) => row.standardizedRwa))
  const finalRwa = Math.max(irbRwa, (state.steps.basel4.outputFloor / 100) * standardizedRwa)
  const floorGap = finalRwa - irbRwa
  const byClass = summarizeExposureByClass(portfolioRows)

  return {
    ready: true,
    message: "",
    portfolioRows,
    irbRwa,
    standardizedRwa,
    finalRwa,
    floorGap,
    byClass,
  }
}

function parseDelimitedText(text) {
  const normalized = text.replace(/\uFEFF/g, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n")
  const delimiter = detectDelimiter(normalized)
  const parsedRows = []
  let currentField = ""
  let currentRow = []
  let inQuotes = false

  for (let index = 0; index < normalized.length; index += 1) {
    const character = normalized[index]
    const nextCharacter = normalized[index + 1]

    if (character === '"') {
      if (inQuotes && nextCharacter === '"') {
        currentField += '"'
        index += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (character === delimiter && !inQuotes) {
      currentRow.push(currentField)
      currentField = ""
      continue
    }

    if (character === "\n" && !inQuotes) {
      currentRow.push(currentField)
      if (currentRow.some((field) => field.trim() !== "")) {
        parsedRows.push(currentRow)
      }
      currentField = ""
      currentRow = []
      continue
    }

    currentField += character
  }

  if (currentField.length || currentRow.length) {
    currentRow.push(currentField)
    if (currentRow.some((field) => field.trim() !== "")) {
      parsedRows.push(currentRow)
    }
  }

  if (parsedRows.length < 2) {
    throw new Error("The file does not contain a header row plus data.")
  }

  const columns = deduplicateHeaders(parsedRows[0].map((header, index) => normalizeHeader(header) || `Column_${index + 1}`))
  const rows = parsedRows.slice(1).map((rawRow) =>
    columns.reduce((accumulator, column, columnIndex) => {
      accumulator[column] = (rawRow[columnIndex] ?? "").trim()
      return accumulator
    }, {})
  )

  return { columns, rows }
}

function detectDelimiter(text) {
  const sampleLines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 5)
  const candidates = [",", ";", "\t", "|"]
  const scores = candidates.map((candidate) => ({
    candidate,
    score: sampleLines.reduce((sum, line) => sum + countOccurrences(line, candidate), 0),
  }))
  return scores.sort((left, right) => right.score - left.score)[0]?.candidate || ","
}

function analyzeDataset(rows, columns) {
  const columnStats = columns.map((column) => analyzeColumn(column, rows))
  const columnMap = Object.fromEntries(columnStats.map((columnStat) => [columnStat.name, columnStat]))
  return {
    rows,
    columns,
    columnStats,
    columnMap,
  }
}

function analyzeColumn(columnName, rows) {
  const rawValues = rows.map((row) => row[columnName])
  const nonEmptyValues = rawValues.filter((value) => normalizeCell(value) !== "")
  const numericValues = nonEmptyValues.map(parseLooseNumber).filter((value) => Number.isFinite(value))
  const dateValues = nonEmptyValues.map(parseLooseDate).filter((value) => value !== null)
  const distinctValues = new Set(nonEmptyValues.map((value) => normalizeCell(value))).size
  const numericShare = nonEmptyValues.length ? numericValues.length / nonEmptyValues.length : 0
  const dateShare = nonEmptyValues.length ? dateValues.length / nonEmptyValues.length : 0
  const missingRate = rawValues.length ? 1 - nonEmptyValues.length / rawValues.length : 0
  const type =
    looksBinary(nonEmptyValues) ? "binary" : dateShare > 0.7 ? "date" : numericShare > 0.8 ? "numeric" : "categorical"

  return {
    name: columnName,
    type,
    missingRate,
    distinctValues,
  }
}

function buildSampleAssignments(shareConfig) {
  const indexedRows = state.rows.map((row, index) => ({
    row,
    index,
    sortKey: deriveSampleSortKey(row, index),
  }))

  indexedRows.sort((left, right) => left.sortKey - right.sortKey)
  const total = indexedRows.length
  const counts = {
    estimation: Math.floor(total * shareConfig.estimation),
    validation: Math.floor(total * shareConfig.validation),
    monitoring: Math.floor(total * shareConfig.monitoring),
  }
  counts.calibration = Math.max(0, total - counts.estimation - counts.validation - counts.monitoring)

  const assignments = Array(total).fill("calibration")
  let cursor = 0
  for (let index = 0; index < counts.estimation; index += 1, cursor += 1) {
    assignments[indexedRows[cursor].index] = "estimation"
  }
  for (let index = 0; index < counts.validation && cursor < total; index += 1, cursor += 1) {
    assignments[indexedRows[cursor].index] = "validation"
  }
  for (let index = 0; index < counts.monitoring && cursor < total; index += 1, cursor += 1) {
    assignments[indexedRows[cursor].index] = "monitoring"
  }
  while (cursor < total) {
    assignments[indexedRows[cursor].index] = "calibration"
    cursor += 1
  }
  return assignments
}

function deriveSampleSortKey(row, index) {
  const dateColumn = state.global.dateColumn
  const idColumn = state.global.idColumn
  const parsedDate = dateColumn ? parseLooseDate(row[dateColumn]) : null
  if (parsedDate !== null) {
    return parsedDate
  }

  const stableId = idColumn && row[idColumn] ? String(row[idColumn]) : JSON.stringify(row)
  return stableHash(stableId) + index / 1000
}

function normalizeSampleShares(config) {
  const rawShares = {
    estimation: Math.max(0, Number(config.trainShare) || 0),
    validation: Math.max(0, Number(config.validationShare) || 0),
    monitoring: Math.max(0, Number(config.monitoringShare) || 0),
    calibration: Math.max(0, Number(config.calibrationShare) || 0),
  }
  const total = Object.values(rawShares).reduce((sum, value) => sum + value, 0) || 100

  return {
    estimation: rawShares.estimation / total,
    validation: rawShares.validation / total,
    monitoring: rawShares.monitoring / total,
    calibration: rawShares.calibration / total,
  }
}

function buildFeatureMeta(featureName, rows) {
  const columnStat = state.metadata.columnMap[featureName]
  if (!columnStat) {
    return null
  }

  const targetRows = rows.filter((row) => row.__target !== null)
  if (!targetRows.length) {
    return null
  }

  const nonMissingValues = targetRows.map((row) => row[featureName]).filter((value) => normalizeCell(value) !== "")
  const numericValues = nonMissingValues.map(parseLooseNumber).filter((value) => Number.isFinite(value))
  const isNumeric = columnStat.type === "numeric" && numericValues.length > 1
  const missingStrategy = state.steps.preparation.missingStrategy
  const defaultBucket = missingStrategy === "separate_bucket" ? "Missing" : getMode(nonMissingValues) || "Missing"
  const medianValue = numericValues.length ? median(numericValues) : 0
  const quantileEdges = isNumeric ? buildQuantileEdges(numericValues, state.steps.preparation.binCount) : []

  const grouped = new Map()

  targetRows.forEach((row) => {
    const transformed = transformValueForFeature(row[featureName], isNumeric, quantileEdges, defaultBucket, medianValue, missingStrategy)
    if (!grouped.has(transformed.bucket)) {
      grouped.set(transformed.bucket, { bucket: transformed.bucket, good: 0, bad: 0 })
    }
    const bucketStats = grouped.get(transformed.bucket)
    if (row.__target === 1) {
      bucketStats.bad += 1
    } else {
      bucketStats.good += 1
    }
  })

  const totalGood = sum(Array.from(grouped.values()).map((value) => value.good))
  const totalBad = sum(Array.from(grouped.values()).map((value) => value.bad))
  const bucketStats = Array.from(grouped.values()).map((value) => {
    const goodShare = (value.good + 1e-5) / (totalGood + 1e-5)
    const badShare = (value.bad + 1e-5) / (totalBad + 1e-5)
    const woe = -Math.log(badShare / goodShare)
    const ivContribution = (goodShare - badShare) * woe
    return {
      ...value,
      goodShare,
      badShare,
      woe,
      ivContribution,
      badRate: value.bad / Math.max(value.good + value.bad, 1),
    }
  })

  const bucketMap = new Map(bucketStats.map((bucket) => [bucket.bucket, bucket]))
  const iv = sum(bucketStats.map((bucket) => bucket.ivContribution))

  return {
    name: featureName,
    type: isNumeric ? "numeric" : "categorical",
    iv,
    bucketStats,
    bucketMap,
    defaultBucket,
    quantileEdges,
    medianValue,
    missingStrategy,
  }
}

function transformValueForFeature(rawValue, isNumeric, quantileEdges, defaultBucket, medianValue, missingStrategy) {
  const normalizedValue = normalizeCell(rawValue)
  if (normalizedValue === "") {
    if (missingStrategy === "separate_bucket") {
      return { bucket: "Missing" }
    }
    if (isNumeric) {
      return { bucket: bucketizeNumericValue(medianValue, quantileEdges) }
    }
    return { bucket: defaultBucket }
  }

  if (isNumeric) {
    const numericValue = parseLooseNumber(normalizedValue)
    return { bucket: bucketizeNumericValue(Number.isFinite(numericValue) ? numericValue : medianValue, quantileEdges) }
  }

  return { bucket: normalizedValue }
}

function applyFeatureTransformation(feature, rawValue) {
  const transformed = transformValueForFeature(
    rawValue,
    feature.type === "numeric",
    feature.quantileEdges,
    feature.defaultBucket,
    feature.medianValue,
    feature.missingStrategy
  )
  return {
    bucket: transformed.bucket,
    woe: feature.bucketMap.get(transformed.bucket)?.woe ?? 0,
  }
}

function buildQuantileEdges(values, binCount) {
  const sorted = values.slice().sort((left, right) => left - right)
  const edges = []
  for (let bucketIndex = 0; bucketIndex <= binCount; bucketIndex += 1) {
    edges.push(quantile(sorted, bucketIndex / binCount))
  }
  return Array.from(new Set(edges.map((edge) => Number(edge.toFixed(6))))).sort((left, right) => left - right)
}

function bucketizeNumericValue(value, edges) {
  if (!edges.length) {
    return "All values"
  }
  for (let edgeIndex = 0; edgeIndex < edges.length - 1; edgeIndex += 1) {
    const lower = edges[edgeIndex]
    const upper = edges[edgeIndex + 1]
    const isLastEdge = edgeIndex === edges.length - 2
    if (value >= lower && (value < upper || isLastEdge)) {
      return `[${formatDecimal(lower, 2)}, ${formatDecimal(upper, 2)}${isLastEdge ? "]" : ")" }`
    }
  }
  return `>= ${formatDecimal(edges[edges.length - 1], 2)}`
}

function fitLogisticRegression(matrix, targets, ridge) {
  const columnCount = matrix[0].length
  let beta = Array(columnCount).fill(0)
  let converged = false

  for (let iteration = 0; iteration < 35; iteration += 1) {
    const linearPredictor = matrix.map((row) => dot(row, beta))
    const probabilities = linearPredictor.map((value) => clamp(sigmoid(value), 0.000001, 0.999999))
    const weights = probabilities.map((value) => Math.max(value * (1 - value), 0.000001))
    const workingResponse = linearPredictor.map((value, index) => value + (targets[index] - probabilities[index]) / weights[index])
    const leftHandSide = Array.from({ length: columnCount }, () => Array(columnCount).fill(0))
    const rightHandSide = Array(columnCount).fill(0)

    for (let rowIndex = 0; rowIndex < matrix.length; rowIndex += 1) {
      const row = matrix[rowIndex]
      const weight = weights[rowIndex]
      for (let leftIndex = 0; leftIndex < columnCount; leftIndex += 1) {
        rightHandSide[leftIndex] += row[leftIndex] * weight * workingResponse[rowIndex]
        for (let rightIndex = 0; rightIndex < columnCount; rightIndex += 1) {
          leftHandSide[leftIndex][rightIndex] += row[leftIndex] * weight * row[rightIndex]
        }
      }
    }

    for (let diagonalIndex = 1; diagonalIndex < columnCount; diagonalIndex += 1) {
      leftHandSide[diagonalIndex][diagonalIndex] += ridge
    }
    leftHandSide[0][0] += 1e-9

    const nextBeta = solveLinearSystem(leftHandSide, rightHandSide)
    if (!nextBeta) {
      return { error: "The coefficient matrix became singular." }
    }

    const maxShift = Math.max(...nextBeta.map((coefficient, coefficientIndex) => Math.abs(coefficient - beta[coefficientIndex])))
    beta = nextBeta
    if (maxShift < 0.000001) {
      converged = true
      break
    }
  }

  return { beta, converged }
}

function solveLinearSystem(matrix, vector) {
  const size = matrix.length
  const augmented = matrix.map((row, rowIndex) => [...row, vector[rowIndex]])

  for (let column = 0; column < size; column += 1) {
    let pivotRow = column
    let pivotValue = Math.abs(augmented[column][column])

    for (let row = column + 1; row < size; row += 1) {
      const candidate = Math.abs(augmented[row][column])
      if (candidate > pivotValue) {
        pivotValue = candidate
        pivotRow = row
      }
    }

    if (pivotValue < 1e-12) {
      return null
    }

    if (pivotRow !== column) {
      const temporary = augmented[column]
      augmented[column] = augmented[pivotRow]
      augmented[pivotRow] = temporary
    }

    const pivot = augmented[column][column]
    for (let currentColumn = column; currentColumn <= size; currentColumn += 1) {
      augmented[column][currentColumn] /= pivot
    }

    for (let row = 0; row < size; row += 1) {
      if (row === column) {
        continue
      }
      const factor = augmented[row][column]
      for (let currentColumn = column; currentColumn <= size; currentColumn += 1) {
        augmented[row][currentColumn] -= factor * augmented[column][currentColumn]
      }
    }
  }

  return augmented.map((row) => row[size])
}

function buildScorecardRows(finalFeatures, beta) {
  if (!finalFeatures.length) {
    return []
  }

  return finalFeatures.flatMap((feature, featureIndex) => {
    const coefficient = beta[featureIndex + 1]
    return feature.bucketStats.map((bucket) => ({
      feature: feature.name,
      bucket: bucket.bucket,
      woe: bucket.woe,
      score: Math.floor(
        (bucket.woe * coefficient + beta[0] / finalFeatures.length) * state.steps.estimation.scoreFactor +
          state.steps.estimation.scoreOffset / finalFeatures.length
      ),
    }))
  })
}

function computePerformanceMetrics(targets, scores) {
  const auc = calculateAuc(targets, scores)
  const ar = auc === null ? null : 2 * auc - 1
  const ks = calculateKs(targets, scores)
  return { auc, ar, ks }
}

function calculateAuc(targets, scores) {
  const pairs = scores
    .map((score, index) => ({ score, target: targets[index] }))
    .filter((pair) => pair.target !== null && Number.isFinite(pair.score))

  const positives = pairs.filter((pair) => pair.target === 1).length
  const negatives = pairs.filter((pair) => pair.target === 0).length
  if (!positives || !negatives) {
    return null
  }

  pairs.sort((left, right) => left.score - right.score)
  let rankSum = 0
  for (let index = 0; index < pairs.length; ) {
    let tieEnd = index + 1
    while (tieEnd < pairs.length && pairs[tieEnd].score === pairs[index].score) {
      tieEnd += 1
    }
    const averageRank = (index + 1 + tieEnd) / 2
    for (let tieIndex = index; tieIndex < tieEnd; tieIndex += 1) {
      if (pairs[tieIndex].target === 1) {
        rankSum += averageRank
      }
    }
    index = tieEnd
  }

  return (rankSum - (positives * (positives + 1)) / 2) / (positives * negatives)
}

function calculateKs(targets, scores) {
  const pairs = scores
    .map((score, index) => ({ score, target: targets[index] }))
    .filter((pair) => pair.target !== null && Number.isFinite(pair.score))
    .sort((left, right) => right.score - left.score)

  const positives = pairs.filter((pair) => pair.target === 1).length
  const negatives = pairs.filter((pair) => pair.target === 0).length
  if (!positives || !negatives) {
    return null
  }

  let cumulativePositive = 0
  let cumulativeNegative = 0
  let maxDifference = 0

  pairs.forEach((pair) => {
    if (pair.target === 1) {
      cumulativePositive += 1 / positives
    } else {
      cumulativeNegative += 1 / negatives
    }
    maxDifference = Math.max(maxDifference, Math.abs(cumulativePositive - cumulativeNegative))
  })

  return maxDifference
}

function computeRatingDistribution(rows, key) {
  const distribution = Object.fromEntries(RATING_MASTER_SCALE.map((item) => [item.rating, 0]))
  if (!rows.length) {
    return distribution
  }
  rows.forEach((row) => {
    distribution[row[key]] = (distribution[row[key]] || 0) + 1 / rows.length
  })
  return distribution
}

function computeStabilityIndex(firstDistribution, secondDistribution, smoothing) {
  return RATING_MASTER_SCALE.reduce((sum, ratingStep) => {
    const first = (firstDistribution[ratingStep.rating] ?? 0) + smoothing
    const second = (secondDistribution[ratingStep.rating] ?? 0) + smoothing
    return sum + (first - second) * Math.log(first / second)
  }, 0)
}

function computeConfusionMatrix(rows, threshold) {
  return rows.reduce(
    (accumulator, row) => {
      const predicted = row.predictedPd >= threshold ? 1 : 0
      if (predicted === 1 && row.target === 1) accumulator.truePositive += 1
      if (predicted === 1 && row.target === 0) accumulator.falsePositive += 1
      if (predicted === 0 && row.target === 0) accumulator.trueNegative += 1
      if (predicted === 0 && row.target === 1) accumulator.falseNegative += 1
      return accumulator
    },
    { truePositive: 0, falsePositive: 0, trueNegative: 0, falseNegative: 0 }
  )
}

function summarizePredictedVsObservedByRating(rows, ratingKey, pdKey) {
  return RATING_MASTER_SCALE.map((ratingStep) => {
    const ratingRows = rows.filter((row) => row[ratingKey] === ratingStep.rating)
    return {
      rating: ratingStep.rating,
      count: ratingRows.length,
      predictedPd: ratingRows.length ? mean(ratingRows.map((row) => row[pdKey])) : 0,
      observedRate: ratingRows.length ? mean(ratingRows.map((row) => row.target)) : 0,
    }
  })
}

function buildMigrationMatrix(rows, fromKey, toKey) {
  const matrix = Object.fromEntries(
    RATING_MASTER_SCALE.map((fromStep) => [
      fromStep.rating,
      Object.fromEntries(RATING_MASTER_SCALE.map((toStep) => [toStep.rating, 0])),
    ])
  )
  rows.forEach((row) => {
    if (matrix[row[fromKey]]?.[row[toKey]] !== undefined) {
      matrix[row[fromKey]][row[toKey]] += 1
    }
  })
  return matrix
}

function buildCalibrationCurve(rows) {
  const sorted = rows.slice().sort((left, right) => left.score - right.score)
  const bands = []
  const bucketCount = Math.min(6, Math.max(2, Math.floor(sorted.length / 10)))
  const bucketSize = Math.max(1, Math.floor(sorted.length / bucketCount))

  for (let start = 0; start < sorted.length; start += bucketSize) {
    const bucketRows = sorted.slice(start, start + bucketSize)
    if (!bucketRows.length) {
      continue
    }
    bands.push({
      label: `B${bands.length + 1}`,
      predictedPd: mean(bucketRows.map((row) => row.predictedPd)),
      calibratedPd: mean(bucketRows.map((row) => row.calibratedPd)),
    })
  }

  return bands
}

function summarizeExposureByRating(rows, ratingKey, rwaKey) {
  return RATING_MASTER_SCALE.map((ratingStep) => {
    const ratingRows = rows.filter((row) => row[ratingKey] === ratingStep.rating)
    return {
      rating: ratingStep.rating,
      exposure: sum(ratingRows.map((row) => row.exposure)),
      rwa: sum(ratingRows.map((row) => row[rwaKey])),
    }
  })
}

function summarizeExposureByClass(rows) {
  const grouped = new Map()
  rows.forEach((row) => {
    if (!grouped.has(row.exposureClass)) {
      grouped.set(row.exposureClass, {
        exposureClass: row.exposureClass,
        count: 0,
        exposure: 0,
        standardizedRwa: 0,
        irbRwa: 0,
      })
    }
    const bucket = grouped.get(row.exposureClass)
    bucket.count += 1
    bucket.exposure += row.exposure
    bucket.standardizedRwa += row.standardizedRwa
    bucket.irbRwa += row.irbRwa
  })
  return Array.from(grouped.values())
}

function calculateBasel3Rwa(exposure, pd, lgd, maturity) {
  const safePd = clamp(pd, 0.000001, 0.999)
  const rho =
    0.12 * (1 - Math.exp(-50 * safePd)) / (1 - Math.exp(-50)) +
    0.24 * (1 - (1 - Math.exp(-50 * safePd)) / (1 - Math.exp(-50)))
  const b = Math.pow(0.11852 - 0.05478 * Math.log(safePd), 2)
  const capitalRequirement =
    (lgd *
      normalCdf(Math.pow(1 - rho, -0.5) * normalInv(safePd) + Math.sqrt(rho / (1 - rho)) * normalInv(0.999)) -
      safePd * lgd) *
    Math.pow(1 - 1.5 * b, -1) *
    (1 + (maturity - 2.5) * b)
  return Math.max(capitalRequirement, 0) * 12.5 * exposure
}

function lookupRegulatoryLgdFloor(exposureClass) {
  if (exposureClass === "Commercial Income Producing Real Estate") {
    return state.steps.basel4.cipreLgdFloor / 100
  }
  if (exposureClass === "Private Income Producing Real Estate") {
    return state.steps.basel4.pipreLgdFloor / 100
  }
  return state.steps.basel4.prreLgdFloor / 100
}

function lookupStandardizedRiskWeight(exposureClass, ltv) {
  if (exposureClass === "Commercial Income Producing Real Estate") {
    return ltv <= 0.6 ? 0.6 : 1
  }
  if (exposureClass === "Private Income Producing Real Estate") {
    return ltv <= 0.6 ? 0.5 : 0.9
  }
  return ltv <= 0.8 ? 0.2 : 0.7
}

function resolveNumericParameter(row, columnName, mode, fallbackValue) {
  if (mode === "column" && columnName) {
    const parsed = parseLooseNumber(row[columnName])
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }
  return Number(fallbackValue)
}

function resolvePercentParameter(row, columnName, mode, fallbackValue) {
  if (mode === "column" && columnName) {
    const parsed = parseLooseNumber(row[columnName])
    if (Number.isFinite(parsed)) {
      return parsed <= 1 ? parsed * 100 : parsed
    }
  }
  return Number(fallbackValue)
}

function inferExposureClass(rawValue, fallbackValue) {
  const normalized = String(rawValue || "").toLowerCase()
  if (normalized.includes("commercial")) {
    return "Commercial Income Producing Real Estate"
  }
  if (normalized.includes("income producing") && normalized.includes("private")) {
    return "Private Income Producing Real Estate"
  }
  if (normalized.includes("residential")) {
    return "Private Residential"
  }
  return fallbackValue
}

function filterRowsBySample(rows, sampleSource) {
  if (sampleSource === "all") {
    return rows
  }
  return rows.filter((row) => row.sample === sampleSource)
}

function summarizeSamples(rows) {
  return ["estimation", "validation", "monitoring", "calibration"].map((sampleKey) => {
    const sampleRows = rows.filter((row) => row.sample === sampleKey)
    return {
      sample: sampleKey,
      sampleLabel: capitalize(sampleKey),
      count: sampleRows.length,
      defaultRate: sampleRows.length && sampleRows.every((row) => row.target !== null) ? mean(sampleRows.map((row) => row.target)) : null,
    }
  })
}

function deriveValidationVerdict(validation) {
  if (validation.validationMetrics.ar !== null && validation.estimationMetrics.ar !== null) {
    const arDrop = validation.estimationMetrics.ar - validation.validationMetrics.ar
    if (arDrop > 0.1 || validation.ssi > 0.1) {
      return "Validation indicates material performance drift."
    }
  }
  return "Validation remains broadly aligned with the development sample."
}

function deriveMonitoringVerdict(monitoring) {
  if ((monitoring.drPdFactor ?? 0) > state.steps.monitoring.defaultPdAlert || monitoring.ssi > state.steps.monitoring.driftThreshold) {
    return "Monitoring flags a drift or calibration alert."
  }
  return "Monitoring remains within the configured tolerance."
}

function getEligibleFeatures() {
  if (!state.metadata) {
    return []
  }

  const excluded = new Set(Object.values(state.global).filter(Boolean))

  return state.metadata.columnStats
    .filter((columnStat) => !excluded.has(columnStat.name))
    .filter((columnStat) => columnStat.distinctValues > 1)
    .filter((columnStat) => !(columnStat.type === "categorical" && columnStat.distinctValues > 50))
    .map((columnStat) => columnStat.name)
}

function getStepDefinition(stepKey) {
  return STEP_DEFINITIONS.find((stepDefinition) => stepDefinition.key === stepKey)
}

function buildDemoDataset() {
  const random = mulberry32(42)
  const mortgageTypes = [
    "Private Residential",
    "Commercial Income Producing Real Estate",
    "Private Income Producing Real Estate",
  ]
  const maritalStatuses = ["Single", "Married", "Divorced", "Widowed"]
  const swissCantons = ["ZH", "BE", "LU", "ZG", "VD", "GE", "AG", "TI", "SG", "BS"]
  const rows = []

  for (let index = 0; index < 520; index += 1) {
    const mortgageType = pick(random, mortgageTypes, [0.55, 0.2, 0.25])
    const income = Math.round(45000 + random() * 180000)
    const loanToValue = clamp(0.35 + random() * 0.65, 0.35, 0.98)
    const delinquency = pick(random, [0, 15, 45, 120], [0.7, 0.18, 0.08, 0.04])
    const maritalStatus = pick(random, maritalStatuses, [0.3, 0.5, 0.12, 0.08])
    const swissCanton = pick(random, swissCantons)
    const exposure = Math.round(70000 + random() * 530000)
    const month = String((index % 12) + 1).padStart(2, "0")
    const year = 2022 + Math.floor(index / 130)
    const observationDate = `${year}-${month}-01`
    const incomeBucket = income >= 120000 ? "Over 120k" : income >= 80000 ? "80-120k" : "50-80k"
    const ltvBucket = loanToValue <= 0.5 ? "smaller than 50%" : "over 50%"

    const logitScore =
      -3.9 +
      (mortgageType === "Private Residential" ? -0.4 : mortgageType === "Commercial Income Producing Real Estate" ? 0.2 : 0.1) +
      (incomeBucket === "Over 120k" ? -0.5 : incomeBucket === "80-120k" ? -0.15 : 0.35) +
      (loanToValue > 0.8 ? 0.9 : loanToValue > 0.6 ? 0.4 : -0.15) +
      (delinquency >= 90 ? 1.4 : delinquency >= 30 ? 0.8 : delinquency > 0 ? 0.25 : -0.2) +
      (maritalStatus === "Married" ? -0.15 : 0.05) +
      (swissCanton === "GE" || swissCanton === "TI" ? 0.1 : -0.05)

    const defaultProbability = sigmoid(logitScore)
    const defaultFlag = random() < defaultProbability ? 1 : 0

    rows.push({
      Client_ID: `C${String(index + 1).padStart(5, "0")}`,
      Observation_Date: observationDate,
      Mortgage_Type: mortgageType,
      Income: income,
      Income_Bucket: incomeBucket,
      Loan_to_Value: Number((loanToValue * 100).toFixed(2)),
      LTV_Bucket: ltvBucket,
      Marital_Status: maritalStatus,
      Delinquency: delinquency,
      Swiss_Canton: swissCanton,
      Exposure: exposure,
      Default_Flag: defaultFlag,
    })
  }

  return {
    columns: Object.keys(rows[0]),
    rows,
  }
}

function showToast(message) {
  if (toastTimer) {
    window.clearTimeout(toastTimer)
  }
  elements.toast.textContent = message
  elements.toast.hidden = false
  toastTimer = window.setTimeout(() => {
    elements.toast.hidden = true
  }, 2800)
}

function downloadTextFile(fileName, content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function exportMethodologyPdf(fileName, title, content) {
  const cleanedContent = stripMethodologyArtifacts(content)
  const jsPdf = window.jspdf?.jsPDF
  if (!jsPdf) {
    openPrintWindow(title, cleanedContent)
    return
  }

  const documentInstance = new jsPdf({
    unit: "pt",
    format: "a4",
  })
  const margin = 48
  const lineHeight = 14
  const pageHeight = documentInstance.internal.pageSize.getHeight()
  const pageWidth = documentInstance.internal.pageSize.getWidth()
  const maxWidth = pageWidth - margin * 2

  let y = margin
  documentInstance.setFont("helvetica", "bold")
  documentInstance.setFontSize(18)
  documentInstance.text(title, margin, y)
  y += 28
  documentInstance.setFont("helvetica", "normal")
  documentInstance.setFontSize(10)

  const lines = documentInstance.splitTextToSize(cleanedContent, maxWidth)
  lines.forEach((line) => {
    if (y > pageHeight - margin) {
      documentInstance.addPage()
      y = margin
    }
    documentInstance.text(line, margin, y)
    y += lineHeight
  })

  documentInstance.save(fileName)
}

function openPrintWindow(title, content) {
  const printWindow = window.open("", "_blank", "noopener,noreferrer")
  if (!printWindow) {
    showToast("The browser blocked the print window.")
    return
  }

  printWindow.document.write(`
    <html>
      <head>
        <title>${escapeHtml(title)}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 32px; color: #17255a; }
          h1 { font-size: 24px; margin-bottom: 24px; }
          pre { white-space: pre-wrap; line-height: 1.55; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(title)}</h1>
        <pre>${escapeHtml(content)}</pre>
      </body>
    </html>
  `)
  printWindow.document.close()
  printWindow.focus()
  printWindow.print()
}

function stripMethodologyArtifacts(text) {
  return text
    .replace(/<!-- CREDIT RISK WITH AI :: STATE JSON START[\s\S]*?CREDIT RISK WITH AI :: STATE JSON END -->/g, "")
    .replace(/CREDIT RISK WITH AI :: ANALYST NOTES START/g, "")
    .replace(/CREDIT RISK WITH AI :: ANALYST NOTES END/g, "")
    .trim()
}

function coerceInputValue(element) {
  if (element.dataset.valueKind === "percent") {
    return clamp(Number(element.value) / 100, 0, 1)
  }
  return Number(element.value)
}

function toggleArrayValue(array, value, checked) {
  const index = array.indexOf(value)
  if (checked && index === -1) {
    array.push(value)
  }
  if (!checked && index !== -1) {
    array.splice(index, 1)
  }
}

function renderOption(option, selectedValue) {
  return `<option value="${escapeHtml(option)}" ${option === selectedValue ? "selected" : ""}>${escapeHtml(option)}</option>`
}

function countOccurrences(text, needle) {
  return text.split(needle).length - 1
}

function normalizeHeader(value) {
  return String(value).trim().replace(/\s+/g, "_")
}

function deduplicateHeaders(headers) {
  const counts = new Map()
  return headers.map((header) => {
    const current = counts.get(header) || 0
    counts.set(header, current + 1)
    return current ? `${header}_${current + 1}` : header
  })
}

function normalizeCell(value) {
  return String(value ?? "").trim()
}

function parseLooseNumber(value) {
  const normalized = normalizeCell(value)
  if (!normalized) {
    return null
  }
  let cleaned = normalized.replace(/\s/g, "")
  if (/^-?\d+(,\d+)?$/.test(cleaned)) {
    cleaned = cleaned.replace(",", ".")
  } else if (/^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(cleaned)) {
    cleaned = cleaned.replace(/,/g, "")
  }
  const parsed = Number(cleaned)
  return Number.isFinite(parsed) ? parsed : null
}

function parseLooseDate(value) {
  const normalized = normalizeCell(value)
  if (!normalized) {
    return null
  }
  const direct = Date.parse(normalized)
  if (!Number.isNaN(direct)) {
    return direct
  }
  const europeanMatch = normalized.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/)
  if (europeanMatch) {
    const [, day, month, year] = europeanMatch
    const parsed = Date.parse(`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`)
    return Number.isNaN(parsed) ? null : parsed
  }
  return null
}

function looksBinary(values) {
  if (!values.length || values.length > 0 && values.length < 3) {
    return false
  }
  const distinct = Array.from(new Set(values.map((value) => normalizeCell(value).toLowerCase())))
  const allowed = new Set(["0", "1", "true", "false", "yes", "no", "default", "non-default", "good", "bad"])
  return distinct.length <= 2 && distinct.every((value) => allowed.has(value))
}

function normalizeTargetValue(value) {
  const normalized = normalizeCell(value).toLowerCase()
  if (normalized === "") {
    return null
  }
  if (["1", "true", "yes", "default", "bad"].includes(normalized)) {
    return 1
  }
  if (["0", "false", "no", "non-default", "good"].includes(normalized)) {
    return 0
  }
  const parsed = parseLooseNumber(normalized)
  if (parsed === 1) {
    return 1
  }
  if (parsed === 0) {
    return 0
  }
  return null
}

function assignRating(pd) {
  return RATING_MASTER_SCALE.find((ratingStep) => pd <= ratingStep.upper)?.rating || "C"
}

function findPreferredColumn(columns, patterns) {
  for (const pattern of patterns) {
    const match = columns.find((column) => pattern.test(column))
    if (match) {
      return match
    }
  }
  return ""
}

function stableHash(text) {
  let hash = 2166136261
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return Math.abs(hash)
}

function pick(random, items, weights = null) {
  if (!weights) {
    return items[Math.floor(random() * items.length)]
  }
  const threshold = random()
  let cumulative = 0
  for (let index = 0; index < items.length; index += 1) {
    cumulative += weights[index]
    if (threshold <= cumulative) {
      return items[index]
    }
  }
  return items[items.length - 1]
}

function mulberry32(seed) {
  return function nextRandom() {
    let current = (seed += 0x6d2b79f5)
    current = Math.imul(current ^ (current >>> 15), current | 1)
    current ^= current + Math.imul(current ^ (current >>> 7), current | 61)
    return ((current ^ (current >>> 14)) >>> 0) / 4294967296
  }
}

function sum(values) {
  return values.reduce((accumulator, value) => accumulator + value, 0)
}

function mean(values) {
  return values.length ? sum(values) / values.length : null
}

function median(values) {
  if (!values.length) {
    return null
  }
  const sorted = values.slice().sort((left, right) => left - right)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle]
}

function getMode(values) {
  if (!values.length) {
    return null
  }
  const counts = new Map()
  values.forEach((value) => {
    const normalized = normalizeCell(value)
    counts.set(normalized, (counts.get(normalized) || 0) + 1)
  })
  return Array.from(counts.entries()).sort((left, right) => right[1] - left[1])[0]?.[0] ?? null
}

function quantile(sortedValues, probability) {
  if (!sortedValues.length) {
    return 0
  }
  const index = (sortedValues.length - 1) * probability
  const lower = Math.floor(index)
  const upper = Math.ceil(index)
  if (lower === upper) {
    return sortedValues[lower]
  }
  const weight = index - lower
  return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function sigmoid(value) {
  return 1 / (1 + Math.exp(-value))
}

function logit(value) {
  return Math.log(value / (1 - value))
}

function dot(left, right) {
  return left.reduce((sum, value, index) => sum + value * right[index], 0)
}

function normalCdf(value) {
  return 0.5 * (1 + erf(value / Math.sqrt(2)))
}

function erf(value) {
  const sign = value < 0 ? -1 : 1
  const absolute = Math.abs(value)
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911
  const t = 1 / (1 + p * absolute)
  const polynomial = (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t)
  const result = 1 - polynomial * Math.exp(-absolute * absolute)
  return sign * result
}

function normalInv(probability) {
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239]
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572]
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783]
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416]
  const plow = 0.02425
  const phigh = 1 - plow

  if (probability <= 0 || probability >= 1) {
    throw new Error("Probability must be between 0 and 1.")
  }

  let q = 0
  let r = 0

  if (probability < plow) {
    q = Math.sqrt(-2 * Math.log(probability))
    return (
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    )
  }

  if (probability > phigh) {
    q = Math.sqrt(-2 * Math.log(1 - probability))
    return (
      -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    )
  }

  q = probability - 0.5
  r = q * q
  return (
    (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
    (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
  )
}

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function capitalize(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : ""
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function formatInteger(value) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Number(value) || 0)
}

function formatDecimal(value, digits = 2) {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) {
    return "n/a"
  }
  return Number(value).toFixed(digits)
}

function formatPercent(value, digits = 2) {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) {
    return "n/a"
  }
  return `${(Number(value) * 100).toFixed(digits)}%`
}

function formatCurrencyCompact(value) {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) {
    return "n/a"
  }
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
    style: "currency",
    currency: "USD",
  }).format(Number(value))
}

function sanitizeFileStem(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}


