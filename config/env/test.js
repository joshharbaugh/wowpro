'use strict';

module.exports = {
  db: 'mongodb://localhost/mean-test',
  http: {
    port: 3001
  },
  app: {
    name: 'Warcraft Professional | Calculates the cost of leveling professions'
  },
  battlenet: {
    clientID: process.env.BNET_ID,
    clientSecret: process.env.BNET_SECRET,
    callbackURL: 'https://localhost:9000/auth/bnet/callback'
  },
  emailFrom: 'SENDER EMAIL ADDRESS', // sender address like ABC <abc@example.com>
  mailer: {
    service: 'SERVICE_PROVIDER',
    auth: {
      user: 'EMAIL_ID',
      pass: 'PASSWORD'
    }
  }
};
