// Attach an event listener to the form to prevent it from refreshing the page
document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent page refresh
    handleGenerateForms();  // Call your form generation logic
});

function handleGenerateForms() {
    const numberOfSubjects = parseInt(document.getElementById('subjectCount').value);
    
    if (isNaN(numberOfSubjects) || numberOfSubjects <= 0) {
        showError('Please enter a valid positive number of subjects.');
        return;
    }
    
    clearError();
    
    const formContainer = document.getElementById('formContainer');
    formContainer.innerHTML = '';
    
    for (let i = 0; i < numberOfSubjects; i++) {
        formContainer.appendChild(createFormRow(i + 1));
    }
    
    addButtons();
    
    // Hide the outer box and show the form container
    document.querySelector('.outerBox').style.display = 'none';
    formContainer.style.display = 'flex';  // Ensure form container is displayed
    document.querySelector('.button-container').style.display = 'flex';  // Ensure buttons are visible
}

function createFormRow(index) {
    const formRow = document.createElement('div');
    formRow.classList.add('row', 'g-3', 'align-items-center', 'innerForm'); // Ensure 'innerForm' class is applied
    formRow.innerHTML = `
        <div class="col-auto">
            <label for="inputSubject${index}" class="col-form-label">Subject ${index}</label>
        </div>
        <div class="col-auto">
            <input type="number" id="inputSubject${index}" class="form-control" placeholder="Enter credits" min="1">
        </div>
        <div class="col-auto">
            <button class="btn btn-secondary dropdown-toggle" id="dropdownButton${index}" data-bs-toggle="dropdown">
                Choose Grade
            </button>
            <ul class="dropdown-menu">
                ${['O', 'A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F', 'Absent'].map(grade => `
                    <li class="dropdown-item" onclick="selectGrade(${index}, '${grade}')">${grade}</li>
                `).join('')}
            </ul>
        </div>
    `;
    return formRow;
}

function addButtons() {
    const buttonContainer = document.querySelector('.button-container') || createButtonContainer();
    buttonContainer.innerHTML = `
        <button class="btn btn-success" onclick="calculateSGPA()">Get Your GPA</button>
        <button class="btn btn-secondary mx-2" onclick="resetForm()">Reset</button>
    `;
}

function createButtonContainer() {
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    document.querySelector('.container').appendChild(buttonContainer);
    return buttonContainer;
}

function selectGrade(subjectIndex, grade) {
    document.getElementById(`dropdownButton${subjectIndex}`).textContent = grade;
}

function calculateSGPA() {
    const gradeMap = { 'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C+': 5, 'C': 4, 'D': 3, 'Absent': 0, 'F': 0 };
    const numberOfSubjects = parseInt(document.getElementById('subjectCount').value);
    let totalGradeSum = 0, totalCreditsSum = 0;

    for (let i = 0; i < numberOfSubjects; i++) {
        const credit = parseInt(document.getElementById(`inputSubject${i + 1}`).value);
        const grade = document.getElementById(`dropdownButton${i + 1}`).textContent;

        if (isNaN(credit) || credit <= 0 || !gradeMap.hasOwnProperty(grade)) {
            showError(`Invalid input for Subject ${i + 1}`);
            return;
        }
        totalCreditsSum += credit;
        totalGradeSum += credit * gradeMap[grade];
    }

    if (totalCreditsSum === 0) {
        showError('No valid credits to calculate GPA.');
        return;
    }

    showResult((totalGradeSum / totalCreditsSum).toFixed(2));
}

function showResult(gpa) {
    const resultContainer = document.getElementById('resultContainer');
    resultContainer.innerHTML = `<h4>Your GPA: ${gpa}</h4>`;
    resultContainer.style.display = 'block';
}

function resetForm() {
    const numberOfSubjects = parseInt(document.getElementById('subjectCount').value);

    for (let i = 0; i < numberOfSubjects; i++) {
        // Clear input values
        document.getElementById(`inputSubject${i + 1}`).value = '';

        // Reset dropdowns to default text
        document.getElementById(`dropdownButton${i + 1}`).textContent = 'Choose Grade';
    }

    document.getElementById('resultContainer').style.display = 'none';
    clearError();
}


function showError(message) {
    let alert = document.querySelector('.alert-danger');
    if (!alert) {
        alert = document.createElement('div');
        alert.classList.add('alert', 'alert-danger');
        document.querySelector('.container').insertBefore(alert, document.querySelector('.insideContainer'));
    }
    alert.textContent = message;
    alert.style.display = 'block';
}

function clearError() {
    const alert = document.querySelector('.alert-danger');
    if (alert) {
        alert.style.display = 'none';
    }
}
