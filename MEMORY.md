# Orator QR — Project Memory

## Status
- **Phase**: Production-ready
- **Last Updated**: 2026-05-16

## Credits
- Forked from [QRBTF](https://github.com/latentcat/qrbtf) by [Latent Cat](https://latentcat.com)
- Custom QR styling powered by [QRCode.js](https://github.com/QR-Platform/qr-code.js) (open-source licensed)

## Key Decisions
| Decision | Choice |
|---|---|
| Framework | TanStack Start v1.168+ (`@tanstack/react-start`) |
| Build System | Vite + Nitro (`preset: "bun"`) |
| Runtime | Bun |
| Package Manager | Bun |
| Styling | Tailwind CSS v4 (CSS-first) |
| Database | Neon (serverless Postgres) + Drizzle ORM |
| Auth | Better Auth + Google OAuth only |
| AI QR Generation | External API service (`AI_SERVICE_URL`) |
| i18n | English only |
| Deployment | Docker + Bun (Nitro output) |




