import React from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import "../components/pricing.css"
import Seo from "../components/seo"

const Pricing = () => {
  const htmlContent = `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body>
    <h1 id="pricing">Pricing</h1>
    <p> <span>A part of your monthly subscription is usable for Rewards.</span> <span>This does not roll over at the end of the month.</span> <span>Account top-ups roll over indefinitely.</span></p>
    <table>
      <thead>
        <tr>
          <th align="center"><img src="https://fyncom-static-files.s3.us-west-1.amazonaws.com/pricing/Pricing+Graphic+A1.png" alt="Pricing"></th>
          <th align="center"><img src="https://fyncom-static-files.s3.us-west-1.amazonaws.com/pricing/Pricing+Standard+A2_50.png" alt="Standard Pricing" onMouseOver="this.style.cursor='pointer'" onclick="window.open('https://fyncom.chargebee.com/hosted_pages/checkout?subscription_items[item_price_id][0]=standard-USD-Monthly&amp;subscription_items[quantity][0]=1'), 'target=_blank', 'rel=noopener noreferrer';"></th>
          <th align="center"><img src="https://fyncom-static-files.s3.us-west-1.amazonaws.com/pricing/Pricing+Pro+A3_.png" alt="Pro Pricing" onMouseOver="this.style.cursor='pointer'" onclick="window.open('https://fyncom.chargebee.com/hosted_pages/checkout?subscription_items[item_price_id][0]=pro-USD-Monthly&amp;subscription_items[quantity][0]=1'), 'target=_blank', 'rel=noopener noreferrer';"></th>
          <th align="center"><img src="https://fyncom-static-files.s3.us-west-1.amazonaws.com/pricing/Pricing+Enterprise+A4.png" alt="Enterprise Pricing" onMouseOver="this.style.cursor='pointer'" onclick="window.open('https://www.fyncom.com/contact'), 'target=_blank';"></th>
        </tr>
      </thead>
      <tbody>
        <tr>
            <td align="center">"Use It or Lose It" Credits*</td>
            <td align="center">$20</td>
            <td align="center">$50</td>
            <td align="center">Custom</td>
        </tr>
        <tr class="intellij-row-even">
            <td align="center">Sender Accounts</td>
            <td align="center">3</td>
            <td align="center">10</td>
            <td align="center">100+</td>
        </tr>
        <tr>
            <td align="center">Rewards Campaigns<sup>1</sup></td>
            <td align="center">5</td>
            <td align="center">20</td>
            <td align="center">Unlimited</td>
        </tr>
        <tr class="intellij-row-even">
            <td align="center">Commission<sup>2</sup></td>
            <td align="center">30%</td>
            <td align="center">15%</td>
            <td align="center">5%</td>
        </tr>
        <tr>
            <td align="center">Support</td>
            <td align="center">Email</td>
            <td align="center">Priority, Email &amp; Phone</td>
            <td align="center">Dedicated Manager</td>
        </tr>
        <tr class="intellij-row-even">
            <td colspan="4" align="center">User Experience When Receiving Rewards + Cashing Out</td>
        </tr>
        <tr>
            <td align="center">User Dashboard to Manage Funds</td>
            <td align="center">✅</td>
            <td align="center">✅</td>
            <td align="center">✅</td>
        </tr>
        <tr class="intellij-row-even">
            <td align="center">User Gift Card Cashout</td>
            <td align="center">✅</td>
            <td align="center">✅</td>
            <td align="center">✅</td>
        </tr>
        <tr>
            <td align="center">"1 Click Redeem" Email Notification</td>
            <td align="center">❌</td>
            <td align="center">✅</td>
            <td align="center">✅</td>
        </tr>
        <tr class="intellij-row-even">
            <td align="center">Branded Email Notifications</td>
            <td align="center">❌</td>
            <td align="center">✅</td>
            <td align="center">✅</td>
        </tr>
        <tr>
            <td colspan="4" align="center" >Ways You Can Reward Responses (Reward Integrations)</td>
        </tr>
        <tr class="intellij-row-even">
            <td align="center">Google Calendar Rewards</td>
            <td align="center">✅</td>
            <td align="center">✅</td>
            <td align="center">✅</td>
        </tr>
        <tr>
            <td align="center">Calendly Rewards</td>
            <td align="center">✅</td>
            <td align="center">✅</td>
            <td align="center">✅</td>
        </tr>
        <tr class="intellij-row-even">
            <td align="center">Google Forms Rewards</td>
            <td align="center">✅</td>
            <td align="center">✅</td>
            <td align="center">✅</td>
        </tr>
        <tr>
            <td align="center">Typeform Rewards</td>
            <td align="center">✅</td>
            <td align="center">✅</td>
            <td align="center">✅</td>
        </tr>
        <tr class="intellij-row-even">
            <td align="center">Zapier Rewards</td>
            <td align="center">✅</td>
            <td align="center">✅</td>
            <td align="center">✅</td>
        </tr>
        <tr>
            <td align="center">Email Rewards</td>
            <td align="center">✅</td>
            <td align="center">✅</td>
            <td align="center">✅</td>
        </tr>
        <tr class="intellij-row-even">
            <td align="center">Text Rewards</td>
            <td align="center">✅</td>
            <td align="center">✅</td>
            <td align="center">✅</td>
        </tr>
        <tr>
            <td align="center">Call Rewards</td>
            <td align="center">❌</td>
            <td align="center">❌</td>
            <td align="center">✅</td>
        </tr>
        <tr class="intellij-row-even">
            <td align="center">Salesforce Rewards</td>
            <td align="center">❌</td>
            <td align="center">❌</td>
            <td align="center">✅</td>
        </tr>
        <tr>
            <td align="center">Custom Integrations</td>
            <td align="center">❌</td>
            <td align="center">1</td>
            <td align="center">As needed</td>
        </tr>
        <tr class="intellij-row-even">
            <td colspan="4" align="center">Developer Tools</td>
        </tr>
        <tr>
            <td align="center" >API Access</td>
            <td align="center" >❌</td>
            <td align="center" >✅</td>
            <td align="center" >✅</td>
        </tr>
        <tr class="intellij-row-even" >
            <td colspan="4" align="center">Admin Tools</td>
        </tr>
        <tr>
            <td align="center">Rewards Campaign Dashboard</td>
            <td align="center">✅</td>
            <td align="center">✅</td>
            <td align="center">✅</td>
        </tr>
        <tr class="intellij-row-even">
            <td align="center">Data Analytics Dashboard</td>
            <td align="center">❌</td>
            <td align="center">✅</td>
            <td align="center">✅</td>
        </tr>
        <tr>
            <td align="center">Min Value / Max Engagement Tips</td>
            <td align="center">❌</td>
            <td align="center">✅</td>
            <td align="center">✅</td>
        </tr>
        <tr class="intellij-row-even">
            <td align="center">Optimal Rewards Data Insight</td>
            <td align="center">✅</td>
            <td align="center">✅</td>
            <td align="center">✅</td>
        </tr>
        <tr>
            <td align="center">Advanced Data Insights<sup>3</sup></td>
            <td align="center">❌</td>
            <td align="center">❌</td>
            <td align="center">✅</td>
        </tr>
    
        <tr class="intellij-row-even">
            <td align="center"></td>
            <td align="center"><button name="button" style="background-color:#4A90E2;color:white" onMouseOver="this.style.cursor='pointer'" onclick="window.open('https://fyncom.chargebee.com/hosted_pages/checkout?subscription_items[item_price_id][0]=standard-USD-Monthly&amp;subscription_items[quantity][0]=1'), 'target=_blank', 'rel=noopener noreferrer';">Get Standard</button></td>
            <td align="center"><button name="button" style="background-color:#4A90E2;color:white" onMouseOver="this.style.cursor='pointer'" onclick="window.open('https://fyncom.chargebee.com/hosted_pages/checkout?subscription_items[item_price_id][0]=pro-USD-Monthly&amp;subscription_items[quantity][0]=1'), 'target=_blank', 'rel=noopener noreferrer';">Get Pro</button></td>
            <td align="center"><button name="button" style="background-color:#4A90E2;color:white" onMouseOver="this.style.cursor='pointer'" onclick="window.open('https://www.fyncom.com/contact'), 'target=_blank';">Contact Us</button></td>
<!--Update to use gatsby Link later if possible-->
<!--            <td align="center"><Link to="/contact" style="background-color:#4A90E2; color:white">FynCom</Link></td>-->

        </tr>
       </tbody>
    </table>
      <p><sup>*</sup><strong>Use It or Lose It for Standard & Pro Plans</strong> <br>
        <span>Your subscription gives you FynCom credit to use as Rewards each month, inclusive of commission. No roll overs.</span>
      </p>
      <p><sup>1</sup><strong>Rewards Campaigns</strong> <br>
        <span>The number of active Rewards Campaigns your plan can have at a time.</span>
      </p>
      <p><sup>2</sup><strong>Commission</strong> <br>
        <span>The commission is based on reward size and is only paid to FynCom when a response is received or desired action completed.</span> <br>
        <span>Here is an example for Standard plans.</span> <br>
        <span>You create a Rewards Campaign of $1.00 and attach it to a Calendly booking so that anyone who books get rewarded.</span> <br>
      </p>
      <!-- The rest of your content goes here -->
    <ul>
      <li>jamie@bestFakeCompany.com books an event.</li>
      <li>$1.15 total is deducted from your Account Balance.</li>
      <li>Jamie instantly receives $1.00 from your Account Balance and is notified by email.
        <ul>
          <li>FynCom receives $0.15 from your Account Balance.</li>
          <li>Jamie is not charged any fees to withdraw funds or purchase gift cards.</li>
        </ul>
      </li>
    </ul>
    <p><span>Here is the same sample for all plans.</span> <br></p>
    <table class="small">
      <thead>
        <tr>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Reward To Recipient</td>
          <td>$1.00</td>
          <td>$1.00</td>
          <td>$1.00</td>
        </tr>
        <tr class="intellij-row-even">
          <td>Commission to FynCom</td>
          <td>$0.30</td>
          <td>$0.15</td>
          <td>$0.05</td>
        </tr>
        <tr>
          <td>Amount deducted from your FynCom balance</td>
          <td>$1.30</td>
          <td>$1.15</td>
          <td>$1.05</td>
        </tr>
      </tbody>
    </table>
    <p><sup>3</sup><strong>Advanced Data Insights</strong> <br> <span>Be the first to know the optimal rewards sizes to deliver to certain demographics and at which point of the journey to deliver said rewards.</span></p>
  </body>
</html>`

  // The drop down HTML
  const infoDropDown = `<!doctype html>
<html>
  <body>
    <div>
      <details open>
        <summary>
          <h2 id="fyncom-faqs">FynCom FAQs</h2>
        </summary>
        <blockquote>
          <details open>
            <summary>
              <h3 id="is-there-a-free-version">Is there a free version?</h3>
            </summary>
            <blockquote>
              <p>No. The closest we have is the Standard plan, which charges you $50 per month, but give you $20 in rewards to spend each month. <br> We're in the business of helping you get more responses, feedback, &amp; engagement by adding Interactive Rewards into your workflow. <br> The hardest part of using Interactive Rewards, is getting started. Once you do this on a regular basis, you'll wish you had done it earlier.</p>
              <details>
                <summary>
                  <h4 id="so-i-lose-20-if-i-don--t-use-my-use-it-or-lose-it-credits">So I lose $20 if I don't use my Use it or Lose it Credits?</h4>
                </summary>
                <blockquote>
                  <p>No. We help you automate the spending of your Use it or Lose it Credits each month before it expires. <br> Even if it does not go to a customer, it should be used to give you a little treat 😉 <br> Here's how we help.</p>
                  <ol>
                    <li>
                      In your settings, select how you would like the remaining balance of your monthly rewards to be spent in case you have not used it.
                      <ul>
                        <li>
                          Directly send the remaining balance (minus commission), at random, to...
                          <ul>
                            <li>One of the emails who have interacted with your campaigns this month</li>
                            <li>Anyone who has a FynCom account under your plan (typically employees, or marketing team)</li>
                            <li>A list of emails you upload into your settings</li>
                          </ul>
                        </li>
                        <li>
                          Send an Interactive Rewards email that offers the remaining balance (minus commission) in exchange for a survey response
                          <ul>
                            <li>Can be sent to one of the same set of 3 categories above</li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ol>
                  <p>If neither of these options are chosen, we default to sending the remaining balance (minus commission) to the primary admin who created the account. <br> Our commission is deducted from the remaining balance - the same commission would be deducted if you use these credits in a campaign. <br></p>
                </blockquote>
              </details>
            </blockquote>
          </details>
          <br>
          <details open>
            <summary>
              <h3 id="what-is-the-best-way-to-use-rewards">What is the best way to use rewards?</h3>
            </summary>
            <blockquote>
              We'll give you a framework to answer this for yourself. This is how customers find success with FynCom and how they start to min/max value/engagment. <br> <br>
              <details>
                <summary>
                  <h4 id="framework-for-rewards-success">Framework for rewards success</h4>
                </summary>
                <blockquote>
                  <p>Run A/B tests until you get to the smallest value you can offer, while still have a substantial increase in your responses.</p>
                  <ol>
                    <li>
                      Run an A/B test #1 to test your outreach campaign with and without a FynCom Reward.
                      <ul>
                        <li>Ensure that you make it clear throughout the Rewards sequence that there is an IMMEDIATE incentive available.</li>
                      </ul>
                    </li>
                    <li>If you see greater response rates with the test that has a reward (it never fails), then you'll want to run your next A/B Test</li>
                    <li>
                      Run A/B test #2 to compare an outreach campaign with the same Reward from A/B test #1 versus a campaign with 25% of that reward.
                      <ul>
                        <li>How do the tests compare with what you're used to? You may find that just the smallest incentive possible makes a substantial difference in your response rates.</li>
                      </ul>
                    </li>
                  </ol>
                </blockquote>
              </details>
              <br>
              <details>
                <summary>
                  <h4 id="can-you-just-tell-me-the-answer">Can you just tell me the answer?</h4>
                </summary>
                <blockquote>
                  <p>
                    <span>
                      Someday, we will. We run tests daily, but need pioneers like you, testing this in their workflows. It is our goal to be the place you go to, 
                      when you need to know how much it costs on average to get a Director of Marketing at a Series B Software Startup. That comes with scale. The 
                      people who come on this journey with us will be the first to know and will reap benefits throughout the entire journey.
                    </span>
                  </p>
                  <p><span>Below are a few of the variables that influence the answer to the question above.</span></p>
                  <ul>
                    <li>
                      Industry
                      <ul>
                        <li>Who do you sell to?</li>
                      </ul>
                    </li>
                    <li>
                      Reputation of your company
                      <ul>
                        <li>Does your company have enough brand recognition?</li>
                        <li>Are your ideal customers eager to respond to you when you reach out?</li>
                      </ul>
                    </li>
                    <li>
                      Maturity of your product / service / feature
                      <ul>
                        <li>Is it at product market fit?</li>
                        <li>Is it before product market fit?</li>
                      </ul>
                    </li>
                    <li>
                      Financial health of your business
                      <ul>
                        <li>
                          Does your company print money?
                          <ul>
                            <li>Maybe you can afford to be a little more extravagant in the Interactive rewards you offer</li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </blockquote>
              </details>
              <br>
              <details open>
                <summary>
                  <h3 id="how-do-i-get-started">How do I get started?</h3>
                </summary>
                <blockquote>
                  <p>
                    <span> Most people who start with us, begin with rewarding someone to take a meeting. If you have other things you'd like to try, explore 
                      our Help page to see what is right for you. If you need a little extra help, we are happy to help you figure out what works best for you. 
                      Just shoot us an email here.
                    </span>
                  </p>
                </blockquote>
              </details>
     <style>
        details summary { cursor: pointer; }
        details summary > * { display: inline; }
      </style>
    </div>
  </body>
</html>
`

  return (
    // <ReactMarkdown skipHtml={false}>{markdownContent}</ReactMarkdown>
    <div>
      <Seo
        title="Pricing"
        description="Purchase FynCom tools to help you increase trust and show people why you are different and should be heard."
      />
      <Header />
      <div
        className="html-content"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
      <div
        className="html-content-dropdown"
        dangerouslySetInnerHTML={{ __html: infoDropDown }}
      />
      <Footer />
    </div>
  )
}

export default Pricing
