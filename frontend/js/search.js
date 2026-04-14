import { api, BASE_URL } from './api.js'; // Make sure BASE_URL is exported from api.js

document.addEventListener('DOMContentLoaded', async () => {
    const searchBtn = document.getElementById('searchBtn');
    const bloodDropdown = document.getElementById('blood-type-select');
    const cityInput = document.getElementById('cityFilter');
    const resultsGrid = document.getElementById('donor-results');
    const resultCount = document.getElementById('result-count');

    // --- 1. THE SEARCH ENGINE ---
    const performSearch = async (blood, city = "") => {
        if (!resultsGrid) return;

        try {
            // Show Loader
            resultsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px;">
                <i class="fa-solid fa-spinner fa-spin" style="font-size: 2rem; color: var(--primary-red);"></i>
                <p style="margin-top: 10px;">Searching for heroes...</p>
            </div>`;

            const bloodQuery = (blood === 'all') ? "" : blood;
            const donors = await api.searchDonors(bloodQuery, city);

            resultsGrid.innerHTML = "";

            if (!donors || donors.length === 0) {
                resultsGrid.innerHTML = `
                <div class="glass-card" style="grid-column: 1/-1; text-align: center; padding: 40px;">
                    <i class="fa-solid fa-face-frown" style="font-size: 3rem; opacity: 0.3;"></i>
                    <p style="margin-top: 15px;">No donors found for <strong>${blood}</strong> in <strong>${city || 'any city'}</strong>.</p>
                </div>`;
                if (resultCount) resultCount.textContent = "0 donors found";
                return;
            }

            if (resultCount) resultCount.textContent = `Found ${donors.length} verified donors`;

            // Render Donor Cards
            donors.forEach(donor => {
                resultsGrid.innerHTML += `
                <div class="glass-card donor-card">
                    <div class="donor-type">${donor.blood}</div>
                    <div class="donor-info">
                        <h4>${donor.name}</h4>
                        <p><i class="fa-solid fa-location-dot"></i> ${donor.city}</p>
                        <span class="verified-badge"><i class="fa-solid fa-circle-check"></i> Verified Donor</span>
                    </div>
                    
                    <div class="donor-actions">
                        <button class="btn primary-small" onclick="handleCall('${donor.phone}')">
                            Call Now
                        </button>
                        <button class="btn secondary-small" onclick="handleRequest('${donor._id}', '${donor.name}')">
                            Request
                        </button>
                    </div>
                </div>`;
            });

        } catch (err) {
            console.error("Search Error:", err);
            resultsGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--primary-red);"><p>Server Error. Is your backend running?</p></div>`;
        }
    };

    // --- AUTO-FILTER FROM HOME PAGE ---
    const urlParams = new URLSearchParams(window.location.search);
    const typeFromUrl = urlParams.get('blood'); // ✅ FIXED

    if (typeFromUrl && bloodDropdown) {
        bloodDropdown.value = typeFromUrl;
        performSearch(typeFromUrl, "");
    }
    // --- 3. MANUAL SEARCH ---
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            performSearch(bloodDropdown.value, cityInput ? cityInput.value : "");
        });
    }

    // --- 4. MODAL LOGIC ---
    window.openRequestModal = (donorId, donorName) => {
        const modal = document.getElementById('requestModal');
        if (modal) {
            document.getElementById('modalDonorId').value = donorId;
            document.getElementById('modalDonorName').innerText = `Sending Request to: ${donorName}`;
            modal.style.display = 'flex';
        }
    };

    window.closeModal = () => {
        const modal = document.getElementById('requestModal');
        if (modal) modal.style.display = 'none';
    };

    window.addEventListener('click', (e) => {
        const modal = document.getElementById('requestModal');
        if (e.target === modal) window.closeModal();
    });

    // --- 5. SUBMIT REQUEST ---
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
                const res = await fetch(`${BASE_URL}/request-blood`, { // <-- UPDATED
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    alert("🚀 Request sent! The donor will be notified.");
                    window.closeModal();
                    requestForm.reset();
                }
            } catch (err) {
                alert("Failed to send request.");
            }
        });
    }

    // --- 6. HOME PAGE REDIRECTS ---


    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const selectedType = tag.getAttribute('data-type');
            window.location.href = `public/search.html?blood=${encodeURIComponent(selectedType)}`;
        });
    });
    // document.querySelectorAll('.tag').forEach(tag => {
    //     tag.addEventListener('click', () => {
    //         const selectedType = tag.getAttribute('data-type');
    //         window.location.href = `search.html?type=${encodeURIComponent(selectedType)}`;
    //     });
    // });
});

// js fuctions for forced login on call now and request buttons

// ===== AUTH CHECK FUNCTIONS =====

window.isLoggedIn = function () {
    return !!localStorage.getItem("donorId");
};

window.requireLogin = function () {
    alert("Please login first to continue");
    window.location.href = "/public/login.html";
};

// ===== BUTTON HANDLERS =====

window.handleCall = function (phone) {
    if (!window.isLoggedIn()) {
        window.requireLogin();
        return;
    }

    window.location.href = `tel:${phone}`;
};

window.handleRequest = function (donorId, donorName) {
    if (!window.isLoggedIn()) {
        window.requireLogin();
        return;
    }

    window.openRequestModal(donorId, donorName);
};

// import { api } from './api.js';

// document.addEventListener('DOMContentLoaded', async () => {
//     const searchBtn = document.getElementById('searchBtn');
//     const bloodDropdown = document.getElementById('blood-type-select');
//     const cityInput = document.getElementById('cityFilter');
//     const resultsGrid = document.getElementById('donor-results');
//     const resultCount = document.getElementById('result-count');

//     // --- 1. THE SEARCH ENGINE ---
//     const performSearch = async (blood, city = "") => {
//         if (!resultsGrid) return;

//         try {
//             // Show Loader
//             resultsGrid.innerHTML = `
//             <div style="grid-column: 1/-1; text-align: center; padding: 50px;">
//                 <i class="fa-solid fa-spinner fa-spin" style="font-size: 2rem; color: var(--primary-red);"></i>
//                 <p style="margin-top: 10px;">Searching for heroes...</p>
//             </div>`;

//             const bloodQuery = (blood === 'all') ? "" : blood;
//             const donors = await api.searchDonors(bloodQuery, city);

//             resultsGrid.innerHTML = "";

//             if (!donors || donors.length === 0) {
//                 resultsGrid.innerHTML = `
//                 <div class="glass-card" style="grid-column: 1/-1; text-align: center; padding: 40px;">
//                     <i class="fa-solid fa-face-frown" style="font-size: 3rem; opacity: 0.3;"></i>
//                     <p style="margin-top: 15px;">No donors found for <strong>${blood}</strong> in <strong>${city || 'any city'}</strong>.</p>
//                 </div>`;
//                 if (resultCount) resultCount.textContent = "0 donors found";
//                 return;
//             }

//             if (resultCount) resultCount.textContent = `Found ${donors.length} verified donors`;

//             // Render Donor Cards
//             donors.forEach(donor => {
//                 resultsGrid.innerHTML += `
//                 <div class="glass-card donor-card">
//                     <div class="donor-type">${donor.blood}</div>
//                     <div class="donor-info">
//                         <h4>${donor.name}</h4>
//                         <p><i class="fa-solid fa-location-dot"></i> ${donor.city}</p>
//                         <span class="verified-badge"><i class="fa-solid fa-circle-check"></i> Verified Donor</span>
//                     </div>
//                     <div class="donor-actions">
//                         <a href="tel:${donor.phone}" class="btn primary-small">Call Now</a>
//                         <button class="btn secondary-small" onclick="openRequestModal('${donor._id}', '${donor.name}')" style="background: #444; color: white; margin-left: 5px;">
//                             Request
//                         </button>
//                     </div>
//                 </div>`;
//             });

//         } catch (err) {
//             console.error("Search Error:", err);
//             resultsGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--primary-red);"><p>Server Error. Is your backend running?</p></div>`;
//         }
//     };

//     // --- 2. AUTO-FILTER FROM HOME PAGE ---
//     const urlParams = new URLSearchParams(window.location.search);
//     const typeFromUrl = urlParams.get('type');

//     if (typeFromUrl && bloodDropdown) {
//         bloodDropdown.value = typeFromUrl;
//         performSearch(typeFromUrl, "");
//     }

//     // --- 3. MANUAL SEARCH ---
//     if (searchBtn) {
//         searchBtn.addEventListener('click', () => {
//             performSearch(bloodDropdown.value, cityInput ? cityInput.value : "");
//         });
//     }

//     // --- 4. MODAL LOGIC (Exposed for HTML onclick) ---
//     window.openRequestModal = (donorId, donorName) => {
//         const modal = document.getElementById('requestModal');
//         if (modal) {
//             document.getElementById('modalDonorId').value = donorId;
//             document.getElementById('modalDonorName').innerText = `Sending Request to: ${donorName}`;
//             modal.style.display = 'flex';
//         }
//     };

//     window.closeModal = () => {
//         const modal = document.getElementById('requestModal');
//         if (modal) modal.style.display = 'none';
//     };

//     // Close on background click
//     window.addEventListener('click', (e) => {
//         const modal = document.getElementById('requestModal');
//         if (e.target === modal) window.closeModal();
//     });

//     // --- 5. SUBMIT REQUEST ---
//     const requestForm = document.getElementById('requestForm');
//     if (requestForm) {
//         requestForm.addEventListener('submit', async (e) => {
//             e.preventDefault();
//             const payload = {
//                 donorId: document.getElementById('modalDonorId').value,
//                 requesterName: document.getElementById('reqName').value,
//                 requesterContact: document.getElementById('reqPhone').value,
//                 message: document.getElementById('reqMessage').value,
//                 bloodType: bloodDropdown.value
//             };

//             try {
//                 const res = await fetch('http://localhost:3000/api/auth/request-blood', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify(payload)
//                 });
//                 if (res.ok) {
//                     alert("🚀 Request sent! The donor will be notified.");
//                     window.closeModal();
//                     requestForm.reset();
//                 }
//             } catch (err) {
//                 alert("Failed to send request.");
//             }
//         });
//     }

//     // --- 6. HOME PAGE REDIRECTS (if tags present) ---
//     document.querySelectorAll('.tag').forEach(tag => {
//         tag.addEventListener('click', () => {
//             const selectedType = tag.getAttribute('data-type');
//             window.location.href = `search.html?type=${encodeURIComponent(selectedType)}`;
//         });
//     });
// });