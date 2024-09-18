// Attach an event listener to the form to validate it upon submission
document.querySelector('form').addEventListener('submit', function(event) {
    if (!this.checkValidity()) {
        event.preventDefault();  // Prevent form submission if the form is invalid
    }
    handleGenerateForms();
});

function handleGenerateForms() {
    const numberOfSubjects = parseInt(document.getElementById('subjectCount').value);

    if (isNaN(numberOfSubjects) || numberOfSubjects <= 0 || numberOfSubjects > 20) {
        document.getElementById('subjectCount').setCustomValidity('Please enter a number between 1 and 20.');
        return;
    } else {
        document.getElementById('subjectCount').setCustomValidity('');  // Clear custom error
    }

    const formContainer = document.getElementById('formContainer');
    formContainer.innerHTML = ''; // Clear previous inputs

    for (let i = 0; i < numberOfSubjects; i++) {
        formContainer.appendChild(createFormRow(i + 1));
    }

    addButtons();

    // Show form container
    document.querySelector('.outerBox').style.display = 'none';
    formContainer.style.display = 'flex';
    document.querySelector('.button-container').style.display = 'flex';
}

function createFormRow(index) {
    const formRow = document.createElement('div');
    formRow.classList.add('row', 'g-3', 'align-items-center', 'innerForm'); // Ensure 'innerForm' class is applied
    formRow.innerHTML = `
        <div class="col-auto">
            <label for="inputSubject${index}" class="col-form-label">Subject ${index}</label>
        </div>
        <div class="col-auto">
            <input type="number" id="inputSubject${index}" class="form-control" placeholder="Enter credits" min="1" required>
        </div>
        <div class="col-auto">
            <button class="btn btn-secondary dropdown-toggle" id="dropdownButton${index}" data-bs-toggle="dropdown" required>
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
        <button class="btn btn-success" type="button" onclick="calculateSGPA()">Get Your GPA</button>
        <button class="btn btn-secondary mx-2" type="reset" onclick="resetForm()">Reset</button>
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

    let hasError = false; // To track if there's an error

    // Loop through each subject to calculate total credits and grade
    for (let i = 0; i < numberOfSubjects; i++) {
        const creditInput = document.getElementById(`inputSubject${i + 1}`);
        const credit = parseInt(creditInput.value);
        const grade = document.getElementById(`dropdownButton${i + 1}`).textContent;

        if (creditInput.value === '' || isNaN(credit) || credit <= 0) {
            creditInput.setCustomValidity('Please enter a valid credit.');
            creditInput.reportValidity(); // Display the error
            hasError = true;
            break;
        } else {
            creditInput.setCustomValidity(''); // Clear error if valid
        }

        if (!gradeMap.hasOwnProperty(grade)) {
            document.getElementById(`dropdownButton${i + 1}`).setCustomValidity('Please choose a grade.');
            document.getElementById(`dropdownButton${i + 1}`).reportValidity();
            hasError = true;
            break;
        } else {
            document.getElementById(`dropdownButton${i + 1}`).setCustomValidity('');
        }

        totalCreditsSum += credit;
        totalGradeSum += credit * gradeMap[grade];
    }

    if (hasError) return;

    if (totalCreditsSum === 0) {
        alert('No valid credits to calculate GPA.');
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
}
