// API Base URL - assumes backend runs on port 8000 locally
const API_BASE = 'http://localhost:8000/api';

// Format currency to Indian Rupees
const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
    }).format(amount);
};

// Navigation logic
function switchView(viewName) {
    // Hide all views
    document.querySelectorAll('.view-section').forEach(el => el.style.display = 'none');
    
    // Update nav classes
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    // Show selected view
    document.getElementById(`view-${viewName}`).style.display = 'block';
    
    // Update title
    const titles = {
        'dashboard': 'Dashboard',
        'upload': 'Upload Receipt',
        'analytics': 'Analytics & Insights',
        'settings': 'Settings'
    };
    document.getElementById('page-title').innerText = titles[viewName];

    // Load data based on view
    if (viewName === 'dashboard') loadDashboardData();
    if (viewName === 'analytics') loadAnalyticsData();
    if (viewName === 'settings') loadSettingsData();
}

// Format status badge
function getStatusBadge(status) {
    let className = 'badge ';
    if (status === 'Approved') className += 'approved';
    else if (status === 'Manual Review') className += 'review';
    else className += 'rejected';
    
    return `<span class="${className}">${status}</span>`;
}

// Load Dashboard Data
async function loadDashboardData() {
    try {
        const [expensesRes, analyticsRes] = await Promise.all([
            fetch(`${API_BASE}/expenses`),
            fetch(`${API_BASE}/analytics`)
        ]);
        
        const expenses = await expensesRes.json();
        const analytics = await analyticsRes.json();

        // Update stats
        document.getElementById('stat-spend').innerText = formatINR(analytics.monthly_spend);
        document.getElementById('stat-pending').innerText = formatINR(analytics.pending_approval);
        document.getElementById('stat-count').innerText = expenses.length + 12; // Just adding a baseline

        // Update table
        const tbody = document.getElementById('expense-table-body');
        tbody.innerHTML = '';
        expenses.forEach(exp => {
            tbody.innerHTML += `
                <tr>
                    <td>${exp.date}</td>
                    <td style="font-weight: 500">${exp.vendor}</td>
                    <td>${exp.category}</td>
                    <td class="amount">${formatINR(exp.amount)}</td>
                    <td>${getStatusBadge(exp.status)}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error loading dashboard data:", error);
    }
}

// File Upload Logic
const fileInput = document.getElementById('file-input');
const dropZone = document.getElementById('drop-zone');
const processingState = document.getElementById('processing-state');
const resultState = document.getElementById('result-state');

fileInput.addEventListener('change', handleFileUpload);
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        handleFileUpload();
    }
});

async function handleFileUpload() {
    if (!fileInput.files.length) return;
    const file = fileInput.files[0];

    // Show processing UI
    dropZone.style.display = 'none';
    processingState.style.display = 'block';
    resultState.style.display = 'none';

    // Prepare form data
    const formData = new FormData();
    formData.append('file', file);

    try {
        // Send to Python backend
        const response = await fetch(`${API_BASE}/upload`, {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            displayResults(result.data);
        }
    } catch (error) {
        console.error("Upload failed", error);
        alert("Failed to connect to the AI engine backend.");
        resetUpload();
    }
}

function displayResults(data) {
    // Hide processing, show results
    processingState.style.display = 'none';
    resultState.style.display = 'block';

    // Populate data
    document.getElementById('res-vendor').innerText = data.vendor;
    document.getElementById('res-date').innerText = data.date;
    document.getElementById('res-category').innerText = data.category;
    document.getElementById('res-amount').innerText = formatINR(data.amount);
    document.getElementById('res-gst').innerText = formatINR(data.gst_amount);
    
    // Status
    const statusEl = document.getElementById('res-status');
    let badgeClass = 'badge ';
    if (data.status === 'Approved') badgeClass += 'approved';
    else if (data.status === 'Manual Review') badgeClass += 'review';
    else badgeClass += 'rejected';
    statusEl.className = badgeClass;
    statusEl.innerText = data.status;
    
    // Flags
    const flagsContainer = document.getElementById('res-flags-container');
    if (data.flags && data.flags.length > 0) {
        flagsContainer.innerHTML = `<span class="result-label" style="display:block; margin-bottom:0.5rem">Policy Flags</span>`;
        data.flags.forEach(flag => {
            flagsContainer.innerHTML += `<div style="color: var(--warning); font-size: 0.9rem; padding-left: 1rem; border-left: 2px solid var(--warning); margin-bottom: 0.5rem;">⚠️ ${flag}</div>`;
        });
    } else {
        flagsContainer.innerHTML = `<div style="color: var(--success); font-size: 0.9rem;">✓ Fully compliant with company policy</div>`;
    }
}

function resetUpload() {
    fileInput.value = '';
    dropZone.style.display = 'flex';
    processingState.style.display = 'none';
    resultState.style.display = 'none';
}

// Chart.js initialization
let chartInstance = null;
async function loadAnalyticsData() {
    try {
        const response = await fetch(`${API_BASE}/analytics`);
        const data = await response.json();
        
        const ctx = document.getElementById('categoryChart').getContext('2d');
        
        if (chartInstance) chartInstance.destroy();
        
        chartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(data.categories_breakdown),
                datasets: [{
                    data: Object.values(data.categories_breakdown),
                    backgroundColor: [
                        '#3b82f6', // blue
                        '#10b981', // green
                        '#f59e0b', // yellow
                        '#8b5cf6', // purple
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { color: '#94a3b8' }
                    }
                }
            }
        });
    } catch (e) {
        console.error("Chart error", e);
    }
}

// Settings Logic
async function loadSettingsData() {
    try {
        const response = await fetch(`${API_BASE}/settings`);
        const data = await response.json();
        
        document.getElementById('set-name').value = data.name || '';
        document.getElementById('set-email').value = data.email || '';
        document.getElementById('set-limit').value = data.auto_approval_limit || 10000;
        document.getElementById('set-currency').value = data.currency || 'INR';
    } catch (e) {
        console.error("Error loading settings:", e);
    }
}

async function saveSettings(event) {
    event.preventDefault();
    
    const settingsData = {
        name: document.getElementById('set-name').value,
        email: document.getElementById('set-email').value,
        auto_approval_limit: parseInt(document.getElementById('set-limit').value),
        currency: document.getElementById('set-currency').value
    };
    
    try {
        const response = await fetch(`${API_BASE}/settings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settingsData)
        });
        
        const result = await response.json();
        if (result.success) {
            const msgEl = document.getElementById('settings-msg');
            msgEl.style.display = 'block';
            setTimeout(() => {
                msgEl.style.display = 'none';
            }, 3000);
            
            // Update user name in header
            document.querySelector('.user-name').innerText = settingsData.name;
            const initials = settingsData.name.split(' ').map(n => n[0]).join('').toUpperCase();
            document.querySelector('.avatar').innerText = initials.substring(0, 2);
        }
    } catch (e) {
        console.error("Error saving settings:", e);
        alert("Failed to save settings.");
    }
}

// Initial load
window.onload = loadDashboardData;
