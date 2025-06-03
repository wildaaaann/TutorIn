// Wait for the DOM to be fully loaded before starting animation
document.addEventListener('DOMContentLoaded', () => {
    const currentYearSpan = document.getElementById('currentYearR');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    const canvasRegister = document.getElementById('hexagon-canvas-register');
    if (!canvasRegister) {
        console.error("Canvas element 'hexagon-canvas-register' not found.");
        return;
    }

    const ctxRegister = canvasRegister.getContext('2d');
    if (!ctxRegister) {
        console.error("Failed to get 2D context from canvas 'hexagon-canvas-register'.");
        return;
    }

    let particlesArrayRegister;

    const mouseRegister = {
        x: null,
        y: null,
        radius: 70 
    };

    const canvasContainer = canvasRegister.parentElement;
    if (!canvasContainer) {
        console.error("Canvas parent container not found for 'hexagon-canvas-register'.");
        return;
    }

    canvasContainer.addEventListener('mousemove', (event) => {
        const rect = canvasRegister.getBoundingClientRect();
        if (rect) {
            mouseRegister.x = event.clientX - rect.left;
            mouseRegister.y = event.clientY - rect.top;
        }
    });
    canvasContainer.addEventListener('mouseleave', () => {
        mouseRegister.x = undefined;
        mouseRegister.y = undefined;
    });

    class ParticleRegister {
        constructor(x, y, size, speedX, speedY, color) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.speedX = speedX;
            this.speedY = speedY;
            this.color = color;
            this.originalX = x;
            this.originalY = y;
            this.density = (Math.random() * 30) + 1;
        }

        drawHexagon() {
            ctxRegister.beginPath();
            for (let i = 0; i < 6; i++) {
                ctxRegister.lineTo(
                    this.x + this.size * Math.cos(i * Math.PI / 3),
                    this.y + this.size * Math.sin(i * Math.PI / 3)
                );
            }
            ctxRegister.closePath();
            ctxRegister.fillStyle = this.color;
            ctxRegister.fill();
        }
        
        update() {
            if (mouseRegister.x !== undefined && mouseRegister.y !== undefined) {
                let dxMouse = mouseRegister.x - this.x;
                let dyMouse = mouseRegister.y - this.y;
                let distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
                
                if (distanceMouse !== 0) { // Avoid division by zero
                    let forceDirectionX = dxMouse / distanceMouse;
                    let forceDirectionY = dyMouse / distanceMouse;
                    const maxDistance = mouseRegister.radius;
                    let force = (maxDistance - distanceMouse) / maxDistance; 
                    
                    if (distanceMouse < mouseRegister.radius) {
                        this.x -= forceDirectionX * force * this.density * 0.1;
                        this.y -= forceDirectionY * force * this.density * 0.1;
                    } else {
                        this.returnToOriginalPosition();
                    }
                } else {
                     this.returnToOriginalPosition();
                }
            } else {
                this.returnToOriginalPosition();
            }

            // Boundary checks
            if (this.x + this.size > canvasRegister.width || this.x - this.size < 0) {
                this.speedX = -this.speedX;
                 if (this.x + this.size > canvasRegister.width) this.x = canvasRegister.width - this.size;
                 if (this.x - this.size < 0) this.x = this.size;
            }
            if (this.y + this.size > canvasRegister.height || this.y - this.size < 0) {
                this.speedY = -this.speedY;
                if (this.y + this.size > canvasRegister.height) this.y = canvasRegister.height - this.size;
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

    function initParticlesRegister() {
        particlesArrayRegister = [];
        if (!canvasContainer) return; // Should have been caught earlier, but good practice

        canvasRegister.width = canvasContainer.clientWidth;
        canvasRegister.height = canvasContainer.clientHeight;
        
        if (canvasRegister.width === 0 || canvasRegister.height === 0) {
            console.warn("Canvas (register) dimensions are zero during init. Particles might not render correctly.");
        }

        const particlesCount = 30; 
        const baseColor = "rgba(56, 161, 105,"; // Greenish
        
        for (let i = 0; i < particlesCount; i++) {
            let size = Math.random() * 5 + 3; 
            let x = Math.random() * (canvasRegister.width - size * 2) + size;
            let y = Math.random() * (canvasRegister.height - size * 2) + size;
            let speedX = (Math.random() - 0.5) * 0.5;
            let speedY = (Math.random() - 0.5) * 0.5;
            let color = `${baseColor} ${Math.random() * 0.3 + 0.1})`; 
            particlesArrayRegister.push(new ParticleRegister(x, y, size, speedX, speedY, color));
        }
    }

    function connectParticlesRegister() {
        if (!particlesArrayRegister || particlesArrayRegister.length === 0) return;

        let opacityValue = 1;
        for (let a = 0; a < particlesArrayRegister.length; a++) {
            for (let b = a + 1; b < particlesArrayRegister.length; b++) { 
                let dx = particlesArrayRegister[a].x - particlesArrayRegister[b].x;
                let dy = particlesArrayRegister[a].y - particlesArrayRegister[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) { 
                    opacityValue = 1 - (distance / 100);
                    ctxRegister.strokeStyle = `rgba(79, 135, 110, ${opacityValue * 0.5})`; 
                    ctxRegister.lineWidth = 0.5;
                    ctxRegister.beginPath();
                    ctxRegister.moveTo(particlesArrayRegister[a].x, particlesArrayRegister[a].y);
                    ctxRegister.lineTo(particlesArrayRegister[b].x, particlesArrayRegister[b].y);
                    ctxRegister.stroke();
                }
            }
        }
    }

    function animateRegister() {
        if (!ctxRegister) return; 

        ctxRegister.clearRect(0, 0, canvasRegister.width, canvasRegister.height);
        if (particlesArrayRegister && particlesArrayRegister.length > 0) { 
            for (let i = 0; i < particlesArrayRegister.length; i++) {
                particlesArrayRegister[i].update();
            }
            connectParticlesRegister(); 
        }
        requestAnimationFrame(animateRegister);
    }
    
    function debounceRegister(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    const handleResizeRegister = debounceRegister(() => {
        if (canvasContainer && canvasContainer.clientWidth > 0 && canvasContainer.clientHeight > 0) {
             initParticlesRegister(); 
        } else {
            console.warn("Resize event (register): Canvas container has no dimensions or not found.");
        }
    }, 250);

    window.addEventListener('resize', handleResizeRegister);
    
    function attemptInitialSetupRegister() {
        if (canvasContainer && canvasContainer.clientWidth > 0 && canvasContainer.clientHeight > 0) {
            initParticlesRegister();
            animateRegister();
        } else {
            console.warn("Initial setup (register): Canvas container dimensions not available or not found. Retrying...");
            setTimeout(attemptInitialSetupRegister, 250); // Retry
        }
    }
    
    attemptInitialSetupRegister(); // Call the setup function
});
