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
})