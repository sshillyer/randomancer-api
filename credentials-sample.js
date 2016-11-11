// Replace connectionString with the connection string used by your service. This is used during
// connection process in index.js. File should be renamed credentials.js

module.exports = {
	mongo: {
		development: {
			connectionString: 'connectionStringForDevelopment',
		},
		production: {
			connectionString: 'connectionStringForProduction',
		},
	},
};