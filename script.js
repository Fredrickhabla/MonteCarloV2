  // calculate probabilities and update the table
  function updateProbabilities() {
    let table = document.getElementById("probabilityTable").getElementsByTagName('tbody')[0];
    let totalDays = 0;

    // calculate total days
    for (let row of table.rows) {
        let days = parseFloat(row.cells[1].textContent) || 0;
        totalDays += days;
    }

    // update probabilities, cumulative probabilities, and RNI ranges
    let cumulativeProbability = 0;
    let cumulativeRNI = -1;

    for (let row of table.rows) {
        let days = parseFloat(row.cells[1].textContent) || 0;
        let probability = (days / totalDays).toFixed(2);
        cumulativeProbability += parseFloat(probability);
        row.cells[2].textContent = probability;

        // calculate RNI range
        let startRNI = cumulativeRNI + 1;
        let endRNI = Math.round(cumulativeProbability * 100) - 1;
        row.cells[4].textContent = `${startRNI}-${endRNI}`;

        // update cumulative probability
        row.cells[3].textContent = cumulativeProbability.toFixed(2);

        cumulativeRNI = endRNI;
    }

    // update the table based on the new RNI ranges
    updateIterationTable();
}

// update the table based on the probability table
function updateIterationTable() {
    let probabilityTable = document.getElementById("probabilityTable").getElementsByTagName('tbody')[0];
    let iterationTable = document.getElementById("iterationTable").getElementsByTagName('tbody')[0];

    // mapping of RNI ranges 
    let rniMapping = [];
    for (let row of probabilityTable.rows) {
        let customers = parseFloat(row.cells[0].textContent) || 0;
        let rniRange = row.cells[4].textContent.split("-");
        let startRNI = parseInt(rniRange[0]);
        let endRNI = parseInt(rniRange[1]);
        rniMapping.push({ start: startRNI, end: endRNI, customers: customers });
    }

    // Update the # of Customers in the Iteration Table
    let totalCustomers = 0;
    let rowCount = 0;

    for (let row of iterationTable.rows) {
        let randomNumberInput = row.cells[1].querySelector("input");
        if (randomNumberInput && randomNumberInput.value !== "") {
            let rni = parseInt(randomNumberInput.value);
            for (let entry of rniMapping) {
                if (rni >= entry.start && rni <= entry.end) {
                    let customers = entry.customers;
                    row.cells[2].textContent = customers;
                    totalCustomers += customers;
                    rowCount++;
                    break;
                }
            }
        }
    }

    // Calculate and display the average number of customers
    let averageCustomers = rowCount > 0 ? (totalCustomers / rowCount).toFixed(2) : 0;
    document.getElementById("averageCustomers").textContent = averageCustomers;
}



// auto-fill random numbers in the table
function autoFillRandomNumbers() {
    let iterationTable = document.getElementById("iterationTable").getElementsByTagName('tbody')[0];
    for (let row of iterationTable.rows) {
        let randomNumberInput = row.cells[1].querySelector("input");
        if (randomNumberInput) {
            // random number between 0 and 99
            let randomNumber = Math.floor(Math.random() * 100);
            randomNumberInput.value = randomNumber;

            randomNumberInput.dispatchEvent(new Event('change'));
        }
    }
}

// add a row to the table
function addRow() {
    let table = document.getElementById("iterationTable").getElementsByTagName('tbody')[0];
    let rowCount = table.rows.length + 1;
    let row = table.insertRow();

    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);

    cell1.textContent = rowCount;
    let input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.max = "99";
    input.onchange = function() {
        updateIterationTable(); 
    };
    cell2.appendChild(input);

    // to select/deselect the row
    row.addEventListener("click", function() {
        if (this.classList.contains("selected")) {
            this.classList.remove("selected");
        } else {
            let selectedRow = table.querySelector(".selected");
            if (selectedRow) {
                selectedRow.classList.remove("selected");
            }
            this.classList.add("selected");
        }
    });
}

// delete the selected row
function deleteSelectedRow() {
    let table = document.getElementById("iterationTable").getElementsByTagName('tbody')[0];
    let selectedRow = table.querySelector(".selected");
    if (selectedRow) {
        table.deleteRow(selectedRow.rowIndex - 1);
        updateRowNumbers();
    }
}

//update row numbers in the table
function updateRowNumbers() {
    let table = document.getElementById("iterationTable").getElementsByTagName('tbody')[0];
    for (let i = 0; i < table.rows.length; i++) {
        table.rows[i].cells[0].textContent = i + 1;
    }
}

// save changes
function saveChanges() {

    updateProbabilities();

    alert("Changes saved! The table has been updated.");
}

for (let i = 0; i < 10; i++) {
    addRow();
}

updateProbabilities();