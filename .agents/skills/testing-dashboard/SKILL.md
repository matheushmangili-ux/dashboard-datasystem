# Testing the Texas Center Dashboard

## Local Setup

1. Install dependencies: `npm install`
2. Start dev server: `npx next dev -p 3000`
3. Navigate to `http://localhost:3000`

## Demo Credentials

The app uses demo users defined in `lib/auth/demo-users.ts`. Available accounts:

| User | Login Name | PIN | Role |
|------|-----------|-----|------|
| Admin | `uid-admin` (use the id) | `admin` | manager |
| Ana Ribeiro | `Ana Ribeiro` | `1234` | manager |
| Paulo Martins | `Paulo Martins` | `2345` | supervisor |
| Bruna Lima | `Bruna Lima` | `3456` | operator |

Login accepts either the user's `name` or `id` field as the username, and the `pin` field as the password.

## Key UI Areas to Verify

### Login Screen (`components/access-shell.tsx`)
- `LoginDesertScene` component renders animated desert background (sun, tumbleweeds, cacti, stars, dust)
- Login card has `.western-ornament` class for gold corner decorations
- Gold gradient bar at top of card
- Brand-glow animation on TC logo

### Dashboard (`components/realtime-dashboard.tsx`)
- Header shows TC logo with brand-glow, channel tabs (Loja Física / E-commerce)
- KPI cards have hover lift effect (`hover:shadow-md hover:-translate-y-0.5`)
- Footer has gold gradient separator and "TEXAS CENTER • WESTERN DASHBOARD" text
- Dashboard clock styled with Tailwind classes (was previously unstyled)

### Dashboard Animations (`components/animations.tsx`)
- `DashboardAnimation` component rendered at z-0 behind dashboard content
- Contains SVG tumbleweeds, horse silhouette, cacti, dust clouds
- Animations use CSS keyframes defined in `app/globals.css`
- To verify animations exist in DOM: check `.absolute.inset-0.z-0.pointer-events-none.overflow-hidden` container should have 10 children and 8 SVGs

### Sidebar (`components/sidebar.tsx`)
- TC logo with brand-glow animation
- "Western Dashboard" subtitle below "Texas Center" title
- Version text: "Texas Center v2.0" with gold star
- Menu items: Dashboard, Vendedores, Metas, Indicadores, Loja Física, E-commerce (with sub-items), Cadastros

### Theme/Colors (`app/globals.css`)
- Light mode: warm beige background (#faf6f0), brown primary (#8b4513), gold accents
- Dark mode: dark brown background (#1a1209), lighter brown primary (#d4a574)
- Western CSS custom properties: `--western-gold`, `--western-leather`, `--western-sand`, `--western-rust`, `--western-cactus`, `--western-sunset`
- Dark mode toggle via `components/theme-toggle.tsx` using `data-theme` attribute on `<html>`

## Common Issues

- Port 3000 might be in use from previous sessions. Use `fuser -k 3000/tcp` to free it (note: `lsof` may not be available on all environments)
- The app uses SWR with 15-second refresh interval for dashboard data — API calls to `/api/dashboard` will show in network tab
- Chart warnings about width/height being less than 0 are from Recharts and are harmless
- Pre-existing lint errors exist in `app-workspace.tsx`, `channel-performance-chart.tsx`, and `trend-chart.tsx` (not introduced by western theme changes)

## Build & Lint Commands

```bash
npm run lint      # ESLint check
npm run typecheck # TypeScript type checking
npm run build     # Full production build
```

## Devin Secrets Needed

No secrets are required — the app uses demo credentials hardcoded in `lib/auth/demo-users.ts`.
