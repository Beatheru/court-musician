# @TODO: Refine build
FROM node:20-slim

# Install ffmpeg
RUN apt update && apt install ffmpeg -y

# Install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Install nodemon
RUN pnpm install -g nodemon

WORKDIR /app

COPY package*.json ./

RUN pnpm install

COPY . .

RUN pnpm build

CMD ["pnpm", "dev"]
