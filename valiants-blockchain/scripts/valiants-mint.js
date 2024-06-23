async function main() {
    [deployer] = await ethers.getSigners();
    
    
    Contract = await ethers.getContractFactory("Valiants");
    const deployerAddress = await deployer.getAddress();
    console.log("Minting with the account:", deployerAddress );

    CONTRACT_ADDRESS = "0xDe5D27caa44951d7c361120f3E9aC059908A7dee"

    contract = await Contract.attach(CONTRACT_ADDRESS)

    await contract.connect(deployer).mint();



}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});