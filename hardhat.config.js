// require("@nomiclabs/hardhat-waffle")
// const { CONTRACT_DEPLOYMENT_WALLET_PRIVATE_KEY, INFURA_API_KEY} = process.env;

// module.exports = {
//   solidity: {
//     version: "0.8.4",
//     settings: {
//       optimizer: {
//         enabled: true,
//         runs: 200
//       }
//     },
//   },
//   paths: {
//     artifacts: './src/artifacts',
//   },
//   defaultNetwork: "hardhat",
//   networks: {
//     hardhat: {
//       chainId: 1337
//     },
//     rinkeby: {
//       url: `https://goerli.infura.io/v3/b8be85f98c9f4fdaa7c1ea2f455aa4b6/${INFURA_API_KEY}`,
//       accounts: [`0x${"04ac334bf6b42f203e1135942d99a46ea65dea5f3c04968d78ed779e36a1c339"}`],
//       chainId: 4
//     },
//     bsctestnet: {
//       url: `https://data-seed-prebsc-1-s1.binance.org:8545`,
//       accounts: [`0x${"04ac334bf6b42f203e1135942d99a46ea65dea5f3c04968d78ed779e36a1c339"}`],
//       chainId: 97
//     },
//   }
// }


/* hardhat.config.js */
const { hardHatSettings } = require("./scripts/helpers.js");

require("@nomiclabs/hardhat-waffle");
require("./scripts/deploy.js");

module.exports = {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    },
  },
  paths: {
    artifacts: './src/artifacts',
  },
  defaultNetwork: "hardhat",
  networks: hardHatSettings.networks,
}
