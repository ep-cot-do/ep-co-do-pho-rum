FROM node:20-alpine AS base

ENV NEXT_PUBLIC_API_ENDPOINT=${NEXT_PUBLIC_API_ENDPOINT}

FROM base AS installer
WORKDIR /installer

RUN mkdir -p /installer

COPY package.json ./

RUN npm install -g bun && bun install --frozen-lockfile || bun install
COPY . .

RUN echo "NEXT_PUBLIC_API_ENDPOINT=${NEXT_PUBLIC_API_ENDPOINT}" > .env.production

RUN bun run build

FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 fcoder
RUN adduser --system --uid 1001 fcoder
USER fcoder

COPY --from=installer --chown=fcoder:fcoder /installer/.env.production ./
COPY --from=installer --chown=fcoder:fcoder /installer/.next/standalone ./
COPY --from=installer --chown=fcoder:fcoder /installer/.next/static ./.next/static
COPY --from=installer --chown=fcoder:fcoder /installer/public ./public

ENTRYPOINT [ "node", "server.js" ]
