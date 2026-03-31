document.addEventListener('DOMContentLoaded', () => {

    // 1. DATA INITIALIZATION
    const userData = {
        name: "Sarah",
        totalDonations: 14,
        livesSaved: 42,
        points: 2850,
        lastDonationDate: "2026-01-10",
        eligibleDate: "2026-04-10"
    };

    const historyData = [
        { date: "Jan 10, 2026", loc: "City Hospital", type: "Whole Blood", status: "Verified" },
        { date: "Oct 05, 2025", loc: "Red Cross", type: "Platelets", status: "Verified" },
        { date: "July 12, 2025", loc: "Donix Center", type: "Whole Blood", status: "Verified" }
    ];

    // 2. COUNTER ANIMATION FUNCTION
    const animateValue = (id, start, end, duration) => {
        const obj = document.getElementById(id);
        if (!obj) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    // Trigger Animations on Load
    animateValue("statDonations", 0, userData.totalDonations, 1500);
    animateValue("statLives", 0, userData.livesSaved, 2000);

    // 3. TAB / SECTION SWITCHING (ACTIVE LOGIC)
    const menuItems = document.querySelectorAll('#sidebarMenu li');
    const sections = document.querySelectorAll('.dashboard-view');

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetSection = item.getAttribute('data-section');

            // Toggle Sidebar UI
            menuItems.forEach(i => i.classList.remove('active-tab'));
            item.classList.add('active-tab');

            // Toggle Content Visibility
            sections.forEach(s => s.style.display = 'none');
            const activeDiv = document.getElementById(`section-${targetSection}`);
            if (activeDiv) activeDiv.style.display = 'block';

            // Special Loaders
            if (targetSection === 'history') loadHistoryTable();

            showToast(`Viewing ${item.innerText}`);
        });
    });

    function loadHistoryTable() {
        const tableBody = document.getElementById('historyTableBody');
        if (!tableBody) return;
        tableBody.innerHTML = historyData.map(row => `
                 <tr style="border-bottom: 1px solid var(--glass-border);">
                 <td style="padding: 15px;">${row.date}</td>
                 <td style="padding: 15px;">${row.loc}</td>
                 <td style="padding: 15px;">${row.type}</td>
                 <td style="padding: 15px;"><span class="status-ok">${row.status}</span></td>
             </tr>
         `).join('');
    }

    // 4. BLOOD TYPE SELECTION (OVERVIEW)
    const tags = document.querySelectorAll('.tag');
    let activeBloodType = null;

    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            tags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            activeBloodType = tag.dataset.type;
        });
    });

    // 5. EMERGENCY SEARCH
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            if (!activeBloodType) {
                showToast("⚠️ Please select a blood type first!");
                return;
            }
            searchBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Locating Donors...';
            searchBtn.disabled = true;

            setTimeout(() => {
                showToast(`✅ Found 12 verified ${activeBloodType} donors nearby!`);
                searchBtn.innerHTML = 'Start Emergency Search';
                searchBtn.disabled = false;
            }, 2000);
        });
    }

    // 6. REWARDS REDEMPTION
    window.redeem = (cost, itemName) => {
        if (userData.points >= cost) {
            userData.points -= cost;
            const display = document.getElementById('userPointsDisplay');
            if (display) display.innerText = userData.points.toLocaleString();
            showToast(`🎁 Successfully redeemed: ${itemName}`);
        } else {
            showToast("❌ Not enough points!");
        }
    };

    // 7. PROFILE SETTINGS FORM HANDLING
    async function loadUserProfile() {
        // 1. Get the email we saved during login
        const userEmail = localStorage.getItem('loggedInEmail');

        if (!userEmail) {
            window.location.href = "../public/login.html";
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/user-profile/${userEmail}`);
            const userData = await response.json();

            // 2. Update the HTML inputs with DB values
            document.getElementById('editName').value = userData.name;
            document.getElementById('editBlood').value = userData.blood;
            document.getElementById('editEmail').value = userData.email;

            // If you want to show city in the SMS alert text:
            const cityLabel = document.querySelector('label[for="notifyCheck"]');
            cityLabel.innerText = `Receive SMS alerts for Emergency Needs in ${userData.city}`;

        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    }

    // Call this when the page loads
    document.addEventListener('DOMContentLoaded', loadUserProfile);

    // 8. SCHEDULE DONATION
    const scheduleBtn = document.getElementById('scheduleBtn');
    if (scheduleBtn) {
        scheduleBtn.addEventListener('click', () => {
            const today = new Date();
            const eligible = new Date(userData.eligibleDate);
            if (today < eligible) {
                showToast(`⏳ Safe Period: Eligible on ${userData.eligibleDate}`);
            } else {
                showToast("📅 Redirecting to Hospital Slots...");
            }
        });
    }

    // 9. LOGOUT
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            if (!confirm("Are you sure you want to logout?")) e.preventDefault();
        });
    }

    // 10. UTILITIES (TOAST & LIVE PULSE)
    function showToast(message) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.innerText = message;
        toast.style.display = 'block';
        setTimeout(() => { toast.style.display = 'none'; }, 3000);
    }

    let liveDonors = 42;
    setInterval(() => {
        const countDisplay = document.getElementById('liveDonorCount');
        if (countDisplay) {
            liveDonors += Math.floor(Math.random() * 3) - 1;
            countDisplay.innerText = `Live: ${liveDonors} Donors Online`;
        }
    }, 5000);
}); 