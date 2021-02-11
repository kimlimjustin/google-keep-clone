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
    document.querySelector(".create-note-preview").addEventListener("click", e => {
        if(e.target !== document.querySelector("#new-list-btn")){
            let element = document.createElement('div');
            element.classList.add('form-group');
            element.classList.add('float-left');
            element.innerHTML = `<div class="create-note-box"><input type="text" class="input-animate input-note-title" placeholder="Title"><textarea class="input-note-text textarea-auto-adjust" placeholder="Take a note..."></textarea></div>`;
            document.querySelector(".create-note-preview").replaceWith(element)
            document.body.addEventListener("click", event => {
                if(!element.contains(event.target) && document.body.contains(event.target)){
                    fetch('/create_note', {
                        method: "POST",
                        headers: {'X-CSRFToken': csrf},
                        body: JSON.stringify({
                            title: document.querySelector(".input-note-title").value,
                            note: document.querySelector(".input-note-text").value
                        })
                    })
                    .then(response => response.json())
                    .then(result =>{
                        console.log(result)
                        let newElement = document.createElement("div");
                        newElement.classList.add("form-group")
                        newElement.classList.add("create-note-preview")
                        newElement.classList.add("float-left")
                        newElement.innerHTML = `<div class="create-note-box"><input type="text" class="create-note-input" placeholder="Take a note..."><img src="/static/Icon/todo.png" alt="New list icon" title="New list" id="new-list-btn"></div>`;
                        element.replaceWith(newElement)
                    })
                }
            })
            document.querySelector(".input-note-title").focus()
        }
    })
})