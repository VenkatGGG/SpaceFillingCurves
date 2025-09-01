class TriangleCurve {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.order = 4;
        this.animationSpeed = 20;
        this.isAnimating = false;
        this.isPaused = false;
        this.currentStep = 0;
        this.points = [];
        this.animationId = null;
        this.colors = [
            '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', 
            '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd',
            '#00d2d3', '#ff9f43', '#ee5a24', '#0abde3',
            '#10ac84', '#f9ca24', '#6c5ce7', '#fd79a8'
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
        const size = Math.min(this.canvas.width, this.canvas.height) - 80;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2 + 20;
        
        // Create main triangle vertices
        const height = size * Math.sqrt(3) / 2;
        const vertices = [
            { x: centerX, y: centerY - height / 2 }, // Top
            { x: centerX - size / 2, y: centerY + height / 2 }, // Bottom left
            { x: centerX + size / 2, y: centerY + height / 2 }  // Bottom right
        ];
        
        this.generateTriangleCurve(vertices[0], vertices[1], vertices[2], this.order);
    }
    
    generateTriangleCurve(a, b, c, order) {
        if (order === 0) {
            // Base case: just connect the vertices
            this.points.push({ x: a.x, y: a.y });
            this.points.push({ x: b.x, y: b.y });
            this.points.push({ x: c.x, y: c.y });
            this.points.push({ x: a.x, y: a.y });
            return;
        }
        
        // Calculate midpoints
        const ab = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        const bc = { x: (b.x + c.x) / 2, y: (b.y + c.y) / 2 };
        const ca = { x: (c.x + a.x) / 2, y: (c.y + a.y) / 2 };
        
        // Recursively generate sub-triangles
        this.generateTriangleCurve(a, ab, ca, order - 1);
        this.generateTriangleCurve(ab, b, bc, order - 1);
        this.generateTriangleCurve(ca, bc, c, order - 1);
        
        // Add connecting path through center triangle
        if (order > 1) {
            this.points.push({ x: ab.x, y: ab.y });
            this.points.push({ x: bc.x, y: bc.y });
            this.points.push({ x: ca.x, y: ca.y });
            this.points.push({ x: ab.x, y: ab.y });
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
    new TriangleCurve(canvas);
});
