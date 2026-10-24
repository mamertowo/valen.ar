const url = new URL(document.location.href);
const expected_day_number = parseInt(url.searchParams.get("dia"));

fetch("/api/matle/" + (expected_day_number || ""))
    .then(response => response.json()
        .then(day => {
            url.searchParams.set("dia", day.day_number);
            window.history.replaceState(null, "", url);
            console.log(day);
        }));

const form = document.getElementById('respuesta-form');

form.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    alert(
        data.respuesta == 2
        ? "Bien!"
        : "Mal!"
    );
})
