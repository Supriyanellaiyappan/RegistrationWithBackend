const API_BASE_URL = "http://localhost:3000/api/users"; 
const openRegisterBtn = document.getElementById("open-register");
const registerPopup = document.getElementById("register-popup");
const closeBtn = document.getElementById("close");
const registerBtn = document.getElementById("register-btn");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const addressInput = document.getElementById("address");
const roleSelect = document.getElementById("role");
const nameError = document.getElementById("name-error");
const emailError = document.getElementById("email-error");
const phoneError = document.getElementById("phone-error");
const confirmError = document.getElementById("confirm-error"); 
const roleError = document.getElementById("role-error");
if (openRegisterBtn) {
    openRegisterBtn.addEventListener("click", () => {
        registerPopup.classList.remove("hidden");
    });
}
if (closeBtn) {
    closeBtn.addEventListener("click", () => {
        registerPopup.classList.add("hidden");
        clearErrors();
    });
}
if (registerPopup) {
    registerPopup.addEventListener("click", (e) => {
        if (e.target === registerPopup) {
            registerPopup.classList.add("hidden");
            clearErrors();
        }
    });
}
if (registerBtn) {
    registerBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        let isValid = true;
        clearErrors();
        if (nameInput && nameInput.value.trim() === "") {
            nameError.textContent = "Name is required";
            nameError.classList.remove("hidden");
            isValid = false;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput && emailInput.value.trim() === "") {
            emailError.textContent = "Email is required";
            emailError.classList.remove("hidden");
            isValid = false;
        } else if (emailInput && !emailPattern.test(emailInput.value)) {
            emailError.textContent = "Enter a valid email";
            emailError.classList.remove("hidden");
            isValid = false;
        }
        const phonePattern = /^[0-9]{10}$/;
        if (phoneInput && phoneInput.value.trim() === "") {
            phoneError.textContent = "Phone number is required";
            phoneError.classList.remove("hidden");
            isValid = false;
        } else if (phoneInput && !phonePattern.test(phoneInput.value)) {
            phoneError.textContent = "Enter a valid 10-digit phone number";
            phoneError.classList.remove("hidden");
            isValid = false;
        }
        if (addressInput && addressInput.value.trim() === "") {
            confirmError.textContent = "Address is required";
            confirmError.classList.remove("hidden");
            isValid = false;
        } else if (addressInput && addressInput.value.trim().length < 5) {
            confirmError.textContent = "Address should be at least 5 characters";
            confirmError.classList.remove("hidden");
            isValid = false;
        }
        if (roleSelect && roleSelect.value === "") {
            roleError.textContent = "Please select a role";
            roleError.classList.remove("hidden");
            isValid = false;
        }
        if (!isValid) return;
        try {
            const response = await fetch(API_BASE_URL, { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: nameInput.value,
                    email: emailInput.value,
                    phoneNumber: phoneInput.value,
                    address: addressInput.value,
                    role: roleSelect.value,
                }),
            });
            if (response.ok) {
                alert("Registration successful!");
                registerPopup.classList.add("hidden");
                clearForm();
            } else {
                const error = await response.json();
                alert("Error: " + (error.message || response.statusText));
            }
        } catch (err) {
            console.error(err);
            alert("Failed to connect to server. Ensure the backend is running on port 3000.");
        }
    });
}
function clearErrors() {
    const errors = [nameError, emailError, phoneError, confirmError, roleError]; 
    errors.forEach((err) => {
        if (err) {
            err.textContent = "";
            err.classList.add("hidden");
        }
    });
}
function clearForm() {
    if (nameInput) nameInput.value = "";
    if (emailInput) emailInput.value = "";
    if (phoneInput) phoneInput.value = "";
    if (addressInput) addressInput.value = "";
    if (roleSelect) roleSelect.value = "";
}
const usersBody = document.getElementById("usersBody");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");
const closeModalBtn = document.getElementById("closeModal");
async function fetchUsers() {
    if (!usersBody) return;
    try {
        const response = await fetch(API_BASE_URL); 
        if (!response.ok) throw new Error("Failed to fetch users");
        const users = await response.json();
        usersBody.innerHTML = ""; 
        
        if (users.length === 0) {
             usersBody.innerHTML = `<tr><td colspan="7" class="text-center text-gray-500 p-3">No registered users found.</td></tr>`;
             return;
        }
        users.forEach((user) => {
            const row = document.createElement("tr");
            row.className = "hover:bg-gray-50 transition duration-150"; 
            row.innerHTML = `
                <td class="p-3 border-b">${user.id ? user.id.substring(0, 4) + '...' : 'N/A'}</td>
                <td class="p-3 border-b">${user.fullName || 'N/A'}</td>
                <td class="p-3 border-b">${user.email || 'N/A'}</td>
                <td class="p-3 border-b">${user.phoneNumber || 'N/A'}</td>
                <td class="p-3 border-b">${user.role || "N/A"}</td>
                <td class="p-3 border-b">${user.address || 'N/A'}</td>
                <td class="p-3 border-b flex gap-2">
                    <button class="bg-[#00C3D0] text-white px-4 py-2 rounded text-sm update-btn hover:bg-[#F2FF64]/75 hover:text-black transition">Update</button>
                    <button class="bg-red-500 text-white px-4 py-2 rounded text-sm delete-btn hover:bg-red-600 transition">Delete</button>
                </td>
            `;
            row.querySelector(".update-btn").addEventListener("click", () => openUpdateModal(user));
            row.querySelector(".delete-btn").addEventListener("click", () => deleteUser(user.id));
            usersBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        usersBody.innerHTML = `<tr><td colspan="7" class="text-center text-red-500 p-3">Failed to load users. Is the backend server running on ${API_BASE_URL}?</td></tr>`;
    }
}
async function deleteUser(id) {
    if (!id || !confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, { 
            method: "DELETE",
        });
        if (response.ok) {
            alert("User deleted successfully!");
            fetchUsers();
        } else {
            const error = await response.json();
            alert("Failed to delete user: " + (error.message || response.statusText));
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to connect to the server.");
    }
}
function openUpdateModal(user) {
    if (!modalContent) return;
    modalContent.innerHTML = `
        <h3 class="font-bold text-lg mb-4">Update User</h3>
        <form id="updateForm" class="flex flex-col gap-3">
            <input type="hidden" id="updateUserId" value="${user.id || ''}" />
            <input class="border p-2 rounded" type="text" id="updateFullName" value="${
                user.fullName || ''
            }" placeholder="Full Name" required />
            <input class="border p-2 rounded" type="email" id="updateEmail" value="${
                user.email || ''
            }" placeholder="Email" required />
            <input class="border p-2 rounded" type="text" id="updatePhoneNumber" value="${
                user.phoneNumber || ''
            }" placeholder="Phone Number" />
            <select class="border p-2 rounded" id="updateRole" required>
                <option value="Student" ${user.role === 'Student' ? 'selected' : ''}>Student</option>
                <option value="Instructor" ${user.role === 'Instructor' ? 'selected' : ''}>Instructor</option>
                <option value="Admin" ${user.role === 'Admin' ? 'selected' : ''}>Admin</option>
            </select>
            <input class="border p-2 rounded" type="text" id="updateAddress" value="${
                user.address || ''
            }" placeholder="Address" />
            <textarea class="border p-2 rounded" id="updateNotes" placeholder="Notes (Optional)">${
                user.notes || ""
            }</textarea>
            <button type="submit" class="bg-[#00C3D0] text-white px-4 py-2 rounded mt-2 hover:bg-green-500 transition">Update</button>
        </form>
    `;
    const updateForm = document.getElementById("updateForm");
    if (updateForm) {
        updateForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const id = document.getElementById("updateUserId").value;
            const userData = {
                fullName: document.getElementById("updateFullName").value,
                email: document.getElementById("updateEmail").value,
                phoneNumber: document.getElementById("updatePhoneNumber").value,
                role: document.getElementById("updateRole").value,
                address: document.getElementById("updateAddress").value,
                notes: document.getElementById("updateNotes").value,
            };
            if (!userData.fullName || !userData.email || !userData.role || !userData.address) {
                 return alert("Please fill in all required fields (Name, Email, Role, Address).");
            }
            try {
                const response = await fetch(`${API_BASE_URL}/${id}`, { 
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userData),
                });
                
                if (response.ok) {
                    alert("User updated successfully!");
                    modal.classList.add("hidden");
                    fetchUsers();
                } else {
                    const error = await response.json();
                    alert(`Update failed: ${error.message || response.statusText}`);
                }
            } catch (error) {
                console.error("Error updating user:", error);
                alert("Failed to connect to the server.");
            }
        });
    }
    if (modal) modal.classList.remove("hidden");
}
if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
        if (modal) modal.classList.add("hidden");
    });
}
if (modal) {
    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.add("hidden");
    });
}
if (document.getElementById("usersBody")) {
    window.addEventListener("DOMContentLoaded", fetchUsers);
}