console.log('test deploy');

module.exports = {
  env: {
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  },
};
