function generateFields() {
    const numSemesters = document.getElementById('num-semesters').value;
    const sgpaFieldsContainer = document.getElementById('sgpa-fields');
    sgpaFieldsContainer.innerHTML = ''; // Clear any existing fields

    if (numSemesters < 1 || numSemesters > 12) {
        alert('Please enter a valid number of semesters (1-12).');
        return;
    }

    for (let i = 1; i <= numSemesters; i++) {
        const field = document.createElement('div');
        field.classList.add('sgpa-field');
        field.innerHTML = `
            <label for="sgpa-${i}">SGPA for Semester ${i}:</label>
            <input type="number" id="sgpa-${i}" min="0" max="10" step="0.01" required>
        `;
        sgpaFieldsContainer.appendChild(field);
    }
}

function resetFields() {
    document.getElementById('num-semesters').value = '';
    document.getElementById('sgpa-fields').innerHTML = '';
    document.getElementById('cgpa-result').innerHTML = '';
}


document.getElementById('cgpa-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const numSemesters = document.getElementById('num-semesters').value;
    const sGpaValues = [];

    for (let i = 1; i <= numSemesters; i++) {
        const sgpa = parseFloat(document.getElementById(`sgpa-${i}`).value);
        if (isNaN(sgpa) || sgpa < 0 || sgpa > 10) {
            alert(`Please enter a valid SGPA for Semester ${i} (0-10).`);
            return;
        }
        sGpaValues.push(sgpa);
    }

    const cgpa = sGpaValues.reduce((total, sgpa) => total + sgpa, 0) / numSemesters;
    document.getElementById('cgpa-result').innerHTML = `Your CGPA is: ${cgpa.toFixed(2)}`;
});
