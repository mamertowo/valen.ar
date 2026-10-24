const API_URL = "https://valen.ar/api/";
const LOCAL_RESULTS_KEY = "myResults";

const url = new URL(document.location.href);
const expectedDayNumber = parseInt(url.searchParams.get("dia"));

const questionTextElement = document.getElementById("consigna-text");
const questionImageElement = document.getElementById("consigna-image");
const resultElement = document.getElementById("resultado");
const tipElement = document.getElementById("tip");

const answerFormElement = document.getElementById('respuesta-form');

function fillAndUnhide(element, content) {
    element.innerHTML = content;
    element.classList.remove("hidden");
}

function calculateAndStoreResult(dayNumber, correctAnswer, userAnswer) {
    const results = JSON.parse(localStorage.getItem(LOCAL_RESULTS_KEY));
    const result = userAnswer == correctAnswer ? 'CORRECT' : 'WRONG';
    results[dayNumber] = [result, userAnswer];
    localStorage.setItem(LOCAL_RESULTS_KEY, JSON.stringify(results));
    return result;
}

function getDayResultAndAnswer(dayNumber) {
    const entry = JSON.parse(localStorage.getItem(LOCAL_RESULTS_KEY))[dayNumber];
    return entry || ['NO_ANSWER', null];
}

function showResultIfAnswered(dayNumber) {
    [result, answer] = getDayResultAndAnswer(dayNumber);
    if (result != 'NO_ANSWER') {
        fillAndUnhide(resultElement, `
            Contestaste: ${answer} <br />
            Eso es <strong>${result == 'CORRECT' ? 'correcto!' : 'incorrecto.'}!</strong>
        `);
        resultElement.classList.add(result == 'CORRECT' ? 'correct' : 'wrong');
    }
}

function setAnswer(dayNumber, answer) {
    answerFormElement.addEventListener('submit', event => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        calculateAndStoreResult(dayNumber, answer, data.respuesta);
        showResultIfAnswered(dayNumber);
    });
}

if (!localStorage.getItem(LOCAL_RESULTS_KEY)) 
    localStorage.setItem(LOCAL_RESULTS_KEY, JSON.stringify({}));

fetch(API_URL + "matle/" + (expectedDayNumber || ""))
    .then(response => response.json()
        .then(day => {
            url.searchParams.set("dia", day.day_number);
            window.history.replaceState(null, "", url);

            setAnswer(day.day_number, day.answer);

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

            showResultIfAnswered(day.day_number);

            MathJax.typesetPromise();
        }));
