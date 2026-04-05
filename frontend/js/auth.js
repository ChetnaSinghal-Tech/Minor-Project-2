<<<<<<< HEAD
// --- 1. SECURITY CHECK ---
if (window.location.pathname.includes('/admin/')) {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
        alert("Access Denied. Please login first.");
        // FIX: Use the full path that worked for you
=======
import { api } from './api.js';

// --- 1. SECURITY CHECK ---
if (window.location.pathname.includes('../admin/admin.html')) {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
        alert("Access Denied. Please login first.");
>>>>>>> f7f0236 ( Filtered donors on the basis of city and blood group also added the request functionality. Also fixed the schema and request section on user dashboard.)
        window.location.href = "../public/login.html";
    }
}

<<<<<<< HEAD
// --- 2. LOGIN LOGIC ---
// --- LOGIN LOGIC ---
=======



// --- 2. LOGIN LOGIC ---
>>>>>>> f7f0236 ( Filtered donors on the basis of city and blood group also added the request functionality. Also fixed the schema and request section on user dashboard.)
const loginForm = document.getElementById('unifiedLoginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
<<<<<<< HEAD
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {

                // ✅ Save role
                localStorage.setItem('userRole', data.role);

                // ✅ VERY IMPORTANT (Fix your error)
                if (data.role === "admin") {
                    localStorage.setItem('isAdminLoggedIn', "true");
                }

                alert(data.message);

                // ✅ Redirect
                window.location.href = data.redirect;

            } else {
                alert(data.message);
            }

        } catch (error) {
            alert("Error: Server not running!");
=======
            // ✅ USE THE API OBJECT INSTEAD OF FETCH
            const data = await api.login(email, password);

            // ✅ Save role & session
            localStorage.setItem('donorId', data.user.id);
            localStorage.setItem('userRole', data.role);
            localStorage.setItem('userEmail', email); // Useful for profile page later

            if (data.role === "admin") {
                localStorage.setItem('isAdminLoggedIn', "true");
            }

            alert(data.message);
            window.location.href = data.redirect;

        } catch (error) {
            // The catch block now handles the "Error: Something went wrong" from api.js
            alert(error.message || "Server not running!");
>>>>>>> f7f0236 ( Filtered donors on the basis of city and blood group also added the request functionality. Also fixed the schema and request section on user dashboard.)
        }
    });
}

// --- 3. LOGOUT LOGIC ---
<<<<<<< HEAD
function handleLogout() {
    // Clear the session
    localStorage.removeItem('isAdminLoggedIn');
    
    alert("Logged out successfully.");

    // This is the absolute path to your public home page
    window.location.href = "../public/index.html";
}

// Global click listener
document.addEventListener('click', (e) => {
    // This looks for the class we added to the HTML
    if (e.target.closest('.logout-trigger')) {
        e.preventDefault(); // This stops the browser from trying to follow any href
        handleLogout();
    }
});


//for removing the row 
const buttons = document.querySelectorAll(".btn-text-1");

buttons.forEach(function(button){

button.addEventListener("click", function(){

const row = this.closest("tr");

row.remove();

});

=======
const handleLogout = () => {
    console.log("Logout triggered..."); // Debugging line
    
    // 1. Clear all session data
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    
    alert("Logged out successfully.");

    // 2. Fix the Path
    // If you are in /admin/admin.html, you need to go UP one level to find /public/
    window.location.href = "../public/index.html"; 
};

// 4. Global Listener (The Reliable Way)
document.addEventListener('click', (e) => {
    // Look for any element with the class 'logout-btn'
    if (e.target.closest('.logout-btn')) {
        e.preventDefault();
        handleLogout();
    }
>>>>>>> f7f0236 ( Filtered donors on the basis of city and blood group also added the request functionality. Also fixed the schema and request section on user dashboard.)
});