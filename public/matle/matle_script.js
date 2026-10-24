const API_URL = "https://valen.ar/api/";

const url = new URL(document.location.href);
const expectedDayNumber = parseInt(url.searchParams.get("dia"));

const questionTextElement = document.getElementById("consigna-text");
const questionImageElement = document.getElementById("consigna-image");
const tipElement = document.getElementById("tip");

const answerFormElement = document.getElementById('respuesta-form');

function fillAndUnhide(element, content) {
    element.innerHTML = content;
    element.classList.remove("hidden");
}

function setAnswer(answer) {
    answerFormElement.addEventListener('submit', event => {
        event.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        alert(data.respuesta == answer ? "Bien!" : "Mal!");
    });
}

fetch(API_URL + "matle/" + (expectedDayNumber || ""))
    .then(response => response.json()
        .then(day => {
            url.searchParams.set("dia", day.day_number);
            window.history.replaceState(null, "", url);

            MathJax.typesetClear();
            
            questionTextElement.innerHTML = day.question_text;

            if (day.question_image_url) 
                fillAndUnhide(questionImageElement, `
                    <img src="${day.question_image_url}" alt="Imagen relacionada al problema" />
                `);

            if (day.tip) 
                fillAndUnhide(tipElement, `
                    ${day.tip}
                `);

            setAnswer(day.answer);

            MathJax.typesetPromise().then(() => console.log("gaming"));
        }));
