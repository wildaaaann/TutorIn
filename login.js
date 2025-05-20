// login.js

// Function to validate login credentials
function validateLogin(event) {
    event.preventDefault(); // Prevent form submission
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Check if the credentials are correct
    if (username === 'admin' && password === 'admin1') {
        alert('Login successful!');
        // Redirect to the dashboard or another page
        window.location.href = 'dashboard.html'; // Change this to your dashboard page
    } else {
        alert('Invalid username or password. Please try again.');
    }
}
