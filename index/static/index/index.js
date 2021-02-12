document.addEventListener("DOMContentLoaded", () => {
    const csrf = Cookies.get('csrftoken');
    document.querySelector("#darkTheme").addEventListener("change",function(){
        let theme = this.checked ? "dark" : 'light';
        let view = document.querySelector("#view").checked ? "list" : "grid";
        document.body.dataset.theme = theme;
        localStorage.setItem('theme-color', theme);
        fetch('/update_setting', {
            method: "POST",
            headers: {'X-CSRFToken': csrf},
            body: JSON.stringify({
                theme: theme,
                view: view
            })
        })
    })
    document.querySelector("#view").addEventListener("change", function(){
        let view = this.checked ? "list": "grid"
        let theme = document.querySelector("#view").checked ? "dark": "light";
        fetch('/update_setting', {
            method: "POST",
            headers: {'X-CSRFToken': csrf},
            body: JSON.stringify({
                theme: theme,
                view: view
            })
        })
    })
    document.querySelector("#new-list-btn").addEventListener("click", () => {
        console.log("New list")
    })
    const createNote = e => {
        if(e.target !== document.querySelector("#new-list-btn")){
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
                    if(title.length && note.length){
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
                    document.body.removeEventListener("click", submitNote)
                    newElement.addEventListener('click', createNote)
                }
            }
            document.body.addEventListener("click", submitNote)
            document.querySelector(".input-note-title").focus()
            return;
        }
    }
    document.querySelector(".create-note-preview").addEventListener("click", createNote)
})