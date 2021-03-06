# Git Tix

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

Ticketing app built with microservice approach.

## Available Services and Client App

- auth: `./packages/auth`
- client `./packages/client`
- expiration `./packages/expiration`
- order `./packages/order`
- payment `./packages/payment`
- ticket `./packages/ticket`

## Requirements

- Node.js: `v12.16.0`
- Typescript: `v3.9.7`
- MongoDB: `v4.2.3`
- Redis: `v6`
- NATS Streaming: `v0.18`
- Stripe publishable & secret key

Stripe publishable and secret key can be obtained by creating Stripe account.

## Development

First run `npm install` to install [Lerna](https://lerna.js.org/). Then run `npm run lerna -- bootstrap` to install all package depedencies so you don't have to run `npm install` in each service or Lerna package.

Make sure you already run `MongoDB`, `NATS Streaming`, and `Redis` instance on your computer. If you prefer using `Docker` you can use prepared `docker-compose.yml` from this project. This `docker-compose.yml` file only contains this microservice depedencies and some utility dashboard for `NATS Streaming` and `Redis`. Run `docker-compose up` from this project direcotry to use this Docker Compose file.

To run development server in each service and client app run `npm run dev` in each directory.

Please read `README.md` in each service and client app directory for more details.

## Production

Make sure your cluster has NGINX Ingress Controller (^0.34.1) installed. Please read [this](https://kubernetes.github.io/ingress-nginx/deploy) for more information about NGINX Ingress Controller installation process.

And create secret objects for JWT secret and Stripe secret key. For example:

```sh
# JWT
kubectl create secret generic jwt-secret --from-literal JWT_SECRET=<jwt_secret_key>

# Stripe secret Key
kubectl create secret generic stripe-secret --from-literal STRIPE_SECRET_KEY=<stripe_secret_key>
```

Then run:

```sh
kubectl apply -f ./packages/infra/k8s
kubectl apply -f ./packages/infra/k8s-dev
```

If you prefer to run production K8S, please replace `www.yeetzz.xyz` inside `./k8s-prod/client.yml` and `./k8s-prod/ingress.yml` with your own hostname. And run `kubectl apply -f ./packages/infra/k8s-prod` instead of `k8s-dev`. Those K8S configs are designed for **DigitalOcean Kubernetes** service.

### Create Your Own Docker Images

If you want to use your own Docker Images, please build `client` image with `stripePublishableKey` arg. Example:

```sh
docker build -t my/tix-client --build-arg stripePublishableKey=<YOUR_STRIPE_PUBLISHABLE_KEY> .
```

### With Tilt

If you prefer to use [Tilt](https://tilt.dev/), you can create a new `./Tiltfile` file in this project directory based from `./Tiltfile.example` file and make sure to fill `stripePublishableKey` varible value with your `STRIPE_PUBLISHABLE_KEY`. And then run this command:

```sh
tilt up
```
