// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Valiants is ERC721Enumerable {
  uint256 private tokenId; 

  struct Valiant {
    uint8 shape;
    uint256 lastMeal; 
    uint256 lastPlay;
    uint256 level;
  }

  mapping(uint256 =>  Valiant) private valiant;

  event eventMintNFT(address minter, uint256 tokenId);


  constructor() ERC721("Valiants - Clicker Game Demo", "VLNT") {
    tokenId = 0;
    
  }

  function mint() public {
    _safeMint(msg.sender, tokenId);
    valiant[tokenId] = Valiant(uint8(random()), block.timestamp, block.timestamp, 1);
    emit eventMintNFT(msg.sender, tokenId);
    tokenId++;
  }

  function getValiantsOf(address _address) public view returns(uint256[] memory) {
    uint256[] memory tokens = new uint256[](balanceOf(_address));
    for (uint256 i = 0; i < tokens.length; i++) {
      tokens[i] = tokenOfOwnerByIndex(_address, i);
    }
    return tokens;
  }
  
  function getValiant(uint256 _tokenId) public view returns(Valiant memory) {
    return valiant[_tokenId];
  }
  
  function feed(uint256 _tokenId) public {
    require(ownerOf(_tokenId) == msg.sender, "You don't own this Valiant");
    valiant[_tokenId].lastMeal = block.timestamp;
    valiant[_tokenId].level += 1;
  }
  
  function play(uint256 _tokenId) public {
    require(ownerOf(_tokenId) == msg.sender, "You don't own this Valiant");
    valiant[_tokenId].lastPlay = block.timestamp;
    valiant[_tokenId].level += 1;
  }


  // Don't use this function in production, please use something like Chainlink for randomness, this function is very insecure
  function random() private view returns (uint) {
    return uint256(keccak256(abi.encodePacked(
      tx.origin,
      blockhash(block.number - 1),
      block.timestamp
    ))) % 4;
  }

}
