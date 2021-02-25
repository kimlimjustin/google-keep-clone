document.addEventListener("DOMContentLoaded", () => {
    const csrf = Cookies.get('csrftoken');
    document.querySelectorAll("#permanent-delete-note-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            fetch('/delete_permanent',{
                method: "POST",
                headers: {'X-CSRFToken': csrf},
                body: JSON.stringify({
                    "pk": btn.dataset.pk
                })
            })
            .then(response => response.json())
            .then(result => {
                if(result["message"] === "Success"){
                    let noteElement = document.querySelector(`#note-${btn.dataset.pk}`)
                    noteElement.parentNode.removeChild(noteElement)
                }
            })
        })
    })
    document.querySelectorAll("#restore-note-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            fetch('/restore_note', {
                method: "POST",
                headers: {'X-CSRFToken': csrf},
                body: JSON.stringify({
                    "pk": btn.dataset.pk
                })
            })
            .then(response => response.json())
            .then(result => {
                if(result["message"] === "Success"){
                    let noteElement = document.querySelector(`#note-${btn.dataset.pk}`)
                    noteElement.parentNode.removeChild(noteElement)
                }
            })
        })
    })
})