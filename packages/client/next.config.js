console.log(process.env.STRIPE_PUBLISHABLE_KEY);

module.exports = {
  env: {
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  },
};
