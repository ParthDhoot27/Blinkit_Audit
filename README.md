# ⚡ Blinkit Clone - Premium Audit Enhancements

A high-fidelity, production-ready React Native (Expo) application mimicking the **Blinkit** user experience. This project features a state-of-the-art design system, complex inventory simulations, and advanced mobile functionalities.

---

## 🌟 Major Highlights & New Features

### 1. 🚛 Interactive Tracking & Logistics
- **Animated Map Tracking**: A simulated delivery experience in the `TrackingScreen` featuring a moving **scooty icon** 🛵 that travels along a visual path towards the user's home icon.
- **Live Order Status**: Dynamic status updates (e.g., "Arriving in 5 mins", "Delivery Partner is on the way") that transition as the order progresses.
- **Delivery Partner Tips**: Users can leave a tip (₹20, ₹30, ₹50) for the delivery partner directly within the tracking interface.

### 2. 💸 Advanced Refund Processing Page
- **Post-Payment OOC Event**: Simulates a scenario where an item goes out of stock *after* payment is made.
- **Refund Visualizer**: A dedicated **Refund Processing** screen that handles online payments with:
    - A spinning loader for "Initiating Refund".
    - A success state showing the exact refund amount and remaining order total.
    - Transparent messaging for "Cash on Delivery" revised payments.

### 3. 📸 Camera-Powered Global Reviews
- **Expo Camera Integration**: Built a custom camera interface using `expo-camera` (`CameraView`) that allows users to take and attach real photos to their product reviews.
- **Photo Management**: Users can preview, add multiple photos, or remove them before submitting.
- **Live Review Engine**:
    - Reviews are saved to a global context (`AppContext`).
    - **Real-time Product Page Updates**: Average ratings and review counts are recalculated instantly.
    - **Visual Review Feed**: Product pages now display a dynamic feed of user-submitted reviews, complete with photos, satisfaction tags, and verified buyer badges.
- **Direct Product Reviews**: Added a "Rate Product" button directly on the Product Details page for a frictionless feedback loop.

### 4. 🛒 Smart Cart & Inventory Engine
- **Split Delivery (Cold/Fragile)**: Intelligent cart logic that identifies `isCold` items and allows users to manually move them to a separate "Cold Packet ❄️" for specialized handling.
- **Real-time Stock Simulator**: A background interval randomly depletes stock across the catalog, triggering "Out of Stock" (OOC) events in the cart before or after payment.
---

## 🛠 Tech Stack
- **Framework**: React Native with Expo
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

- **Login**:Currently the Authentication is dummy, You can login with +91 0000000000.
- **Trigger a Refund**: Place an order with **Online Payment**. Go to `Profile -> Track Orders` there will be a automatic time based out of stock process which will be clearly visible to the user.
- **Add a Review with Photo**: Go to any delivered order (or a product page) and tap **Rate Product**. Grant camera permission, snap a photo, and submit. Check the product page to see the live update.
---

## 📝 Design Philosophy
The app follows a **"Premium Quick Commerce"** philosophy:
- **Minimalist yet Vibrant**: Focus on clear typography (Inter/System) and high-contrast call-to-action buttons.
- **Feedback Focused**: Every action (adding to cart, applying a coupon, submitting a review) provides immediate visual feedback.
- **Responsive Layouts**: Designed to look stunning on both small and large-screen mobile devices.

