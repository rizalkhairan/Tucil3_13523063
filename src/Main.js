import { ReadConfig } from './ConfigParser.js';
import { createInterface } from 'readline';
import { UCS } from './UCS.js';

const SEARCH_ALGORITHMS = {
    "1": "A*",
    "2": "UCS",
    "3": "Greedy",
}

function askQuestion(rl, query) {
    return new Promise(resolve => rl.question(query, (answer) => resolve(answer)));
}

async function main() {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const filename = await askQuestion(rl, "Enter the config file name: ");    
    let algoMsg = "Choose an algorithm:\n|";
    for (const [key, value] of Object.entries(SEARCH_ALGORITHMS)) {
        algoMsg += ` ${key}: ${value}`.padEnd(10, " ") + "|";
    }
    const algo = await askQuestion(rl, algoMsg + "\n");

    let puzzleState = null;
    try {
        puzzleState = ReadConfig(filename);
    } catch (error) {
        console.error("Error reading config file\n", error);
        rl.close();
        return;
    }

    // Validate algorithm choice
    if (!SEARCH_ALGORITHMS[algo]) {
        console.error("Invalid algorithm choice");
        rl.close();
        return;
    }

    switch (algo) {
        case "1":
            console.log("Running A* algorithm...");
            break;
        case "2":
            console.log("Running UCS algorithm...");
            puzzleState.nodeCount = 0;
            const start = performance.now();
            const goalNode = UCS(puzzleState);
            const end = performance.now();
            console.log("Total nodes visited: " + puzzleState.nodeCount);
            console.log("Time taken: " + (end - start) + " ms");
            if (goalNode !== null) {
                puzzleState.printPath(goalNode);
            } else {
                console.log("No solution found.");
            }
            break;
        case "3":
            console.log("Running Greedy algorithm...");
            break;
        default:
            console.error("Invalid algorithm choice");
            rl.close();
            return;
    }

    rl.close();
    return;
}

main();