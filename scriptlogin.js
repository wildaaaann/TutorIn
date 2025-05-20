// login.js

// Function to validate login credentials
function validateLogin(event) {
    event.preventDefault(); // Prevent form submission
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('error');

    // Check if the credentials are correct
    if (username === 'eko purnawan' && password === 'eko123') {
        // Set a flag in local storage to indicate the user is logged in
        localStorage.setItem('isLoggedIn', 'true');
        // Redirect to the dashboard or another page
        window.location.href = 'dashboard.html'; // Change this to your dashboard page
    } else {
        // Show error message
        errorMsg.style.display = 'block';
    }
}
