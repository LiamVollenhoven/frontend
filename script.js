const API_URL = "http://localhost:5000/employees";

// Load employees when page loads
window.onload = loadEmployees;

async function loadEmployees() {
    const response = await fetch(API_URL);
    const employees = await response.json();

    const list = document.getElementById("employeeList");
    list.innerHTML = "";

    employees.forEach(emp => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${emp.name} - ${emp.role}
            <button onclick="deleteEmployee('${emp._id}')">Delete</button>
        `;
        list.appendChild(li);
    });
}

async function addEmployee() {
    const name = document.getElementById("name").value;
    const role = document.getElementById("role").value;

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role })
    });

    document.getElementById("name").value = "";
    document.getElementById("role").value = "";

    loadEmployees();
}

async function deleteEmployee(id) {
    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    loadEmployees();
}