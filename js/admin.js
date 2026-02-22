// Guard route
guardRoute("ADMIN");

const currentUser = getCurrentUser();
document.getElementById("adminName").innerText =
    "Welcome, " + currentUser.fullName;

// Load everything
loadStats();
loadBeneficiaries();
loadVendors();
loadDonations();
loadBeneficiarySelect();

// ================= STATS =================
function loadStats() {

    let donations = getData("donations");
    let beneficiaries = getData("beneficiaries");
    let vendors = getData("vendors");
    let vouchers = getData("vouchers");

    let total = donations.reduce((sum, d) => sum + d.amount, 0);

    document.getElementById("totalRaised").innerText =
        "₦" + total.toLocaleString();

    document.getElementById("totalFamilies").innerText =
        beneficiaries.length;

    document.getElementById("totalVendors").innerText =
        vendors.length;

    document.getElementById("totalVouchers").innerText =
        vouchers.length;
}

// ================= BENEFICIARIES =================
function loadBeneficiaries() {

    let beneficiaries = getData("beneficiaries");
    const table = document.getElementById("beneficiariesTable");
    table.innerHTML = "";

    beneficiaries.forEach(b => {

        if (b.verificationStatus === "PENDING") {

            table.innerHTML += `
                <tr>
                    <td>${b.fullName}</td>
                    <td>${b.verificationStatus}</td>
                    <td>
                        <button onclick="approveBeneficiary('${b.userId}')">
                            Approve
                        </button>
                    </td>
                </tr>
            `;
        }
    });
}

function approveBeneficiary(userId) {

    let beneficiaries = getData("beneficiaries");

    let person = beneficiaries.find(b => b.userId == userId);
    person.verificationStatus = "APPROVED";

    saveData("beneficiaries", beneficiaries);

    loadBeneficiaries();
    loadBeneficiarySelect();
}

// ================= VENDORS =================
function loadVendors() {

    let vendors = getData("vendors");
    const table = document.getElementById("vendorsTable");
    table.innerHTML = "";

    vendors.forEach(v => {

        if (!v.isApproved) {

            table.innerHTML += `
                <tr>
                    <td>${v.shopName}</td>
                    <td>Pending</td>
                    <td>
                        <button onclick="approveVendor('${v.userId}')">
                            Approve
                        </button>
                    </td>
                </tr>
            `;
        }
    });
}

function approveVendor(userId) {

    let vendors = getData("vendors");

    let vendor = vendors.find(v => v.userId == userId);
    vendor.isApproved = true;

    saveData("vendors", vendors);
    loadVendors();
}

// ================= ISSUE VOUCHER =================
document.getElementById("voucherForm").addEventListener("submit", function(e){
    e.preventDefault();

    const beneficiaryId = document.getElementById("beneficiarySelect").value;
    const amount = parseInt(document.getElementById("voucherAmount").value);

    generateVoucher(beneficiaryId, amount);

    alert("Voucher generated successfully!");

    loadStats();
    document.getElementById("voucherForm").reset();
});

function generateVoucher(beneficiaryId, amount) {

    let vouchers = getData("vouchers");

    let code = Math.random().toString(36).substr(2,6).toUpperCase();

    vouchers.push({
        id: Date.now(),
        beneficiaryId: beneficiaryId,
        amount: amount,
        code: code,
        status: "ISSUED",
        expiresAt: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toLocaleDateString()
    });

    saveData("vouchers", vouchers);
}

// Populate select
function loadBeneficiarySelect() {

    let beneficiaries = getData("beneficiaries")
        .filter(b => b.verificationStatus === "APPROVED");

    const select = document.getElementById("beneficiarySelect");
    select.innerHTML = "";

    beneficiaries.forEach(b => {
        select.innerHTML += `
            <option value="${b.userId}">
                ${b.fullName}
            </option>
        `;
    });
}

// ================= DONATIONS =================
function loadDonations() {

    let donations = getData("donations");
    const table = document.getElementById("donationsTable");
    table.innerHTML = "";

    donations.reverse().forEach(d => {

        table.innerHTML += `
            <tr>
                <td>${d.donorId}</td>
                <td>₦${d.amount.toLocaleString()}</td>
                <td>${d.createdAt}</td>
            </tr>
        `;
    });
}
