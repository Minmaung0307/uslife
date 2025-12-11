// ==========================================
// 1. STRIPE CONFIGURATION
// ==========================================
// သင်၏ Stripe Payment Link ကို ဒီမှာထည့်ပါ
const STRIPE_LINK = "https://buy.stripe.com/14A28r37u4Pk6hb8RA1B600"; 

// ==========================================
// 2. PAYMENT UI LOGIC
// ==========================================

function openPaymentUI() {
  const modal = document.getElementById("paymentModal");
  if (modal) {
    modal.classList.add("show");

    const bodyContent = modal.querySelector('.payment-body');
    if(bodyContent) {
        bodyContent.innerHTML = `
            <!-- Header Image / Icon -->
            <div class="premium-header">
                <div class="coffee-icon-bg">
                    <span>☕</span>
                </div>
            </div>

            <h2 class="premium-title">Buy me a Coffee</h2>
            <p class="premium-desc">
                Your support keeps this app alive! <br>
                Unlock all generic features forever.
            </p>

            <!-- Price Tag Design -->
            <div class="price-tag">
                <span class="currency">$</span>
                <span class="amount">5.00+</span>
            </div>
            <p style="font-size:12px; color:#888; margin-bottom:20px;">(Choose your amount)</p>

            <!-- Stripe Button -->
            <button onclick="redirectToStripePopup()" class="stripe-pay-btn">
                <span>Payment via Stripe</span>
                <i class="fas fa-arrow-right"></i>
            </button>
            
            <div class="security-badge">
                <i class="fas fa-lock"></i> 100% Secured by Stripe
            </div>
        `;
    }
  }
}

// ★ POPUP WINDOW LOGIC (App ထဲက ထွက်မသွားအောင် လုပ်နည်း) ★
function redirectToStripePopup() {
    // Popup အကျယ်အဝန်း သတ်မှတ်ခြင်း
    const w = 450;
    const h = 650;
    
    // Screen အလယ်တည့်တည့်မှာ ပေါ်အောင် တွက်ချက်ခြင်း
    const left = (screen.width / 2) - (w / 2);
    const top = (screen.height / 2) - (h / 2);
    
    // Popup ဖွင့်ခြင်း
    window.open(
        STRIPE_LINK, 
        'StripeCheckout', 
        `width=${w},height=${h},top=${top},left=${left},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
    );
    
    // Mobile မှာဆိုရင် Tab အသစ်အနေနဲ့ ပေါ်လာနိုင်ပေမယ့် App ပိတ်မသွားပါဘူး
}

function closePaymentUI() {
  const modal = document.getElementById("paymentModal");
  if (modal) modal.classList.remove("show");
}

window.openPaymentUI = openPaymentUI;
window.closePaymentUI = closePaymentUI;
window.redirectToStripePopup = redirectToStripePopup;

// ==========================================
// 3. PAYMENT SUCCESS CHECK
// ==========================================
// Popup ကနေ ငွေချေပြီးလို့ Redirect ပြန်လာခဲ့ရင် (သို့) User က ကိုယ်တိုင် Refresh လုပ်ရင် စစ်ဖို့
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('status') === 'success') {
        if (typeof currentUser !== 'undefined' && currentUser) {
            updateUserToPremium(currentUser.uid);
        }
        alert("Thank you! Payment Successful! ☕");
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

function updateUserToPremium(uid) {
  if (!uid) return;
  db.collection("users").doc(uid).set({
      plan: "lifetime",
      paidAt: firebase.firestore.FieldValue.serverTimestamp(),
      status: "supporter",
    }, { merge: true }).then(() => {
        if(typeof checkSubscriptionStatus === "function") checkSubscriptionStatus(uid);
    });
}

// ==========================================
// 4. CSS INJECTOR (Premium Design)
// ==========================================
const paymentStyle = document.createElement("style");
paymentStyle.innerHTML = `
  /* Overlay - Glassmorphism Effect */
  .payment-overlay {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.65); /* Darker background */
      backdrop-filter: blur(8px); /* အနောက်ကို ဝါးလိုက်မယ် */
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 99999 !important;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      overflow-y: auto;
      padding: 20px;
  }

  .payment-overlay.show {
      opacity: 1;
      visibility: visible;
  }

  /* Modal Box - Premium Look */
  .payment-box {
      background: linear-gradient(145deg, #ffffff, #f3f4f6);
      padding: 40px 30px; /* နေရာကျယ်ကျယ် */
      width: 100%;
      max-width: 420px; /* အရင်ထက် ပိုကြီးမယ် */
      border-radius: 24px; /* ထောင့်တွေ ပိုဝိုင်းမယ် */
      text-align: center;
      box-shadow: 
        0 20px 50px rgba(0,0,0,0.2), 
        0 0 0 1px rgba(255,255,255,0.5) inset; /* အတွင်းဘောင် */
      position: relative;
      margin: auto;
      border: 1px solid rgba(255,255,255,0.8);
  }

  /* Close Button */
  .close-btn {
      position: absolute;
      top: 15px;
      right: 15px;
      width: 36px;
      height: 36px;
      background: white;
      border: none;
      border-radius: 50%;
      font-size: 18px;
      color: #666;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      transition: all 0.2s;
      z-index: 10;
  }
  .close-btn:hover { background: #fee2e2; color: #dc2626; transform: rotate(90deg); }

  /* Header Icon */
  .coffee-icon-bg {
      width: 80px; height: 80px;
      background: linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%);
      border-radius: 50%;
      display: flex; justify-content: center; align-items: center;
      margin: 0 auto 20px auto;
      font-size: 40px;
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  }

  /* Typography */
  .premium-title {
      font-size: 24px;
      font-weight: 800;
      color: #1f2937;
      margin: 0;
      letter-spacing: -0.5px;
  }
  .premium-desc {
      font-size: 15px;
      color: #6b7280;
      line-height: 1.6;
      margin: 10px 0 20px 0;
  }

  /* Price Tag */
  .price-tag {
      font-size: 32px;
      font-weight: 900;
      color: #2563eb;
      margin-bottom: 5px;
      display: inline-block;
      position: relative;
  }
  .currency { font-size: 20px; vertical-align: top; margin-right: 2px; }

  /* Stripe Button - Gradient */
  .stripe-pay-btn {
      background: linear-gradient(90deg, #635bff 0%, #4e44e0 100%);
      color: white;
      border: none;
      width: 100%;
      padding: 18px;
      font-size: 18px;
      font-weight: bold;
      border-radius: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      transition: all 0.3s;
      box-shadow: 0 8px 20px rgba(99, 91, 255, 0.3);
  }
  .stripe-pay-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 25px rgba(99, 91, 255, 0.4);
      background: linear-gradient(90deg, #574fec 0%, #3d34c9 100%);
  }
  .stripe-pay-btn:active { transform: translateY(1px); }

  /* Security Badge */
  .security-badge {
      margin-top: 20px;
      font-size: 12px;
      color: #9ca3af;
      display: flex; justify-content: center; align-items: center; gap: 5px;
  }
`;
document.head.appendChild(paymentStyle);