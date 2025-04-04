import React from "react"
import { Link } from "gatsby"
import Layout from "../../components/layout"
import Seo from "../../components/seo"
import { StaticImage } from "gatsby-plugin-image"

const HiyaComparison = () => {
  const comparisonPoints = [
    {
      feature: "Business Model",
      karmacall: "User-centric with cash rewards for participation",
      hiya: "Business-focused spam protection service",
    },
    {
      feature: "User Earnings",
      karmacall: "Get paid for blocking and reporting spam calls",
      hiya: "No monetary benefits for users",
    },
    {
      feature: "Spam Detection",
      karmacall: "AI-powered with community verification",
      hiya: "Phone number reputation database",
    },
    {
      feature: "User Experience",
      karmacall: "Simple, focused on individual users",
      hiya: "Enterprise-oriented features",
    },
  ]

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">KarmaCall vs Hiya: Comparing Spam Protection Solutions</h1>

        <div className="mb-8">
          <p className="text-lg mb-4">
            While Hiya focuses on enterprise-level spam protection, KarmaCall puts the power (and rewards) in users' hands. See how these two approaches to spam
            call blocking compare.
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
                  <h4 className="font-medium mb-2">Hiya</h4>
                  <p>{point.hiya}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Why Individual Users Choose KarmaCall</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Direct financial benefits for blocking spam calls</li>
            <li>User-friendly interface designed for individuals</li>
            <li>Community-driven spam detection and reporting</li>
            <li>No complex enterprise features you don't need</li>
            <li>Free to use with added earning potential</li>
          </ul>
        </div>

        <div className="text-center">
          <Link to="/" className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors">
            Join KarmaCall Today
          </Link>
        </div>
      </div>
    </Layout>
  )
}

export const Head = () => (
  <Seo
    title="KarmaCall vs Hiya Comparison - Earn Money Blocking Spam Calls"
    description="Compare KarmaCall and Hiya spam protection services. Discover why KarmaCall's user-focused approach with cash rewards is the better choice for individuals."
  />
)

export default HiyaComparison
