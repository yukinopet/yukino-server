document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#workspaceTable tbody");
  const countdownDiv = document.getElementById("countdown");

  fetch("https://raw.githubusercontent.com/yukinopet/yukino-server/storage/server.json")
    .then(response => response.json())
    .then(data => {
      const entries = Array.isArray(data) ? data : [data];
      tableBody.innerHTML = "";

      entries.forEach(item => {
        const row = document.createElement("tr");

        const cmdCell = document.createElement("td");
        cmdCell.textContent = item.connect_command;

        const userCell = document.createElement("td");
        userCell.textContent = item.username;

        const profileCell = document.createElement("td");
        profileCell.textContent = item.profile;

        const statusCell = document.createElement("td");
        statusCell.textContent = item.status;

        const startCell = document.createElement("td");
        startCell.textContent = item.date_start || "-";

        const endCell = document.createElement("td");
        endCell.textContent = item.date_end || "-";

        row.appendChild(cmdCell);
        row.appendChild(userCell);
        row.appendChild(profileCell);
        row.appendChild(statusCell);
        row.appendChild(startCell);
        row.appendChild(endCell);
        tableBody.appendChild(row);
      });

      // Set up countdown for first item's date_end
      const firstEnd = entries[0]?.date_end;
      if (firstEnd) {
        const endTime = new Date(firstEnd.replace(" ", "T")); // Parse as ISO
        updateCountdown(endTime);
        setInterval(() => updateCountdown(endTime), 1000);
      } else {
        countdownDiv.textContent = "No end time available.";
      }
    })
    .catch(error => {
      console.error("Error loading local data:", error);
      const errorRow = document.createElement("tr");
      const errorCell = document.createElement("td");
      errorCell.colSpan = 6;
      errorCell.textContent = "Failed to load data.";
      errorRow.appendChild(errorCell);
      tableBody.appendChild(errorRow);
    });

  function updateCountdown(endTime) {
    const now = new Date();
    const diff = endTime - now;

    if (diff <= 0) {
      countdownDiv.textContent = "⏱️ Time has ended.";
      return;
    }

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const hours = Math.floor((diff / 1000 / 60 / 60));

    countdownDiv.textContent = `⏳ Time remaining: ${hours}h ${minutes}m ${seconds}s`;
  }
});
