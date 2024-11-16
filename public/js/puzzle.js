// Konstanta untuk baris dan kolom
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

            // Event untuk desktop
            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);

            // Event untuk mobile
            tile.addEventListener("touchstart", touchStart);
            tile.addEventListener("touchmove", touchMove);
            tile.addEventListener("touchend", touchEnd);

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

window.onload = function () {
    loadPuzzle();
    document.getElementById("nextLevelBtn").addEventListener("click", nextLevel);
};

// Fungsi untuk menukar ubin
function swapTiles(tile1, tile2) {
    const [row1, col1] = tile1.id.split("-").map(Number);
    const [row2, col2] = tile2.id.split("-").map(Number);

    // Validasi: apakah ubin adalah tetangga langsung
    const isAdjacent =
        (row1 === row2 && Math.abs(col1 - col2) === 1) || // Sebaris, kolom berdekatan
        (col1 === col2 && Math.abs(row1 - row2) === 1);   // Sekolom, baris berdekatan

    if (isAdjacent) {
        let tempSrc = tile1.src;
        tile1.src = tile2.src;
        tile2.src = tempSrc;

        turns += 1;
        document.getElementById("turns").innerText = turns;

        checkPuzzleComplete();
    }
}

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
    swapTiles(currTile, otherTile);
}

// Mobile Touch Functions
function touchStart(e) {
    currTile = e.target;
    currTile.dataset.startX = e.touches[0].clientX;
    currTile.dataset.startY = e.touches[0].clientY;
}

function touchMove(e) {
    e.preventDefault();
    const moveX = e.touches[0].clientX - currTile.dataset.startX;
    const moveY = e.touches[0].clientY - currTile.dataset.startY;

    currTile.style.transform = `translate(${moveX}px, ${moveY}px)`;
}

function touchEnd(e) {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;

    currTile.style.transform = ""; // Reset posisi tile

    const targetTile = document.elementFromPoint(endX, endY);

    if (targetTile && targetTile.tagName === "IMG" && targetTile.src.includes("00.png")) {
        otherTile = targetTile;
        swapTiles(currTile, otherTile);
    }
}
