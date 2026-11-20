const API_URL = `${window.location.origin}/api/`;
const LOCAL_RESULTS_KEY = "myResults";
const LOCAL_STREAK_KEY = "myCurrentStreak";

const url = new URL(document.location.href);
const expectedDayNumber = parseInt(url.searchParams.get("dia"));

const questionTextElement = document.getElementById("consigna-text");
const questionImageElement = document.getElementById("consigna-image");
const resultElement = document.getElementById("resultado");
const tipElement = document.getElementById("tip");
const streakElement = document.getElementById("racha");

const answerFormElement = document.getElementById('respuesta-form');

function fillAndUnhide(element, content) {
    element.innerHTML = content;
    element.classList.remove("hidden");
}

function calculateAndStoreResultAndStreak(dayNumber, correctAnswer, userAnswer) {
    const results = JSON.parse(localStorage.getItem(LOCAL_RESULTS_KEY));
    if (!Object.hasOwn(results, dayNumber) || results[dayNumber][0] !== 'CORRECT') {
        const result = userAnswer == correctAnswer ? 'CORRECT' : 'WRONG';
        results[dayNumber] = [result, userAnswer];
        localStorage.setItem(LOCAL_RESULTS_KEY, JSON.stringify(results));

        if (result === 'CORRECT') {
            const currentStreak = JSON.parse(localStorage.getItem(LOCAL_STREAK_KEY));
            currentStreak.length += 1;
            currentStreak.lastDay = dayNumber;
            localStorage.setItem(LOCAL_STREAK_KEY, JSON.stringify(currentStreak));
        }

        return result;
    }
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
            Eso es <strong>${result == 'CORRECT' ? 'correcto</strong>!' : 'incorrecto</strong>.'}
        `);
        resultElement.classList.add(result == 'CORRECT' ? 'correct' : 'wrong');
        resultElement.classList.remove(result == 'CORRECT' ? 'wrong' : 'correct');
    }
}

function armSubmitButton(dayNumber, answer) {
    answerFormElement.addEventListener('submit', event => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        calculateAndStoreResultAndStreak(dayNumber, answer, data.respuesta);
        showResultIfAnswered(dayNumber);
    });
}

function resetStreak() {
    const noStreak = {length: 0, lastDay: null};
    localStorage.setItem(LOCAL_STREAK_KEY, JSON.stringify(noStreak));
    return noStreak;
}

function main({
    day_number: dayNumber,
    question_text: questionText,
    answer: correctAnswer,
    tip,
    question_image_url: questionImageUrl,
}) {
    // Logic
    url.searchParams.set("dia", dayNumber);
    window.history.replaceState(null, "", url);

    currentStreak = JSON.parse(localStorage.getItem(LOCAL_STREAK_KEY));

    if (currentStreak.length > 0 && dayNumber > currentStreak.lastDay + 1) 
        currentStreak = resetStreak();

    armSubmitButton(dayNumber, correctAnswer);

    // Render
    MathJax.typesetClear();
    
    questionTextElement.innerHTML = questionText;

    if (questionImageUrl) 
        fillAndUnhide(questionImageElement, `
            <img src="${questionImageUrl}" alt="Imagen relacionada al problema" />
        `);

    if (tip) 
        fillAndUnhide(tipElement, `
            ${tip}
        `);

    showResultIfAnswered(dayNumber);

    if (currentStreak.length > 0)
        fillAndUnhide(streakElement, `
            Tenés una racha de <strong>${currentStreak.length} día${currentStreak.length > 1 ? "s" : ""}</strong>!
        `)

    MathJax.typesetPromise();
}

if (!localStorage.getItem(LOCAL_RESULTS_KEY)) 
    localStorage.setItem(LOCAL_RESULTS_KEY, JSON.stringify({}));

if (!localStorage.getItem(LOCAL_STREAK_KEY)) resetStreak();

fetch(API_URL + "matle/" + (expectedDayNumber || ""))
    .then(response => response.json()
        .then(day => main(day)));
