// ================= LOCAL STORAGE HELPERS =================

// Get all users
function getUsers() {
    let users = localStorage.getItem("users");
    return users ? JSON.parse(users) : [];
}

// Save users
function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

// ================= REGISTER =================
function registerUser(fullName, email, password, role) {

    const users = getUsers();

    // Check if email exists
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        alert("Email already registered.");
        return false;
    }

    // Create user
    const newUser = {
        id: Date.now(),
        fullName: fullName,
        email: email,
        password: password, // In real app, hash this
        role: role
    };

    users.push(newUser);
    saveUsers(users);

    // Auto-create related record for Beneficiary/Vendor
    if (role === "BENEFICIARY") {
        addBeneficiaryRecord(newUser.id, fullName);
    } else if (role === "VENDOR") {
        addVendorRecord(newUser.id, fullName + " Shop");
    }

    alert("Registration successful!");
    return true;
}

// ================= LOGIN =================
function loginUser(email, password) {

    const users = getUsers();
    const user = users.find(u =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );

    if (!user) {
        alert("Invalid email or password.");
        return false;
    }

    // Save session
    localStorage.setItem("currentUser", JSON.stringify(user));

    // Redirect to dashboard based on role
    switch (user.role) {
        case "DONOR":
            window.location.href = "donor.html";
            break;
        case "BENEFICIARY":
            window.location.href = "beneficiary.html";
            break;
        case "VENDOR":
            window.location.href = "vendor.html";
            break;
        case "ADMIN":
            window.location.href = "admin.html";
            break;
        default:
            window.location.href = "index.html";
    }

    return true;
}

// ================= LOGOUT =================
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

// ================= GET CURRENT USER =================
function getCurrentUser() {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
}

// ================= GUARD ROUTE =================
function guardRoute(requiredRole) {

    const user = getCurrentUser();

    if (!user) {
        alert("Please login first.");
        window.location.href = "index.html";
        return false;
    }

    if (user.role !== requiredRole) {
        alert("Unauthorized access.");
        window.location.href = "index.html";
        return false;
    }

    return true;
}

// ================= BENEFICIARY RECORD =================
function addBeneficiaryRecord(userId, fullName) {

    let beneficiaries = localStorage.getItem("beneficiaries");
    beneficiaries = beneficiaries ? JSON.parse(beneficiaries) : [];

    beneficiaries.push({
        id: Date.now(),
        userId: userId,
        fullName: fullName,
        verificationStatus: "PENDING"
    });

    localStorage.setItem("beneficiaries", JSON.stringify(beneficiaries));
}

// ================= VENDOR RECORD =================
function addVendorRecord(userId, shopName) {

    let vendors = localStorage.getItem("vendors");
    vendors = vendors ? JSON.parse(vendors) : [];

    vendors.push({
        id: Date.now(),
        userId: userId,
        shopName: shopName,
        walletBalance: 0,
        isApproved: false
    });

    localStorage.setItem("vendors", JSON.stringify(vendors));
      }
