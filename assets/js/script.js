var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var taskIdCounter = 0;
var pageContentE1 = document.querySelector("#page-content")
var tasks = []

var findTask = function(taskId){
     return document.querySelector(".task-item[data-task-id='" + taskId + "']")
}
var taskFormHandler = function(event) {
    event.preventDefault()
    var taskNameInput = document.querySelector("input[name='task-name']").value
    var taskTypeInput = document.querySelector("select[name='task-type']").value
    if (!taskTypeInput) {
        taskTypeInput = 'Web'
    }
    var taskId = formEl.getAttribute('data-task-id')
    if (taskId){
        completeEditTask(taskNameInput,taskTypeInput,taskId)
        return
    }
    var taskDataObj = {
        name:taskNameInput,
        type:taskTypeInput,
        status: "to do"
    }
    if (!taskNameInput) {
        return
    }
    formEl.reset()
    createTaskE1(taskDataObj)
};
var completeEditTask = function(taskName,taskType,taskId){
    var taskSelected = findTask(taskId)
    taskSelected.querySelector('h3').textContent = taskName
    taskSelected.querySelector('span').textContent = taskType
    for (x in tasks) {
        if (tasks[x].id == taskId) {
            tasks[x].name = taskName
            tasks[x].type = taskType
            break
        }
    }
    formEl.removeAttribute("data-task-id")
    formEl.querySelector("button").textContent = "Add Task"
    saveTasks()
}
var createTaskE1 = function(taskDataObj) {
    // create list item
    var listItemEl = document.createElement("li")
    listItemEl.className = "task-item"
    listItemEl.draggable = true
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
    taskDataObj.id = taskIdCounter
    tasks.push(taskDataObj)
    taskIdCounter++
    saveTasks()
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
    var target = event.target 
    var taskId = target.getAttribute("data-task-id")
    if (target.matches(".delete-btn")){
            deleteTask(taskId)
    }
    if (target.matches(".edit-btn")){
        editTask(taskId)
    }
}
var deleteTask = function(taskId) {
    var taskSelected = findTask(taskId)
    taskSelected.remove()
    for (x in tasks) {
        if (tasks[x].id == taskId) {
            tasks.splice(parseInt(x),1)
            break
        }
    }
    saveTasks()
}
var editTask = function(taskId){
    var taskSelected = findTask(taskId)
    var taskName = taskSelected.querySelector("h3.task-name").textContent
    var taskType = taskSelected.querySelector("span").textContent
    document.querySelector("input[name='task-name']").value = taskName
    document.querySelector("select[name='task-type']").value = taskType
    document.querySelector("#save-task").textContent = "Save Task";
    formEl.setAttribute("data-task-id",taskId)
}
var taskStatusChangeHandler = function(event){
    var target = event.target
    var taskId = target.getAttribute("data-task-id")
    var statusValue = target.value.toLowerCase()
    var taskSelected = findTask(taskId)

    if (statusValue === 'to do') {
        tasksToDoEl.appendChild(taskSelected)
    }
    else if (statusValue === 'in progress') {
        tasksInProgressEl.appendChild(taskSelected)
    }
    else if (statusValue === 'completed') {
    tasksCompletedEl.appendChild(taskSelected)
    }
    for (x in tasks) {
        if (tasks[x].id == taskId) {
            tasks[x].status = statusValue
            break
        }
    }
    saveTasks()
}
var dragTaskHandler = function(event) {
    var taskId = event.target.getAttribute("data-task-id")
    event.dataTransfer.setData("text/plain",taskId)
    // console.log(event.dataTransfer.getData("text/plain"))
}
var dropZoneDragHandler = function(event){
    taskListEl = event.target.closest(".task-list")
    if (taskListEl) {
        taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;")
        event.preventDefault()
        
    }
}
var dropTaskHandler = function(event) {
    taskId = event.dataTransfer.getData("text/plain")
    dropZone = event.target.closest(".task-list")
    draggedItem = findTask(taskId)
    dropZone.removeAttribute('style')
    event.target.appendChild(draggedItem)
    var status = draggedItem.querySelector("select")
    if (dropZone.id === 'tasks-to-do'){
        status.selectedIndex = 0
    }
    if (dropZone.id === 'tasks-in-progress'){
        status.selectedIndex = 1
    }
    if (dropZone.id === 'tasks-completed'){
        status.selectedIndex = 2
    }
    for (x in tasks) {
        if (tasks[x].id == taskId){
            tasks[x].status = status[status.selectedIndex].value.toLowerCase()
            break
        }
    }
    saveTasks()
}
var dragLeaveHandler = function() {
    taskListEl = event.target.closest(".task-list")
    if(taskListEl){
        taskListEl.removeAttribute("style")
    }
}
var saveTasks = function() {
    localStorage.setItem("tasks",JSON.stringify(tasks))
}
var loadTasks = function() {
    if (!localStorage.getItem("tasks")){
        return false
    }
    tasks = JSON.parse(localStorage.getItem("tasks"))
    for (x in tasks){
        tasks[x].id = taskIdCounter
        var taskDataObj = tasks[x]
        var listItemEl = document.createElement("li")
        listItemEl.className = "task-item"
        listItemEl.draggable = true
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
        switch (taskDataObj.status){
            case 'to do':
                tasksToDoEl.appendChild(listItemEl)
                listItemEl.querySelector("select[name='status-change']").selectedIndex = 0
                break
            case 'in progress':
                tasksInProgressEl.appendChild(listItemEl)
                listItemEl.querySelector("select[name='status-change']").selectedIndex = 1
                break
            case 'completed':
                tasksCompletedEl.appendChild(listItemEl)
                listItemEl.querySelector("select[name='status-change']").selectedIndex = 2
                break
        }
        taskIdCounter++
    }
}
formEl.addEventListener("submit",taskFormHandler);
pageContentE1.addEventListener("click", taskButtonHandler)
pageContentE1.addEventListener("change",taskStatusChangeHandler)
pageContentE1.addEventListener("dragstart",dragTaskHandler)
pageContentE1.addEventListener("dragover",dropZoneDragHandler)
pageContentE1.addEventListener("drop",dropTaskHandler)
pageContentE1.addEventListener("dragleave",dragLeaveHandler)
loadTasks()