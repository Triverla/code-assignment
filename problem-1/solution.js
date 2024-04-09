const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let numberOfJobs = 0;
let jobs = []; // holds the job details 
let jobCount = 0; // Track the current job being input

// Handle input prompt for number of jobs from terminal
const promptForJobs = () => {
    rl.question('Enter the number of Jobs\n', (input) => {
        const n = parseInt(input, 10);
        if (isNaN(n) || n < 1 || n > 9) {
            console.log('Number of jobs must be between 1 and 9.');
            promptForJobs();
        } else {
            numberOfJobs = n;
            console.log('Enter job start time, end time, and earnings');
            promptForJobDetails();
        }
    });
};

const promptForJobDetails = () => {
    if (jobCount < numberOfJobs) {
        rl.question('', (startTime) => {
            rl.question('', (endTime) => {
                rl.question('', (earnings) => {
                    const start = parseInt(startTime, 10);
                    const end = parseInt(endTime, 10);
                    const profit = parseInt(earnings, 10)

                    // Validate time constraints
                    if (start >= end || start < 0 || start > 2359 || end < 0 || end > 2359) {
                        console.log('Invalid time entry. Start time must be less than end time, and both must be between 0000 and 2359.');
                        promptForJobDetails(); // Re-Prompt for the same job if validation fails
                    } else {
                        jobs.push({ startTime: start, endTime: end, profit });
                        jobCount++;
                        // Continue prompting for job details until all job details are entered
                        if (jobCount < numberOfJobs) {
                            promptForJobDetails();
                        } else {
                            rl.close();
                        }
                    }
                });
            });
        });
    }
};

rl.on('close', () => {
    // Sort jobs by their end times
    jobs.sort((a, b) => a.endTime - b.endTime);
    const results = calculateMaximunProfit(jobs);
    console.log('The number of tasks and earnings available for others');
    console.log(`Task: ${jobs.length - results[0]}`);
    console.log(`Earnings: ${results[1]}`);
});

function calculateMaximunProfit(jobs) {
    const dpArr = Array(jobs.length).fill(0); // Initialize an array for dynamic programming
    dpArr[0] = jobs[0].profit;// Initialize the first entry with the first job's profit

    for (let i = 1; i < jobs.length; i++) {
        let includeProfit = jobs[i].profit;
        let lastIndex = -1;
        for (let j = i - 1; j >= 0; j--) {
            if (jobs[j].endTime <= jobs[i].startTime) {
                lastIndex = j;
                break;
            }
        }
        if (lastIndex !== -1) {
            includeProfit += dpArr[lastIndex];
        }
        // Update the dp array with the maximum profit
        dpArr[i] = Math.max(dpArr[i - 1], includeProfit);
    }

    // Calculate the total and remaining earnings
    const maxProfit = dpArr[dpArr.length - 1];
    const totalProfit = jobs.reduce((acc, job) => acc + job.profit, 0);
    const remainingEarnings = totalProfit - maxProfit;

    // Calculate the number of selected jobs for John from the dp array
    let selectedJobs = 0;
    let profitTrack = maxProfit;
    for (let i = dpArr.length - 1; i >= 0; i--) {
        if (profitTrack === dpArr[i] && i !== 0) continue;
        if (i === 0 && profitTrack > 0) selectedJobs++;
        else if (profitTrack !== dpArr[i - 1]) selectedJobs++;
        profitTrack -= jobs[i].profit;
        if (profitTrack <= 0) break;
    }

    return [
        selectedJobs,
        remainingEarnings,
    ];
}

promptForJobs();