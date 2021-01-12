const mongoose = require('mongoose');

const connectDB = async () => {
	try{
		mongoose.set('useUnifiedTopology', true);
		const conn = await mongoose.connect(
			process.env.MONGO_URI, 
			{
				useNewUrlParser: true, 
				useUnifiedTopology: true,
				useCreateIndex: true
			}
		);
		console.log('Database Connected.');
	} 
	catch(err){
		console.error(err.message);
		process.exit(1);
	}
}

module.exports = connectDB;