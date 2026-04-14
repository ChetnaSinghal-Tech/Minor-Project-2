import { BASE_URL } from "./api.js";

async function loadAdminData() {
    try {
        // 🔥 FETCH DONORS
        const donorRes = await fetch(`${BASE_URL}/all-donors`);
        const donors = await donorRes.json();

        document.getElementById("totalDonors").innerText = donors.length;

        // 🔥 FETCH REQUESTS
        const reqRes = await fetch(`${BASE_URL}/all-requests`);
        const requests = await reqRes.json();

        document.getElementById("totalRequests").innerText = requests.length;

        const pending = requests.filter(r => r.status === "pending").length;
        const accepted = requests.filter(r => r.status === "accepted").length;
        const rejected = requests.filter(r => r.status === "rejected").length;

        document.getElementById("pendingCount").innerText = pending;

        // OPTIONAL (only if you added in HTML)
        if (document.getElementById("acceptedCount")) {
            document.getElementById("acceptedCount").innerText = accepted;
        }

        if (document.getElementById("rejectedCount")) {
            document.getElementById("rejectedCount").innerText = rejected;
        }

        // 🔥 TABLE
        const table = document.getElementById("requestTable");
        if (table) {
            table.innerHTML = "";

            requests.slice(0, 5).forEach(req => {
                table.innerHTML += `
                    <tr>
                        <td>${req.senderId?.name || "User"}</td>
                        <td><span class="badge">${req.bloodType}</span></td>
                        <td>${req.donorId?.name || "Donor"}</td>
                       <td class="status-${req.status}">${req.status}</td>
                        <td><button class="btn-text">View</button></td>
                    </tr>
                `;
            });
        }

    } catch (err) {
        console.error("Admin error:", err);
    }
}

loadAdminData();