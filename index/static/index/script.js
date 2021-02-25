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
        let theme = document.querySelector("#darkTheme").checked ? "dark": "light";
        fetch('/update_setting', {
            method: "POST",
            headers: {'X-CSRFToken': csrf},
            body: JSON.stringify({
                theme: theme,
                view: view
            })
        })
        if(document.querySelector(".notes")){
            if(this.checked && document.querySelector(".notes-grid")){
                document.querySelectorAll(".note-box").forEach(note => {
                    let newElement = document.createElement("div")
                    newElement.innerHTML = note.innerHTML;
                    newElement.classList.add('list-note-box');
                    newElement.setAttribute('draggable', true);
                    newElement.style.backgroundColor = note.style.backgroundColor;
                    document.querySelector(".notes").appendChild(newElement);
                })
                document.querySelector(".notes-grid").parentNode.removeChild(document.querySelector(".notes-grid"))
            }else if(document.querySelectorAll(".list-note-box").length){
                let gridElement = document.createElement("div");
                gridElement.classList.add('notes-grid');
                document.querySelector(".notes").appendChild(gridElement);
                document.querySelectorAll(".list-note-box").forEach(note => {
                    let newElement = document.createElement("div");
                    newElement.innerHTML = note.innerHTML;
                    newElement.setAttribute('class', 'note-box m-2')
                    newElement.setAttribute('draggable', true);
                    newElement.style.backgroundColor = note.style.backgroundColor;
                    gridElement.appendChild(newElement);
                    note.parentNode.removeChild(note)
                })
            }
        }
    })
})