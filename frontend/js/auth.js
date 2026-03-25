// --- 1. SECURITY CHECK ---
if (window.location.pathname.includes('/admin/')) {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
        alert("Access Denied. Please login first.");
        // FIX: Use the full path that worked for you
        window.location.href = "../public/login.html";
    }
}

// --- 2. LOGIN LOGIC ---
const loginForm = document.getElementById('unifiedLoginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (email === "admin@donix.com" && password === "admin123") {
            localStorage.setItem('isAdminLoggedIn', 'true');
            alert("Access Granted: Welcome Chief Admin");
            window.location.href = "../admin/admin.html";
        } else {
            alert("Welcome back, Hero!");
            // Being inside /public/ already, this works
            window.location.href = "index.html"; 
        }
    });
}

// --- 3. LOGOUT LOGIC ---
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

});