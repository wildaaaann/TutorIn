// Berada di: js/scriptlogout.js
// Dipanggil oleh: html/logout.html

function handleLogout() {
  localStorage.removeItem('isLoggedIn');

  // Mendorong state saat ini (URL html/logout.html) ke history.
  // Ini membantu menangani tombol kembali: jika pengguna kembali ke halaman logout,
  // event 'popstate' akan terpicu.
  history.pushState(null, document.title, location.href);

  window.addEventListener('popstate', function () {
    window.location.replace('login.html');
  });

  window.location.replace('login.html');
}

document.addEventListener('DOMContentLoaded', handleLogout);