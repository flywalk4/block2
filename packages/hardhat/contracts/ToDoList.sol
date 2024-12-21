//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";

contract ToDoList {
    struct Task {
        uint id;
        string description;
        bool completed;
    }

    // Хранение списка задач для каждого пользователя
    mapping(address => Task[]) public tasks;

    // Функция добавления новой задачи
    function addTask(string calldata _description) external {
        tasks[msg.sender].push(Task(tasks[msg.sender].length, _description, false));
    }

    // Функция переключения статуса выполнения задачи
    function toggleTaskCompletion(uint _taskId) external {
        require(_taskId < tasks[msg.sender].length, "Task does not exist"); // Проверка, существует ли задача
        tasks[msg.sender][_taskId].completed = !tasks[msg.sender][_taskId].completed; // Переключение статуса
    }

    // Функция удаления задачи
    function deleteTask(uint _taskId) external {
        require(_taskId < tasks[msg.sender].length, "Task does not exist"); // Проверка, существует ли задача
        uint lastIndex = tasks[msg.sender].length - 1; // Индекс последней задачи 
        require(lastIndex >= _taskId, "Invalid taskId"); // Проверка валидности идентификатора задачи

        tasks[msg.sender][_taskId] = tasks[msg.sender][lastIndex]; // Замена удаляемой задачи последней
        tasks[msg.sender].pop(); // Удаление последней задачи
    }

    // Функция получения всех задач пользователя
    function getTasks() external view returns (Task[] memory) {
        return tasks[msg.sender]; // Возвращает массив задач для вызывающего пользователя
    }
}
