const hre = require("hardhat");

async function main() {
    const Valiants = await hre.ethers.getContractFactory("Valiants");
    const valiant = await Valiants.deploy();

    await valiant.waitForDeployment()

    console.log("Valiants Clicker - Demo deployed:", await valiant.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});