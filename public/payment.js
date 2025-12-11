// --- payment.js (Universal Version) ---

// ၁။ CSS Auto Inject (ဒီဇိုင်း)
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  .payment-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 10000; justify-content: center; align-items: center; backdrop-filter: blur(5px); font-family: sans-serif; }
  .payment-box { background: white; width: 90%; max-width: 400px; border-radius: 20px; padding: 25px; box-shadow: 0 20px 50px rgba(0,0,0,0.2); animation: popUp 0.3s ease-out; position: relative; }
  @keyframes popUp { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .close-btn { position: absolute; right: 20px; top: 20px; border: none; background: #f1f5f9; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-size: 18px; color: #64748b; }
  .pay-item { display: flex; justify-content: space-between; align-items: center; padding: 15px; margin-bottom: 10px; border: 2px solid #f1f5f9; border-radius: 12px; cursor: pointer; transition: 0.2s; }
  .pay-item:hover { border-color: #2563eb; background: #eff6ff; }
  .pay-item b { color: #2563eb; }
  .header-icon { font-size: 40px; margin-bottom: 10px; display: block; text-align: center; }
  .app-title { text-align: center; margin: 0 0 5px 0; color: #1e293b; }
  .app-desc { text-align: center; color: #64748b; font-size: 13px; margin-bottom: 25px; }
`;
document.head.appendChild(styleSheet);

// ၂။ HTML Template (Container Only)
const modalHTML = `
<div id="universalModal" class="payment-overlay">
  <div class="payment-box">
    <button onclick="closePaymentUI()" class="close-btn">&times;</button>
    <div id="modalContent"></div>
  </div>
</div>
`;
document.body.insertAdjacentHTML('beforeend', modalHTML);

// ၃။ Logic Configuration
let appConfig = {};
let selectedItem = {};

// Setup Function (App တစ်ခုချင်းစီက ဒီမှာ လာချိတ်မယ်)
function setupPaymentSystem(config) {
    appConfig = config; 
    // config.type = 'donation' OR 'subscription'
}

// UI ဖွင့်မည့် Function
function openPaymentUI() {
    const content = document.getElementById("modalContent");
    const modal = document.getElementById("universalModal");
    
    // Login စစ်ခြင်း
    if (typeof firebase !== 'undefined' && !firebase.auth().currentUser) {
        return alert("Please login first!");
    }

    let html = '';

    // A. Donation Type (Free App)
    if (appConfig.type === 'donation') {
        html = `
            <div class="header-icon">☕</div>
            <h2 class="app-title">Support ${appConfig.appName}</h2>
            <p class="app-desc">App ကို ကြိုက်နှစ်သက်ရင် မုန့်ဖိုးပေးပြီး ကူညီနိုင်ပါတယ်ခင်ဗျာ။</p>
            
            ${generateButtons(appConfig.items)}
        `;
    } 
    // B. Subscription Type (Paid App)
    else {
        html = `
            <div class="header-icon">💎</div>
            <h2 class="app-title">Upgrade ${appConfig.appName}</h2>
            <p class="app-desc">Unlock Premium features to get full access.</p>
            
            ${generateButtons(appConfig.items)}
        `;
    }

    content.innerHTML = html;
    modal.style.display = "flex";
}

// ခလုတ်များ ထုတ်ပေးခြင်း
function generateButtons(items) {
    let buttons = '';
    // items = { 'Coffee': {price: 3, link: '...'}, ... }
    for (const [name, data] of Object.entries(items)) {
        buttons += `
        <div class="pay-item" onclick="showPaymentMethods('${name}', ${data.price}, '${data.link}')">
            <span>${getIcon(name)} ${name}</span>
            <b>$${data.price}</b>
        </div>`;
    }
    return buttons;
}

// Icon ရွေးပေးခြင်း helper
function getIcon(name) {
    if (name.includes('Coffee')) return '☕';
    if (name.includes('Burger')) return '🍔';
    if (name.includes('Meal')) return '🍱';
    if (name.includes('Lifetime')) return '👑';
    return '✨';
}

// Payment Method ရွေးတဲ့ အဆင့် (Step 2)
function showPaymentMethods(itemName, price, stripeLink) {
    selectedItem = { name: itemName, price: price, link: stripeLink };
    
    const content = document.getElementById("modalContent");
    content.innerHTML = `
        <div class="header-icon">💳</div>
        <h3 class="app-title">Checkout</h3>
        <p class="app-desc">Total: <b style="color:#2563eb">$${price}</b> for ${itemName}</p>

        <div class="pay-item" onclick="processTransaction('stripe')">
            <span>💳 Credit/Debit Card</span>
            <i class="fas fa-arrow-right"></i>
        </div>
        <div class="pay-item" onclick="processTransaction('paypal')">
            <span>🅿️ PayPal</span>
            <i class="fas fa-arrow-right"></i>
        </div>
        
        <p style="text-align:center; font-size:12px; color:#999; margin-top:15px; cursor:pointer; text-decoration:underline;" onclick="openPaymentUI()">Back</p>
    `;
}

// Transaction Process
function processTransaction(method) {
    const user = firebase.auth().currentUser;
    const db = firebase.firestore();

    db.collection("orders").add({
        uid: user.uid,
        email: user.email,
        appName: appConfig.appName,
        type: appConfig.type, // 'donation' or 'subscription'
        item: selectedItem.name,
        amount: selectedItem.price,
        method: method,
        status: 'pending',
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        if (method === 'stripe') {
            if(selectedItem.link) window.location.href = selectedItem.link;
            else alert("Link not found!");
        } else {
            window.open(appConfig.paypalLink || "https://paypal.me", '_blank');
        }
    }).catch(err => alert("Error: " + err.message));
}

function closePaymentUI() {
    document.getElementById("universalModal").style.display = "none";
}


/*
// app.js (Free App)
setupPaymentSystem({
    appName: "US Life",
    type: "donation", // <--- ဒီနေရာမှာ donation လို့ သတ်မှတ်လိုက်တာနဲ့ Coffee ပုံစံဖြစ်သွားမယ်
    
    items: {
        'Coffee': { price: 3, link: 'https://buy.stripe.com/test_coffee' },
        'Burger': { price: 5, link: 'https://buy.stripe.com/test_burger' },
        'Big Meal': { price: 10, link: 'https://buy.stripe.com/test_meal' }
    },
    
    paypalLink: "https://paypal.me/minmaung"
});

<!-- Free App မို့လို့ ကော်ဖီခွက်ပုံလေး ထားမယ် -->
<button onclick="openPaymentUI()" class="icon-btn">
    ☕ Support Us
</button>
*/

/*
// app.js (Paid App)

setupPaymentSystem({
    appName: "Dockeeper Pro",
    type: "subscription", // <--- ဒီနေရာမှာ subscription လို့ သတ်မှတ်လိုက်တာနဲ့ Upgrade ပုံစံဖြစ်သွားမယ်
    
    items: {
        'Monthly Plan': { price: 5, link: 'https://buy.stripe.com/test_monthly' },
        'Yearly Plan': { price: 50, link: 'https://buy.stripe.com/test_yearly' },
        'Lifetime': { price: 100, link: 'https://buy.stripe.com/test_lifetime' }
    },
    
    paypalLink: "https://paypal.me/minmaung"
});

// Paid App တွေမှာ Feature တွေကို Lock ချချင်ရင်
function openFeature() {
    // Subscription ရှိလားစစ်၊ မရှိရင် Payment UI ဖွင့်
    if (!userSubscription.active) {
        openPaymentUI(); // <--- ဒီ function ကို ခေါ်လိုက်ရုံပဲ
    } else {
        // Feature ဖွင့်
    }
}
*/

/*
အားသာချက်

1. ဖိုင်တစ်ဖိုင်တည်း: payment.js တစ်ခုတည်းကို App အကုန်လုံးမှာ ကူးထည့်ထားလိုက်။

2. Config Based: app.js မှာ type: 'donation' လား type: 'subscription' လား ရွေးလိုက်တာနဲ့ UI က အလိုအလို ပြောင်းသွားမယ်။

3. Admin Friendly: Firestore ရဲ့ orders collection မှာ type field ပါလာမယ့်အတွက် Admin က ဒါက "မုန့်ဖိုး (Donation)" လား "Subscription" လားဆိုတာ ခွဲခြားရ လွယ်သွားပါမယ်။
*/