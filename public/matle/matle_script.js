const params = new URLSearchParams(document.location.search);
const day = parseInt(params.get("dia"));

const form = document.getElementById('respuesta-form');

form.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    alert(
        data.respuesta == 2
        ? "Bien!"
        : "Mal!"
    )
})
