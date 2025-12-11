// --- payment.js (Modern Version) ---

// ၁။ CSS Auto Inject
const linkTag = document.createElement("link");
linkTag.rel = "stylesheet";
linkTag.href = "payment.css"; 
document.head.appendChild(linkTag);

// ၂။ HTML Template (Payment & Donation Modals)
const paymentSystemHTML = `
<!-- Payment Modal -->
<div id="paymentModal" class="payment-modal-overlay">
  <div class="payment-box">
    <div class="pay-header">
      <h2 id="payAppName">App Name</h2>
      <button onclick="closePaymentModal()" class="close-btn">&times;</button>
    </div>
    
    <div class="order-summary">
      <p style="color:#64748b; font-size:13px; margin:0; font-weight:500;">ORDER SUMMARY</p>
      <div class="plan-row">
        <div id="payPlanName" class="plan-name">Lifetime</div>
        <div id="payAmount" class="plan-price">$200.00</div>
      </div>
      <div class="divider"></div>
      <div class="user-email-box">
        <i class="fas fa-user-circle"></i>
        <span id="payUserEmail">user@example.com</span>
      </div>
    </div>

    <span class="method-label">SELECT PAYMENT METHOD</span>
    
    <!-- Stripe -->
    <div class="pay-method" onclick="processPayment('stripe')">
      <div class="method-info">
         <i class="fab fa-cc-stripe method-icon stripe-icon"></i>
         <span class="method-text">Credit / Debit Card</span>
      </div>
      <i class="fas fa-arrow-right" style="color:#cbd5e1;"></i>
    </div>

    <!-- PayPal -->
    <div class="pay-method" onclick="processPayment('paypal')">
      <div class="method-info">
         <i class="fab fa-paypal method-icon paypal-icon"></i>
         <span class="method-text">PayPal Checkout</span>
      </div>
      <i class="fas fa-arrow-right" style="color:#cbd5e1;"></i>
    </div>

    <div class="security-note">
       <i class="fas fa-lock"></i> 256-bit SSL Secured Payment
    </div>
  </div>
</div>

<!-- Donation Selection Modal -->
<div id="donationModal" class="payment-modal-overlay">
  <div class="payment-box" style="text-align:center;">
    <button onclick="closeDonationModal()" class="close-btn" style="position:absolute; right:20px; top:20px;">&times;</button>
    
    <div class="coffee-icon">☕</div>
    <h2 style="color: #1e293b; margin-bottom: 10px;">Buy me a Coffee</h2>
    <p style="color: #64748b; font-size: 14px; margin-bottom: 25px; line-height: 1.5;">
      App ကို နှစ်သက်ပါက Developer ကို မုန့်ဖိုးပေးပြီး ကူညီပံ့ပိုးနိုင်ပါတယ်ခင်ဗျာ။ ❤️
    </p>

    <div class="pay-method" onclick="initPayment('Coffee', 3)">
       <div class="method-info">
         <span style="font-size:20px;">☕</span>
         <span class="method-text">Coffee ($3)</span>
       </div>
       <b style="color:#2563eb;">$3.00</b>
    </div>

    <div class="pay-method" onclick="initPayment('Burger', 5)">
       <div class="method-info">
         <span style="font-size:20px;">🍔</span>
         <span class="method-text">Burger ($5)</span>
       </div>
       <b style="color:#2563eb;">$5.00</b>
    </div>

    <div class="pay-method" onclick="initPayment('Big Meal', 10)">
       <div class="method-info">
         <span style="font-size:20px;">🍱</span>
         <span class="method-text">Big Meal ($10)</span>
       </div>
       <b style="color:#2563eb;">$10.00</b>
    </div>
  </div>
</div>
`;

// Inject HTML to Body
document.body.insertAdjacentHTML('beforeend', paymentSystemHTML);


// ၃။ Logic Configuration
let currentPaymentConfig = {};
let selectedOrder = {};

// Setup Function (Called from app.js)
function setupPaymentSystem(config) {
    currentPaymentConfig = config;
}

// Open Payment Modal (Directly or via Donation)
function initPayment(planName, price) {
    // Firebase Check
    if (typeof firebase === 'undefined' || !firebase.auth().currentUser) {
        return alert("Please login to continue!");
    }
    const user = firebase.auth().currentUser;

    selectedOrder = {
        plan: planName,
        price: price,
        appName: currentPaymentConfig.appName
    };

    // UI Update
    document.getElementById("payAppName").innerText = currentPaymentConfig.appName;
    document.getElementById("payPlanName").innerText = planName;
    document.getElementById("payAmount").innerText = `$${price.toFixed(2)}`;
    document.getElementById("payUserEmail").innerText = user.email;

    // Close other modals
    closeDonationModal();
    const paywall = document.getElementById("paywallModal");
    if(paywall) paywall.style.display = "none";
    
    // Open Payment Modal
    document.getElementById("paymentModal").style.display = "flex";
}

function closePaymentModal() {
    document.getElementById("paymentModal").style.display = "none";
}

// Donation Logic
function openDonationSelector() {
    const paywall = document.getElementById("paywallModal");
    if(paywall) paywall.style.display = "none";
    document.getElementById("donationModal").style.display = "flex";
}

function closeDonationModal() {
    document.getElementById("donationModal").style.display = "none";
}

// Process Payment (Stripe/PayPal)
function processPayment(method) {
    const user = firebase.auth().currentUser;
    const db = firebase.firestore();

    // Show loading cursor
    document.body.style.cursor = 'wait';

    db.collection("orders").add({
        uid: user.uid,
        email: user.email,
        appName: selectedOrder.appName,
        plan: selectedOrder.plan,
        amount: selectedOrder.price,
        method: method,
        status: 'pending',
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        document.body.style.cursor = 'default';
        
        if (method === 'stripe') {
            // Find specific link for the plan
            const link = currentPaymentConfig.stripeLinks[selectedOrder.plan] || currentPaymentConfig.stripeLinks['Default'];
            
            if(link) {
                window.location.href = link;
            } else {
                alert(`Error: Payment link for '${selectedOrder.plan}' not set in app.js`);
            }
        } else {
            // PayPal
            const ppLink = currentPaymentConfig.paypalLink || "https://paypal.me";
            window.open(ppLink, '_blank');
        }
    }).catch(err => {
        document.body.style.cursor = 'default';
        console.error(err);
        alert("Transaction Error: " + err.message);
    });
}