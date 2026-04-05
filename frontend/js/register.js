<<<<<<< HEAD
document.getElementById("regForm").addEventListener("submit", async function(e){
    e.preventDefault();

    // Capture all fields
=======
import { api } from './api.js';

document.getElementById("regForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    // 1. Capture all fields
>>>>>>> f7f0236 ( Filtered donors on the basis of city and blood group also added the request functionality. Also fixed the schema and request section on user dashboard.)
    const name = document.getElementById("name").value;
    const blood = document.getElementById("blood").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const city = document.getElementById("city").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

<<<<<<< HEAD
    // CLIENT-SIDE VALIDATION: Check if passwords match before hitting the server
    if (password !== confirmPassword) {
        alert("Passwords do not match! Please check again.");
        return; // Stop the function here
=======
    // 2. Client-Side Validation
    if (password !== confirmPassword) {
        alert("Passwords do not match! Please check again.");
        return;
>>>>>>> f7f0236 ( Filtered donors on the basis of city and blood group also added the request functionality. Also fixed the schema and request section on user dashboard.)
    }

    if (password.length < 6) {
        alert("Password should be at least 6 characters.");
        return;
    }

    try {
<<<<<<< HEAD
        const res = await fetch("http://localhost:3000/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                blood: blood,
                email: email,
                phone: phone,
                city: city,
                password: password // Sending the password to Node.js
            })
        });

        const data = await res.text();
        alert(data);

        // If registration is successful, redirect to login page
        if (res.status === 200) {
=======
        // 3. Prepare data object
        const formData = { name, blood, email, phone, city, password };

        // 4. Use the API bridge instead of manual fetch
        const res = await api.register(formData);

        // Get the message from the server (since we sent res.send in backend)
        const message = await res.text();
        alert(message);

        // 5. Redirect on success (201 Created or 200 OK)
        if (res.status === 201 || res.status === 200) {
>>>>>>> f7f0236 ( Filtered donors on the basis of city and blood group also added the request functionality. Also fixed the schema and request section on user dashboard.)
            window.location.href = "login.html";
        }

    } catch (error) {
<<<<<<< HEAD
        console.error("Error connecting to server:", error);
        alert("Server is not running. Please start your Node.js server!");
=======
        console.error("Registration Error:", error);
        alert(error.message || "Server is not running. Please start your Node.js server!");
>>>>>>> f7f0236 ( Filtered donors on the basis of city and blood group also added the request functionality. Also fixed the schema and request section on user dashboard.)
    }
});