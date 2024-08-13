# Stage 1 - Downloading dependencies
FROM node:22-slim AS deps
WORKDIR /usr/src/app
COPY package*.json ./
COPY prisma ./prisma
RUN apt-get update -y && apt-get install -y openssl
RUN npm install

# Stage 2 - Building application
FROM deps AS build
COPY . .
RUN npm run build
RUN npx prisma generate

# Stage 3 - Production environment
FROM node:22-slim
WORKDIR /usr/src/app
RUN apt-get update -y && apt-get install -y openssl
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY package*.json ./
COPY prisma ./prisma
COPY .env .env
EXPOSE 8001
CMD ["npm", "run", "start"]