import User from '../models/user.model'
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
import config from './../../config/config'



const signin = async (req, res) => {
	try {
		let user = await User.findOne({
			"email": req.body.email
		});

		if (!user)
		{
			return res.status('401').json({
				error: "User Not Found!"
			});
		}

		if (!user.authenticate(req.body.password))
		{
			return res.status('401').send({
				error: "Email and Password Do Not Match!"
			});
		}

		const token = jwt.sign({ _id: user._id }, config.jwtSecret)

		res.cookie('t', token, {expire: new Date() + 9999 });

		return res.json({
			token,
			user: {
				_id: user._id,
				name: user.name,
				email: user.email
			}
		})
	} catch(err) {
		return res.status('401').json({
			error: "Could Not Sign In!"
		});
	}

};


const signout = async (req, res) => {

	const signout = (req, res) => {
		res.clearCookie('t');
		return res.status('200').json({
			message: "Signed Out!"
		});
	}
};

// If the token is valid, this function appends the verified user's ID in an 'auth' key
// to the request object.
const requireSignin = expressJwt({
	secret: config.jwtSecret,
	userProperty: 'auth',
	algorithms: ['HS256']
})


// For some protected routes (delete, update, etc) there is a need to make sure that the user providing
// the information is the owner of that information.
// The "req.auth" object is populated by express-jwt in "requireSignin".
// "req.profile" is populated by "userByID"
// This function needs to be added to any route that requires both authentication and authorization:
const hasAuthorization = async (req, res, next) => {
	const authorized = req.profile && req.auth && req.profile._id == req.auth._id;
	if (!(authorized))
	{
		return res.status('403').json({
			error: "User Is Not Authorized!"
		});
	}

	next();
};


export default { signin, signout, requireSignin, hasAuthorization };