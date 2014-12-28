'use strict';

module.exports = {
  db: 'mongodb://localhost/mean-dev',
  debug: true,
//  aggregate: 'whatever that is not false, because boolean false value turns aggregation off', //false
  aggregate: true,
  mongoose: {
    debug: false
  },
  app: {
    name: 'Warcraft Professional | Calculates the cost of leveling professions'
  },
  battlenet: {
    clientID: process.env.BNET_ID,
    clientSecret: process.env.BNET_SECRET,
    callbackURL: 'https://localhost:9000/auth/bnet/callback'
  },
  emailFrom: 'noreply@warcraftprofessional.net', // sender address like ABC <abc@example.com>
  mailer: {
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASSWORD
    }
  }
};
