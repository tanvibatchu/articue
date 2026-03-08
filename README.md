## Articue
**Bridging the gap in Canadian speech therapy**

In Canada, the path to clear communication is often blocked by a system stretched to its breaking point. We are currently facing a national shortage of Speech-Language Pathologists (SLPs), resulting in waitlists that routinely last 12 to 24 months, and in many rural or remote regions, even longer. Beyond the wait times, the financial burden is staggering; for families without private insurance, the cost of ongoing private therapy sessions is often prohibitive, making professional speech care an exclusive luxury rather than a public health right.

We built Articue to democratize access to this care. We realized that while we cannot instantly increase the number of SLPs in the country, we can extend their reach. Articue serves as a digital bridge, allowing patients to practice and track their progress between sessions, reducing the dependency on frequent, costly in-person clinical visits.

## Installation
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

**Getting Started**

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

**Learn More**

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

**Deploy on Vercel**

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## 🚀 What it does
**Articue** is an intelligent, user-friendly platform designed to support the SLP workflow by focusing on home-based practice and progress tracking.

  **Guided Home Practice**: Patients can access interactive modules that allow them to practice articulation exercises with immediate visual cues, making the "gap" between appointments productive rather than passive.

  **Progress Analytics**: Therapists can view trends in patient performance through an intuitive dashboard, helping them adjust therapy plans based on actual data rather than just patient recall.

  **Accessibility-First UI**: Built with clean, high-contrast, and responsive design, ensuring that our interface is easy to navigate for patients of all ages, regardless of their tech-savviness.

## 🛠 Tech Stack
**Core Technologies**

  **Frontend**: Next.js 14, TypeScript, Tailwind CSS

  **Authentication**: Auth0

  **Database**: Firebase, Firestore

  **AI & Machine Learning**: Google Gemini API, ElevenLabs, Web Speech API

  **Data Visualization**: Recharts

  **UI/UX**: Lottie animations

  **Deployment**: Vercel

## 🏗 Architecture


## 🧱 Local Setup

**Environment Variables**
Create a .env.local file in the root directory:

AUTH0_SECRET=...
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=...
AUTH0_CLIENT_ID=...
AUTH0_CLIENT_SECRET=...
FIREBASE_API_KEY=...
GEMINI_API_KEY=...
ELEVENLABS_API_KEY=...

## 📝 License
Distributed under the MIT License.

