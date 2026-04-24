# ⚡ Blinkit Clone - Premium Audit Enhancements

A high-fidelity, production-ready React Native (Expo) application mimicking the **Blinkit** user experience. This project features a state-of-the-art design system, complex inventory simulations, and advanced mobile functionalities.

---

## 🌟 Major Highlights & New Features

### 1. 🎨 Premium UI/UX Design System
- **Brand Consistency**: Standardized the app with Blinkit's signature yellow (`#F8CB46`) and green (`#1C8A3B`) palette.
- **Smooth Circularity**: Applied a uniform `borderRadius: 20` (and `12` for smaller components) across the entire app for a modern, friendly, and premium look.
- **Dark Mode Support**: Fully integrated theme context that shifts the entire UI (Home, Cart, Profile, Product screens) into a sleek dark aesthetic.
- **Optimized for APK**: Explicitly forced `#000` text colors across all components to ensure perfect readability on production Android builds, even with varied system settings.

### 2. 🚛 Interactive Tracking & Logistics
- **Animated Map Tracking**: A simulated delivery experience in the `TrackingScreen` featuring a moving **scooty icon** 🛵 that travels along a visual path towards the user's home icon.
- **Live Order Status**: Dynamic status updates (e.g., "Arriving in 5 mins", "Delivery Partner is on the way") that transition as the order progresses.
- **Delivery Partner Tips**: Users can now leave a tip (₹20, ₹30, ₹50) for the delivery partner directly within the tracking interface.

### 3. 💸 Advanced Refund Processing Page
- **Post-Payment OOC Event**: Simulates a scenario where an item goes out of stock *after* payment is made.
- **Refund Visualizer**: A dedicated **Refund Processing** screen that handles online payments with:
    - A spinning loader for "Initiating Refund".
    - A success state showing the exact refund amount and remaining order total.
    - Transparent messaging for "Cash on Delivery" revised payments.

### 4. 📸 Camera-Powered Global Reviews
- **Expo Camera Integration**: Built a custom camera interface using `expo-camera` (`CameraView`) that allows users to take and attach real photos to their product reviews.
- **Photo Management**: Users can preview, add multiple photos, or remove them before submitting.
- **Live Review Engine**:
    - Reviews are saved to a global context (`AppContext`).
    - **Real-time Product Page Updates**: Average ratings and review counts are recalculated instantly.
    - **Visual Review Feed**: Product pages now display a dynamic feed of user-submitted reviews, complete with photos, satisfaction tags, and verified buyer badges.
- **Direct Product Reviews**: Added a "Rate Product" button directly on the Product Details page for a frictionless feedback loop.

### 5. 🛒 Smart Cart & Inventory Engine
- **Split Delivery (Cold/Fragile)**: Intelligent cart logic that identifies `isCold` items and allows users to manually move them to a separate "Cold Packet ❄️" for specialized handling.
- **Real-time Stock Simulator**: A background interval randomly depletes stock across the catalog, triggering "Out of Stock" (OOC) events in the cart before or after payment.
- **Dynamic Image Engine**: Integrated a resolver that automatically replaces placeholder images with high-quality, keyword-based photos from the **LoremFlickr API** for a professional catalog appearance.

### 6. 🎧 Support & Customer Care
- **Need Help? Integration**: A floating support button in the Profile section that links users to customer care.
- **Support Flow**: Integrated messaging icons and contact options for delivery partners and store support.

---

## 🛠 Tech Stack
- **Framework**: React Native with Expo (SDK 54)
- **State Management**: Context API (Global App State)
- **Navigation**: React Navigation (Native Stack)
- **Icons**: Lucide React Native
- **Media**: Expo Camera, Expo Image
- **Animations**: React Native Animated API

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Install Native Modules (If needed)
```bash
npx expo install expo-camera expo-image-picker expo-status-bar
```

### 3. Start Development Server
```bash
npx expo start
```

---

## 🧪 Testing Guide

- **Trigger a Refund**: Place an order with **Online Payment**. Go to `Profile -> Track Orders` and tap the **Simulate Item Out-of-Stock** button. You will be taken to the new Refund Processing page.
- **Add a Review with Photo**: Go to any delivered order (or a product page) and tap **Rate Product**. Grant camera permission, snap a photo, and submit. Check the product page to see the live update.
- **Watch the Scooty**: Place an order and view the tracking screen to see the animated scooty move along the delivery path!

---

## 📝 Design Philosophy
The app follows a **"Premium Quick Commerce"** philosophy:
- **Minimalist yet Vibrant**: Focus on clear typography (Inter/System) and high-contrast call-to-action buttons.
- **Feedback Focused**: Every action (adding to cart, applying a coupon, submitting a review) provides immediate visual feedback.
- **Responsive Layouts**: Designed to look stunning on both small and large-screen mobile devices.
