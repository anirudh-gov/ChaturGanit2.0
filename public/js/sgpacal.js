function handleGenerataeForms() {
    const subjectInput = document.querySelector('.insideContainer input[type="text"]');
    const numberOfSubjects = parseInt(subjectInput.value);

    // Create or get the outerBox container
    let outerBox = document.querySelector('.outerBox');

    if (!outerBox) {
        // Create the outerBox container if it doesn't exist
        outerBox = document.createElement('div');
        outerBox.classList.add('container-xl', 'outerBox');
        document.body.appendChild(outerBox);
    }

    // Create or get the formsContainer inside outerBox
    let formsContainer = document.querySelector('.formsContainer');
    
    if (!formsContainer) {
        formsContainer = document.createElement('div');
        formsContainer.classList.add('formsContainer');
        outerBox.appendChild(formsContainer);
    } else {
        formsContainer.innerHTML = ''; // Clear existing content in formsContainer
    }

    if (isNaN(numberOfSubjects) || numberOfSubjects <= 0) {
        displayError('Please enter a valid positive number of subjects.');
        return;
    }

    clearError();

    for (let i = 0; i < numberOfSubjects; i++) {
        const formRow = document.createElement('div');
        formRow.classList.add('row', 'g-3', 'align-items-center', 'innerForm');

        formRow.innerHTML = `
            <div class="col-auto">
                <label for="inputSubject${i + 1}" class="col-form-label">Subject ${i + 1}</label>
            </div>
            <div class="col-auto">
                <input type="text" id="inputSubject${i + 1}" class="form-control inputSubject${i + 1}" aria-label="Enter the credits of Subject ${i + 1}" placeholder="Enter credits">
            </div>
            <div class="col-auto">
                <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownButton${i + 1}" aria-label="Choose Expected Grade for Subject ${i + 1}" data-bs-toggle="dropdown" aria-expanded="false">
                        Choose Expected Grade
                    </button>
                    <ul class="dropdown-menu">
                        <li class="dropdown-item" onclick="selectGrade(${i + 1}, 'O')">O</li>
                        <li class="dropdown-item" onclick="selectGrade(${i + 1}, 'A+')">A+</li>
                        <li class="dropdown-item" onclick="selectGrade(${i + 1}, 'A')">A</li>
                        <li class="dropdown-item" onclick="selectGrade(${i + 1}, 'B+')">B+</li>
                        <li class="dropdown-item" onclick="selectGrade(${i + 1}, 'B')">B</li>
                        <li class="dropdown-item" onclick="selectGrade(${i + 1}, 'C+')">C+</li>
                        <li class="dropdown-item" onclick="selectGrade(${i + 1}, 'C')">C</li>
                        <li class="dropdown-item" onclick="selectGrade(${i + 1}, 'D')">D</li>
                        <li class="dropdown-item" onclick="selectGrade(${i + 1}, 'F')">F</li>
                        <li class="dropdown-item" onclick="selectGrade(${i + 1}, 'Absent')">Absent</li>
                    </ul>
                </div>
            </div>
        `;

        formsContainer.appendChild(formRow);
    }

    // Create or get the submit button element
    let submitBtn = document.querySelector('.submitBtn');
    if (!submitBtn) {
        submitBtn = document.createElement('button');
        submitBtn.classList.add('btn', 'btn-success', 'submitBtn');
        submitBtn.innerText = 'Get Your Results';
        submitBtn.onclick = handleSubmit;

        let buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');
        buttonContainer.appendChild(submitBtn);

        document.body.appendChild(buttonContainer);
    }

    // Add Reset button to reset form
    let resetBtn = document.querySelector('.resetBtn');
    if (!resetBtn) {
        resetBtn = document.createElement('button');
        resetBtn.classList.add('btn', 'btn-secondary', 'resetBtn', 'mx-2');
        resetBtn.innerText = 'Reset';
        resetBtn.onclick = handleReset;

        let buttonContainer = document.querySelector('.button-container');
        buttonContainer.appendChild(resetBtn);
    }
}

// Select grade function
function selectGrade(subjectIndex, grade) {
    const dropdownButton = document.getElementById(`dropdownButton${subjectIndex}`);
    dropdownButton.textContent = grade;
}

// Handle form submission
function handleSubmit() {
    const gradeMap = new Map([
        ['O', 10], ['A+', 9], ['A', 8], ['B+', 7], ['B', 6],
        ['C+', 5], ['C', 4], ['D', 3], ['Absent', 0], ['F', 0]
    ]);

    const subjectInput = document.querySelector('.insideContainer input[type="text"]');
    const numberOfSubjects = parseInt(subjectInput.value);
    let totalGradeSum = 0, totalCreditsSum = 0;
    let hasError = false, failedSubjects = 0;

    clearError();

    for (let i = 0; i < numberOfSubjects; i++) {
        const tempInput = document.querySelector(`.formsContainer .inputSubject${i + 1}`);
        const value = parseInt(tempInput.value);

        // Validation for valid credit input
        if (isNaN(value) || value <= 0 || value > 10) {
            displayError(`Please enter a valid credit (1-10) for Subject ${i + 1}`);
            tempInput.focus();  // Focus on the first invalid input
            hasError = true;
            break;
        }

        const dropdownButton = document.getElementById(`dropdownButton${i + 1}`);
        const grade = dropdownButton.textContent;

        if (!gradeMap.has(grade)) {
            displayError(`Please select a valid grade for Subject ${i + 1}`);
            hasError = true;
            break;
        }

        if (grade === 'F' || grade === 'Absent') {
            failedSubjects++;
            continue;
        }

        totalCreditsSum += value;
        totalGradeSum += value * gradeMap.get(grade);
    }

    if (!hasError) {
        if (totalCreditsSum === 0) {
            displayError('No valid subjects to calculate SGPA.');
            return;
        }

        const sgpa = (totalGradeSum / totalCreditsSum).toFixed(2);
        showSGPA(sgpa, failedSubjects);
    }
}

// Reset form
function handleReset() {
    document.querySelector('.formsContainer').innerHTML = '';
    document.querySelector('.button-container').remove();
}

// Mobile Responsiveness
document.head.insertAdjacentHTML('beforeend', `
    <style>
        @media only screen and (max-width: 600px) {
            .row { flex-direction: column; }
            .button-container { text-align: center; }
        }
    </style>
`);

function selectGrade(subjectIndex, grade) {
    const dropdownButton = document.getElementById(`dropdownButton${subjectIndex}`);
    dropdownButton.textContent = grade;
}

function handleSubmit() {
    const gradeMap = new Map([
        ['O', 10],
        ['A+', 9],
        ['A', 8],
        ['B+', 7],
        ['B', 6],
        ['C+', 5],
        ['C', 4],
        ['D', 3],
        ['Absent',0],
        ['F', 0],  // F grade points are 0, but we'll ignore failed subjects in the calculation
    ]);

    const subjectInput = document.querySelector('.insideContainer input[type="text"]');
    const numberOfSubjects = parseInt(subjectInput.value);
    let totalGradeSum = 0, totalCreditsSum = 0;
    let hasError = false;
    let failedSubjects = 0;  // Counter for failed subjects
    let absentSubjects = 0;

    for (let i = 0; i < numberOfSubjects; i++) {
        const tempInput = document.querySelector(`.formsContainer .inputSubject${i + 1}`);
        const value = parseInt(tempInput.value);
        
        if (isNaN(value) || value <= 0) {
            displayError(`Please enter a valid credit for Subject ${i + 1}`);
            hasError = true;
            break;
        }

        const dropdownButton = document.getElementById(`dropdownButton${i + 1}`);
        const grade = dropdownButton.textContent;

        if (!gradeMap.has(grade)) {
            displayError(`Please select a valid grade for Subject ${i + 1}`);
            hasError = true;
            break;
        }

        // Check for failed subject
        if (grade === 'F') {
            failedSubjects++;  // Increment failed subject count
            continue;  // Skip failed subjects from calculation
        }
        if (grade === 'Absent') {
            absentSubjects++;  // Count the subject as absent
            continue;  // Skip absent subjects from the calculation
        }

        totalCreditsSum += value;
        let currValue = value * gradeMap.get(grade);
        totalGradeSum += currValue;
    }

    if (!hasError) {
        if (totalCreditsSum === 0) {
            displayError('No valid subjects to calculate SGPA.');
            return;
        }

        const sgpa = (totalGradeSum / totalCreditsSum).toFixed(2);
        showSGPA(sgpa, failedSubjects,absentSubjects);
    }
}

function showSGPA(sgpa, failedSubjects,absentSubjects) {
    document.body.innerHTML = '';
    document.body.style.display = 'flex';
    document.body.style.justifyContent = 'center';
    document.body.style.alignItems = 'center';
    document.body.style.height = '100vh';
    document.body.style.margin = '0';
    document.body.style.backgroundColor = '#e0f7fa'; // Light cyan background
    document.body.style.fontFamily = "'Poppins', sans-serif";

    const sgpaContainer = document.createElement('div');
    sgpaContainer.classList.add('container-md');

    const heading = document.createElement('h1');
    heading.textContent = 'Congratulations!!';
    sgpaContainer.appendChild(heading);

    const sgpaText = document.createElement('p');
    sgpaText.textContent = 'Your SGPA is:';
    sgpaContainer.appendChild(sgpaText);

    const sgpaValue = document.createElement('p');
    sgpaValue.textContent = sgpa;
    sgpaValue.style.fontSize = '2rem'; // Increase the font size for emphasis
    sgpaValue.style.fontWeight = 'bold'; // Make it bold
    sgpaContainer.appendChild(sgpaValue);

    if (failedSubjects > 0) {
        const failedInfo = document.createElement('p');
        failedInfo.textContent = `You have failed ${failedSubjects} subject(s). The credits for these subjects are not included in the calculation.`;
        failedInfo.style.color = '#f44336'; // Red color for failed subject message
        sgpaContainer.appendChild(failedInfo);
    }

    if (absentSubjects > 0) {
        const failedInfo = document.createElement('p');
        failedInfo.textContent = `You are absent ${absentSubjects} subject(s). The credits for these subjects are not included in the calculation.`;
        failedInfo.style.color = '#f44336'; // Red color for failed subject message
        sgpaContainer.appendChild(failedInfo);
    }

    sgpaContainer.style.border = '2px solid #00796b';
    sgpaContainer.style.textAlign = 'center';
    sgpaContainer.style.borderRadius = '12px';
    sgpaContainer.style.padding = '20px';
    sgpaContainer.style.backgroundColor = '#ffffff'; // White background for the container
    sgpaContainer.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)'; 
    sgpaContainer.style.margin = '10px';

    document.body.appendChild(sgpaContainer);
}

function displayError(message) {
    let errorContainer = document.querySelector('.errorContainer');
    
    if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.classList.add('alert', 'alert-danger', 'errorContainer');
        const formsContainer = document.querySelector('.formsContainer');
        formsContainer.parentNode.insertBefore(errorContainer, formsContainer);
    }
    
    errorContainer.textContent = message;
}

function clearError() {
    const errorContainer = document.querySelector('.errorContainer');
    if (errorContainer) {
        errorContainer.remove();
    }
}
