// logout.js
// Clear login status and redirect to login page
function handleLogout() {
  localStorage.removeItem('isLoggedIn');
  // Push a dummy new state to handle back button behavior
  history.pushState(null, document.title, location.href);
  window.addEventListener('popstate', function () {
    // When user presses back button after logout, redirect to login
    location.replace('login.html');
  });
  // Redirect to login page immediately
  location.replace('login.html');
}
document.addEventListener('DOMContentLoaded', handleLogout);