FROM node:12.18.2-alpine
WORKDIR /app
COPY ./package.json ./
RUN npm install --only prod
COPY ./ ./
RUN npm run build
CMD ["npm", "run", "dev"]