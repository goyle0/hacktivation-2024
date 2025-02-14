import { ethers } from "hardhat";

async function main() {
    const RouteRecord = await ethers.getContractFactory("RouteRecord");
    const routeRecord = await RouteRecord.deploy();
    await routeRecord.waitForDeployment();

    console.log("RouteRecord deployed to:", await routeRecord.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
