// --- JavaScript Logic ---

const allPagesCheckbox = document.getElementById('all-pages');
const singlePageCheckboxes = document.querySelectorAll('.single-page');

function toggleCheckbox(id) {
    
    const checkbox = document.getElementById(id);
}

// 1. Logic for "All Pages" Checkbox
allPagesCheckbox.addEventListener('change', function() {
    const isChecked = this.checked;
    singlePageCheckboxes.forEach(box => {
        box.checked = isChecked;
    });
});

// 2. Logic for Individual Page Checkboxes
singlePageCheckboxes.forEach(box => {
    box.addEventListener('change', function() {
        // If any single box is unchecked, uncheck "All Pages"
        if (!this.checked) {
            allPagesCheckbox.checked = false;
        }
        
        const allChecked = Array.from(singlePageCheckboxes).every(b => b.checked);
        if (allChecked) {
            allPagesCheckbox.checked = true;
        }
    });
});

// 3. Stop propagation on the label to prevent double-firing with row onclick
const labels = document.querySelectorAll('.checkbox-wrapper');
labels.forEach(label => {
    label.addEventListener('click', function(e) {
        e.stopPropagation();
    });
});
