# Multi-stage build for minimal final image
FROM node:20-slim AS builder

WORKDIR /app

ARG GIT_REV=unknown
ENV GIT_REV=$GIT_REV

# Install build deps for sharp's native binaries
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential python3 && \
    rm -rf /var/lib/apt/lists/*

# Copy package files first for better Docker layer caching
COPY package.json package-lock.json* ./

# Install only production dependencies
RUN npm install --omit=dev --legacy-peer-deps

# Copy server source
COPY server.js ./
COPY api/ ./api/
COPY src/lib/ ./src/lib/
COPY scripts/ ./scripts/

# Copy built SPA artefacts (dist/) so server.js can SSR-inject meta + serve
# 404 status with the SPA shell. Hosting still serves static assets via CDN;
# this dist is only the index.html template + manifest for meta injection.
# REQUIRES: `npm run build` has been run before docker build.
COPY dist/ ./dist/

# Final image — slim runtime
FROM node:20-slim AS runtime

WORKDIR /app

ARG GIT_REV=unknown
ENV GIT_REV=$GIT_REV

# Runtime deps for sharp
RUN apt-get update && apt-get install -y --no-install-recommends \
    libvips42 && \
    rm -rf /var/lib/apt/lists/* && \
    apt-get clean

# Copy built deps + source from builder
COPY --from=builder /app /app

ENV NODE_ENV=production
ENV PORT=8080

USER node

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:'+(process.env.PORT||8080)+'/api/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

CMD ["node", "server.js"]
