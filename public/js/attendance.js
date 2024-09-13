document.addEventListener("DOMContentLoaded", function () {
    // Function to calculate current attendance percentage
    function calculateCurrentAttendance() {
        const totalClasses = parseFloat(document.getElementById("total-classes").value);
        const attendedClasses = parseFloat(document.getElementById("attended-classes").value);

        if (isNaN(totalClasses) || isNaN(attendedClasses) || totalClasses <= 0 || attendedClasses < 0) {
            alert("Please enter valid numbers. Total classes must be greater than 0, and attended classes cannot be negative.");
            return;
        }
        if (attendedClasses > totalClasses) {
            alert("Attended classes cannot exceed total classes.");
            return;
        }

        const currentPercentage = (attendedClasses / totalClasses) * 100;
        document.getElementById("attendance-percentage-result").textContent = `Your current attendance is ${currentPercentage.toFixed(2)}%.`;
        document.getElementById("attendance-percentage-result").style.opacity = 1;
    }

    // Function to calculate minimum classes required for target attendance
    function calculateMinimumClasses() {
        const attendedClasses = parseFloat(document.getElementById("current-attended").value);
        const totalClassesHeldSoFar = parseFloat(document.getElementById("current-total").value);
        const semesterTotalClasses = parseFloat(document.getElementById("semester-total").value);
        const targetAttendance = parseFloat(document.getElementById("target-percentage").value);

        if (isNaN(attendedClasses) || isNaN(totalClassesHeldSoFar) || isNaN(semesterTotalClasses) || isNaN(targetAttendance) || totalClassesHeldSoFar <= 0 || semesterTotalClasses <= totalClassesHeldSoFar || targetAttendance <= 0 || attendedClasses < 0) {
            alert("Please enter valid numbers. Total classes and target percentage must be greater than 0, and attended classes cannot be negative.");
            return;
        }

        // Calculate the number of additional classes needed
        const targetAttendanceDecimal = targetAttendance / 100;
        const currentAttendanceDecimal = attendedClasses / totalClassesHeldSoFar;
        const totalClassesNeeded = Math.ceil((targetAttendanceDecimal * semesterTotalClasses) - attendedClasses);
        const additionalClassesNeeded = Math.max(0, totalClassesNeeded - (semesterTotalClasses - totalClassesHeldSoFar));

        if (additionalClassesNeeded <= 0) {
            document.getElementById("minimum-classes-result").textContent = "You already meet or exceed the target attendance.";
        } else if (additionalClassesNeeded > (semesterTotalClasses - totalClassesHeldSoFar)) {
            document.getElementById("minimum-classes-result").textContent = "It is not possible to achieve the target attendance even if you attend all remaining classes.";
        } else {
            document.getElementById("minimum-classes-result").textContent = `You need to attend at least ${additionalClassesNeeded} more classes to achieve ${targetAttendance}% attendance.`;
        }
        document.getElementById("minimum-classes-result").style.opacity = 1;
    }

    // Function to calculate the number of classes that can be missed
    function calculateDeficit() {
        const totalClasses = parseFloat(document.getElementById("deficit-current-total").value);
        const attendedClasses = parseFloat(document.getElementById("deficit-current-attended").value);
        const requiredAttendance = parseFloat(document.getElementById("required-percentage").value);

        if (isNaN(totalClasses) || isNaN(attendedClasses) || isNaN(requiredAttendance) || totalClasses <= 0 || requiredAttendance <= 0 || attendedClasses < 0) {
            alert("Please enter valid numbers. Total classes and required percentage must be greater than 0, and attended classes cannot be negative.");
            return;
        }
        if (attendedClasses > totalClasses) {
            alert("Attended classes cannot exceed total classes.");
            return;
        }

        const maxMissable = Math.floor(((100 * attendedClasses) - (requiredAttendance * totalClasses)) / requiredAttendance);
        if (maxMissable < 0) {
            document.getElementById("deficit-result").textContent = "You cannot miss any more classes without falling below the required attendance percentage.";
        } else {
            document.getElementById("deficit-result").textContent = `You can miss up to ${maxMissable} more classes and still maintain ${requiredAttendance}% attendance.`;
        }
        document.getElementById("deficit-result").style.opacity = 1;
    }

    // Function to predict attendance based on current patterns
// Function to predict attendance based on current patterns
function predictAttendance() {
    const totalClasses = parseFloat(document.getElementById("predict-total").value);
    const attendedClasses = parseFloat(document.getElementById("predict-attended").value);
    const futureClasses = parseFloat(document.getElementById("future-classes").value);

    if (isNaN(totalClasses) || isNaN(attendedClasses) || isNaN(futureClasses) || totalClasses <= 0 || attendedClasses < 0 || futureClasses < 0) {
        alert("Please enter valid numbers. Total classes and future classes must be greater than 0, and attended classes cannot be negative.");
        return;
    }

    const predictedAttendance = ((attendedClasses + futureClasses) / (totalClasses + futureClasses)) * 100;
    document.getElementById("class-predictor-result").textContent = `If you attend all future classes, your predicted attendance will be ${predictedAttendance.toFixed(2)}%.`;
    document.getElementById("class-predictor-result").style.opacity = 1;
}


    // Function to reset all input fields and results
    function resetFields() {
        const inputs = document.querySelectorAll("input[type='number']");
        inputs.forEach(input => input.value = "");
        const results = document.querySelectorAll("div[id$='result']");
        results.forEach(result => {
            result.textContent = "";
            result.style.opacity = 0;
        });
    }

    // Event Listeners
    document.getElementById("current-attendance-btn").addEventListener("click", calculateCurrentAttendance);
    document.getElementById("minimum-classes-btn").addEventListener("click", calculateMinimumClasses);
    document.getElementById("deficit-btn").addEventListener("click", calculateDeficit);
    document.getElementById("predictor-btn").addEventListener("click", predictAttendance);
    document.querySelector(".reset-btn").addEventListener("click", resetFields);
});
