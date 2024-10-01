//content.js

import { createDOMElement } from "./utils";
import { restAppend } from "./utils";
import { createTask } from "./task";
import { createCounter } from "./utils";

export function createMainContent(){

    const mainContent = createDOMElement('div','main-content','')
    const mainContentTop = createDOMElement('div','main-content-top','');
    const mainContentBottom = createDOMElement('div','main-content-bottom','')

    restAppend(mainContent,mainContentTop,mainContentBottom);

    return {
        mainContent,
        mainContentBottom,
        mainContentTop
    };
}

export function renderProjectTasks(project, container) {
    // Golește mainContent pentru a afișa noile taskuri
    container.innerHTML = '';

    const taskList = project.getTaskList();  // Obține lista de taskuri

    taskList.forEach((task,index) => {
        const taskElement = createDOMElement('p', '', task.getName());  // Creează un element <p> pentru fiecare task
        const deleteButton = createDOMElement('button', '' , 'X')

        
        container.appendChild(taskElement);  // Adaugă task-ul în mainContent
        container.appendChild(deleteButton);

        deleteButton.addEventListener('click', function(){
            console.log('test')
            taskList.splice(index,1)
            renderProjectTasks(project,container)
        })

    });
}

export function renderTopContent(project, mainContentTop, mainContentBottom) {
    mainContentTop.innerHTML = '';

    const projectName = project.getName();
    const counter = createCounter();

    const projectNameSection = createDOMElement('div','',projectName);
    const projectButtonSection = createDOMElement('div','','')
    const filterButton = createDOMElement('button','','Filter Tasks');
    const addNewTaskButton = createDOMElement('button','','Add new Task');

    restAppend(mainContentTop, projectNameSection, projectButtonSection);
    restAppend(projectButtonSection,filterButton,addNewTaskButton)

    addNewTaskButton.addEventListener("click", function() {
        if(counter.getCounter() === 0){
        counter.addToCounter();
        const formContainer = createDOMElement('div','','');
        const form = createDOMElement('form','','');

        const nameField = createDOMElement('input','','', { placeholder: 'Task Name' });
        const priorityField = createDOMElement('select', '', '', { name: 'priorityField' });

        const option1 = createDOMElement('option', '', 'Low', { value: 'low' });
        const option2 = createDOMElement('option', '', 'Medium', { value: 'medium' });
        const option3 = createDOMElement('option', '', 'High', { value: 'high' });

        restAppend(priorityField, option1, option2, option3);

        const submitButton = createDOMElement('button', '', 'Add Task', { type: 'submit' });

        restAppend(form, nameField, priorityField, submitButton);
        formContainer.appendChild(form);
        mainContentBottom.insertBefore(formContainer, mainContentBottom.firstChild);

        form.addEventListener('submit', function(event) {
            handleContentForm(event, nameField, priorityField, project, mainContentBottom);
            counter.resetCounter();
        });
    }
    });
}

function handleContentForm(event, nameField, priorityField, project, mainContentBottom) {
    event.preventDefault();

    const taskName = nameField.value;
    const taskPriority = priorityField.value;

    if (!taskName) {
        alert('Task name is required!');
        return;
    }

    const newTask = createTask(taskName, taskPriority, true);
    project.addTask(newTask);

    // Re-render the tasks after adding the new task
    renderProjectTasks(project, mainContentBottom);

    // Optional: Clear the form fields after submit
    nameField.value = '';
    priorityField.value = 'low';  // Set the default priority value after submit
}