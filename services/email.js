const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')

let transporter = nodemailer.createTransport({
	service: 'gmail', // true for 465, false for other ports
	auth: {
		user: 'prajapatijayesh.beis.16@acharya.ac.in', // generated ethereal user
		pass: 'jscajyutkqmgymur' // generated ethereal password
	}
})

exports.sendEmail = (email, req, res) => {
	if (email) {
		return new Promise(async (resolve, reject) => {
			const token = jwt.sign({
				email: email
			}, 'secret', {
				expiresIn: 180
			})
			res.cookie('token', 'Bearer ' + token);
			transporter.sendMail(
				{
					from: 'Notes Sharing App <no-reply@notesapp.com>',
					to: email,
					subject: 'Verification Link',
					// html: `Please verify your account using this link. This Link is valid for 3 minutes only.  <a href='http://localhost:3000/auth/verify/${token}'>Click</a>`
					html: `Please verify your account using this link. This Link is valid for 3 minutes only.  <a href='https://notessapp.herokuapp.com/auth/verify/${token}'>Click</a>`
				},
				(err, data) => {
					if (err) {
						reject(err)
					} else {
						resolve(data)
					}
				}
			)
		})
	} else {
		return new Promise(async (resolve, reject) => {
			transporter.sendMail(
				{
					from: req.body.email,
					to: `prajapatijayesh.beis.16@acharya.ac.in`,
					subject: 'Complaint from User : ' + req.body.name,
					html: req.body.msg
				},
				(err, data) => {
					if (err) {
						console.log(err)
						reject(err)
					} else {
						resolve(data)
					}
				}
			)
		})
	}
}

exports.forgotPassword = (email, res) => {
	return new Promise((resolve, reject) => {
		const token = jwt.sign({
			email: email
		}, 'secret', {
			expiresIn: 180
		});
		transporter.sendMail({
			from: 'Notes Sharing App <no-reply@notesapp.com>',
			to: email,
			subject: `Reset Password Link. Valid for 3 Minutes Only`,
			html: `Click <a href='https://notessapp.herokuapp.com/auth/forgotPassword/${token}'>Click</a> to reset Password`,
			// html: `Click <a href="http://localhost:3000/auth/forgotPassword/${token}">here</a> to reset your password `
		}, (err, data) => {
			if (err) {
				reject(err)
			} else {
				res.cookie('token', 'Bearer ' + token)
				resolve(data)
			}
		})
	})
}