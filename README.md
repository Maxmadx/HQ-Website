# HQ Aviation Website

Production-ready static website for HQ Aviation - Helicopter Sales, Maintenance & Pilot Training.

## Features

- **Optimized Performance**: Gzip compression, static caching, and optimized assets
- **Security Headers**: X-Frame-Options, X-XSS-Protection, X-Content-Type-Options
- **Clean URLs**: `/about-us` instead of `/pages/about-us.html`
- **Legacy Redirects**: Automatic redirects from old Squarespace paths
- **Production Ready**: Environment-aware configuration and graceful shutdown

## Tech Stack

- **Node.js**: Server runtime
- **Express**: Web framework
- **Compression**: Gzip compression middleware

## Getting Started

### Prerequisites

- Node.js >= 14.0.0
- npm

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server (port 7500)
npm run dev
```

Server will start at `http://localhost:7500`

### Production

```bash
# Start production server
npm start
```

## Configuration

### Environment Variables

- `PORT`: Server port (default: 7500)
- `NODE_ENV`: Environment mode (`development` or `production`)

## Navigation Menu

The navigation menu is dynamically injected via `/public/assets/menu.js`:

- **Fixed hamburger button** in top-right corner
- **Dropdown panel** with grid layout
- **Auto-close** on link click, Escape key
- **AJAX-compatible** with Squarespace's loading system

## URL Structure

### Clean URLs

All pages use clean URLs without `.html` extensions:

- `/` → index.html
- `/about-us` → pages/about-us.html
- `/r44` → pages/r44.html

## Performance Optimizations

- **Gzip Compression**: All responses compressed
- **Static Caching**: Assets cached for 1 day
- **HTML Caching**: Pages cached for 1 hour
- **ETag Support**: Conditional requests enabled

## Security

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`

## License

UNLICENSED - Private project
