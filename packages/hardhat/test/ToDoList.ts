import { expect } from "chai";
import { ethers } from "hardhat";
import { ToDoList } from "../typechain-types";

describe("ToDoList", function () {
  let toDoList: ToDoList;

  before(async () => {
    const toDoListFactory = await ethers.getContractFactory("ToDoList");
    toDoList = (await toDoListFactory.deploy()) as ToDoList;
    await toDoList.waitForDeployment();
  });

  it("Should allow adding a task", async function () {
    const [owner] = await ethers.getSigners();
    await toDoList.addTask("First Task");
    const tasks = await toDoList.getTasks();
    expect(tasks.length).to.equal(1);
    expect(tasks[0].description).to.equal("First Task");
    expect(tasks[0].completed).to.be.false;
  });

  it("Should toggle task completion", async function () {
    const [owner] = await ethers.getSigners();
    await toDoList.addTask("Second Task");
    const tasksBefore = await toDoList.getTasks();
    expect(tasksBefore[1].completed).to.be.false;

    await toDoList.toggleTaskCompletion(1);
    const tasksAfter = await toDoList.getTasks();
    expect(tasksAfter[1].completed).to.be.true;

    await toDoList.toggleTaskCompletion(1);
    const tasksAfterToggleBack = await toDoList.getTasks();
    expect(tasksAfterToggleBack[1].completed).to.be.false;
  });

  it("Should allow deleting a task", async function () {
    const [owner] = await ethers.getSigners();
    await toDoList.addTask("Task to Delete");
    const tasksBefore = await toDoList.getTasks();
    expect(tasksBefore.length).to.equal(3);

    await toDoList.deleteTask(2);
    const tasksAfter = await toDoList.getTasks();
    expect(tasksAfter.length).to.equal(2);
    expect(tasksAfter.find((task) => task.id === 2)).to.be.undefined;
  });

  it("Should revert when trying to delete a non-existent task", async function () {
    const [owner] = await ethers.getSigners();
    await expect(toDoList.deleteTask(99)).to.be.revertedWith("Task does not exist");
  });

  it("Should revert when toggling completion of a non-existent task", async function () {
    const [owner] = await ethers.getSigners();
    await expect(toDoList.toggleTaskCompletion(99)).to.be.revertedWith("Task does not exist");
  });
  
  
});
