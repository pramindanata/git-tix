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

## Development

First run `npm install` to install [Lerna](https://lerna.js.org/). Then run `npm run lerna -- bootstrap` to install all package depedencies so you don't have to run `npm install` in each service or Lerna package.

Make sure you already run `MongoDB`, `NATS Streaming`, and `Redis` instance on your computer. If you prefer using `Docker` you can use prepared `docker-compose.yml` from this project. This `docker-compose.yml` file only contains this microservice depedencies and some utility dashboard for `NATS Streaming` and `Redis`. Run `docker-compose up` from this project direcotry to use this Docker Compose file.

To run development server in each service and client app run `npm run dev` in each directory.

Please read `README.md` in each service and client app directory for more details.

## [WIP] Production

Make sure your cluster already has NGINX Ingress Controller (^0.34.1) installed. Please read [this](https://kubernetes.github.io/ingress-nginx/deploy/#docker-for-mac) for more information about NGINX Ingress Controller installation process.

And create some secret value for JWT secret and Stripe Public secret. Example:

```sh
# JWT
kubectl create secret generic jwt-secret --from-literal JWT_SECRET=<your_jwt_secret>

# Stripe Public Key
kubectl create secret generic stripe-secret --from-literal STRIPE_SECRET=<secret>
```

Then run:

```sh
kubectl apply -f ./packages/infra/k8s
```

Or, if you prefer use [Tilt](https://tilt.dev/) run: `tilt up`.
