FROM node:22-alpine
WORKDIR /app
COPY package.json servidor.js index.html portal.html universo.html ./
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "servidor.js"]
