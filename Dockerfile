# SoCutesy — single container: Vite build + Express API + static hosting
# Build: docker build --build-arg VITE_WHATSAPP_NUMBER=923xxxxxxxxxx -t socutesy .

FROM node:22-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
# Vite bakes these at build time
ARG VITE_WHATSAPP_NUMBER
ENV VITE_WHATSAPP_NUMBER=${VITE_WHATSAPP_NUMBER}
# Same-origin deploy: leave empty so /api hits this server
ARG VITE_API_URL=
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --omit=dev
COPY server/ ./
COPY --from=frontend-build /app/frontend/dist /app/frontend/dist
ENV NODE_ENV=production
ENV STATIC_DIR=/app/frontend/dist
ENV PORT=3000
EXPOSE 3000
CMD ["node", "src/index.js"]
