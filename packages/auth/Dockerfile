FROM node:12.18.2-alpine
WORKDIR /app
COPY ./package.json ./
RUN npm install --only prod
RUN npm install -D cross-env
COPY ./ ./
RUN npm run build
EXPOSE 4000
CMD ["npm", "run", "start"]