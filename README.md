# Space Filling Curves - Interactive Visualization

🎨 A beautiful, modern web application showcasing mathematical space-filling curves with smooth animations and interactive controls.

![Space Filling Curves Application](screenshot.png)

*Interactive visualization of the Triangle Filling Curve with modern gradient UI*

## ✨ Features

### 🎯 **Unified Application**
- **Single Page Interface** - All curves accessible from one beautiful application
- **Tab Navigation** - Instantly switch between different space-filling curves
- **Real-time Updates** - Changes apply immediately without page reloads

### 🌈 **Five Interactive Space-Filling Curves**
- **Hilbert Curve** - Classic recursive square-filling pattern (Order 1-7)
- **Peano Curve** - Historic space-filling curve with base-3 recursion (Order 1-5)
- **Triangle Filling Curve** - Recursive triangular patterns (Order 1-6)
- **Flow Snake (Gosper Curve)** - Hexagonal L-system patterns (Order 1-6)
- **Koch Flow Snake** - Hybrid Koch snowflake and flow snake (Order 1-5)

### 🎮 **Interactive Controls**
- **Complexity Slider** - Adjustable recursion depth for each curve
- **Speed Control** - Variable animation speed (1-50, default: 1)
- **Canvas Size** - Customizable viewing area (400-900px, default: 700px)
- **Animation Controls** - Start, pause, and reset with visual feedback

### 🎨 **Modern Visual Design**
- **Purple Gradient Theme** - Beautiful modern UI with glass-morphism effects
- **Animated Background** - Floating particles and smooth transitions
- **Colorful Curves** - Rainbow gradients to visualize curve progression
- **Progress Tracking** - Real-time progress bar and completion percentage
- **Responsive Design** - Works perfectly on all screen sizes

## 🚀 How to Use

### **Quick Start**
1. **Open `app.html`** in any modern web browser
2. **Select a curve** from the navigation tabs at the top
3. **Adjust settings** using the intuitive sliders:
   - **Complexity**: Controls the recursion depth/detail level
   - **Speed**: Animation drawing speed (1=slowest, 50=fastest)
   - **Canvas Size**: Viewing area dimensions
4. **Click ▶ Start** to begin the mesmerizing animation
5. **Monitor progress** with the real-time progress bar
6. **Use controls**: Pause ⏸, Reset 🔄, or switch curves anytime

### **Default Settings** 
- **Speed**: 1 (slow, detailed animation)
- **Complexity**: 5 (high detail)
- **Canvas Size**: 700px (large viewing area)

## Technical Implementation

Each curve is implemented using mathematical algorithms:

- **Hilbert Curve**: Uses recursive space-partitioning algorithm
- **Peano Curve**: Implements the original Peano space-filling logic  
- **Triangle Curve**: Recursive triangle subdivision
- **Flow Snake**: L-system based generation with turtle graphics
- **Koch Flow Snake**: Combines Koch curve fractals with hexagonal patterns

The animations are rendered using HTML5 Canvas with requestAnimationFrame for smooth performance.

## Browser Compatibility

Works in all modern browsers that support:
- HTML5 Canvas
- ES6 JavaScript features
- CSS Grid and Flexbox

## 📁 Project Structure

### **Unified Application** (Recommended)
```
/
├── app.html                # 🌟 Main unified application 
├── app.js                  # 🧠 Complete curve logic & controls
├── app-styles.css          # 🎨 Modern purple gradient theme
├── screenshot.png          # 📸 Application preview
└── README.md               # 📚 Documentation
```

### **Individual Pages** (Legacy)
```
/
├── index.html              # Original main menu
├── styles.css              # Original dark theme
├── hilbert.html/.js        # Individual Hilbert curve page
├── peano.html/.js          # Individual Peano curve page  
├── triangle.html/.js       # Individual Triangle curve page
├── flowsnake.html/.js      # Individual Flow snake page
└── koch-flowsnake.html/.js # Individual Koch flow snake page
```

**💡 Tip**: Use `app.html` for the best experience with the modern unified interface!

## License

This project is open source and available under the MIT License.
