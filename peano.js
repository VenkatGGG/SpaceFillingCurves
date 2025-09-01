class PeanoCurve {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.order = 3;
        this.animationSpeed = 15;
        this.isAnimating = false;
        this.isPaused = false;
        this.currentStep = 0;
        this.points = [];
        this.animationId = null;
        this.colors = [
            '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', 
            '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd',
            '#00d2d3', '#ff9f43', '#ee5a24', '#0abde3'
        ];
        
        this.setupControls();
        this.generateCurve();
        this.draw();
    }
    
    setupControls() {
        const orderSlider = document.getElementById('order');
        const speedSlider = document.getElementById('speed');
        const sizeSlider = document.getElementById('size');
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const resetBtn = document.getElementById('resetBtn');
        
        orderSlider.addEventListener('input', (e) => {
            this.order = parseInt(e.target.value);
            document.getElementById('orderValue').textContent = this.order;
            this.reset();
            this.generateCurve();
            this.draw();
        });
        
        speedSlider.addEventListener('input', (e) => {
            this.animationSpeed = parseInt(e.target.value);
            document.getElementById('speedValue').textContent = this.animationSpeed;
        });
        
        sizeSlider.addEventListener('input', (e) => {
            const size = parseInt(e.target.value);
            document.getElementById('sizeValue').textContent = size;
            this.canvas.width = size;
            this.canvas.height = size;
            this.reset();
            this.generateCurve();
            this.draw();
        });
        
        startBtn.addEventListener('click', () => this.startAnimation());
        pauseBtn.addEventListener('click', () => this.pauseAnimation());
        resetBtn.addEventListener('click', () => this.resetAnimation());
    }
    
    generateCurve() {
        this.points = [];
        const size = Math.min(this.canvas.width, this.canvas.height) - 40;
        const n = Math.pow(3, this.order);
        const segmentLength = size / n;
        
        // Generate Peano curve points
        for (let i = 0; i < n * n; i++) {
            const [x, y] = this.peanoXY(i, this.order);
            this.points.push({
                x: x * segmentLength + 20,
                y: y * segmentLength + 20
            });
        }
    }
    
    peanoXY(t, order) {
        let x = 0, y = 0;
        let n = 1;
        
        for (let i = 0; i < order; i++) {
            n *= 3;
            let rx = t % 3;
            t = Math.floor(t / 3);
            let ry = t % 3;
            t = Math.floor(t / 3);
            
            x = x * 3 + rx;
            y = y * 3 + ry;
            
            // Apply Peano curve transformation
            if (i % 2 === 1) {
                [x, y] = this.peanoTransform(x, y, n / 3);
            }
        }
        
        return [x, y];
    }
    
    peanoTransform(x, y, size) {
        // Apply specific Peano curve transformations
        if (x < size) {
            if (y < size) {
                return [y, x]; // Lower left quadrant - reflect over diagonal
            } else if (y < 2 * size) {
                return [x, y]; // Middle left - no change
            } else {
                return [size - 1 - y + 2 * size, size - 1 - x]; // Upper left - rotate 180°
            }
        } else if (x < 2 * size) {
            if (y < size) {
                return [x, y]; // Lower middle - no change
            } else if (y < 2 * size) {
                return [x, y]; // Center - no change
            } else {
                return [x, y]; // Upper middle - no change
            }
        } else {
            if (y < size) {
                return [2 * size - 1 - y + size, 2 * size - 1 - x + size]; // Lower right - rotate 180°
            } else if (y < 2 * size) {
                return [x, y]; // Middle right - no change
            } else {
                return [2 * size - 1 - y + size, x - size]; // Upper right - reflect over anti-diagonal
            }
        }
    }
    
    draw() {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.points.length === 0) return;
        
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        // Draw the curve up to current step
        for (let i = 0; i < Math.min(this.currentStep, this.points.length - 1); i++) {
            const progress = i / (this.points.length - 1);
            const colorIndex = Math.floor(progress * this.colors.length);
            this.ctx.strokeStyle = this.colors[colorIndex % this.colors.length];
            
            this.ctx.beginPath();
            this.ctx.moveTo(this.points[i].x, this.points[i].y);
            this.ctx.lineTo(this.points[i + 1].x, this.points[i + 1].y);
            this.ctx.stroke();
        }
        
        // Draw start point
        if (this.points.length > 0) {
            this.ctx.fillStyle = '#ff6b6b';
            this.ctx.beginPath();
            this.ctx.arc(this.points[0].x, this.points[0].y, 4, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        
        // Draw current point
        if (this.currentStep < this.points.length && this.currentStep > 0) {
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(this.points[this.currentStep].x, this.points[this.currentStep].y, 3, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }
    
    animate() {
        if (!this.isAnimating || this.isPaused) return;
        
        this.currentStep += this.animationSpeed;
        
        if (this.currentStep >= this.points.length) {
            this.currentStep = this.points.length - 1;
            this.isAnimating = false;
            this.updateButtons();
        }
        
        this.draw();
        
        if (this.isAnimating) {
            this.animationId = requestAnimationFrame(() => this.animate());
        }
    }
    
    startAnimation() {
        if (this.currentStep >= this.points.length - 1) {
            this.currentStep = 0;
        }
        
        this.isAnimating = true;
        this.isPaused = false;
        this.updateButtons();
        this.animate();
    }
    
    pauseAnimation() {
        this.isPaused = true;
        this.isAnimating = false;
        this.updateButtons();
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    resetAnimation() {
        this.isAnimating = false;
        this.isPaused = false;
        this.currentStep = 0;
        this.updateButtons();
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.draw();
    }
    
    reset() {
        this.resetAnimation();
    }
    
    updateButtons() {
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        
        startBtn.disabled = this.isAnimating && !this.isPaused;
        pauseBtn.disabled = !this.isAnimating || this.isPaused;
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    new PeanoCurve(canvas);
});
