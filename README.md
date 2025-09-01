# Space Filling Curves Animation

An interactive web application showcasing beautiful space-filling curves with smooth animations and customizable controls.

## Features

- **5 Different Space-Filling Curves:**
  - Hilbert Curve - Classic recursive square-filling pattern
  - Peano Curve - One of the first discovered space-filling curves
  - Triangle Filling Curve - Recursive triangular patterns
  - Flow Snake (Gosper Curve) - Hexagonal space-filling pattern
  - Koch Flow Snake - Combination of Koch snowflake and flow snake patterns

- **Interactive Controls:**
  - Adjustable curve order/complexity
  - Variable animation speed
  - Customizable canvas size
  - Play, pause, and reset functionality

- **Visual Features:**
  - Dark theme with bright, colorful curves
  - Different colors for each curve segment to visualize progression
  - Smooth animations with highlighted start and current points
  - Responsive design that works on different screen sizes

## How to Use

1. Open `index.html` in your web browser
2. Select a curve from the main menu
3. Adjust the controls:
   - **Order**: Controls the complexity/recursion depth of the curve
   - **Speed**: Controls how fast the animation draws
   - **Canvas Size**: Adjusts the size of the drawing area
4. Click "Start Animation" to begin the drawing process
5. Use "Pause" to pause and "Reset" to start over

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

## Files Structure

```
/
├── index.html              # Main menu page
├── styles.css              # Shared CSS styles
├── hilbert.html            # Hilbert curve page
├── hilbert.js              # Hilbert curve implementation
├── peano.html              # Peano curve page
├── peano.js                # Peano curve implementation
├── triangle.html           # Triangle curve page
├── triangle.js             # Triangle curve implementation
├── flowsnake.html          # Flow snake page
├── flowsnake.js            # Flow snake implementation
├── koch-flowsnake.html     # Koch flow snake page
├── koch-flowsnake.js       # Koch flow snake implementation
└── README.md               # This file
```

## License

This project is open source and available under the MIT License.
