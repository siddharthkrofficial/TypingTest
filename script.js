const textToTypeContainer = document.getElementById('text-to-type-container');
const textToType = document.getElementById('text-to-type');
const userInput = document.getElementById('user-input');
const durationSelect = document.getElementById('duration');
const results = document.getElementById('results');
const wpmSpan = document.getElementById('wpm');
const accuracySpan = document.getElementById('accuracy');
const errorsSpan = document.getElementById('errors');
const timeTakenSpan = document.getElementById('time-taken');
const container = document.querySelector('.container');

const sentences = [
    "The sun dipped below the horizon, painting the sky in hues of orange and pink. A gentle breeze rustled the leaves of the tall oak trees, creating a soothing melody. In the distance, a lone bird sang its evening song, a sweet, melancholic tune that seemed to hang in the still air. The world seemed to slow down, to take a deep breath, as day transitioned into night.",
    "The old library was a sanctuary of silence and stories. Dust motes danced in the sunbeams that slanted through the high, arched windows, illuminating shelves packed with books of all shapes and sizes. The air smelled of aged paper and leather, a scent that promised adventure and knowledge. Each book was a portal to another world, waiting to be opened by a curious mind.",
    "The bustling city market was a kaleidoscope of colors, sounds, and smells. Vendors shouted their wares, their voices a chaotic symphony. The aroma of exotic spices mingled with the sweet scent of fresh flowers and the savory smell of street food. People from all walks of life navigated the crowded alleys, their faces a mixture of purpose and wonder. It was a place where the vibrant pulse of the city could be felt in every corner.",
    "The majestic mountains stood tall and proud, their peaks piercing the clouds. A winding river snaked its way through the valley below, its clear water sparkling in the sunlight. The air was crisp and clean, carrying the scent of pine and damp earth. It was a place of raw, untamed beauty, a reminder of the power and grandeur of nature.",
    "The small coastal town was a haven of tranquility. The rhythmic sound of waves crashing against the shore was a constant, soothing presence. Fishing boats with their colorful sails dotted the horizon, their silhouettes stark against the morning sky. The salty air was invigorating, and the slow pace of life was a welcome respite from the hustle and bustle of the modern world."
];

const resetBtn = document.getElementById('reset-btn');

let timer;
let testActive = false;
let startTime;
let errors = 0;
let recentResults = []; // Array to store recent results

function initializeTest() {
    container.classList.remove('show-results');
    results.classList.add('hidden');
    userInput.value = '';
    userInput.disabled = false;
    const sentence = sentences[Math.floor(Math.random() * sentences.length)];
    textToType.innerHTML = '';
    sentence.split('').forEach(char => {
        const charSpan = document.createElement('span');
        charSpan.innerText = char;
        textToType.appendChild(charSpan);
    });
    userInput.focus();
}

function startTest() {
    testActive = true;
    startTime = new Date().getTime();
    errors = 0;
    results.classList.add('hidden');

    const duration = parseInt(durationSelect.value) * 1000;
    timer = setTimeout(endTest, duration);
}

function handleInput() {
    if (!testActive) {
        startTest();
    }

    const typedText = userInput.value;
    const textSpans = textToType.querySelectorAll('span');
    let correct = true;
    errors = 0;

    textSpans.forEach((charSpan, index) => {
        const char = typedText[index];
        if (char == null) {
            charSpan.classList.remove('correct', 'incorrect');
            correct = false;
        } else if (char === charSpan.innerText) {
            charSpan.classList.add('correct');
            charSpan.classList.remove('incorrect');
        } else {
            charSpan.classList.add('incorrect');
            charSpan.classList.remove('correct');
            errors++;
            correct = false;
        }
    });

    if (correct) {
        endTest();
    }
}

function endTest() {
    clearTimeout(timer);
    testActive = false;
    userInput.disabled = true;
    container.classList.add('show-results');

    const endTime = new Date().getTime();
    const timeTaken = (endTime - startTime) / 1000;
    const typedText = userInput.value;
    const typedWords = typedText.trim().split(/\s+/).length;
    const wpm = Math.round((typedWords / timeTaken) * 60);
    const accuracy = Math.round(((typedText.length - errors) / typedText.length) * 100) || 0;

    wpmSpan.innerText = wpm;
    accuracySpan.innerText = accuracy;
    errorsSpan.innerText = errors;
    timeTakenSpan.innerText = timeTaken.toFixed(2);
    results.classList.remove('hidden');

    // Store and display recent results
    const newResult = {
        wpm: wpm,
        accuracy: accuracy,
        errors: errors,
        timeTaken: timeTaken.toFixed(2)
    };
    recentResults.unshift(newResult); // Add to the beginning
    if (recentResults.length > 10) {
        recentResults.pop(); // Keep only the last 10 results
    }
    displayRecentResults();
}

function displayRecentResults() {
    const recentResultsContent = document.getElementById('recent-results-content');
    recentResultsContent.innerHTML = '';

    if (recentResults.length === 0) {
        recentResultsContent.innerHTML = '<p>No recent results.</p>';
        return;
    }

    recentResults.forEach((result, index) => {
        const tile = document.createElement('div');
        tile.classList.add('result-tile');
        tile.innerHTML = `
            <h3>Test ${recentResults.length - index}</h3>
            <p>WPM: ${result.wpm}</p>
            <p>Accuracy: ${result.accuracy}%</p>
            <p>Errors: ${result.errors}</p>
            <p>Time: ${result.timeTaken}s</p>
        `;
        recentResultsContent.appendChild(tile);
    });
}

userInput.addEventListener('input', handleInput);
durationSelect.addEventListener('change', initializeTest);
resetBtn.addEventListener('click', initializeTest);

initializeTest();
displayRecentResults();
