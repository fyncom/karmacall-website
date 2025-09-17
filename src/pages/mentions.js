import React, { useState } from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import "../components/mentions.css"
import Seo from "../components/seo"

const Mentions = () => {
  const [modalVideo, setModalVideo] = useState(null)
  const MENTION_INDEX = [
    {
      id: "ai-cybercrime-vibe-hacking",
      speaker: "Anthropic",
      co: "Stuart Ritchie, Jacob Klein, Alex Moix",
      topic: 'AI-Powered Call & Text Scams: The "Vibe Hacking" Revolution',
      date: "Aug 27, 2025",
    },
    {
      id: "spam-filters-failure",
      speaker: "Andrej Karpathy",
      co: "OpenAI Co-founder",
      topic: "Why Even AI Experts Can't Stop Spam Calls & Texts",
      date: "Aug 18, 2025",
    },
    {
      id: "shadow-economy-digital-scams",
      speaker: "Mariana Van Zeller",
      co: "Theo Von",
      topic: "The $12.5 Billion Call & Text Scam Economy",
      date: "Aug 15, 2025",
    },
    {
      id: "ai-attention-economy",
      speaker: "Eric Schmidt",
      co: "Peter H. Diamandis",
      topic: "AI, Call Overload, and the Future of Human Attention",
      date: "July 17, 2025",
    },
    {
      id: "media-manipulation-unreliable-narrators",
      speaker: "Balaji Srinivasan",
      co: "Erik Torenberg, a16z",
      topic: "Communication Trust and Consensual Contact",
      date: "July 17, 2025",
    },
    { id: "ai-agents-automated-calling", speaker: "Jack Altman", co: "Mamoon Hamid", topic: "AI Agents and Automated Calling", date: "July 9, 2025" },
    { id: "digital-identity-trust", speaker: "Sam Lessin", co: "Joe Lonsdale", topic: "Digital Identity and Trust", date: "May 16, 2025" },
    { id: "communication-protocols", speaker: "David Daneshgar", co: "Higher Levels", topic: "Communication Protocols", date: "May 12, 2025" },
    {
      id: "agent-communication-trust",
      speaker: "Konstantine Buhler",
      co: "Sequoia AI Ascent",
      topic: "Agent Communication and Trust Transfer",
      date: "May 7, 2025",
    },
    { id: "infinite-spam-hyperpersonalization", speaker: "Sam Lessin", co: "TBPN", topic: "Infinite Spam and Hyperpersonalization", date: "Mar 17, 2025" },
    { id: "digital-vs-human-hackers", speaker: "Ezra Klein", co: "Ben Buchanan", topic: "Digital vs Human Hackers", date: "Mar 4, 2025" },
    {
      id: "job-scam-surge-2024",
      speaker: "Federal Trade Commission",
      co: "LinkedIn News",
      topic: "The 2024 Job Scam Text Surge",
      date: "Jan 2025",
    },
    { id: "ai-manipulation-phishing", speaker: "Eli Yudkowsky", co: "Stephen Wolfram", topic: "AI Manipulation and Phishing", date: "Nov 11, 2024" },
    { id: "crypto-economic-prosperity", speaker: "Jeremy Allaire", co: "TOKEN 2049", topic: "Crypto and Economic Prosperity", date: "Sept 27, 2024" },
    { id: "ai-agents-economic-models", speaker: "Reid Hoffman", co: "Erik Brynjolfsson", topic: "AI Agents and Economic Models", date: "Sept 5, 2024" },
    {
      id: "ai-powered-social-engineering",
      speaker: "Jeffrey Katzenberg",
      co: "WSJ's Emma Tucker, Sujay Jaswa",
      topic: "AI-Powered Social Engineering",
      date: "Sept 25, 2023",
    },
  ]

  const openModal = videoData => {
    setModalVideo(videoData)
    document.body.style.overflow = "hidden" // Prevent background scrolling
  }

  const closeModal = () => {
    setModalVideo(null)
    document.body.style.overflow = "unset" // Restore scrolling
  }

  const VideoTrigger = ({ videoData, children }) => {
    // Check if video is embeddable or should open directly
    const isEmbeddable = videoData.isEmbeddable !== false

    const handleClick = () => {
      if (isEmbeddable) {
        openModal(videoData)
      } else {
        // Open YouTube video directly in new tab
        window.open(videoData.directUrl || videoData.embedUrl, "_blank")
      }
    }

    return (
      <button className="video-trigger" onClick={handleClick}>
        <div className="video-trigger-content">
          <div>
            <h3>{videoData.title}</h3>
            <p className="timestamp">{videoData.timestamp}</p>
          </div>
          <span className="play-icon">▶</span>
        </div>
      </button>
    )
  }

  const VideoModal = ({ video, isOpen, onClose }) => {
    if (!video) return null

    return (
      <div className={`video-modal ${isOpen ? "open" : ""}`} onClick={onClose}>
        <div className="video-modal-content" onClick={e => e.stopPropagation()}>
          <div className="video-modal-header">
            <h3>{video.title}</h3>
            <button className="close-modal" onClick={onClose}>
              ×
            </button>
          </div>
          <div className="video-container">
            <iframe
              src={video.embedUrl}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Seo
        title="Industry Mentions - KarmaCall"
        description="Thought leaders discussing AI, spam calls, trust, and the future of digital communications - concepts at the heart of KarmaCall's mission to get people paid for blocking spam calls."
      />
      <Header />

      <section className="mentions-header">
        <h1>Industry Mentions</h1>
        <p>
          Leading voices in technology, venture capital, and AI discussing the spam call crisis and communication challenges that KarmaCall solves - by getting
          people paid to block spam calls and creating financial accountability for callers.
        </p>
        {!!MENTION_INDEX.length && (
          <div className="mentions-index">
            <h3>Index</h3>
            <ul>
              {MENTION_INDEX.map(item => (
                <li key={item.id}>
                  {item.date ? <span className="date">{item.date} - </span> : null}
                  {item.speaker ? (
                    <span className="name">
                      {item.speaker}
                      {item.co ? ` - ${item.co} - ` : " - "}
                    </span>
                  ) : null}
                  <a href={`#${item.id}`}>{item.topic || item.label}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <div className="mentions-container">
        {/* NEW SECTION: AI Cybercrime and Vibe Hacking */}
        <section className="mention-section" id="ai-cybercrime-vibe-hacking">
          <h2>On AI-Powered Call & Text Scams: The "Vibe Hacking" Revolution</h2>
          <VideoTrigger
            videoData={{
              title: "Anthropic on AI Cybercrime: Vibe Hacking",
              timestamp: "Watch ~2 minutes starting at 0:17",
              embedUrl: "https://www.youtube.com/embed/EsCNkDrIGCw?start=17",
            }}
          />
          <div className="mention-content">
            <div className="highlight-text">
              <p>
                <strong>Democratizing Sophisticated Phone & Text Scams:</strong> Anthropic introduces "vibe hacking" - where anyone can use natural language to
                direct AI in creating sophisticated phone and text scams without technical skills. This means the barrier to launching mass calling campaigns
                has effectively disappeared.
              </p>
              <p>
                <strong>Explosive Scale in Communication Fraud:</strong> A single "vibe hacker" accomplished in weeks what skilled scam teams previously needed
                months to execute, targeting 17 organizations. When applied to phone calls and texts, this means we're facing an explosion of AI-generated
                robocalls and scam texts that can instantly adapt to any blocking mechanism.
              </p>
              <p>
                <strong>The Future of Call-Based Attacks:</strong> This validates predictions from other experts on this page. When AI makes it "cheaper to
                phish everyone" (as Yudkowsky warned in our <a href="#ai-manipulation-phishing">AI manipulation section</a>), sophisticated voice cloning and
                personalized calling campaigns will become accessible to anyone with basic English skills.
              </p>
              <p>
                <strong>KarmaCall's Economic Shield:</strong> Traditional call blocking and text filtering can't keep pace with AI that adapts faster than
                security measures. KarmaCall's refundable deposit system creates an economic firewall that scales with the threat - "vibe hackers" simply can't
                afford to pay deposits for mass campaigns, while legitimate callers can easily afford small deposits to reach you. You get paid for every
                blocked scam attempt.
              </p>
            </div>
          </div>
        </section>

        {/* NEW SECTION: Andrej Karpathy on Spam Filter Failure */}
        <section className="mention-section" id="spam-filters-failure">
          <h2>On Why Even AI Experts Can't Stop Spam Calls & Texts</h2>
          <a href="https://x.com/karpathy/status/1957574489358873054?lang=en" target="_blank" rel="noopener noreferrer" className="tweet-trigger">
            <div className="tweet-trigger-content">
              <div>
                <h3>Andrej Karpathy (OpenAI Co-founder) on Spam Call Failure</h3>
                <p className="timestamp">Read the X Post from August 2025</p>
              </div>
              <span className="play-icon">🔗</span>
            </div>
          </a>
          <div className="mention-content">
            <div className="highlight-text">
              <p>
                <strong>Even AI Pioneers Are Helpless:</strong> Andrej Karpathy, OpenAI co-founder and one of the world's leading AI experts, publicly shared
                his complete inability to stop daily spam calls and texts. Despite using AT&T Active Armor, Do Not Call registry, and iOS "Silence Unknown
                Callers," the unwanted communications still flood through.
              </p>
              <p>
                <strong>The Technical Reality - Call Blocking Is Obsolete:</strong> Karpathy reveals the core problem - spammers use unique numbers for every
                call and text, making traditional blocking worthless. His experience proves that even the most sophisticated technical solutions are
                fundamentally playing a losing game of whack-a-mole.
              </p>
              <p>
                <strong>A $12 Billion Problem Needs Economic Solutions:</strong> When the co-creator of modern AI can't solve spam calls with technology, it's
                clear we need a different approach. KarmaCall transforms this from a technical arms race into simple economics - scammers can't afford to pay
                everyone they want to call, but legitimate callers can afford small refundable deposits to reach you.
              </p>
              <p>
                <strong>Getting Paid to Block Future AI Calls:</strong> As Karpathy's AI advances, so do AI-powered calling campaigns. KarmaCall ensures that as
                call spam becomes more sophisticated, you simply get paid more for blocking it. The economic barrier scales automatically with the threat.
              </p>
            </div>
          </div>
        </section>

        {/* NEW SECTION: Shadow Economy and Digital Scams */}
        <section className="mention-section" id="shadow-economy-digital-scams">
          <h2>On the $12.5 Billion Call & Text Scam Economy</h2>
          <VideoTrigger
            videoData={{
              title: "Mariana Van Zeller on the Global Black & Gray Markets",
              timestamp: "Watch 1.5 minutes starting at 51:06",
              embedUrl: "https://www.youtube.com/embed/6J4U3R5dRik?start=3066",
            }}
          />
          <div className="mention-content">
            <div className="highlight-text">
              <p>
                <strong>The Hidden Third of All Economy:</strong> Investigative journalist Mariana Van Zeller reveals that{" "}
                <strong>38% of the global economy</strong> operates in black and gray markets. Within this shadow economy, phone and text scams represent one of
                the fastest-growing sectors.
              </p>
              <p>
                <strong>Explosive Growth in Communication Fraud:</strong> Americans lost <strong>$12.5 billion</strong> to scams last year alone, with Van
                Zeller noting this industry has been "doubling and doubling" annually. Most of these scams begin with an unwanted phone call or text message -
                the very communications KarmaCall protects against.
              </p>
              <p>
                <strong>Economic Incentives Drive Call Center Crime:</strong> The massive profits from communication-based scams fuel sophisticated
                international calling operations. These aren't lone actors - they're well-funded criminal enterprises that can afford advanced technology and AI
                tools, but they rely on the near-zero cost of making calls and sending texts.
              </p>
              <p>
                <strong>Breaking the Economics of Phone Fraud:</strong> KarmaCall directly attacks this $12.5 billion criminal economy by introducing cost where
                none existed before. When each call requires a refundable deposit, the high-volume, low-margin business model of phone scams becomes instantly
                unprofitable. You get paid every time they're blocked from reaching you.
              </p>
            </div>
          </div>
        </section>

        {/* NEW SECTION: Eric Schmidt on AI and Attention */}
        <section className="mention-section" id="ai-attention-economy">
          <h2>On AI, Call Overload, and the Future of Human Attention</h2>
          <VideoTrigger
            videoData={{
              title: "Eric Schmidt on AI's Role in a World of Misinformation",
              timestamp: "Watch ~1.5 minutes starting at 1:19:20",
              embedUrl: "https://www.youtube.com/embed/qaPHK1fJL5s?start=4760",
            }}
          />
          <div className="mention-content">
            <div className="conversation-format">
              <div className="exchange">
                <h4>Attention Management as Your Future "Full-Time Job"</h4>
                <p>
                  <strong>Eric Schmidt:</strong> Predicts that simply "managing the world around you" - filtering through constant calls, texts, emails, and
                  notifications from deceptive actors - will become a purposeful, full-time occupation. The volume of communication attempting to manipulate
                  your attention and money will require dedicated effort to manage.
                </p>
              </div>
              <div className="exchange">
                <h4>AI Won't Eliminate Human Deception - It Amplifies It</h4>
                <p>
                  Schmidt dismisses utopian visions where AI solves all problems, arguing instead that technology changes but human nature doesn't. There will
                  always be "evil people" using AI to create more sophisticated calls and texts, and "good people" trying to protect against them. The arms race
                  accelerates, but the fundamental conflict remains.
                </p>
              </div>
              <div className="exchange">
                <h4>KarmaCall: Automating Your Attention Defense</h4>
                <p>
                  Schmidt's "full-time job" of attention management is precisely what KarmaCall automates for phone calls and texts. Instead of you personally
                  filtering every incoming communication, KarmaCall's economic barrier does it automatically. Legitimate callers prove their importance through
                  refundable deposits, while "evil people" are economically blocked from reaching you. You get paid for your protected attention instead of it
                  being stolen for free.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* NEW SECTION: Media Manipulation and Communication Trust */}
        <section className="mention-section" id="media-manipulation-unreliable-narrators">
          <h2>On Communication Trust and Consensual Contact</h2>
          <VideoTrigger
            videoData={{
              title: "Balaji Srinivasan on Media as Unreliable Narrators",
              timestamp: "Watch ~2.5 minutes starting at 16:53",
              embedUrl: "https://www.youtube.com/embed/cBFbXRjTVLc?start=1013",
            }}
          />
          <div className="mention-content">
            <div className="conversation-format">
              <div className="exchange">
                <h4>Communication as "Non-Consensual Invasion"</h4>
                <p>
                  <strong>Balaji Srinivasan:</strong> Describes unwanted contact as <strong>"non-consensual invasion of privacy for profit."</strong> He argues
                  that people can't opt out of being targeted by calls, texts, and messages from parties with ulterior motives - equating these communication
                  tactics with spam, stalking, and scamming behaviors that would be illegal in physical contexts.
                </p>
              </div>
              <div className="exchange">
                <h4>Trust Collapse in Digital Communication</h4>
                <p>
                  Srinivasan describes manipulative communicators as "con men" who feign trust and goodwill to extract information or money, then "stab you"
                  with the results. This dynamic has destroyed trust in phone calls and text messages - people now assume unknown communication is malicious
                  until proven otherwise.
                </p>
              </div>
              <div className="exchange">
                <h4>KarmaCall: Restoring Consent Through Economics</h4>
                <p>
                  Inspired by Balaji's own company Earn.com (which pioneered paid communication), KarmaCall restores consent and trust to phone calls and texts.
                  By requiring refundable financial stakes to initiate contact, KarmaCall provides an objective economic signal of communication importance.
                  Legitimate callers can afford small deposits, while the "stalkers, spammers, and scammers" Balaji describes cannot afford to pay everyone they
                  want to target. You get paid for your time and attention, making all communication consensual.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Link: https://fyncom.com/mentions#ai-agents-automated-calling */}
        <section className="mention-section" id="ai-agents-automated-calling">
          <h2>On AI Agents and Automated Calling</h2>
          <VideoTrigger
            videoData={{
              title: "Jack Altman & Mamoon Hamid on AI Investment Opportunities",
              timestamp: "Watch 2 minutes starting at 26:21",
              embedUrl: "https://www.youtube.com/embed/PzEzKbsAp5E?start=1581",
            }}
          />
          <div className="mention-content">
            <div className="conversation-format">
              <div className="exchange">
                <h4>On AI Agents & Automated Calling in Health Care</h4>
                <p>
                  <strong>Mamoon Hamid (Kleiner Perkins):</strong> Discusses how AI agents can now autonomously perform jobs traditionally done by skilled
                  workers like nurses. He specifically highlights autonomous agents that make "thousands of phone calls" to patients for pre-op conversations,
                  wellness checks, and post-op follow-ups.
                </p>
              </div>

              <div className="exchange">
                <h4>The Uniquely AI Advantage: Timing and Persistence</h4>
                <p>
                  <strong>Key Insight:</strong> Hamid explains that AI can succeed where humans struggle. Patients often prefer calls at specific times ("8am to
                  9am... or 5pm to 6pm"), which is hard to schedule for a human nurse. However, an AI agent can be instructed to "call only those hours."
                </p>
                <p>
                  <strong>He continues with a critical point:</strong> "AI will never give up... those calls today are probably made, they go to voicemail, and
                  then you don't do a follow-up because you just don't have enough humans to make those follow-up phone calls."
                </p>
              </div>

              <div className="exchange">
                <h4>The Double-Edged Sword of "Abundance Through AI"</h4>
                <p>
                  <strong>The Promise:</strong> Hamid describes creating "abundance through AI" where automated systems can make unlimited calls at optimal
                  times, theoretically improving healthcare outcomes.
                </p>
                <p>
                  <strong>The Peril:</strong> This vision reveals a critical challenge. When AI agents can make unlimited calls and "never give up," how do we
                  distinguish between beneficial automated calls (like a healthcare follow-up) and the inevitable explosion of harmful ones (spam, scams, and
                  unwanted solicitations)?
                </p>
              </div>

              <div className="exchange">
                <h4>The KarmaCall Connection: Enabling Trust in an Automated World</h4>
                <p>
                  This discussion perfectly illustrates why KarmaCall's economic filtering approach is essential for the future of communication. As AI agents
                  become capable of making "thousands of phone calls" that "never give up," a new layer of trust is required.
                </p>
                <p>
                  <strong>Economic Differentiation:</strong> KarmaCall provides this layer. Legitimate organizations like healthcare systems can afford small,
                  refundable deposits for important patient calls. In contrast, spammers and scammers cannot afford to pay for mass automated campaigns. This
                  simple economic principle enables the beneficial use of AI calling that Hamid describes while blocking the harmful automated calls that will
                  otherwise plague consumers.
                </p>
                <p>
                  <strong>Trust Through Economics:</strong> When your doctor's office or a legitimate business calls you through KarmaCall, you instantly know
                  it's important because they have placed a financial deposit behind the call. When a scammer tries, they're blocked, and you get paid. This is
                  how we harness the power of AI communication while protecting users from its potential for misuse.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Link: https://fyncom.com/mentions#agent-communication-trust */}
        <section className="mention-section" id="agent-communication-trust">
          <h2>On Agent Communication and Trust Transfer</h2>
          <VideoTrigger
            videoData={{
              title: "AI's Trillion Dollar Opportunity: Sequoia AI Ascent 2025",
              timestamp: "Watch 4.5 minutes starting at 21:46",
              embedUrl: "https://www.youtube.com/embed/v9JBMnxuPX8?start=1431",
            }}
          />
          <div className="mention-content">
            <div className="highlight-text">
              <p>
                <strong>
                  <span
                    style={{ cursor: "pointer", textDecoration: "underline", color: "var(--karmacall-green)" }}
                    onClick={() =>
                      openModal({
                        title: "Seamless Communications Protocols (23:51-24:35)",
                        timestamp: "Watch from 23:51",
                        embedUrl: "https://www.youtube.com/embed/v9JBMnxuPX8?start=1431",
                      })
                    }
                  >
                    Seamless Communications Protocols (23:51-24:35)
                  </span>
                  :
                </strong>{" "}
                The discussion of seamless communication protocols is remarkably close to what KarmaCall is building. The speakers recognize that future AI
                systems will need robust communication frameworks that can handle trust, verification, and value transfer - exactly what KarmaCall provides for
                phone calls.
              </p>
              <p>
                <strong>
                  <span
                    style={{ cursor: "pointer", textDecoration: "underline", color: "var(--karmacall-green)" }}
                    onClick={() =>
                      openModal({
                        title: "Transfer of Trust (24:30-25:05)",
                        timestamp: "Watch from 24:30",
                        embedUrl: "https://www.youtube.com/embed/v9JBMnxuPX8?start=1470",
                      })
                    }
                  >
                    Transfer of Trust (24:30-25:05)
                  </span>
                  :
                </strong>{" "}
                This segment introduces the critical concept of "Transfer of Trust" between AI agents. As AI systems become more autonomous, they'll need
                mechanisms to establish and transfer trust - exactly what KarmaCall's refundable deposits enable for phone calls and digital communications.
              </p>
              <p>
                <strong>
                  <span
                    style={{ cursor: "pointer", textDecoration: "underline", color: "var(--karmacall-green)" }}
                    onClick={() =>
                      openModal({
                        title: "Agent Swarms and Trust Networks (21:46-22:46)",
                        timestamp: "Watch from 21:46",
                        embedUrl: "https://www.youtube.com/embed/v9JBMnxuPX8?start=1306",
                      })
                    }
                  >
                    Agent Swarms and Trust Networks (21:46-22:46)
                  </span>
                  :
                </strong>{" "}
                The discussion of agent swarms reveals the complexity of maintaining trust in automated systems. When multiple AI agents interact, traditional
                security measures become insufficient, requiring economic incentives like those provided by KarmaCall's technology.
              </p>
              <p>
                <strong>Stochastic Challenges:</strong> The speakers note that the stochastic approach of agents creates additional challenges for typical spam
                prevention techniques, highlighting the need for solutions insensitive to content analysis and pattern detection. KarmaCall's financial filter
                approach solves this by requiring economic commitment regardless of message content.
              </p>
            </div>
          </div>
        </section>

        {/* Link: https://fyncom.com/mentions#ai-agents-economic-models */}
        <section className="mention-section" id="ai-agents-economic-models">
          <h2>On AI Agents and Economic Models</h2>
          <VideoTrigger
            videoData={{
              title: "Stanford ECON295/CS323 - Business of AI, Reid Hoffman",
              timestamp: "Watch 1.5 minutes starting at 39:48-41:10 again at 48:10-49:30",
              embedUrl: "https://www.youtube.com/embed/RXjLGn14Jo4?start=2880",
              directUrl: "https://www.youtube.com/watch?v=RXjLGn14Jo4&t=2880s",
              isEmbeddable: false,
            }}
          />
          <div className="mention-content">
            <div className="conversation-format">
              <div className="exchange">
                <h4>On Communication Vulnerabilities (48:10-49:30)</h4>
                <p>
                  <strong>Reid Hoffman:</strong> Discusses an example of AI creating harm at a societal scale. Discusses how communications become increasingly
                  vulnerable due to LLM spear-phishing capabilities. The sophistication of AI-generated personalized attacks makes traditional security measures
                  insufficient.
                </p>
              </div>

              <div className="exchange">
                <h4>On Personal AI Agents and Economic Disruption (39:48-41:10)</h4>
                <p>
                  <strong>Reid Hoffman:</strong> "The AI agent that works for us to maximize what we want." He discusses how AI agents could fundamentally
                  disrupt traditional advertising revenue models by handling financial transactions directly between users and businesses.
                </p>
                <p>
                  This vision aligns perfectly with KarmaCall's technology, which enables direct economic relationships in phone communications, bypassing
                  traditional advertising-based models that often conflict with user interests. Instead of ads, callers pay small refundable deposits.
                </p>
              </div>

              <div className="exchange">
                <h4>Economic Alignment and Trust</h4>
                <p>
                  Hoffman's insights reveal a future where AI agents need economic mechanisms to align with user interests rather than advertiser interests.
                  KarmaCall's refundable deposits provide exactly this kind of economic alignment in phone communications - callers pay you directly instead of
                  advertisers paying platforms.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Link: https://fyncom.com/mentions#digital-identity-trust */}
        <section className="mention-section" id="digital-identity-trust">
          <h2>On Digital Identity and Trust</h2>
          <VideoTrigger
            videoData={{
              title: "The Truth About AI: Sam Lessin's Contrarian Take",
              timestamp: "Watch ~3 minutes starting at 10:15",
              embedUrl: "https://www.youtube.com/watch?v=R_aHzJGrBN0&t=615s",
              directUrl: "https://www.youtube.com/watch?v=R_aHzJGrBN0&t=615s",
              isEmbeddable: false,
            }}
          />
          <div className="mention-content">
            <div className="highlight-text">
              <p>
                <strong>The Identity Crisis of the Open Internet:</strong> Joe starts by asking Sam about Sam's role in online identity, leading to a discussion
                about a friend working on anti-fraud in Africa. This conversation reveals a fundamental truth: the open internet brought unprecedented
                connectivity, but at the cost of identity verification and trust.
              </p>
              <p>
                <strong>The Trust Deficit:</strong> The discussion centers on how the lack of identity verification mechanisms has created a trust vacuum in
                digital communications. This is precisely the problem KarmaCall solves - by requiring callers to put money where their mouth is, we create
                economic incentives that restore trust between unknown parties. Scammers won't pay to call you, but legitimate callers will.
              </p>
              <p>
                <strong>Real-World Impact:</strong> The anti-fraud work in Africa mentioned in the conversation highlights how identity and trust issues aren't
                just theoretical - they have real economic and social consequences, particularly in developing markets where digital trust is crucial for
                economic participation.
              </p>
            </div>
          </div>
        </section>

        {/* Link: https://fyncom.com/mentions#communication-protocols */}
        <section className="mention-section" id="communication-protocols">
          <h2>On Communication Protocols</h2>
          <VideoTrigger
            videoData={{
              title: "Bootstrapping an AI Company to $5M ARR - Whippy CEO David Daneshgar",
              timestamp: "Watch 40s starting at 26:47",
              embedUrl: "https://www.youtube.com/watch?v=OWNppXSQOlA&t=1607s",
              directUrl: "https://www.youtube.com/watch?v=OWNppXSQOlA&t=1607s",
              isEmbeddable: false,
            }}
          />
          <div className="mention-content">
            <div className="highlight-text">
              <p>
                <strong>AI as Daily Business Tool:</strong> Daneshgar discusses how he uses AI on a daily basis for business operations, and mentions how his
                sales teams leverage AI automation for their outreach and customer engagement processes.
              </p>
              <p>
                <strong>The Personal Experience of Being Targeted:</strong> In an offhand but revealing comment, Daneshgar shares his personal experience of
                being on the receiving end of this same personalized automation technology. He's becoming increasingly jaded by the constant stream of
                AI-generated, personalized messages he receives.
              </p>
              <p>
                <strong>The Irony of Automation:</strong> This creates a fascinating irony - the same CEO who uses AI to automate customer communications is
                himself growing tired of receiving automated communications, even when they're personalized. This validates the fundamental problem KarmaCall
                solves: when everyone uses AI for outreach, the value of communication itself degrades. KarmaCall restores value by making callers pay for your
                attention.
              </p>
              <p>
                <strong>Scaling the Problem:</strong> Daneshgar's experience highlights how AI doesn't just enable better communication - it enables infinite
                communication, which paradoxically makes each individual message less valuable and more tiresome, regardless of personalization.
              </p>
            </div>
          </div>
        </section>

        {/* Link: https://fyncom.com/mentions#ai-powered-social-engineering */}
        <section className="mention-section" id="ai-powered-social-engineering">
          <h2>On AI-Powered Social Engineering</h2>
          <VideoTrigger
            videoData={{
              title: "Jeffrey Katzenberg on 2024 Election, Cybersecurity and New Health Venture",
              timestamp: "Watch 1 minute starting at 18:13",
              embedUrl: "https://www.youtube.com/embed/H90HY-lGraw?start=1100",
            }}
          />
          <div className="mention-content">
            <div className="highlight-text">
              <p>
                <strong>AI Voice and Email Impersonation:</strong> Katzenberg discusses sophisticated AI systems that can imitate tone of voice and writing
                style in emails, specifically targeting vulnerable populations like elderly individuals. This represents a new frontier in social engineering
                attacks.
              </p>
              <p>
                <strong>The "Door" Analogy:</strong> Katzenberg emphasizes that "once attackers get through the door, it's over," making a compelling case for
                preventive measures. This perfectly illustrates why KarmaCall's approach of creating a financial barrier at the phone call entry point is so
                crucial - we stop scammers before they can even reach you.
              </p>
              <p>
                <strong>Delegation and Filtering:</strong> The discussion touches on delegation strategies where younger people handle unknown communications
                for elderly relatives. KarmaCall provides a more systematic and scalable solution to this problem. Honestly, could you imagine having to handle
                your parents and grandparents' spam calls on top of your own? KarmaCall automatically blocks them and pays your family members for each blocked
                call.
              </p>
              <p>
                <strong>Economic Defense:</strong> The conversation implicitly supports the idea that financial barriers are among the most effective defenses
                against automated attacks, as they make mass targeting economically unfeasible for attackers.
              </p>
            </div>
          </div>
        </section>

        {/* Link: https://fyncom.com/mentions#ai-manipulation-phishing */}
        <section className="mention-section" id="ai-manipulation-phishing">
          <h2>On AI Manipulation and Phishing</h2>
          <VideoTrigger
            videoData={{
              title: "Yudkowsky and Wolfram on AI Risks",
              timestamp: "Watch 1 minute starting at 59:20",
              embedUrl: "https://www.youtube.com/embed/xjH2B_sE_RQ?start=3560",
            }}
          />
          <div className="mention-content">
            <div className="conversation-format">
              <div className="exchange">
                <h4>On the General Concern of LLMs "Hacking Humans"</h4>
                <p>
                  <strong>Stephen Wolfram:</strong> "Doing things which are hacking humans to get humans to believe all kinds of things."
                </p>
                <p>
                  <strong>Eli Yudkowsky:</strong> "Yeah, I'd say it's kind of borderline. It's not clear that the large language models are getting better at it
                  than average humans or better at it than the best humans."
                </p>
              </div>

              <div className="exchange">
                <h4>On LLM Capabilities in Phishing and Scalable Exploitation</h4>
                <p>
                  <strong>Stephen Wolfram:</strong> "They're good at phising, unfortunately; and humans are not very good at not being phished."
                </p>
                <p>
                  <strong>Eli Yudkowsky:</strong> "What they are is they're cheaper at phishing. They can phish everyone and see who's most vulnerable. Much
                  more cheaply than you can get a human to call up everyone on the planet."
                </p>
              </div>

              <div className="exchange">
                <h4>Key Insight: Scale vs. Sophistication</h4>
                <p>
                  The critical insight from this exchange is that AI's advantage in phishing isn't necessarily sophistication - it's{" "}
                  <strong>scale and cost-effectiveness</strong>. AI can attempt to phish everyone simultaneously and identify the most vulnerable targets,
                  something impossible for human attackers due to cost constraints.
                </p>
                <p>
                  This perfectly validates KarmaCall's approach: by introducing economic friction through refundable deposits, we make mass automated spam calls
                  economically unfeasible while allowing legitimate callers to reach you. Scammers can't afford to pay everyone they want to scam, but real
                  callers can afford small deposits.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Link: https://fyncom.com/mentions#infinite-spam-hyperpersonalization */}
        <section className="mention-section" id="infinite-spam-hyperpersonalization">
          <h2>On Infinite Spam and Hyperpersonalization</h2>
          <VideoTrigger
            videoData={{
              title: "Great VC Debate: Slow Ventures vs Greylock",
              timestamp: "Watch 45 seconds starting at 30:05",
              embedUrl: "https://www.youtube.com/embed/YcObLyRM15U?start=1805",
            }}
          />
          <div className="mention-content">
            <div className="highlight-text">
              <p>
                <strong>The Paradox of Hyperpersonalization:</strong> Sam Lesin discusses using AI for hyperpersonalized outbound sales, leading to the concept
                of "infinite spam" where customized messages become meaningless because nothing is truly custom anymore.
              </p>
              <p>
                <strong>The Worthless Inbox:</strong> Lesin notes how this trend makes the inbox worthless - when every message appears personalized but is
                actually automated, recipients lose the ability to distinguish genuine communications from spam.
              </p>
              <p>
                <strong>Platform Spread:</strong> What Lesin didn't get to mention is that this spam spreads beyond email to other platforms - social media,
                messaging apps, and any communication channel becomes vulnerable to the same hyperpersonalized automation.
              </p>
              <p>
                <strong>KarmaCall's Solution:</strong> This scenario perfectly illustrates why economic barriers are necessary. When making calls has a cost
                (even if refundable for legitimate conversations), it becomes economically impossible to make "infinite spam calls" regardless of how
                personalized they sound. You get paid for every blocked call!
              </p>
            </div>
          </div>
        </section>

        {/* Link: https://fyncom.com/mentions#digital-vs-human-hackers */}
        <section className="mention-section" id="digital-vs-human-hackers">
          <h2>On Digital vs Human Hackers</h2>
          <VideoTrigger
            videoData={{
              title: "The Government Knows AGI is Coming | The Ezra Klein Show",
              timestamp: "Watch 2 minutes starting at 09:18",
              embedUrl: "https://www.youtube.com/embed/Btos-LEYQ30?start=558",
            }}
          />
          <div className="mention-content">
            <div className="highlight-text">
              <p>
                <strong>The Scale Problem:</strong> Ezra Klein discusses how the fear of human hackers gets overwhelmed by digital hackers. The sheer scale at
                which AI can operate makes traditional human-scale security measures inadequate.
              </p>
              <p>
                <strong>The Code Fallacy:</strong> Ben Buchanan believes AI can help stop other AI through code, but this falls into the same fallacy that
                technologists have relied on for decades - that pure code can stop hackers.
              </p>
              <p>
                <strong>Beyond Technical Solutions:</strong> The reality requires accounting for social engineering and financial resources that can be gained
                through successful attacks. Technical solutions alone are insufficient when attackers can leverage human psychology and economic incentives.
              </p>
              <p>
                <strong>Holistic Defense:</strong> This conversation supports KarmaCall's approach of combining call blocking technology with economic
                incentives, addressing both the technical and human elements of spam call protection while getting you paid.
              </p>
            </div>
          </div>
        </section>

        {/* Link: https://fyncom.com/mentions#crypto-economic-prosperity */}
        <section className="mention-section" id="crypto-economic-prosperity">
          <h2>On Crypto and Economic Prosperity</h2>
          <VideoTrigger
            videoData={{
              title: "Next 3 years in Crypto - TOKEN 2049",
              timestamp: "Watch 3.5 minutes starting at 11:46",
              embedUrl: "https://www.youtube.com/embed/WCqzvo4bxJY?start=706",
            }}
          />
          <div className="mention-content">
            <div className="highlight-text">
              <p>
                <strong>Unlocking Innovation:</strong> The discussion explores what people will invent with crypto and how it opens up previously unimaginable
                possibilities. This technological foundation enables new economic models like KarmaCall's refundable deposits - getting paid to block spam calls
                was impossible before instant, zero-fee payments.
              </p>
              <p>
                <strong>Economic Equality Through Technology:</strong> The conversation touches on how crypto can bring economic equality and increase global
                economic prosperity by reducing barriers to financial participation.
              </p>
              <p>
                <strong>Zero Marginal Cost Evolution:</strong> The key insight: "In a future where marginal cost of storing and moving value goes to zero..."
                This parallels how we previously saw the marginal cost of communications go to zero, which created the spam problem FynCom solves.
              </p>
              <p>
                <strong>The Next Phase:</strong> Just as zero-cost communication enabled global connectivity but created spam call problems, zero-cost value
                transfer enables new economic models like getting paid to block spam calls - exactly what KarmaCall provides.
              </p>
            </div>
          </div>
        </section>

        {/* Link: https://fyncom.com/mentions#job-scam-surge-2024 */}
        <section className="mention-section" id="job-scam-surge-2024">
          <h2>On the 2024 Job Scam Text Surge</h2>
          <div className="mention-content">
            <div className="highlight-text">
              <p>
                <strong>The Predictions Come True:</strong> In January 2025, the{" "}
                <a href="https://www.linkedin.com/news/story/scam-job-texts-poised-to-multiply-7392058/" target="_blank" rel="noopener noreferrer">
                  Federal Trade Commission and LinkedIn reported
                </a>{" "}
                that Americans lost <strong>$470 million</strong> to text scams in 2024, with job scam texts ranking as the{" "}
                <strong>second most common type of hoax</strong>. This validates every prediction made by the industry leaders featured above.
              </p>
              <p>
                <strong>AI-Powered Scale:</strong> Just as Yudkowsky predicted, AI isn't necessarily better at phishing than humans—it's simply "cheaper at
                phishing" and can "phish everyone and see who's most vulnerable" at unprecedented scale. Job scammers are now using AI to send millions of
                personalized fake job offers for pennies.
              </p>
              <p>
                <strong>The Infinite Spam Reality:</strong> Sam Lessin's concept of "infinite spam" has materialized exactly as described. AI enables unlimited
                personalized job scam texts that appear custom but are actually automated, making each victim feel specially targeted while the scammer blasts
                millions simultaneously.
              </p>
              <p>
                <strong>Economic Desperation Exploitation:</strong> The combination of a rocky labor market and sophisticated AI targeting has created the
                perfect storm. Gen Z job seekers—despite being digital natives—are particularly vulnerable to these AI-generated, hyper-personalized scams.
              </p>
              <p>
                <strong>The Solution Was Always Economic:</strong> Traditional security measures (call blocking apps, number filtering, user education) continue
                to fail because they don't address the root cause: zero marginal cost of making calls. KarmaCall's refundable deposit approach makes mass spam
                calling economically impossible while paying you for each blocked call—exactly what this crisis demands.
              </p>
              <p>
                <strong>
                  Read our detailed analysis:{" "}
                  <a href="/blog/job-scam-texts-surge-2024" style={{ textDecoration: "underline", color: "var(--karmacall-green)" }}>
                    "Job Scam Texts Cost Americans $470M in 2024 - Here's the Economic Solution"
                  </a>
                </strong>
              </p>
            </div>
          </div>
        </section>
      </div>

      <VideoModal video={modalVideo} isOpen={!!modalVideo} onClose={closeModal} />

      <Footer />
    </div>
  )
}

export default Mentions
