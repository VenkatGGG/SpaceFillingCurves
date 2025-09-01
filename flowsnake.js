class FlowSnakeCurve {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.order = 4;
        this.animationSpeed = 25;
        this.isAnimating = false;
        this.isPaused = false;
        this.currentStep = 0;
        this.points = [];
        this.animationId = null;
        this.colors = [
            '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', 
            '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd',
            '#00d2d3', '#ff9f43', '#ee5a24', '#0abde3',
            '#10ac84', '#f9ca24', '#6c5ce7', '#fd79a8',
            '#a29bfe', '#fd79a8', '#fdcb6e', '#6c5ce7'
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
        
        // Generate L-system string for Gosper curve
        let axiom = "A";
        let rules = {
            "A": "A-B--B+A++AA+B-",
            "B": "+A-BB--B-A++A+B"
        };
        
        let current = axiom;
        for (let i = 0; i < this.order; i++) {
            let next = "";
            for (let char of current) {
                next += rules[char] || char;
            }
            current = next;
        }
        
        // Convert L-system to points
        this.generatePointsFromLSystem(current);
    }
    
    generatePointsFromLSystem(lsystem) {
        const size = Math.min(this.canvas.width, this.canvas.height) - 100;
        const segmentLength = size / Math.pow(3, this.order);
        
        let x = this.canvas.width / 2;
        let y = this.canvas.height / 2;
        let angle = 0;
        const angleStep = Math.PI / 3; // 60 degrees
        
        this.points.push({ x, y });
        
        for (let char of lsystem) {
            switch (char) {
                case 'A':
                case 'B':
                    // Move forward
                    x += segmentLength * Math.cos(angle);
                    y += segmentLength * Math.sin(angle);
                    this.points.push({ x, y });
                    break;
                case '+':
                    // Turn left (counter-clockwise)
                    angle += angleStep;
                    break;
                case '-':
                    // Turn right (clockwise)
                    angle -= angleStep;
                    break;
            }
        }
        
        // Center the curve
        this.centerCurve();
    }
    
    centerCurve() {
        if (this.points.length === 0) return;
        
        let minX = Math.min(...this.points.map(p => p.x));
        let maxX = Math.max(...this.points.map(p => p.x));
        let minY = Math.min(...this.points.map(p => p.y));
        let maxY = Math.max(...this.points.map(p => p.y));
        
        let width = maxX - minX;
        let height = maxY - minY;
        
        let offsetX = (this.canvas.width - width) / 2 - minX;
        let offsetY = (this.canvas.height - height) / 2 - minY;
        
        // Apply scaling if needed
        let scale = Math.min(
            (this.canvas.width - 40) / width,
            (this.canvas.height - 40) / height
        );
        
        if (scale < 1) {
            offsetX = 20;
            offsetY = 20;
            
            for (let point of this.points) {
                point.x = (point.x - minX) * scale + offsetX;
                point.y = (point.y - minY) * scale + offsetY;
            }
        } else {
            for (let point of this.points) {
                point.x += offsetX;
                point.y += offsetY;
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
    new FlowSnakeCurve(canvas);
});
