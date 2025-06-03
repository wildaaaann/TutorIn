// Wait for the DOM to be fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const errorMessage = document.getElementById('error-message');
            if (!errorMessage) {
                console.error("Error message element not found!");
                return;
            }
            errorMessage.textContent = '';
            errorMessage.classList.add('hidden');

            const emailInput = this.email;
            const passwordInput = this.password;
            const confirmPasswordInput = this['confirm-password'];

            if (!emailInput || !passwordInput || !confirmPasswordInput) {
                console.error("One or more form input elements not found!");
                errorMessage.textContent = "Terjadi kesalahan pada formulir. Silakan coba lagi.";
                errorMessage.classList.remove('hidden');
                return;
            }

            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            // Basic validation
            if (!email || !password || !confirmPassword) {
                errorMessage.textContent = "Mohon isi semua kolom.";
                errorMessage.classList.remove('hidden');
                return;
            }

            // Email validation regex
            if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
                errorMessage.textContent = "Format email tidak valid.";
                errorMessage.classList.remove('hidden');
                return;
            }

            if (password.length < 6) {
                errorMessage.textContent = "Password minimal harus 6 karakter.";
                errorMessage.classList.remove('hidden');
                return;
            }

            if (password !== confirmPassword) {
                errorMessage.textContent = "Password tidak cocok.";
                errorMessage.classList.remove('hidden');
                return;
            }

            // Simulate registration (replace with actual backend integration)
            try {
                let users = JSON.parse(localStorage.getItem('tutorInUsers') || '[]');
                const userExists = users.some(user => user.username === username || user.email === email);
                
                if (userExists) {
                    errorMessage.textContent = "Username atau email sudah terdaftar.";
                    errorMessage.classList.remove('hidden');
                    return;
                }

                // Save user (Password should be hashed in a real application)
                users.push({email, password }); 
                localStorage.setItem('tutorInUsers', JSON.stringify(users));

                // Display success message (custom modal)
                const successModal = document.createElement('div');
                successModal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; padding: 1rem;';
                successModal.innerHTML = `
                    <div style="background-color: #2D3748; color: #E2E8F0; padding: 25px 30px; border-radius: 8px; text-align: center; box-shadow: 0 5px 20px rgba(0,0,0,0.25); max-width: 90%; width: 400px;">
                        <h3 style="font-size: 1.6rem; margin-bottom: 15px; font-weight: 500;">Registrasi Berhasil!</h3>
                        <p style="margin-bottom: 25px; font-size: 0.95rem; line-height: 1.6;">Anda sekarang dapat masuk dengan akun baru Anda.</p>
                        <button id="ok-button-register-success" style="background-color: #3182CE; color: white; padding: 12px 25px; border: none; border-radius: 5px; cursor: pointer; font-size: 0.95rem; transition: background-color 0.2s ease;">OK</button>
                    </div>
                `;
                document.body.appendChild(successModal);
                
                const okButton = document.getElementById('ok-button-register-success');
                if (okButton) {
                    okButton.addEventListener('click', () => {
                        if (successModal.parentElement) { // Check if modal is still in DOM
                           document.body.removeChild(successModal);
                        }
                        window.location.href = 'login.html'; // Redirect to login page
                    });
                } else {
                    console.error("Success modal OK button not found.");
                }

            } catch (e) {
                console.error("Error during registration simulation: ", e);
                errorMessage.textContent = "Terjadi kesalahan saat registrasi. Silakan coba lagi.";
                errorMessage.classList.remove('hidden');
            }
        });
    } else {
        console.warn("Register form element not found.");
    }
});
