import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.21",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
    paths: {
        sources: "./contracts",
        artifacts: "./artifacts",
        cache: "./cache"
    },
    networks: {
        localhost: {
            url: "http://127.0.0.1:8545",
            chainId: 31337
        }
    }
};

export default config;
