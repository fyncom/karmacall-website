import React, { useState } from "react"
import Header from "../components/header"
import Seo from "../components/seo"
import "../components/mentions.css"
import { createKeyboardClickHandlers } from "../utils/keyboardNavigation"

const Mentions = () => {
  const [modalVideo, setModalVideo] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = video => {
    setModalVideo(video)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setModalVideo(null)
  }

  const VideoTrigger = ({ videoData, children }) => {
    const handleClick = () => {
      if (videoData.isEmbeddable === false) {
        window.open(videoData.directUrl, "_blank")
      } else {
        openModal(videoData)
      }
    }

    const clickHandlers = createKeyboardClickHandlers(handleClick, {
      role: "button",
    })

    return (
      <button className="video-trigger" {...clickHandlers}>
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

    const modalClickHandlers = createKeyboardClickHandlers(onClose, {
      role: "button",
    })

    const closeButtonHandlers = createKeyboardClickHandlers(onClose, {
      role: "button",
    })

    return (
      <div className={`video-modal ${isOpen ? "open" : ""}`} {...modalClickHandlers}>
        <div className="video-modal-content" onClick={e => e.stopPropagation()}>
          <div className="video-modal-header">
            <h3>{video.title}</h3>
            <button className="close-modal" {...closeButtonHandlers} aria-label="Close modal">
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
      </section>

      <div className="mentions-container">
        {/* Link: https://fyncom.com/mentions#ai-agents-automated-calling */}
        <section className="mention-section" id="ai-agents-automated-calling">
          <h2>On AI Agents and Automated Calling</h2>
          <VideoTrigger
            videoData={{
              title: "Sam Altman & Mamoon Hamid on AI Investment Opportunities",
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
                  <button
                    className="video-link-button"
                    {...createKeyboardClickHandlers(() =>
                      openModal({
                        title: "Seamless Communications Protocols (23:51-24:35)",
                        timestamp: "Watch from 23:51",
                        embedUrl: "https://www.youtube.com/embed/v9JBMnxuPX8?start=1431",
                      })
                    )}
                  >
                    Seamless Communications Protocols (23:51-24:35)
                  </button>
                  :
                </strong>{" "}
                The discussion of seamless communication protocols is remarkably close to what KarmaCall is building. The speakers recognize that future AI
                systems will need robust communication frameworks that can handle trust, verification, and value transfer - exactly what KarmaCall provides for
                phone calls.
              </p>
              <p>
                <strong>
                  <button
                    className="video-link-button"
                    {...createKeyboardClickHandlers(() =>
                      openModal({
                        title: "Transfer of Trust (24:30-25:05)",
                        timestamp: "Watch from 24:30",
                        embedUrl: "https://www.youtube.com/embed/v9JBMnxuPX8?start=1470",
                      })
                    )}
                  >
                    Transfer of Trust (24:30-25:05)
                  </button>
                  :
                </strong>{" "}
                This segment introduces the critical concept of "Transfer of Trust" between AI agents. As AI systems become more autonomous, they'll need
                mechanisms to establish and transfer trust - exactly what KarmaCall's refundable deposits enable for phone calls and digital communications.
              </p>
              <p>
                <strong>
                  <button
                    className="video-link-button"
                    {...createKeyboardClickHandlers(() =>
                      openModal({
                        title: "Agent Swarms and Trust Networks (21:46-22:46)",
                        timestamp: "Watch from 21:46",
                        embedUrl: "https://www.youtube.com/embed/v9JBMnxuPX8?start=1306",
                      })
                    )}
                  >
                    Agent Swarms and Trust Networks (21:46-22:46)
                  </button>
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

      <VideoModal video={modalVideo} isOpen={isModalOpen} onClose={closeModal} />

      {/* Footer is not included in the edit_specification, so it's removed. */}
    </div>
  )
}

export default Mentions
