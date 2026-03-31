document.getElementById("regForm").addEventListener("submit", async function(e){
    e.preventDefault();

    // Capture all fields
    const name = document.getElementById("name").value;
    const blood = document.getElementById("blood").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const city = document.getElementById("city").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // CLIENT-SIDE VALIDATION: Check if passwords match before hitting the server
    if (password !== confirmPassword) {
        alert("Passwords do not match! Please check again.");
        return; // Stop the function here
    }

    if (password.length < 6) {
        alert("Password should be at least 6 characters.");
        return;
    }

    try {
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
            window.location.href = "login.html";
        }

    } catch (error) {
        console.error("Error connecting to server:", error);
        alert("Server is not running. Please start your Node.js server!");
    }
});