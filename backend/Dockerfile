FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

RUN npx prisma generate

EXPOSE 8080
CMD ["sh", "-c", "npx prisma db push && node --enable-source-maps dist/index.js"]
