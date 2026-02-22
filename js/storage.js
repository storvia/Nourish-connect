/* ================= STORAGE HELPERS ================= */

/**
 * Get data array from localStorage
 * @param {string} key - key in localStorage
 * @returns {Array}
 */
function getData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

/**
 * Save array data to localStorage
 * @param {string} key - key in localStorage
 * @param {Array} data - array of objects
 */
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

/**
 * Add a new item to a localStorage array
 * @param {string} key
 * @param {Object} item
 */
function addData(key, item) {
    const data = getData(key);
    data.push(item);
    saveData(key, data);
}

/**
 * Update an existing item by its id
 * @param {string} key
 * @param {number} id
 * @param {Object} updatedFields
 */
function updateDataById(key, id, updatedFields) {
    const data = getData(key);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) return false;
    data[index] = { ...data[index], ...updatedFields };
    saveData(key, data);
    return true;
}

/**
 * Delete item by id
 * @param {string} key
 * @param {number} id
 */
function deleteDataById(key, id) {
    let data = getData(key);
    data = data.filter(item => item.id !== id);
    saveData(key, data);
}

/**
 * Find item by id
 * @param {string} key
 * @param {number} id
 * @returns {Object|null}
 */
function findById(key, id) {
    const data = getData(key);
    return data.find(item => item.id === id) || null;
}

/**
 * Find item by a field
 * @param {string} key
 * @param {string} field
 * @param {any} value
 * @returns {Object|null}
 */
function findByField(key, field, value) {
    const data = getData(key);
    return data.find(item => item[field] === value) || null;
}

/* ================= INITIALIZE STORAGE KEYS ================= */

// Ensure all required keys exist in localStorage for MVP
["users", "donations", "beneficiaries", "vendors", "vouchers"].forEach(key => {
    if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify([]));
    }
});
