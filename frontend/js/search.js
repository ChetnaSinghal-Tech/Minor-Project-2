console.log("Donix Search Engine Linked Successfully!");

document.addEventListener('DOMContentLoaded', () => {
    // 1. HOME PAGE LOGIC: Handle Blood Tag Clicks
    const bloodTags = document.querySelectorAll('.tag');
    if (bloodTags.length > 0) {
        bloodTags.forEach(tag => {
            tag.addEventListener('click', () => {
                const selectedType = tag.getAttribute('data-type');
                console.log(`Redirecting to search for: ${selectedType}`);
                window.location.href = `search.html?type=${encodeURIComponent(selectedType)}`;
            });
        });
    }

    // 2. SEARCH PAGE LOGIC: Auto-filter based on URL
    // Check if we are actually on the search page
    if (window.location.pathname.includes('search.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const bloodTypeFilter = urlParams.get('type');

        if (bloodTypeFilter) {
            console.log("Detected URL Filter:", bloodTypeFilter);
            
            // UI UX Improvement: Set the dropdown to the selected blood type
            const searchDropdown = document.querySelector('#blood-type-select'); // Adjust ID as needed
            if (searchDropdown) {
                searchDropdown.value = bloodTypeFilter;
            }

            // Call your actual search function here
            // performSearch(bloodTypeFilter); 
        }
    }
});