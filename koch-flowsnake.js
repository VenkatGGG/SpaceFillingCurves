class KochFlowSnakeCurve {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.order = 3;
        this.animationSpeed = 30;
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
            '#a29bfe', '#fd79a8', '#fdcb6e', '#6c5ce7',
            '#74b9ff', '#e17055', '#81ecec', '#fab1a0'
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
        
        // Create initial hexagon
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(this.canvas.width, this.canvas.height) / 3;
        
        const hexagonPoints = [];
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            hexagonPoints.push({
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            });
        }
        
        // Generate Koch curve for each side of the hexagon
        for (let i = 0; i < 6; i++) {
            const start = hexagonPoints[i];
            const end = hexagonPoints[(i + 1) % 6];
            const sidePoints = this.generateKochSide(start, end, this.order);
            
            // Add points (except the last one to avoid duplication)
            for (let j = 0; j < sidePoints.length - 1; j++) {
                this.points.push(sidePoints[j]);
            }
        }
        
        // Close the curve
        if (this.points.length > 0) {
            this.points.push({ ...this.points[0] });
        }
        
        // Add flow snake patterns inside
        this.addFlowSnakePattern(centerX, centerY, radius * 0.6);
    }
    
    generateKochSide(start, end, order) {
        if (order === 0) {
            return [start, end];
        }
        
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        
        // Divide the line into three parts
        const p1 = {
            x: start.x + dx / 3,
            y: start.y + dy / 3
        };
        
        const p3 = {
            x: start.x + 2 * dx / 3,
            y: start.y + 2 * dy / 3
        };
        
        // Create the peak of the triangle (60-degree angle)
        const midX = (p1.x + p3.x) / 2;
        const midY = (p1.y + p3.y) / 2;
        const height = Math.sqrt(3) / 6 * Math.sqrt(dx * dx + dy * dy);
        
        const p2 = {
            x: midX - height * dy / Math.sqrt(dx * dx + dy * dy),
            y: midY + height * dx / Math.sqrt(dx * dx + dy * dy)
        };
        
        // Recursively apply Koch curve to each segment
        const seg1 = this.generateKochSide(start, p1, order - 1);
        const seg2 = this.generateKochSide(p1, p2, order - 1);
        const seg3 = this.generateKochSide(p2, p3, order - 1);
        const seg4 = this.generateKochSide(p3, end, order - 1);
        
        // Combine segments (remove duplicate points)
        return [
            ...seg1.slice(0, -1),
            ...seg2.slice(0, -1),
            ...seg3.slice(0, -1),
            ...seg4
        ];
    }
    
    addFlowSnakePattern(centerX, centerY, radius) {
        // Add a smaller flow snake pattern in the center
        const miniOrder = Math.max(1, this.order - 1);
        let axiom = "A";
        let rules = {
            "A": "A-B--B+A++AA+B-",
            "B": "+A-BB--B-A++A+B"
        };
        
        let current = axiom;
        for (let i = 0; i < miniOrder; i++) {
            let next = "";
            for (let char of current) {
                next += rules[char] || char;
            }
            current = next;
        }
        
        // Convert to points
        const segmentLength = radius / Math.pow(3, miniOrder + 1);
        let x = centerX;
        let y = centerY;
        let angle = 0;
        const angleStep = Math.PI / 3; // 60 degrees
        
        const innerPoints = [{ x, y }];
        
        for (let char of current) {
            switch (char) {
                case 'A':
                case 'B':
                    x += segmentLength * Math.cos(angle);
                    y += segmentLength * Math.sin(angle);
                    innerPoints.push({ x, y });
                    break;
                case '+':
                    angle += angleStep;
                    break;
                case '-':
                    angle -= angleStep;
                    break;
            }
        }
        
        // Add inner pattern to main points
        this.points.push(...innerPoints);
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
    new KochFlowSnakeCurve(canvas);
});
