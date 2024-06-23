const { expect } = require("chai");
const { upgrades } = require("hardhat");


describe("Valiants - Clicker Game Demo", function () {

    beforeEach(async function () {
        [owner] = await ethers.getSigners();

        Valiants = await ethers.getContractFactory("Valiants");
        valiant = await Valiants.deploy();
    });

    it("Can mint Valiants", async function () {
        await valiant.mint();
        expect(await valiant.totalSupply()).to.equal(1);
    });
    
    it("Can get valiant details", async function () {
        await valiant.mint();
        const valiantDetails = await valiant.getValiant(0);
        expect(valiantDetails[0]).to.be.lessThan(4); //Check if shape is less than 4
    });
    
    it("Can play with valiant", async function () {
        await valiant.mint();
        const oldStatus = await valiant.getValiant(0);
       await valiant.play(0);
        const newStatus = await valiant.getValiant(0);
        expect(oldStatus[2]).to.be.lessThan(newStatus[2]); //Check if date is updated
        expect(oldStatus[3]).to.be.lessThan(newStatus[3]); //Check if level increased
    });
    
    it("Can feed valiant", async function () {
        await valiant.mint();
        const oldStatus = await valiant.getValiant(0);
       await valiant.feed(0);
        const newStatus = await valiant.getValiant(0);
        expect(oldStatus[1]).to.be.lessThan(newStatus[1]); //Check if date is updated
        expect(oldStatus[3]).to.be.lessThan(newStatus[3]); //Check if level increased
    });
    
    
    


});