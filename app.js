const n = 20;
const array = [];
const container = document.getElementById("container");

let audioCtx=null;

function playNote(freq){
    if(audioCtx==null){
        audioCtx=new(
            AudioContext ||
            webkitAudioContext ||
            window.webkitAudioContext
        )();
    }
    const dur=0.1;
    const osc=audioCtx.createOscillator();
    osc.frequency.value=freq;
    osc.start();
    osc.stop(audioCtx.currentTime+dur);
    const node= audioCtx.createGain();
    node.gain.value=0.1;
    node.gain.linearRampToValueAtTime(
        0, audioCtx.currentTime+dur
    );
    osc.connect(node);
    node.connect(audioCtx.destination);
}

init();

function init() {
    for (let i = 0; i < n; i++) {
        array[i] =Math.random();
    }
    showBars();
}

function bubbleSort(array) {
    const moves = [];
    do {
        var swapped = false;
        for (let i = 1; i < array.length; i++) {
            moves.push({ indices: [i - 1, i], type: "comp" });
            if (array[i - 1] > array[i]) {
                swapped = true;
                moves.push({ indices: [i - 1, i], type: "swap" });
                [array[i - 1], array[i]] = [array[i], array[i - 1]];
            }
        }
    } while (swapped);
    return moves;
}

function mergeSort(array) {
    const moves = [];
    if (array.length < 2) return array;

    function mergeSortHelper(array, start, end) {
        if (end - start < 2) return;
        const mid = Math.floor((start + end) / 2);
        mergeSortHelper(array, start, mid);
        mergeSortHelper(array, mid, end);
        merge(array, start, mid, end);
    }

    function merge(array, start, mid, end) {
        console.log("Merge called with start:", start, "mid:", mid, "end:", end);
        
        const left = array.slice(start, mid);
        const right = array.slice(mid, end);
        console.log("Left array:", left);
        console.log("Right array:", right);
    
        let i = start, j = 0, k = 0;
    
        while (j < left.length && k < right.length) {
            moves.push({ indices: [i, mid + k], type: "comp" });
            if (left[j] <= right[k]) {
                moves.push({ indices: [i], value: left[j] });
                array[i++] = left[j++];
            } else {
                moves.push({ indices: [i], value: right[k] });
                array[i++] = right[k++];
            }
        }
        while (j < left.length) {
            moves.push({ indices: [i], value: left[j] });
            array[i++] = left[j++];
        }
        while (k < right.length) {
            moves.push({ indices: [i], value: right[k] });
            array[i++] = right[k++];
        }
    
        console.log("Merged array:", array.slice(start, end));
    }
    
    

    mergeSortHelper(array, 0, array.length);
    return moves;
}


function quickSort(array) {
    const moves = [];
    quickSortHelper(array, 0, array.length - 1, moves);
    return moves;
}

function quickSortHelper(array, low, high, moves) {
    if (low < high) {
        const pivotIndex = partition(array, low, high, moves);
        quickSortHelper(array, low, pivotIndex - 1, moves);
        quickSortHelper(array, pivotIndex + 1, high, moves);
    }
}

function partition(array, low, high, moves) {
    const pivot = array[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        moves.push({ indices: [j, high], type: "comp" });
        if (array[j] < pivot) {
            i++;
            moves.push({ indices: [i, j], type: "swap" });
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    moves.push({ indices: [i + 1, high], type: "swap" });
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    return i + 1;
}

function insertionSort(array) {
    const moves = [];
    for (let i = 1; i < array.length; i++) {
        let j = i;
        while (j > 0 && array[j - 1] > array[j]) {
            moves.push({ indices: [j - 1, j], type: "comp" });
            moves.push({ indices: [j - 1, j], type: "swap" });
            [array[j - 1], array[j]] = [array[j], array[j - 1]];
            j--;
        }
    }
    return moves;
}

function selectionSort(array) {
    const moves = [];
    for (let i = 0; i < array.length - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < array.length; j++) {
            moves.push({ indices: [minIndex, j], type: "comp" });
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            moves.push({ indices: [i, minIndex], type: "swap" });
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
        }
    }
    return moves;
}

function countingSort(array) {
    const moves = [];
    const maxVal = Math.max(...array);
    const counts = new Array(maxVal + 1).fill(0);

    for (let i = 0; i < array.length; i++) {
        counts[array[i]]++;
        moves.push({ indices: [i], type: "count" });
    }

    let sortedIndex = 0;
    for (let i = 0; i < counts.length; i++) {
        while (counts[i] > 0) {
            moves.push({ indices: [sortedIndex], value: i });
            array[sortedIndex] = i;
            sortedIndex++;
            counts[i]--;
        }
    }
    return moves;
}

function heapSort(array) {
    const moves = [];
    buildMaxHeap(array, moves);
    for (let end = array.length - 1; end > 0; end--) {
        moves.push({ indices: [0, end], type: "swap" });
        [array[0], array[end]] = [array[end], array[0]];
        siftDown(array, 0, end, moves);
    }
    return moves;
}

function buildMaxHeap(array, moves) {
    const start = Math.floor(array.length / 2) - 1;
    for (let i = start; i >= 0; i--) {
        siftDown(array, i, array.length, moves);
    }
}

function siftDown(array, start, end, moves) {
    let root = start;
    while (true) {
        const leftChild = 2 * root + 1;
        const rightChild = 2 * root + 2;
        let swap = root;
        if (leftChild < end && array[swap] < array[leftChild]) {
            moves.push({ indices: [swap, leftChild], type: "comp" });
            swap = leftChild;
        }
        if (rightChild < end && array[swap] < array[rightChild]) {
            moves.push({ indices: [swap, rightChild], type: "comp" });
            swap = rightChild;
        }
        if (swap === root) return;
        moves.push({ indices: [root, swap], type: "swap" });
        [array[root], array[swap]] = [array[swap], array[root]];
        root = swap;
    }
}

function playMergeSort() {
    const copy = [...array];
    const moves = mergeSort(copy);
    animate(moves);
}

function play() {
    const copy = [...array];
    const moves = bubbleSort(copy);
    animate(moves);
}

function qs(){
    const copy = [...array];
    const moves = quickSort(copy);
    animate(moves);
}

function is() {
    const copy = [...array];
    const moves = insertionSort(copy);
    animate(moves);
}

function ss() {
    const copy = [...array];
    const moves = selectionSort(copy);
    animate(moves);
}

function hs() {
    const copy = [...array];
    const moves = heapSort(copy);
    animate(moves);
}

function cs() {
    const copy = [...array];
    const moves = countingSort(copy);
    animate(moves);
}

function animate(moves) {
    console.log("Moves length:", moves.length);
    if (moves.length == 0) {
        showBars();
        return;
    }

    const move = moves.shift();
    console.log("Current move:", move);
    const [i, j] = move.indices;

    if (move.type === "swap") {
        console.log("Swap move detected");
        [array[i], array[j]] = [array[j], array[i]];
    } else if (move.type === "comp") {
        console.log("Comparison move detected");
        playNote(200 + array[i] * 500); // Play notes for comparison
        playNote(200 + array[j] * 500);
    } else if (move.type === "count") {
        console.log("Count move detected");
    } else {
        console.log("Unknown move type:", move.type);
    }

    showBars(move); // Update bars with color highlighting

    // Continue animation with remaining moves
    setTimeout(function () {
        animate(moves);
    }, 70);
}





function showBars(move) {
    container.innerHTML = "";
    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement("div");
        bar.style.height = array[i] * 11000 + "%";
        bar.classList.add("bar");

        if (move && move.indices.includes(i)) {
            bar.style.backgroundColor = move.type === "swap" ? "#FF6F61" : "#4ECDC4";
        } else {
            bar.style.backgroundColor = "#AAAAAA";
        }

        container.appendChild(bar);
    }
}

