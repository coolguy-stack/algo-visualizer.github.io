const n=30;
const array=[];

init();



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
    const node=audioCtx.createGain();
    node.gain.value=0.1;
    node.gain.linearRampToValueAtTime(
        0, audioCtx.currentTime+dur
    );
    osc.connect(node);
    node.connect(audioCtx.destination);
}

function init(){
    for(let i=0;i<n;i++){
        array[i]=Math.random();
    }
    showBars();
    

}

function bubbleSort(array){
    const moves=[];
    do{
        var swapped=false;
        for(let i=1;i<array.length;i++){
            moves.push({
                indices:[i-1, i], type:"comp"});
            if(array[i-1]>array[i]){
                swapped=true;
                moves.push({
                    indices:[i-1, i], type:"swap"});
                [array[i-1],array[i]]=[array[i],array[i-1]];
            } 
        }
    }while(swapped);
    return moves;
}

function insertionSort(array) {
    const moves = [];
    for (let i = 1; i < array.length; i++) {
        let currentElement = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > currentElement) {
            moves.push({ indices: [j, j + 1], type: "comp" });
            array[j + 1] = array[j];
            moves.push({ indices: [j, j + 1], type: "swap" });
            j--;
        }
        array[j + 1] = currentElement;
    }

    return moves;
}

function selectionSort(array) {
    const moves = [];

    for (let i = 0; i < array.length - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < array.length; j++) {
            moves.push({ indices: [j, minIndex], type: "comp" });

            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
        }
        if (i !== minIndex) {
            moves.push({ indices: [i, minIndex], type: "swap" });

            const temp = array[i];
            array[i] = array[minIndex];
            array[minIndex] = temp;
        }
    }

    return moves;
}

function shellSort(array) {
    const moves = [];

    const n = array.length;
    let gap = Math.floor(n / 2);

    while (gap > 0) {
        for (let i = gap; i < n; i++) {
            const currentElement = array[i];
            let j = i;

            while (j >= gap && array[j - gap] > currentElement) {
                moves.push({ indices: [j - gap, j], type: "comp" });
                array[j] = array[j - gap];
                moves.push({ indices: [j - gap, j], type: "swap" });
                j -= gap;
            }

            array[j] = currentElement;
        }

        gap = Math.floor(gap / 2);
    }

    return moves;
}

count = 0;

function bubblePlay(){
    if (count==0){
        const copy=[...array];
        const moves=bubbleSort(copy);
        animate(moves);
    }
    count=1;
}

function insertionPlay(){
    if (count==0){
        const copy=[...array];
        const moves=insertionSort(copy);
        animate(moves);
    }
    count=1;
}

function selectionPlay(){
    if (count==0){
        const copy=[...array];
        const moves=selectionSort(copy);
        animate(moves);
    }
    count=1;
}

function shellPlay(){
    if (count==0){
        const copy=[...array];
        const moves=shellSort(copy);
        animate(moves);
    }
    count=1;
}


function animate(moves){
    if(moves.length==0){
        showBars();
        return;
    }
    const move =moves.shift();
    const [i,j]=move.indices;

    if(move.type=="swap"){
        [array[i],array[j]]=[array[j],array[i]];
    }
    playNote(200+array[i]*500);
    playNote(200+array[j]*500);

    showBars(move);
    setTimeout(function(){
        animate(moves);
    },75);   
}


function showBars(move){
    container.innerHTML="";
    for(let i=0;i<array.length;i++){
        const bar=document.createElement("div");
        bar.style.height=array[i]*100+"%";
        bar.classList.add("bar");

        if (move && move.indices.includes(i)){
            bar.style.backgroundColor=
                move.type=="swap"?"red":"green";
        }
        container.appendChild(bar);
    
    }
}
