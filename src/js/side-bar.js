//side-bar.js


import { createDOMElement } from "./utils";
import { renderProjectTasks } from "./content";
import { createCounter } from "./utils";
import { restAppend } from "./utils";
import { createProject } from "./project";
import { createMainContent, renderTopContent } from "./content";
import { arrayCounter } from "./utils";

export function createSidebar(mainContentBottom, mainContentTop) {
    const projects = [];  
    const counter = createCounter();
    const sideBar = createDOMElement('div', 'side-bar', '');
    const sideBarTop = createDOMElement('div', 'side-bar-top', '');
    const sideBarBottom = createDOMElement('div', 'side-bar-bottom', '');

    restAppend(sideBar, sideBarTop, sideBarBottom);

    const sideBarTitle = createDOMElement('h1', '', 'Projects:');
    const addNewProjectButton = createDOMElement('button', '', 'New Project');

    restAppend(sideBarTop, sideBarTitle, addNewProjectButton);

    addNewProjectButton.addEventListener('click', function() {
        if (counter.getCounter() === 0) {
            counter.addToCounter();

            const formContainer = createDOMElement('div', '', '');
            const form = createDOMElement('form', '', '');

            const nameField = createDOMElement('input', '', '', { type: 'text', name: 'nameField' });
            const submitButton = createDOMElement('button', '', 'Add', { type: 'submit' });
            const favoriteField = createDOMElement('input', '', '', { type: 'checkbox', name: 'favoriteField' });

            restAppend(form, nameField, favoriteField, submitButton);
            formContainer.appendChild(form);
            sideBarBottom.insertBefore(formContainer,sideBarBottom.firstChild);

            form.addEventListener('submit', function(event) {
                handleProjectFormSubmit(event, nameField, favoriteField, counter, projects, sideBarBottom, mainContentBottom, mainContentTop);
            });
        }
    });

    return sideBar;
}

function handleProjectFormSubmit(event, nameField, favoriteField, counter, projects, sideBarBottom, mainContentBottom, mainContentTop) {
    event.preventDefault();

    const projectName = nameField.value;
    const projectFavorite = favoriteField.checked;

    if (projectName) {
        const newProject = createProject(projectName, projectFavorite);
        projects.push(newProject);

        
        renderProjects(projects, sideBarBottom, mainContentBottom, mainContentTop);
    }

    counter.resetCounter();
}

function renderProjects(projects, sideBarBottom, mainContentBottom, mainContentTop) {
    
    sideBarBottom.innerHTML = '';

    projects.forEach((project,index) => {
        const projectContainer = createDOMElement('div', '', '');
        const projectTitle = createDOMElement('h1', '', project.getName());
        const deleteButton = createDOMElement('button','','X')

        restAppend(projectContainer, projectTitle,deleteButton);
        sideBarBottom.appendChild(projectContainer);

        
        projectTitle.addEventListener('click', function() {
            renderProjectTasks(project, mainContentBottom);
            renderTopContent(project, mainContentTop, mainContentBottom);
        });

        deleteButton.addEventListener('click',function(){
            mainContentTop.innerHTML = '';
            mainContentBottom.innerHTML = '';
            projects.splice(index, 1);
            renderProjects(projects, sideBarBottom, mainContentBottom, mainContentTop);
        })
    });
}
