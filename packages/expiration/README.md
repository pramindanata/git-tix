# Expiration Service

This service provides capability to publish expired order.

## Requirements

- Node.js: `v12.16.0`
- Typescript: `v3.9.7`
- Redis: `v6`
- NATS Streaming: `v0.18`

## Development

Create new `.env` file in this service project directory. Please see `.env.example` for available values. Then run these commands:

```sh
# Install depedencies
npm install

# Run development server
npm run dev
```

This service is a background worker so it does not have any port to be accessed with.

## Production

Create new `.env` file in this service project directory. Please see `.env.example` for available values. Then run these commands:

```sh
# Install depedencies
npm install

# Transpile Typescript to Javascript
npm run build

# Run production server
npm run start
```

This service is a background worker so it does not have any port to be accessed with.
