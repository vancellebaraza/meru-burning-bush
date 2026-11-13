export const givingContent = {
  eyebrow: "Generosity",
  title: "Give with a joyful heart.",
  intro:
    "Your generosity supports the work of the ministry and helps us serve our church family and community.",
  accounts: [
    {
      name: "Tithes, offering & seed",
      rows: [
        ["Bank", "ABSA Bank, Meru Branch"],
        ["Account name", "Burning Bush Ministries International"],
        ["Account number", "0131063059"],
      ],
    },
    {
      name: "M-Pesa Paybill",
      rows: [
        ["Paybill", "665013"],
        ["Account", "TITHES/OFFERING/SEED"],
      ],
    },
    {
      name: "Donations & projects",
      rows: [
        ["Bank", "Co-operative Bank, Greenwood Mall Branch"],
        ["Account name", "Burning Bush Ministries International (Projects Account)"],
        ["Account number", "01100345865004"],
        ["Reference", "Use the project name as the reference"],
      ],
    },
  ] as { name: string; rows: [string, string][] }[],
  project: {
    title: "Help us build our new washrooms",
    description:
      "Our current project. Give through the Projects Account and use the project name as your reference.",
    note: "Budget: KSh 650,000",
  },
};
