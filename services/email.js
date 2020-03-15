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
					html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
					<html xmlns="http://www.w3.org/1999/xhtml">
					<head>
					<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
					<title>Demystifying Email Design</title>
					<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
					</head>
					<body style="margin: 0; padding: 0;">
					  <table border="0" cellpadding="0" cellspacing="0" width="100%"> 
						<tr>
						  <td style="padding: 10px 0 30px 0;">
							<table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; border-collapse: collapse;">
							  <tr>
								<td align="center" bgcolor="#70bbd9" style="padding: 40px 0 30px 0; color: #153643; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;">
								  <img src="https://cdn.iconscout.com/icon/free/png-256/pied-piper-11-599410.png" alt="Creating Email Magic" width="300" height="230" style="display: block;" />
										<h3>Notes Sharing Application</h3>
										</td>
							  </tr>
							  <tr>
								<td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
								  <table border="0" cellpadding="0" cellspacing="0" width="100%">
									<tr>
									  <td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;">
										<b>Account Verification Link</b>
									  </td>
									</tr>
									<tr>
									  <td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
									  Please verify your account using this link. This Link is valid for 3 minutes only.  <a href='https://notessapp.herokuapp.com/auth/verify/${token}'>Click</a>
									  </td>
									</tr>
								  </table>
								</td>
							  </tr>
							  <tr>
								<td bgcolor="#ee4c50" style="padding: 30px 30px 30px 30px;">
								  <table border="0" cellpadding="0" cellspacing="0" width="100%">
									<tr>
									  <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;" width="75%">
										&reg; Copyright @ Notes Sharing Application 2020. Made with ❤️<br/>
									  </td>
									  <td align="right" width="25%">
										<table border="0" cellpadding="0" cellspacing="0">
										  <tr>
											<td style="font-family: Arial, sans-serif; font-size: 12px; font-weight: bold;">
											  <a href="http://www.twitter.com/" style="color: #ffffff;">
												<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/210284/tw.gif" alt="Twitter" width="38" height="38" style="display: block;" border="0" />
											  </a>
											</td>
											<td style="font-size: 0; line-height: 0;" width="20">&nbsp;</td>
											<td style="font-family: Arial, sans-serif; font-size: 12px; font-weight: bold;">
											  <a href="http://www.twitter.com/" style="color: #ffffff;">
												<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/210284/fb.gif" alt="Facebook" width="38" height="38" style="display: block;" border="0" />
											  </a>
											</td>
										  </tr>
										</table>
									  </td>
									</tr>
								  </table>
								</td>
							  </tr>
							</table>
						  </td>
						</tr>
					  </table>
					</body>
					</html>`
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
			subject: `Reset Password Link`,
			html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
			<html xmlns="http://www.w3.org/1999/xhtml">
			<head>
			<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
			<title>Demystifying Email Design</title>
			<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
			</head>
			<body style="margin: 0; padding: 0;">
				<table border="0" cellpadding="0" cellspacing="0" width="100%"> 
					<tr>
						<td style="padding: 10px 0 30px 0;">
							<table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; border-collapse: collapse;">
								<tr>
									<td align="center" bgcolor="#70bbd9" style="padding: 40px 0 30px 0; color: #153643; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;">
										<img src="https://cdn.iconscout.com/icon/free/png-256/pied-piper-11-599410.png" alt="Creating Email Magic" width="300" height="230" style="display: block;" />
										<h3>Notes Sharing Application. Made with ❤️</h3>
										</td>
								</tr>
								<tr>
									<td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
										<table border="0" cellpadding="0" cellspacing="0" width="100%">
											<tr>
												<td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;">
													<b>Reset Password Link</b>
												</td>
											</tr>
											<tr>
												<td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
												Click <a href='https://notessapp.herokuapp.com/auth/forgotPassword/${token}'>Click</a> to reset Password
												</td>
											</tr>
										</table>
									</td>
								</tr>
								<tr>
									<td bgcolor="#ee4c50" style="padding: 30px 30px 30px 30px;">
										<table border="0" cellpadding="0" cellspacing="0" width="100%">
											<tr>
												<td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;" width="75%">
													&reg; Copyright @ Notes Sharing Application 2020<br/>
												</td>
												<td align="right" width="25%">
													<table border="0" cellpadding="0" cellspacing="0">
														<tr>
															<td style="font-family: Arial, sans-serif; font-size: 12px; font-weight: bold;">
																<a href="http://www.twitter.com/" style="color: #ffffff;">
																	<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/210284/tw.gif" alt="Twitter" width="38" height="38" style="display: block;" border="0" />
																</a>
															</td>
															<td style="font-size: 0; line-height: 0;" width="20">&nbsp;</td>
															<td style="font-family: Arial, sans-serif; font-size: 12px; font-weight: bold;">
																<a href="http://www.twitter.com/" style="color: #ffffff;">
																	<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/210284/fb.gif" alt="Facebook" width="38" height="38" style="display: block;" border="0" />
																</a>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</body>
			</html>`,
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