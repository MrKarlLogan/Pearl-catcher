/* Наодим основные элементы */
const gameBox = document.querySelector('.game-box');
const template = document.getElementById('template-box').content.querySelector('.box');
const newGameButton = document.querySelector('.newgame-button');

/* Находим span по статистике */
const statisticBox = document.querySelector('.statistics');
const statisticCheck = document.querySelector('.check__count');
const statisticLevel = document.querySelector('.level__count');
const statisticTimer = document.querySelector('.timer__count');
const statisticHealthPoints = document.querySelector('.health-points__count');

/* Кнопки подсказок */
const hintsBox = document.querySelector('.hints');
const hintReduce = document.querySelector('.reduce');
const hintGodMode = document.querySelector('.god-mode');
const hintColdTime = document.querySelector('.cold-time');
const hintSvgTimer = document.querySelector('.timer__hint-info');
const hintSvgHealthPoints = document.querySelector('.health-points__hint-info');

/* Модальное окно Game Over */
const modal = document.querySelector('.modal');
const buttonModal = modal.querySelector('.modal__button');
const modalDescription = modal.querySelector('.modal__description');
const checkGameOver = modal.querySelector('.check__game-over');
const levelGameOver = modal.querySelector('.level__game-over');

/* Вступительное модальное окно */
const modalInfo = document.querySelector('.info');
const buttonModalInfo = modalInfo.querySelector('.info__button');

/* Окно загрузки */
const load = document.querySelector('.loading');
const advice = load.querySelector('.advice__text');

/* Патчноут */
const pathNotesModal = document.querySelector('.patch-notes');
const pathNotesButton = document.querySelector('.current-version');
const pathNotesCloseButton = pathNotesModal.querySelector('.patch-notes__close-button');

/* Главный массив, индекс правильного ответа и массив текущего уровня */
let mainArr = [0, 0];
let levelArr = [];
let answer = 0;

/* Массив советов */
const adviceArr = ['У тебя всегда есть 3 попытки. Помни про них!',
    'Ты везунчик? Проверь это в игре',
    'У тебя есть 3 подскази. Одна из них очень полезная. Остальные - чтобы были...',
    'При разработке игры ни один факториал не пострадал',
    'Если хочешь сделать так же, то поступай в Я.Практикум',
    'Я потратил 3 полных дня на разработку этого проекта',
    'Твоя цель - найти жемчуг в боксе! Дальше уже всё будет зависеть от уровня твоего везения',
    'Учишь JS и он тебе нравится? Добро пожаловать в дурку!',
    'Все написано на чистом JS, CSS и HTML',
    'Знай - у тебя всё получится!'];

/* Счётчик активных подсказок */
let hintActive = 0,
    hintReduceCount = 0,
    hintGodModeCount = 0,
    hintColdTimeCount = 0;

/* Рост уровня */
let level = 1;

function userLevelUp() {
    if (mainArr.length === 2) {
        level = 1;
    } else {
        level += 1;
    };
    statisticLevel.textContent = level;
};

/* Таймер */
let timerValue = 0, setTimer, stoppedValue;

function startTimer(value) {
    statisticTimer.style.color = 'DarkMagenta';
    statisticTimer.textContent = timerValue = value;
    setTimer = setInterval(() => {
        statisticTimer.textContent = --timerValue;
        if (timerValue === 0) {
            gameOver();
        };
        if (timerValue <= 10) {
            statisticTimer.style.color = 'OrangeRed';
        };
    }, 1000);
};

function stopTimer() {
    clearInterval(setTimer);
    stoppedValue = timerValue;
};

/* Счет */
let currentCheck = 0, recordCheck = 0;

function check() {
    if (hintActive === 0) {
        hintActive = 1;
    };
    currentCheck += stoppedValue * level * points * hintActive;
    statisticCheck.textContent = currentCheck;
};

function userRecord() {
    if (recordCheck === 0 || currentCheck > recordCheck) {
        recordCheck = currentCheck;
    };
};

/* Счетчик попыток */
let points = 3;

function pointCounts() {
    --points;
    statisticHealthPoints.textContent = points;
    if (points <= 0) {
        gameOver();
    };
};

/* Создания бокса */
function createBox(value) {
    const playBox = template.cloneNode(true);
    return playBox;
};

/* Присвоение рандомного зн-я и создание актуального кол-ва боксов */

function newLevel() {
    userLevelUp();
    if (!gameBox.classList.contains('blocked')) {
        gameBox.classList.add('blocked');
        hintsBox.classList.add('blocked');
        newGameButton.classList.add('blocked');
        pathNotesButton.classList.add('blocked');
    }
    if (recordCheck === 0 || currentCheck < recordCheck) {
        statisticCheck.textContent = currentCheck;
    } else {
        statisticCheck.textContent = currentCheck + ' 🏆';
    }
    hintSvgTimer.classList.remove('active');
    statisticHealthPoints.textContent = points;
    statisticTimer.textContent = timerValue;
    mainArr[Math.floor(Math.random() * mainArr.length)] = 1;
    answer = mainArr.indexOf(1);
    mainArr.forEach((box, index) => {
        setTimeout(() => {
            const boxElement = createBox(box);
            gameBox.append(boxElement);
            levelArr.push(boxElement);
            setTimeout(() => {
                boxElement.classList.remove('animated-box');
            }, 300);
            if (index === mainArr.length - 1) {
                setTimeout(() => {
                    gameBox.classList.remove('blocked');
                    hintsBox.classList.remove('blocked');
                    newGameButton.classList.remove('blocked');
                    pathNotesButton.classList.remove('blocked');
                    startTimer(30);
                }, 300);
            };
        }, 300 * index);
    });
    validateHintReduceAction();
    validateHintActive();
    gameBox.addEventListener('click', changePoint);
};

/* Создание первого уровня после загрузки */
function loading() {
    const adviceRand = adviceArr[Math.floor(Math.random() * adviceArr.length)];
    advice.append(adviceRand);
    setTimeout(() => {
        load.classList.remove('active');
    }, 12000)
};

loading()

buttonModalInfo.addEventListener('click', () => {
    modalInfo.classList.remove('active');
    setTimeout(() => {
        newLevel();
    }, 200)
});

/* Очистка уровня и добавление нового бокса*/
function clear() {
    document.querySelectorAll('.box').forEach(box => {
        if(box.classList.contains('answer')) {
            box.classList.remove('answer');
        }
        box.remove();
    });
};

function resetArr() {
    mainArr[mainArr.indexOf(1)] = 0;
    mainArr.push(0);
    levelArr = [];
};

/* Слушатель на область для прохождения уровня */
function nextLevel(box) {
    box.target.querySelector('.cover').classList.add('animated-cover');
    if (box.target.classList.contains('answer')) {
        gameBox.classList.add('blocked');
        hintsBox.classList.add('blocked');
        newGameButton.classList.add('blocked');
        pathNotesButton.classList.add('blocked');
        gameBox.removeEventListener('click', changePoint);
        stopTimer();
        setTimeout(() => {
            if (level % 3 === 0 && points !== 0) {
                points += 3;
            };
            check();
            userRecord();
            clear();
            resetArr();
            newLevel();
        }, 1700);
    };
};

gameBox.addEventListener('mousedown', box => {
    if (!box.target.classList.contains('box')) return;
    if (box.target === levelArr[answer]) {
        box.target.classList.add('answer');
    } else {
        box.target.classList.add('not-the-answer');
        box.target.classList.remove('scale-effect');        
    };
    box.target.classList.add('correct-box');
    nextLevel(box);
});

function changePoint(box) {
    if (box.target.classList.contains('box') && (!box.target.classList.contains('answer')) && (!box.target.classList.contains('no-point'))) {
        pointCounts();
        box.target.classList.add('no-point');
    };
};

/* Новая игра */
function newGame() {
    if (modal.classList.contains('active')) {
        modal.classList.remove('active');
    };
    if (hintSvgHealthPoints.classList.contains('active')) {
        hintSvgHealthPoints.classList.remove('active');
    }
    gameBox.removeEventListener('click', targetHint);
    gameBox.addEventListener('click', changePoint);
    buttonModal.removeEventListener('click', handleNewGameClick);
    stopTimer();
    clear();
    mainArr = [0, 0];
    levelArr = [];
    level = 1;
    currentCheck = 0;
    points = 3;
    activatedHintReduce = false;
    [hintReduce, hintGodMode, hintColdTime].forEach(hint => {
        hint.disabled = false;
    });
    newLevel();
};

newGameButton.addEventListener('click', newGame);

/* Слушатели на подсказки */
function reduceArr() {
    const answerElement = mainArr.indexOf(1);
    const boxAll = document.querySelectorAll('.box');
    const availabilityClass = Array.from(boxAll).filter((box, index) => {
        return index !== answerElement && !box.classList.contains('not-the-answer');
    });
    if (availabilityClass.length <= 1) {
        statisticBox.classList.add('active-reduce-error');
        hintReduce.classList.add('blocked');
        setTimeout(() => {
            statisticBox.classList.remove('active-reduce-error');
            hintReduce.classList.remove('blocked');
        }, 2000);
        return;
    };
    let randomIndexElement;
    do {
        randomIndexElement = Math.floor(Math.random() * mainArr.length);
    } while (mainArr[randomIndexElement] === 1 || (boxAll[randomIndexElement].classList.contains('not-the-answer')));
    gameBox.classList.add('blocked');
    boxAll.forEach((box, index, arr) => {
        setTimeout(() => {
            if (index !== answerElement && index !== randomIndexElement) {
                box.classList.add('animation-back');
                setTimeout(() => {
                    box.remove();
                }, 300)
            };
            if (index === arr.length - 1) {
                gameBox.classList.remove('blocked');
            };
            activatedHintReduce = true;
            hintReduce.disabled = true;
        }, 300 * index);
    });
};

let activatedHintReduce = false;

function validateHintReduceAction() {
    if (mainArr.length === 2 || activatedHintReduce) {
        hintReduce.disabled = true;
    } else if (mainArr.length > 2) {
        hintReduce.disabled = false;
    };
};

hintReduce.addEventListener('click', reduceArr);

function targetHint(box) {
    if (box.target.classList.contains('box') && (!box.target.classList.contains('answer')) && (!box.target.classList.contains('no-point'))) {
        gameBox.removeEventListener('click', targetHint);
        gameBox.addEventListener('click', changePoint);
        box.target.classList.add('no-point');
        hintSvgHealthPoints.classList.remove('active');
    };
};

hintGodMode.addEventListener('click', () => {
    gameBox.removeEventListener('click', changePoint);
    hintSvgHealthPoints.classList.add('active');
    gameBox.addEventListener('click', targetHint);
    hintGodMode.disabled = true;
});

hintColdTime.addEventListener('click', () => {
    stopTimer();
    hintSvgTimer.classList.add('active');
    hintColdTime.disabled = true;
});


function validateHintActive() {
    hintActive = (mainArr.length === 2 ? 1 : (hintReduce.disabled ? 0 : 1))
        + (hintGodMode.disabled ? 0 : 1)
        + (hintColdTime.disabled ? 0 : 1);
    return hintActive;
};

/* Модальное окно завершения игры */

let gameOverReason = '', randomEmodji;
let emodjiArr = ['😟', '😬', '😵', '😖', '😫', '😴', '😐', '😕', '😳', '😭', '😓'];

function setGameOverReason() {
    randomEmodji = emodjiArr[Math.floor(Math.random() * emodjiArr.length)];
    if (timerValue === 0) {
        gameOverReason = `У вас закончилось время ${randomEmodji}`;
    } else if (points === 0) {
        gameOverReason = `У вас закончились попытки ${randomEmodji}`;
    };
};

function handleNewGameClick() {
    newGame();
};

function gameOver() {
    setGameOverReason()
    modalDescription.textContent = gameOverReason;
    if (recordCheck === 0 || currentCheck < recordCheck) {
        checkGameOver.textContent = currentCheck;
    } else {
        checkGameOver.textContent = currentCheck + ' 🏆';
    }
    levelGameOver.textContent = level - 1;
    if (!modal.classList.contains('active')) {
        modal.classList.add('active');
    };
    stopTimer();
    buttonModal.addEventListener('click', handleNewGameClick);
};

/* Модальное окно патчноута */
function pathNotesModalClose() {
    pathNotesCloseButton.removeEventListener('click', pathNotesModalClose);
    pathNotesModal.classList.remove('active');
    if (!hintSvgTimer.classList.contains('active')) {
        startTimer(stoppedValue);
    };
};

pathNotesButton.addEventListener('click', () => {
    stopTimer();
    pathNotesModal.classList.add('active');
    pathNotesCloseButton.addEventListener('click', pathNotesModalClose);
});