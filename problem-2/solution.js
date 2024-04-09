const fs = require('fs');

const OUTPUT_FILENAME = 'output.txt';

// Read input file
const readInputFile = (filename) => {
    if (!fs.existsSync(filename)) { // Check if input file exists
        console.error(`Input file '${filename}' does not exist.`);
        process.exit(1);
    }

    const data = fs.readFileSync(filename, 'utf8');
    const lines = data.split('\n');
    const numOfEmployees = parseInt(lines[0].split(': ')[1]); // Extract number of employees
    const goodies = lines.slice(2).map(line => { // Extract goodies and prices
        const [name, price] = line.split(': ');
        return { name, price: parseInt(price) };
    });

    return { numOfEmployees, goodies };
};

// Write to output file
const writeOutputFile = (filename, output) => {
    fs.writeFileSync(filename, output);
};

// Find minimum difference between highest and lowest priced goodies
const findMinimumDifference = (goodies, numOfEmployees) => {
    goodies.sort((a, b) => a.price - b.price);

    let minDiff = Infinity;
    let selectedGoodies = [];

    for (let i = 0; i <= goodies.length - numOfEmployees; i++) {
        const diff = goodies[i + numOfEmployees - 1].price - goodies[i].price; // Calculate price difference

        // Update minimum difference and selected goodies if a smaller difference is found
        if (diff < minDiff) {
            minDiff = diff;
            selectedGoodies = goodies.slice(i, i + numOfEmployees);
        }
    }

    return { selectedGoodies, minDiff };
};

const distributeGoodies = (inputFilename) => {
    const { numOfEmployees, goodies } = readInputFile(inputFilename);
    const { selectedGoodies, minDiff } = findMinimumDifference(goodies, numOfEmployees);

    let output = `The goodies selected for distribution are:\n`;
    selectedGoodies.forEach(goodie => {
        output += `${goodie.name}: ${goodie.price}\n`;
    });
    output += `And the difference between the chosen goodie with highest price and the lowest price is ${minDiff}`;

    writeOutputFile(OUTPUT_FILENAME, output);
};

// Run the function with input file
distributeGoodies('input.txt');
