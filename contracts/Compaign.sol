// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;


contract CompaignContract {
    
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    address public manager;
    uint public minimumContribution;
    mapping(uint => Request) public requests;
    uint numRequests;

    mapping(address => bool) public approvers;
    uint public approversCount; 

    uint public totalFunds;
    uint public totalAvailableFunds;



    constructor(uint minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value >= minimumContribution);

        approvers[msg.sender] = true;
        totalFunds += msg.value;
        totalAvailableFunds += msg.value;
        approversCount++;
    }

    function createRequest(string memory _description, uint _value, address _recipient) 
    public restricted  {
            require(_value < totalAvailableFunds);
            Request storage r = requests[numRequests++];
            r.description = _description;
            r.value = _value;
            r.recipient = _recipient;
            r.complete = false;
            r.approvalCount = 0;
    }

    function approveRequest(uint index) public {
        Request storage r = requests[index];
        require(approvers[msg.sender]);
        require(!r.approvals[msg.sender]);

        r.approvals[msg.sender] = true;
        r.approvalCount++;
    }

    function finalizeRequest(uint index) public payable restricted{
        Request storage r = requests[index];

        require(r.value < totalFunds);
        require(!r.complete);
        require(r.approvalCount >= (approversCount / 2));

        payable(r.recipient).transfer(r.value);
        r.complete = true;
        totalAvailableFunds -= r.value;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
}

contract Compaign {
    address [] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        CompaignContract newCompaign = new CompaignContract(minimum, msg.sender);
        deployedCampaigns.push(address(newCompaign));
    }

    function getDeployedContracts() public view returns(address[] memory) {
        return deployedCampaigns;
    }
}