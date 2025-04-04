import React from "react"
import { Link } from "gatsby"
import Layout from "../../components/layout"
import Seo from "../../components/seo"
import { StaticImage } from "gatsby-plugin-image"

const TrueCallerComparison = () => {
  const comparisonPoints = [
    {
      feature: "Spam Call Blocking",
      karmacall: "Advanced AI-powered spam detection with community feedback",
      truecaller: "Crowdsourced spam identification system",
    },
    {
      feature: "Monetary Benefits",
      karmacall: "Get paid for blocked spam calls and reporting scammers",
      truecaller: "No monetary rewards",
    },
    {
      feature: "Privacy",
      karmacall: "No phone book access required, privacy-first approach",
      truecaller: "Requires access to phone contacts",
    },
    {
      feature: "Community Impact",
      karmacall: "Direct contribution to fighting scammers with financial incentives",
      truecaller: "Passive spam reporting system",
    },
  ]

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">KarmaCall vs TrueCaller: Detailed Comparison</h1>

        <div className="mb-8">
          <p className="text-lg mb-4">
            Looking for the best spam call blocker? Let's compare KarmaCall and TrueCaller to help you make an informed decision about which service better
            suits your needs.
          </p>
        </div>

        <div className="grid gap-8 mb-12">
          {comparisonPoints.map((point, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">{point.feature}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium mb-2">KarmaCall</h4>
                  <p>{point.karmacall}</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium mb-2">TrueCaller</h4>
                  <p>{point.truecaller}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Why Choose KarmaCall?</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Earn money while blocking spam calls</li>
            <li>Privacy-focused approach - no access to your contacts required</li>
            <li>Advanced AI-powered spam detection</li>
            <li>Active contribution to fighting scammers</li>
            <li>Regular payouts for your participation</li>
          </ul>
        </div>

        <div className="text-center">
          <Link to="/" className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors">
            Try KarmaCall Today
          </Link>
        </div>
      </div>
    </Layout>
  )
}

export const Head = () => (
  <Seo
    title="KarmaCall vs TrueCaller Comparison - Get Paid to Block Spam Calls"
    description="Compare KarmaCall and TrueCaller spam blocking apps. See why KarmaCall's unique approach of paying users to block spam calls makes it the better choice for spam protection."
  />
)

export default TrueCallerComparison
