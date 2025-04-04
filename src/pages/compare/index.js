import React from "react"
import { Link } from "gatsby"
import Layout from "../../components/layout"
import Seo from "../../components/seo"

const ComparisonIndex = () => {
  const competitors = [
    {
      name: "TrueCaller",
      description: "See how KarmaCall's unique rewards system compares to TrueCaller's traditional approach.",
      link: "/comparisons/truecaller",
      key_difference: "Get paid for blocking spam calls",
    },
    {
      name: "RoboKiller",
      description: "Compare KarmaCall's free service with RoboKiller's subscription model.",
      link: "/comparisons/robokiller",
      key_difference: "No subscription fees + earn money",
    },
    {
      name: "Hiya",
      description: "Discover why KarmaCall is better for individual users compared to Hiya's enterprise focus.",
      link: "/comparisons/hiya",
      key_difference: "User-focused with cash rewards",
    },
    {
      name: "NoMoRobo",
      description: "Learn how KarmaCall's modern approach beats NoMoRobo's traditional blocking methods.",
      link: "/comparisons/nomorobo",
      key_difference: "Modern mobile-first solution",
    },
  ]

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">Compare KarmaCall with Other Spam Blockers</h1>

        <div className="mb-12">
          <p className="text-lg mb-4">
            See how KarmaCall stacks up against other spam call blocking solutions. Unlike traditional apps, KarmaCall pays you to block spam calls while
            providing superior protection.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 mb-12">
          {competitors.map(competitor => (
            <Link key={competitor.name} to={competitor.link} className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-bold mb-2">KarmaCall vs {competitor.name}</h2>
              <p className="text-gray-600 mb-4">{competitor.description}</p>
              <div className="bg-green-50 p-4 rounded-md">
                <h3 className="font-semibold text-green-800 mb-2">Key Advantage</h3>
                <p className="text-green-700">{competitor.key_difference}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Why Choose KarmaCall?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">For Users</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Earn money while blocking spam</li>
                <li>Free to use - no subscriptions</li>
                <li>Modern, user-friendly interface</li>
                <li>Advanced AI-powered protection</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Community Benefits</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Contribute to fighting scammers</li>
                <li>Help protect others</li>
                <li>Real-time threat detection</li>
                <li>Continuous improvement</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link to="/" className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors">
            Get Started with KarmaCall
          </Link>
        </div>
      </div>
    </Layout>
  )
}

export const Head = () => (
  <Seo
    title="Compare KarmaCall vs Other Spam Blockers - Get Paid to Block Spam"
    description="See how KarmaCall compares to TrueCaller, RoboKiller, Hiya, and NoMoRobo. Learn why KarmaCall's unique approach of paying users to block spam calls makes it the best choice."
  />
)

export default ComparisonIndex
