const STEP_DEFINITIONS = [
  {
    key: "description",
    label: "Description",
    kicker: "Overview",
    title: "Understand the simulator before you begin",
    description:
      "Start with a guided presentation of the workflow, the recommended navigation order, and the outputs you can expect before moving into the portfolio and modeling tabs.",
  },
  {
    key: "workspace",
    label: "Portfolio workspace",
    kicker: "Intake",
    title: "Upload, map, and govern the portfolio data",
    description:
      "Load the portfolio, map the global fields, inspect the structure, and prepare the simulator inputs before feature engineering begins.",
  },
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
    key: "scoring",
    label: "Scoring",
    kicker: "Application",
    title: "Score a single case with the estimated scorecard",
    description:
      "Inspect the bucket-level scorecard, select one bucket per final feature, and calculate the implied score, PD, and rating for an individual scenario.",
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
  description: {},
  workspace: {},
  preparation: {
    missingStrategy: "median_mode",
    binCount: 5,
    trainShare: 60,
    validationShare: 20,
    monitoringShare: 10,
    calibrationShare: 10,
    selectedFeatures: [],
    confirmedFeatures: [],
  },
  estimation: {
    ivThreshold: 0.05,
    maxFeatures: 6,
    ridge: 0.05,
    scoreOffset: 218,
    scoreFactor: -72,
    modelFeatures: [],
  },
  scoring: {
    selectedBuckets: {},
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
  description: {
    code: "Document onboarding notes, teaching context, or simulator introduction guidance here.",
    methodology: "Capture the presentation framing, audience, and recommended learning path here.",
  },
  workspace: {
    code: "Document dataset lineage, upload assumptions, or field-mapping decisions here.",
    methodology: "Capture portfolio scope, data governance, and mapping rationale here.",
  },
  preparation: {
    code: "Add portfolio-specific preparation notes here. This section is preserved after Save & Sync.",
    methodology: "Add business rules, governance limits, or data lineage notes here.",
  },
  estimation: {
    code: "Document modeling decisions such as exclusions, challenger tests, or score scaling changes here.",
    methodology: "Capture model design choices, expert overlays, or approval remarks here.",
  },
  scoring: {
    code: "Document manual overrides, use-test scenarios, or score interpretation notes here.",
    methodology: "Add decision-use assumptions, scenario definitions, or approval guidance here.",
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

const MAX_TRACKED_DISTINCT_VALUES = 51
const ALLOWED_BINARY_VALUES = new Set(["0", "1", "true", "false", "yes", "no", "default", "non-default", "good", "bad"])
const DEMO_DATASET_ASSET = "./data/rating_model_data.csv"
const DEMO_DATASET_FILE_NAME = "rating_model_data.csv"
const CONTACT_FORM_ENDPOINT = "https://formsubmit.co/ajax/cezar.chirila@helvetic-ai-compass.ch"

const elements = {
  descriptionSection: document.getElementById("description-section"),
  workspaceSection: document.getElementById("workspace-section"),
  workspaceStatus: document.getElementById("workspace-status"),
  fileInput: document.getElementById("file-input"),
  loadDemoButton: document.getElementById("load-demo-button"),
  resetButton: document.getElementById("reset-button"),
  exportFullRButton: document.getElementById("export-full-r-button"),
  exportFullPdfButton: document.getElementById("export-full-pdf-button"),
  datasetMetrics: document.getElementById("dataset-metrics"),
  loadingCard: document.getElementById("loading-card"),
  loadingTitle: document.getElementById("loading-title"),
  loadingCopy: document.getElementById("loading-copy"),
  loadingPercent: document.getElementById("loading-percent"),
  loadingProgressFill: document.getElementById("loading-progress-fill"),
  loadingMeta: document.getElementById("loading-meta"),
  globalFieldGrid: document.getElementById("global-field-grid"),
  datasetPreview: document.getElementById("dataset-preview"),
  previewCaption: document.getElementById("preview-caption"),
  stepShell: document.getElementById("active-step-shell"),
  toast: document.getElementById("toast"),
  mobileStepNav: document.getElementById("mobile-step-nav"),
  mobileStepLabel: document.getElementById("mobile-step-label"),
  mobileStepMeta: document.getElementById("mobile-step-meta"),
  mobileStepPrev: document.getElementById("mobile-step-prev"),
  mobileStepNext: document.getElementById("mobile-step-next"),
  contactForm: document.getElementById("contact-form"),
  contactSubmitButton: document.getElementById("contact-submit-button"),
  contactStatus: document.getElementById("contact-status"),
  tabButtons: Array.from(document.querySelectorAll(".tab-button, .header-tab-button")),
}

let toastTimer = null
let activeLoadToken = 0
let activeLoadAbortController = null
let shouldScrollToPreparationDiagnostics = false
let isMobileExperience = false
let state = createInitialState()

bootstrap()

function bootstrap() {
  initializeResponsiveMode()
  bindGlobalEvents()
  refreshDocuments("ui")
  renderAll()
}

function createInitialState() {
  return {
    activeStep: "description",
    datasetName: "",
    rows: [],
    metadata: null,
    loading: createLoadingState(),
    global: clone(DEFAULT_GLOBAL_CONFIG),
    steps: clone(DEFAULT_STEP_CONFIGS),
    notes: clone(DEFAULT_NOTES),
    documents: buildEmptyDocuments(),
    documentWindows: buildDocumentWindowState(),
    derived: {},
  }
}

function createLoadingState() {
  return {
    active: false,
    fileName: "",
    phase: "",
    message: "",
    progress: 0,
    loadedBytes: 0,
    totalBytes: 0,
    parsedRows: 0,
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

function buildDocumentWindowState() {
  return STEP_DEFINITIONS.reduce((accumulator, stepDefinition) => {
    accumulator[stepDefinition.key] = {
      code: false,
      methodology: false,
    }
    return accumulator
  }, {})
}

function bindGlobalEvents() {
  elements.fileInput.addEventListener("change", handleFileInput)
  elements.loadDemoButton.addEventListener("click", () => {
    void loadBundledDemoPortfolio()
  })
  elements.mobileStepPrev.addEventListener("click", () => {
    navigateStepByOffset(-1)
  })
  elements.mobileStepNext.addEventListener("click", () => {
    navigateStepByOffset(1)
  })
  elements.contactForm.addEventListener("submit", handleContactFormSubmit)
  elements.resetButton.addEventListener("click", () => {
    cancelActiveLoad()
    state = createInitialState()
    elements.fileInput.value = ""
    refreshDocuments("ui")
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
      activateStep(button.dataset.tabTarget, {
        scrollToStep: isMobileExperience || button.classList.contains("header-tab-button"),
      })
    })
  })
}

function initializeResponsiveMode() {
  const syncResponsiveMode = () => {
    const nextMode = detectMobileExperience()
    if (nextMode === isMobileExperience && document.body.dataset.mobileModeReady === "true") {
      return
    }

    isMobileExperience = nextMode
    document.body.classList.toggle("is-mobile-device", isMobileExperience)
    document.body.dataset.mobileModeReady = "true"
    elements.mobileStepNav.hidden = !isMobileExperience
    renderTabs()
  }

  syncResponsiveMode()
  window.addEventListener("resize", syncResponsiveMode)
  window.addEventListener("orientationchange", syncResponsiveMode)
}

function detectMobileExperience() {
  const byViewport = window.matchMedia("(max-width: 860px)").matches
  const byPointer = window.matchMedia("(pointer: coarse)").matches && window.matchMedia("(max-width: 1180px)").matches
  const byAgent = Boolean(
    window.navigator.userAgentData?.mobile ||
    /Android|iPhone|iPad|iPod|Windows Phone|webOS|BlackBerry|Opera Mini/i.test(window.navigator.userAgent || "")
  )
  return byViewport || byPointer || byAgent
}

function activateStep(stepKey, options = {}) {
  if (!getStepDefinition(stepKey)) {
    return
  }

  state.activeStep = stepKey
  renderTabs()
  renderActiveStep()

  if (options.scrollToStep) {
    window.requestAnimationFrame(() => {
      getActiveStepScrollTarget().scrollIntoView({ behavior: "smooth", block: "start" })
    })
  }
}

function getActiveStepScrollTarget() {
  if (state.activeStep === "description") {
    return elements.descriptionSection
  }
  if (state.activeStep === "workspace") {
    return elements.workspaceSection
  }
  return elements.stepShell
}

function navigateStepByOffset(offset) {
  const currentIndex = STEP_DEFINITIONS.findIndex((stepDefinition) => stepDefinition.key === state.activeStep)
  if (currentIndex === -1) {
    return
  }

  const nextStep = STEP_DEFINITIONS[currentIndex + offset]
  if (!nextStep) {
    return
  }

  activateStep(nextStep.key, { scrollToStep: true })
}

async function handleContactFormSubmit(event) {
  event.preventDefault()

  const form = elements.contactForm
  const formData = new FormData(form)
  const fullName = String(formData.get("fullName") || "").trim()
  const company = String(formData.get("company") || "").trim()
  const email = String(formData.get("email") || "").trim()
  const subject = String(formData.get("subject") || "").trim()
  const question = String(formData.get("question") || "").trim()

  if (!fullName || !email || !subject || !question) {
    setContactStatus("Please complete full name, email address, question topic, and question.", "error")
    return
  }

  if (!isLikelyEmail(email)) {
    setContactStatus("Please provide a valid email address before sending the question.", "error")
    return
  }

  if (!window.navigator.onLine) {
    setContactStatus("You appear to be offline. Reconnect to the internet and try again.", "error")
    return
  }

  const activeStep = getStepDefinition(state.activeStep)
  const payload = {
    name: fullName,
    company: company || "Not provided",
    email,
    subject,
    message: question,
    dataset: state.datasetName || "No dataset loaded",
    active_step: activeStep?.label || state.activeStep,
    loaded_rows: state.rows.length ? formatInteger(state.rows.length) : "0",
    website: window.location.href,
    _subject: `Credit risk with AI | ${subject}`,
    _template: "table",
    _captcha: "false",
  }

  elements.contactSubmitButton.disabled = true
  elements.contactSubmitButton.textContent = "Sending..."
  setContactStatus("Sending your question directly from the simulator.", "")

  try {
    const response = await fetch(CONTACT_FORM_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    })
    const result = await response.json().catch(() => ({}))

    if (!response.ok || result.success === false) {
      throw new Error(result.message || "The contact service did not confirm the submission.")
    }

    form.reset()
    setContactStatus("Your question has been sent. You should receive a reply at the email address you provided.", "success")
    showToast("Question sent successfully.")
  } catch (error) {
    setContactStatus(
      "The question could not be sent right now. Please try again in a moment or contact cezar.chirila@helvetic-ai-compass.ch directly.",
      "error"
    )
    showToast(`Contact form error: ${error.message}`)
  } finally {
    elements.contactSubmitButton.disabled = false
    elements.contactSubmitButton.textContent = "Send question"
  }
}

function setContactStatus(message, tone = "") {
  elements.contactStatus.textContent = message
  elements.contactStatus.classList.toggle("is-success", tone === "success")
  elements.contactStatus.classList.toggle("is-error", tone === "error")
}

function isLikelyEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

async function handleFileInput(event) {
  const file = event.target.files?.[0]
  if (!file) {
    return
  }

  elements.fileInput.value = ""
  const loadToken = startLoadingSession(file)

  try {
    await waitForNextFrame()
    const parsed = await parseDelimitedFile(file, loadToken)
    assertActiveLoad(loadToken)
    setLoadingState({
      phase: "Finalizing upload",
      message: "Preparing the simulator workspace, field mapping, and initial documentation.",
      progress: 0.98,
      loadedBytes: file.size,
      totalBytes: file.size,
      parsedRows: parsed.rows.length,
    })
    await waitForNextFrame()
    hydrateDataset(parsed.rows, parsed.columns, file.name, parsed.metadata)
    clearLoadingState(true)
    showToast(`Loaded ${file.name}.`)
  } catch (error) {
    if (isCancelledLoad(error)) {
      return
    }
    clearLoadingState(true)
    showToast(`Could not parse the uploaded file: ${error.message}`)
  }
}

async function loadBundledDemoPortfolio() {
  cancelActiveLoad()
  const loadToken = startLoadingSession(
    { name: DEMO_DATASET_FILE_NAME, size: 0 },
    "Downloading the bundled portfolio and preparing the incremental browser parser."
  )
  const abortController = new AbortController()
  activeLoadAbortController = abortController

  try {
    await waitForNextFrame()
    const demoFile = await fetchBundledDemoFile(loadToken, abortController)
    assertActiveLoad(loadToken)
    const parsed = await parseDelimitedFile(demoFile, loadToken, { start: 0.32, end: 0.94 })
    assertActiveLoad(loadToken)
    setLoadingState({
      phase: "Finalizing demo portfolio",
      message: "Preparing the simulator workspace, field mapping, and initial documentation.",
      progress: 0.98,
      loadedBytes: demoFile.size,
      totalBytes: demoFile.size,
      parsedRows: parsed.rows.length,
    })
    await waitForNextFrame()
    hydrateDataset(parsed.rows, parsed.columns, DEMO_DATASET_FILE_NAME, parsed.metadata)
    clearLoadingState(true)
    showToast("Demo portfolio loaded.")
  } catch (error) {
    if (isCancelledLoad(error) || error?.name === "AbortError") {
      return
    }
    clearLoadingState(true)
    showToast(`Could not load the demo portfolio: ${error.message}`)
  } finally {
    if (activeLoadAbortController === abortController) {
      activeLoadAbortController = null
    }
  }
}

function startLoadingSession(file, message = "Opening the file and switching to an incremental parser for large datasets.") {
  activeLoadToken += 1
  const loadToken = activeLoadToken
  state.loading = {
    active: true,
    fileName: file.name,
    phase: "Preparing upload",
    message,
    progress: 0,
    loadedBytes: 0,
    totalBytes: file.size,
    parsedRows: 0,
  }
  renderAll()
  return loadToken
}

function cancelActiveLoad() {
  activeLoadToken += 1
  if (activeLoadAbortController) {
    activeLoadAbortController.abort()
    activeLoadAbortController = null
  }
  clearLoadingState()
}

function assertActiveLoad(loadToken) {
  if (loadToken !== activeLoadToken) {
    const cancellationError = new Error("Upload cancelled.")
    cancellationError.name = "LoadCancelledError"
    throw cancellationError
  }
}

function isCancelledLoad(error) {
  return error?.name === "LoadCancelledError"
}

function setLoadingState(partialState) {
  state.loading = {
    ...state.loading,
    ...partialState,
    active: true,
  }
  renderLoadingState()
}

function clearLoadingState(shouldRerender = false) {
  state.loading = createLoadingState()
  if (shouldRerender) {
    renderAll()
    return
  }
  renderLoadingState()
}

async function fetchBundledDemoFile(loadToken, abortController) {
  const assetUrl = new URL(DEMO_DATASET_ASSET, window.location.href)
  const response = await fetch(assetUrl, {
    cache: "no-store",
    signal: abortController.signal,
  })
  assertActiveLoad(loadToken)

  if (!response.ok) {
    throw new Error(`The bundled dataset returned ${response.status}.`)
  }

  const headerTotalBytes = Number(response.headers.get("content-length")) || 0
  setLoadingState({
    phase: "Downloading demo portfolio",
    message: "Loading the bundled portfolio asset before parsing it in chunks.",
    progress: headerTotalBytes ? 0.03 : 0.05,
    loadedBytes: 0,
    totalBytes: headerTotalBytes,
    parsedRows: 0,
  })

  if (!response.body || typeof response.body.getReader !== "function") {
    const blob = await response.blob()
    assertActiveLoad(loadToken)
    setLoadingState({
      phase: "Download complete",
      message: "The demo portfolio is ready. The browser is about to parse it in chunks.",
      progress: 0.32,
      loadedBytes: blob.size,
      totalBytes: headerTotalBytes || blob.size,
      parsedRows: 0,
    })
    return createBlobBackedFile(blob, DEMO_DATASET_FILE_NAME)
  }

  const reader = response.body.getReader()
  const chunks = []
  let loadedBytes = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }

    assertActiveLoad(loadToken)
    if (!value?.length) {
      continue
    }

    chunks.push(value)
    loadedBytes += value.length
    setLoadingState({
      phase: "Downloading demo portfolio",
      message: "Streaming the bundled CSV into the browser before the parsing step begins.",
      progress: headerTotalBytes ? Math.min((loadedBytes / headerTotalBytes) * 0.28, 0.28) : Math.min(0.05 + chunks.length * 0.01, 0.28),
      loadedBytes,
      totalBytes: headerTotalBytes,
      parsedRows: 0,
    })
    await waitForNextFrame()
  }

  const blob = new Blob(chunks, {
    type: response.headers.get("content-type") || "text/csv;charset=utf-8",
  })
  setLoadingState({
    phase: "Download complete",
    message: "The demo portfolio is ready. The browser is about to parse it in chunks.",
    progress: 0.32,
    loadedBytes,
    totalBytes: headerTotalBytes || blob.size,
    parsedRows: 0,
  })
  return createBlobBackedFile(blob, DEMO_DATASET_FILE_NAME)
}

function createBlobBackedFile(blob, fileName) {
  return {
    name: fileName,
    size: blob.size,
    slice(start, end) {
      return blob.slice(start, end)
    },
  }
}

async function parseDelimitedFile(file, loadToken, progressRange = { start: 0, end: 0.94 }) {
  const sampleText = await file.slice(0, Math.min(file.size, 256 * 1024)).text()
  assertActiveLoad(loadToken)
  const delimiter = detectDelimiter(sampleText.replace(/\uFEFF/g, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n"))
  const parser = createDelimitedParser(delimiter)
  const chunkSize = chooseChunkSize(file.size)
  const progressStart = progressRange.start ?? 0
  const progressEnd = progressRange.end ?? 0.94
  const progressSpan = Math.max(progressEnd - progressStart, 0)

  let offset = 0
  while (offset < file.size) {
    const end = Math.min(offset + chunkSize, file.size)
    const chunkText = await file.slice(offset, end).text()
    assertActiveLoad(loadToken)
    consumeDelimitedChunk(parser, chunkText)
    offset = end

    setLoadingState({
      phase: parser.columns.length ? "Parsing rows" : "Scanning header",
      message: parser.columns.length
        ? "The dataset is loading in chunks so the browser can keep updating the interface."
        : "Reading the header row and inferring the field structure.",
      progress: file.size ? Math.min(progressStart + offset / file.size * progressSpan, progressEnd) : progressEnd,
      loadedBytes: offset,
      totalBytes: file.size,
      parsedRows: parser.rowCount,
    })
    await waitForNextFrame()
  }

  finalizeDelimitedParser(parser)
  assertActiveLoad(loadToken)

  if (!parser.columns.length || !parser.rowCount) {
    throw new Error("The file does not contain a header row plus data.")
  }

  return {
    columns: parser.columns,
    rows: parser.rows,
    metadata: buildMetadataFromAccumulators(parser.rows, parser.columns, parser.columnAccumulators),
  }
}

function chooseChunkSize(fileSize) {
  if (fileSize >= 300 * 1024 * 1024) {
    return 4 * 1024 * 1024
  }
  if (fileSize >= 100 * 1024 * 1024) {
    return 3 * 1024 * 1024
  }
  return 2 * 1024 * 1024
}

function createDelimitedParser(delimiter) {
  return {
    delimiter,
    currentField: "",
    currentRow: [],
    inQuotes: false,
    pendingQuote: false,
    pendingLineFeed: false,
    strippedBom: false,
    columns: [],
    rows: [],
    rowCount: 0,
    columnAccumulators: [],
  }
}

function consumeDelimitedChunk(parser, rawChunk) {
  if (!rawChunk) {
    return
  }

  let chunk = rawChunk
  if (!parser.strippedBom) {
    chunk = chunk.replace(/^\uFEFF/, "")
    parser.strippedBom = true
  }

  let index = 0
  if (parser.pendingLineFeed) {
    if (chunk.startsWith("\n")) {
      index = 1
    }
    parser.pendingLineFeed = false
  }

  if (parser.pendingQuote) {
    if (chunk[index] === '"') {
      parser.currentField += '"'
      index += 1
    } else {
      parser.inQuotes = false
    }
    parser.pendingQuote = false
  }

  for (; index < chunk.length; index += 1) {
    const character = chunk[index]
    const nextCharacter = chunk[index + 1]

    if (character === '"') {
      if (parser.inQuotes && nextCharacter === '"') {
        parser.currentField += '"'
        index += 1
      } else if (parser.inQuotes && nextCharacter === undefined) {
        parser.pendingQuote = true
      } else {
        parser.inQuotes = !parser.inQuotes
      }
      continue
    }

    if (!parser.inQuotes && character === parser.delimiter) {
      parser.currentRow.push(parser.currentField)
      parser.currentField = ""
      continue
    }

    if (!parser.inQuotes && character === "\n") {
      parser.currentRow.push(parser.currentField)
      parser.currentField = ""
      commitParsedRow(parser)
      continue
    }

    if (!parser.inQuotes && character === "\r") {
      parser.currentRow.push(parser.currentField)
      parser.currentField = ""
      commitParsedRow(parser)
      if (nextCharacter === "\n") {
        index += 1
      } else if (index === chunk.length - 1) {
        parser.pendingLineFeed = true
      }
      continue
    }

    parser.currentField += character
  }
}

function finalizeDelimitedParser(parser) {
  if (parser.pendingQuote) {
    parser.pendingQuote = false
    parser.inQuotes = false
  }
  if (parser.currentField.length || parser.currentRow.length) {
    parser.currentRow.push(parser.currentField)
    parser.currentField = ""
    commitParsedRow(parser)
  }
}

function commitParsedRow(parser) {
  if (!parser.currentRow.some((field) => normalizeCell(field) !== "")) {
    parser.currentRow = []
    return
  }

  if (!parser.columns.length) {
    parser.columns = deduplicateHeaders(
      parser.currentRow.map((header, index) => normalizeHeader(header) || `Column_${index + 1}`)
    )
    parser.columnAccumulators = parser.columns.map((columnName) => createColumnAccumulator(columnName))
    parser.currentRow = []
    return
  }

  const rowObject = {}
  for (let columnIndex = 0; columnIndex < parser.columns.length; columnIndex += 1) {
    const columnName = parser.columns[columnIndex]
    const normalizedValue = normalizeCell(parser.currentRow[columnIndex] ?? "")
    rowObject[columnName] = normalizedValue
    updateColumnAccumulator(parser.columnAccumulators[columnIndex], normalizedValue)
  }

  parser.rows.push(rowObject)
  parser.rowCount += 1
  parser.currentRow = []
}

function createColumnAccumulator(columnName) {
  return {
    name: columnName,
    rawCount: 0,
    nonEmptyCount: 0,
    numericCount: 0,
    dateCount: 0,
    distinctValues: new Set(),
    distinctOverflow: false,
    binaryValues: new Set(),
  }
}

function updateColumnAccumulator(accumulator, value) {
  accumulator.rawCount += 1
  const normalizedValue = normalizeCell(value)
  if (normalizedValue === "") {
    return
  }

  accumulator.nonEmptyCount += 1

  if (Number.isFinite(parseLooseNumber(normalizedValue))) {
    accumulator.numericCount += 1
  }
  if (parseLooseDate(normalizedValue) !== null) {
    accumulator.dateCount += 1
  }

  if (!accumulator.distinctOverflow) {
    accumulator.distinctValues.add(normalizedValue)
    if (accumulator.distinctValues.size > MAX_TRACKED_DISTINCT_VALUES) {
      accumulator.distinctOverflow = true
    }
  }

  if (accumulator.binaryValues.size <= 2) {
    accumulator.binaryValues.add(normalizedValue.toLowerCase())
  }
}

function buildMetadataFromAccumulators(rows, columns, columnAccumulators) {
  const columnStats = columnAccumulators.map((accumulator) => finalizeColumnAccumulator(accumulator))
  const columnMap = Object.fromEntries(columnStats.map((columnStat) => [columnStat.name, columnStat]))
  return {
    rows,
    columns,
    columnStats,
    columnMap,
  }
}

function finalizeColumnAccumulator(accumulator) {
  const numericShare = accumulator.nonEmptyCount ? accumulator.numericCount / accumulator.nonEmptyCount : 0
  const dateShare = accumulator.nonEmptyCount ? accumulator.dateCount / accumulator.nonEmptyCount : 0
  const distinctValues = accumulator.distinctOverflow
    ? Math.max(accumulator.distinctValues.size, MAX_TRACKED_DISTINCT_VALUES + 1)
    : accumulator.distinctValues.size
  const type = looksBinaryFromSet(accumulator.binaryValues, accumulator.nonEmptyCount)
    ? "binary"
    : dateShare > 0.7
      ? "date"
      : numericShare > 0.8
        ? "numeric"
        : "categorical"

  return {
    name: accumulator.name,
    type,
    missingRate: accumulator.rawCount ? 1 - accumulator.nonEmptyCount / accumulator.rawCount : 0,
    distinctValues,
  }
}

function looksBinaryFromSet(values, nonEmptyCount) {
  if (!nonEmptyCount || nonEmptyCount < 3) {
    return false
  }
  return values.size > 0 && values.size <= 2 && Array.from(values).every((value) => ALLOWED_BINARY_VALUES.has(value))
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
    return
  }

  if (action === "set-scoring-bucket") {
    const featureName = target.dataset.featureName
    state.steps.scoring.selectedBuckets = {
      ...state.steps.scoring.selectedBuckets,
      [featureName]: target.value,
    }
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
  if (action === "toggle-document-window") {
    const stepKey = trigger.dataset.stepKey
    const documentType = trigger.dataset.documentType
    state.documentWindows[stepKey][documentType] = !state.documentWindows[stepKey][documentType]
    renderActiveStep()
    return
  }
  if (action === "confirm-preparation-features") {
    if (!state.global.targetColumn) {
      showToast("Map the target column before confirming variables.")
      return
    }
    if (!state.steps.preparation.selectedFeatures.length) {
      showToast("Select at least one variable before confirming.")
      return
    }

    const nextConfirmedFeatures = state.steps.preparation.selectedFeatures.slice()
    const featureSelectionChanged = !areSameStringArrays(nextConfirmedFeatures, state.steps.preparation.confirmedFeatures)
    state.steps.preparation.confirmedFeatures = nextConfirmedFeatures
    refreshDownstreamStepsFromPreparationConfirmation(featureSelectionChanged)
    shouldScrollToPreparationDiagnostics = true
    reconcileSelections(featureSelectionChanged)
    recomputeAndRender("ui")
    showToast(
      featureSelectionChanged
        ? "Selected variables confirmed. All downstream tabs were refreshed from the new feature set."
        : "Selected variables reconfirmed and downstream tabs were recalculated."
    )
    return
  }
  if (action === "reset-document") {
    refreshDocumentsForStep(trigger.dataset.stepKey)
    renderActiveStep()
    showToast("Editor reset from the live simulator state.")
    return
  }
  if (action === "clear-scoring-scenario") {
    state.steps.scoring.selectedBuckets = {}
    recomputeAndRender("ui")
    showToast("Scoring selections cleared.")
    return
  }
  if (action === "export-code") {
    const stepKey = trigger.dataset.stepKey
    const stepDefinition = getStepDefinition(stepKey)
    const fileName = `${sanitizeFileStem(stepDefinition.label)}.R`
    downloadTextFile(fileName, state.documents[stepKey].code)
    return
  }
  if (action === "export-methodology-tex") {
    const stepKey = trigger.dataset.stepKey
    const stepDefinition = getStepDefinition(stepKey)
    const title = `${stepDefinition.label} - Methodology`
    const fileName = `${sanitizeFileStem(stepDefinition.label)}-methodology.tex`
    downloadTextFile(fileName, buildStandaloneLatexDocument(title, stripMethodologyArtifacts(state.documents[stepKey].methodology)))
    return
  }
  if (action === "export-methodology-pdf") {
    const stepKey = trigger.dataset.stepKey
    const stepDefinition = getStepDefinition(stepKey)
    const title = `${stepDefinition.label} - Methodology`
    const fileName = `${sanitizeFileStem(stepDefinition.label)}-methodology.pdf`
    exportMethodologyPdf(fileName, title, state.documents[stepKey].methodology)
  }
}

function hydrateDataset(rows, columns, datasetName, metadata = null) {
  state.datasetName = datasetName
  state.rows = rows
  state.metadata = metadata ?? analyzeDataset(rows, columns)
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
  const confirmedPreparation = state.steps.preparation.confirmedFeatures.filter((feature) => availableFeatures.includes(feature))
  const selectedEstimation = state.steps.estimation.modelFeatures.filter((feature) => confirmedPreparation.includes(feature))

  state.steps.preparation.selectedFeatures =
    forceAutoFill && !selectedPreparation.length ? autoSelectFeatures(availableFeatures) : selectedPreparation
  state.steps.preparation.confirmedFeatures = confirmedPreparation
  state.steps.estimation.modelFeatures =
    !confirmedPreparation.length
      ? []
      : forceAutoFill || !selectedEstimation.length
        ? confirmedPreparation.slice(0, Math.min(confirmedPreparation.length, 8))
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

function refreshDownstreamStepsFromPreparationConfirmation(featureSelectionChanged) {
  if (featureSelectionChanged) {
    state.steps.estimation.modelFeatures = []
  }
  state.steps.scoring.selectedBuckets = {}
}

function recomputeAndRender(source = "ui") {
  if (!state.metadata) {
    refreshDocuments(source)
    renderAll()
    return
  }

  const preparation = computePreparation()
  const estimation = computeEstimation(preparation)
  const scoring = computeScoring(estimation)
  const validation = computeValidation(estimation)
  const monitoring = computeMonitoring(estimation)
  const calibration = computeCalibration(estimation)
  const basel3 = computeBasel3(estimation, calibration)
  const basel4 = computeBasel4(estimation, calibration)

  state.derived = {
    preparation,
    estimation,
    scoring,
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
  renderWorkspace()
  renderLoadingState()
  renderTabs()
  renderActiveStep()
  revealPreparationDiagnosticsIfNeeded()
}

function renderWorkspace() {
  const metadata = state.metadata
  const isLoading = state.loading.active
  elements.workspaceStatus.textContent = isLoading
    ? `Loading ${state.loading.fileName || "dataset"}`
    : metadata
      ? state.global.targetColumn
        ? "Portfolio ready for modeling"
        : "Map the target column"
      : "Waiting for a dataset"

  elements.datasetMetrics.innerHTML = renderDatasetMetrics()
  elements.globalFieldGrid.innerHTML = renderGlobalFieldGrid()
  elements.previewCaption.textContent = isLoading
    ? `${formatBytes(state.loading.loadedBytes)} read so far.`
    : metadata
      ? `${formatInteger(metadata.rows.length)} rows and ${formatInteger(metadata.columns.length)} columns available.`
      : "Load a portfolio to inspect its structure."
  elements.datasetPreview.innerHTML = metadata
    ? renderPreviewTable()
    : isLoading
      ? renderEmptyState("The dataset preview appears as soon as parsing completes.")
      : renderEmptyState("No dataset loaded yet.")
}

function renderLoadingState() {
  const loading = state.loading
  elements.loadingCard.hidden = !loading.active
  if (!loading.active) {
    elements.loadingProgressFill.style.width = "0%"
    return
  }

  const percent = Math.round(clamp(loading.progress, 0, 1) * 100)
  elements.loadingTitle.textContent = loading.phase || "Loading dataset"
  elements.loadingCopy.textContent = loading.message || "The file is still loading."
  elements.loadingPercent.textContent = `${percent}%`
  elements.loadingProgressFill.style.width = `${percent}%`
  elements.workspaceStatus.textContent = `Loading ${loading.fileName || "dataset"}`
  elements.previewCaption.textContent = `${formatBytes(loading.loadedBytes)} read so far.`

  const metaParts = []
  if (loading.totalBytes) {
    metaParts.push(`${formatBytes(loading.loadedBytes)} / ${formatBytes(loading.totalBytes)}`)
  }
  if (loading.parsedRows) {
    metaParts.push(`${formatInteger(loading.parsedRows)} data rows parsed`)
  }
  elements.loadingMeta.textContent = metaParts.join(" | ")
}

function renderTabs() {
  const activeIndex = STEP_DEFINITIONS.findIndex((stepDefinition) => stepDefinition.key === state.activeStep)

  elements.tabButtons.forEach((button) => {
    const isActive = button.dataset.tabTarget === state.activeStep
    button.classList.toggle("is-active", isActive)
    button.setAttribute("aria-selected", String(isActive))
    if (isActive && isMobileExperience) {
      button.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" })
    }
  })

  elements.mobileStepNav.hidden = !isMobileExperience
  if (activeIndex === -1) {
    return
  }

  const activeStep = STEP_DEFINITIONS[activeIndex]
  elements.mobileStepLabel.textContent = activeStep.label
  elements.mobileStepMeta.textContent = `Step ${activeIndex + 1} of ${STEP_DEFINITIONS.length}`
  elements.mobileStepPrev.disabled = activeIndex === 0
  elements.mobileStepNext.disabled = activeIndex === STEP_DEFINITIONS.length - 1
}

function renderActiveStep() {
  const isDescriptionStep = state.activeStep === "description"
  const isWorkspaceStep = state.activeStep === "workspace"
  elements.descriptionSection.hidden = !isDescriptionStep
  elements.descriptionSection.style.display = isDescriptionStep ? "" : "none"
  elements.workspaceSection.hidden = !isWorkspaceStep
  elements.workspaceSection.style.display = isWorkspaceStep ? "" : "none"
  elements.stepShell.hidden = isDescriptionStep || isWorkspaceStep
  elements.stepShell.style.display = isDescriptionStep || isWorkspaceStep ? "none" : ""
  if (isDescriptionStep || isWorkspaceStep) {
    elements.stepShell.innerHTML = ""
    return
  }

  const stepDefinition = getStepDefinition(state.activeStep)
  const derived = state.derived[state.activeStep]
  const statusText = state.loading.active ? "Loading" : derived?.ready ? "Live" : state.metadata ? "Needs attention" : "Template mode"

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
      </div>
      <div class="step-document-row">
        ${renderEditors(stepDefinition.key)}
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
    case "scoring":
      return renderScoringControls()
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
    case "scoring":
      return renderScoringResults()
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
  const windows = state.documentWindows[stepKey]

  return `
    <section class="document-launcher-shell">
      <div class="document-launchers">
        <button
          class="${windows.code ? "primary-button" : "secondary-button"} document-toggle-button"
          type="button"
          data-action="toggle-document-window"
          data-step-key="${stepKey}"
          data-document-type="code"
        >
          ${windows.code ? "Hide R Code" : "Show R Code"}
        </button>
        <button
          class="${windows.methodology ? "primary-button" : "secondary-button"} document-toggle-button"
          type="button"
          data-action="toggle-document-window"
          data-step-key="${stepKey}"
          data-document-type="methodology"
        >
          ${windows.methodology ? "Hide LaTeX Methodology" : "Show LaTeX Methodology"}
        </button>
      </div>
      ${windows.code
        ? renderDocumentWindow(
            stepKey,
            "code",
            "R code window",
            "Review or edit the generated R implementation, then export it as an .R file.",
            documents.code
          )
        : ""}
      ${windows.methodology
        ? renderDocumentWindow(
            stepKey,
            "methodology",
            "LaTeX methodology window",
            "Review or edit the generated LaTeX methodology, then export it as a .tex file or print it as a PDF of the source.",
            documents.methodology
          )
        : ""}
    </section>
  `
}

function renderDocumentWindow(stepKey, documentType, title, helperCopy, content) {
  const isCode = documentType === "code"
  const methodologyButtons = isCode
    ? `<button class="secondary-button small-button" type="button" data-action="export-code" data-step-key="${stepKey}">Export .R</button>`
    : `<button class="secondary-button small-button" type="button" data-action="export-methodology-tex" data-step-key="${stepKey}">Export .tex</button>
       <button class="ghost-button small-button" type="button" data-action="export-methodology-pdf" data-step-key="${stepKey}">Export PDF</button>`
  return `
    <article class="document-window">
      <div class="document-window-header">
        <div>
          <p class="card-kicker">${isCode ? "Generated R" : "Generated LaTeX methodology"}</p>
          <h3>${escapeHtml(title)}</h3>
        </div>
        <div class="editor-toolbar">
          <button class="primary-button small-button" type="button" data-action="save-document" data-step-key="${stepKey}" data-document-type="${documentType}">Save &amp; Sync</button>
          <button class="ghost-button small-button" type="button" data-action="reset-document" data-step-key="${stepKey}" data-document-type="${documentType}">Reset</button>
          ${methodologyButtons}
        </div>
      </div>
      <p class="editor-tip">${escapeHtml(helperCopy)}</p>
      <textarea class="editor-textarea ${isCode ? "" : "is-tall"}" data-action="edit-document" data-step-key="${stepKey}" data-document-type="${documentType}" spellcheck="false">${escapeHtml(
        content
      )}</textarea>
    </article>
  `
}

function renderDatasetMetrics() {
  if (!state.metadata && state.loading.active) {
    return [
      renderMetricTile("Rows parsed", formatInteger(state.loading.parsedRows), "Rows already converted into the browser workspace."),
      renderMetricTile("Loaded", formatBytes(state.loading.loadedBytes), "Bytes read from the uploaded file so far."),
      renderMetricTile("Progress", `${Math.round(clamp(state.loading.progress, 0, 1) * 100)}%`, "Incremental parsing keeps the interface responsive."),
      renderMetricTile("Status", escapeHtml(state.loading.phase || "Preparing upload"), "The parser continues in the background of the interface."),
    ].join("")
  }

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
  if (!state.metadata && state.loading.active) {
    return renderEmptyState("Field mapping unlocks automatically after the dataset structure has been parsed.")
  }

  const options = state.metadata ? state.metadata.columns : []
  return `
    ${renderGlobalSelectField("Target column", "targetColumn", options, state.global.targetColumn, "Used as the default / non-default flag.")}
    ${renderGlobalSelectField("Date column", "dateColumn", options, state.global.dateColumn, "Used for chronological splits when available.")}
  `
}

function renderPreviewTable() {
  const columns = state.metadata.columns
  const rows = state.rows.slice(0, 10)
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
  const preparation = state.derived.preparation
  const missingPolicy = config.missingStrategy === "median_mode" ? "Median / mode" : "Missing bucket"

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
        ${renderMetricGrid([
          {
            label: "Rows prepared",
            value: formatInteger(preparation?.rows.length ?? 0),
            copy: "Observations carried through the current sample split.",
          },
          {
            label: "Missing policy",
            value: missingPolicy,
            copy: "The transformation rule applied before grouped buckets are assigned.",
          },
        ])}
      </div>
      <div class="panel-subgrid two-up">
        <section class="table-card">
          <div class="mini-heading">
            <p class="card-kicker">Sample split</p>
            <h3>Assigned sub-populations</h3>
          </div>
          ${
            preparation?.splitSummary?.length
              ? renderTable(
                  ["Sample", "Rows", "Default rate"],
                  preparation.splitSummary.map((item) => ({
                    Sample: item.sampleLabel,
                    Rows: formatInteger(item.count),
                    "Default rate": item.defaultRate === null ? "n/a" : formatPercent(item.defaultRate),
                  }))
                )
              : renderEmptyState("Map a target column to populate the sample split.")
          }
        </section>
        <section class="table-card">
          <div class="mini-heading">
            <p class="card-kicker">Data quality</p>
            <h3>Highest missingness</h3>
          </div>
          ${
            preparation?.missingSummary?.length
              ? renderTable(
                  ["Column", "Type", "Missing rate"],
                  preparation.missingSummary.map((item) => ({
                    Column: item.name,
                    Type: item.type,
                    "Missing rate": formatPercent(item.missingRate),
                  }))
                )
              : renderEmptyState("Upload a dataset to review missingness.")
          }
        </section>
      </div>
    </article>
  `
}

function renderEstimationControls() {
  const config = state.steps.estimation
  const features = state.steps.preparation.confirmedFeatures

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
            : renderEmptyState("Confirm variables in Data preparation first.")
        }
      </div>
    </article>
  `
}

function renderScoringControls() {
  const estimation = state.derived.estimation
  const scoring = state.derived.scoring
  if (!estimation?.ready) {
    return renderResultEmpty("Estimate the model first to unlock the interactive scoring scenario.")
  }

  return `
    <article class="card panel-card">
      <div class="panel-section">
        <p class="card-kicker">Scenario input</p>
        <h3>Select one bucket per final feature</h3>
        <p class="inline-note">Each dropdown is ordered by WOE within the corresponding feature, while the labels show only the bucket values for cleaner scenario entry.</p>
        <div class="field-grid compact-grid">
          ${scoring.featureOptions
            .map(
              (feature) => `
                <label class="field-card">
                  <span class="field-label">${escapeHtml(feature.name)}</span>
                  <select class="field-input" data-action="set-scoring-bucket" data-feature-name="${escapeHtml(feature.name)}">
                    <option value="">Select bucket</option>
                    ${feature.options
                      .map(
                        (option) => `
                          <option value="${escapeHtml(option.bucket)}" ${scoring.selectedBuckets[feature.name] === option.bucket ? "selected" : ""}>${escapeHtml(option.bucket)}</option>
                        `
                      )
                      .join("")}
                  </select>
                </label>
              `
            )
            .join("")}
        </div>
      </div>
      <div class="panel-section">
        <div class="callout-card">
          <strong>${scoring.complete ? "Scenario complete" : "Scenario incomplete"}</strong>
          <p>${
            scoring.complete
              ? "All final features have a selected bucket, so the simulator can compute the logit, PD, score, and final rating for the chosen case."
              : `Select ${formatInteger(scoring.missingSelections)} more feature bucket${scoring.missingSelections === 1 ? "" : "s"} to calculate the final score and rating.`
          }</p>
        </div>
        <div class="editor-toolbar">
          <button class="ghost-button small-button" type="button" data-action="clear-scoring-scenario">Clear selections</button>
        </div>
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
  const features = getEligibleFeatures()
  const hasPendingSelectionChanges = !areSameStringArrays(
    state.steps.preparation.selectedFeatures,
    state.steps.preparation.confirmedFeatures
  )
  if (!state.metadata) {
    return renderResultEmpty("Load a dataset and map the target column.")
  }

  return `
    <article class="card panel-card">
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
        <div class="feature-confirm-bar">
          <div class="feature-confirm-copy">
            <strong>${formatInteger(state.steps.preparation.confirmedFeatures.length)} confirmed variables</strong>
            <p>${
              hasPendingSelectionChanges
                ? "The selection changed. Confirm again to refresh WOE, IV, estimation, scoring, validation, monitoring, calibration, and Basel diagnostics."
                : state.steps.preparation.confirmedFeatures.length
                  ? "WOE, IV, and all downstream tabs are currently based on the confirmed variables below."
                  : "Choose variables and confirm them before the simulator calculates WOE, IV, and grouped-bucket diagnostics."
            }</p>
          </div>
          <button class="primary-button" type="button" data-action="confirm-preparation-features">
            Confirm selected variables
          </button>
        </div>
      </div>
    </article>
    ${
      preparation?.selectedFeatureDiagnostics?.length
        ? `<section class="preparation-diagnostics">
            ${renderPreparationDiagnosticsOverview(preparation)}
            ${preparation.selectedFeatureDiagnostics.map((feature) => renderPreparationFeatureCard(feature)).join("")}
          </section>`
        : renderResultEmpty(
            preparation?.message || "Confirm selected variables in Human in the loop to calculate WOE, IV, and bucket distributions."
          )
    }
  `
}

function renderPreparationDiagnosticsOverview(preparation) {
  const rankedFeatures = preparation.selectedFeatureDiagnostics.slice().sort((left, right) => right.iv - left.iv)
  const topFeature = rankedFeatures[0]
  return `
    <article class="card panel-card">
      <div class="mini-heading">
        <div>
          <p class="card-kicker">Information value</p>
          <h3>Selected variables ranked in decreasing order</h3>
        </div>
        <div class="feature-insight-meta">
          ${renderFeatureInsightBadge("Confirmed", formatInteger(preparation.confirmedFeatures.length))}
          ${renderFeatureInsightBadge("Top IV", topFeature ? formatDecimal(topFeature.iv, 3) : "n/a")}
        </div>
      </div>
      <p class="helper-copy">
        The chart includes only analyst-confirmed variables. Higher information values indicate stronger univariate separation between
        good and bad observations.
      </p>
      ${renderFeatureStrengthBars(rankedFeatures)}
    </article>
  `
}

function renderPreparationFeatureCard(feature) {
  return `
    <article class="card panel-card feature-diagnostic-card">
      <div class="mini-heading">
        <div>
          <p class="card-kicker">Selected variable</p>
          <h3>${escapeHtml(feature.name)}</h3>
        </div>
        <div class="feature-insight-meta">
          ${renderFeatureInsightBadge("IV", formatDecimal(feature.iv, 3))}
          ${renderFeatureInsightBadge("Missing", formatPercent(feature.missingRate))}
        </div>
      </div>
      <p class="helper-copy">
        ${escapeHtml(
          `${capitalize(feature.type)} feature with ${formatInteger(feature.estimationDistribution.reduce((sum, bucket) => sum + bucket.count, 0))} estimation rows across grouped buckets.`
        )}
      </p>
      <div class="panel-subgrid two-up">
        <section class="table-card">
          <div class="mini-heading">
            <p class="card-kicker">Weight of evidence</p>
            <h3>Grouped buckets</h3>
          </div>
          ${renderPreparationWoeChart(feature.bucketStats)}
        </section>
        <section class="table-card">
          <div class="mini-heading">
            <p class="card-kicker">Estimation sample</p>
            <h3>Bucket distribution</h3>
          </div>
          ${renderPreparationBucketDistributionChart(feature.estimationDistribution)}
        </section>
      </div>
    </article>
  `
}

function renderFeatureInsightBadge(label, value) {
  return `
    <span class="feature-insight-badge">
      <strong>${escapeHtml(label)}</strong>
      <span>${escapeHtml(value)}</span>
    </span>
  `
}

function renderPreparationWoeChart(bucketStats) {
  if (!bucketStats.length) {
    return renderEmptyState("WOE buckets appear after the variable is prepared.")
  }

  const rankedBuckets = bucketStats.slice().sort((left, right) => right.woe - left.woe || left.bucket.localeCompare(right.bucket))
  const maxAbsWoe = Math.max(...rankedBuckets.map((bucket) => Math.abs(bucket.woe)), 0.001)
  return `
    <div class="woe-list">
      ${rankedBuckets
        .map((bucket) => {
          const width = clamp(Math.abs(bucket.woe) / maxAbsWoe, 0, 1) * 50
          const fillClass = bucket.woe >= 0 ? "is-positive" : "is-negative"
          const style =
            bucket.woe >= 0 ? `left: 50%; width: ${width}%;` : `left: calc(50% - ${width}%); width: ${width}%;`

          return `
            <div class="woe-row">
              <div class="woe-header">
                <strong>${escapeHtml(bucket.bucket)}</strong>
                <span>${formatDecimal(bucket.woe, 3)}</span>
              </div>
              <div class="woe-track">
                <span class="woe-axis"></span>
                <span class="woe-fill ${fillClass}" style="${style}"></span>
              </div>
            </div>
          `
        })
        .join("")}
    </div>
  `
}

function renderPreparationBucketDistributionChart(distribution) {
  if (!distribution.length) {
    return renderEmptyState("Bucket distribution appears after the estimation sample is assigned.")
  }

  const rankedDistribution = distribution
    .slice()
    .sort((left, right) => right.woe - left.woe || right.share - left.share || left.bucket.localeCompare(right.bucket))
  return `
    <div class="bar-list">
      ${rankedDistribution
        .map((bucket) => `
          <div class="bar-row">
            <div class="bar-header">
              <strong>${escapeHtml(bucket.bucket)}</strong>
              <span>${formatPercent(bucket.share, 1)}</span>
            </div>
            <div class="bar-track">
              <div class="bar-fill" style="width:${bucket.share * 100}%"></div>
            </div>
            <div class="bucket-distribution-meta">
              <span>${formatInteger(bucket.count)} rows</span>
              <span>WOE ${formatDecimal(bucket.woe, 3)}</span>
            </div>
          </div>
        `)
        .join("")}
    </div>
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
          <h3>Bucket-level contributions ordered by WOE</h3>
        </div>
        ${renderScorecardTable(estimation.scorecardRows)}
      </section>
    </article>
  `
}

function renderScoringResults() {
  const scoring = state.derived.scoring
  if (!scoring?.ready) {
    return renderResultEmpty(scoring?.message || "Scoring becomes available after the model has been estimated.")
  }

  const ratingDefinition = RATING_MASTER_SCALE.find((item) => item.rating === scoring.rating)
  return `
    <article class="card panel-card">
      ${
        scoring.complete
          ? renderMetricGrid([
              {
                label: "Scenario score",
                value: formatInteger(scoring.score),
                copy: "Exact score implied by the selected feature buckets.",
              },
              {
                label: "Scenario PD",
                value: formatPercent(scoring.predictedPd),
                copy: "Probability of default from the logistic scorecard.",
              },
              {
                label: "Rating",
                value: scoring.rating,
                copy: ratingDefinition?.description || "Mapped from the PD master scale.",
              },
              {
                label: "Logit",
                value: formatDecimal(scoring.logit, 3),
                copy: "Latent logistic score before transformation into PD and points.",
              },
            ])
          : `<div class="callout-card">
              <strong>Complete the feature scenario</strong>
              <p>Select one bucket for each final feature to calculate the final score and rating. Until then, the scorecard remains available on the right for reference.</p>
            </div>`
      }
      <section class="table-card">
        <div class="mini-heading">
          <p class="card-kicker">Scenario output</p>
          <h3>Selected bucket contributions</h3>
        </div>
        ${
          scoring.complete
            ? renderScorecardTable(scoring.selectedRows)
            : renderEmptyState("The selected bucket contributions appear once every final feature has a chosen bucket.")
        }
      </section>
    </article>
    <article class="card panel-card">
      <section class="table-card">
        <div class="mini-heading">
          <p class="card-kicker">Reference scorecard</p>
          <h3>All feature buckets</h3>
        </div>
        ${renderScorecardTable(scoring.scorecardRows)}
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

function sortScorecardRows(rows) {
  return rows
    .slice()
    .sort(
      (left, right) =>
        (left.featureOrder ?? Number.MAX_SAFE_INTEGER) - (right.featureOrder ?? Number.MAX_SAFE_INTEGER) ||
        right.woe - left.woe ||
        left.bucket.localeCompare(right.bucket)
    )
}

function renderScorecardTable(rows) {
  return renderTable(
    ["Feature", "Bucket", "WOE", "Score"],
    sortScorecardRows(rows).map((row) => ({
      Feature: row.feature,
      Bucket: row.bucket,
      WOE: formatDecimal(row.woe, 3),
      Score: formatInteger(row.score),
    }))
  )
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

function refreshDocuments(source = "ui") {
  STEP_DEFINITIONS.forEach((stepDefinition) => {
    refreshDocumentsForStep(stepDefinition.key, source)
  })
}

function refreshDocumentsForStep(stepKey, source = "ui") {
  const currentDocuments = state.documents[stepKey]
  if (source === "editor" && currentDocuments) {
    const currentCodeNotes = extractAnalystNotes(currentDocuments.code)
    const currentMethodologyNotes = extractAnalystNotes(currentDocuments.methodology)
    if (currentCodeNotes !== null) {
      state.notes[stepKey].code = currentCodeNotes
    }
    if (currentMethodologyNotes !== null) {
      state.notes[stepKey].methodology = currentMethodologyNotes
    }
  }

  state.documents[stepKey] = {
    code: buildCodeDocument(stepKey),
    methodology: buildMethodologyDocument(stepKey),
  }
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
    "% CREDIT RISK WITH AI :: STATE JSON START",
    ...json.split("\n").map((line) => `% ${line}`),
    "% CREDIT RISK WITH AI :: STATE JSON END",
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
    "% CREDIT RISK WITH AI :: ANALYST NOTES START",
    ...notes.split("\n").map((line) => `% ${line}`),
    "% CREDIT RISK WITH AI :: ANALYST NOTES END",
  ].join("\n")
}

function buildCodeBody(stepKey) {
  const preparation = state.derived.preparation
  const estimation = state.derived.estimation
  const scoring = state.derived.scoring
  const validation = state.derived.validation
  const monitoring = state.derived.monitoring
  const calibration = state.derived.calibration
  const basel3 = state.derived.basel3
  const basel4 = state.derived.basel4

  switch (stepKey) {
    case "description":
      return [
        "###############################################################################",
        "# Credit risk with AI - Description",
        "###############################################################################",
        "# This section introduces the simulator before any portfolio data is loaded.",
        "# Recommended order: Description -> Portfolio Workspace -> Data Preparation ->",
        "# Estimation -> Scoring -> Validation -> Monitoring -> Calibration ->",
        "# Basel III RWA -> Basel IV RWA.",
        "",
        "# The simulator keeps the interface, the generated R code, and the methodology",
        "# synchronized so the user can move from exploration to implementation without",
        "# losing the narrative of the workflow.",
      ].join("\n")
    case "workspace": {
      const mappedFields = Object.entries(state.global).filter(([, value]) => value)
      const mappingLines = mappedFields.length
        ? mappedFields.map(([configKey, value]) => `${configKey} <- ${quoteRString(value)}`)
        : ["# No global field mappings have been confirmed yet."]
      const datasetSummary = state.metadata
        ? `# Browser summary: ${state.metadata.rows.length} rows, ${state.metadata.columns.length} columns, dataset ${state.datasetName || "portfolio.csv"}.`
        : "# Browser summary: Load a dataset to inspect the portfolio workspace."

      return [
        "###############################################################################",
        "# Credit risk with AI - Portfolio Workspace",
        "###############################################################################",
        "rm(list = ls())",
        "",
        "library(readr)",
        "library(dplyr)",
        "",
        `dataset_file <- ${quoteRString(state.datasetName || "portfolio.csv")}`,
        "dataset <- read_csv(dataset_file, show_col_types = FALSE)",
        "",
        "# Global field mapping",
        ...mappingLines,
        "",
        "# Recommended first checks",
        "glimpse(dataset)",
        "summary(dataset)",
        "",
        datasetSummary,
      ].join("\n")
    }
    case "preparation": {
      const datasetFile = quoteRString(state.datasetName || "portfolio.csv")
      const targetColumn = quoteRString(state.global.targetColumn || "Default_Flag")
      const dateColumn = state.global.dateColumn ? quoteRString(state.global.dateColumn) : "NULL"
      const draftSelectedVariables = renderRCharacterVector(state.steps.preparation.selectedFeatures)
      const confirmedVariables = renderRCharacterVector(state.steps.preparation.confirmedFeatures)
      const missingPolicy = quoteRString(state.steps.preparation.missingStrategy)
      const shareConfig = preparation?.shareConfig || {
        estimation: 0.6,
        validation: 0.2,
        monitoring: 0.1,
        calibration: 0.1,
      }
      return [
        "###############################################################################",
        "# Credit risk with AI - Data Preparation",
        "###############################################################################",
        "rm(list = ls())",
        "",
        "library(dplyr)",
        "library(readr)",
        "library(tidyr)",
        "library(purrr)",
        "library(ggplot2)",
        "library(scales)",
        "",
        `dataset <- read_csv(${datasetFile}, show_col_types = FALSE)`,
        `target_column <- ${targetColumn}`,
        `date_column <- ${dateColumn}`,
        `draft_selected_variables <- ${draftSelectedVariables}`,
        `confirmed_variables <- ${confirmedVariables}`,
        `missing_policy <- ${missingPolicy}`,
        `bin_count <- ${Math.round(state.steps.preparation.binCount)}`,
        `sample_shares <- c(estimation = ${formatDecimal(shareConfig.estimation, 3)}, validation = ${formatDecimal(
          shareConfig.validation,
          3
        )}, monitoring = ${formatDecimal(shareConfig.monitoring, 3)}, calibration = ${formatDecimal(shareConfig.calibration, 3)})`,
        "",
        "# Analyst confirmation is required before WOE, IV, and grouped-bucket diagnostics are produced.",
        "if (!target_column %in% names(dataset)) stop('The mapped target column is not available in the input data.')",
        "",
        "trim_text <- function(x) {",
        "  output <- trimws(as.character(x))",
        "  output[is.na(x)] <- NA_character_",
        "  output",
        "}",
        "",
        "parse_numeric <- function(x) {",
        "  cleaned <- gsub('[^0-9,.-]', '', trim_text(x))",
        "  cleaned <- gsub(',', '.', cleaned, fixed = TRUE)",
        "  suppressWarnings(as.numeric(cleaned))",
        "}",
        "",
        "parse_dates <- function(x) {",
        "  suppressWarnings(as.POSIXct(trim_text(x), tz = 'UTC'))",
        "}",
        "",
        "looks_binary <- function(x) {",
        "  values <- unique(tolower(trim_text(x)))",
        "  values <- values[values != '' & !is.na(values)]",
        "  length(values) > 0 && length(values) <= 2 && all(values %in% c('0', '1', 'yes', 'no', 'true', 'false', 'y', 'n', 'default', 'non-default'))",
        "}",
        "",
        "mode_value <- function(x) {",
        "  values <- trim_text(x)",
        "  values <- values[values != '' & !is.na(values)]",
        "  if (!length(values)) return('Missing')",
        "  counts <- sort(table(values), decreasing = TRUE)",
        "  names(counts)[1]",
        "}",
        "",
        "infer_column_type <- function(x) {",
        "  values <- trim_text(x)",
        "  values <- values[values != '' & !is.na(values)]",
        "  if (!length(values)) return('categorical')",
        "  numeric_share <- mean(!is.na(parse_numeric(values)))",
        "  date_share <- mean(!is.na(parse_dates(values)))",
        "  if (looks_binary(values)) 'binary' else if (date_share > 0.7) 'date' else if (numeric_share > 0.8) 'numeric' else 'categorical'",
        "}",
        "",
        "normalise_target <- function(x) {",
        "  values <- tolower(trim_text(x))",
        "  dplyr::case_when(",
        "    values %in% c('1', 'yes', 'true', 'y', 'default', 'bad') ~ 1,",
        "    values %in% c('0', 'no', 'false', 'n', 'non-default', 'good') ~ 0,",
        "    TRUE ~ suppressWarnings(as.numeric(values))",
        "  )",
        "}",
        "",
        "build_numeric_breaks <- function(x, bins) {",
        "  numeric_values <- parse_numeric(x)",
        "  numeric_values <- numeric_values[is.finite(numeric_values)]",
        "  if (length(numeric_values) <= 1) return(numeric(0))",
        "  probs <- seq(0, 1, length.out = bins + 1)",
        "  unique(as.numeric(stats::quantile(numeric_values, probs = probs, na.rm = TRUE, names = FALSE, type = 7)))",
        "}",
        "",
        "bucket_feature <- function(x, feature_type, breaks, missing_policy) {",
        "  raw_text <- trim_text(x)",
        "  missing_index <- is.na(x) | is.na(raw_text) | raw_text == ''",
        "  if (feature_type == 'numeric') {",
        "    numeric_x <- parse_numeric(x)",
        "    median_value <- stats::median(numeric_x, na.rm = TRUE)",
        "    if (!is.finite(median_value)) median_value <- 0",
        "    if (missing_policy == 'median_mode') {",
        "      numeric_x[missing_index | !is.finite(numeric_x)] <- median_value",
        "      if (length(breaks) < 2) return(rep('All values', length(numeric_x)))",
        "      return(as.character(cut(numeric_x, breaks = breaks, include.lowest = TRUE, right = FALSE, dig.lab = 10)))",
        "    }",
        "    bucket <- rep(NA_character_, length(numeric_x))",
        "    observed <- !(missing_index | !is.finite(numeric_x))",
        "    if (any(observed) && length(breaks) >= 2) {",
        "      bucket[observed] <- as.character(cut(numeric_x[observed], breaks = breaks, include.lowest = TRUE, right = FALSE, dig.lab = 10))",
        "    } else if (any(observed)) {",
        "      bucket[observed] <- 'All values'",
        "    }",
        "    bucket[!observed] <- 'Missing'",
        "    return(bucket)",
        "  }",
        "  bucket <- raw_text",
        "  if (missing_policy == 'median_mode') {",
        "    bucket[missing_index] <- mode_value(raw_text)",
        "  } else {",
        "    bucket[missing_index] <- 'Missing'",
        "  }",
        "  bucket",
        "}",
        "",
        "compute_woe_iv <- function(bucket, target) {",
        "  epsilon <- 1e-5",
        "  summary_tbl <- tibble(bucket = bucket, target = target) %>%",
        "    filter(!is.na(target), !is.na(bucket), bucket != '') %>%",
        "    count(bucket, target, name = 'n') %>%",
        "    pivot_wider(names_from = target, values_from = n, values_fill = 0)",
        "  if (!'0' %in% names(summary_tbl)) summary_tbl[['0']] <- 0",
        "  if (!'1' %in% names(summary_tbl)) summary_tbl[['1']] <- 0",
        "  summary_tbl %>%",
        "    transmute(",
        "      bucket = bucket,",
        "      good = `0`,",
        "      bad = `1`,",
        "      good_share = (good + epsilon) / (sum(good) + epsilon),",
        "      bad_share = (bad + epsilon) / (sum(bad) + epsilon),",
        "      woe = -log(bad_share / good_share),",
        "      iv_contribution = (good_share - bad_share) * woe,",
        "      bad_rate = bad / pmax(good + bad, 1)",
        "    )",
        "}",
        "",
        "assign_samples <- function(data, date_column, shares) {",
        "  ordering <- seq_len(nrow(data))",
        "  if (!is.null(date_column) && nzchar(date_column) && date_column %in% names(data)) {",
        "    parsed_dates <- parse_dates(data[[date_column]])",
        "    ordering <- order(ifelse(is.na(parsed_dates), Inf, as.numeric(parsed_dates)), seq_len(nrow(data)))",
        "  }",
        "  counts <- floor(nrow(data) * shares[c('estimation', 'validation', 'monitoring')])",
        "  counts <- as.integer(counts)",
        "  samples <- rep('calibration', nrow(data))",
        "  cursor <- 1L",
        "  assign_block <- function(label, count, cursor) {",
        "    if (count <= 0) return(cursor)",
        "    idx <- ordering[seq.int(cursor, length.out = count)]",
        "    samples[idx] <<- label",
        "    cursor + count",
        "  }",
        "  cursor <- assign_block('estimation', counts[1], cursor)",
        "  cursor <- assign_block('validation', counts[2], cursor)",
        "  cursor <- assign_block('monitoring', counts[3], cursor)",
        "  tibble(sample = samples)",
        "}",
        "",
        "safe_stem <- function(x) {",
        "  gsub('_+', '_', gsub('[^A-Za-z0-9]+', '_', tolower(x)))",
        "}",
        "",
        "portfolio_prepared <- dataset %>%",
        "  mutate(",
        "    .row_id = row_number(),",
        "    .target = normalise_target(.data[[target_column]])",
        "  ) %>%",
        "  bind_cols(assign_samples(., date_column, sample_shares))",
        "",
        "data_quality_summary <- tibble(",
        "  column = names(dataset),",
        "  type = map_chr(names(dataset), ~ infer_column_type(dataset[[.x]])),",
        "  missing_rate = map_dbl(names(dataset), ~ mean(is.na(dataset[[.x]]) | trim_text(dataset[[.x]]) == ''))",
        ") %>%",
        "  arrange(desc(missing_rate))",
        "",
        "sample_split_summary <- portfolio_prepared %>%",
        "  group_by(sample) %>%",
        "  summarise(",
        "    rows = n(),",
        "    default_rate = mean(.target, na.rm = TRUE),",
        "    .groups = 'drop'",
        "  )",
        "",
        "feature_diagnostics <- list()",
        "iv_ranking <- tibble(variable = character(), information_value = double())",
        "",
        "if (length(confirmed_variables) > 0) {",
        "  feature_diagnostics <- map(confirmed_variables, function(feature_name) {",
        "    feature_type <- infer_column_type(portfolio_prepared[[feature_name]])",
        "    numeric_breaks <- if (feature_type == 'numeric') build_numeric_breaks(portfolio_prepared[[feature_name]], bin_count) else numeric(0)",
        "    bucket <- bucket_feature(portfolio_prepared[[feature_name]], feature_type, numeric_breaks, missing_policy)",
        "    woe_table <- compute_woe_iv(bucket, portfolio_prepared$.target)",
        "    estimation_distribution <- tibble(bucket = bucket[portfolio_prepared$sample == 'estimation']) %>%",
        "      filter(!is.na(bucket), bucket != '') %>%",
        "      count(bucket, name = 'count') %>%",
        "      mutate(share = count / sum(count)) %>%",
        "      right_join(woe_table %>% select(bucket, woe), by = 'bucket') %>%",
        "      mutate(",
        "        count = replace_na(count, 0L),",
        "        share = replace_na(share, 0)",
        "      )",
        "    list(",
        "      variable = feature_name,",
        "      feature_type = feature_type,",
        "      information_value = sum(woe_table$iv_contribution, na.rm = TRUE),",
        "      woe_table = woe_table,",
        "      estimation_distribution = estimation_distribution",
        "    )",
        "  })",
        "",
        "  iv_ranking <- map_dfr(feature_diagnostics, function(item) {",
        "    tibble(variable = item$variable, information_value = item$information_value)",
        "  }) %>%",
        "    arrange(desc(information_value))",
        "}",
        "",
        "iv_chart <- NULL",
        "diagnostic_plots <- list()",
        "",
        "if (nrow(iv_ranking) > 0) {",
        "  iv_chart <- ggplot(iv_ranking, aes(x = reorder(variable, information_value), y = information_value)) +",
        "    geom_col(fill = '#1a35a8') +",
        "    coord_flip() +",
        "    scale_y_continuous(labels = number_format(accuracy = 0.001)) +",
        "    labs(title = 'Information value ranking', x = NULL, y = 'Information value') +",
        "    theme_minimal(base_size = 12)",
        "",
        "  diagnostic_plots <- map(feature_diagnostics, function(item) {",
        "    list(",
        "      woe = ggplot(item$woe_table, aes(x = reorder(bucket, woe), y = woe, fill = woe >= 0)) +",
        "        geom_col(show.legend = FALSE) +",
        "        coord_flip() +",
        "        labs(title = paste('WOE by bucket -', item$variable), x = NULL, y = 'WOE') +",
        "        scale_fill_manual(values = c('TRUE' = '#1a35a8', 'FALSE' = '#ff5a0a')) +",
        "        theme_minimal(base_size = 12),",
        "      distribution = ggplot(item$estimation_distribution, aes(x = reorder(bucket, share), y = share)) +",
        "        geom_col(fill = '#ff5a0a') +",
        "        coord_flip() +",
        "        scale_y_continuous(labels = percent_format(accuracy = 0.1)) +",
        "        labs(title = paste('Estimation sample distribution -', item$variable), x = NULL, y = 'Share of estimation sample') +",
        "        theme_minimal(base_size = 12)",
        "    )",
        "  })",
        "}",
        "",
        "write_csv(sample_split_summary, 'sample_split_summary.csv')",
        "write_csv(data_quality_summary, 'data_quality_summary.csv')",
        "if (nrow(iv_ranking) > 0) write_csv(iv_ranking, 'information_value_ranking.csv')",
        "walk(feature_diagnostics, function(item) {",
        "  write_csv(item$woe_table, paste0('woe_', safe_stem(item$variable), '.csv'))",
        "  write_csv(item$estimation_distribution, paste0('estimation_distribution_', safe_stem(item$variable), '.csv'))",
        "})",
        "if (!is.null(iv_chart)) ggsave('information_value_ranking.png', iv_chart, width = 8, height = 5, dpi = 160)",
        "",
        `# Browser summary: ${preparation?.ready ? `${preparation.rows.length} rows prepared, ${state.steps.preparation.confirmedFeatures.length} confirmed variables, and live WOE / IV diagnostics for the Data Preparation tab.` : "Load data, map the target, confirm variables, and rerun the script."}`,
      ].join("\n")
    }
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
    case "scoring": {
      const scoringRows = sortScorecardRows(scoring?.scorecardRows || [])
      const selectedBucketPairs =
        scoring?.featureOptions?.length
          ? scoring.featureOptions.map((feature) => `${quoteRString(feature.name)} = ${quoteRString(scoring.selectedBuckets?.[feature.name] || "")}`).join(", ")
          : ""
      const scorecardValues = scoringRows.length
        ? scoringRows
            .map(
              (row) =>
                `  ${quoteRString(row.feature)}, ${quoteRString(row.bucket)}, ${formatDecimal(row.woe, 6)}, ${formatDecimal(row.score, 0)}`
            )
            .join(",\n")
        : `  ${quoteRString("Feature")}, ${quoteRString("Bucket")}, 0, 0`
      const coefficientValues =
        estimation?.finalFeatures?.length
          ? estimation.finalFeatures
              .map(
                (feature, featureIndex) => `  ${quoteRString(feature.name)} = ${formatDecimal(estimation.model.beta[featureIndex + 1], 6)}`
              )
              .join(",\n")
          : `  ${quoteRString("feature")} = 0`
      return [
        "###############################################################################",
        "# Credit risk with AI - Scoring",
        "###############################################################################",
        "rm(list = ls())",
        "",
        "library(dplyr)",
        "library(tibble)",
        "",
        `selected_buckets <- list(${selectedBucketPairs})`,
        `score_offset <- ${formatDecimal(state.steps.estimation.scoreOffset, 3)}`,
        `score_factor <- ${formatDecimal(state.steps.estimation.scoreFactor, 3)}`,
        `intercept <- ${formatDecimal(estimation?.model?.beta?.[0] ?? 0, 6)}`,
        "",
        "scorecard <- tibble::tribble(",
        "  ~Feature, ~Bucket, ~WOE, ~Score,",
        scorecardValues,
        ")",
        "",
        "coefficients <- c(",
        coefficientValues,
        ")",
        "",
        "lookup_bucket <- function(feature_name, bucket_name) {",
        "  scorecard %>% filter(Feature == feature_name, Bucket == bucket_name) %>% slice(1)",
        "}",
        "",
        "selected_rows <- bind_rows(lapply(names(selected_buckets), function(feature_name) {",
        "  bucket_name <- selected_buckets[[feature_name]]",
        "  if (!nzchar(bucket_name)) return(NULL)",
        "  lookup_bucket(feature_name, bucket_name)",
        "}))",
        "",
        "selected_rows <- selected_rows %>%",
        "  mutate(coefficient = coefficients[Feature])",
        "",
        "scenario_logit <- intercept + sum(selected_rows$WOE * selected_rows$coefficient, na.rm = TRUE)",
        "scenario_pd <- 1 / (1 + exp(-scenario_logit))",
        "scenario_score <- round(score_offset + score_factor * scenario_logit)",
        "",
        "assign_rating <- function(pd) {",
        "  dplyr::case_when(",
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
        "scenario_rating <- assign_rating(scenario_pd)",
        "print(selected_rows %>% arrange(Feature, desc(WOE)))",
        "print(tibble(score = scenario_score, pd = scenario_pd, rating = scenario_rating))",
        "",
        `# Browser summary: ${scoring?.ready ? `Scoring tab ready with ${scoring.featureOptions.length} selectable model features.` : "Estimate the model before scoring a single case."}`,
      ].join("\n")
    }
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
  const scoring = state.derived.scoring
  const validation = state.derived.validation
  const monitoring = state.derived.monitoring
  const calibration = state.derived.calibration
  const basel3 = state.derived.basel3
  const basel4 = state.derived.basel4

  switch (stepKey) {
    case "description":
      return [
        "\\section{Description}",
        "This simulator is structured as a guided learning and working environment for an end-to-end credit risk workflow.",
        "",
        ...latexItemizeLines([
          escapeLatex("Start with the Description tab to understand the workflow and outputs."),
          escapeLatex("Use Portfolio Workspace to upload data, map fields, and inspect the portfolio structure."),
          escapeLatex("Progress through preparation, estimation, scoring, validation, monitoring, calibration, and capital tabs in sequence."),
          escapeLatex("Export synchronized R code and methodology whenever a stage is ready."),
        ]),
        "",
        "The goal is to make a multi-stage modeling process easier to follow, easier to explain, and easier to connect with implementation artifacts.",
      ].join("\n")
    case "workspace": {
      const mappedFields = Object.entries(state.global)
        .filter(([, value]) => value)
        .map(([configKey, value]) => `${configKey} mapped to ${value}`)
      const summaryItems = state.metadata
        ? [
            `Dataset loaded in the browser workspace: ${state.datasetName || "portfolio.csv"}.`,
            `Observed structure: ${state.metadata.rows.length} rows and ${state.metadata.columns.length} columns.`,
            mappedFields.length ? `Mapped fields: ${mappedFields.join("; ")}.` : "Mapped fields: no global mappings confirmed yet.",
          ]
        : ["No dataset has been loaded yet.", "Global field mapping remains pending until a portfolio is uploaded."]

      return [
        "\\section{Portfolio Workspace}",
        "The simulator begins with a browser-side portfolio workspace where the user uploads the source file, reviews the inferred structure, and maps the global fields required by downstream modeling steps.",
        "",
        ...latexItemizeLines(summaryItems.map((item) => escapeLatex(item))),
        "",
        "This stage remains local to the browser so the user can inspect the portfolio before feature engineering, model estimation, validation, and capital analytics are activated.",
      ].join("\n")
    }
    case "preparation": {
      const configuredShares = escapeLatex(
        [
          `estimation ${formatPercent(preparation?.shareConfig?.estimation ?? 0.6, 1)}`,
          `validation ${formatPercent(preparation?.shareConfig?.validation ?? 0.2, 1)}`,
          `monitoring ${formatPercent(preparation?.shareConfig?.monitoring ?? 0.1, 1)}`,
          `calibration ${formatPercent(preparation?.shareConfig?.calibration ?? 0.1, 1)}`,
        ].join(", ")
      )
      const realizedSplit = escapeLatex(
        preparation?.splitSummary?.length
          ? preparation.splitSummary
              .map((item) => `${item.sampleLabel}: ${formatInteger(item.count)} rows${item.defaultRate === null ? "" : ` at ${formatPercent(item.defaultRate)} default rate`}`)
              .join("; ")
          : "No sample allocation is available yet."
      )
      const ivRanking = escapeLatex(
        preparation?.selectedFeatureDiagnostics?.length
          ? preparation.selectedFeatureDiagnostics
              .slice()
              .sort((left, right) => right.iv - left.iv)
              .map((feature) => `${feature.name} (${formatDecimal(feature.iv, 3)})`)
              .join("; ")
          : "Information values will appear after variables are confirmed."
      )
      return [
        "\\section{Data Preparation}",
        "\\subsection{Objective}",
        "This section formalizes the data preparation stage as an analyst-governed transformation of the uploaded portfolio into a modelling-ready analytical base table. The workflow combines structural quality review, deterministic sample construction, grouped bucket creation, and weight-of-evidence diagnostics before model estimation is permitted.",
        "\\subsection{Configuration}",
        ...latexItemizeLines([
          `Dataset: \\texttt{${escapeLatex(state.datasetName || "No dataset loaded")}}.`,
          `Target variable: \\texttt{${escapeLatex(state.global.targetColumn || "Not mapped")}}.`,
          `Date variable: \\texttt{${escapeLatex(state.global.dateColumn || "Not mapped")}}.`,
          `Confirmed variables: \\texttt{${escapeLatex(state.steps.preparation.confirmedFeatures.join(", ") || "None confirmed")}}.`,
        ]),
        "For each variable $j$, the missingness ratio shown in the data quality card is",
        "\\begin{equation}",
        "m_j = \\frac{1}{N} \\sum_{i=1}^{N} \\mathbb{I}\\{x_{ij} \\text{ is missing}\\}.",
        "\\end{equation}",
        "Requested sample shares are normalized before assignment:",
        "\\begin{equation}",
        "s_k = \\frac{s_k^{\\ast}}{\\sum_{\\ell \\in \\{E,V,M,C\\}} s_{\\ell}^{\\ast}}.",
        "\\end{equation}",
        "For each confirmed feature $j$ and bucket $b$, Weight of Evidence is computed as",
        "\\begin{equation}",
        "\\operatorname{WOE}_{jb} = -\\log\\left(\\frac{\\operatorname{BadShare}_{jb} + \\varepsilon}{\\operatorname{GoodShare}_{jb} + \\varepsilon}\\right), \\qquad \\varepsilon = 10^{-5}.",
        "\\end{equation}",
        "The Information Value contribution and total Information Value are",
        "\\begin{align}",
        "\\operatorname{IV}_{jb} &= \\left(\\operatorname{GoodShare}_{jb} - \\operatorname{BadShare}_{jb}\\right) \\operatorname{WOE}_{jb}, \\\\",
        "\\operatorname{IV}_{j} &= \\sum_{b \\in \\mathcal{B}_j} \\operatorname{IV}_{jb}.",
        "\\end{align}",
        "The estimation-sample bucket distribution card reports",
        "\\begin{equation}",
        "p_{jb}^{(E)} = \\frac{n_{jb}^{(E)}}{\\sum_{c \\in \\mathcal{B}_j} n_{jc}^{(E)}}.",
        "\\end{equation}",
        "\\subsection{Current Analytical Reading}",
        ...latexItemizeLines([
          `Rows prepared: ${escapeLatex(preparation?.ready ? formatInteger(preparation.rows.length) : "n/a")}.`,
          `Configured sample shares: ${configuredShares}.`,
          `Realized sample allocation: ${realizedSplit}.`,
          `Information value ranking: ${ivRanking}.`,
        ]),
      ].join("\n")
    }
    case "estimation":
      return [
        "\\section{Estimation of Rating Model}",
        "\\subsection{Objective}",
        "The estimation stage fits a penalized logistic scorecard on the estimation sample using the WOE representation of the analyst-confirmed features that survive the IV threshold.",
        "For observation $i$, the latent score is",
        "\\begin{equation}",
        "\\eta_i = \\beta_0 + \\sum_{j=1}^{p} \\beta_j w_{ij}.",
        "\\end{equation}",
        "The model-implied probability of default is",
        "\\begin{equation}",
        "\\operatorname{PD}_i = \\frac{1}{1 + e^{-\\eta_i}},",
        "\\end{equation}",
        "while the operational score is",
        "\\begin{equation}",
        "\\operatorname{Score}_i = \\operatorname{Offset} + \\operatorname{Factor} \\cdot \\eta_i.",
        "\\end{equation}",
        "The bucket-level scorecard table distributes the intercept across features and evaluates",
        "\\begin{equation}",
        "s_{jb} = \\left\\lfloor \\left(\\beta_j \\operatorname{WOE}_{jb} + \\frac{\\beta_0}{p}\\right) \\operatorname{Factor} + \\frac{\\operatorname{Offset}}{p} \\right\\rfloor.",
        "\\end{equation}",
        "Discrimination is summarized through",
        "\\begin{equation}",
        "\\operatorname{AR} = 2\\operatorname{AUC} - 1.",
        "\\end{equation}",
        "\\subsection{Current Analytical Reading}",
        ...latexItemizeLines([
          `Active model features: \\texttt{${escapeLatex(estimation?.ready ? estimation.finalFeatures.map((feature) => feature.name).join(", ") : "n/a")}}.`,
          `Estimation AUC: ${escapeLatex(estimation?.ready ? formatDecimal(estimation.estimationMetrics.auc, 3) : "n/a")}.`,
          `Estimation AR: ${escapeLatex(estimation?.ready ? formatPercent(estimation.estimationMetrics.ar, 1) : "n/a")}.`,
          `Average PD: ${escapeLatex(estimation?.ready ? formatPercent(estimation.averagePd) : "n/a")}.`,
        ]),
      ].join("\n")
    case "scoring":
      return [
        "\\section{Scoring}",
        "\\subsection{Objective}",
        "The scoring tab applies the estimated scorecard to a single analyst-defined scenario. One bucket is selected for each final feature and the scenario is evaluated with the fitted logistic model.",
        "\\begin{equation}",
        "\\eta^{\\star} = \\beta_0 + \\sum_{j=1}^{p} \\beta_j \\operatorname{WOE}_{j b_j^{\\star}}.",
        "\\end{equation}",
        "\\begin{align}",
        "\\operatorname{PD}^{\\star} &= \\frac{1}{1 + e^{-\\eta^{\\star}}}, \\\\",
        "\\operatorname{Score}^{\\star} &= \\operatorname{Offset} + \\operatorname{Factor} \\cdot \\eta^{\\star}.",
        "\\end{align}",
        "The final rating is obtained by mapping $\\operatorname{PD}^{\\star}$ into the master scale used in the estimation stage. All displayed scorecard rows are ordered by WOE within feature to facilitate scenario interpretation.",
        "\\subsection{Current Analytical Reading}",
        ...latexItemizeLines([
          `Selectable model features: ${escapeLatex(formatInteger(scoring?.featureOptions?.length || 0))}.`,
          `Scenario completeness: ${escapeLatex(scoring?.complete ? "Complete" : "Incomplete")}.`,
          `Scenario score: ${escapeLatex(scoring?.complete ? formatInteger(scoring.score) : "n/a")}.`,
          `Scenario PD: ${escapeLatex(scoring?.complete ? formatPercent(scoring.predictedPd) : "n/a")}.`,
          `Scenario rating: ${escapeLatex(scoring?.complete ? scoring.rating : "n/a")}.`,
        ]),
      ].join("\n")
    case "validation":
      return [
        "\\section{Validation of Rating Model}",
        "\\subsection{Objective}",
        "The validation stage challenges the model on an out-of-sample population and assesses both discrimination stability and rating-distribution drift.",
        "\\begin{equation}",
        "\\widehat{y}_i = \\mathbb{I}\\{\\operatorname{PD}_i \\geq \\tau\\},",
        "\\end{equation}",
        `where $\\tau = ${escapeLatex(formatPercent(state.steps.validation.classificationThreshold))}$ is the analyst-defined operating threshold.`,
        "Distribution drift is measured by the System Stability Index",
        "\\begin{equation}",
        "\\operatorname{SSI} = \\sum_{k} (q_k - p_k) \\log\\left(\\frac{q_k + \\alpha}{p_k + \\alpha}\\right),",
        "\\end{equation}",
        `with smoothing parameter $\\alpha = ${escapeLatex(formatDecimal(state.steps.validation.ssiSmoothing, 6))}$.`,
        "\\subsection{Current Analytical Reading}",
        ...latexItemizeLines([
          `Estimation AR: ${escapeLatex(validation?.ready ? formatPercent(validation.estimationMetrics.ar, 1) : "n/a")}.`,
          `Validation AR: ${escapeLatex(validation?.ready ? formatPercent(validation.validationMetrics.ar, 1) : "n/a")}.`,
          `SSI: ${escapeLatex(validation?.ready ? formatDecimal(validation.ssi, 3) : "n/a")}.`,
          `Validation verdict: ${escapeLatex(validation?.ready ? deriveValidationVerdict(validation) : "n/a")}.`,
        ]),
      ].join("\n")
    case "monitoring":
      return [
        "\\section{Monitoring of Rating Model}",
        "\\subsection{Objective}",
        "The monitoring stage operationalizes ongoing model surveillance and focuses on discrimination drift, rating drift, and observed default-rate misalignment.",
        "\\begin{equation}",
        "\\operatorname{DR/PD} = \\frac{\\overline{\\operatorname{DR}}}{\\overline{\\operatorname{PD}}}.",
        "\\end{equation}",
        "The SSI statistic from validation is reused to quantify rating distribution drift against the estimation benchmark.",
        "\\subsection{Current Analytical Reading}",
        ...latexItemizeLines([
          `Monitoring sample: ${escapeLatex(capitalize(state.steps.monitoring.sampleSource))}.`,
          `SSI alert level: ${escapeLatex(formatDecimal(state.steps.monitoring.driftThreshold, 3))}.`,
          `DR/PD alert factor: ${escapeLatex(formatDecimal(state.steps.monitoring.defaultPdAlert, 2))}.`,
          `Monitoring AR: ${escapeLatex(monitoring?.ready ? formatPercent(monitoring.monitoringMetrics.ar, 1) : "n/a")}.`,
          `SSI: ${escapeLatex(monitoring?.ready ? formatDecimal(monitoring.ssi, 3) : "n/a")}.`,
          `DR/PD factor: ${escapeLatex(monitoring?.ready ? formatDecimal(monitoring.drPdFactor, 2) : "n/a")}.`,
        ]),
      ].join("\n")
    case "calibration":
      return [
        "\\section{Calibration of Rating Model}",
        "\\subsection{Objective}",
        "The calibration stage preserves the ranking order of the estimated model while shifting the average PD level toward a selected anchor point.",
        "\\begin{equation}",
        "\\Delta = \\operatorname{logit}(a) - \\operatorname{logit}(\\bar{p}),",
        "\\end{equation}",
        "where $a$ denotes the target anchor and $\\bar{p}$ denotes the mean predicted PD on the selected calibration population.",
        "\\begin{equation}",
        "\\operatorname{PD}^{\\mathrm{cal}}_i = \\sigma\\left(\\operatorname{logit}(\\operatorname{PD}_i) + \\Delta\\right).",
        "\\end{equation}",
        "\\subsection{Current Analytical Reading}",
        ...latexItemizeLines([
          `Observed anchor: ${escapeLatex(calibration?.ready ? formatPercent(calibration.observedAnchor) : "n/a")}.`,
          `Target anchor: ${escapeLatex(calibration?.ready ? formatPercent(calibration.anchorRate) : "n/a")}.`,
          `Average PD before: ${escapeLatex(calibration?.ready ? formatPercent(calibration.averagePredictedPd) : "n/a")}.`,
          `Average PD after: ${escapeLatex(calibration?.ready ? formatPercent(calibration.averageCalibratedPd) : "n/a")}.`,
        ]),
      ].join("\n")
    case "basel3":
      return [
        "\\section{Basel III Risk-Weighted Assets}",
        "\\subsection{Objective}",
        "The Basel III view translates model outputs into an IRB-style mortgage capital measure under analyst-selected parameter assumptions.",
        "\\begin{align}",
        "\\rho(PD) &= 0.12 \\frac{1 - e^{-50PD}}{1 - e^{-50}} + 0.24 \\left(1 - \\frac{1 - e^{-50PD}}{1 - e^{-50}}\\right), \\\\",
        "b(PD) &= \\left(0.11852 - 0.05478 \\log(PD)\\right)^2.",
        "\\end{align}",
        "\\begin{equation}",
        "K = \\left[LGD \\cdot \\Phi\\left(\\frac{\\Phi^{-1}(PD)}{\\sqrt{1-\\rho}} + \\sqrt{\\frac{\\rho}{1-\\rho}}\\,\\Phi^{-1}(0.999)\\right) - PD \\cdot LGD\\right] \\frac{1 + (M-2.5)b}{1 - 1.5b}.",
        "\\end{equation}",
        "\\begin{equation}",
        "\\operatorname{RWA} = 12.5 \\times K \\times EAD.",
        "\\end{equation}",
        "\\subsection{Current Analytical Reading}",
        ...latexItemizeLines([
          `Total exposure: ${escapeLatex(basel3?.ready ? formatCurrencyCompact(basel3.totalExposure) : "n/a")}.`,
          `Total RWA: ${escapeLatex(basel3?.ready ? formatCurrencyCompact(basel3.totalRwa) : "n/a")}.`,
          `Average risk weight: ${escapeLatex(basel3?.ready ? formatPercent(basel3.averageRiskWeight) : "n/a")}.`,
        ]),
      ].join("\n")
    case "basel4":
      return [
        "\\section{Basel IV Risk-Weighted Assets}",
        "\\subsection{Objective}",
        "The Basel IV view augments the IRB calculation with regulatory parameter floors, standardized real-estate risk weights, and the output floor.",
        "\\begin{equation}",
        "PD_i^{\\mathrm{floor}} = \\max\\left(PD_i, PD_{\\min}\\right).",
        "\\end{equation}",
        "\\begin{equation}",
        "\\operatorname{RWA}^{\\mathrm{STD}}_i = EAD_i \\times RW(\\text{ExposureClass}_i, LTV_i).",
        "\\end{equation}",
        "\\begin{equation}",
        "\\operatorname{RWA}^{\\mathrm{Final}} = \\max\\left(\\operatorname{RWA}^{\\mathrm{IRB,floor}}, \\lambda \\operatorname{RWA}^{\\mathrm{STD}}\\right).",
        "\\end{equation}",
        "\\subsection{Current Analytical Reading}",
        ...latexItemizeLines([
          `Standardized RWA: ${escapeLatex(basel4?.ready ? formatCurrencyCompact(basel4.standardizedRwa) : "n/a")}.`,
          `Floored IRB RWA: ${escapeLatex(basel4?.ready ? formatCurrencyCompact(basel4.irbRwa) : "n/a")}.`,
          `Final RWA: ${escapeLatex(basel4?.ready ? formatCurrencyCompact(basel4.finalRwa) : "n/a")}.`,
          `Output floor gap: ${escapeLatex(basel4?.ready ? formatCurrencyCompact(basel4.floorGap) : "n/a")}.`,
        ]),
      ].join("\n")
    default:
      return "\\section{Methodology Placeholder}\nNo methodology template available."
  }
}

function composeFullRScript() {
  return STEP_DEFINITIONS.map((stepDefinition) => state.documents[stepDefinition.key].code).join("\n\n")
}

function composeFullMethodology() {
  const body = STEP_DEFINITIONS.map((stepDefinition) => stripMethodologyArtifacts(state.documents[stepDefinition.key].methodology)).join("\n\n")
  return buildStandaloneLatexDocument("Credit risk with AI - End-to-end methodology", body)
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
    .map((line) => line.replace(/^\s*#\s?/, "").replace(/^\s*%\s?/, "").replace(/^\s*<!--\s?/, "").replace(/\s*-->\s*$/, ""))
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
    .map((line) => line.replace(/^\s*#\s?/, "").replace(/^\s*%\s?/, ""))
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
    if (!Object.keys(templateValue).length) {
      return nextValue && typeof nextValue === "object" && !Array.isArray(nextValue) ? clone(nextValue) : currentValue
    }
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
      confirmedFeatures: [],
      selectedFeatureDiagnostics: [],
      missingSummary: [],
    }
  }

  const targetColumn = state.global.targetColumn
  const selectedFeatures = state.steps.preparation.selectedFeatures.filter((feature) =>
    state.metadata.columns.includes(feature)
  )
  const confirmedFeatures = state.steps.preparation.confirmedFeatures.filter((feature) =>
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

  const featureMeta = confirmedFeatures.map((featureName) => buildFeatureMeta(featureName, rows)).filter(Boolean)
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
  const selectedFeatureDiagnostics = buildPreparationFeatureDiagnostics(featureMeta, preparedRows)

  return {
    ready: featureMeta.length > 0,
    message: featureMeta.length ? "" : "Select variables in Human in the loop and confirm them before calculating WOE, IV, and grouped buckets.",
    shareConfig,
    selectedFeatures,
    confirmedFeatures,
    featureMeta,
    featureMap,
    rows: preparedRows,
    splitSummary,
    topIvFeatures,
    missingSummary,
    selectedFeatureDiagnostics,
  }
}

function buildPreparationFeatureDiagnostics(featureMeta, preparedRows) {
  const estimationRows = preparedRows.filter((row) => row.sample === "estimation")

  return featureMeta.map((feature) => {
    const orderedBucketStats = feature.bucketStats.slice().sort((left, right) => compareBucketLabels(left.bucket, right.bucket, feature.type === "numeric"))
    const bucketCounts = new Map()

    estimationRows.forEach((row) => {
      const bucket = row.bins[feature.name]
      if (!bucket) {
        return
      }
      bucketCounts.set(bucket, (bucketCounts.get(bucket) || 0) + 1)
    })

    const totalRows = sum(Array.from(bucketCounts.values()))
    const estimationDistribution = orderedBucketStats.map((bucket) => {
      const count = bucketCounts.get(bucket.bucket) || 0
      return {
        bucket: bucket.bucket,
        count,
        share: totalRows ? count / totalRows : 0,
        woe: bucket.woe,
      }
    })

    return {
      ...feature,
      bucketStats: orderedBucketStats,
      missingRate: state.metadata.columnMap[feature.name]?.missingRate ?? 0,
      estimationDistribution,
    }
  })
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

function computeScoring(estimation) {
  if (!estimation.ready) {
    return {
      ready: false,
      message: estimation.message || "Estimate the model first.",
      featureOptions: [],
      selectedBuckets: {},
      selectedRows: [],
      scorecardRows: [],
      complete: false,
      missingSelections: 0,
    }
  }

  const featureOptions = estimation.finalFeatures.map((feature) => ({
    name: feature.name,
    options: sortScorecardRows(estimation.scorecardRows.filter((row) => row.feature === feature.name)).map((row) => ({
      bucket: row.bucket,
      woe: row.woe,
      score: row.score,
      featureOrder: row.featureOrder,
    })),
  }))

  const selectedBuckets = featureOptions.reduce((accumulator, feature) => {
    const requestedBucket = state.steps.scoring.selectedBuckets?.[feature.name]
    if (feature.options.some((option) => option.bucket === requestedBucket)) {
      accumulator[feature.name] = requestedBucket
    }
    return accumulator
  }, {})

  state.steps.scoring.selectedBuckets = selectedBuckets

  const selectedRows = featureOptions
    .map((feature) => {
      const selectedBucket = selectedBuckets[feature.name]
      return feature.options.find((option) => option.bucket === selectedBucket)
        ? {
            feature: feature.name,
            ...feature.options.find((option) => option.bucket === selectedBucket),
          }
        : null
    })
    .filter(Boolean)

  const missingSelections = featureOptions.filter((feature) => !selectedBuckets[feature.name]).length
  const complete = Boolean(featureOptions.length) && missingSelections === 0
  if (!complete) {
    return {
      ready: true,
      message: "",
      featureOptions,
      selectedBuckets,
      selectedRows,
      scorecardRows: estimation.scorecardRows,
      complete: false,
      missingSelections,
    }
  }

  const logit =
    estimation.model.beta[0] +
    estimation.finalFeatures.reduce((sum, feature, featureIndex) => {
      const selectedRow = selectedRows.find((row) => row.feature === feature.name)
      return sum + (selectedRow?.woe ?? 0) * estimation.model.beta[featureIndex + 1]
    }, 0)
  const predictedPd = sigmoid(logit)
  const score = Math.round(state.steps.estimation.scoreOffset + state.steps.estimation.scoreFactor * logit)

  return {
    ready: true,
    message: "",
    featureOptions,
    selectedBuckets,
    selectedRows,
    scorecardRows: estimation.scorecardRows,
    complete: true,
    missingSelections: 0,
    logit,
    predictedPd,
    score,
    rating: assignRating(predictedPd),
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
  const delimiter = detectDelimiter(text.replace(/\uFEFF/g, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n"))
  const parser = createDelimitedParser(delimiter)
  consumeDelimitedChunk(parser, text)
  finalizeDelimitedParser(parser)

  if (!parser.columns.length || !parser.rowCount) {
    throw new Error("The file does not contain a header row plus data.")
  }

  return {
    columns: parser.columns,
    rows: parser.rows,
  }
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

function compareBucketLabels(leftBucket, rightBucket, isNumeric) {
  if (leftBucket === rightBucket) {
    return 0
  }
  if (leftBucket === "All values") {
    return -1
  }
  if (rightBucket === "All values") {
    return 1
  }
  if (leftBucket === "Missing") {
    return 1
  }
  if (rightBucket === "Missing") {
    return -1
  }

  if (isNumeric) {
    const leftStart = extractBucketStart(leftBucket)
    const rightStart = extractBucketStart(rightBucket)
    if (leftStart !== null && rightStart !== null) {
      return leftStart - rightStart
    }
  }

  return leftBucket.localeCompare(rightBucket)
}

function extractBucketStart(bucketLabel) {
  const closedRangeMatch = bucketLabel.match(/^\[\s*(-?\d+(?:\.\d+)?),/)
  if (closedRangeMatch) {
    return Number(closedRangeMatch[1])
  }

  const openRangeMatch = bucketLabel.match(/^>=\s*(-?\d+(?:\.\d+)?)/)
  if (openRangeMatch) {
    return Number(openRangeMatch[1])
  }

  return null
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
    return feature.bucketStats
      .slice()
      .sort((left, right) => right.woe - left.woe || left.bucket.localeCompare(right.bucket))
      .map((bucket, bucketIndex) => ({
        feature: feature.name,
        featureOrder: featureIndex,
        bucketOrder: bucketIndex,
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
    .replace(/% CREDIT RISK WITH AI :: STATE JSON START[\s\S]*?% CREDIT RISK WITH AI :: STATE JSON END/g, "")
    .replace(/% CREDIT RISK WITH AI :: ANALYST NOTES START[\s\S]*?% CREDIT RISK WITH AI :: ANALYST NOTES END/g, "")
    .replace(/<!-- CREDIT RISK WITH AI :: STATE JSON START[\s\S]*?CREDIT RISK WITH AI :: STATE JSON END -->/g, "")
    .replace(/CREDIT RISK WITH AI :: ANALYST NOTES START/g, "")
    .replace(/CREDIT RISK WITH AI :: ANALYST NOTES END/g, "")
    .trim()
}

function coerceInputValue(element) {
  if (element.dataset.valueKind === "percent") {
    return clamp(Number(element.value) / 100, 0, 1)
  }
  if (element.dataset.valueKind === "number") {
    return Number(element.value)
  }
  return element.value
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

function formatBytes(value) {
  const numericValue = Number(value) || 0
  if (numericValue <= 0) {
    return "0 B"
  }

  const units = ["B", "KB", "MB", "GB", "TB"]
  const unitIndex = Math.min(Math.floor(Math.log(numericValue) / Math.log(1024)), units.length - 1)
  const scaledValue = numericValue / 1024 ** unitIndex
  const digits = scaledValue >= 100 || unitIndex === 0 ? 0 : scaledValue >= 10 ? 1 : 2
  return `${scaledValue.toFixed(digits)} ${units[unitIndex]}`
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

function quoteRString(value) {
  return `"${String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`
}

function renderRCharacterVector(values) {
  return values.length ? `c(${values.map((value) => quoteRString(value)).join(", ")})` : "character(0)"
}

function escapeLatex(value) {
  return String(value)
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/([{}_$&#%])/g, "\\$1")
    .replace(/\^/g, "\\textasciicircum{}")
    .replace(/~/g, "\\textasciitilde{}")
}

function latexItemizeLines(items) {
  return ["\\begin{itemize}", ...items.map((item) => `  \\item ${item}`), "\\end{itemize}"]
}

function buildStandaloneLatexDocument(title, body) {
  return [
    "\\documentclass[11pt]{article}",
    "\\usepackage[margin=1in]{geometry}",
    "\\usepackage[T1]{fontenc}",
    "\\usepackage[utf8]{inputenc}",
    "\\usepackage{lmodern}",
    "\\usepackage{amsmath,amssymb}",
    "\\usepackage{booktabs,longtable,array}",
    "\\usepackage{enumitem}",
    "\\usepackage{hyperref}",
    "\\hypersetup{colorlinks=true,linkcolor=blue,urlcolor=blue,citecolor=blue}",
    `\\title{${escapeLatex(title)}}`,
    "\\author{Credit risk with AI}",
    "\\date{\\today}",
    "\\begin{document}",
    "\\maketitle",
    body,
    "\\end{document}",
  ].join("\n")
}

function sanitizeFileStem(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function waitForNextFrame() {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => resolve())
  })
}

function revealPreparationDiagnosticsIfNeeded() {
  if (!shouldScrollToPreparationDiagnostics || state.activeStep !== "preparation") {
    return
  }

  shouldScrollToPreparationDiagnostics = false
  const diagnosticsSection = elements.stepShell.querySelector(".preparation-diagnostics")
  if (diagnosticsSection) {
    diagnosticsSection.scrollIntoView({ behavior: "smooth", block: "start" })
  }
}

function areSameStringArrays(left, right) {
  if (left.length !== right.length) {
    return false
  }

  const leftSorted = left.slice().sort()
  const rightSorted = right.slice().sort()
  return leftSorted.every((value, index) => value === rightSorted[index])
}


