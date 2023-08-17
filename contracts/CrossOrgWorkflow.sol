// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CrossOrgWorkflow {
    address public admin; // Contract admin
    uint256 public requiredApprovals; // Number of approvals required
    address[] public organizationAddresses; // List of valid organization addresses
    mapping(address => bool) public organizations; // Mapping to check if an address is a valid organization
    mapping(uint256 => mapping(address => bool)) public approvals; // RequestID -> Organization -> Approved
    uint256 public requestCount;

    event OrganizationAdded(address indexed organization);
    event RequestCreated(uint256 indexed requestId, string requestDetails);
    event RequestApproved(uint256 indexed requestId, address indexed organization);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    modifier validOrganization() {
        require(organizations[msg.sender], "Not a valid organization");
        _;
    }

    constructor(uint256 _requiredApprovals) {
        admin = msg.sender;
        requiredApprovals = _requiredApprovals;
    }

    function addOrganization(address _organization) external onlyAdmin {
        organizations[_organization] = true;
        organizationAddresses.push(_organization); // Add the address to the array
        emit OrganizationAdded(_organization);
    }

    function createRequest(string memory _requestDetails) external validOrganization {
        uint256 requestId = requestCount;
        requestCount++;

        emit RequestCreated(requestId, _requestDetails);
    }

    function approveRequest(uint256 _requestId) external validOrganization {
        require(!approvals[_requestId][msg.sender], "Already approved");
        
        approvals[_requestId][msg.sender] = true;
        emit RequestApproved(_requestId, msg.sender);

        if (countApprovals(_requestId) >= requiredApprovals) {
            // Execute the finalization logic here
            // For example, mark the request as approved or trigger an action
        }
    }

    function countApprovals(uint256 _requestId) internal view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < organizationAddresses.length; i++) {
            address organizationAddress = organizationAddresses[i];
            if (approvals[_requestId][organizationAddress]) {
                count++;
            }
        }
        return count;
    }
}
