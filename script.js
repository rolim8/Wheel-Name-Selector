class WheelOfNames {
    constructor() {
        this.canvas = document.getElementById('wheelCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.spinBtn = document.getElementById('spinBtn');
        this.namesInput = document.getElementById('namesInput');
        this.addBtn = document.getElementById('addBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.randomizeBtn = document.getElementById('randomizeBtn');
        this.spinDuration = document.getElementById('spinDuration');
        this.spinSpeed = document.getElementById('spinSpeed');
        this.removeWinner = document.getElementById('removeWinner');
        this.winnerModal = document.getElementById('winnerModal');
        this.winnerName = document.getElementById('winnerName');
        this.closeModal = document.getElementById('closeModal');
        this.winnersList = document.getElementById('winnersList');
        this.clearWinnersBtn = document.getElementById('clearWinnersBtn');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.settingsModal = document.getElementById('settingsModal');
        this.closeSettings = document.getElementById('closeSettings');
        
        this.names = ['Amazing', 'Brilliant', 'Fantastic', 'Incredible', 'Wonderful'];
        this.rotation = 0;
        this.isSpinning = false;
        this.spinStartTime = 0;
        this.spinDurationValue = 5000;
        this.spinSpeedValue = 5;
        
        this.colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
            '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43'
        ];
        
        this.init();
    }
    
    init() {
        this.render();
        this.bindEvents();
        this.updateNamesInput();
    }
    
    bindEvents() {
        this.spinBtn.addEventListener('click', () => this.spin());
        this.addBtn.addEventListener('click', () => this.addNames());
        this.clearBtn.addEventListener('click', () => this.clearNames());
        this.randomizeBtn.addEventListener('click', () => this.randomizeNames());
        this.closeModal.addEventListener('click', () => this.hideWinner());
        this.clearWinnersBtn.addEventListener('click', () => this.clearWinners());
        this.settingsBtn.addEventListener('click', () => this.showSettings());
        this.closeSettings.addEventListener('click', () => this.hideSettings());
        
        this.spinDuration.addEventListener('input', (e) => {
            this.spinDurationValue = e.target.value * 1000;
            document.getElementById('durationValue').textContent = e.target.value;
        });
        
        this.spinSpeed.addEventListener('input', (e) => {
            this.spinSpeedValue = parseInt(e.target.value);
            document.getElementById('speedValue').textContent = e.target.value;
        });
        
        this.namesInput.addEventListener('input', () => {
            this.names = this.namesInput.value.split('\n').filter(n => n.trim());
            this.render();
        });
    }
    
    showSettings() {
        this.settingsModal.style.display = 'block';
    }
    
    hideSettings() {
        this.settingsModal.style.display = 'none';
    }
    
    updateNamesInput() {
        this.namesInput.value = this.names.join('\n');
    }
    
    addNames() {
        const newNames = prompt('Enter names separated by commas:');
        if (newNames) {
            const namesArray = newNames.split(',').map(n => n.trim()).filter(n => n);
            this.names.push(...namesArray);
            this.updateNamesInput();
            this.render();
        }
    }
    
    clearNames() {
        this.names = [];
        this.updateNamesInput();
        this.render();
    }
    
    randomizeNames() {
        for (let i = this.names.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.names[i], this.names[j]] = [this.names[j], this.names[i]];
        }
        this.updateNamesInput();
        this.render();
    }
    
    clearWinners() {
        this.winnersList.innerHTML = '<li class="empty-state">No winners yet</li>';
    }
    
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.names.length === 0) {
            this.ctx.fillStyle = '#666';
            this.ctx.font = '20px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Add names to spin!', this.canvas.width / 2, this.canvas.height / 2);
            return;
        }
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = 180;
        
        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(this.rotation);
        
        const anglePerSlice = (Math.PI * 2) / this.names.length;
        
        for (let i = 0; i < this.names.length; i++) {
            const startAngle = i * anglePerSlice;
            const endAngle = (i + 1) * anglePerSlice;
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.arc(0, 0, radius, startAngle, endAngle);
            this.ctx.closePath();
            this.ctx.fillStyle = this.colors[i % this.colors.length];
            this.ctx.fill();
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            this.ctx.save();
            this.ctx.rotate(startAngle + anglePerSlice / 2);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 16px Inter';
            this.ctx.textAlign = 'right';
            this.ctx.textBaseline = 'middle';
            
            const textRadius = radius - 30;
            this.ctx.fillText(this.names[i], textRadius, 0);
            this.ctx.restore();
        }
        
        this.ctx.restore();
        
        // Draw pointer
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.beginPath();
        this.ctx.moveTo(centerX + radius + 10, centerY);
        this.ctx.lineTo(centerX + radius + 30, centerY - 10);
        this.ctx.lineTo(centerX + radius + 30, centerY + 10);
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    spin() {
        if (this.isSpinning || this.names.length === 0) return;
        
        this.isSpinning = true;
        this.spinBtn.disabled = true;
        this.spinStartTime = Date.now();
        
        const randomIndex = Math.floor(Math.random() * this.names.length);
        const targetAngle = (randomIndex * (Math.PI * 2)) / this.names.length;
        
        const spins = 3 + Math.random() * 2;
        const finalRotation = this.rotation + (spins * Math.PI * 2) - targetAngle;
        
        const animate = () => {
            const elapsed = Date.now() - this.spinStartTime;
            const progress = Math.min(elapsed / this.spinDurationValue, 1);
            
            const easeOut = 1 - Math.pow(1 - progress, 3);
            this.rotation = this.rotation + (finalRotation - this.rotation) * (easeOut * this.spinSpeedValue * 0.1);
            
            this.render();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.isSpinning = false;
                this.spinBtn.disabled = false;
                
                const winner = this.names[randomIndex];
                this.showWinner(winner);
                
                if (this.removeWinner.checked) {
                    this.names.splice(randomIndex, 1);
                    this.updateNamesInput();
                    this.render();
                }
            }
        };
        
        animate();
    }
    
    showWinner(name) {
        this.winnerName.textContent = name;
        this.winnerModal.style.display = 'block';
        
        const li = document.createElement('li');
        li.textContent = `${new Date().toLocaleTimeString()} - ${name}`;
        
        const emptyState = this.winnersList.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }
        
        this.winnersList.insertBefore(li, this.winnersList.firstChild);
        
        if (this.winnersList.children.length > 10) {
            this.winnersList.removeChild(this.winnersList.lastChild);
        }
    }
    
    hideWinner() {
        this.winnerModal.style.display = 'none';
    }
}

// Initialize the wheel when the page loads
new WheelOfNames();