const twilio = require('twilio')(
  'ACf3c4de10ed34fba14e4161e03736cf8e',
  'fc75bef3cd0cfe150fa49ece65b28648'
)
const localStorage = require('localStorage')


exports.sendSMS = contact => {
  return new Promise((resolve, reject) => {
    twilio.verify
      .services('VA7f9b8b5b487402e284bc06337598a56b')
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

exports.verifySms = codes => {
  return new Promise((resolve, reject) => {
    twilio
      .verify
      .services('VA7f9b8b5b487402e284bc06337598a56b')
      .verificationChecks
      .create({
        to: `${req.cookies.mobile}`,
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