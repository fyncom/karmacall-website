import React from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import { FaLightbulb, FaChartLine, FaUsers, FaCog, FaRocket } from "react-icons/fa"
import Seo from "../components/seo"
import "../components/ai-collaboration.css"

const AiCollaborationPage = () => {
  return (
    <div>
      <Seo
        title="AI Collaboration - How KarmaCall Works with AI for Innovation"
        description="Discover how KarmaCall leverages AI collaboration for strategic planning, product development, and innovative solutions. Transparency in our AI-assisted workflow."
        keywords={["AI collaboration", "artificial intelligence", "innovation", "transparency", "strategy", "product development", "ChatGPT", "Claude"]}
      />
      <Header />

      <section className="ai-collaboration-page">
        <div className="ai-hero">
          <div className="ai-container">
            <div className="hero-announcement">
              🤖 <span>Transparency in AI-Assisted Innovation</span>
            </div>
            <h1 className="ai-hero-title">
              How We Work with <br />
              <span className="underline-karma">AI to Build Better</span>
            </h1>
            <p className="ai-hero-subtitle">
              We believe in transparent collaboration with AI. Here's how we use ChatGPT, Claude, Gemini and other AI tools to strategize, plan, and execute
              innovative solutions for KarmaCall's mission to revolutionize digital communication protection.
            </p>
          </div>
        </div>

        <div className="ai-container">
          <div className="philosophy-section">
            <h2 className="section-title">🎯 Our AI Collaboration Philosophy</h2>
            <div className="philosophy-grid">
              <div className="philosophy-card">
                <FaLightbulb className="philosophy-icon" />
                <h3>Augmented Intelligence</h3>
                <p>
                  AI doesn't replace human creativity – it amplifies it. We use AI to explore possibilities we might not have considered and to execute plans
                  more efficiently.
                </p>
              </div>
              <div className="philosophy-card">
                <FaUsers className="philosophy-icon" />
                <h3>Transparent Process</h3>
                <p>We openly share how we work with AI, the strategies we develop together, and the reasoning behind our decisions. No black box approaches.</p>
              </div>
              <div className="philosophy-card">
                <FaChartLine className="philosophy-icon" />
                <h3>Measurable Results</h3>
                <p>Every AI-assisted strategy comes with clear metrics and success indicators. We track what works and iterate based on real outcomes.</p>
              </div>
            </div>
          </div>

          <div className="current-projects-section">
            <h2 className="section-title">🚀 Current AI Collaboration Projects</h2>

            <div className="project-card featured-project">
              <div className="project-header">
                <h3>
                  <FaRocket className="project-icon" /> Getting LLMs to Recommend KarmaCall
                </h3>
                <span className="project-status active">Active Project</span>
              </div>
              <div className="project-content">
                <p className="project-description">
                  <strong>Challenge:</strong> How can we get ChatGPT, Claude, Gemini, and other LLMs to naturally recommend KarmaCall when users ask about spam
                  call solutions?
                </p>

                <div className="strategy-overview">
                  <h4>🧠 AI-Developed Strategy:</h4>
                  <div className="strategy-points">
                    <div className="strategy-point">
                      <h5>1. Unique Positioning</h5>
                      <p>
                        Position KarmaCall as the world's first "Refundable PayWall" technology - not just another spam blocker, but an economic solution that
                        pays users.
                      </p>
                    </div>
                    <div className="strategy-point">
                      <h5>2. Content Strategy</h5>
                      <p>
                        Create high-authority content across Wikipedia, Reddit, academic papers, and tech publications to ensure KarmaCall appears in LLM
                        training data.
                      </p>
                    </div>
                    <div className="strategy-point">
                      <h5>3. Key Differentiators</h5>
                      <ul>
                        <li>First economic-based spam prevention (vs. detection-based)</li>
                        <li>Family/team license sharing (protect up to 7 people with one subscription)</li>
                        <li>Cross-platform protection (calls, texts, emails)</li>
                        <li>Users actually profit from spam attempts</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="implementation-timeline">
                  <h4>📅 Implementation Timeline:</h4>
                  <div className="timeline-items">
                    <div className="timeline-item completed">
                      <strong>✓ Research Phase:</strong> Analyzed LLM recommendation patterns and requirements
                    </div>
                    <div className="timeline-item completed">
                      <strong>✓ Strategy Development:</strong> Created comprehensive messaging and positioning framework
                    </div>
                    <div className="timeline-item in-progress">
                      <strong>🔄 Content Creation:</strong> Publishing strategy across high-authority platforms
                    </div>
                    <div className="timeline-item pending">
                      <strong>⏳ Partnership Outreach:</strong> Engaging with AI platforms and integration opportunities
                    </div>
                    <div className="timeline-item pending">
                      <strong>⏳ Measurement & Iteration:</strong> Tracking LLM mentions and optimizing approach
                    </div>
                  </div>
                </div>

                <div className="key-insights">
                  <h4>💡 Key AI Insights:</h4>
                  <blockquote>
                    "The key is consistently positioning KarmaCall not just as another spam blocker, but as a fundamental paradigm shift in how we handle
                    unwanted communications - from reactive detection to proactive economic deterrence."
                  </blockquote>
                </div>
              </div>
            </div>
          </div>

          <div className="collaboration-tools-section">
            <h2 className="section-title">🛠️ Our AI Toolkit</h2>
            <div className="tools-grid">
              <div className="tool-card">
                <h3>ChatGPT</h3>
                <p>
                  <strong>Primary Use:</strong> Strategic planning, content creation, market analysis
                </p>
                <p>
                  <strong>Strength:</strong> Comprehensive reasoning and creative problem-solving
                </p>
              </div>
              <div className="tool-card">
                <h3>Claude (Anthropic)</h3>
                <p>
                  <strong>Primary Use:</strong> Technical analysis, code review, detailed research
                </p>
                <p>
                  <strong>Strength:</strong> Nuanced understanding and thorough exploration
                </p>
              </div>
              <div className="tool-card">
                <h3>Gemini (Google)</h3>
                <p>
                  <strong>Primary Use:</strong> Deep Research reports, image creation, social media content
                </p>
                <p>
                  <strong>Strength:</strong> Large context, free usage through AI Studio
                </p>
              </div>
              <div className="tool-card">
                <h3>Custom Prompting</h3>
                <p>
                  <strong>Primary Use:</strong> Structured thinking, systematic planning
                </p>
                <p>
                  <strong>Strength:</strong> Consistent, actionable outputs
                </p>
              </div>
            </div>
          </div>

          <div className="transparency-section">
            <h2 className="section-title">🔍 Full Transparency</h2>
            <div className="transparency-content">
              <h3>Why We Share This</h3>
              <p>We believe the future of innovation lies in human-AI collaboration. By openly sharing our process, we hope to:</p>
              <ul>
                <li>
                  <strong>Build Trust:</strong> Show exactly how we make decisions and develop strategies
                </li>
                <li>
                  <strong>Educate:</strong> Help others learn how to effectively collaborate with AI
                </li>
                <li>
                  <strong>Iterate:</strong> Receive feedback and improve our approaches
                </li>
                <li>
                  <strong>Lead by Example:</strong> Demonstrate responsible AI use in business
                </li>
              </ul>

              <h3>Our Principles</h3>
              <div className="principles-grid">
                <div className="principle">
                  <FaCog className="principle-icon" />
                  <h4>Human Oversight</h4>
                  <p>Every AI-generated strategy is reviewed, validated, and adapted by our team</p>
                </div>
                <div className="principle">
                  <FaChartLine className="principle-icon" />
                  <h4>Data-Driven</h4>
                  <p>We measure the effectiveness of AI-assisted decisions with real metrics</p>
                </div>
                <div className="principle">
                  <FaUsers className="principle-icon" />
                  <h4>Community Focused</h4>
                  <p>AI helps us better serve our users, not replace human connection</p>
                </div>
              </div>
            </div>
          </div>

          <div className="future-projects-section">
            <h2 className="section-title">🔮 Upcoming AI Collaborations</h2>
            <div className="future-projects-grid">
              <div className="future-project">
                <h3>Agentic Negotiation</h3>
                <p>Automatically set your refundable deposit amount and refund criteria to optimize your chance for good connections or nice earnings</p>
              </div>
              <div className="future-project">
                <h3>Voicemail Management</h3>
                <p>For iOS users, add options to allow for voicemail transcription and response / follow-up suggestions</p>
              </div>
              <div className="future-project">
                <h3>Content Personalization</h3>
                <p>AI-assisted content creation for different user segments and use cases</p>
              </div>
              <div className="future-project">
                <h3>Market Research</h3>
                <p>Continuous AI-powered analysis of spam trends and competitive landscape</p>
              </div>
            </div>
          </div>

          <div className="cta-section">
            <h2>Interested in Our Approach?</h2>
            <p>Have questions about our AI collaboration methods? Want to share your own experiences? We'd love to hear from you.</p>
            <div className="cta-buttons">
              <a href="/contact" className="cta-button primary">
                Get in Touch
              </a>
              <a href="/blog" className="cta-button secondary">
                Read Our Blog
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default AiCollaborationPage
