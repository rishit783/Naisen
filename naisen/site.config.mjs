// ─────────────────────────────────────────────────────────────
//  Edit this file to change the wording and settings of the app.
//  After editing, redeploy (push to GitHub or run `netlify deploy --prod`).
//  Secrets (admin password, access code) are NOT set here; they are
//  environment variables in the Netlify dashboard. See README.md.
// ─────────────────────────────────────────────────────────────
export default {
  appName: "Naisen",
  leaderName: "Pramod",
  pageTitle: "Naisen",

  // ── The farewell message at the top of the form ─────────────
  headline: "What fun we had.",
  farewell: {
    greeting: "Leaders, and leaders in the making,",
    opening: [
      "We didn't just build a practice. We built stories together: stories of wins, of losses and lessons, and stories that kept us awake at night and still keep us dreaming.",
      "I'm bad at farewell messages, because I see every ending as a new beginning. So instead, three things not to forget:",
    ],
    points: [
      "BPS today is the strongest finance and payroll operate practice there is. Because of you. Wear the swag!",
      "Aspirations > resources. Always. Never shrink the size of your dreams.",
      "Have fun. It's the key ingredient. And stay unlimited: never let anyone set your limits.",
    ],
    closing: [
      "Thank you for everything. My deepest gratitude to every one of you; I learnt so much working closely with you. Not everyone is in this group, so please pass my gratitude on to those who aren't.",
      "Needless to say, stay in touch. I look forward to speaking with each of you. I'm around for a while, so we'll find a way to catch up, or just dial in!",
      "I'm sure you'll all rock. And our paths will cross.",
    ],
    signoff: "Pramod",
  },

  // Shown just above the questions.
  formIntro: "As I reflect on this fun ride with you, I'd love your inputs. Every question is optional. Put your name on it or stay anonymous; either way, I'll read every word.",

  // Your own contact details, shown on the form and the thank-you page.
  contact: {
    linkedin: "https://www.linkedin.com/in/pramodbagri/",
    email: "pramodbagri@gmail.com",
  },

  // The message you post in the group. {link} is replaced with the form's address
  // on the dashboard's Share tab, where you can copy it.
  inviteMessage: `Leaders, and leaders in the making,

What fun we had. We didn't just build a practice. We built stories together: stories of wins, of losses and lessons, and stories that kept us awake at night and still keep us dreaming.

I'm bad at farewell messages, because I see every ending as a new beginning. So instead, three things not to forget:

1. BPS today is the strongest finance and payroll operate practice there is. Because of you. Wear the swag!
2. Aspirations > resources. Always. Never shrink the size of your dreams.
3. Have fun. It's the key ingredient. And stay unlimited: never let anyone set your limits.

Thank you for everything. My deepest gratitude to every one of you; I learnt so much working closely with you. Not everyone is in this group, so please pass my gratitude on to those who aren't.

Needless to say, stay in touch. I look forward to speaking with each of you. I'm around for a while, so we'll find a way to catch up, or just dial in!

I'm sure you'll all rock. And our paths will cross.

One request: please don't flood this group. Reply privately if you'd like to. As promised, here's something to fill in as I reflect on this fun ride with you. I'm eagerly waiting for your inputs:
{link}

LinkedIn: https://www.linkedin.com/in/pramodbagri/
Email: pramodbagri@gmail.com

Pramod`,

  // Used for the response-rate figure on the dashboard.
  headcount: 800,

  // Last day to submit, as "YYYY-MM-DD" (India time, end of day). Leave "" to keep it open.
  closesOn: "",

  // Public Memory Wall at /wall. Only people who opt in appear there, and only
  // the questions marked `wall: true` below are shown, plus their photos.
  wallEnabled: true,

  // Optional list of teams or service lines for the dropdown, e.g.
  // ["Finance Operate", "Record to Report", "Procure to Pay"].
  // Leave empty [] to let people type their team freely.
  teams: [],

  maxPhotos: 5,

  // The questions. Change the wording freely, but keep each `id` unchanged
  // once responses start coming in.
  //   kind: "long" = paragraph, "short" = one line, "word" = one word (feeds the main word cloud)
  //   short: label used on the dashboard charts
  //   wall: true  = can appear on the public Memory Wall (only if the person opts in)
  questions: [
    { id: "q1", short: "5-star headline", kind: "long",  wall: true,  label: "If you had to write my 5-star review, what's the headline?" },
    { id: "q2", short: "Version 2.0 patch", kind: "long",  wall: false, label: "What do I need to work on? My version 2.0 needs a patch. What's the bug fix?" },
    { id: "q3", short: "Smile-worthy memory", kind: "long",  wall: true,  label: "What's the memory that still makes you smile (or cringe, in a good way)?" },
    { id: "q4", short: "Moment together", kind: "long",  wall: true,  label: "Which moment or project do you remember most that includes you and me?" },
    { id: "q5", short: "One word", kind: "word",  wall: true,  label: "Describe working with me in one word." },
    { id: "q6", short: "Overused phrase", kind: "short", wall: true,  label: "My most overused phrase was…" },
    { id: "q7", short: "Never told me", kind: "long",  wall: false, label: "What's one thing you never told me but always wanted to?" },
    { id: "q8", short: "Advice", kind: "long",  wall: false, label: "Any advice for me in my next chapter?" },
  ],
};
