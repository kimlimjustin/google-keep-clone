document.addEventListener("DOMContentLoaded", () => {
    const csrf = Cookies.get('csrftoken');
    let passCreateNote = false;

    const addListItem = () => {
        document.querySelectorAll(".add-list-item").forEach(i => {
            i.addEventListener("keydown", e => {
                if((e.keyCode > 47 && e.keyCode < 58) || (e.keyCode > 64 && e.keyCode < 91) || (e.keyCode > 95 && e.keyCode < 112) || (e.keyCode > 185 && e.keyCode < 193)){
                    e.preventDefault();
                    let element = document.createElement("div");
                    element.classList.add('checkbox-item');
                    let randomId = Math.random().toString(36).substring(7)
                    let anotherRandomId = Math.random().toString(36).substring(7)
                    element.innerHTML = `<input type ="checkbox" id="${randomId}" onclick="return false;"><label for="${randomId}"><input type="text" placeholder="Your item" class="input-animate" id="${anotherRandomId}"></label>`
                    i.parentNode.insertBefore(element, i)
                    let inputItem = document.getElementById(anotherRandomId)
                    inputItem.focus()
                    inputItem.value = e.key;
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
            <img src = "/static/Icon/todo.png" class="create-note-option" title = "Hide checkboxes">
            </div>`;
            document.querySelector(".create-note-preview").replaceWith(element);
            document.querySelector(".add-list-item").focus();
            addListItem();
            const submitNote = event => {
                if(!element.contains(event.target) && document.body.contains(event.target)){
                    let title = document.querySelector(".input-note-title").value;
                    if(title.length){
                        fetch('/create_note', {
                            method: "POST",
                            headers: {'X-CSRFToken': csrf},
                            body: JSON.stringify({
                                title: title,
                                note: "",
                                color: document.querySelector("#select-color-input").value
                            })
                        })
                        .then(response => response.json())
                        .then(result =>{
                            console.log(result)
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
            <img src = "/static/Icon/todo.png" class="create-note-option" title = "Show checkboxes">
            </div>`;
            document.querySelector(".create-note-preview").replaceWith(element);
            document.querySelectorAll(".textarea-auto-adjust").forEach(textarea => {
                textarea.addEventListener("input", () => {
                    textarea.style.height = "5px";
                    textarea.style.height = textarea.scrollHeight + 'px';
                })
            })
            const submitNote = event => {
                if(!element.contains(event.target) && document.body.contains(event.target)){
                    let title = document.querySelector(".input-note-title").value;
                    let note = document.querySelector(".input-note-text").value;
                    if(title.length || note.length){
                        fetch('/create_note', {
                            method: "POST",
                            headers: {'X-CSRFToken': csrf},
                            body: JSON.stringify({
                                title: title,
                                note: note,
                                color: document.querySelector("#select-color-input").value
                            })
                        })
                        .then(response => response.json())
                        .then(result =>{
                            console.log(result)
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
})