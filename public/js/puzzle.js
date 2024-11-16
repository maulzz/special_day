var rows = 3;
var columns = 3;
var level = 1;
var turns = 0;

var currTile;
var otherTile;

// Daftar gambar untuk setiap level
var levelImages = {
    1: ["00", "10", "20", "01", "11", "21", "02", "12", "22", "1"],
    2: ["00", "10", "20", "01", "11", "21", "02", "12", "22", "1"],
};

// Fungsi untuk mengacak gambar
function shuffle(array) {
    for (let i = array.length - 3; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Fungsi untuk memuat puzzle berdasarkan level
function loadPuzzle() {
    turns = 0;
    document.getElementById("turns").innerText = turns;

    document.getElementById("board").innerHTML = ""; // Kosongkan papan

    // Acak gambar untuk level saat ini
    let imgOrder = [...levelImages[level]];
    shuffle(imgOrder);

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "js/level" + level + "/" + imgOrder.shift() + ".png";

            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);

            document.getElementById("board").append(tile);
        }
    }
}

// Fungsi untuk memeriksa apakah puzzle sudah selesai
function checkPuzzleComplete() {
    let correct = true;
    let index = 0;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let correctImg = levelImages[level][index] + ".png";
            if (tile.src.includes(correctImg)) {
                index++;
            } else {
                correct = false;
                break;
            }
        }
        if (!correct) break;
    }

    if (correct) {
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                let tile = document.getElementById(r.toString() + "-" + c.toString());
                if (tile.src.includes("00.png")) {
                    tile.src = "js/level" + level + "/1.png";
                    break;
                }
            }
        }

        document.getElementById("berhasil").classList.remove("hidden");
    }
}

// Fungsi untuk memulai level berikutnya
function nextLevel() {
    level += 1;
    if (levelImages[level]) {
        loadPuzzle();
        document.getElementById("berhasil").classList.add("hidden");
        document.getElementById("btnreset").classList.add("hidden");
    } else {
        window.location.href = "gift.html";
    }
}

function resetGame() {
    window.location.reload();
}

window.onload = function() {
    loadPuzzle();
    document.getElementById("nextLevelBtn").addEventListener("click", nextLevel);
};

// Drag and Drop Functions
function dragStart() {
    currTile = this;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {}

function dragDrop() {
    otherTile = this;
}

function dragEnd() {
    if (!otherTile.src.includes("00.png")) {
        return;
    }

    let currCoords = currTile.id.split("-");
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    let moveLeft = r == r2 && c2 == c - 1;
    let moveRight = r == r2 && c2 == c + 1;
    let moveUp = c == c2 && r2 == r - 1;
    let moveDown = c == c2 && r2 == r + 1;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    if (isAdjacent) {
        let currImg = currTile.src;
        let otherImg = otherTile.src;

        currTile.src = otherImg;
        otherTile.src = currImg;

        turns += 1;
        document.getElementById("turns").innerText = turns;

        checkPuzzleComplete();
    }
}
