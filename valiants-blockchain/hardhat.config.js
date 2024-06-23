require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: "https://ethereum-sepolia.publicnode.com",
      accounts: ["0xe22db0f980e985e87ab7162d09698b4d2bfef6a8fed6ff6d6b9cf0090cbfbc03"],
      gas: 21000000,
      gasPrice: 16000000000,
      blockGasLimit: 2100000000,
    },
  },
};
