document.addEventListener("DOMContentLoaded", () => {
    const csrf = Cookies.get('csrftoken');
    let passCreateNote = false;

    const trackUpdateColorInput = () => {
        document.querySelector("#select-color-input").addEventListener("input", function(){
            document.querySelector(".create-note-box").style.backgroundColor = this.value;
        })
    }

    const addListItem = () => {
        document.querySelectorAll(".add-list-item").forEach(i => {
            i.addEventListener("keydown", e => {
                if((e.keyCode > 47 && e.keyCode < 58) || (e.keyCode > 64 && e.keyCode < 91) || (e.keyCode > 95 && e.keyCode < 112) || (e.keyCode > 185 && e.keyCode < 193)){
                    e.preventDefault();
                    let element = document.createElement("div");
                    element.classList.add('checkbox-item');
                    let randomId = Math.random().toString(36).substring(7)
                    let anotherRandomId = Math.random().toString(36).substring(7)
                    element.innerHTML = `<input type ="checkbox" id="${randomId}" onclick="return false;"><label for="${randomId}"><input type="text" placeholder="Your item" class="input-animate" id="${anotherRandomId}"><span class="delete-task" title="delete element">&times;</span></label>`
                    i.parentNode.parentNode.insertBefore(element, i.parentNode)
                    let inputItem = document.getElementById(anotherRandomId)
                    inputItem.focus()
                    inputItem.value = e.key;
                    element.querySelector(".delete-task").addEventListener('click', () => {
                        element.parentNode.removeChild(element)
                    })
                }
            })
        })
    }
    
    const closeCheckbox = e => {
        let el = e.target;
        let taskElements = el.parentNode.querySelectorAll(".checkbox-item");
        var tasks = [];
        taskElements.forEach(taskEl => {
            taskEl.querySelector(`input[type="text"]`).value? tasks.push(taskEl.querySelector(`input[type="text"]`).value):null;
            taskEl.parentNode.removeChild(taskEl)
        })
        const notes = tasks.join('\n\n');
        let noteElement = document.createElement('textarea');
        noteElement.classList.add('input-note-text');
        noteElement.classList.add('textarea-auto-adjust');
        noteElement.placeholder = "Take a note...";
        noteElement.addEventListener("input", () => {
            noteElement.style.height = "5px";
            noteElement.style.height = noteElement.scrollHeight + 'px';
        })
        el.parentNode.insertBefore(noteElement, el.parentNode.children[1])
        noteElement.focus();
        noteElement.value = notes;

        el.id = "show-checkbox";
        el.title = "Show checkboxes"
        el.removeEventListener('click', closeCheckbox)
        el.addEventListener("click", showCheckbox)
    }

    const showCheckbox = e => {
        let checkbox = e.target;
        let inputNoteElement = document.querySelector(".input-note-text")
        let tasks = inputNoteElement.value.split('\n').filter(el => el !== "");
        tasks.forEach(task => {
            let taskElement = document.createElement('div');
            taskElement.classList.add('checkbox-item');
            let randomId = Math.random().toString(36).substring(7);
            taskElement.innerHTML = `<input type ="checkbox" id="${randomId}" onclick="return false;"><label for="${randomId}"><input type="text" placeholder="Your item" class="input-animate" value="${task}"><span class="delete-task" title="delete element">&times;</span></label>`;
            taskElement.querySelector(".delete-task").addEventListener('click', () => {
                taskElement.parentNode.removeChild(taskElement)
            })
            inputNoteElement.parentNode.insertBefore(taskElement ,inputNoteElement)
        })
        let inputNewTaskElement = document.createElement('div');
        inputNewTaskElement.classList.add('checkbox-item');
        inputNewTaskElement.innerHTML = `<input type = "text" placeholder="Add list item" class="input-animate add-list-item">`;
        inputNoteElement.parentNode.insertBefore(inputNewTaskElement, inputNoteElement);
        if(!tasks.length) document.querySelector(".add-list-item").focus();
        addListItem()

        inputNoteElement.parentNode.removeChild(inputNoteElement)
        checkbox.id = "hide-checkbox";
        checkbox.title = "Hide checkboxes"
        checkbox.removeEventListener('click', showCheckbox)
        checkbox.addEventListener("click", closeCheckbox)
    }

    const taskEventListener = checkboxes => {
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener("change", function(){
                if(this.checked){
                    fetch('/check_task', {
                        method: "POST",
                        headers: {'X-CSRFToken': csrf},
                        body: JSON.stringify({
                            "pk": checkbox.dataset.pk
                        })
                    })
                }else{
                    fetch('/uncheck_task', {
                        method: "POST",
                        headers: {'X-CSRFToken': csrf},
                        body: JSON.stringify({
                            "pk": checkbox.dataset.pk
                        })
                    })
                }
            })
        })
    }

    const addNewListEvent = () => {
        document.querySelector("#new-list-btn").addEventListener("click", () => {
            let element = document.createElement('div');
            element.classList.add('form-group');
            element.classList.add('float-left');
            element.innerHTML = `<div class="create-note-box">
            <input type="text" class="input-animate input-note-title" placeholder="Title">
            <div class="checkbox-item">
                <input type = "text" placeholder="Add list item" class="input-animate add-list-item">
            </div>
            <div class="input-color-option">
                <img src = "/static/Icon/paint.png" class="create-note-option" title="Change color">
                <div class="select-color theme-adjust">
                    <span class="select-color-text">Color</span>
                    <input type="color" value = "#202124" id="select-color-input"></input>
                </div>
            </div>
            <img src = "/static/Icon/todo.png" class="create-note-option" title = "Hide checkboxes" id="hide-checkbox">
            </div>`;
            document.querySelector(".create-note-preview").replaceWith(element);
            document.querySelector(".add-list-item").focus();
            addListItem();
            trackUpdateColorInput();
            element.querySelector('#hide-checkbox').addEventListener("click", closeCheckbox)
            const submitNote = event => {
                if(!element.contains(event.target) && document.body.contains(event.target) || event.target.className === "form-group float-left"){
                    let title = document.querySelector(".input-note-title").value;
                    let note = document.querySelector(".input-note-text")? document.querySelector(".input-note-text").value : "";
                    let color = document.querySelector("#select-color-input").value
                    let tasks = []
                    element.querySelectorAll(".checkbox-item").forEach(checkbox => {
                        if(checkbox.querySelector(`input[type="text"]`).value.length) tasks.push(checkbox.querySelector(`input[type="text"]`).value)
                    })
                    if(title.length || tasks.length || note.length){
                        fetch('/create_note', {
                            method: "POST",
                            headers: {'X-CSRFToken': csrf},
                            body: JSON.stringify({
                                title: title,
                                note: note,
                                color: color,
                                tasks: tasks
                            })
                        })
                        .then(response => response.json())
                        .then(result =>{
                            if(result["message"] === "Success"){
                                let noteElement = document.createElement('div');
                                document.querySelector(".notes-grid")? noteElement.setAttribute('class', 'note-box m-2'): noteElement.setAttribute("class", "list-note-box")
                                noteElement.setAttribute("draggable", 'true');
                                noteElement.id = `note-${result["pk"]}`;
                                noteElement.style.backgroundColor = color;
                                let tasks = "";
                                if(result["tasks"]){
                                    JSON.parse(result["tasks"]).forEach(task => {
                                        tasks += `<div>
                                            <input type="checkbox" name="${task.pk}" id="task-${task.pk}" class="task" data-pk="${task.pk}">
                                            <label for="task-${task.pk}">${task.fields.todo}</label>
                                        </div>`
                                    })
                                }
                                noteElement.innerHTML = `<div class="box">
                                <h5 class="note-box-title">${title}</h5>
                                ${ note.length ?`
                                <p class="note-box-text">${note}</p>`:`
                                ${tasks}
                                `}
                                <div class="note-option">
                                    <img src="/static/Icon/trash.png" alt="Delete note" id="delete-note-btn" data-pk="${result["pk"]}" title="Delete">
                                </div>
                                </div>`;
                                taskEventListener(noteElement.querySelectorAll(".task"))
                                if(document.querySelector(".notes-grid"))document.querySelector(".notes-grid").insertBefore(noteElement, document.querySelector(".notes-grid").firstChild)
                                else document.querySelector(".notes").insertBefore(noteElement, document.querySelector(".notes").firstChild)
                                noteElement.querySelector(`#delete-note-btn`).addEventListener("click", () => {
                                    fetch('/delete_note', {
                                        method: "POST",
                                        headers: {'X-CSRFToken': csrf},
                                        body: JSON.stringify({
                                            "pk": result["pk"]
                                        })
                                    })
                                    .then(response => response.json())
                                    .then(result => {
                                        if(result["message"] === "Success"){
                                            noteElement.parentNode.removeChild(noteElement)
                                        }
                                    })
                                })
                            }
                        })
                    }
                    let newElement = document.createElement("div");
                    newElement.classList.add("form-group")
                    newElement.classList.add("create-note-preview")
                    newElement.classList.add("float-left")
                    newElement.innerHTML = `<div class="create-note-box"><input type="text" class="create-note-input" placeholder="Take a note..."><img src="/static/Icon/todo.png" alt="New list icon" title="New list" id="new-list-btn"></div>`;
                    element.replaceWith(newElement)
                    document.body.removeEventListener("click", submitNote)
                    newElement.addEventListener('click', createNote)
                    addNewListEvent()
                }
            }
            document.body.addEventListener("click", submitNote)
            passCreateNote = true
        })
    }
    addNewListEvent()
    const createNote = e => {
        if(e.target !== document.querySelector("#new-list-btn") && !passCreateNote){
            let element = document.createElement('div');
            element.classList.add('form-group');
            element.classList.add('float-left');
            element.innerHTML = `<div class="create-note-box">
            <input type="text" class="input-animate input-note-title" placeholder="Title">
            <textarea class="input-note-text textarea-auto-adjust" placeholder="Take a note..."></textarea>
            <div class="input-color-option">
                <img src = "/static/Icon/paint.png" class="create-note-option" title="Change color">
                <div class="select-color theme-adjust">
                    <span class="select-color-text">Color</span>
                    <input type="color" value = "#202124" id="select-color-input"></input>
                </div>
            </div>
            <img src = "/static/Icon/todo.png" class="create-note-option" title = "Show checkboxes" id="show-checkbox">
            </div>`;
            document.querySelector(".create-note-preview").replaceWith(element);
            document.querySelectorAll(".textarea-auto-adjust").forEach(textarea => {
                textarea.addEventListener("input", () => {
                    textarea.style.height = "5px";
                    textarea.style.height = textarea.scrollHeight + 'px';
                })
            })
            trackUpdateColorInput();
            element.querySelector("#show-checkbox").addEventListener("click", showCheckbox)
            const submitNote = event => {
                if(!element.contains(event.target) && document.body.contains(event.target) || event.target.className === "form-group float-left"){
                    let title = document.querySelector(".input-note-title").value;
                    let note = document.querySelector(".input-note-text")? document.querySelector(".input-note-text").value : "";
                    let tasks = []
                    let color = document.querySelector("#select-color-input").value
                    element.querySelectorAll(".checkbox-item").forEach(checkbox => {
                        if(checkbox.querySelector(`input[type="text"]`).value.length) tasks.push(checkbox.querySelector(`input[type="text"]`).value)
                    })
                    if(title.length || note.length || tasks.length){
                        fetch('/create_note', {
                            method: "POST",
                            headers: {'X-CSRFToken': csrf},
                            body: JSON.stringify({
                                title: title,
                                note: note,
                                color: color,
                                tasks: tasks
                            })
                        })
                        .then(response => response.json())
                        .then(result =>{
                            if(result["message"] === "Success"){
                                let noteElement = document.createElement('div');
                                document.querySelector(".notes-grid")? noteElement.setAttribute('class', 'note-box m-2'): noteElement.setAttribute("class", "list-note-box")
                                noteElement.setAttribute("draggable", 'true');
                                noteElement.id = `note-${result["pk"]}`;
                                noteElement.style.backgroundColor = color;
                                let tasks = "";
                                if(result["tasks"]){
                                    JSON.parse(result["tasks"]).forEach(task => {
                                        tasks += `<div>
                                            <input type="checkbox" name="${task.pk}" id="task-${task.pk}" class="task" data-pk="${task.pk}">
                                            <label for="task-${task.pk}">${task.fields.todo}</label>
                                        </div>`
                                    })
                                }
                                noteElement.innerHTML = `<div class="box">
                                <h5 class="note-box-title">${title}</h5>
                                ${ note.length ?`
                                <p class="note-box-text">${note}</p>`:`
                                ${tasks}
                                `}
                                <div class="note-option">
                                    <img src="/static/Icon/trash.png" alt="Delete note" id="delete-note-btn" data-pk="${result["pk"]}" title="Delete">
                                </div>
                                </div>`;
                                taskEventListener(noteElement.querySelectorAll(".task"))
                                if(document.querySelector(".notes-grid"))document.querySelector(".notes-grid").insertBefore(noteElement, document.querySelector(".notes-grid").firstChild)
                                else document.querySelector(".notes").insertBefore(noteElement, document.querySelector(".notes").firstChild)
                                noteElement.querySelector("#delete-note-btn").addEventListener("click", () => {
                                    fetch('/delete_note', {
                                        method: "POST",
                                        headers: {'X-CSRFToken': csrf},
                                        body: JSON.stringify({
                                            "pk": result["pk"]
                                        })
                                    })
                                    .then(response => response.json())
                                    .then(result => {
                                        if(result["message"] === "Success"){
                                            noteElement.parentNode.removeChild(noteElement)
                                        }
                                    })
                                })
                            }
                        })
                    }
                    let newElement = document.createElement("div");
                    newElement.classList.add("form-group")
                    newElement.classList.add("create-note-preview")
                    newElement.classList.add("float-left")
                    newElement.innerHTML = `<div class="create-note-box"><input type="text" class="create-note-input" placeholder="Take a note..."><img src="/static/Icon/todo.png" alt="New list icon" title="New list" id="new-list-btn"></div>`;
                    element.replaceWith(newElement)
                    addNewListEvent()
                    document.body.removeEventListener("click", submitNote)
                    newElement.addEventListener('click', createNote)
                }
            }
            document.body.addEventListener("click", submitNote)
            document.querySelector(".input-note-title").focus()
            return;
        }
        passCreateNote = false
    }
    document.querySelector(".create-note-preview").addEventListener("click", createNote)
    document.querySelectorAll("#delete-note-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            fetch('/delete_note', {
                method: "POST",
                headers: {'X-CSRFToken': csrf},
                body: JSON.stringify({
                    "pk": btn.dataset.pk
                })
            })
            .then(response => response.json())
            .then(result => {
                if(result["message"] === "Success"){
                    let noteElement = document.querySelector(`#note-${btn.dataset.pk}`);
                    noteElement.parentNode.removeChild(noteElement);
                }
            })
        })
    })
    taskEventListener(document.querySelectorAll(".task"))
})