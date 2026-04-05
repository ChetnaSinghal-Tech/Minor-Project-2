import { api } from './api.js';

document.getElementById("regForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    // 1. Capture all fields
    const name = document.getElementById("name").value;
    const blood = document.getElementById("blood").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const city = document.getElementById("city").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // 2. Client-Side Validation
    if (password !== confirmPassword) {
        alert("Passwords do not match! Please check again.");
        return;
    }

    if (password.length < 6) {
        alert("Password should be at least 6 characters.");
        return;
    }

    try {
        // 3. Prepare data object
        const formData = { name, blood, email, phone, city, password };

        // 4. Use the API bridge (Cleaner & reusable)
        const res = await api.register(formData);

        // Capture server response message
        const message = await res.text();
        alert(message);

        // 5. Redirect on success (Handles both 201 Created and 200 OK)
        if (res.status === 201 || res.status === 200) {
            window.location.href = "login.html";
        }

    } catch (error) {
        console.error("Registration Error:", error);
        alert(error.message || "Server is not running. Please start your Node.js server!");
    }
});