# ─────────────────────────────────────────────────────────────
# API server
#
# Debian slim rather than Alpine: sharp and tesseract.js ship
# prebuilt binaries against glibc, and on musl they fall back to
# compiling from source (or fail outright).
# ─────────────────────────────────────────────────────────────
FROM node:22-bookworm-slim AS deps

WORKDIR /app

# Copy only manifests first so `npm ci` is cached until deps actually change.
COPY package.json package-lock.json ./
COPY server/package.json ./server/
COPY client/package.json ./client/

# --omit=dev skips the client's build toolchain, which this image never runs.
RUN npm ci --omit=dev --workspace=server --include-workspace-root


FROM node:22-bookworm-slim AS runner

ENV NODE_ENV=production
WORKDIR /app

# curl backs the compose healthcheck; tini reaps zombies and forwards
# SIGTERM so the server's graceful shutdown handler actually runs.
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl tini \
    && rm -rf /var/lib/apt/lists/*

# npm workspaces hoist every dependency to the root node_modules, so there is
# no server/node_modules to copy — Node resolves upward from server/src.
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY server ./server

# Writable location for tesseract.js language data and multer temp files.
RUN mkdir -p /app/server/tmp && chown -R node:node /app

USER node

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD curl -fsS http://localhost:5000/api/health || exit 1

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["node", "server/src/index.js"]
