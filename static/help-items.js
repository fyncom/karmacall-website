const helpItems = [
  {
    title: "Overview of Rewards Tools",
    description: "Learn more about our services",
    icon: "FaAward",
    topicUrl: "rewards-for-emails-text-and-more",
    url: "https://raw.githubusercontent.com/fyncom/fyncom-help/main/Overview-Of-FynCom-Tools.md",
  },
  {
    title: "Zapier Setup",
    description: "Automate Rewards in Zapier",
    icon: "FaTools",
    topicUrl: "zapier-rewards",
    url: "https://raw.githubusercontent.com/fyncom/fyncom-help/main/Zapier-Setup-FynCom.md",
  },
  // todo add the Zapier Info page which has a nice gif
  // {title: "Zapier Info", description: "Automate Rewards in Zapier", icon: "FaTools",
  //     topicUrl: "zapier-rewards", url: "https://raw.githubusercontent.com/fyncom/fyncom-help/main/Zapier-Info.md",},
  {
    title: "Simple Email Setup",
    description:
      "Set up your forwarding email No API key required. 1 Rewards Campaign at a time",
    icon: "FaEnvelopeOpenText",
    topicUrl: "simple-email-rewards-setup",
    url: "https://raw.githubusercontent.com/fyncom/fyncom-help/main/Emails-Simple-Connection-With-FynCom.md",
  },
  {
    title: "Sendgrid API Key",
    description: "Add your API key to FynCom",
    icon: "FaKey",
    topicUrl: "sendgrid-integration-api-key",
    url: "https://raw.githubusercontent.com/fyncom/fyncom-help/main/Sendgrid-API-Key-Integration.md",
  },
  {
    title: "Sendgrid Email Rewards",
    description: "Attach Rewards To Emails",
    icon: "FaMailBulk",
    topicUrl: "add-fyncom-rewards-to-sendgrid-marketing-email",
    url: "https://raw.githubusercontent.com/fyncom/fyncom-help/main/Attaching-FynCom-Rewards-To-Sendgrid-Emails.md",
  },
  {
    title: "Marketing & Basic Emails",
    description: "Set up your forwarding email Email API key required",
    icon: "FaChartLine",
    topicUrl: "email-forwarding-setup-for-instant-rewards-delivery",
    url: "https://raw.githubusercontent.com/fyncom/fyncom-help/main/Connecting-Email-Address-With-FynCom.md",
  },
  {
    title: "Sendgrid Drafts",
    description: "Prepare your Sendgrid draft for FynCom rewards",
    icon: "FaFileAlt",
    topicUrl: "sendgrid-drafts-preparation",
    url: "https://raw.githubusercontent.com/fyncom/fyncom-help/main/Setting-Up-Sendgrid-Drafts.md",
  },
  {
    title: "Account Balance",
    description: "Information about your balance",
    icon: "FaWallet",
    topicUrl: "account-balance-help",
    url: "https://raw.githubusercontent.com/fyncom/fyncom-help/main/Account-Balance.md",
  },
]

const helpItemsUser = [
  {
    title: "Crowdin Rewards Setup",
    description:
      "Translate a word, get instantly paid! Input your Crowdin username to start",
    icon: "FaLanguage",
    topicUrl: "crowdin-rewards-for-translations-user-setup",
    url: "https://raw.githubusercontent.com/fyncom/fyncom-help/main/Crowdin-Setup-FynCom.md",
  },
  {
    title: "FynCom Filters for Emails",
    description:
      "Get rewarded to block email. Allow trusted email. Cash out your way",
    icon: "FaFilter",
    topicUrl: "email-filters-and-rewards",
  },
]

module.exports = { helpItems, helpItemsUser };
