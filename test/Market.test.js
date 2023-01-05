const { expect } = require("chai");
const { ethers } = require("hardhat");
//const { describe } = require("node:test");

const { BigNumber } = ethers;

const auctionPriceInEth = '1.5';
const auctionPrice = ethers.utils.parseUnits(auctionPriceInEth, 'ether');

describe("Market",function(){
    let Market, market,marketAddress, marketSigner, ownerSigner, sellerSigner, buyerSigner,otherSigners,NFT,nft;


    before(async function() {
        /* deploy the marketplace */
        Market = await ethers.getContractFactory("NFTMarket")
        market = await Market.deploy()
        await market.deployed()
        marketAddress = market.address
        marketSigner = market.provider.getSigner(marketAddress);
    
        /* deploy the NFT contract */
        NFT = await ethers.getContractFactory("NFT")
        nft = await NFT.deploy();
        nft.setApprovalForAll(marketAddress, true);
        await nft.deployed()
        nftContractAddress = nft.address;
        /* Get users */
        [ownerSigner, sellerSigner, buyerSigner, ...otherSigners] = await ethers.getSigners();
    
        
      })
      describe("createMarketSale", function() {

        it("Should update the seller and contract token balances when listing item for sale", async function() {
    
          let createNFTPromise = nft.connect(sellerSigner).createToken("https://www.mytokenlocation.com");
          const tokenId = await getTokenIdOrItemIdFromTransaction(createNFTPromise);
          await nft.connect(sellerSigner).setApprovalForAll(marketAddress, true);
      
    
          await expect(() => market.connect(sellerSigner).createMarketItem(nftContractAddress, tokenId, auctionPrice),
           "The seller token balance should decrease by 1 and the market balance should increase by 1")
          .to.changeTokenBalances(nft, [sellerSigner, marketSigner], [-1, 1]);
      
        })
    
        it("Should update the buyer and contract token balances when an item is sold", async function() {
    
          let { tokenId } = await createTokenAndMarketItem(sellerSigner);
          const { itemId } = await getMarketItemIdFromTokenId(tokenId);
    
          await expect(() => market.connect(buyerSigner).createMarketSale(nftContractAddress, itemId, { value: auctionPrice}))
          .to.changeTokenBalances(nft, [buyerSigner, marketSigner, sellerSigner], [1, -1, 0]);
      
        })
    
        it("Should update the buyer and contract ether balances on sale", async function() {
    
          let { tokenId } = await createTokenAndMarketItem(sellerSigner);
          const { itemId } = await getMarketItemIdFromTokenId(tokenId);
    
          const negativeAuctionPrice = ethers.utils.parseUnits(`-${auctionPriceInEth}`, 'ether');
    
          await expect(() => market.connect(buyerSigner).createMarketSale(nftContractAddress, itemId, { value: auctionPrice}),
          `The buyer's ether balance should decrease by the auction price: ${auctionPriceInEth} while the contract's ether balance increases by the auction price.`)
          .to.changeEtherBalances([buyerSigner, marketSigner], [negativeAuctionPrice, auctionPrice]);
      
        })
        
      })
      /**
   * Parse the transaction logs to get the tokenId returned from the function call
   * @param {*} transactionPromise 
   * @returns 
   */
   async function getTokenIdOrItemIdFromTransaction(transactionPromise) {
    transactionPromise = await transactionPromise;
    const transaction = await transactionPromise.wait()
    const event = transaction.events[0];
    let value = event.topics[3]
    value = BigNumber.from(value)
    // We usually shouldn't convert BigNumber toNumber() but this is okay since we don't expect the tokenId or itemId to be very large in our tests
    return value.toNumber()
  }

  /**
   * Reading the itemId from the transaction result is causing potential race conditions where tests pass in isolation
   * but fail when run together in the test suite.
   * To solve this, this helper function was created to get the item ID from the smart contract when it's needed.
   * @param {*} tokenId 
   * @param {*} returnSoldItems 
   * @returns 
   */
  async function getMarketItemIdFromTokenId(tokenId, returnSoldItems = false) {
    let marketItems = (await market.fetchMarketItems());
    return marketItems.find(item=> returnSoldItems ? item.sold : !item.sold && BigNumber.from(tokenId).eq(item.tokenId));
  }

  async function createTokenAndMarketItem(signer) {

    let createNFTPromise = nft.connect(signer).createToken("https://www.mytokenlocation.com");
    const tokenId = await getTokenIdOrItemIdFromTransaction(createNFTPromise);

    await nft.connect(signer).setApprovalForAll(marketAddress, true);

    const createMarketItemPromise = market.connect(signer).createMarketItem(nftContractAddress, tokenId, auctionPrice);
    const itemId = await getTokenIdOrItemIdFromTransaction(createMarketItemPromise);

    return {
      tokenId,
      itemId
    }
  }
})
