const jwt = require('jsonwebtoken')
const localStorage = require('localStorage')

module.exports = (req, res, next) => {
	try {
		var decoded = jwt.verify(
			req.cookies.token.split(" ")[1],
			'secret'
		)
		req.userData = decoded
	} catch (error) {
		req.userData = null
	}
	next()
}