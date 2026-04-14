// import { api } from './api.js';

// // --- 1. SECURITY CHECK ---
// if (window.location.pathname.endsWith('admin.html')) {
//     const isLoggedIn = localStorage.getItem('isAdminLoggedIn');

//     if (!isLoggedIn) {
//         alert("Access Denied. Please login first.");
//         window.location.replace("../public/login.html");
//     }
// }
import { api } from './api.js';

// --- 1. SECURITY CHECK ---
if (window.location.pathname.includes('../admin/admin.html')) {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
        alert("Access Denied. Please login first.");
        window.location.href = "../public/login.html";
    }
}

// --- 2. LOGIN LOGIC ---
const loginForm = document.getElementById('unifiedLoginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const data = await api.login(email, password);

            // Save session
            localStorage.setItem('donorId', data.user.id);
            localStorage.setItem('userRole', data.role);
            localStorage.setItem('userEmail', email);

            if (data.role === "admin") {
                localStorage.setItem('isAdminLoggedIn', "true");
            } else {
                localStorage.removeItem('isAdminLoggedIn');
            }

            alert(data.message);
            window.location.href = data.redirect;

        } catch (error) {
            alert(error.message || "Server not running!");
        }
    });
}

// --- 3. LOGOUT FUNCTION ---
function handleLogout() {
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('donorId');

    alert("Logged out successfully.");
    window.location.replace("../public/login.html");
}

// --- 4. GLOBAL CLICK LISTENER ---
document.addEventListener('click', (e) => {

    // A. Logout
    if (e.target.closest('.logout-btn') || e.target.closest('.logout-trigger')) {
        e.preventDefault();
        handleLogout();
    }

    // B. Resolve emergency rows
    if (e.target.closest('.btn-text-1') || e.target.closest('.btn-text')) {
        const row = e.target.closest("tr");
        if (row && confirm("Mark this emergency as resolved?")) {
            row.remove();
        }
    }
});

// --- NAVBAR SYNC LOGIC ---
function syncNavbar() {
    const role = localStorage.getItem('userRole');
    const guestSection = document.getElementById('nav-guest');
    const userSection = document.getElementById('nav-user');

    if (role) {
        if (guestSection) guestSection.style.display = 'none';
        if (userSection) userSection.style.display = 'flex';
    } else {
        if (guestSection) guestSection.style.display = 'flex';
        if (userSection) userSection.style.display = 'none';
    }
}

// Call this every time a page loads
document.addEventListener('DOMContentLoaded', syncNavbar);



// // --- 2. LOGIN LOGIC ---
// const loginForm = document.getElementById('unifiedLoginForm');

// if (loginForm) {
//     loginForm.addEventListener('submit', async function(e) {
//         e.preventDefault();

//         const email = document.getElementById('email').value;
//         const password = document.getElementById('password').value;

//         try {
//             // ✅ USE THE API OBJECT INSTEAD OF FETCH
//             const data = await api.login(email, password);

//             // ✅ Save role & session
//             localStorage.setItem('donorId', data.user.id);
//             localStorage.setItem('userRole', data.role);
//             localStorage.setItem('userEmail', email); // Useful for profile page later

//             if (data.role === "admin") {
//                 localStorage.setItem('isAdminLoggedIn', "true");
//             }

//             alert(data.message);
//             window.location.href = data.redirect;

//         } catch (error) {
//             // The catch block now handles the "Error: Something went wrong" from api.js
//             alert(error.message || "Server not running!");
//         }
//     });
// }

// // --- 3. LOGOUT LOGIC ---
// // const handleLogout = ('click', (e) => {
  
// //     // 1. Clear all session data
// //     localStorage.removeItem('isAdminLoggedIn');
// //     localStorage.removeItem('userRole');
// //     localStorage.removeItem('userEmail');
// //     localStorage.removeItem('donorId');
// //     alert("Logged out successfully.");
// // });
// //     // 2. Fix the Path
// //     // If you are in /admin/admin.html, you need to go UP one level to find /public/
// //      window.location.replace("../public/login.html"); 
// // });

// // --- 3. LOGOUT LOGIC ---
// const logoutLink = document.getElementById('logoutLink');

// if (logoutLink) {
//     logoutLink.addEventListener('click', (e) => {
//         e.preventDefault();

//         // 1. Clear all session data
//         localStorage.removeItem('isAdminLoggedIn');
//         localStorage.removeItem('userRole');
//         localStorage.removeItem('userEmail');
//         localStorage.removeItem('donorId');
        
//         // Optional: Clear EVERYTHING if you want a total reset
//         // localStorage.clear(); 

//         alert("Logged out successfully.");

//         // 2. Redirect using replace (Prevents "Back" button access)
//         window.location.replace("../public/login.html"); 
//     });
// }



// // 4. Global Listener (The Reliable Way)
// document.addEventListener('click', (e) => {
//     // A. Handle Logout (Works for both .logout-btn and .logout-trigger)
//     if (e.target.closest('.logout-btn') || e.target.closest('.logout-trigger')) {
//         e.preventDefault();
//         handleLogout();
//     }

//     // B. Handle Admin Row Removal (From your HEAD section)
//     // This allows admins to "Resolve" requests on the fly
//     if (e.target.closest('.btn-text-1') || e.target.closest('.btn-text')) {
//         const row = e.target.closest("tr");
//         if (row && confirm("Mark this emergency as resolved?")) {
//             row.remove();
//         }
//     }
// });