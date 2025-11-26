## 🎓RegistrationWithBackend(UMS)

A simple full-stack RegistrationWithBackend where you can *add, **view, **update, and **delete* user records (CRUD operations).  
The project uses a *Node.js + Express backend, **Firebase Firestore database, and a clean **HTML + Vanilla JavaScript + Tailwind CSS frontend*.

---

## ✅ Features

### ✔ Add Users  
Enter user details in the registration form (index.html).  
Data is validated and stored in Firebase Firestore.

### ✔ View Users  
Displays all registered users in a *clean, filterable table* (list.html).  
Shows *Name, Email, Phone, Role, and Address*.

### ✔ Update Users  
Update user details using a *modal/popup* on the user list page.  
Sends a *PUT request* to update the Firestore record.

### ✔ Delete Users  
Remove a user instantly using a *DELETE request*.

### ✔ REST API  
Complete CRUD API using Express (/api/users).  
The deployed API URL is used inside script.js.

---

## 🛠 Components & Technologies

### *Backend*
- Node.js  
- Express.js  
- Firebase Admin SDK  
- Firestore Database  
- CORS Middleware  

### *Frontend*
- HTML  
- CSS (Tailwind CSS)  
- JavaScript (Vanilla JS)  
- Fetch API  

---

### 📂 Project Structure

- index.js -> Backend API
- firebase-config.js -> Firebase Admin setup
- serviceAccountKey.json -> Firebase private key
- index.html -> Registration page
- users.html -> User list (View/Update/Delete)
- script.js -> All frontend logic + API calls
- package.json -> Node dependencies

### Setup and Running the Backend

### *1.Install npm Dependencies*

```bash
npm install
```
### *2.Run Backend (Execute the main server file (index.js) using Node.js.)*
```bash
node index.js
```

### *3.Server runs at Backend*

```bash
https://registrationbackend-api.onrender.com/api/users
```
![RegistrationWithBackend](Working Database.png)
