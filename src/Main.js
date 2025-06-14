import { createInterface } from 'readline';
import { writeFileSync } from 'fs';
import { ReadConfig } from './ConfigParser.js';
import { Pathfind } from './Pathfind.js';
import { distanceToDoor, nodesFromStart, piecesInFront, recursiveBlockers } from './Heuristics.js';

const SEARCH_ALGORITHMS = {
    "1": "A*",
    "2": "UCS",
    "3": "Greedy",
}
const HEURISTICS = {
    "1": {func: piecesInFront, desc: "Jumlah piece antara primary piece dan pintu"},
    "2": {func: distanceToDoor, desc: "Jarak primary piece ke pintu"},
}

function askQuestion(rl, query) {
    return new Promise(resolve => rl.question(query, (answer) => resolve(answer)));
}

async function main() {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const filename = await askQuestion(rl, "Nama file konfigurasi: ");    
    let algoMsg = "Pilih algoritma:\n|";
    for (const [key, value] of Object.entries(SEARCH_ALGORITHMS)) {
        algoMsg += ` ${key}: ${value}`.padEnd(10, " ") + "|";
    }
    const algo = await askQuestion(rl, algoMsg + "\n");
    let heuristicMsg = "Pilih heuristic:\n";
    for (const [key, value] of Object.entries(HEURISTICS)) {
        heuristicMsg += ` ${key}: ${value.desc}` + "\n";
    }
    if (!SEARCH_ALGORITHMS[algo]) {
        console.error("Invalid algorithm choice");
        rl.close();
        return;
    }
    if (SEARCH_ALGORITHMS[algo] !== "UCS") {
        var heuristic = await askQuestion(rl, heuristicMsg);
        if (!HEURISTICS[heuristic]) {
            console.error("Invalid heuristic choice");
            rl.close();
            return;
        }
    }
    
    let puzzleState = null;
    try {
        puzzleState = ReadConfig(filename);
    } catch (error) {
        console.error("Error reading config file\n", error);
        rl.close();
        return;
    }
    

    let start, end;
    let goalNode = null;
    switch (algo) {
        case "1":
            console.log("Running A* algorithm...");
            puzzleState.nodeCount = 0;

            start = performance.now();
            goalNode = Pathfind(puzzleState, nodesFromStart, HEURISTICS[heuristic].func);
            end = performance.now();
            break;
        case "2":
            console.log("Running UCS algorithm...");
            puzzleState.nodeCount = 0;

            start = performance.now();
            goalNode = Pathfind(puzzleState, nodesFromStart, null);
            end = performance.now();
            break;
        case "3":
            console.log("Running Greedy algorithm...");
            puzzleState.nodeCount = 0;

            start = performance.now();
            goalNode = Pathfind(puzzleState, null, HEURISTICS[heuristic].func);
            end = performance.now();
            break;
        default:
            console.error("Invalid algorithm choice");
            rl.close();
            return;
    }

    console.log("Total nodes visited: " + puzzleState.nodeCount);
    console.log("Time taken: " + (end - start) + " ms");
    if (goalNode !== null) {
        puzzleState.printPath(goalNode);
    } else {
        console.log("No solution found.");
    }

    const savePath = await askQuestion(rl, "Simpan ke file? (y/n): ");
    if (savePath.toLowerCase() === 'y') {
        const fileName = await askQuestion(rl, "Nama file : ");
        try {
            let pathStrings = [];
            pathStrings.push("Total nodes visited: " + puzzleState.nodeCount + "\n");
            pathStrings.push("Time taken: " + (end - start) + " ms\n");
            pathStrings.push("Algoritma: " + SEARCH_ALGORITHMS[algo] + "\n");
            if (heuristic !== undefined) {
                pathStrings.push("Heuristic: " + HEURISTICS[heuristic].desc + "\n");
            }
            pathStrings.push(puzzleState.printPath(goalNode, true));
            writeFileSync(fileName, pathStrings.join(""));

            console.log("Solusi disimpan ke " + fileName);
        } catch (error) {
            console.error("Error saving path to file\n", error);
        }
    }
    
    rl.close();
    return;
}

main();