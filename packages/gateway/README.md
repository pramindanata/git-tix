# API Gateway

This is an API Gateway for git-tix microservices.

## Requirements

- Node.js: `v12.16.0`
- Typescript: `v3.9.7`

## Development

Create new `.env` file in this service project directory. Please see `.env.example` for available values. Then run these commands:

```sh
# Install depedencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:<YOUR_ASSIGNED_APP_PORT>](http://localhost:<YOUR_ASSIGNED_APP_PORT>) with your browser to see the result.

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

Open [http://localhost:<YOUR_ASSIGNED_APP_PORT>](http://localhost:<YOUR_ASSIGNED_APP_PORT>) with your browser to see the result.