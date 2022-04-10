const hre = require('hardhat');

async function main() {
	const CompaignFactory = await hre.ethers.getContractFactory('Compaign');
	const compaignFactory = await CompaignFactory.deploy();
	await compaignFactory.deployed();

	console.log('compaign factory deployed to: ', compaignFactory.address);
}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});
