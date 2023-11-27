import { getImage } from "gatsby-plugin-image"
import { graphql, useStaticQuery } from "gatsby"

export const useCombinedQuery = () => {
  const data = useStaticQuery(graphql`
    query CombinedStaticQuery {
      fyncomFilterGmail: file(relativePath: { eq: "fyncom_filters_gmail_edition_no_logo.png" }) {
        childImageSharp {
          gatsbyImageData(width: 300, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      fyncomFilterGmailDark: file(relativePath: { eq: "fyncom_filters_gmail_edition_no_logo-white.png" }) {
        childImageSharp {
          gatsbyImageData(width: 300, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      appStoreBadge: file(relativePath: { eq: "apple-en.png" }) {
        childImageSharp {
          gatsbyImageData(width: 300, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      googlePlayBadge: file(relativePath: { eq: "google-play-en.png" }) {
        childImageSharp {
          gatsbyImageData(width: 300, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      teamMeeting: file(relativePath: { eq: "team-meeting.webp" }) {
        childImageSharp {
          gatsbyImageData(width: 486, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      innovation: file(relativePath: { eq: "icons/innovation.webp" }) {
        childImageSharp {
          gatsbyImageData(width: 150, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      collaboration: file(relativePath: { eq: "icons/collaboration.webp" }) {
        childImageSharp {
          gatsbyImageData(width: 150, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      transparency: file(relativePath: { eq: "icons/transparency.webp" }) {
        childImageSharp {
          gatsbyImageData(width: 150, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      customerFocus: file(relativePath: { eq: "icons/customer-focus.webp" }) {
        childImageSharp {
          gatsbyImageData(width: 150, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      continuousImprovement: file(relativePath: { eq: "icons/continuous-improvement.webp" }) {
        childImageSharp {
          gatsbyImageData(width: 150, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      fyncomFiltersWords: file(relativePath: { eq: "fyncom-filters-black.png" }) {
        childImageSharp {
          gatsbyImageData(width: 500, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      fyncomFiltersWordsDark: file(relativePath: { eq: "fyncom-filters-white.png" }) {
        childImageSharp {
          gatsbyImageData(width: 500, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      heroImageFilter: file(relativePath: { eq: "email-filter-gmail.png" }) {
        childImageSharp {
          gatsbyImageData(width: 300, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      emailFilterFyncom: file(relativePath: { eq: "email-filter-fyncom.png" }) {
        childImageSharp {
          gatsbyImageData(width: 300, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      getPaidToBlockSpamEmails: file(relativePath: { eq: "get-paid-to-block-spam-emails.png" }) {
        childImageSharp {
          gatsbyImageData(width: 300, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      cleanInboxCleanMind: file(relativePath: { eq: "a-clean-inbox-and-a-focused-mind.png" }) {
        childImageSharp {
          gatsbyImageData(width: 300, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      sendgrid: file(relativePath: { eq: "logos/SG_Twilio_Lockup_RGBx1.png" }) {
        childImageSharp {
          gatsbyImageData(width: 600, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      slicktext: file(relativePath: { eq: "logos/SlickText_Logo-Transparent.png" }) {
        childImageSharp {
          gatsbyImageData(width: 600, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      zapier: file(relativePath: { eq: "logos/2560px-Zapier_logo.png" }) {
        childImageSharp {
          gatsbyImageData(width: 600, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      handshake: file(relativePath: { eq: "illustrations/handshake.png" }) {
        childImageSharp {
          gatsbyImageData(width: 1000, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      collaborate: file(relativePath: { eq: "illustrations/collaborating-with-others.png" }) {
        childImageSharp {
          gatsbyImageData(width: 375, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      effectiveSpend: file(relativePath: { eq: "illustrations/create-efficient-costs.png" }) {
        childImageSharp {
          gatsbyImageData(width: 375, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      integrations: file(relativePath: { eq: "illustrations/integrate-with-emails-and-more.png" }) {
        childImageSharp {
          gatsbyImageData(width: 375, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      salesHeroImage: file(relativePath: { eq: "illustrations/sales-phone-calls.png" }) {
        childImageSharp {
          gatsbyImageData(width: 800, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      increaseBookings: file(relativePath: { eq: "illustrations/increase-bookings.png" }) {
        childImageSharp {
          gatsbyImageData(width: 375, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      accelerateDeals: file(relativePath: { eq: "illustrations/deal-acceleration-charts.png" }) {
        childImageSharp {
          gatsbyImageData(width: 375, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      minMax: file(relativePath: { eq: "illustrations/min-max-gift-rewards-value-mobile.png" }) {
        childImageSharp {
          gatsbyImageData(width: 375, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      customerHeroImage: file(relativePath: { eq: "illustrations/marketing-mobile-survey.png" }) {
        childImageSharp {
          gatsbyImageData(width: 600, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      seamlessIntegrations: file(relativePath: { eq: "illustrations/seamless-integrations-comfy.png" }) {
        childImageSharp {
          gatsbyImageData(width: 375, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      loyalCustomers: file(relativePath: { eq: "illustrations/identifying-loyal-customers.png" }) {
        childImageSharp {
          gatsbyImageData(width: 375, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      driveAdoption: file(relativePath: { eq: "illustrations/customer-journey-optimization.png" }) {
        childImageSharp {
          gatsbyImageData(width: 375, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      fyncomLogoLight: file(relativePath: { eq: "fyncom-logo.png" }) {
        childImageSharp {
          fixed(width: 100) {
            ...GatsbyImageSharpFixed_withWebp_noBase64
          }
        }
      }
      fyncomLogoDark: file(relativePath: { eq: "fyncom-logo-white.png" }) {
        childImageSharp {
          fixed(width: 100) {
            ...GatsbyImageSharpFixed_withWebp_noBase64
          }
        }
      }
      mobileMarketing: file(relativePath: { eq: "illustrations/marketing-mobile-survey.webp" }) {
        childImageSharp {
          gatsbyImageData(width: 1200, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      phoneCalls: file(relativePath: { eq: "illustrations/sales-phone-calls.webp" }) {
        childImageSharp {
          gatsbyImageData(width: 1200, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      closingDeals: file(relativePath: { eq: "close-deals-customers-engagement.webp" }) {
        childImageSharp {
          gatsbyImageData(width: 1200, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      nanoQrCode: file(relativePath: { eq: "DepositNanoQRCode.jpg" }) {
        childImageSharp {
          gatsbyImageData(width: 800, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      fyncomLogoWhite: file(relativePath: { eq: "fyncom-logo-white-blank.png" }) {
        childImageSharp {
          gatsbyImageData(width: 80, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      linkedInlogo: file(relativePath: { eq: "logos/linkedin-white-96.png" }) {
        childImageSharp {
          fixed(width: 24) {
            ...GatsbyImageSharpFixed_withWebp_noBase64
          }
        }
      }
      fbLogo: file(relativePath: { eq: "logos/facebook_logo_secondary_white.png" }) {
        childImageSharp {
          fixed(width: 24) {
            ...GatsbyImageSharpFixed_withWebp_noBase64
          }
        }
      }
      xLogo: file(relativePath: { eq: "logos/x-logo-white.png" }) {
        childImageSharp {
          fixed(width: 24) {
            ...GatsbyImageSharpFixed_withWebp_noBase64
          }
        }
      }
      fyncomProductLogoLight: file(relativePath: { eq: "karmacall-site/fyncom-product.png" }) {
        childImageSharp {
          fixed(width: 160) {
            ...GatsbyImageSharpFixed_withWebp_noBase64
          }
        }
      }
      fyncomProductLogoDark: file(relativePath: { eq: "karmacall-site/fyncom-product-white.png" }) {
        childImageSharp {
          fixed(width: 160) {
            ...GatsbyImageSharpFixed_withWebp_noBase64
          }
        }
      }
      karmacallLogoNoTaglineLight: file(relativePath: { eq: "karmacall-logo-no-tagline.png" }) {
        childImageSharp {
          fixed(width: 110) {
            ...GatsbyImageSharpFixed_withWebp_noBase64
          }
        }
      }
      karmacallLogoNoTaglineDark: file(relativePath: { eq: "karmacall-logo-white-no-tagline.png" }) {
        childImageSharp {
          fixed(width: 110) {
            ...GatsbyImageSharpFixed_withWebp_noBase64
          }
        }
      }
      karmaCall: file(relativePath: { eq: "karmacall-logo.png" }) {
        childImageSharp {
          gatsbyImageData(width: 300, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      karmaCallDark: file(relativePath: { eq: "karmacall-logo-white.png" }) {
        childImageSharp {
          gatsbyImageData(width: 300, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      karmaCallDarkFooter: file(relativePath: { eq: "karmacall-logo-white.png" }) {
        childImageSharp {
          gatsbyImageData(width: 150, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      heroKarmaCallImage: file(relativePath: { eq: "karmacall-site/calling_phone.svg" }) {
        publicURL
      }
      standingKarmaCallPost: file(relativePath: { eq: "karmacall-site/subscriber_footstool.svg" }) {
        publicURL
      }
      oneMillionCups: file(relativePath: { eq: "karmacall-site/1-million-cups-logo.png" }) {
        childImageSharp {
          gatsbyImageData(width: 500, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      oneMillionCupsDark: file(relativePath: { eq: "karmacall-site/1-million-cups-white-logo.png" }) {
        childImageSharp {
          gatsbyImageData(width: 500, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      disruptionBanking: file(relativePath: { eq: "karmacall-site/disruption-banking-logo.png" }) {
        childImageSharp {
          gatsbyImageData(width: 500, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      disruptionBankingDark: file(relativePath: { eq: "karmacall-site/disruption-banking-logo-white.webp" }) {
        childImageSharp {
          gatsbyImageData(width: 500, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      evonexus: file(relativePath: { eq: "karmacall-site/evonexus-logo_dark.svg" }) {
        publicURL
      }
      evonexusDark: file(relativePath: { eq: "karmacall-site/evonexus-logo_light.svg" }) {
        publicURL
      }
      smugLady: file(relativePath: { eq: "karmacall-site/smug-lady-phone.jpg" }) {
        childImageSharp {
          gatsbyImageData(width: 300, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      harold: file(relativePath: { eq: "karmacall-site/harold-getting-a-call.jpg" }) {
        childImageSharp {
          gatsbyImageData(width: 300, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
      happyLady: file(relativePath: { eq: "karmacall-site/smiling-lady-on-phone.jpg" }) {
        childImageSharp {
          gatsbyImageData(width: 300, layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
    }
  `)

  return {
    heroKarmaCallImage: data.heroKarmaCallImage.publicURL,
    standingKarmaCallPost: data.standingKarmaCallPost.publicURL,
    evonexus: data.evonexus.publicURL,
    evonexusDark: data.evonexusDark.publicURL,
    karmacallImage: getImage(data.karmaCall.childImageSharp.gatsbyImageData),
    karmacallImageDark: getImage(data.karmaCallDark.childImageSharp.gatsbyImageData),
    karmaCallDarkFooter: getImage(data.karmaCallDarkFooter.childImageSharp.gatsbyImageData),
    oneMillionCups: getImage(data.oneMillionCups.childImageSharp.gatsbyImageData),
    oneMillionCupsDark: getImage(data.oneMillionCupsDark.childImageSharp.gatsbyImageData),
    disruptionBanking: getImage(data.disruptionBanking.childImageSharp.gatsbyImageData),
    disruptionBankingDark: getImage(data.disruptionBankingDark.childImageSharp.gatsbyImageData),
    smugLady: getImage(data.smugLady.childImageSharp.gatsbyImageData),
    harold: getImage(data.harold.childImageSharp.gatsbyImageData),
    happyLady: getImage(data.happyLady.childImageSharp.gatsbyImageData),
    fyncomProductLogoLight: data.fyncomProductLogoLight.childImageSharp.fixed,
    fyncomProductLogoDark: data.fyncomProductLogoDark.childImageSharp.fixed,
    karmacallLogoNoTaglineLight: data.karmacallLogoNoTaglineLight.childImageSharp.fixed,
    karmacallLogoNoTaglineDark: data.karmacallLogoNoTaglineDark.childImageSharp.fixed,
    filterImage: getImage(data.fyncomFilterGmail.childImageSharp.gatsbyImageData),
    filterImageDark: getImage(data.fyncomFilterGmailDark.childImageSharp.gatsbyImageData),
    appStoreBadge: getImage(data.appStoreBadge.childImageSharp.gatsbyImageData),
    googlePlayBadge: getImage(data.googlePlayBadge.childImageSharp.gatsbyImageData),
    teamMeeting: getImage(data.teamMeeting.childImageSharp.gatsbyImageData),
    innovation: getImage(data.innovation.childImageSharp.gatsbyImageData),
    collaboration: getImage(data.collaboration.childImageSharp.gatsbyImageData),
    transparency: getImage(data.transparency.childImageSharp.gatsbyImageData),
    customerFocus: getImage(data.customerFocus.childImageSharp.gatsbyImageData),
    continuousImprovement: getImage(data.continuousImprovement.childImageSharp.gatsbyImageData),
    fyncomFiltersWords: getImage(data.fyncomFiltersWords.childImageSharp.gatsbyImageData),
    fyncomFiltersWordsDark: getImage(data.fyncomFiltersWordsDark.childImageSharp.gatsbyImageData),
    heroImageFilter: getImage(data.heroImageFilter.childImageSharp.gatsbyImageData),
    emailFilterFyncom: getImage(data.emailFilterFyncom.childImageSharp.gatsbyImageData),
    getPaidToBlockSpamEmails: getImage(data.getPaidToBlockSpamEmails.childImageSharp.gatsbyImageData),
    cleanInboxCleanMind: getImage(data.cleanInboxCleanMind.childImageSharp.gatsbyImageData),
    sendgrid: getImage(data.sendgrid.childImageSharp.gatsbyImageData),
    slicktext: getImage(data.slicktext.childImageSharp.gatsbyImageData),
    zapier: getImage(data.zapier.childImageSharp.gatsbyImageData),
    handshake: getImage(data.handshake.childImageSharp.gatsbyImageData),
    collaborate: getImage(data.collaborate.childImageSharp.gatsbyImageData),
    effectiveSpend: getImage(data.effectiveSpend.childImageSharp.gatsbyImageData),
    integrations: getImage(data.integrations.childImageSharp.gatsbyImageData),
    salesHeroImage: getImage(data.salesHeroImage.childImageSharp.gatsbyImageData),
    increaseBookings: getImage(data.increaseBookings.childImageSharp.gatsbyImageData),
    accelerateDeals: getImage(data.accelerateDeals.childImageSharp.gatsbyImageData),
    minMax: getImage(data.minMax.childImageSharp.gatsbyImageData),
    customerHeroImage: getImage(data.customerHeroImage.childImageSharp.gatsbyImageData),
    seamlessIntegrations: getImage(data.seamlessIntegrations.childImageSharp.gatsbyImageData),
    loyalCustomers: getImage(data.loyalCustomers.childImageSharp.gatsbyImageData),
    driveAdoption: getImage(data.driveAdoption.childImageSharp.gatsbyImageData),
    fyncomLogoLight: data.fyncomLogoLight.childImageSharp.fixed,
    fyncomLogoDark: data.fyncomLogoDark.childImageSharp.fixed,
    phoneCalls: getImage(data.phoneCalls.childImageSharp.gatsbyImageData),
    closingDeals: getImage(data.closingDeals.childImageSharp.gatsbyImageData),
    nanoQrCode: getImage(data.nanoQrCode.childImageSharp.gatsbyImageData),
    fyncomLogoWhite: getImage(data.fyncomLogoWhite.childImageSharp.gatsbyImageData),
    linkedInlogo: data.linkedInlogo.childImageSharp.fixed,
    fbLogo: data.fbLogo.childImageSharp.fixed,
    xLogo: data.xLogo.childImageSharp.fixed,
  }
}
