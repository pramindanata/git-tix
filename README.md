# Git Tix

Ticketing app built with microservice approach.

## K8S Setup

Make sure your cluster already has NGINX Ingress Controller installed. Please read [this](https://kubernetes.github.io/ingress-nginx/deploy/#docker-for-mac) about NGINX Ingress Controller installation.

```sh
# Setup secret object, this method may not safe for production env.
# For production env better to use safer method like using file or
# yaml file with string replacer.
kubectl create secret generic jwt-secret --from-literal JWT_SECRET=<your_jwt_secret>
```

## Note

Don't forget to install `NGINX Inggress Controller ^0.34.1` before applying K8s configs. Please read [this](https://kubernetes.github.io/ingress-nginx/deploy) about `NGINX Ingress Controller` installation.
