const withImages = require('next-images');

module.exports = withImages({
	webpack(config) {
		return config;
	},
	env: {
		PREVIOUS_API_BASE_URL: 'https://api.cocstorage.com/api',
		API_BASE_URL: 'https://api-v1.cocstorage.com/v1',
		X_API_KEY: 'eb1a60873e999ee1992df4e33da72e97afc6a645ae6c93b8572c6d853644ba53f025fe343b7cf8bb49cd4dc4e1967caee49ec85c75724db8a9a8323012a9faa3',
		JWT_SECRET_KEY: '51621c0d221c0f5505ea8fa1c17e7286f96523d38f26bf53bb10283ea4c0dcd51f5435eecc185b0c1ccf35cdad0383170da813daa44bc87dc4fdeedc1f1b4eb0'
	}
});
