
const taskInput = document.getElementById("task-input");
const addTask = document.getElementById("add-task");
const exportTask = document.getElementById("export-task");
const taskList = document.getElementById("task-list");
const progressBar = document.getElementById("progress");
const number = document.getElementById("numbers");

//This line sets up an event listener to trigger the loadTasks() function as soon as the HTML document has been fully loaded. It ensures that the tasks are loaded from localStorage when the page is opened.

document.addEventListener("DOMContentLoaded", loadTasks);

addTask.addEventListener("click", function() {
    let taskText = taskInput.value.trim(); 
    if (taskText !== "") {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
   
        let newTask = {
            text: taskText, 
            timeStamp: new Date().toISOString(), 
        };

        tasks.push(newTask);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        displayTask();
        taskInput.value = "";
        updateStats()
    }else {
        alert("Task cannot be empty")
    }
});

function loadTasks() {
    displayTask();
}

function displayTask() {
    taskList.innerHTML = "";
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach(task => {
        if (task.completed === undefined) {
            task.completed = false;  
        }
    });

    tasks.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));

    tasks.forEach(addTaskToList);
}

function addTaskToList(task) {
    let li = document.createElement("li");

    if (task.completed) {

        li.style.color = "green";
       
    }

    li.innerHTML = `
        <strong> ${task.text}</strong> <br> 
        <small> ${formatDate(task.timeStamp)}</small>
    `;

    let completeTaskButton = document.createElement("button");
    completeTaskButton.innerHTML = "✔️";
    completeTaskButton.addEventListener("click", function() {
        completeTask(task.text);
    });

    let deleteTaskButton = document.createElement("button");
    deleteTaskButton.innerHTML = "❌";
    deleteTaskButton.addEventListener("click", function() {
        deleteTask(task.text); 
    });

    li.appendChild(completeTaskButton);
    li.appendChild(deleteTaskButton);
    taskList.appendChild(li);
}

function deleteTask(taskText) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks = tasks.filter((task) => task.text !== taskText);

    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTask();
    updateStats ()
}

function completeTask(taskText) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.map((task) => {
        if (task.text === taskText) {
            task.completed = true;  
        }
        return task;
        
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTask();
    updateStats();
}

function formatDate(timeStamp) {
    let date = new Date(timeStamp);
    return date.toLocaleString();
}

function updateStats (){
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const completedTask = tasks.filter((task) => task.completed).length;

    const totalTasks = tasks.length;

    const progress =(completedTask / totalTasks) * 100;

    progressBar.style.width = `${progress}%`;

    number.innerText = `${completedTask} / ${totalTasks}`;

}


