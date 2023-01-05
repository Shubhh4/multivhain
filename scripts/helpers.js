// scripts/helpers.js
const { ethers } = require("ethers");
const fs = require('fs');
const { CONTRACT_DEPLOYMENT_WALLET_PRIVATE_KEY, INFURA_API_KEY} = process.env;

const chainConfigFilePath = './src/config-chains.json';
// Helper method for fetching a connection provider to the Ethereum network
function getAvailableChains() {
    let chainConfigRaw = fs.readFileSync(chainConfigFilePath);

    let chainConfigs = JSON.parse(chainConfigRaw);
    return chainConfigs
}

const hardHatSettings = {
    networks: {
        rinkeby: {
          url: `https://goerli.infura.io/v3/b8be85f98c9f4fdaa7c1ea2f455aa4b6/${INFURA_API_KEY}`,
          accounts: [`0x${"04ac334bf6b42f203e1135942d99a46ea65dea5f3c04968d78ed779e36a1c339"}`],
          chainId: 5
        },
        bsctestnet: {
          url: `https://data-seed-prebsc-1-s1.binance.org:8545`,
          accounts: [`0x${"04ac334bf6b42f203e1135942d99a46ea65dea5f3c04968d78ed779e36a1c339"}`],
          chainId: 97
        },
    }
};

// Helper method for fetching a connection provider to the Ethereum network
function getNetworkSetting(chainId) {
    return Object.values(hardHatSettings.networks).find(chainSettings => chainSettings.chainId == chainId);
}

// Helper method for fetching a connection provider to the Ethereum network
function getProvider(chainId) {
    const hardhatChainNetwork = getNetworkSetting(chainId);
    return ethers.getDefaultProvider(hardhatChainNetwork?.url);
}

// Helper method for fetching a wallet account using an environment variable for the PK
function getAccount(chainId) {

    const hardhatChainNetwork = getNetworkSetting(chainId);
    if (!hardhatChainNetwork) {
        console.error("\x1b[33m%s\x1b[0m", `No matching chainId found for network: '${chainId}', using localhost.`);
        return null
    }
    return new ethers.Wallet(hardhatChainNetwork? hardhatChainNetwork.accounts[0]:"", getProvider(chainId));
}

module.exports = {
    getAvailableChains,
    chainConfigFilePath,
    hardHatSettings,
    getProvider,
    getAccount,
    getNetworkSetting
}