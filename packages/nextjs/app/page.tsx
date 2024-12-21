'use client';

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import './ToDoList.css'; // Import CSS file for styling

const ToDoList = () => {
  const [account, setAccount] = useState<string>("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState<string>("");


  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const contractABI = [
    "function addTask(string calldata _description) external",
    "function toggleTaskCompletion(uint _taskId) external",
    "function deleteTask(uint _taskId) external",
    "function getTasks() external view returns (tuple(uint, string, bool)[])",
  ];

  const [contract, setContract] = useState<any>(null);


  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const userAccount = await signer.getAddress();
        setAccount(userAccount);
        const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(contractInstance); 
        loadTasks(contractInstance); 
      } catch (error) {
        console.error("Error connecting to wallet: ", error);
      }
    } else {
      console.log("Please install MetaMask or another Ethereum wallet.");
    }
  };


  const loadTasks = async (contractInstance: any) => {
    try {
      const fetchedTasks = await contractInstance.getTasks();
      const tasksWithIdDescriptionCompletion = fetchedTasks.map((task: any) => ({
        id: task[0].toString(),
        description: task[1],
        completed: task[2],
      }));
      setTasks(tasksWithIdDescriptionCompletion);
    } catch (error) {
      console.error("Error loading tasks: ", error);
    }
  };


  const addTask = async () => {
    console.log(contract)
    if (newTask && contract) {
      try {
        await contract.addTask(newTask);
        setNewTask("");
        loadTasks(contract); 
      } catch (error) {
        console.error("Error adding task: ", error);
      }
    } else {
      console.log("Contract not defined");
    }
  };

  const toggleTask = async (taskId: number) => {
    console.log(contract)
    if (contract) {
      try {
        await contract.toggleTaskCompletion(taskId);
        loadTasks(contract); 
      } catch (error) {
        console.error("Error toggling task: ", error);
      }
    } else {
      console.log("Contract not defined");
    }
  };

  const deleteTask = async (taskId: string) => {
    console.log(contract)
    if (contract) {
      try {
        await contract.deleteTask(Number(taskId)); 
        loadTasks(contract); 
      } catch (error) {
        console.error("Error deleting task: ", error);
      }
    } else {
      console.log("Contract not defined");
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <div className="todo-list-container">
      <h1>To-Do List</h1>
      <p>Connected account: {account}</p>

      <div className="add-task-container">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task"
        />
        <button onClick={addTask} className="button add-task-button">Add Task</button>
      </div>

      <h2>Your Tasks</h2>
      <ul className="task-list">
        {tasks.map((task, index) => (
          <li key={index} className={`task-item ${task.completed ? "completed" : "incomplete"}`}>
            <span
              className={`task-description ${task.completed ? "completed" : "incomplete"}`}
            >
              {task.description}
            </span>
            <button onClick={() => toggleTask(Number(task.id))} className="button toggle-task-button">
              {task.completed ? "Mark Incomplete" : "Mark Complete"}
            </button>
            <button onClick={() => deleteTask(Number(task.id))} className="button delete-task-button">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToDoList;
