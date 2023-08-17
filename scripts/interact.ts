import { ethers } from "hardhat";
// const { ethers } = require('hardhat');
const fs = require('fs');

async function main() {
  const contractAddress = fs.readFileSync('contract-address.txt', 'utf-8').trim();

  const CrossOrgWorkflow = await ethers.getContractFactory('CrossOrgWorkflow');
  const crossOrgWorkflow = await CrossOrgWorkflow.attach(contractAddress);

  const [org1, org2] = await ethers.getSigners(); // Use organization addresses here

  await crossOrgWorkflow.connect(org1).createRequest('Request from Organization 1');
  console.log('Request created by Organization 1');

  await crossOrgWorkflow.connect(org2).createRequest('Request from Organization 2');
  console.log('Request created by Organization 2');

  await crossOrgWorkflow.connect(org1).approveRequest(0);
  console.log('Request approved by Organization 1');

  await crossOrgWorkflow.connect(org2).approveRequest(0);
  console.log('Request approved by Organization 2');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
