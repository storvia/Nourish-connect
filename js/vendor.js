// Guard route
guardRoute("VENDOR");

const currentUser = getCurrentUser();
document.getElementById("vendorName").innerText =
    "Welcome, " + currentUser.fullName;

// Load initial data
loadVendorStats();
loadRedemptionHistory();

// ================= REDEEM LOGIC =================
document.getElementById("redeemForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const code = document.getElementById("voucherCode").value.trim().toUpperCase();

    redeemVoucher(code);

    document.getElementById("redeemForm").reset();
    loadVendorStats();
    loadRedemptionHistory();
});

function redeemVoucher(code) {

    let vouchers = getData("vouchers");
    let vendors = getData("vendors");

    let voucher = vouchers.find(v => v.code === code);

    if (!voucher) {
        alert("Invalid voucher code.");
        return;
    }

    if (voucher.status !== "ISSUED") {
        alert("Voucher already used or expired.");
        return;
    }

    // Update voucher
    voucher.status = "REDEEMED";
    voucher.redeemedAt = new Date().toLocaleString();
    voucher.vendorId = currentUser.id;

    saveData("vouchers", vouchers);

    // Update vendor wallet
    let vendor = vendors.find(v => v.userId === currentUser.id);

    if (!vendor) {
        alert("Vendor profile not found.");
        return;
    }

    vendor.walletBalance += voucher.amount;

    saveData("vendors", vendors);

    alert("Voucher redeemed successfully!");
}

// ================= STATS =================
function loadVendorStats() {

    let vendors = getData("vendors");
    let vouchers = getData("vouchers");

    let vendor = vendors.find(v => v.userId === currentUser.id);

    if (!vendor) return;

    document.getElementById("walletBalance").innerText =
        "₦" + vendor.walletBalance.toLocaleString();

    let redeemed = vouchers.filter(v =>
        v.vendorId === currentUser.id &&
        v.status === "REDEEMED"
    );

    document.getElementById("totalRedemptions").innerText =
        redeemed.length;
}

// ================= HISTORY =================
function loadRedemptionHistory() {

    let vouchers = getData("vouchers")
        .filter(v =>
            v.vendorId === currentUser.id &&
            v.status === "REDEEMED"
        );

    const table = document.getElementById("redemptionHistory");
    table.innerHTML = "";

    vouchers.reverse().forEach(v => {

        let row = `
            <tr>
                <td>${v.code}</td>
                <td>₦${v.amount.toLocaleString()}</td>
                <td>${v.redeemedAt}</td>
            </tr>
        `;

        table.innerHTML += row;
    });
}
