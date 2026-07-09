// StayEasy Dashboard - Interactive JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive components
    initSidebar();
    initDatePicker();
    initDropdowns();
    initTableActions();
    initPagination();
    initSearch();
    initAddGuestButton();
    initPaymentMethods();
    initDetailsPanel();
    initTabs();
});

// ==================== SIDEBAR & NAVIGATION ====================
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const navItems = document.querySelectorAll('.nav-item');
    const sidebarToggle = document.getElementById('sidebarToggle');

    // Handle navigation clicks - PAGE SWITCHING
    navItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Get the page ID from data attribute
            const pageId = item.getAttribute('data-page');
            
            // Remove active class from all nav items
            navItems.forEach(navItem => navItem.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Show the corresponding page section
            showPage(pageId);
            
            // Close sidebar on mobile after clicking a nav item
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });

    // Sidebar toggle for mobile
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            sidebar.classList.toggle('open');
        });
    }

    // Close sidebar when clicking outside on mobile
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function() {
            sidebar.classList.remove('open');
        });
    }
}

// Show page section and hide others
function showPage(pageId) {
    console.log('showPage called with:', pageId);
    
    // Hide all page sections
    const allPages = document.querySelectorAll('.page-section');
    console.log('Found page sections:', allPages.length);
    allPages.forEach(page => page.classList.remove('active'));
    
    // Show the selected page
    const targetPage = document.getElementById(`page-${pageId}`);
    console.log('Target page element:', targetPage);
    if (targetPage) {
        targetPage.classList.add('active');
        console.log('Active class added to:', targetPage.id);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        console.error('Target page not found:', `page-${pageId}`);
    }
}

// ==================== DATE PICKER ====================
function initDatePicker() {
    const datePickers = document.querySelectorAll('.date-picker');
    
    datePickers.forEach(picker => {
        picker.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
}

// ==================== DROPDOWNS ====================
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Close all other dropdowns
            dropdowns.forEach(d => {
                if (d !== this) {
                    d.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            this.classList.toggle('active');
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        dropdowns.forEach(d => d.classList.remove('active'));
    });
}

// ==================== TABLE ACTIONS ====================
function initTableActions() {
    // Use event delegation for dynamically added buttons
    document.addEventListener('click', function(e) {
        // View button
        if (e.target.closest('.action-btn.view')) {
            const button = e.target.closest('.action-btn.view');
            const row = button.closest('tr');
            const guestName = row.querySelector('.guest-name')?.textContent || 'Guest';
            alert(`Viewing details for: ${guestName}`);
        }
        
        // More button
        if (e.target.closest('.action-btn.more')) {
            const button = e.target.closest('.action-btn.more');
            const row = button.closest('tr');
            const guestName = row.querySelector('.guest-name')?.textContent || 'Guest';
            showContextMenu(button, guestName);
        }
    });
}

// Context menu for more actions
function showContextMenu(button, guestName) {
    // Remove existing context menu if any
    const existingMenu = document.querySelector('.context-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
    
    // Create context menu
    const menu = document.createElement('div');
    menu.className = 'context-menu';
    menu.innerHTML = `
        <div class="context-menu-item" data-action="edit">
            <i class="fas fa-edit"></i>
            <span>Edit</span>
        </div>
        <div class="context-menu-item" data-action="email">
            <i class="fas fa-envelope"></i>
            <span>Send Email</span>
        </div>
        <div class="context-menu-item" data-action="booking">
            <i class="fas fa-calendar-plus"></i>
            <span>New Booking</span>
        </div>
        <div class="context-menu-divider"></div>
        <div class="context-menu-item danger" data-action="delete">
            <i class="fas fa-trash"></i>
            <span>Delete</span>
        </div>
    `;
    
    // Position the menu
    const rect = button.getBoundingClientRect();
    menu.style.position = 'fixed';
    menu.style.top = (rect.bottom + 4) + 'px';
    menu.style.left = (rect.left - 120) + 'px';
    menu.style.backgroundColor = 'white';
    menu.style.border = '1px solid #E5E7EB';
    menu.style.borderRadius = '8px';
    menu.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    menu.style.zIndex = '1000';
    menu.style.minWidth = '140px';
    menu.style.padding = '4px 0';
    
    document.body.appendChild(menu);
    
    // Handle menu item clicks
    menu.querySelectorAll('.context-menu-item').forEach(item => {
        item.addEventListener('click', function() {
            const action = this.dataset.action;
            handleContextMenuAction(action, guestName);
            menu.remove();
        });
    });
    
    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target) && !button.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 10);
}

// Handle context menu actions
function handleContextMenuAction(action, guestName) {
    switch(action) {
        case 'edit':
            alert(`Editing: ${guestName}`);
            break;
        case 'email':
            alert(`Sending email to: ${guestName}`);
            break;
        case 'booking':
            alert(`Creating new booking for: ${guestName}`);
            break;
        case 'delete':
            if (confirm(`Are you sure you want to delete ${guestName}?`)) {
                alert(`Deleted: ${guestName}`);
            }
            break;
    }
}

// ==================== PAGINATION ====================
function initPagination() {
    const paginationControls = document.querySelector('.pagination-controls');
    if (!paginationControls) return;
    
    const pageButtons = paginationControls.querySelectorAll('.page-btn:not(.prev):not(.next)');
    const prevButton = paginationControls.querySelector('.page-btn.prev');
    const nextButton = paginationControls.querySelector('.page-btn.next');
    let currentPage = 1;
    
    pageButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.textContent === '...') return;
            
            // Update active state
            pageButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            currentPage = parseInt(this.textContent);
            updatePaginationState(currentPage);
        });
    });
    
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                updateActivePage(currentPage);
                updatePaginationState(currentPage);
            }
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            if (currentPage < 125) {
                currentPage++;
                updateActivePage(currentPage);
                updatePaginationState(currentPage);
            }
        });
    }
}

function updateActivePage(page) {
    const pageButtons = document.querySelectorAll('.page-btn:not(.prev):not(.next)');
    pageButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent == page) {
            btn.classList.add('active');
        }
    });
}

function updatePaginationState(page) {
    const prevButton = document.querySelector('.page-btn.prev');
    const nextButton = document.querySelector('.page-btn.next');
    
    if (prevButton) prevButton.disabled = page === 1;
    if (nextButton) nextButton.disabled = page === 125;
    
    // Update "Showing X to Y of Z guests" text
    const start = (page - 1) * 10 + 1;
    const end = Math.min(page * 10, 1248);
    const info = document.querySelector('.pagination-info');
    if (info) {
        info.textContent = `Showing ${start} to ${end} of 1,248 guests`;
    }
}

// ==================== SEARCH ====================
function initSearch() {
    const searchInputs = document.querySelectorAll('.search-box input');
    
    searchInputs.forEach(input => {
        let searchTimeout;
        
        input.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const searchTerm = this.value.trim();
            
            searchTimeout = setTimeout(() => {
                if (searchTerm.length > 0) {
                    filterTable(searchTerm);
                } else {
                    resetTable();
                }
            }, 300);
        });
    });
}

function filterTable(searchTerm) {
    const rows = document.querySelectorAll('.guests-table tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm.toLowerCase())) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function resetTable() {
    const rows = document.querySelectorAll('.guests-table tbody tr');
    rows.forEach(row => {
        row.style.display = '';
    });
}

// ==================== ADD GUEST BUTTON ====================
function initAddGuestButton() {
    const addGuestBtns = document.querySelectorAll('.add-guest-btn');
    
    addGuestBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const btnText = this.querySelector('span').textContent;
            alert(`Opening ${btnText} form...`);
        });
    });
}

// ==================== PAYMENT METHODS ====================
function initPaymentMethods() {
    // Add Method button
    const addMethodBtn = document.querySelector('.add-method-btn');
    if (addMethodBtn) {
        addMethodBtn.addEventListener('click', function() {
            alert('Opening Add Payment Method form...');
        });
    }

    // Table row click to select
    const tableRows = document.querySelectorAll('.payment-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', function(e) {
            // Don't select if clicking action buttons
            if (e.target.closest('.action-btn')) return;
            
            // Remove selected class from all rows
            tableRows.forEach(r => r.classList.remove('selected-row'));
            
            // Add selected class to clicked row
            this.classList.add('selected-row');
            
            // Update details panel
            updateDetailsPanel(this.dataset.method);
        });
    });
}

// ==================== DETAILS PANEL ====================
function initDetailsPanel() {
    const closePanelBtn = document.getElementById('closePanelBtn');
    const detailsPanel = document.getElementById('detailsPanel');
    
    if (closePanelBtn && detailsPanel) {
        closePanelBtn.addEventListener('click', function() {
            detailsPanel.classList.add('hidden');
        });
    }
}

// Update details panel based on selected method
function updateDetailsPanel(methodId) {
    const detailsPanel = document.getElementById('detailsPanel');
    if (!detailsPanel) return;
    
    // Show panel
    detailsPanel.classList.remove('hidden');
    
    // Method data
    const methods = {
        cash: {
            name: 'Cash',
            subtitle: 'Cash Payment',
            icon: 'cash',
            iconClass: 'fas fa-money-bill-wave',
            status: 'active',
            details: {
                'Type': 'Cash',
                'Status': 'Active',
                'Terminal ID': '–',
                'Merchant ID': '–',
                'Provider': '–',
                'Settlement Period': 'Immediate',
                'Currency': 'NPR',
                'Minimum Amount': 'NPR 1.00',
                'Maximum Amount': 'No Limit',
                'Created On': 'Jan 05, 2025, 09:00 AM',
                'Last Updated': 'Jan 05, 2025, 09:00 AM'
            },
            about: 'Accepts cash payments directly. No processing fees apply.'
        },
        card: {
            name: 'Card (Visa / MasterCard)',
            subtitle: 'Card Payment',
            icon: 'card',
            iconClass: 'fas fa-credit-card',
            status: 'active',
            details: {
                'Type': 'Card',
                'Status': 'Active',
                'Terminal ID': 'TID-1001',
                'Merchant ID': '123456789',
                'Provider': 'Global Payments',
                'Settlement Period': 'T+1 (Next Day)',
                'Currency': 'NPR',
                'Minimum Amount': 'NPR 1.00',
                'Maximum Amount': 'NPR 200,000.00',
                'Created On': 'Jan 10, 2025, 10:30 AM',
                'Last Updated': 'May 20, 2026, 02:15 PM'
            },
            about: 'Accepts Visa, MasterCard and other major credit/debit cards.'
        },
        esewa: {
            name: 'eSewa',
            subtitle: 'Digital Wallet',
            icon: 'esewa',
            iconClass: 'fas fa-wallet',
            status: 'active',
            details: {
                'Type': 'Digital Wallet',
                'Status': 'Active',
                'Terminal ID': '–',
                'Merchant ID': '9801234567',
                'Provider': 'eSewa',
                'Settlement Period': 'T+1 (Next Day)',
                'Currency': 'NPR',
                'Minimum Amount': 'NPR 1.00',
                'Maximum Amount': 'NPR 100,000.00',
                'Created On': 'Feb 15, 2025, 11:45 AM',
                'Last Updated': 'Apr 10, 2026, 03:20 PM'
            },
            about: 'Accepts eSewa digital wallet payments for quick and easy transactions.'
        },
        khalti: {
            name: 'Khalti',
            subtitle: 'Digital Wallet',
            icon: 'khalti',
            iconClass: 'fas fa-mobile-alt',
            status: 'active',
            details: {
                'Type': 'Digital Wallet',
                'Status': 'Active',
                'Terminal ID': '–',
                'Merchant ID': '9812345678',
                'Provider': 'Khalti',
                'Settlement Period': 'T+1 (Next Day)',
                'Currency': 'NPR',
                'Minimum Amount': 'NPR 1.00',
                'Maximum Amount': 'NPR 100,000.00',
                'Created On': 'Mar 20, 2025, 02:15 PM',
                'Last Updated': 'May 05, 2026, 10:30 AM'
            },
            about: 'Accepts Khalti digital wallet payments for seamless mobile transactions.'
        },
        imepay: {
            name: 'IME Pay',
            subtitle: 'Digital Wallet',
            icon: 'imepay',
            iconClass: 'fas fa-money-check',
            status: 'active',
            details: {
                'Type': 'Digital Wallet',
                'Status': 'Active',
                'Terminal ID': '–',
                'Merchant ID': '9807654321',
                'Provider': 'IME Pay',
                'Settlement Period': 'T+1 (Next Day)',
                'Currency': 'NPR',
                'Minimum Amount': 'NPR 1.00',
                'Maximum Amount': 'NPR 50,000.00',
                'Created On': 'Apr 05, 2025, 04:30 PM',
                'Last Updated': 'Jun 01, 2026, 09:15 AM'
            },
            about: 'Accepts IME Pay digital wallet payments for secure money transfers.'
        },
        banktransfer: {
            name: 'Bank Transfer',
            subtitle: 'Bank Payment',
            icon: 'bank',
            iconClass: 'fas fa-university',
            status: 'active',
            details: {
                'Type': 'Bank',
                'Status': 'Active',
                'Terminal ID': '–',
                'Merchant ID': '–',
                'Provider': 'Nabil Bank',
                'Settlement Period': 'T+2',
                'Currency': 'NPR',
                'Minimum Amount': 'NPR 100.00',
                'Maximum Amount': 'No Limit',
                'Created On': 'Jan 20, 2025, 08:00 AM',
                'Last Updated': 'Mar 15, 2026, 11:45 AM'
            },
            about: 'Accepts direct bank transfers. A/C: 00123456789012 at Nabil Bank.'
        },
        qrpayment: {
            name: 'QR Payment',
            subtitle: 'QR Code Payment',
            icon: 'qr',
            iconClass: 'fas fa-qrcode',
            status: 'active',
            details: {
                'Type': 'QR',
                'Status': 'Active',
                'Terminal ID': 'QR-2001',
                'Merchant ID': '–',
                'Provider': 'NCHL',
                'Settlement Period': 'T+1 (Next Day)',
                'Currency': 'NPR',
                'Minimum Amount': 'NPR 1.00',
                'Maximum Amount': 'NPR 50,000.00',
                'Created On': 'May 10, 2025, 01:00 PM',
                'Last Updated': 'Jun 05, 2026, 04:30 PM'
            },
            about: 'Accepts QR code payments via connectIPS and other QR-based systems.'
        },
        mealcard: {
            name: 'Meal Card',
            subtitle: 'Card Payment',
            icon: 'mealcard',
            iconClass: 'fas fa-concierge-bell',
            status: 'offline',
            details: {
                'Type': 'Card',
                'Status': 'Offline',
                'Terminal ID': '–',
                'Merchant ID': 'MC-556677',
                'Provider': 'MealCard Pvt. Ltd.',
                'Settlement Period': 'T+3',
                'Currency': 'NPR',
                'Minimum Amount': 'NPR 10.00',
                'Maximum Amount': 'NPR 10,000.00',
                'Created On': 'Jun 01, 2025, 10:00 AM',
                'Last Updated': 'May 28, 2026, 02:00 PM'
            },
            about: 'Accepts meal cards from MealCard Pvt. Ltd. Currently offline for maintenance.'
        },
        giftcard: {
            name: 'Gift Card',
            subtitle: 'Gift Card Payment',
            icon: 'giftcard',
            iconClass: 'fas fa-gift',
            status: 'active',
            details: {
                'Type': 'Gift Card',
                'Status': 'Active',
                'Terminal ID': '–',
                'Merchant ID': 'GC-998877',
                'Provider': 'StayEasy Gift',
                'Settlement Period': 'Immediate',
                'Currency': 'NPR',
                'Minimum Amount': 'NPR 1.00',
                'Maximum Amount': 'NPR 50,000.00',
                'Created On': 'Jul 15, 2025, 09:30 AM',
                'Last Updated': 'Jun 02, 2026, 11:00 AM'
            },
            about: 'Accepts StayEasy branded gift cards for customer rewards and promotions.'
        },
        storecredit: {
            name: 'Store Credit',
            subtitle: 'Store Credit Payment',
            icon: 'storecredit',
            iconClass: 'fas fa-piggy-bank',
            status: 'offline',
            details: {
                'Type': 'Store Credit',
                'Status': 'Offline',
                'Terminal ID': '–',
                'Merchant ID': '–',
                'Provider': 'Internal',
                'Settlement Period': 'Immediate',
                'Currency': 'NPR',
                'Minimum Amount': 'NPR 1.00',
                'Maximum Amount': 'Based on Balance',
                'Created On': 'Aug 01, 2025, 08:00 AM',
                'Last Updated': 'May 30, 2026, 05:00 PM'
            },
            about: 'Accepts store credit for customer returns and loyalty rewards. Currently offline.'
        }
    };
    
    const method = methods[methodId];
    if (!method) return;
    
    // Update panel header
    const methodTitle = detailsPanel.querySelector('.method-title');
    const methodSubtitle = detailsPanel.querySelector('.method-subtitle');
    const methodIcon = detailsPanel.querySelector('.method-icon-large');
    const statusBadge = detailsPanel.querySelector('.method-info .status-badge');
    
    if (methodTitle) methodTitle.textContent = method.name;
    if (methodSubtitle) methodSubtitle.textContent = method.subtitle;
    if (methodIcon) {
        methodIcon.className = 'method-icon-large ' + method.icon;
        methodIcon.innerHTML = '<i class="' + method.iconClass + '"></i>';
    }
    if (statusBadge) {
        statusBadge.className = 'status-badge ' + method.status;
        statusBadge.textContent = method.status === 'active' ? 'Active' : 'Offline';
    }
    
    // Update details content
    const detailsContent = detailsPanel.querySelector('.details-content');
    if (detailsContent) {
        detailsContent.innerHTML = '';
        for (const [label, value] of Object.entries(method.details)) {
            const row = document.createElement('div');
            row.className = 'detail-row';
            row.innerHTML = `
                <span class="detail-label">${label}</span>
                <span class="detail-value">${value}</span>
            `;
            detailsContent.appendChild(row);
        }
    }
    
    // Update about section
    const aboutText = detailsPanel.querySelector('.about-method p');
    if (aboutText) aboutText.textContent = method.about;
}

// ==================== TABS ====================
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all tabs
            tabBtns.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Here you would typically show different content based on the tab
            // For now, we'll just show an alert for non-overview tabs
            const tabName = this.textContent;
            if (tabName !== 'Overview') {
                console.log(`Switched to ${tabName} tab`);
            }
        });
    });
}
