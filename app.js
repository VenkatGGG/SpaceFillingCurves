class UnifiedSpaceFillingCurves {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.currentCurve = 'hilbert';
        this.order = 5;
        this.animationSpeed = 1;
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
        
        this.curveInfo = {
            hilbert: {
                title: 'Hilbert Curve',
                description: 'The Hilbert curve is a continuous fractal space-filling curve that maps a one-dimensional line to a two-dimensional square through recursive patterns.',
                maxOrder: 7
            },
            peano: {
                title: 'Peano Curve',
                description: 'The Peano curve is one of the first space-filling curves discovered, mapping a line to completely fill a square through recursive self-similar patterns.',
                maxOrder: 5
            },
            triangle: {
                title: 'Triangle Filling Curve',
                description: 'The Triangle Filling Curve uses recursive patterns to fill triangular regions, creating beautiful self-similar fractal structures.',
                maxOrder: 6
            },
            flowsnake: {
                title: 'Flow Snake (Gosper Curve)',
                description: 'The Flow Snake is a space-filling curve that creates beautiful hexagonal patterns through recursive L-system rules and turtle graphics.',
                maxOrder: 6
            },
            koch: {
                title: 'Koch Flow Snake',
                description: 'The Koch Flow Snake combines the classic Koch snowflake pattern with hexagonal flow snake, creating intricate self-similar structures.',
                maxOrder: 5
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateCurveInfo();
        this.generateCurve();
        this.draw();
    }
    
    setupEventListeners() {
        // Navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentCurve = e.target.dataset.curve;
                this.updateOrderRange();
                this.updateCurveInfo();
                this.reset();
                this.generateCurve();
                this.draw();
            });
        });
        
        // Control sliders
        document.getElementById('order').addEventListener('input', (e) => {
            this.order = parseInt(e.target.value);
            document.getElementById('orderValue').textContent = this.order;
            this.reset();
            this.generateCurve();
            this.draw();
        });
        
        document.getElementById('speed').addEventListener('input', (e) => {
            this.animationSpeed = parseInt(e.target.value);
            document.getElementById('speedValue').textContent = this.animationSpeed;
        });
        
        document.getElementById('size').addEventListener('input', (e) => {
            const size = parseInt(e.target.value);
            document.getElementById('sizeValue').textContent = size;
            this.canvas.width = size;
            this.canvas.height = size;
            this.reset();
            this.generateCurve();
            this.draw();
        });
        
        // Animation controls
        document.getElementById('startBtn').addEventListener('click', () => this.startAnimation());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pauseAnimation());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetAnimation());
    }
    
    updateOrderRange() {
        const orderSlider = document.getElementById('order');
        const maxOrder = this.curveInfo[this.currentCurve].maxOrder;
        orderSlider.max = maxOrder;
        if (this.order > maxOrder) {
            this.order = maxOrder;
            orderSlider.value = maxOrder;
            document.getElementById('orderValue').textContent = maxOrder;
        }
    }
    
    updateCurveInfo() {
        const info = this.curveInfo[this.currentCurve];
        document.getElementById('curveTitle').textContent = info.title;
        document.getElementById('curveDescription').textContent = info.description;
    }
    
    generateCurve() {
        this.points = [];
        
        switch(this.currentCurve) {
            case 'hilbert':
                this.generateHilbertCurve();
                break;
            case 'peano':
                this.generatePeanoCurve();
                break;
            case 'triangle':
                this.generateTriangleCurve();
                break;
            case 'flowsnake':
                this.generateFlowSnakeCurve();
                break;
            case 'koch':
                this.generateKochFlowSnakeCurve();
                break;
        }
    }
    
    // Hilbert Curve Generation
    generateHilbertCurve() {
        const size = Math.min(this.canvas.width, this.canvas.height) - 40;
        const n = Math.pow(2, this.order);
        const segmentLength = size / n;
        
        for (let i = 0; i < n * n; i++) {
            const [x, y] = this.hilbertXY(i, this.order);
            this.points.push({
                x: x * segmentLength + 20,
                y: y * segmentLength + 20
            });
        }
    }
    
    hilbertXY(t, order) {
        let x = 0, y = 0;
        let n = Math.pow(2, order);
        
        for (let s = 1; s < n; s *= 2) {
            let rx = 1 & (t / 2);
            let ry = 1 & (t ^ rx);
            [x, y] = this.rot(s, x, y, rx, ry);
            x += s * rx;
            y += s * ry;
            t = Math.floor(t / 4);
        }
        
        return [x, y];
    }
    
    rot(n, x, y, rx, ry) {
        if (ry === 0) {
            if (rx === 1) {
                x = n - 1 - x;
                y = n - 1 - y;
            }
            return [y, x];
        }
        return [x, y];
    }
    
    // Peano Curve Generation
    generatePeanoCurve() {
        const size = Math.min(this.canvas.width, this.canvas.height) - 40;
        const n = Math.pow(3, this.order);
        const segmentLength = size / n;
        
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
            
            if (i % 2 === 1) {
                [x, y] = this.peanoTransform(x, y, n / 3);
            }
        }
        
        return [x, y];
    }
    
    peanoTransform(x, y, size) {
        if (x < size) {
            if (y < size) {
                return [y, x];
            } else if (y < 2 * size) {
                return [x, y];
            } else {
                return [size - 1 - y + 2 * size, size - 1 - x];
            }
        } else if (x < 2 * size) {
            return [x, y];
        } else {
            if (y < size) {
                return [2 * size - 1 - y + size, 2 * size - 1 - x + size];
            } else if (y < 2 * size) {
                return [x, y];
            } else {
                return [2 * size - 1 - y + size, x - size];
            }
        }
    }
    
    // Triangle Curve Generation
    generateTriangleCurve() {
        const size = Math.min(this.canvas.width, this.canvas.height) - 80;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2 + 20;
        
        const height = size * Math.sqrt(3) / 2;
        const vertices = [
            { x: centerX, y: centerY - height / 2 },
            { x: centerX - size / 2, y: centerY + height / 2 },
            { x: centerX + size / 2, y: centerY + height / 2 }
        ];
        
        this.generateTriangleCurveRecursive(vertices[0], vertices[1], vertices[2], this.order);
    }
    
    generateTriangleCurveRecursive(a, b, c, order) {
        if (order === 0) {
            this.points.push({ x: a.x, y: a.y });
            this.points.push({ x: b.x, y: b.y });
            this.points.push({ x: c.x, y: c.y });
            this.points.push({ x: a.x, y: a.y });
            return;
        }
        
        const ab = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        const bc = { x: (b.x + c.x) / 2, y: (b.y + c.y) / 2 };
        const ca = { x: (c.x + a.x) / 2, y: (c.y + a.y) / 2 };
        
        this.generateTriangleCurveRecursive(a, ab, ca, order - 1);
        this.generateTriangleCurveRecursive(ab, b, bc, order - 1);
        this.generateTriangleCurveRecursive(ca, bc, c, order - 1);
        
        if (order > 1) {
            this.points.push({ x: ab.x, y: ab.y });
            this.points.push({ x: bc.x, y: bc.y });
            this.points.push({ x: ca.x, y: ca.y });
            this.points.push({ x: ab.x, y: ab.y });
        }
    }
    
    // Flow Snake Generation
    generateFlowSnakeCurve() {
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
        
        this.generatePointsFromLSystem(current);
    }
    
    generatePointsFromLSystem(lsystem) {
        const size = Math.min(this.canvas.width, this.canvas.height) - 100;
        const segmentLength = size / Math.pow(3, this.order);
        
        let x = this.canvas.width / 2;
        let y = this.canvas.height / 2;
        let angle = 0;
        const angleStep = Math.PI / 3;
        
        this.points.push({ x, y });
        
        for (let char of lsystem) {
            switch (char) {
                case 'A':
                case 'B':
                    x += segmentLength * Math.cos(angle);
                    y += segmentLength * Math.sin(angle);
                    this.points.push({ x, y });
                    break;
                case '+':
                    angle += angleStep;
                    break;
                case '-':
                    angle -= angleStep;
                    break;
            }
        }
        
        this.centerCurve();
    }
    
    // Koch Flow Snake Generation
    generateKochFlowSnakeCurve() {
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
        
        for (let i = 0; i < 6; i++) {
            const start = hexagonPoints[i];
            const end = hexagonPoints[(i + 1) % 6];
            const sidePoints = this.generateKochSide(start, end, this.order);
            
            for (let j = 0; j < sidePoints.length - 1; j++) {
                this.points.push(sidePoints[j]);
            }
        }
        
        if (this.points.length > 0) {
            this.points.push({ ...this.points[0] });
        }
        
        this.addFlowSnakePattern(centerX, centerY, radius * 0.6);
    }
    
    generateKochSide(start, end, order) {
        if (order === 0) {
            return [start, end];
        }
        
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        
        const p1 = {
            x: start.x + dx / 3,
            y: start.y + dy / 3
        };
        
        const p3 = {
            x: start.x + 2 * dx / 3,
            y: start.y + 2 * dy / 3
        };
        
        const midX = (p1.x + p3.x) / 2;
        const midY = (p1.y + p3.y) / 2;
        const height = Math.sqrt(3) / 6 * Math.sqrt(dx * dx + dy * dy);
        
        const p2 = {
            x: midX - height * dy / Math.sqrt(dx * dx + dy * dy),
            y: midY + height * dx / Math.sqrt(dx * dx + dy * dy)
        };
        
        const seg1 = this.generateKochSide(start, p1, order - 1);
        const seg2 = this.generateKochSide(p1, p2, order - 1);
        const seg3 = this.generateKochSide(p2, p3, order - 1);
        const seg4 = this.generateKochSide(p3, end, order - 1);
        
        return [
            ...seg1.slice(0, -1),
            ...seg2.slice(0, -1),
            ...seg3.slice(0, -1),
            ...seg4
        ];
    }
    
    addFlowSnakePattern(centerX, centerY, radius) {
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
        
        const segmentLength = radius / Math.pow(3, miniOrder + 1);
        let x = centerX;
        let y = centerY;
        let angle = 0;
        const angleStep = Math.PI / 3;
        
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
        
        this.points.push(...innerPoints);
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
        
        for (let i = 0; i < Math.min(this.currentStep, this.points.length - 1); i++) {
            const progress = i / (this.points.length - 1);
            const colorIndex = Math.floor(progress * this.colors.length);
            this.ctx.strokeStyle = this.colors[colorIndex % this.colors.length];
            
            this.ctx.beginPath();
            this.ctx.moveTo(this.points[i].x, this.points[i].y);
            this.ctx.lineTo(this.points[i + 1].x, this.points[i + 1].y);
            this.ctx.stroke();
        }
        
        if (this.points.length > 0) {
            this.ctx.fillStyle = '#ff6b6b';
            this.ctx.beginPath();
            this.ctx.arc(this.points[0].x, this.points[0].y, 4, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        
        if (this.currentStep < this.points.length && this.currentStep > 0) {
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(this.points[this.currentStep].x, this.points[this.currentStep].y, 3, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        
        this.updateProgress();
    }
    
    updateProgress() {
        const progress = this.points.length > 0 ? (this.currentStep / this.points.length) * 100 : 0;
        document.getElementById('progressFill').style.width = `${progress}%`;
        
        if (this.isAnimating) {
            document.getElementById('progressText').textContent = `Drawing... ${Math.round(progress)}%`;
        } else if (this.currentStep >= this.points.length - 1) {
            document.getElementById('progressText').textContent = 'Completed!';
        } else {
            document.getElementById('progressText').textContent = 'Ready to start';
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

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new UnifiedSpaceFillingCurves();
});
