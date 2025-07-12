import React, { useState, useEffect, useRef } from "react"
import Seo from "../components/seo"
import "../components/interactive-data.css"

export default function InteractiveData() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isChartLibLoaded, setIsChartLibLoaded] = useState(false)
  const [isChartLibLoading, setIsChartLibLoading] = useState(false)
  const [chartsInitialized, setChartsInitialized] = useState(false)
  const chartsRef = useRef({})

  // Load Chart.js only when needed (lazy loading)
  const loadChartLibrary = () => {
    if (isChartLibLoaded || isChartLibLoading) return Promise.resolve()

    setIsChartLibLoading(true)

    return new Promise((resolve, reject) => {
      // Check if Chart.js is already loaded
      if (typeof window.Chart !== "undefined") {
        setIsChartLibLoaded(true)
        setIsChartLibLoading(false)
        resolve()
        return
      }

      // Load Chart.js
      const script = document.createElement("script")
      script.src = "https://cdn.jsdelivr.net/npm/chart.js"
      script.onload = () => {
        setIsChartLibLoaded(true)
        setIsChartLibLoading(false)
        resolve()
      }
      script.onerror = () => {
        setIsChartLibLoading(false)
        reject(new Error("Failed to load Chart.js"))
      }
      document.head.appendChild(script)
    })
  }

  // Load Google Fonts only once
  useEffect(() => {
    const fontLink = document.createElement("link")
    fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
    fontLink.rel = "stylesheet"
    document.head.appendChild(fontLink)

    return () => {
      if (fontLink.parentNode) fontLink.parentNode.removeChild(fontLink)
    }
  }, [])

  // Initialize charts when Chart.js is loaded and charts are needed
  useEffect(() => {
    if (!isChartLibLoaded || chartsInitialized) return

    const initializeCharts = async () => {
      try {
        const Chart = window.Chart
        if (!Chart) return

        // Chart data and configuration
        const colors = getThemeColors()
        const chartData = getChartData(colors)

        // Only initialize charts that are visible
        if (activeTab === "overview") {
          createChart("callGrowthChart", "horizontalBar", chartData.spamCallGrowthData)
          createChart("textGrowthChart", "horizontalBar", chartData.textScamGrowthData)
        } else if (activeTab === "calls") {
          createChart("globalCallVolumeChart", "bar", chartData.globalCallVolumeData)
        } else if (activeTab === "texts") {
          createChart("smishingLossChart", "line", chartData.smishingLossData)
        }

        setChartsInitialized(true)
      } catch (error) {
        console.error("Error initializing charts:", error)
      }
    }

    initializeCharts()
  }, [isChartLibLoaded, activeTab, chartsInitialized])

  const handleTabChange = newTab => {
    setActiveTab(newTab)

    // Load Chart.js when user actually wants to see charts
    if ((newTab === "overview" || newTab === "calls" || newTab === "texts") && !isChartLibLoaded) {
      loadChartLibrary()
    }
  }

  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  const getThemeColors = () => {
    const isDarkMode = () => {
      if (typeof window === "undefined") return false
      if (document.documentElement.dataset.theme === "dark") return true
      if (document.documentElement.dataset.theme === "light") return false
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    }

    const dark = isDarkMode()
    const baseColors = {
      primary: dark ? "#8b5cf6" : "#6366f1",
      danger: dark ? "#f87171" : "#ef4444",
      success: dark ? "#34d399" : "#10b981",
      blue: dark ? "#60a5fa" : "#3b82f6",
      text: dark ? "#f1f5f9" : "#1e293b",
      textSecondary: dark ? "#cbd5e1" : "#64748b",
      gridColor: dark ? "#374151" : "#e2e8f0",
    }

    return {
      ...baseColors,
      primaryLight: hexToRgba(baseColors.primary, 0.7),
      dangerLight: hexToRgba(baseColors.danger, 0.7),
      dangerLightBg: hexToRgba(baseColors.danger, 0.2),
      successLight: hexToRgba(baseColors.success, 0.7),
      blueLight: hexToRgba(baseColors.blue, 0.7),
      tooltipBg: dark ? "rgba(15, 23, 42, 0.9)" : "rgba(15, 23, 42, 0.8)",
    }
  }

  const getChartData = colors => {
    return {
      spamCallGrowthData: {
        labels: ["Colombia", "Uruguay", "Argentina", "Philippines", "Mexico", "Japan", "France", "Thailand", "United States", "Canada"],
        datasets: [
          {
            label: "Increase in Spam Call Threat",
            data: [400, 400, 300, 225.17, 230, 180, 100, 82.81, 18.2, 50],
            backgroundColor: colors.primaryLight,
            borderColor: colors.primary,
            borderWidth: 1,
          },
        ],
      },
      textScamGrowthData: {
        labels: ["United Kingdom", "United States", "Thailand", "Africa (Region)", "India"],
        datasets: [
          {
            label: "Increase in Text Scam Volume/Activity",
            data: [663, 328, 123, 3000, 37],
            backgroundColor: colors.dangerLight,
            borderColor: colors.danger,
            borderWidth: 1,
          },
        ],
      },
      globalCallVolumeData: {
        labels: ["Q4 2024", "Q1 2025"],
        datasets: [
          {
            label: "Unwanted Calls (Billions)",
            data: [11.3, 12.5],
            backgroundColor: [colors.blueLight, colors.successLight],
            borderColor: [colors.blue, colors.success],
            borderWidth: 1,
          },
        ],
      },
      smishingLossData: {
        labels: ["2020", "2024"],
        datasets: [
          {
            label: "Reported Losses in US ($M)",
            data: [85, 470],
            fill: true,
            borderColor: colors.danger,
            backgroundColor: colors.dangerLightBg,
            tension: 0.1,
          },
        ],
      },
    }
  }

  const createChart = (canvasId, type, data) => {
    const ctx = document.getElementById(canvasId)
    if (!ctx) return null

    // Destroy existing chart if it exists
    if (chartsRef.current[canvasId]) {
      chartsRef.current[canvasId].destroy()
    }

    const colors = getThemeColors()
    const Chart = window.Chart

    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          mode: "nearest",
          intersect: true,
          backgroundColor: colors.tooltipBg,
          titleFont: { size: 14, weight: "bold" },
          bodyFont: { size: 12 },
          titleColor: "#ffffff",
          bodyColor: "#ffffff",
          padding: 10,
          cornerRadius: 4,
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: colors.textSecondary },
        },
        y: {
          grid: { color: colors.gridColor },
          ticks: { color: colors.textSecondary },
          beginAtZero: true,
        },
      },
    }

    const chartType = type === "horizontalBar" ? "bar" : type
    const indexAxis = type === "horizontalBar" ? "y" : "x"

    const chart = new Chart(ctx, {
      type: chartType,
      data: data,
      options: { ...defaultOptions, indexAxis },
    })

    chartsRef.current[canvasId] = chart
    return chart
  }

  const StatCard = ({ number, label, type = "primary" }) => (
    <div className="stat-card">
      <p className={`stat-number ${type}`}>{number}</p>
      <p className="stat-label">{label}</p>
    </div>
  )

  const SmishingTactic = ({ icon, title, description }) => (
    <div className="tactic-card">
      <span className="tactic-icon">{icon}</span>
      <h4 className="tactic-title">{title}</h4>
      <p className="tactic-description">{description}</p>
    </div>
  )

  const AccordionItem = ({ title, content, isOpen, onToggle }) => (
    <div className="accordion-item">
      <button className="accordion-trigger" onClick={onToggle}>
        <span>{title}</span>
        <span className={`accordion-arrow ${isOpen ? "open" : ""}`}>▼</span>
      </button>
      <div className="accordion-content" style={{ maxHeight: isOpen ? "1000px" : "0px" }}>
        <div className="accordion-inner" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  )

  const RegionalAccordion = () => {
    const [openItems, setOpenItems] = useState({})

    const regionalData = [
      {
        title: "🌎 The South American Surge",
        content: `South America is experiencing the most dramatic escalation in voice-based threats globally. The surge, with risk ratios up 400% in Colombia and Uruguay, represents a concerted expansion by organized crime syndicates. They are capitalizing on a rapidly digitizing population and less mature cybersecurity defenses. While Brazil's volume is highest, its growth has stabilized, suggesting a pivot by scammers to less-saturated neighboring countries with a heavy focus on financial and extortion scams.`,
      },
      {
        title: "🌏 The Southeast Asian Hotspot",
        content: `This region is a global hub for industrialized cybercrime. In the Philippines, a 225% increase in scam calls directly correlates with a 68% decrease in SMS scams, a "balloon effect" caused by the SIM Registration Act pushing criminals to the less-regulated voice channel (often via apps like Viber). In Thailand, both call and text scams have exploded, with scammers adeptly impersonating government entities to exploit public trust, leading to severe socioeconomic damage.`,
      },
      {
        title: "🌍 The European Front",
        content: `While Spain remains a spam hotspot, France is showing faster growth, with a 100% increase in its risk ratio. A key trend is a sophisticated, multi-channel employment scam deployed across Western Europe, starting with a robocall and moving to WhatsApp. This, along with energy provider scams, shows how attackers tailor their lures to exploit local economic anxieties and pressure points, making their attacks highly effective.`,
      },
    ]

    const toggleItem = index => {
      setOpenItems(prev => ({
        ...prev,
        [index]: !prev[index],
      }))
    }

    return (
      <div className="accordion-container">
        {regionalData.map((item, index) => (
          <AccordionItem key={index} title={item.title} content={item.content} isOpen={openItems[index]} onToggle={() => toggleItem(index)} />
        ))}
      </div>
    )
  }

  const SolutionsAccordion = () => {
    const [openItems, setOpenItems] = useState({})

    const solutionsData = [
      {
        title: "🤖 The AI Arms Race: Democratization of Fraud",
        content: `Generative AI is a force multiplier for criminals, enabling them to create fluent, personalized, and grammatically perfect scam messages at scale, blurring the line between mass phishing and targeted attacks. This has led to an "AI vs. AI" arms race, where defenders deploy their own AI to detect AI-generated voices and text anomalies. However, with the human element involved in 68% of breaches, the focus must shift from "spotting fakes" to procedural verification.`,
      },
      {
        title: "📜 The Regulatory Patchwork: A Global Comparison",
        content: `Nations have adopted fragmented strategies. The UK mandates proactive, network-level blocking by carriers. India uses a complex registration system hampered by low public adoption. Brazil focuses on identification and traceability, placing the burden on users. The US relies on a complaint-driven enforcement model. Data suggests that proactive, network-level mandates (like the UK's) are more effective than strategies that rely on individual user action.`,
      },
      {
        title: "💡 Strategic Recommendations",
        content: `
          <ul class="list-disc list-inside space-y-3 text-slate-600">
            <li><strong>For Carriers:</strong> Adopt an "AI vs. AI" defense, prioritize call verification (not just blocking), and enhance cross-border intelligence sharing.</li>
            <li><strong>For Businesses:</strong> Secure all communication channels, and shift security training from "spotting fakes" to mandatory "procedural verification" for any sensitive request.</li>
            <li><strong>For Regulators:</strong> Mandate proactive network-level blocking, foster international regulatory harmony, and address the entire ecosystem, including social media and messaging apps.</li>
            <li><strong>For Consumers:</strong> Trust but always verify. Establish a "digital safe word" with family for financial requests. Actively use reporting tools like the 7726 short code.</li>
          </ul>
        `,
      },
    ]

    const toggleItem = index => {
      setOpenItems(prev => ({
        ...prev,
        [index]: !prev[index],
      }))
    }

    return (
      <div className="accordion-container">
        {solutionsData.map((item, index) => (
          <AccordionItem key={index} title={item.title} content={item.content} isOpen={openItems[index]} onToggle={() => toggleItem(index)} />
        ))}
      </div>
    )
  }

  const smishingTactics = [
    {
      icon: "📦",
      title: "Fake Package Delivery",
      description:
        'Impersonates postal services (UPS, FedEx) claiming a delivery issue. A link leads to a phishing site to steal credit card info for a small "redelivery fee".',
    },
    {
      icon: "💳",
      title: "Fake Fraud Alerts",
      description:
        "Poses as a bank or retailer (Amazon) with a panic-inducing message about a suspicious purchase. Urges you to call a scam number or click a malicious link.",
    },
    {
      icon: "💬",
      title: "Wrong Number / Romance",
      description:
        'Starts with a seemingly accidental text. If you reply, the scammer builds a fake friendship or romance, leading to "pig butchering" investment scams.',
    },
    {
      icon: "💼",
      title: "Phony Job / Task Scams",
      description:
        'Offers an easy, high-paying online job. After building trust with a small initial payment, it requires you to invest your own money for higher "earnings" that are never paid out.',
    },
  ]

  return (
    <>
      <Seo
        title="Interactive Report: The Shifting Frontlines of Spam"
        description="An interactive analysis of the global escalation in unwanted calls and texts, driven by organized crime and supercharged by artificial intelligence."
      />
      <div className="interactive-data-page">
        <div className="interactive-data-container">
          <header className="interactive-data-header">
            <h1 className="interactive-data-title">The Shifting Frontlines of Spam</h1>
            <p className="interactive-data-subtitle">
              An interactive analysis of the global escalation in unwanted calls and texts, driven by organized crime and supercharged by artificial
              intelligence.
            </p>
          </header>

          <main>
            <div className="interactive-nav-container">
              <nav className="interactive-nav">
                <button className={`nav-tab ${activeTab === "overview" ? "active" : ""}`} onClick={() => handleTabChange("overview")}>
                  📊 Overview
                </button>
                <button className={`nav-tab ${activeTab === "calls" ? "active" : ""}`} onClick={() => handleTabChange("calls")}>
                  📞 Spam Calls
                </button>
                <button className={`nav-tab ${activeTab === "texts" ? "active" : ""}`} onClick={() => handleTabChange("texts")}>
                  💬 Spam Texts
                </button>
                <button className={`nav-tab ${activeTab === "solutions" ? "active" : ""}`} onClick={() => handleTabChange("solutions")}>
                  🛡️ Insights & Solutions
                </button>
              </nav>
            </div>

            <div>
              {activeTab === "overview" && (
                <section className="content-section active">
                  <div className="section-header">
                    <h2 className="section-title">The Global Picture in 2024-2025</h2>
                    <p className="section-description">
                      The digital landscape is flooded with unwanted communications, evolving from a mere nuisance into a significant economic threat. The data
                      reveals a clear trend: spam is growing, becoming more sophisticated, and expanding into new territories.
                    </p>
                  </div>

                  <div className="stats-grid">
                    <StatCard number="$1.03 Trillion" label="Estimated Global Financial Losses to Scams in 2024" />
                    <StatCard number="137+ Million" label="Unwanted Calls Inundating Consumers Globally Per Day" />
                    <StatCard number="68%" label="of Security Breaches Still Involve a Human Element" type="danger" />
                  </div>

                  <div className="chart-wrapper">
                    <h3 className="chart-title">Epicenters of Growth: Spam Call Increases</h3>
                    <p className="chart-subtitle">Year-over-year percentage increase in threat risk ratio or call volume.</p>
                    <div className="chart-container">
                      {isChartLibLoading ? (
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>Loading charts...</div>
                      ) : (
                        <canvas id="callGrowthChart"></canvas>
                      )}
                    </div>
                  </div>

                  <div className="chart-wrapper">
                    <h3 className="chart-title">Hotspots for Smishing: Text Scam Growth</h3>
                    <p className="chart-subtitle">Percentage increase in text message scam volume.</p>
                    <div className="chart-container">
                      {isChartLibLoading ? (
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>Loading charts...</div>
                      ) : (
                        <canvas id="textGrowthChart"></canvas>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {activeTab === "calls" && (
                <section className="content-section active">
                  <div className="section-header">
                    <h2 className="section-title">The Voice Channel Under Siege</h2>
                    <p className="section-description">
                      The volume of unwanted calls is not just high—it's accelerating. This section explores the primary growth drivers, from AI deepfakes to
                      strategic expansion by criminal syndicates into new global regions.
                    </p>
                  </div>

                  <div className="chart-wrapper">
                    <h3 className="chart-title">Global Unwanted Call Volume is Rising</h3>
                    <p className="chart-subtitle">Volume in billions, per quarter (Q4 2024 - Q1 2025).</p>
                    <div className="chart-container" style={{ height: "300px", maxHeight: "40vh" }}>
                      {isChartLibLoading ? (
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>Loading charts...</div>
                      ) : (
                        <canvas id="globalCallVolumeChart"></canvas>
                      )}
                    </div>
                  </div>

                  <div className="chart-wrapper">
                    <h3 className="chart-title">Regional Deep Dives</h3>
                    <RegionalAccordion />
                  </div>
                </section>
              )}

              {activeTab === "texts" && (
                <section className="content-section active">
                  <div className="section-header">
                    <h2 className="section-title">The Text Message Threat (Smishing)</h2>
                    <p className="section-description">
                      Fraudulent text messages have escalated into a global epidemic. While less intrusive than calls, their effectiveness in extracting money
                      and data is dangerously high and growing fast.
                    </p>
                  </div>

                  <div className="chart-wrapper">
                    <h3 className="chart-title">Smishing's Financial Impact is Skyrocketing</h3>
                    <p className="chart-subtitle">Reported losses to text scams in the U.S. (in millions).</p>
                    <div className="chart-container" style={{ height: "300px", maxHeight: "40vh" }}>
                      {isChartLibLoading ? (
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>Loading charts...</div>
                      ) : (
                        <canvas id="smishingLossChart"></canvas>
                      )}
                    </div>
                  </div>

                  <div className="chart-wrapper">
                    <h3 className="chart-title">Common Smishing Tactics</h3>
                    <div className="tactics-grid">
                      {smishingTactics.map((tactic, index) => (
                        <SmishingTactic key={index} {...tactic} />
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {activeTab === "solutions" && (
                <section className="content-section active">
                  <div className="section-header">
                    <h2 className="section-title">Unifying Threats, Diverging Responses</h2>
                    <p className="section-description">
                      The fight against spam is an arms race where technology and regulation are key battlegrounds. This section explores the dual role of AI,
                      compares global countermeasures, and presents strategic recommendations.
                    </p>
                  </div>
                  <SolutionsAccordion />
                </section>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
