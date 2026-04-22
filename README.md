# Blinkit Clone Audit Enhancements

A robust, pixel-perfect clone of the Blinkit app built with React Native and Expo. This project extends a base implementation to include advanced e-commerce features, complex state management, and real-time simulations.

## 🚀 Features & Improvements Over Base Audit

### 1. Robust Data & UI Refinements
- **Extensive Catalog**: The `stock.json` now includes 50 categorized items (Vegetables, Dairy, Snacks, Beverages, Sweets, Cleaning, Healthcare, Personal Care) with high-quality imagery.
- **Dynamic Pricing**: Many items now feature original prices with a strikethrough, simulating real-world discounts.
- **3-Column Layout**: Redesigned the Home screen product catalogue to feature a dense, scrollable 3-column grid for better discovery.
- **Notch Handling**: Fully integrated `react-native-safe-area-context` to properly manage UI overlap with the mobile notch and camera cutouts on all devices.
- **Dynamic Search**: An interactive search bar that provides real-time, drop-down suggestions and allows instant navigation to products.
- **Functional Categories**: The "Shop by Category" badges on the Home screen now act as functional filters for the product grid below.

### 2. Advanced Cart & Checkout Experience
- **Coupons**: Added a functional coupon input field. (Try `WELCOME20` for 20% off or `FREEDELIVERY` for waived delivery fees).
- **Split Delivery Management**: Cart items can now be split into multiple packets. To ensure quality, only items marked as `isCold` can be manually moved to "Packet 2 (Cold/Fragile)" using dedicated buttons.
- **Payment Options**: Users can now select between "Pay Online" and "Cash on Delivery" at checkout.

### 3. Out-Of-Stock (OOC) Management System
The app features a dynamic real-time inventory simulator (inventory randomly drops every 30 seconds). We handle OOC events at two critical stages:
- **Pre-Payment OOC**: If an item in your cart goes out of stock *before* you pay, it is crossed out with a red strike, the total bill recalculates automatically, and the checkout button becomes disabled until the item is removed.
- **Post-Payment OOC**: We simulate a scenario where an item goes out of stock *just after* order placement. This can be triggered in the Tracking Screen, resulting in:
  - For Online Payments: A 2.5s simulated loading sequence, followed by a "Refund Initiated" notice.
  - For COD Payments: A notification informing the user to pay the revised amount to the delivery agent.

### 4. Tracking, Past Orders, and Reordering
- **Profile Redesign**: The profile page is completely revamped into a clean, list-based menu featuring preferences, old orders, edit profile, and an app-sharing option.
- **Dark Mode Preview**: A new "Dark Mode" toggle in the profile settings switches the app's global theme context, applying a dark background to the Profile and Home screens.
- **Parallel Ordering**: The context state now supports holding multiple active orders simultaneously.
- **Tracking Screen**: A dedicated tracking page where users can toggle between their active and past orders via a horizontal scroll tab. All previous orders are visible here.
- **Buy Again**: Past orders that have been "Delivered" feature a **Buy Again** button that instantly adds all available items back to the active cart.
- **Simulations**: The Tracking Screen allows users to manually trigger Post-Payment OOC events or "Simulate Delivery" events for active orders.
- **Interactive Review System**: Once an order is delivered, users can review items. The Product details page has been upgraded to support an interactive 5-star rating system and text review form. Submitted reviews are saved globally and displayed on the product page along with the aggregate average rating.

## 🛠 Tech Stack
- React Native
- Expo
- React Navigation (Native Stack)
- Context API (State Management)
- Lucide React Native (Icons)

## 📦 Running the Project

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the Expo server:
   ```bash
   npx expo start
   ```
3. Use the Expo Go app on your phone or an emulator to view the app.

## 🧪 How to Test the New Features

- **Split Delivery**: Add an item like "Amul Milk" to the cart. Go to the Cart screen, and you will see a button to move it to Packet 2 (Cold). Try adding "Almonds" and notice it cannot be moved.
- **OOC Simulator**: 
  - *Pre-payment*: Add items to cart. Wait 30-60 seconds on the cart screen. As the background interval randomly reduces stock, some items will cross out and block checkout.
  - *Post-payment*: Checkout normally. Go to Profile -> Track Orders. Tap "Simulate Post-Payment OOC Event".
- **Coupons**: In the cart, type `WELCOME20` and click Apply.
