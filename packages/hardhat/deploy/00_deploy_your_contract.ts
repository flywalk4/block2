import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys a contract named "ToDoList" using the deployer account.
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployToDoList: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Deploy the ToDoList contract
  await deploy("ToDoList", {
    from: deployer,
    args: [],  // No constructor arguments needed
    log: true,
    autoMine: true,  // Option for faster mining on local networks
  });

  // Get the deployed contract to interact with it
  const toDoList = await hre.ethers.getContract<Contract>("ToDoList", deployer);
  console.log("Deployed ToDoList contract at:", toDoList.address);
};

export default deployToDoList;

// Tags are useful if you have multiple deploy files and only want to run one of them.
deployToDoList.tags = ["ToDoList"];
