FROM node:24-alpine

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install

COPY . .
RUN cp .env.production .env
RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]