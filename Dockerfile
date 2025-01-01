# @TODO: Refine build
FROM node:20-slim

# Install ffmpeg
RUN apt update && apt install ffmpeg -y

# Install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Install pm2
RUN pnpm install -g pm2

WORKDIR /app

COPY package*.json ./

RUN pnpm install

COPY . .

RUN pnpm build

CMD ["pm2-runtime", "dist/index.js"]
