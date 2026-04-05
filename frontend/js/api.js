// js/api.js

// 1. Centralized URL - Change this ONLY here when you deploy to Render/Vercel
const BASE_URL = "http://localhost:3000/api/auth";

// 2. Helper function to handle response errors
const handleResponse = async (res) => {
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
    }
    return data;
};

// 3. Exported API Functions
export const api = {
    // Register a new donor
    register: async (formData) => {
        const res = await fetch(`${BASE_URL}/save`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });
        return res; // We return the whole res to check for status 201 in the UI
    },

    // Login user/admin
    login: async (email, password) => {
        const res = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        return handleResponse(res);
    },

    getProfile: async (email) => {
        const res = await fetch(`${BASE_URL}/user-profile/${email}`);
        if (!res.ok) throw new Error("Could not fetch profile");
        return res.json();
    },

    // js/api.js
    searchDonors: async (blood, city) => {
        try {
            // Added explicit logging to see exactly what we are sending
            const url = `${BASE_URL}/search?blood=${encodeURIComponent(blood)}&city=${encodeURIComponent(city)}`;
            console.log("Fetching from:", url);

            const res = await fetch(url);
            
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Backend returned an error");
            }
            return await res.json();
        } catch (err) {
            console.error("API Bridge Error:", err);
            throw err; // Pass it to the UI to show 'Server Error'
        }
    }
};