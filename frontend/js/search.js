<<<<<<< HEAD
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
=======
import { api } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    const searchBtn = document.getElementById('searchBtn');
    const bloodDropdown = document.getElementById('blood-type-select');
    const cityInput = document.getElementById('cityFilter');
    const resultsTable = document.getElementById('resultsBody');

    // --- 1. SEARCH FUNCTION ---
    const performSearch = async (blood, city = "") => {
        // 1. Target the correct Grid container (not a table)
        const resultsGrid = document.getElementById('donor-results');
        const resultCount = document.getElementById('result-count');

        if (!resultsGrid) return;

        try {
            // 2. SHOW LOADER: Using a div instead of a tr
            resultsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px;">
                <i class="fa-solid fa-spinner fa-spin" style="font-size: 2rem; color: var(--primary-red);"></i>
                <p style="margin-top: 10px;">Searching for heroes...</p>
            </div>`;

            // 3. LOGIC FIX: Handle "all" groups
            // If 'all' is selected, we send an empty string so the backend returns everyone
            const bloodQuery = (blood === 'all') ? "" : blood;

            // 4. API CALL
            const donors = await api.searchDonors(bloodQuery, city);

            // 5. CLEAR LOADER
            resultsGrid.innerHTML = "";

            // 6. NO RESULTS VIEW
            if (!donors || donors.length === 0) {
                resultsGrid.innerHTML = `
                <div class="glass-card" style="grid-column: 1/-1; text-align: center; padding: 40px;">
                    <i class="fa-solid fa-face-frown" style="font-size: 3rem; opacity: 0.3;"></i>
                    <p style="margin-top: 15px;">No donors found for <strong>${blood}</strong> in <strong>${city || 'any city'}</strong>.</p>
                </div>`;
                if (resultCount) resultCount.textContent = "0 donors found";
                return;
            }

            // 7. UPDATE COUNT
            if (resultCount) resultCount.textContent = `Found ${donors.length} verified donors`;

            // 8. RENDER CARDS
            donors.forEach(donor => {
                // Using the exact Card UI from your search.html
                resultsGrid.innerHTML += `
                <div class="glass-card donor-card">
                    <div class="donor-type">${donor.blood}</div>
                    <div class="donor-info">
                        <h4>${donor.name}</h4>
                        <p><i class="fa-solid fa-location-dot"></i> ${donor.city}</p>
                        <span class="verified-badge"><i class="fa-solid fa-circle-check"></i> Verified Donor</span>
                    </div>
                    <div class="donor-actions">
                        <a href="tel:${donor.phone}" class="btn primary-small">Call Now</a>
                        <button class="btn secondary-small" onclick="openRequestModal('${donor._id}', '${donor.name}')" style="background: #444; color: white; margin-left: 5px;">
                    Request
                </button>
                    </div>
                </div>
            `;
            });

        } catch (err) {
            console.error("Search Error:", err);
            resultsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: var(--primary-red);">
                <p><i class="fa-solid fa-triangle-exclamation"></i> Server Error. Is your backend running?</p>
            </div>`;
        }
    };

    // --- 2. AUTO-FILTER FROM URL ---
    const urlParams = new URLSearchParams(window.location.search);
    const typeFromUrl = urlParams.get('type');

    if (typeFromUrl && bloodDropdown) {
        bloodDropdown.value = typeFromUrl;
        // Automatically trigger search if coming from Home Page tags
        performSearch(typeFromUrl, "");
    }

    // --- 3. MANUAL SEARCH TRIGGER ---
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const blood = bloodDropdown.value;
            const city = cityInput ? cityInput.value : "";
            performSearch(blood, city);
        });
    }

    // --- 5. MODAL LOGIC (EXPOSED GLOBALLY) ---

// This MUST start with window. so the HTML onclick can see it
window.openRequestModal = (donorId, donorName) => {
    console.log("Opening modal for:", donorName); // Check your console (F12) to see this
    
    const modal = document.getElementById('requestModal');
    const idInput = document.getElementById('modalDonorId');
    const nameText = document.getElementById('modalDonorName');

    if (modal && idInput && nameText) {
        idInput.value = donorId;
        nameText.innerText = `Sending Request to: ${donorName}`;
        modal.style.display = 'flex'; // This brings it to the front
    } else {
        console.error("Modal elements not found in HTML!");
    }
};

window.closeModal = () => {
    document.getElementById('requestModal').style.display = 'none';
};

// Close modal if user clicks the dark background
window.onclick = (event) => {
    const modal = document.getElementById('requestModal');
    if (event.target === modal) {
        window.closeModal();
    }
};

    // --- 4. FORM SUBMISSION ---
    const requestForm = document.getElementById('requestForm');
    if (requestForm) {
        requestForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
                donorId: document.getElementById('modalDonorId').value,
                requesterName: document.getElementById('reqName').value,
                requesterContact: document.getElementById('reqPhone').value,
                message: document.getElementById('reqMessage').value,
                bloodType: bloodDropdown.value
            };

            try {
                const res = await fetch('http://localhost:3000/api/auth/request-blood', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    alert("🚀 Request sent! The donor will be notified.");
                    closeModal();
                    requestForm.reset();
                }
            } catch (err) {
                alert("Failed to send request.");
            }
        });
    };


    // --- 4. HOME PAGE REDIRECTION (Only if tags exist on current page) ---
    const bloodTags = document.querySelectorAll('.tag');
    bloodTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const selectedType = tag.getAttribute('data-type');
            window.location.href = `search.html?type=${encodeURIComponent(selectedType)}`;
        });
    });
>>>>>>> f7f0236 ( Filtered donors on the basis of city and blood group also added the request functionality. Also fixed the schema and request section on user dashboard.)
});