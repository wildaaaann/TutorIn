// login.js

// Function to validate login credentials
function validateLogin(event) {
    event.preventDefault(); // Prevent form submission
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('error');

    // Check if the credentials are correct
    if (username === 'ST001' && password === 'eko123') 
    {
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'dashboard.html';
    }
    else if (username === 'LEC001' && password === 'dedi123')
    {
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'dashboard_lec.html'; 
    }
    else 
    {
        // Show error message
        errorMsg.style.display = 'block';
    }
}
