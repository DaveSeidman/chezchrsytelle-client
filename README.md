# ChezChrystelle Client

Vite + React frontend for the Chez Chrystelle website.

## Setup

1. Copy `.env.example` to `.env`.
2. Set `VITE_API_URL` to your backend origin.
3. If you enable backend `DEV_AUTH_ENABLED=true`, you can also set `VITE_ENABLE_DEV_LOGIN=true` to show a local dev login button on `/clients`.
4. Install dependencies with `npm install`.
5. Start the client with `npm run dev`.

## Routing

- Public section routes: `/`, `/about`, `/products`, `/order`, `/contact`
- Client routes: `/clients`, `/clients/orders`, `/clients/auth/callback`
- Admin routes: `/admin/*`

## GitHub Pages

`public/404.html` stores the original pathname and redirects to `/` so BrowserRouter can restore direct links on page load.

The Vite config uses a relative asset base so the same build can work both under the GitHub Pages repo URL and later under the custom domain root.

## Local + production envs

- Local frontend example: `VITE_API_URL=http://localhost:8000`
- Production frontend example: `VITE_API_URL=https://your-render-service.onrender.com`
- Local backend example: `CLIENT_URL=http://localhost:8080`
- Production backend example: `CLIENT_URL=https://chezchrystelle.com`
