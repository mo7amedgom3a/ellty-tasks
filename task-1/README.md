# Page Selector Modal Component

## 📌 Project Overview
This project is a pixel-perfect frontend implementation of the "Page Selector" modal (Frame 8445891) based on provided Figma design specifications. It is a standalone UI component designed to allow users to select specific pages from a list or toggle all pages simultaneously.

## 🛠 Tech Stack
- **HTML5**: Semantic structure.
- **CSS3**: Custom styling (Flexbox, CSS Variables, Transitions).
- **JavaScript (Vanilla)**: DOM manipulation for checkbox logic.
- **No Frameworks**: Lightweight implementation without React, Vue, or external libraries.

## 🎨 Design Specifications
The implementation strictly adheres to the provided design constraints for "Frame 8445891".

### 1. Container Specs
- **Dimensions**: Fixed width 370px; Height adapts to content.
- **Background**: `#FFFFFF` (White).
- **Border**: 1px solid `#EEEEEE`.
- **Corner Radius**: 6px.
- **Elevation (Shadows)**:
  - Layer 1: `0px 8px 15px 0px rgba(20, 20, 20, 0.12)`
  - Layer 2: `0px 0px 4px 0px rgba(20, 20, 20, 0.10)`

### 2. Component Styling
- **Checkboxes**:
  - **Unchecked**: White background, Gray border (`#D1D5DB`).
  - **Checked**: Blue background (`#3B82F6`), White checkmark.
  - *Note*: Default browser checkboxes are hidden and replaced with custom CSS elements.
- **Primary Button**:
  - **Color**: Warm Yellow (`#FFD15C`).
  - **Hover State**: Slightly darker yellow (`#FBBF24`).
  - **Text**: Dark Gray (`#1F2937`), Medium Weight.
- **Typography**: System sans-serif stack (Inter/Roboto preference).

## 🧠 Behavioral Logic
The JavaScript implementation handles the synchronization between the "All pages" parent checkbox and the individual child checkboxes.

- **Select All Toggle**: Clicking "All pages" instantly selects or deselects every item in the list.
- **Reactive Parent State**:
  - If a user unchecks a single page, "All pages" automatically unchecks.
  - If a user manually checks every single page, "All pages" automatically checks.
- **Enhanced UX**: Users can click anywhere on the List Row to toggle the checkbox, not just the small box itself.

## 📂 File Structure
```plaintext
.
├── index.html       # 
Contains HTML structure, CSS styles, and JS logic

├── styles.css       # 
Contains custom styles for the modal component

├── script.js        # 
Contains JavaScript logic for checkbox synchronization

└── README.md        # Project documentation
```

## 🚀 How to Run
1. Download the `index.html` file.
2. Open the file in any modern web browser (Chrome, Firefox, Safari, Edge).
3. Interact with the rows and button to test functionality.