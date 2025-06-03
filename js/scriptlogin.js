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


// Set current year in footer
document.getElementById('currentYearL').textContent = new Date().getFullYear();

// Hexagon Particle Animation
const canvas = document.getElementById('hexagon-canvas');
const ctx = canvas.getContext('2d');
let particlesArray;

// Mouse position
const mouse = {
    x: null,
    y: null,
    radius: 70 // Interaction radius for mouse
};

window.addEventListener('mousemove', (event) => {
    // Get mouse position relative to the canvas
    const rect = canvas.getBoundingClientRect();
    if (rect) { // Ensure rect is available
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    }
});
window.addEventListener('mouseout', () => { // Reset mouse when it leaves canvas area
    mouse.x = undefined;
    mouse.y = undefined;
});


// Particle class
class Particle {
    constructor(x, y, size, speedX, speedY, color) {
        this.x = x;
        this.y = y;
        this.size = size; // Size of the hexagon (radius from center to vertex)
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = color;
        this.originalX = x; // For returning to original position
        this.originalY = y;
        this.density = (Math.random() * 30) + 1; // How much it reacts to mouse
    }

    drawHexagon() {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            ctx.lineTo(
                this.x + this.size * Math.cos(i * Math.PI / 3),
                this.y + this.size * Math.sin(i * Math.PI / 3)
            );
        }
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    
    update() {
        // Mouse interaction
        if (mouse.x !== undefined && mouse.y !== undefined) { // Check if mouse coordinates are defined
            let dxMouse = mouse.x - this.x;
            let dyMouse = mouse.y - this.y;
            let distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
            
            if (distanceMouse !== 0) { // Avoid division by zero
                let forceDirectionX = dxMouse / distanceMouse;
                let forceDirectionY = dyMouse / distanceMouse;
                
                // Max distance for mouse to affect particle
                const maxDistance = mouse.radius;
                // Force is stronger closer to the mouse
                let force = (maxDistance - distanceMouse) / maxDistance; 
                
                // If mouse is close enough, move particle away from mouse
                if (distanceMouse < mouse.radius) {
                    this.x -= forceDirectionX * force * this.density * 0.1; // Push away
                    this.y -= forceDirectionY * force * this.density * 0.1;
                } else {
                    // Return to original position if mouse is not near
                    this.returnToOriginalPosition();
                }
            } else {
                    this.returnToOriginalPosition();
            }
        } else {
            // Return to original position if mouse is not defined (e.g., mouseout)
            this.returnToOriginalPosition();
        }


        // Keep particles within canvas - simple bounce
        if (this.x + this.size > canvas.width || this.x - this.size < 0) {
            this.speedX = -this.speedX;
                if (this.x + this.size > canvas.width) this.x = canvas.width - this.size;
                if (this.x - this.size < 0) this.x = this.size;
        }
        if (this.y + this.size > canvas.height || this.y - this.size < 0) {
            this.speedY = -this.speedY;
            if (this.y + this.size > canvas.height) this.y = canvas.height - this.size;
            if (this.y - this.size < 0) this.y = this.size;
        }
        this.drawHexagon();
    }

    returnToOriginalPosition() {
        if (this.x !== this.originalX) {
            let dxOriginal = this.originalX - this.x;
            this.x += dxOriginal / 20; // Smooth return
        }
        if (this.y !== this.originalY) {
            let dyOriginal = this.originalY - this.y;
            this.y += dyOriginal / 20; // Smooth return
        }
    }
}

function initParticles() {
    particlesArray = [];
    const canvasContainer = canvas.parentElement; 
    if (!canvasContainer) {
        console.error("Canvas container not found for particle initialization!");
        return;
    }
    canvas.width = canvasContainer.clientWidth;
    canvas.height = canvasContainer.clientHeight;
    
    if (canvas.width === 0 || canvas.height === 0) {
        console.warn("Canvas dimensions are zero. Particles might not render correctly.");
        // Optionally, you could try to re-initialize after a short delay if this happens often
    }

    const particlesCount = 30; 
    const baseColor = "rgba(56, 161, 105,"; 
    
    for (let i = 0; i < particlesCount; i++) {
        let size = Math.random() * 5 + 3; 
        let x = Math.random() * (canvas.width - size * 2) + size;
        let y = Math.random() * (canvas.height - size * 2) + size;
        let speedX = (Math.random() - 0.5) * 0.5;
        let speedY = (Math.random() - 0.5) * 0.5;
        let color = `${baseColor} ${Math.random() * 0.3 + 0.1})`; 
        particlesArray.push(new Particle(x, y, size, speedX, speedY, color));
    }
}

function connectParticles() {
    if (!particlesArray || particlesArray.length === 0) return; // Ensure particles exist

    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) { 
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) { 
                opacityValue = 1 - (distance / 100);
                ctx.strokeStyle = `rgba(79, 135, 110, ${opacityValue * 0.5})`; 
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    if (!ctx) { 
            console.error("Canvas context not available for animation.");
            return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (particlesArray && particlesArray.length > 0) { 
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connectParticles(); 
    }
    requestAnimationFrame(animate);
}

function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

const handleResize = debounce(() => {
    const canvasContainer = canvas.parentElement;
    if (canvasContainer && canvasContainer.clientWidth > 0 && canvasContainer.clientHeight > 0) {
            initParticles(); 
    } else {
        console.warn("Resize event: Canvas container has no dimensions.");
    }
}, 250);

window.addEventListener('resize', handleResize);

function attemptInitialSetup() {
    const canvasContainer = canvas.parentElement;
    if (canvasContainer && canvasContainer.clientWidth > 0 && canvasContainer.clientHeight > 0) {
        initParticles();
        animate();
    } else {
        console.warn("Initial setup: Canvas container dimensions not available. Retrying...");
        setTimeout(attemptInitialSetup, 200); // Retry after a slightly longer delay
    }
}

if (document.readyState === 'loading') { 
    window.addEventListener('DOMContentLoaded', attemptInitialSetup);
} else { 
    attemptInitialSetup();
}