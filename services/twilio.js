const twilio = require('twilio')(
  'ACf3c4de10ed34fba14e4161e03736cf8e',
  'fc75bef3cd0cfe150fa49ece65b28648'
)

exports.sendSMS = contact => {
  return new Promise((resolve, reject) => {
    twilio.verify
      .services(process.env.SERVICE_ID)
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
