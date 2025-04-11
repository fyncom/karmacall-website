import React from "react"
import Header from "../../components/header"
import Footer from "../../components/footer"
import "../../components/help-center.css"
import "../../components/email-filters-and-rewards.css"
import Seo from "../../components/seo"
import GoogleDocsViewer from "../../components/GoogleDocsViewer"
import Layout from "../../components/layout"
import VideoEmbed from "../../components/VideoEmbed"
import Breadcrumbs from "../../components/Breadcrumbs"

const EmailFiltersAndRewards = () => {
  return (
    <div className="email-filters-rewards-container">
      <Seo title="FynCom Filters: Email Edition" description="setup your meail filters here." />
      <Header />
      <Breadcrumbs link={"/user-help-center"} title="FynCom Filters: Email Edition" />

      <main className={"filter-custom-page"}>
        <section className="setup-section">
          <h1>FynCom Filters: Email Edition</h1>
          <p>Set up your filter, manage settings, and more. Towards the bottom, you can see our development roadmap.</p>
          <div className="setup-instructions">
            <h2>Setup</h2>
            <p>
              <i>Block less than 100 emails a month? Try the free version by following the steps below.</i>
            </p>
            <ol>
              <li>
                Create an account on <a href="https://app.fyncom.com">app.fyncom.com</a> using "Sign in with Google".
                <ul>
                  <li>Check your email inbox to click the email verification link.</li>
                </ul>
              </li>
              <li>
                Select "Settings".
                <ul>
                  <li>Select "Email Filters".</li>
                  <li>
                    Select "Sign in with Google" from the <a href="https://app.fyncom.com/settings">"Best Experience"</a>
                    {""} box.
                  </li>
                  <li>Approve the permission requests.</li>
                </ul>
              </li>
            </ol>
            <p>
              <b>Done!</b> You can follow along with the videos below.
            </p>

            <h3>Extra information / FAQs</h3>
            <p className="underline">Whitelisting Setup</p>
            <ol>
              <li>
                Global Whitelist
                <ul>
                  <li>
                    <a href="https://github.com/fyncom/whitelist/blob/main/domains.json">
                      {" "}
                      The global whitelist is publicly viewable and updated in realt-time.
                    </a>{" "}
                    Domains like .edu and .gov are whitelisted by default. A number of other domains and email senders are whitelisted here.{" "}
                    <a href="https://github.com/fyncom/whitelist">Guidelines are here</a>.
                  </li>
                </ul>
              </li>
              <li>
                Personal Whitelist
                <ul>
                  <li>
                    To move emails into your personal whitelist, you can drag an email out of the FynFiltered and into the FynWhiteList email label.{" "}
                    <a href="https://youtu.be/XgVJ7qrwlHk?t=189">See Timestamp here</a>.
                  </li>
                </ul>
              </li>
            </ol>
          </div>
        </section>

        <div className="videos-section">
          <h3>Video Tutorials</h3>
          <div className="videos-container">
            <div className="video-description">
              <p>Watch this first. It's our most recent video</p>
              <VideoEmbed
                videoUrl="https://www.youtube.com/embed/BKLMSqC9mtA"
                title="FynCom Email Filters: Latest Tutorial"
                description="Latest tutorial on setting up and using FynCom's email filters to manage your inbox and earn rewards."
                thumbnailUrl="https://i.ytimg.com/vi/BKLMSqC9mtA/maxresdefault.jpg"
                uploadDate="2024-01-11"
              />
            </div>
            <div className="video-description">
              <p>Only watch this if you want to see the first version</p>
              <VideoEmbed
                videoUrl="https://www.youtube.com/embed/XgVJ7qrwlHk"
                title="FynCom Filters: Email Edition Tutorial"
                description="Learn how to set up and use FynCom's email filters to manage your inbox and earn rewards."
                thumbnailUrl="https://i.ytimg.com/vi/XgVJ7qrwlHk/maxresdefault.jpg"
                uploadDate="2024-01-11"
              />
            </div>
          </div>
        </div>
        <h3>Roadmap</h3>
        <GoogleDocsViewer fileID="1KbcIqV3PClA6KF7W0uwPJgvzTUxtFJuoD39wMwZ5nvQ" />
      </main>
      <Footer />
    </div>
  )
}

export default EmailFiltersAndRewards
