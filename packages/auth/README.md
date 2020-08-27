# Auth Service

This service provides capabilities to sign in, sign up, and get signed in user data.

## Requirements

- Node.js: `v12.16.0`
- Typescript: `v3.9.7`
- MongoDB: `v4.2.3`

## Development

Create new `.env` file in this service project directory. Please see `.env.example` for available values. Then run these commands:

```sh
# Install depedencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:<YOUR_ASSIGNED_APP_PORT>](http://localhost:<YOUR_ASSIGNED_APP_PORT>) with your browser to see the result.

## Testing

```sh
# Install depedencies
npm install

# Run test suite
npm run test

# Or
npm run test:watch
```

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