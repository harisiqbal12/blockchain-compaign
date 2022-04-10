const { expect } = require('chai');
const { ethers } = require('hardhat');

let compaignFactory;
let compaingsAddress;
let compaign;
let owner, recipient, acc1, acc2, acc3, acc4, acc5;
let minimumContribution;
let balanceOfRecipient,
	balanceOfOneBefore,
	balanceOfTwoBefore,
	balanceOfThreeBefore,
	balanceOfFourBefore,
	balanceOfFiveBefore,
	balanceOfRecipientBefore;

let balanceOfOneAfter,
	balanceOfTwoAfter,
	balanceOfThreeAfter,
	balanceOfFourAfter,
	balanceOfFiveAfter;

let request, afterApproveRequest;
let totalFundsBefore, totalFundsAfter;

describe('Compaign', function () {
	it('deploy', async function () {
		const Compaign = await ethers.getContractFactory('Compaign');
		compaignFactory = await Compaign.deploy();
		await compaignFactory.deployed();
	});
	it('create compaign factory', async () => {
		await compaignFactory.createCampaign(100);
	});

	it('create compaign', async () => {
		[compaingsAddress] = await compaignFactory.getDeployedContracts();
	});

	it('accounts from hardhat', async () => {
		[owner, acc2, acc3, acc4, acc5, acc1, recipient] = await ethers.getSigners();
	});

	it('get minimum ammount from deployed compaign', async () => {
		compaign = await ethers.getContractAt('CompaignContract', compaingsAddress);
		minimumContribution = await compaign.minimumContribution();
	});

	it('Users value before contributing to compaign', async () => {
		const provider = ethers.provider;

		balanceOfOneBefore = await (
			await provider.getBalance(acc1.address)
		).toString();

		balanceOfTwoBefore = await (
			await provider.getBalance(acc2.address)
		).toString();

		balanceOfThreeBefore = await (
			await provider.getBalance(acc3.address)
		).toString();

		balanceOfFourBefore = await (
			await provider.getBalance(acc4.address)
		).toString();

		balanceOfFiveBefore = await (
			await provider.getBalance(acc5.address)
		).toString();
		balanceOfRecipientBefore = await (
			await provider.getBalance(recipient.address)
		).toString();
	});

	it('contributes with different accounts', async () => {
		await compaign.connect(acc1).contribute({
			value: ethers.utils.parseEther('200'),
		});

		await compaign.connect(acc2).contribute({
			value: ethers.utils.parseEther('100'),
		});

		await compaign.connect(acc3).contribute({
			value: ethers.utils.parseEther('120'),
		});

		await compaign.connect(acc4).contribute({
			value: ethers.utils.parseEther('320'),
		});

		await compaign.connect(acc5).contribute({
			value: ethers.utils.parseEther('1000'),
		});
	});

	it('Users value after contributing to compaign', async () => {
		const provider = ethers.provider;

		balanceOfOneAfter = await (
			await provider.getBalance(acc1.address)
		).toString();

		balanceOfTwoAfter = await (
			await provider.getBalance(acc2.address)
		).toString();

		balanceOfThreeAfter = await (
			await provider.getBalance(acc3.address)
		).toString();

		balanceOfFourAfter = await (
			await provider.getBalance(acc4.address)
		).toString();

		balanceOfFiveAfter = await (
			await provider.getBalance(acc5.address)
		).toString();
	});

	it('Get Total Available Funds After Contributing', async () => {
		totalFundsBefore = await (await compaign.totalAvailableFunds()).toString();
	});

	it('Create a Request', async () => {
		await compaign.createRequest(
			'For Buying new servers',
			ethers.utils.parseEther('10'),
			recipient.address
		);
	});

	it('Get A Request', async () => {
		request = await compaign.requests(0);
	});

	it('Approve Request', async () => {
		await compaign.connect(acc1).approveRequest(0);
		await compaign.connect(acc2).approveRequest(0);
		await compaign.connect(acc3).approveRequest(0);
		await compaign.connect(acc4).approveRequest(0);
	});

	it('Finalize Request', async () => {
		const provider = ethers.provider;
		await compaign.finalizeRequest(0);

		balanceOfRecipient = await (
			await provider.getBalance(recipient.address)
		).toString();
	});

	it('Get A Request After Approve', async () => {
		afterApproveRequest = await compaign.requests(0);
	});

	it('Get Total Available Funds Before Contributing', async () => {
		totalFundsAfter = await (await compaign.totalAvailableFunds()).toString();
	});
});

describe('Outputs', () => {
	it('outpus', async () => {
		console.log(' -Before Contributing.');
		console.log('Balance Of Account 1: ', balanceOfOneBefore);
		console.log('Balance Of Account 2: ', balanceOfTwoBefore);
		console.log('Balance Of Account 3: ', balanceOfThreeBefore);
		console.log('Balance Of Account 4: ', balanceOfFourBefore);
		console.log('Balance Of Account 5: ', balanceOfFiveBefore);

		console.log('\n -After Contributing.');
		console.log('Balance Of Account 1: ', balanceOfOneAfter);
		console.log('Balance Of Account 2: ', balanceOfTwoAfter);
		console.log('Balance Of Account 3: ', balanceOfThreeAfter);
		console.log('Balance Of Account 4: ', balanceOfFourAfter);
		console.log('Balance Of Account 5: ', balanceOfFiveAfter);

		console.log('\n -contract outputs');
		console.log('Minimum contributiin', minimumContribution);
		console.log('Total Available Funds After Contributing: ', totalFundsBefore);
		console.log('Balance Of Recipient Before: ', balanceOfRecipientBefore);
		console.log('Balance Of Recipient After: ', balanceOfRecipient);
		console.log('Total Available Funds After Approving: ', totalFundsAfter);
		console.log('Before Approving Request: ', request);
    console.log("After Approving Request: ", afterApproveRequest)

	});
});
