const { ethers } = require('hardhat');
const fs = require('fs');

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);

  const CrossOrgWorkflow = await ethers.getContractFactory('CrossOrgWorkflow');
  const crossOrgWorkflow = await CrossOrgWorkflow.deploy(2); // Number of required approvals

  await crossOrgWorkflow.deployed();

  console.log('CrossOrgWorkflow deployed to:', crossOrgWorkflow.address);

  // Save contract address to a file for later use
  const contractAddress = crossOrgWorkflow.address;
  fs.writeFileSync('contract-address.txt', contractAddress);

  // Add organizations
  await crossOrgWorkflow.addOrganization('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266');
  await crossOrgWorkflow.addOrganization('0x70997970c51812dc3a010c7d01b50e0d17dc79c8');

  console.log('Organizations added.');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
