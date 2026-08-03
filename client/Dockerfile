# ─────────────────────────────────────────────────────────────
# Web client — Vite build served by nginx
# ─────────────────────────────────────────────────────────────
FROM node:22-bookworm-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY client/package.json ./client/
COPY server/package.json ./server/

RUN npm ci --workspace=client --include-workspace-root

COPY client ./client

# Vite inlines env vars at build time, so this is a build arg rather than a
# runtime one. Leave it empty to use the nginx /api proxy defined in
# nginx.conf; set it only when the API lives on a different origin.
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build --workspace=client


FROM nginx:1.27-alpine AS runner

RUN apk add --no-cache curl

COPY --from=build /app/client/dist /usr/share/nginx/html
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -fsS http://localhost/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
