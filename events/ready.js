const { Events } = require('discord.js');
const mongoose = require('mongoose');
const mongoURL = process.env.mongoURL;

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		if (!mongoURL) return;

		await mongoose.connect(mongoURL || '');

		if (mongoose.connect)
		{
			console.log('\nI have connected to the database.');
		} else {
			console.log('\nFailed to connect to the database.');
		}
	},
};