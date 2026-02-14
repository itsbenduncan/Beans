const puzzle = {
    size: [13, 10],
    grid: [
        ["#","#","#","#","#","#","#","#","#",""],
        ["#","#","#","#","#","#","#","#","#",""],
        ["#","#","#","#","#","#","#","#","#",""],
        ["#","#","#","","#","","","","",""],
        ["#","#","#","","","","#","","#","#"],
        ["#","#","#","","#","","#","","#",""],
        ["#","#","#","","#","","#","#","#",""],
        ["","#","","#","#","","#","#","#",""],
        ["","","","","","","#","","#",""],
        ["","#","","#","#","","","","",""],
        ["","#","#","#","#","#","#","","#","#"],
        ["","","","","#","#","#","","#","#"],
        ["#","#","#","#","","","","","","#"],
    ],
    answers: [
        ["#","#","#","#","#","#","#","#","#","C"],
        ["#","#","#","#","#","#","#","#","#","U"],
        ["#","#","#","#","#","#","#","#","#","B"],
        ["#","#","#","R","#","B","E","A","N","S"],
        ["#","#","#","U","N","I","#","S","#","#"],
        ["#","#","#","T","#","G","#","S","#","J"],
        ["#","#","#","H","#","E","#","#","#","A"],
        ["F","#","B","#","#","Y","#","#","#","P"],
        ["O","R","A","C","L","E","#","S","#","A"],
        ["O","#","Y","#","#","S","P","O","O","N"],
        ["D","#","#","#","#","#","#","T","#","#"],
        ["S","W","I","M","#","#","#","O","#","#"],
        ["#","#","#","#","W","H","O","L","E","#"],
    ],
    clues: {
        across: {
            1:  { clue: "Plural of Japanese word mame", row: 3, col: 5, length: 5 },
            4:  { clue: "Mesocentrotus franciscanus or Mezcaleria dessert", row: 4, col: 3, length: 3 },
            8:  { clue: "First field we saw a baseball game together", row: 8, col: 0, length: 6 },
            10: { clue: "Said in a big voice", row: 9, col: 5, length: 5 },
            12: { clue: "Favorite aquatic activity to do together", row: 11, col: 0, length: 4 },
            13: { clue: "E.g. total, entire, complete; Matches with another answer to make the place we met", row: 12, col: 4, length: 5 },
        },
        down: {
            2:  { clue: "Your clue for CUBS", row: 0, col: 9, length: 4 },
            3:  { clue: "Name for the dog when she's being too serious", row: 3, col: 3, length: 4 },
            5:  { clue: "We don't have but laugh trying to", row: 3, col: 5, length: 7 },
            6:  { clue: "What we slap that makes our handshake special", row: 3, col: 7, length: 3 },
            7:  { clue: "Where I'll see you next", row: 5, col: 9, length: 5 },
            9:  { clue: "Proper name for what we call moods; Matches with another answer to make the place we met", row: 7, col: 0, length: 5 },
            11: { clue: "Short for our favorite place; Where we'll live one day...", row: 7, col: 2, length: 3 },
            14: { clue: "New spirit we drink at our favorite restaurant", row: 8, col: 7, length: 5 },
        }
    }
};

let puzzleBox = document.querySelector(".puzzle");
let activeRow = null;
let activeCol = null;
let direction = "across";

function generate_puzzle() {
    document.querySelector(".instructions").remove();
    for (let r=0; r<puzzle.grid.length; r++) {
        for (let c=0; c<puzzle.grid[r].length; c++) {
            let cell = puzzle.grid[r][c];
            if (cell === "#") {
                let letterbox = document.createElement('div');
                letterbox.classList.add('blackbox');
                puzzleBox.appendChild(letterbox);
            } else {
                let letterbox = document.createElement('input');
                letterbox.setAttribute("type", "text");
                letterbox.classList.add('letterbox');
                letterbox.setAttribute("data-row", r);
                letterbox.setAttribute("data-col", c);
                letterbox.setAttribute("maxlength", "1");
                letterbox.addEventListener("click", handleCellClick);
                letterbox.addEventListener("input", handleInput);
                letterbox.addEventListener("keydown", handleKeydown);
                puzzleBox.appendChild(letterbox);
            };
        };
    };
    let outerButton = document.createElement('div');
    outerButton.classList.add("btn");
    document.querySelector(".check-btn").appendChild(outerButton);
    let innerButton = document.createElement('div');
    innerButton.textContent = "submit"
    innerButton.classList.add("in_btn");
    innerButton.addEventListener("click", checkAnswers);
    document.querySelector(".btn").appendChild(innerButton);
};

function handleCellClick(e) {
    if (parseInt(e.target.getAttribute("data-row")) === activeRow && parseInt(e.target.getAttribute("data-col")) === activeCol) {
        direction = direction === "across" ? "down" : "across";
    };
    activeRow = parseInt(e.target.getAttribute("data-row"));
    activeCol = parseInt(e.target.getAttribute("data-col"));
    highlightWord();
};

function handleInput(e) {
    activeRow = parseInt(e.target.getAttribute("data-row"));
    activeCol = parseInt(e.target.getAttribute("data-col"));
    if (e.target.value) {
        if (direction === "across") {
            activeCol += 1;
        } else if (direction === "down") {
            activeRow += 1;
        };

        highlightWord();
        document.querySelector(`[data-row="${activeRow}"][data-col="${activeCol}"]`).focus();
    }
}

function handleKeydown(e) {
    activeRow = parseInt(e.target.getAttribute("data-row"));
    activeCol = parseInt(e.target.getAttribute("data-col"));
    if (e.key === "Backspace") {
        if ( e.target.value !== "") {
            e.target.value = "";
            e.preventDefault()
        } else {
            if (direction === "across") {
                activeCol -= 1;
            } else if (direction === "down") {
                activeRow -= 1;
            };

            highlightWord();
            document.querySelector(`[data-row="${activeRow}"][data-col="${activeCol}"]`).focus();
            e.preventDefault()
        }
    }
}

function highlightWord() {
    let highlightedWord = document.querySelectorAll('.active-word');
    highlightedWord.forEach(element => {
        element.classList.remove('active-word');
    });
    let highlightCell = document.querySelector('.active-cell');
    if (highlightCell) {
        highlightCell.classList.remove('active-cell');
    }

    let clues = Object.values(puzzle.clues[direction]);

    clues.forEach(clue => {
        if (direction == "across") {
            if (activeRow === clue.row && activeCol >= clue.col && activeCol <= (clue.col + clue.length)) {
                for (let i=clue.col; i< clue.col + clue.length; i++) {
                    document.querySelector(`[data-row="${clue.row}"][data-col="${i}"]`).classList.add("active-word");
                }
            }
        } else {
            if (activeCol === clue.col && activeRow >= clue.row && activeRow <= (clue.row + clue.length)) {
                for (let i=clue.row; i< clue.row + clue.length; i++) {
                    document.querySelector(`[data-row="${i}"][data-col="${clue.col}"]`).classList.add("active-word");
                }
            }
        }
    })
    
    document.querySelector(`[data-row="${activeRow}"][data-col="${activeCol}"]`).classList.add("active-cell");
    updateClueBar();
};

function updateClueBar() {
    let clueBar = document.querySelector(".clue-bar")
    let clues = Object.values(puzzle.clues[direction]);

    clues.forEach(clue => {
        if (direction == "across") {
            if (activeRow === clue.row && activeCol >= clue.col && activeCol <= (clue.col + clue.length)) {
                // clueBar.textContent = `${(clues.indexOf(clue) + 1)} ${direction}: ${clue.clue}`;
                clueBar.textContent = `${clue.clue}`;
            }
        } else {
            if (activeCol === clue.col && activeRow >= clue.row && activeRow <= (clue.row + clue.length)) {
                clueBar.textContent = clue.clue;
            }
        }
    })
};

function checkAnswers() {
    let allCorrect = true;
    let answers = puzzle.answers;

    for (let answer=0; answer<answers.length; answer++) {
        for (let letter=0; letter<answers[answer].length; letter++) {
            if (answers[answer][letter] == "#") {
                continue;
            } else {
                let inputAnswer = document.querySelector(`[data-row="${answer}"][data-col="${letter}"]`);
                if (inputAnswer.value.toUpperCase() !== answers[answer][letter]) {
                    allCorrect = false;
                    inputAnswer.classList.add("incorrect");
                }
            }
        }
    }

    if (allCorrect) {
        for (let answer=0; answer<answers.length; answer++) {
            for (let letter=0; letter<answers[answer].length; letter++) {
                if (answers[answer][letter] == "#") {
                    continue;
                } else {
                    document.querySelector(`[data-row="${answer}"][data-col="${letter}"]`).classList.add("correct");
                }
            }
        }
        setTimeout(() => {
            window.location.href = "surprise.html";
        }, 1500);
    }
};

window.visualViewport.addEventListener("resize", () => {
    let clueBar = document.querySelector(".clue-bar");
    clueBar.style.bottom = `${window.innerHeight - window.visualViewport.height}px`;
});

function playIntro() {
    const images = [
        "scans/scan1.png", "scans/scan2.png", "scans/scan3.png",
        "scans/scan4.png", "scans/scan5.png", "scans/scan6.png",
        "scans/scan7.png", "scans/scan8.png"
    ];
    const noteImg = document.querySelector(".note-img");
    const note = document.querySelector(".note");
    let index = 0;
    let reversing = false;

    noteImg.src = images[0];

    let interval = setInterval(() => {
        if (!reversing) {
            index++;
            if (index === images.length - 1) {
                reversing = true;
                noteImg.src = images[index];
                // Pause on last image for 2 seconds
                clearInterval(interval);
                setTimeout(() => {
                    interval = setInterval(() => {
                        index--;
                        noteImg.src = images[index];
                        if (index === 0) {
                            clearInterval(interval);
                            setTimeout(() => {
                                note.remove();
                                document.querySelector(".instructions").style.display = "flex";
                            }, 500);
                        }
                    }, 200);
                }, 2000);
                return;
            }
        }
        noteImg.src = images[index];
    }, 500);
}

playIntro();