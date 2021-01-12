const testRequest = require('supertest');
const bcrypt = require('bcrypt');
const saltRounds = 10; 
const Users = require('../models/users/users.js');
const app = require('../app.js');


let accessToken;

beforeAll(async () => {
	await Users.deleteMany();
	const hash = await bcrypt.hash('Password_123', saltRounds);
	await Users.create({
		firstName: 'Palden',
		lastName: 'Sherpa',
		email: 'himalayansherpa111@gmail.com',
		password: hash,
	    isVerified: true
	});
	const response = await testRequest(app)
	.post('/api/user/login')
	.send({
		email: 'himalayansherpa111@gmail.com',
		password: 'Password_123',
	})
	accessToken = response.body.accessToken;
})

test('Should register a new user', async () => {
	await testRequest(app)
	.post('/api/user/register')
	.send({
		firstName: 'Palden',
		lastName: 'Sherpa',
		email: 'sherpalden369@gmail.com',
		password: 'Password_123',
	})
	.expect(201)
})

test('Should login existing user', async () => {
	await testRequest(app)
	.post('/api/user/login')
	.send({
		email: 'himalayansherpa111@gmail.com',
		password: 'Password_123',
	})
	.expect(200)
})

test('Should retrive user profile details', async () => {
	const response = await testRequest(app)
	.get('/api/user/profile')
	.set('Authorization', 'bearer ' + accessToken)
	.expect(200)
})