const twilio = require('twilio')(
  'ACf3c4de10ed34fba14e4161e03736cf8e',
  'fc75bef3cd0cfe150fa49ece65b28648'
)
const localStorage = require('localStorage')


exports.sendSMS = contact => {
  return new Promise((resolve, reject) => {
    twilio.verify
      .services('VA1e6ccb085b7ffda14fb0fc30cb387eb5')
      .verifications.create({
        to: `+91${contact}`,
        channel: `sms`
      })
      .then(data => {
        resolve(data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

exports.verifySms = (codes, contact) => {
  return new Promise((resolve, reject) => {
    twilio
      .verify
      .services('VA1e6ccb085b7ffda14fb0fc30cb387eb5')
      .verificationChecks
      .create({
        to: `${contact}`,
        code: codes
      }, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
  })
}