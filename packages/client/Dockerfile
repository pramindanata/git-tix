FROM node:12.18.2-alpine
WORKDIR /app

ARG stripePublishableKey
ENV STRIPE_PUBLISHABLE_KEY=$stripePublishableKey

COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install --only prod
RUN npm install --no-package-lock -D cross-env 
COPY ./ ./
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]