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

## QR Styles
| ID | Name | Type |
|---|---|---|
| a1/a1c/a1p | Basic / Circle / Planet | Parametric (SVG) |
| a2/a2c | Advanced / Cross | Parametric (SVG) |
| c2 | Image Overlay | Parametric (SVG) |
| sp1 | X-Mark | Parametric (SVG) |
| a3 | Vortex | Parametric (SVG) |
| a3r | Circuit Board | Parametric (SVG) |
| sp2 | Mosaic | Parametric (SVG) |
| g1 | AI QR | API Fetcher |
| custom | Custom QR (QRCode.js) | 14 dot shapes + gradients |

## Pricing Model
| Tier | Simple QR | AI QR | Price |
|---|---|---|---|
| Free | 5/mo | 1/mo | $0 |
| QR Pro | 200/mo | — | $9/mo |
| AI Pro | — | 100/mo | $19/mo |
| Unlimited | Unlimited | 300/mo | $39/mo |

Credit Packs: QR (50 for $4.99), AI (25 for $9.99), Combo (200+100 for $20)

## Environment Variables
See `.env.example` for all required variables.
