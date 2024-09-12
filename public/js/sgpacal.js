function handleGenerataeForms() {
    const subjectInput = document.querySelector('.insideContainer input[type="text"]');
    const numberOfSubjects = parseInt(subjectInput.value);

    if (isNaN(numberOfSubjects) || numberOfSubjects <= 0) {
        displayError('Please enter a valid positive number of subjects.');
        return;
    }

    clearError();
    let outerBox = document.querySelector('.outerBox') || createOuterBox();
    let formsContainer = document.querySelector('.formsContainer') || createFormsContainer(outerBox);
    formsContainer.innerHTML = ''; // Clear previous content

    for (let i = 0; i < numberOfSubjects; i++) {
        formsContainer.appendChild(createFormRow(i + 1));
    }

    createButton('submitBtn', 'Get Your Results', 'btn-success', handleSubmit);
    createButton('resetBtn', 'Reset', 'btn-secondary mx-2', handleReset);
}

function createOuterBox() {
    const outerBox = document.createElement('div');
    outerBox.classList.add('container-xl', 'outerBox');
    document.body.appendChild(outerBox);
    return outerBox;
}

function createFormsContainer(outerBox) {
    const formsContainer = document.createElement('div');
    formsContainer.classList.add('formsContainer');
    outerBox.appendChild(formsContainer);
    return formsContainer;
}

function createFormRow(index) {
    const formRow = document.createElement('div');
    formRow.classList.add('row', 'g-3', 'align-items-center', 'innerForm');
    formRow.innerHTML = `
        <div class="col-auto">
            <label for="inputSubject${index}" class="col-form-label">Subject ${index}</label>
        </div>
        <div class="col-auto">
            <input type="text" id="inputSubject${index}" class="form-control inputSubject${index}" placeholder="Enter credits">
        </div>
        <div class="col-auto">
            <button class="btn btn-secondary dropdown-toggle" id="dropdownButton${index}" data-bs-toggle="dropdown">
                Choose Expected Grade
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

function createButton(className, text, btnClass, handler) {
    let button = document.querySelector(`.${className}`);
    if (!button) {
        button = document.createElement('button');
        button.classList.add('btn', btnClass, className);
        button.innerText = text;
        button.onclick = handler;
        const buttonContainer = document.querySelector('.button-container') || createButtonContainer();
        buttonContainer.appendChild(button);
    }
}

function createButtonContainer() {
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    document.body.appendChild(buttonContainer);
    return buttonContainer;
}

function selectGrade(subjectIndex, grade) {
    document.getElementById(`dropdownButton${subjectIndex}`).textContent = grade;
}

function handleSubmit() {
    const gradeMap = new Map([['O', 10], ['A+', 9], ['A', 8], ['B+', 7], ['B', 6], ['C+', 5], ['C', 4], ['D', 3], ['Absent', 0], ['F', 0]]);
    const subjectInput = document.querySelector('.insideContainer input[type="text"]');
    const numberOfSubjects = parseInt(subjectInput.value);
    let totalGradeSum = 0, totalCreditsSum = 0, failedSubjects = 0, absentSubjects = 0;

    clearError();

    for (let i = 0; i < numberOfSubjects; i++) {
        const credit = parseInt(document.querySelector(`.inputSubject${i + 1}`).value);
        const grade = document.getElementById(`dropdownButton${i + 1}`).textContent;

        if (isNaN(credit) || credit <= 0 || !gradeMap.has(grade)) {
            displayError(`Invalid credit or grade for Subject ${i + 1}`);
            return;
        }

        if (grade === 'F') failedSubjects++;
        else if (grade === 'Absent') absentSubjects++;
        else {
            totalCreditsSum += credit;
            totalGradeSum += credit * gradeMap.get(grade);
        }
    }

    if (totalCreditsSum === 0) {
        displayError('No valid subjects to calculate SGPA.');
        return;
    }

    showSGPA((totalGradeSum / totalCreditsSum).toFixed(2), failedSubjects, absentSubjects);
}

function handleReset() {
    document.querySelector('.formsContainer').innerHTML = '';
    document.querySelector('.button-container').remove();
}

function showSGPA(sgpa, failedSubjects, absentSubjects) {
    document.body.innerHTML = `
        <div class="container-md" style="border: 2px solid #00796b; text-align: center; border-radius: 12px; padding: 20px; background-color: #fff; box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); margin: 10px;">
            <h1>Congratulations!!</h1>
            <p>Your SGPA is:</p>
            <p style="font-size: 2rem; font-weight: bold;">${sgpa}</p>
            ${failedSubjects > 0 ? `<p style="color: #f44336;">You have failed ${failedSubjects} subject(s).</p>` : ''}
            ${absentSubjects > 0 ? `<p style="color: #f44336;">You are absent in ${absentSubjects} subject(s).</p>` : ''}
        </div>
    `;
    Object.assign(document.body.style, {
        display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', margin: '0', backgroundColor: '#e0f7fa', fontFamily: "'Poppins', sans-serif"
    });
}

function displayError(message) {
    let errorContainer = document.querySelector('.errorContainer') || createErrorContainer();
    errorContainer.textContent = message;
}

function createErrorContainer() {
    const errorContainer = document.createElement('div');
    errorContainer.classList.add('alert', 'alert-danger', 'errorContainer');
    document.querySelector('.formsContainer').before(errorContainer);
    return errorContainer;
}

function clearError() {
    const errorContainer = document.querySelector('.errorContainer');
    if (errorContainer) errorContainer.remove();
}
