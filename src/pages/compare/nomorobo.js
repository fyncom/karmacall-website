import React from "react"
import { Link } from "gatsby"
import Layout from "../../components/layout"
import Seo from "../../components/seo"
import { StaticImage } from "gatsby-plugin-image"

const NoMoRoboComparison = () => {
  const comparisonPoints = [
    {
      feature: "Pricing Model",
      karmacall: "Free + earn money for blocking spam",
      nomorobo: "Monthly subscription fee required",
    },
    {
      feature: "Platform Support",
      karmacall: "Mobile-first modern solution",
      nomorobo: "Primarily landline-focused with mobile options",
    },
    {
      feature: "Reward System",
      karmacall: "Cash rewards for blocking and reporting spam",
      nomorobo: "No user compensation",
    },
    {
      feature: "Technology",
      karmacall: "AI-powered with real-time community verification",
      nomorobo: "Traditional blacklist-based blocking",
    },
  ]

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">KarmaCall vs NoMoRobo: Modern vs Traditional Spam Blocking</h1>

        <div className="mb-8">
          <p className="text-lg mb-4">
            While NoMoRobo pioneered spam call blocking for landlines, KarmaCall represents the next generation of spam protection with its mobile-first,
            reward-based approach. See how they compare.
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
                  <h4 className="font-medium mb-2">NoMoRobo</h4>
                  <p>{point.nomorobo}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">KarmaCall's Modern Advantages</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Earn money while protecting your phone from spam</li>
            <li>No subscription fees or hidden costs</li>
            <li>Modern mobile-first design and experience</li>
            <li>Active community participation in spam fighting</li>
            <li>Advanced AI-powered detection system</li>
          </ul>
        </div>

        <div className="text-center">
          <Link to="/" className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors">
            Try KarmaCall Free Today
          </Link>
        </div>
      </div>
    </Layout>
  )
}

export const Head = () => (
  <Seo
    title="KarmaCall vs NoMoRobo Comparison - Modern Spam Call Protection"
    description="Compare KarmaCall and NoMoRobo spam blocking services. See why KarmaCall's modern approach with cash rewards is the better choice for mobile users."
  />
)

export default NoMoRoboComparison
