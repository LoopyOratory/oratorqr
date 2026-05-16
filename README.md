<h1 align="center">🎤 Orator QR</h1>

<p align="center">
  <img src="https://img.shields.io/badge/runtime-Bun-000000?logo=bun&style=flat-square" alt="Bun">
  <img src="https://img.shields.io/badge/framework-TanStack_Start-10b981?style=flat-square" alt="TanStack Start">
  <img src="https://img.shields.io/badge/react-19-61dafb?logo=react&style=flat-square" alt="React 19">
  <img src="https://img.shields.io/badge/tailwind-v4-38bdf8?logo=tailwindcss&style=flat-square" alt="Tailwind v4">
  <img src="https://img.shields.io/badge/database-Neon-00e599?logo=postgresql&style=flat-square" alt="Neon Postgres">
  <img src="https://img.shields.io/badge/payments-Paystack-00c3f7?style=flat-square" alt="Paystack">
  <img src="https://img.shields.io/badge/license-Dual-blue?style=flat-square" alt="Dual License">
</p>

<p align="center">
  <strong>AI & Parametric QR Code Generator</strong><br>
  Beautiful, scannable QR codes — custom styled, parametric, or AI-generated.<br>
  Built-in auth, credit system, Paystack Ghana payments.
</p>

---

## ✨ Features

| Category | Details |
|---|---|
| **Custom QR** | 14 dot shapes, 6 corner shapes, 7 corner dot types, solid & gradient colors, logo embedding, circle/square layouts |
| **Parametric Styles** | 10 unique engines — Basic, Advanced, Image Overlay, X-Mark, Vortex, Circuit Board, Mosaic & more |
| **AI QR** | Prompt-based generation via external AI service with live progress |
| **Auth** | Email/password + Google OAuth via Better Auth |
| **Payments** | Paystack Ghana integration — credit packs, combo deals |
| **Credits** | Per-user simple + AI credit tracking, transaction history |
| **Collection** | My Collection page — view, re-download, manage all your QR codes |
| **Downloads** | SVG + PNG for all styles (gated behind sign-in) |
| **Dark Mode** | System-aware theme with manual toggle |
| **Pricing** | Free tier + 3 paid plans + credit packs ($20 combo pack) |

## 🏗️ Migration Story

Orator QR began as [QRBTF](https://github.com/latentcat/qrbtf), a Next.js 14 application running on npm with the App Router, next-intl for i18n, and a custom auth system. We performed a complete framework migration:

| From | To | Why |
|---|---|---|
| **Next.js 14** | **TanStack Start** | Type-safe routing, server functions, Bun-native |
| **npm/Yarn** | **Bun** | 10x faster installs, native bundler |
| **next-intl** | English-only | Simplify UX |
| **latentcat-auth** | **Better Auth** | Modern auth with email+password + Google OAuth |
| **No DB** | **Neon + Drizzle** | Serverless Postgres with type-safe ORM |
| **Tailwind v3** | **Tailwind v4** | CSS-first config, Vite-native |
| **framer-motion** | **motion v12** | Same library, newer package |
| **47 style pages** | **3 tabs** | Custom, Simple, AI — one dynamic route |
| **No payments** | **Paystack Ghana** | Credit pack purchases with GHS currency |

## 🚀 Quick Start

```bash
cp .env.example .env       # fill in DATABASE_URL, GOOGLE_CLIENT_*, PAYSTACK_SECRET_KEY, AI_SERVICE_URL
bun install
bun run db:push            # create database tables
bun run seed.ts            # seed admin user
bun run dev                # → http://localhost:3000
```

```bash
bun run build && bun run start   # production
```

Default tab is **Custom QR** — start styling immediately.

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [TanStack Start](https://tanstack.com/start) v1.168+ |
| Runtime | [Bun](https://bun.sh) |
| Build | Vite 8 + Nitro (`preset: "bun"`) |
| UI | Tailwind CSS v4 + Radix UI primitives |
| Database | [Neon](https://neon.tech) serverless Postgres + [Drizzle ORM](https://orm.drizzle.team) |
| Auth | [Better Auth](https://better-auth.com) + Google OAuth |
| Payments | [Paystack](https://paystack.com) (Ghana) |
| QR Engine | [QRCode.js](https://github.com/QR-Platform/qr-code.js) + custom parametric renderers |
| Validation | Zod |

## 📄 License

Dual-licensed — choose the one that fits your use case:

| Use Case | License | Cost |
|---|---|---|
| Open-source projects | [GPL v3](LICENSE) | Free |
| Commercial / proprietary | [Commercial License](LICENSE-COMMERCIAL.md) | $2,000/year |

## 🙏 Credits

Built by **[LoopyOratory](https://github.com/LoopyOratory)**.

Standing on the shoulders of giants:

- **[QRBTF](https://github.com/latentcat/qrbtf)** by [Latent Cat](https://latentcat.com) — the original parametric QR engine and AI pipeline
- **[QRCode.js](https://github.com/QR-Platform/qr-code.js)** by QR-Platform — customizable QR rendering (used under open-source license)
- **[TanStack Start](https://github.com/TanStack/router)** — full-stack React framework
- **[Better Auth](https://github.com/better-auth/better-auth)** — authentication
- **[Neon](https://neon.tech)** — serverless Postgres
- **[Drizzle ORM](https://github.com/drizzle-team/drizzle-orm)** — type-safe database
- **[Paystack](https://paystack.com)** — payments infrastructure for Africa
