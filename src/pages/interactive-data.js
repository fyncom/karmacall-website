import React, { useEffect } from "react"
import Seo from "../components/seo"
import "../components/interactive-data.css"

export default function InteractiveData() {
  useEffect(() => {
    // Load Chart.js
    const script = document.createElement("script")
    script.src = "https://cdn.jsdelivr.net/npm/chart.js"
    script.onload = () => {
      initializeCharts()
    }
    document.head.appendChild(script)

    // Load Google Fonts
    const fontLink = document.createElement("link")
    fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
    fontLink.rel = "stylesheet"
    document.head.appendChild(fontLink)

    return () => {
      // Cleanup
      if (script.parentNode) script.parentNode.removeChild(script)
      if (fontLink.parentNode) fontLink.parentNode.removeChild(fontLink)
    }
  }, [])

  const initializeCharts = () => {
    // Ensure Chart.js is available
    if (typeof window.Chart === "undefined") {
      console.warn("Chart.js not loaded yet, retrying...")
      setTimeout(initializeCharts, 100)
      return
    }

    const Chart = window.Chart

    const spamCallGrowthData = {
      labels: ["Colombia", "Uruguay", "Argentina", "Philippines", "Mexico", "Japan", "France", "Thailand", "United States", "Canada"],
      datasets: [
        {
          label: "Increase in Spam Call Threat",
          data: [400, 400, 300, 225.17, 230, 180, 100, 82.81, 18.2, 50],
          backgroundColor: "rgba(79, 70, 229, 0.7)",
          borderColor: "rgba(79, 70, 229, 1)",
          borderWidth: 1,
          tooltip: {
            callbacks: {
              label: function (context) {
                const drivers = [
                  "Financial Scams, Extortion",
                  "Financial Scams",
                  "Financial Impersonation",
                  "Loan & Job Scams",
                  "Bank Impersonation",
                  "Tech Support Scams",
                  "Energy & Job Scams",
                  "Fake Product Sales",
                  "Medicare & AI Deepfakes",
                  "Amazon Impersonation",
                ]
                return `${context.dataset.label}: ${context.raw}% | Drivers: ${drivers[context.dataIndex]}`
              },
            },
          },
        },
      ],
    }

    const textScamGrowthData = {
      labels: ["United Kingdom", "United States", "Thailand", "Africa (Region)", "India"],
      datasets: [
        {
          label: "Increase in Text Scam Volume/Activity",
          data: [663, 328, 123, 3000, 37],
          backgroundColor: "rgba(225, 29, 72, 0.7)",
          borderColor: "rgba(225, 29, 72, 1)",
          borderWidth: 1,
          tooltip: {
            callbacks: {
              label: function (context) {
                const notes = [
                  "663% increase in volume",
                  "328% increase in volume",
                  "Surge from 58.3M to 130M messages",
                  "Up to 3,000% increase in notifications",
                  "37% smishing activity rate",
                ]
                const tactics = ["Fake Parcel Delivery", "Fake Package & Task Scams", "Phishing Links", "Top fraud scheme", "KYC & OTP Theft"]
                return `${notes[context.dataIndex]} | Tactics: ${tactics[context.dataIndex]}`
              },
            },
          },
        },
      ],
    }

    const globalCallVolumeData = {
      labels: ["Q4 2024", "Q1 2025"],
      datasets: [
        {
          label: "Unwanted Calls (Billions)",
          data: [11.3, 12.5],
          backgroundColor: ["rgba(59, 130, 246, 0.7)", "rgba(34, 197, 94, 0.7)"],
          borderColor: ["rgba(59, 130, 246, 1)", "rgba(34, 197, 94, 1)"],
          borderWidth: 1,
        },
      ],
    }

    const smishingLossData = {
      labels: ["2020", "2024"],
      datasets: [
        {
          label: "Reported Losses in US ($M)",
          data: [85, 470],
          fill: true,
          borderColor: "rgba(225, 29, 72, 1)",
          backgroundColor: "rgba(225, 29, 72, 0.2)",
          tension: 0.1,
        },
      ],
    }

    const regionalCallAnalysis = [
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

    function createChart(canvasId, type, data, options = {}) {
      const ctx = document.getElementById(canvasId)
      if (!ctx) return null
      const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            mode: "index",
            intersect: false,
            backgroundColor: "rgba(15, 23, 42, 0.8)",
            titleFont: { size: 14, weight: "bold" },
            bodyFont: { size: 12 },
            padding: 10,
            cornerRadius: 4,
            ...data.datasets[0].tooltip,
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#475569" },
          },
          y: {
            grid: { color: "#e2e8f0" },
            ticks: { color: "#475569" },
            beginAtZero: true,
          },
        },
      }

      if (type === "line") {
        return new Chart(ctx, { type, data, options: { ...defaultOptions, ...options } })
      } else {
        const indexAxis = type === "horizontalBar" ? "y" : "x"
        if (type === "horizontalBar") type = "bar"
        return new Chart(ctx, { type, data, options: { ...defaultOptions, indexAxis, ...options } })
      }
    }

    function setupAccordions(containerId, data) {
      const container = document.getElementById(containerId)
      if (!container) return
      container.innerHTML = data
        .map(
          (item, index) => `
        <div class="accordion-item">
          <button class="accordion-trigger" data-index="${index}">
            <span>${item.title}</span>
            <span class="accordion-arrow">▼</span>
          </button>
          <div class="accordion-content">
            <div class="accordion-inner">${item.content}</div>
          </div>
        </div>
      `
        )
        .join("")

      container.addEventListener("click", function (e) {
        const trigger = e.target.closest(".accordion-trigger")
        if (trigger) {
          const content = trigger.nextElementSibling
          const arrow = trigger.querySelector(".accordion-arrow")
          const isOpen = content.style.maxHeight && content.style.maxHeight !== "0px"

          container.querySelectorAll(".accordion-content").forEach(el => (el.style.maxHeight = "0px"))
          container.querySelectorAll(".accordion-arrow").forEach(el => {
            el.classList.remove("open")
            el.style.transform = "rotate(0deg)"
          })

          if (!isOpen) {
            content.style.maxHeight = content.scrollHeight + "px"
            arrow.classList.add("open")
            arrow.style.transform = "rotate(180deg)"
          } else {
            content.style.maxHeight = "0px"
            arrow.classList.remove("open")
            arrow.style.transform = "rotate(0deg)"
          }
        }
      })
    }

    function populateSmishingTactics() {
      const container = document.getElementById("texts-tactics")
      if (!container) return
      container.innerHTML = smishingTactics
        .map(
          tactic => `
        <div class="tactic-card">
          <span class="tactic-icon">${tactic.icon}</span>
          <h4 class="tactic-title">${tactic.title}</h4>
          <p class="tactic-description">${tactic.description}</p>
        </div>
      `
        )
        .join("")
    }

    const nav = document.getElementById("main-nav")
    const contentContainer = document.getElementById("content-container")

    nav.addEventListener("click", e => {
      if (e.target.tagName === "BUTTON") {
        const targetId = e.target.dataset.target

        nav.querySelectorAll(".nav-tab").forEach(item => {
          item.classList.remove("active")
        })
        e.target.classList.add("active")

        contentContainer.querySelectorAll(".content-section").forEach(section => {
          section.classList.remove("active")
        })
        document.getElementById(targetId).classList.add("active")
      }
    })

    setTimeout(() => {
      createChart("callGrowthChart", "horizontalBar", spamCallGrowthData)
      createChart("textGrowthChart", "horizontalBar", textScamGrowthData)
      createChart("globalCallVolumeChart", "bar", globalCallVolumeData)
      createChart("smishingLossChart", "line", smishingLossData)
      setupAccordions("accordion-calls", regionalCallAnalysis)
      setupAccordions("accordion-solutions", solutionsData)
      populateSmishingTactics()
    }, 1000)
  }

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
              <nav id="main-nav" className="interactive-nav">
                <button data-target="overview" className="nav-tab active">
                  📊 Overview
                </button>
                <button data-target="calls" className="nav-tab">
                  📞 Spam Calls
                </button>
                <button data-target="texts" className="nav-tab">
                  💬 Spam Texts
                </button>
                <button data-target="solutions" className="nav-tab">
                  🛡️ Insights & Solutions
                </button>
              </nav>
            </div>

            <div id="content-container">
              <section id="overview" className="content-section active">
                <div className="section-header">
                  <h2 className="section-title">The Global Picture in 2024-2025</h2>
                  <p className="section-description">
                    The digital landscape is flooded with unwanted communications, evolving from a mere nuisance into a significant economic threat. The data
                    reveals a clear trend: spam is growing, becoming more sophisticated, and expanding into new territories.
                  </p>
                </div>

                <div className="stats-grid">
                  <div className="stat-card">
                    <p className="stat-number primary">$1.03 Trillion</p>
                    <p className="stat-label">Estimated Global Financial Losses to Scams in 2024</p>
                  </div>
                  <div className="stat-card">
                    <p className="stat-number primary">137+ Million</p>
                    <p className="stat-label">Unwanted Calls Inundating Consumers Globally Per Day</p>
                  </div>
                  <div className="stat-card">
                    <p className="stat-number danger">68%</p>
                    <p className="stat-label">of Security Breaches Still Involve a Human Element</p>
                  </div>
                </div>

                <div className="chart-wrapper">
                  <h3 className="chart-title">Epicenters of Growth: Spam Call Increases</h3>
                  <p className="chart-subtitle">Year-over-year percentage increase in threat risk ratio or call volume.</p>
                  <div className="chart-container">
                    <canvas id="callGrowthChart"></canvas>
                  </div>
                </div>

                <div className="chart-wrapper">
                  <h3 className="chart-title">Hotspots for Smishing: Text Scam Growth</h3>
                  <p className="chart-subtitle">Percentage increase in text message scam volume.</p>
                  <div className="chart-container">
                    <canvas id="textGrowthChart"></canvas>
                  </div>
                </div>
              </section>

              <section id="calls" className="content-section">
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
                    <canvas id="globalCallVolumeChart"></canvas>
                  </div>
                </div>

                <div className="chart-wrapper">
                  <h3 className="chart-title">Regional Deep Dives</h3>
                  <div id="accordion-calls" className="accordion-container"></div>
                </div>
              </section>

              <section id="texts" className="content-section">
                <div className="section-header">
                  <h2 className="section-title">The Text Message Threat (Smishing)</h2>
                  <p className="section-description">
                    Fraudulent text messages have escalated into a global epidemic. While less intrusive than calls, their effectiveness in extracting money and
                    data is dangerously high and growing fast.
                  </p>
                </div>

                <div className="chart-wrapper">
                  <h3 className="chart-title">Smishing's Financial Impact is Skyrocketing</h3>
                  <p className="chart-subtitle">Reported losses to text scams in the U.S. (in millions).</p>
                  <div className="chart-container" style={{ height: "300px", maxHeight: "40vh" }}>
                    <canvas id="smishingLossChart"></canvas>
                  </div>
                </div>

                <div className="chart-wrapper">
                  <h3 className="chart-title">Common Smishing Tactics</h3>
                  <div id="texts-tactics" className="tactics-grid"></div>
                </div>
              </section>

              <section id="solutions" className="content-section">
                <div className="section-header">
                  <h2 className="section-title">Unifying Threats, Diverging Responses</h2>
                  <p className="section-description">
                    The fight against spam is an arms race where technology and regulation are key battlegrounds. This section explores the dual role of AI,
                    compares global countermeasures, and presents strategic recommendations.
                  </p>
                </div>
                <div id="accordion-solutions" className="accordion-container"></div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
