import { api, BASE_URL } from './api.js'; // make sure BASE_URL is exported from api.js

// --- 1. UTILITIES ---
const showToast = (message) => {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.innerText = message;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 3000);
};

const animateValue = (id, start, end, duration) => {
    const obj = document.getElementById(id);
    if (!obj) return;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
};

// --- 1. SECURITY & DATA LOADING ---
document.addEventListener('DOMContentLoaded', async () => {
    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userRole');
    const donorId = localStorage.getItem('donorId');

    if (!userEmail || !userRole) {
        alert("Session expired. Please login again.");
        window.location.href = "../public/login.html";
        return;
    }

    try {
        const userData = await api.getProfile(userEmail);

        document.getElementById('currentViewName').textContent = userData.name;
        document.getElementById('editName').value = userData.name;
        document.getElementById('editEmail').value = userData.email;
        document.getElementById('editBlood').value = userData.blood;

        animateValue("statDonations", 0, userData.totalDonations || 0, 1500);
        animateValue("statLives", 0, (userData.totalDonations * 3) || 0, 2000);

        document.getElementById('statDonations').textContent = "0";

        // --- FETCH REAL-TIME REQUESTS ---
        const requestsList = document.getElementById('requests-list');
        if (requestsList && donorId) {
            const response = await fetch(`${BASE_URL}/my-requests?donorId=${donorId}`);
            const requests = await response.json();

            if (requests.length === 0) {
                requestsList.innerHTML = `<div class="empty-state"><p>No active blood requests. Keep being a hero!</p></div>`;
            } else {
                requestsList.innerHTML = requests.map(req => `
                    <div class="request-card">
                        <div class="request-content">
                            <h4>From: ${req.requesterName}</h4>
                            <p><strong>Blood:</strong> ${req.bloodType}</p>
                            <p><strong>Message:</strong> "${req.message}"</p>
                            <span class="status-tag status-${req.status}">${req.status}</span>
                        </div>
                        <div class="request-actions">
                            <button onclick="updateStatus('${req._id}', 'accepted')" class="btn-accept">Accept</button>
                            <button onclick="updateStatus('${req._id}', 'rejected')" class="btn-reject">Decline</button>
                        </div>
                    </div>
                `).join('');
            }
        }

    } catch (err) {
        console.error("Dashboard error:", err);
        showToast("❌ Error loading dashboard data.");
    }
});

// --- TAB SWITCHING LOGIC ---
document.querySelectorAll('#sidebarMenu li').forEach(item => {
    item.addEventListener('click', () => {
        const targetSection = item.getAttribute('data-section');
        document.querySelectorAll('#sidebarMenu li').forEach(i => i.classList.remove('active-tab'));
        item.classList.add('active-tab');
        document.querySelectorAll('.dashboard-view').forEach(section => {
            section.style.display = section.id === `section-${targetSection}` ? 'block' : 'none';
        });

        // adding this new
        if (targetSection === "sent-requests") {
            loadSentRequests();
        }

        showToast(`Viewing ${item.innerText}`);
    });
});

// --- LOGOUT ---
const handleLogout = (e) => {
    e.preventDefault();
    localStorage.clear(); 
    alert("Logged out safely.");
    window.location.replace("../public/login.html");
};
document.getElementById('logoutLink')?.addEventListener('click', handleLogout);
document.querySelector('.logout-trigger')?.addEventListener('click', handleLogout);

// --- UPDATE REQUEST STATUS ---
window.updateStatus = async (requestId, newStatus) => {
    try {
        const response = await fetch(`${BASE_URL}/update-request-status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ requestId, status: newStatus })
        });

        if (response.ok) {
            showToast(`✅ Request ${newStatus}!`);
            setTimeout(() => location.reload(), 1000); 
        }
    } catch (err) {
        showToast("❌ Failed to update status.");
    }
};

// function for sent requests 

async function loadSentRequests() {
    const donorId = localStorage.getItem("donorId");

    const container = document.getElementById("sent-requests-list");
    if (!container || !donorId) return;

    try {
        const res = await fetch(`${BASE_URL}/my-requests?senderId=${donorId}`);
        const requests = await res.json();

        if (requests.length === 0) {
            container.innerHTML = `<div class="empty-state"><p>No requests sent yet 🚀</p></div>`;
            return;
        }

        container.innerHTML = requests.map(req => {
            let statusClass = `status-${req.status}`;
            let statusText = req.status;

            if (req.status === "pending") statusText = "🟡 Pending";
            if (req.status === "accepted") statusText = "🟢 Accepted";
            if (req.status === "rejected") statusText = "🔴 Rejected";

            return `
                <div class="request-card">
                    <div class="request-content">
                        <h4>To: ${req.donorName || "Donor"}</h4>
                        <p><strong>Blood:</strong> ${req.bloodType}</p>
                        <span class="status-tag ${statusClass}">${statusText}</span>
                    </div>
                </div>
            `;
        }).join("");

    } catch (err) {
        console.error("Error loading sent requests", err);
    }
}












// import { api } from './api.js';


// // --- 1. UTILITIES (Keeping the cool UI features) ---
// const showToast = (message) => {
//     const toast = document.getElementById('toast');
//     if (!toast) return;
//     toast.innerText = message;
//     toast.style.display = 'block';
//     setTimeout(() => { toast.style.display = 'none'; }, 3000);
// };

// const animateValue = (id, start, end, duration) => {
//     const obj = document.getElementById(id);
//     if (!obj) return;
//     let startTimestamp = null;
//     const step = (timestamp) => {
//         if (!startTimestamp) startTimestamp = timestamp;
//         const progress = Math.min((timestamp - startTimestamp) / duration, 1);
//         obj.innerHTML = Math.floor(progress * (end - start) + start);
//         if (progress < 1) window.requestAnimationFrame(step);
//     };
//     window.requestAnimationFrame(step);
// };



// // --- 1. SECURITY & DATA LOADING ---
// document.addEventListener('DOMContentLoaded', async () => {
//     const userEmail = localStorage.getItem('userEmail');
//     const userRole = localStorage.getItem('userRole');
//     const donorId = localStorage.getItem('donorId');

//     // Security Gate
    
//     if (!userEmail || !userRole) {
//         alert("Session expired. Please login again.");
//         window.location.href = "../public/login.html";
//         return;
//     }

//     if (userRole === 'admin' && !window.location.pathname.includes('../admin/admin.html')) {
//         console.log("Admin detected on User Dashboard");
//     }
//     else if (userRole === 'user' && !window.location.pathname.includes('../user/user.html')) {
//         console.log("User detected on user Dashboard");
//     }

//     try {
//         const userData = await api.getProfile(userEmail);

//         // Inject data into the UI
//         document.getElementById('currentViewName').textContent = userData.name;
//         document.getElementById('editName').value = userData.name;
//         document.getElementById('editEmail').value = userData.email;
//         document.getElementById('editBlood').value = userData.blood;

//         animateValue("statDonations", 0, userData.totalDonations || 0, 1500);
//         animateValue("statLives", 0, (userData.totalDonations * 3) || 0, 2000);

//         // Update Stats Cards
//         document.getElementById('statDonations').textContent = "0";

//         // // --- 4. FETCH REAL-TIME REQUESTS (Moved inside DOMContentLoaded) ---
//         // const requestsList = document.getElementById('requests-list'); // Matching your HTML ID

//         // if (requestsList && donorId) {
//         //     const response = await fetch(`http://localhost:3000/api/auth/my-requests?donorId=${donorId}`);
//         //     const requests = await response.json();

//         //     if (requests.length === 0) {
//         //         requestsList.innerHTML = `
//         //             <div class="empty-state">
//         //                 <p>No active blood requests at the moment. Keep being a hero!</p>
//         //             </div>`;
//         //     } else {
//         //         requestsList.innerHTML = ""; // Clear loader
//         //         requests.forEach(req => {
//         //             requestsList.innerHTML += `
//         //                 <div class="request-card">
//         //                     <div class="request-content">
//         //                         <h4>From: ${req.requesterName}</h4>
//         //                         <p><strong>Blood:</strong> ${req.bloodType}</p>
//         //                         <p><strong>Contact:</strong> ${req.requesterContact}</p>
//         //                         <p><strong>Message:</strong> "${req.message}"</p>
//         //                         <span class="status-tag status-${req.status}">${req.status}</span>
//         //                     </div>
//         //                     <div class="request-actions">
//         //                         <button onclick="updateStatus('${req._id}', 'accepted')" class="btn-accept">Accept</button>
//         //                         <button onclick="updateStatus('${req._id}', 'rejected')" class="btn-reject">Decline</button>
//         //                     </div>
//         //                 </div>
//         //             `).join('');
//         //     }
//         // }

//         // --- 3. FETCH REAL-TIME REQUESTS ---
//         const requestsList = document.getElementById('requests-list');
//         if (requestsList && donorId) {
//             const response = await fetch(`http://localhost:3000/api/auth/my-requests?donorId=${donorId}`);
//             const requests = await response.json();

//             if (requests.length === 0) {
//                 requestsList.innerHTML = `<div class="empty-state"><p>No active blood requests. Keep being a hero!</p></div>`;
//             } else {
//                 requestsList.innerHTML = requests.map(req => `
//                     <div class="request-card">
//                         <div class="request-content">
//                             <h4>From: ${req.requesterName}</h4>
//                             <p><strong>Blood:</strong> ${req.bloodType}</p>
//                             <p><strong>Message:</strong> "${req.message}"</p>
//                             <span class="status-tag status-${req.status}">${req.status}</span>
//                         </div>
//                         <div class="request-actions">
//                             <button onclick="updateStatus('${req._id}', 'accepted')" class="btn-accept">Accept</button>
//                             <button onclick="updateStatus('${req._id}', 'rejected')" class="btn-reject">Decline</button>
//                         </div>
//                     </div>
//                 `).join('');
//             }
//         }


//     }catch (err) {
//         console.error("Dashboard error:", err);
//         showToast("❌ Error loading dashboard data.");
//     }
// });

// // --- 4. TAB SWITCHING LOGIC ---
// document.querySelectorAll('#sidebarMenu li').forEach(item => {
//     item.addEventListener('click', () => {
//         const targetSection = item.getAttribute('data-section');
        
//         // UI Updates
//         document.querySelectorAll('#sidebarMenu li').forEach(i => i.classList.remove('active-tab'));
//         item.classList.add('active-tab');

//         // Toggle Sections
//         document.querySelectorAll('.dashboard-view').forEach(section => {
//             section.style.display = section.id === `section-${targetSection}` ? 'block' : 'none';
//         });
        
//         showToast(`Viewing ${item.innerText}`);
//     });
// });

// // --- 3. LOGOUT LOGIC ---
// // Function to handle logout
// const handleLogout = (e) => {
//     e.preventDefault();
    
//     // Clear all session data
//     localStorage.clear(); 
    
//     alert("Logged out safely.");
    
//     // Use .replace to prevent the "Back" button from re-entering the dashboard
//     window.location.replace("../public/login.html");
// };

// // 1. Try to find by ID (for user dashboard)
// document.getElementById('logoutLink')?.addEventListener('click', handleLogout);

// // 2. Try to find by Class (for admin sidebar)
// document.querySelector('.logout-trigger')?.addEventListener('click', handleLogout);

// // --- 5. UPDATE REQUEST STATUS ---
// window.updateStatus = async (requestId, newStatus) => {
//     try {
//         const response = await fetch(`http://localhost:3000/api/auth/update-request-status`, {
//             method: 'PATCH',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ requestId, status: newStatus })
//         });

//         if (response.ok) {
//             showToast(`✅ Request ${newStatus}!`);
//             setTimeout(() => location.reload(), 1000); 
//         }
//     } catch (err) {
//         showToast("❌ Failed to update status.");
//     }
// };
