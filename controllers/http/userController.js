const errObj = require('../../error/errorHandler.js');
const Users = require('../../models/users/users.js');

const getUserProfile = async (req, res, next) => {
	try{
		const userID = req.userID;
		const user = await Users.findOne({_id: userID}, {_id:1, firstName:1, lastName:1, email:1});
		if(!user) next(new errObj.NotFoundError("User not Found"));
		req.profile = user;
		debugger
		next();
	}
	catch(err){
		console.log(err)
		next(err);
	}
}

module.exports = {
	getUserProfile,
}