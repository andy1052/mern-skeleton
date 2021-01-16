import User from '../models/user.model'
import extend from 'lodash/extend'
import errorHandler from '../../helpers/dbErrorHandler'


// Create a new user (ie: when express receives a POST request /api/users):
const create = async (req, res, next) => {	
	const user = new User(req.body);
	try {
		await user.save();
		return res.status(200).json({
			message: "User Successfully Created!"
		})
	} catch(err) {
		console.log("Error: ", err);
		return res.status(400).json({
			error: errorHandler.getErrorMessage(err)
		})
	}
};

// List all users (When express receives a GET request /api/users) (populates only the name email updated created fields to return to client):
const list = async (req, res) => {
	try {
		let users = await User.find().select('name email updated created');
		res.json(users);
	} catch(err) {
		return res.status(400).json({
			error: errorHandler.getErrorMessage(err)
		})
	}
};



// The CRUD operations below this line require that we retrieve a specific userID first:
// (/api/users/:userId)


// Load user and append to req:
const userByID = async (req, res, next, id) => {
	try {
		let user = await User.findById(id);
		if (!user)
		{
			return res.status(400).json({
				error: "User Not Found!"
			})
		}
		req.profile = user;
		next(); // This passes control to the READ function below.
	} catch(err) {
		return res.status(400).json({
			error: "Could Not Retrieve User!"
		})
	}
};

// GET request to (/api/users/:userId):
const read = async (req, res) => {
	req.profile.hashed_password = undefined;
	req.profile.salt = undefined;
	return res.json(req.profile);

};

// Update user document. PUT request to (/api/users/:userId):
const update = async (req, res, next) => {
	try {
		let user = req.profile;
		user = extend(user, req.body);
		user.updated = Date.now();
		await user.save();
		user.hashed_password = undefined;
		user.salt = undefined;
		res.json(user);
	} catch(err) {
		return res.status(400).json({
			error: errorHandler.getErrorMessage(err)
		})
	}
};


// Remove user from database. DELETE request to (/api/users/:userId):
const remove = async (req, res, next) => {
	try {
		let user = req.profile;
		let deletedUser = await user.remove();
		deletedUser.hashed_password = undefined;
		deletedUser.salt = undefined;
		res.json(deletedUser);
	} catch(err) {
		return res.status(400).json({
			error: errorHandler.getErrorMessage(err)
		})
	}

};


export default { create, userByID, read, list, remove, update };