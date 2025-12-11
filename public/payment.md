အနှစ်ချုပ် အဆင့်တွေကို ပြန်ကြည့်ရအောင် -

# ၁။ payment.css (သီးခြားဆောက်)
ဒီဇိုင်းကုဒ်တွေ အကုန်လုံး ဒီထဲထည့်မယ်။

# ၂။ payment.js (သီးခြားဆောက်)
HTML Modal ကို Inject လုပ်မယ့်ကုဒ်နဲ့၊ CSS ကို လှမ်းချိတ်မယ့်ကုဒ်၊ processPayment Logic တွေ ဒီထဲထည့်မယ်။

# ၃။ index.html မှာ Link ချိတ်
app.js မတိုင်ခင်မှာ ထည့်ဖို့ မမေ့ပါနဲ့။
```<script defer src="payment.js"></script>
<script defer src="app.js"></script>
```

# ၄။ app.js မှာ Setup လုပ်
App တစ်ခုချင်းစီအတွက် နာမည်နဲ့ Link တွေ သတ်မှတ်ပေးမယ်။

```// Payment System ကို Setup လုပ်ခြင်း
setupPaymentSystem({
    appName: "US Life Guide",
    stripeLinks: {
        '1 Month': 'https://buy.stripe.com/test_uslife_1m',
        '6 Months': 'https://buy.stripe.com/test_uslife_6m',
        'Lifetime': 'https://buy.stripe.com/test_uslife_life'
    },
    paypalLink: "https://paypal.me/uslifeadmin"
});
```

```// Payment System ကို Setup လုပ်ခြင်း
setupPaymentSystem({
    appName: "Dockeeper Pro",
    stripeLinks: {
        'Monthly': 'https://buy.stripe.com/test_dock_monthly',
        'Yearly': 'https://buy.stripe.com/test_dock_yearly'
    },
    paypalLink: "https://paypal.me/dockeeperadmin"
});
```

# ၅။ HTML ခလုတ်များကို ပြင်ဆင်ခြင်း (ဒါလေးကျန်သေးတယ်)
index.html ထဲက Paywall Modal (သို့) Pricing Section မှာရှိတဲ့ ခလုတ်တွေကို initPayment function ခေါ်အောင် ပြင်ပေးရပါမယ်။

အဟောင်း
```<div onclick="selectPlan('Lifetime', 200)"> ... </div>
```

အသစ် (ဒီလိုပြောင်းပေးပါ)
```<!-- Payment.js ထဲက function ကို လှမ်းခေါ်တာပါ -->
<div onclick="initPayment('Lifetime', 200)"> ... </div>

<div onclick="initPayment('1 Year', 20)"> ... </div>
```

# ၁။ Stripe ချိတ်ဆက်နည်း (Credit/Debit Card အတွက်)
Stripe က "Payment Links" ဆိုတဲ့ Feature ပါတဲ့အတွက် အရမ်းလွယ်ပါတယ်။

## အဆင့် (က) - Account နှင့် Product တည်ဆောက်ခြင်း

1. dashboard.stripe.com မှာ အကောင့်ဖွင့်ပါ။ (စီးပွားရေးလုပ်ငန်း အချက်အလက်တွေ တောင်းပါလိမ့်မယ်၊ စမ်းသပ်ဖို့ဆိုရင် ညာဘက်အပေါ်ထောင့်က "Test Mode" ကို ဖွင့်ထားပါ)။
2. ဘယ်ဘက် Menu မှ Products ကိုနှိပ်ပါ။
3. + Add Product ကိုနှိပ်ပါ။
4. Product Details ဖြည့်ပါ:
 - Name: US Life - Lifetime Plan (ဥပမာ)
 - Price: 200.00 USD
 - Billing period: One-time (တစ်ခါတည်းပေး) သို့မဟုတ် Recurring (လစဉ်ပေး) ရွေးပါ။
5. Save product ကိုနှိပ်ပါ။

## အဆင့် (ခ) - Payment Link ထုတ်ယူခြင်း

1. Product ဖန်တီးပြီးသွားရင် အဲ့ဒီ Product စာမျက်နှာမှာပဲ "Create payment link" ဆိုတဲ့ ခလုတ်ကို ရှာပြီး နှိပ်ပါ။
2. Payment Page ပုံစံကို ပြပါလိမ့်မယ်။ ညာဘက်အပေါ်က Create link ကို နှိပ်ပါ။
3. ရလာတဲ့ Link (ဥပမာ - https://buy.stripe.com/test_...) ကို Copy ကူးပါ။
4. ဒီ Link ကို ခင်ဗျားရဲ့ app.js ထဲက stripeLinks နေရာမှာ သွားထည့်ရပါမယ်။

(Plan တစ်ခုချင်းစီ (1 Month, 1 Year, Lifetime) အတွက် Product သီးခြားဆောက်ပြီး Link ယူရပါမယ်)

# ၂။ PayPal ချိတ်ဆက်နည်း (PayPal အကောင့်ရှိသူများအတွက်)

PayPal ကတော့ Link ယူရတာ ပိုရိုးရှင်းပါတယ်။ PayPal.Me စနစ်ကို သုံးပါမယ်။

1. PayPal.Me ကိုသွားပြီး ကိုယ့်စီးပွားရေး (သို့) ကိုယ့်နာမည်နဲ့ Link တစ်ခု ဖန်တီးပါ (ဥပမာ - paypal.me/minmaung)။
2. app.js မှာ ထည့်တဲ့အခါ ငွေပမာဏပါ တခါတည်း တောင်းချင်ရင် နောက်ကနေ ဂဏန်းထည့်ရေးလို့ ရပါတယ်။
 - ဥပမာ User က $20 ပေးရမယ်ဆိုရင်: https://paypal.me/minmaung/20USD လို့ ရေးလိုက်တာနဲ့ User ဘက်မှာ $20 လို့ တန်းပေါ်နေပါလိမ့်မယ်။

# ၃။ app.js တွင် လာထည့်ခြင်း

အပေါ်က ရလာတဲ့ Link တွေကို ခင်ဗျားရဲ့ App အလိုက် app.js မှာ ဒီလို အစားထိုးထည့်လိုက်ပါ။

```// app.js (US Life အတွက်)

setupPaymentSystem({
    appName: "US Life Guide",
    
    // Stripe ကရလာတဲ့ Link တွေကို ဒီမှာထည့်ပါ
    stripeLinks: {
        '1 Month': 'https://buy.stripe.com/test_a1b2c3d4...', 
        '6 Months': 'https://buy.stripe.com/test_e5f6g7h8...',
        '1 Year':   'https://buy.stripe.com/test_i9j0k1l2...',
        'Lifetime': 'https://buy.stripe.com/test_m3n4o5p6...' 
    },

    // PayPal Link (ကိုယ့် Link ကိုထည့်ပါ)
    // နောက်က /20USD တို့ /200USD တို့ ထည့်စရာမလိုပါဘူး (PayPal က တမျိုးတည်းရှိလို့ပါ)
    // ဒါပေမယ့် Admin က Order စာရင်းကြည့်ပြီး ဘယ်လောက်လွှဲလိုက်လဲ စစ်ဆေးနိုင်ပါတယ်။
    paypalLink: "https://paypal.me/minmaung"
});
```

# ၄။ ဘယ်လို အလုပ်လုပ်မလဲ?

1. User က App ထဲမှာ "1 Year ($20)" ကို နှိပ်လိုက်တယ်။
2. Modal ပွင့်လာမယ်၊ "Credit Card (Stripe)" ကို ရွေးလိုက်တယ်။
3. Browser က https://buy.stripe.com/test_i9j0k1l2... ကို ချက်ချင်း ရောက်သွားမယ်။
4. User က ကတ်နံပါတ်ဖြည့်ပြီး ဝယ်လိုက်မယ်။
5. Stripe က ခင်ဗျားဆီ ပိုက်ဆံရောက်ကြောင်း ပြမယ်။
6. ခင်ဗျားက Firebase Database > orders ထဲမှာ ကြည့်လိုက်တော့ User က "1 Year Plan" ဝယ်ဖို့ နှိပ်ခဲ့တာ တွေ့မယ်။ Stripe မှာလည်း ပိုက်ဆံဝင်တာ သေချာပြီဆိုရင် User ကို Premium ပေးလိုက်ရုံပါပဲ။

## အကြံပြုချက်:

စမ်းသပ်နေတုန်းမှာ Stripe ရဲ့ Test Mode Link တွေကိုပဲ သုံးပါ။ အစစ်နဲ့ စမ်းရင် ပိုက်ဆံ တကယ်ဖြတ်ပါလိမ့်မယ်။ App တကယ်လွှတ်မှ Live Mode ကိုပြောင်းပြီး Link အသစ်တွေ ပြန်ထုတ်၊ app.js မှာ ပြန်လာချိန်းပေးလိုက်ပါ။