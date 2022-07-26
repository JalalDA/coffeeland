const admin = require('firebase-admin')

const serviceAccount = JSON.parse(process.env.GOOGLE_CREDS);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = admin