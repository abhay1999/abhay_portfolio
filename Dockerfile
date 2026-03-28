# ──────────────────────────────────────────────────────────────────
# Stage 1 — Builder
# Installs dependencies and runs `next build` (static export → out/)
# ──────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests first (layer cache)
COPY package.json package-lock.json* ./

# Install all deps (including devDeps needed for build)
RUN npm ci --frozen-lockfile

# Copy source
COPY . .

# Build — outputs static files to /app/out
RUN npm run build

# ──────────────────────────────────────────────────────────────────
# Stage 2 — Production server
# Lightweight Nginx Alpine image serving the static export
# ──────────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runner

# Remove default nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy built static files from builder
COPY --from=builder /app/out /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Nginx runs in foreground
CMD ["nginx", "-g", "daemon off;"]
