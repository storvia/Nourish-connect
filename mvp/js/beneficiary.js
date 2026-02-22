// ================= ROUTE GUARD =================
guardRoute("BENEFICIARY");

// ================= GET CURRENT USER =================
const currentUser = getCurrentUser();
document.getElementById("beneficiaryName").innerText =
    "Welcome, " + currentUser.fullName;

// ================= LOAD VERIFICATION STATUS =================
function loadBeneficiaryStatus() {
    const beneficiaries = getData("beneficiaries");

    const record = beneficiaries.find(b => b.userId === currentUser.id);

    if (!record) {
        document.getElementById("verificationStatus").innerText =
            "Not Registered";
        return;
    }

    document.getElementById("verificationStatus").innerText =
        record.verificationStatus;
}

// ================= LOAD ACTIVE VOUCHER =================
function loadActiveVoucher() {
    const vouchers = getData("vouchers");

    const activeVoucher = vouchers.find(v =>
        v.beneficiaryId === currentUser.id &&
        v.status === "ISSUED"
    );

    const container = document.getElementById("activeVoucherContainer");

    if (!activeVoucher) {
        container.innerHTML = "<p>No active voucher available.</p>";
        return;
    }

    container.innerHTML = `
        <div class="voucher-card">
            <h3>Voucher Code</h3>
            <h2>${activeVoucher.code}</h2>
            <p>Amount: ₦${activeVoucher.amount.toLocaleString()}</p>
            <p>Expires: ${activeVoucher.expiresAt}</p>
        </div>
    `;
}

// ================= LOAD VOUCHER HISTORY =================
function loadVoucherHistory() {
    const vouchers = getData("vouchers")
        .filter(v => v.beneficiaryId === currentUser.id);

    const table = document.getElementById("voucherHistory");
    table.innerHTML = "";

    if (vouchers.length === 0) {
        table.innerHTML = `<tr><td colspan="4" style="text-align:center">No vouchers yet.</td></tr>`;
        return;
    }

    vouchers.reverse().forEach(v => {
        const row = `
            <tr>
                <td>${v.code}</td>
                <td>₦${v.amount.toLocaleString()}</td>
                <td>${v.status}</td>
                <td>${v.expiresAt}</td>
            </tr>
        `;
        table.innerHTML += row;
    });
}

// ================= INITIAL LOAD =================
loadBeneficiaryStatus();
loadActiveVoucher();
loadVoucherHistory();
