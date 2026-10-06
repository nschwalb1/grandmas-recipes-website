// Single source of truth for site facts. Everything else is generated from this.
export const SITE = {
  name: "Grandma's Recipes",
  url: "https://grandmasrecipes.app",
  email: "grandmasrecipesapp@gmail.com",
  tagline: "Save, scan and share family recipes",
  description:
    "Grandma's Recipes is a recipe app for iPhone and Android. Scan handwritten recipe cards, import recipes from websites, write your own or create one with AI, then share them and build recipe books with family.",
  stores: {
    ios: "https://apps.apple.com/us/app/grandmas-recipes-app/id6443970437",
    android: "https://play.google.com/store/apps/details?id=app.schwalbsystems.grandmas_recipes",
  },
  social: {
    facebook: "https://www.facebook.com/profile.php?id=100088907513527",
    pinterest: "https://www.pinterest.com/grandmasrecipesapp/",
  },
  // Set to a GA4 measurement id (G-XXXX) to turn analytics on. Off by default: the old site used a cookie banner.
  analyticsId: process.env.GA_ID || "",
  themeColor: "#016160",
};

export const FAQ = [
  {
    q: "What is the Grandma's Recipes app?",
    a: "Grandma's Recipes is a recipe app for iPhone and Android. It keeps your family's recipes in one place and lets you scan handwritten cards, import recipes from websites, type in your own, create recipes with AI, and share them with the people you cook with.",
  },
  {
    q: "How do I scan a handwritten recipe card?",
    a: "Open the app, choose the scan option and take a photo of the card. The app reads the handwriting and turns it into a recipe you can edit, so a family heirloom or a jotted note becomes a digital recipe in moments.",
  },
  {
    q: "Can I import a recipe from a website?",
    a: "Yes. Find a recipe on a blog or recipe site and import it into the app with a single tap. The recipe is saved to your collection, where you can edit it like any other.",
  },
  {
    q: "How do I share recipes with family?",
    a: "You can share an individual recipe, such as your go-to spaghetti, with friends, or start a recipe book with your family so everyone can save their favorite meals from grandma in one shared place.",
  },
  {
    q: "Where can I download Grandma's Recipes?",
    a: "Grandma's Recipes is available on the Apple App Store for iPhone and on Google Play for Android.",
  },
  {
    q: "How do I delete my account or my data?",
    a: `Email ${"grandmasrecipesapp@gmail.com"} and ask us to delete your account or your data. The contact page has ready-made links for both requests.`,
  },
];

export const FEATURES = [
  { id: "scan", title: "Scan handwritten cards", text: "Instantly digitize family heirlooms or jotted notes.", img: "feature-scan.webp", alt: "Phone scanning a handwritten recipe card", w: 480, h: 480 },
  { id: "import", title: "Import from websites", text: "Grab recipes from blogs and sites with a single tap.", img: "feature-import.webp", alt: "A recipe moving from a website into the app", w: 480, h: 480 },
  { id: "type", title: "Type or dictate your own", text: "Easily type in, paste, or speak new creations, or modify existing recipes.", img: "feature-type.webp", alt: "Phone and keyboard for typing in a new recipe", w: 480, h: 480 },
  { id: "ai", title: "Create with AI", text: "Describe a dish in a prompt and get a recipe you can edit and save.", img: "feature-ai.webp", alt: "A prompt box turning into a recipe on a phone", w: 480, h: 281 },
  { id: "share", title: "Share individual recipes", text: "Quickly share your go-to spaghetti recipe that your friends all love.", img: "feature-share.webp", alt: "People sharing recipes through a tablet", w: 480, h: 480 },
  { id: "books", title: "Create recipe books", text: "Start a recipe book with your family so everyone can save their favorite meal from grandma.", img: "feature-share.webp", alt: "", w: 480, h: 480 },
];

export const POSTS = [
  {
    slug: "cherishing-family-memories-through-grandmas-timeless-recipes",
    title: "Cherishing Family Memories Through Grandma's Recipes",
    h1: "Cherishing Family Memories Through Grandma's Timeless Recipes",
    description: "Capture, share, and preserve cherished family recipes with the Grandma's Recipes app, and keep cooking memories alive for future generations.",
    published: "2024-05-08",
    lead: "Discover the joy of cooking with the Grandma's Recipes app. Capture, share, and preserve cherished family recipes, creating delicious memories for future generations. Join us in celebrating the love of cooking and the nostalgia of Grandma's kitchen, where every dish tells a story and every bite brings back memories.",
    sections: [
      ["Why family recipes are worth keeping", "A recipe card carries more than ingredients. The stains, the margin notes and the handwriting all tell you who made the dish and how often. Keeping them safe is how those stories get passed on."],
      ["How the app helps", "Scan a handwritten card so it is never lost, import a favorite from a website, or type in a dish from memory. Then share it with family or collect it in a recipe book everyone can add to."],
    ],
  },
  {
    slug: "cherishing-grandmas-recipes-a-journey-through-family-cooking-memories",
    title: "Family Cooking Memories: A Journey of Cherished Recipes",
    h1: "Cherishing Grandma's Recipes: A Journey Through Family Cooking Memories",
    description: "Preserve beloved dishes and cooking experiences with the Grandma's Recipes app, so family gatherings and baking traditions live on for generations.",
    published: "2024-05-08",
    lead: "Discover the joy of creating and sharing cherished family recipes with the Grandma's Recipes app. Capture your cooking experiences and preserve beloved dishes for future generations, ensuring that the delicious memories of family gatherings and baking traditions live on forever. Join us in celebrating the art of cooking together!",
    sections: [
      ["Cooking together, wherever everyone lives", "Family recipe books are easier to keep when everyone can add to them. Start a book in the app and invite the people who cook with you, so each person can save the meals they love."],
      ["Start with one recipe", "Pick the dish your family asks for most. Scan the card or type it in, then share it. One recipe is enough to start a collection."],
    ],
  },
];

export const PAGES = {
  home: { path: "/", title: "Grandma's Recipes app: save, scan and share family recipes", description: "Grandma's Recipes is a recipe app for iPhone and Android. Scan handwritten cards, import recipes from websites, create with AI, and share recipe books with family." },
  blog: { path: "/blog", title: "Cherished Family Recipes Blog | Grandma's Recipes", description: "Stories and tips on saving, sharing and cooking family recipes with the Grandma's Recipes app, plus a way to send us your own recipe stories." },
  about: { path: "/about", title: "About Grandma's Recipes: the family recipe app", description: "Grandma's Recipes is an independent recipe app built to keep family recipes safe and easy to share. Learn what it does and who makes it." },
  contact: { path: "/contact", title: "Contact Grandma's Recipes: questions, feedback, deletion", description: "Email the Grandma's Recipes team with questions or recipe suggestions, or request deletion of your account or data." },
  privacy: { path: "/privacy-policy", title: "Privacy Policy | Grandma's Recipes", description: "What personal data Grandma's Recipes collects, why we process it, your rights, and how to contact us about your information." },
};
