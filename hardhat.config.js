// https://eth-ropsten.alchemyapi.io/v2/9qxZkqdfSMOTH8gfI34LY935rVWXvtH5

require('@nomiclabs/hardhat-waffle');

module.exports = {
	solidity: '0.8.0',
	networks: {
		ropsten: {
			url: 'https://eth-ropsten.alchemyapi.io/v2/9qxZkqdfSMOTH8gfI34LY935rVWXvtH5',
			accounts: [
				'285fb612ad88fa52236f6de0e39a0f844cfa72dbcb1d9c3dfd26c7d955de288b',
			],
		},
	},
};
