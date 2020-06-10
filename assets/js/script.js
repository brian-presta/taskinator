var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0;
var pageContentE1 = document.querySelector("#page-content")

var taskFormHandler = function(event) {
    event.preventDefault()
    var taskNameInput = document.querySelector("input[name='task-name']").value
    var taskTypeInput = document.querySelector("select[name='task-type']").value
    if (!taskTypeInput) {
        taskTypeInput = 'Web'
    }
    var taskDataObj = {
        name:taskNameInput,
        type:taskTypeInput
    }
    if (!taskNameInput) {
        return
    }
    formEl.reset()
    createTaskE1(taskDataObj)
};
var createTaskE1 = function(taskDataObj) {
    // create list item
    var listItemEl = document.createElement("li")
    listItemEl.className = "task-item"
    // assign id
    listItemEl.setAttribute("data-task-id",taskIdCounter)
    // create div wrapper 
    var taskInfoE1 = document.createElement("div")
    taskInfoE1.className = "task-info"
    // insert HTML into div
    taskInfoE1.innerHTML = '<h3 class="task-name">'+taskDataObj.name+'</h3><span class="task-type">'+taskDataObj.type+'</span>'
    listItemEl.appendChild(taskInfoE1)
    var taskActionsE1 = createTaskActions(taskIdCounter)
    listItemEl.appendChild(taskActionsE1)
    tasksToDoEl.appendChild(listItemEl)
    taskIdCounter++
}
var createTaskActions = function(taskId) {
    var actionContainerE1 = document.createElement("div")
    actionContainerE1.className = 'task-actions'
    var editButtonE1 = document.createElement('button')
    editButtonE1.textContent = 'Edit'
    editButtonE1.className = 'btn edit-btn'
    editButtonE1.setAttribute("data-task-id",taskId)

    actionContainerE1.appendChild(editButtonE1)

    var deleteButtonE1 = document.createElement('button')
    deleteButtonE1.textContent = 'Delete'
    deleteButtonE1.className = 'btn delete-btn'
    deleteButtonE1.setAttribute("data-task-id",taskId)

    actionContainerE1.appendChild(deleteButtonE1)

    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);
    actionContainerE1.appendChild(statusSelectEl)
    var statusChoices = ["To Do","In Progress","Completed"]
    for (x in statusChoices) {
        var statusOptionE1 = document.createElement('option')
        statusOptionE1.textContent = statusChoices[x]
        statusOptionE1.setAttribute("value",statusChoices[x])
        statusSelectEl.appendChild(statusOptionE1)
    }


    

    return actionContainerE1
};
var taskButtonHandler = function(event) {
    
    if (event.target.matches(".delete-btn")){
            var taskId = event.target.getAttribute("data-task-id")
            deleteTask(taskId)
    }
}
var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='"+taskId+"']")
    taskSelected.remove()
}
formEl.addEventListener("submit",taskFormHandler);
pageContentE1.addEventListener("click", taskButtonHandler);