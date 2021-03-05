document.addEventListener("DOMContentLoaded", () => {
    const csrf = Cookies.get('csrftoken');
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
    document.querySelectorAll("#unarchive-note-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            fetch('/unarchive', {
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
})