document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('start-quiz').addEventListener('click', function() {
        fetch('http://localhost:3000/api')
            .then(response => response.json())
            .then(data => {
                document.getElementById('quiz-container').style.display = 'block';
                document.getElementById('start-container').style.display = 'none';
                initializeQuiz(data);
            })
            .catch(error => console.error('Error:', error));
    });
});

let score = 0;
let totalQuestions = 0;
let movies;
let usedQuotes = new Set();

function initializeQuiz(movieData) {
    movies = movieData;
    score = 0;
    totalQuestions = 0;
    usedQuotes.clear();
    displayQuestion();
}

function displayQuestion() {
    if (movies.length === usedQuotes.size) {
        endQuiz();
        return;
    }

    let questionMovie;
    let quote;
    do {
        questionMovie = movies[Math.floor(Math.random() * movies.length)];
        quote = questionMovie.quotes[Math.floor(Math.random() * questionMovie.quotes.length)];
    } while (usedQuotes.has(quote));
    usedQuotes.add(quote);

    let options = getOptions(questionMovie, movies);

    document.getElementById('quote').textContent = `"${quote}"`;
    let optionsHtml = options.map(movie => 
        `<label>
            <input type="radio" name="movieOption" value="${movie.movie}"> ${movie.movie}
        </label><br>`
    ).join('');
    document.getElementById('options-container').innerHTML = optionsHtml;

    document.getElementById('submit').onclick = () => processAnswer(questionMovie.movie);
}

function getOptions(correctMovie, movies) {
    let options = [correctMovie];
    while (options.length < 4) {
        let randomMovie = movies[Math.floor(Math.random() * movies.length)];
        if (!options.includes(randomMovie)) {
            options.push(randomMovie);
        }
    }
    return shuffleArray(options);
}

function processAnswer(correctAnswer) {
    let userAnswer = document.querySelector('input[name="movieOption"]:checked').value;
    if (userAnswer === correctAnswer) {
        score++;
    }
    totalQuestions++;
    if (totalQuestions < movies.length && usedQuotes.size < movies.reduce((acc, movie) => acc + movie.quotes.length, 0)) {
        displayQuestion();
    } else {
        endQuiz();
    }
}

function endQuiz() {
    document.getElementById('quiz-container').innerHTML = `<h1>Quiz Ended</h1><p>Your score: ${score}/${totalQuestions}</p><button id="restart-quiz">Restart Quiz</button>`;
    document.getElementById('restart-quiz').addEventListener('click', function() {
        document.getElementById('quiz-container').style.display = 'none';
        document.getElementById('start-container').style.display = 'block';
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
