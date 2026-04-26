import React, { createContext, useState, useEffect, useContext } from 'react';

import initialStock from '../data/stock.json';
import initialUsers from '../data/users.json';

export const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // --- Main Application State ---

  // stock: Holds the list of all available products and their inventory levels
  const [stock, setStock] = useState(initialStock);

  // users: Maintains the local database of users, their orders, and wallet balances
  const [users, setUsers] = useState(initialUsers);

  // currentUser: Stores the currently authenticated user session
  const [currentUser, setCurrentUser] = useState(null);

  // --- App Configuration & UI State ---

  // Sync with JSON file changes during development
  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  // isEssentialMode: Toggle for a simplified UI focusing only on basics
  const [isEssentialMode, setIsEssentialMode] = useState(false);
  // isFragileColdEnabled: User preference for handling fragile or temperature-sensitive items
  const [isFragileColdEnabled, setIsFragileColdEnabled] = useState(false);
  // theme: Current visual theme ('light' or 'dark')
  const [theme, setTheme] = useState('light');
  // productReviews: Global storage for user-submitted reviews
  const [productReviews, setProductReviews] = useState([]);
  // notification: Holds the current global notification object (title, message, type)
  const [notification, setNotification] = useState(null);
  // hasPreOrderOOC: Boolean to track if an 'Out of Stock' simulation has occurred for the current cart
  const [hasPreOrderOOC, setHasPreOrderOOC] = useState(false);

  // cartTimerRef: Reference to the active pre-order OOC simulation timer
  const cartTimerRef = React.useRef(null);

  /**
   * Helper to resolve high quality images via API if needed.
   * Replaces generic placeholders with dynamic food images from LoremFlickr.
   */
  const resolveImageUrl = (name, currentUrl) => {
    if (!currentUrl || currentUrl.includes('placeholder') || currentUrl.includes('via.placeholder')) {
      // Use LoremFlickr for keyword based real images (extracting first word of item name)
      return `https://loremflickr.com/400/400/${encodeURIComponent(name.split(' ')[0])},food`;
    }
    return currentUrl;
  };

  /**
   * Initialization: Enhance the initial stock with better images on app load.
   */
  useEffect(() => {
    const enhancedStock = initialStock.map(item => ({
      ...item,
      image: resolveImageUrl(item.name, item.image)
    }));
    setStock(enhancedStock);
  }, []);

  /**
   * Global Refund Processing Timer
   * Monitors 'Refund Processing' orders and moves them to 'Refunded & Completed' after 20s.
   * This simulates the backend processing of a refund.
   */
  useEffect(() => {
    if (!currentUser) return;

    const processingOrders = currentUser.orders.filter(o => o.status === 'Refund Processing');
    if (processingOrders.length === 0) return;

    const timer = setTimeout(() => {
      // Capture the ID of the order we want to process
      const orderId = processingOrders[0].id;

      setCurrentUser(prevUser => {
        if (!prevUser) return null;

        const currentOrder = prevUser.orders.find(o => o.id === orderId);
        if (!currentOrder || currentOrder.status !== 'Refund Processing') return prevUser;

        const refundAmt = currentOrder.refundAmount || 0;

        const newTransaction = {
          id: 'tx_ref_' + Date.now(),
          type: 'Refund',
          amount: refundAmt,
          date: new Date().toISOString(),
          status: 'Completed',
          itemName: 'Refund for ' + currentOrder.id.substring(0, 8)
        };

        const updatedOrders = prevUser.orders.map(o =>
          o.id === currentOrder.id ? { ...o, status: 'Refunded & Completed' } : o
        );

        const updatedUser = {
          ...prevUser,
          walletBalance: (prevUser.walletBalance || 0) + refundAmt,
          transactions: [newTransaction, ...(prevUser.transactions || [])],
          orders: updatedOrders
        };

        // Update users array inside to ensure consistency
        setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));

        // Trigger notification after state update logic
        setNotification({
          title: "Refund Processed",
          message: `₹${refundAmt} has been credited to your wallet.`,
          type: 'refund'
        });

        return updatedUser;
      });
    }, 30000); // 30 seconds for demo

    return () => clearTimeout(timer);
  }, [currentUser?.orders]);

  /**
   * Pre-Order 10s Out of Stock (OOC) Simulation
   * If a user has items in their cart, this timer randomly picks one item to mark as OOC.
   * This simulates a high-demand environment where items can sell out while browsing.
   */
  useEffect(() => {
    // Only start timer if cart has items and OOC hasn't happened yet
    if (currentUser && currentUser.cart.length > 0 && !hasPreOrderOOC) {
      if (!cartTimerRef.current) {
        cartTimerRef.current = setTimeout(() => {
          // Use functional update to avoid closure issues with currentUser
          setCurrentUser(prevUser => {
            if (!prevUser || prevUser.cart.length === 0) return prevUser;

            const randomIndex = Math.floor(Math.random() * prevUser.cart.length);
            const itemToOOC = prevUser.cart[randomIndex];

            const updatedCart = prevUser.cart.map((item, idx) =>
              idx === randomIndex ? { ...item, isOutOfStock: true } : item
            );

            // Update global stock
            setStock(prevStock => prevStock.map(p =>
              p.id === itemToOOC.id ? { ...p, stock: 0 } : p
            ));

            setHasPreOrderOOC(true);
            setNotification({
              title: "Item Out of Stock",
              message: `Apologies! ${itemToOOC.name} just went out of stock.`,
              type: 'ooc'
            });

            const updatedUser = { ...prevUser, cart: updatedCart };
            setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
            return updatedUser;
          });
        }, 10000);
      }
    }

    return () => {
      if (cartTimerRef.current && (hasPreOrderOOC || currentUser?.cart.length === 0)) {
        clearTimeout(cartTimerRef.current);
        cartTimerRef.current = null;
      }
    };
  }, [currentUser?.cart?.length, hasPreOrderOOC]);

  const triggerPreOrderOOC = () => {
    setCurrentUser(prevUser => {
      if (!prevUser || prevUser.cart.length === 0 || hasPreOrderOOC) return prevUser;

      const randomIndex = Math.floor(Math.random() * prevUser.cart.length);
      const itemToOOC = prevUser.cart[randomIndex];

      const updatedCart = prevUser.cart.map((item, idx) =>
        idx === randomIndex ? { ...item, isOutOfStock: true } : item
      );

      // Clear automated timer if manual trigger is used
      if (cartTimerRef.current) {
        clearTimeout(cartTimerRef.current);
        cartTimerRef.current = null;
      }

      const updatedUser = { ...prevUser, cart: updatedCart };

      // Update global stock so it's OOC everywhere
      setStock(prevStock => prevStock.map(p =>
        p.id === itemToOOC.id ? { ...p, stock: 0 } : p
      ));

      setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
      setHasPreOrderOOC(true);
      setNotification({
        title: "Item Out of Stock",
        message: `Apologies! ${itemToOOC.name} just went out of stock.`,
        type: 'ooc'
      });
      return updatedUser;
    });
  };

  /**
   * Real-time stock simulation
   * Randomly reduces stock of products every 45 seconds to simulate other users buying.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setStock(currentStock => {
        return currentStock.map(item => {
          if (Math.random() > 0.8) {
            const reduction = Math.floor(Math.random() * 2);
            return { ...item, stock: Math.max(0, item.stock - reduction) };
          }
          return item;
        });
      });
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  /**
   * Authenticates a user based on mobile number and password.
   */
  const login = (mobile, password) => {
    console.log("Attempting login with:", mobile);
    const user = users.find(u => u.mobile === mobile);
    if (user) {
      console.log("Login successful for:", user.name);
      setCurrentUser(user);
      return true;
    }
    console.log("Login failed. Users in DB:", users.map(u => u.mobile));
    return false;
  };

  /**
   * Ends the current user session.
   */
  const logout = () => {
    setCurrentUser(null);
  };

  /**
   * Adds a product to the user's shopping cart.
   * Checks for stock availability before adding.
   */
  const addToCart = (product) => {
    setCurrentUser(prevUser => {
      if (!prevUser) return null;

      const currentStockItem = stock.find(s => s.id === product.id);
      if (!currentStockItem || currentStockItem.stock <= 0) return prevUser;

      let updatedCart = [...prevUser.cart];
      const existingItemIndex = updatedCart.findIndex(item => item.id === product.id);

      if (existingItemIndex > -1) {
        // Increment quantity if item already in cart
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          cartQuantity: updatedCart[existingItemIndex].cartQuantity + 1
        };
      } else {
        // Add new item to cart
        updatedCart.push({ ...product, cartQuantity: 1, packet: 1 });
      }

      const updatedUser = { ...prevUser, cart: updatedCart };
      setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
      return updatedUser;
    });
    return true;
  };

  /**
   * Completely removes an item from the cart.
   */
  const removeFromCart = (productId) => {
    setCurrentUser(prevUser => {
      if (!prevUser) return null;
      let updatedCart = prevUser.cart.filter(item => item.id !== productId);
      const updatedUser = { ...prevUser, cart: updatedCart };
      setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
      return updatedUser;
    });
  };

  /**
   * Updates the quantity of an item in the cart.
   * If quantity becomes 0 or less, the item is removed.
   */
  const updateCartQuantity = (productId, delta) => {
    setCurrentUser(prevUser => {
      if (!prevUser) return null;
      let updatedCart = [...prevUser.cart];
      const itemIndex = updatedCart.findIndex(item => item.id === productId);

      if (itemIndex > -1) {
        const newQuantity = updatedCart[itemIndex].cartQuantity + delta;
        if (newQuantity <= 0) {
          updatedCart = updatedCart.filter(item => item.id !== productId);
        } else {
          updatedCart[itemIndex] = { ...updatedCart[itemIndex], cartQuantity: newQuantity };
        }
      }

      const updatedUser = { ...prevUser, cart: updatedCart };
      setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
      return updatedUser;
    });
  };

  /**
   * Moves an item to a specific packet (1, 2, or 3) for delivery simulation.
   */
  const moveItemToPacket = (productId, packetNumber) => {
    setCurrentUser(prevUser => {
      if (!prevUser) return null;
      let updatedCart = prevUser.cart.map(item => {
        if (item.id === productId) return { ...item, packet: packetNumber };
        return item;
      });
      const updatedUser = { ...prevUser, cart: updatedCart };
      setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
      return updatedUser;
    });
  };

  /**
   * Processes the checkout, creates an order, and clears the cart.
   * Handles Wallet payments and triggers post-order OOC simulation.
   */
  const checkout = (paymentMethod = 'Online') => {
    let success = false;
    setCurrentUser(prevUser => {
      if (!prevUser || prevUser.cart.length === 0) return prevUser;

      const total = prevUser.cart.reduce((t, i) => t + (i.price * i.cartQuantity), 0);

      // Wallet balance check
      if (paymentMethod === 'Wallet' && (prevUser.walletBalance || 0) < total) {
        alert("Insufficient wallet balance.");
        return prevUser;
      }

      // Check if any items became OOC before checkout
      const hasOOC = prevUser.cart.some(item => item.isOutOfStock);
      if (hasOOC) {
        alert("Please remove out of stock items before checkout.");
        return prevUser;
      }

      const newOrder = {
        id: "ord_" + Math.random().toString(36).substr(2, 9),
        items: [...prevUser.cart],
        date: new Date().toISOString(),
        status: 'In Transit',
        paymentMethod: paymentMethod,
        originalTotal: total,
        isOOCMocked: false,
        tipAmount: 0
      };

      let updatedUser = { ...prevUser, cart: [], orders: [newOrder, ...prevUser.orders] };

      // Deduct from wallet if applicable
      if (paymentMethod === 'Wallet') {
        updatedUser.walletBalance -= total;
        updatedUser.transactions = [{
          id: 'tx_pay_' + Date.now(),
          type: 'Payment',
          amount: total,
          date: new Date().toISOString(),
          status: 'Completed',
          itemName: 'Order ' + newOrder.id.substring(0, 8)
        }, ...(updatedUser.transactions || [])];
      }

      setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));

      // Post-order OOC Timer (5 seconds) - simulates an item going OOC just after payment
      setTimeout(() => {
        simulatePostPaymentOOC(newOrder.id);
      }, 5000);

      // Delivery Arrival Notification (15 seconds)
      setTimeout(() => {
        setNotification({
          title: "Order Arrived!",
          message: "Your order is at your doorstep. Please confirm delivery.",
          type: 'delivered'
        });
      }, 15000);

      success = true;
      return updatedUser;
    });
    return success;
  };

  /**
   * Re-adds items from a previous order into the current cart.
   */
  const buyAgain = (orderId) => {
    setCurrentUser(prevUser => {
      if (!prevUser) return prevUser;
      const orderToReorder = prevUser.orders.find(o => o.id === orderId);
      if (!orderToReorder) return prevUser;

      let updatedCart = [...prevUser.cart];
      orderToReorder.items.forEach(orderItem => {
        const liveStockItem = stock.find(s => s.id === orderItem.id);
        if (!liveStockItem || liveStockItem.stock <= 0) return;

        const existingItemIndex = updatedCart.findIndex(cartItem => cartItem.id === orderItem.id);
        if (existingItemIndex > -1) {
          updatedCart[existingItemIndex] = {
            ...updatedCart[existingItemIndex],
            cartQuantity: updatedCart[existingItemIndex].cartQuantity + orderItem.cartQuantity
          };
        } else {
          const { isOOCAfterPayment, ...cleanItem } = orderItem;
          updatedCart.push({ ...cleanItem, packet: 1 });
        }
      });

      const updatedUser = { ...prevUser, cart: updatedCart };
      setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
      return updatedUser;
    });
    return true;
  };

  /**
   * Saves a user review for a specific product.
   */
  const submitReview = (productId, rating, comment, tags = [], photos = []) => {
    const newReview = {
      id: "rev_" + Date.now() + Math.random().toString(36).substr(2, 5),
      productId,
      userId: currentUser?.id,
      userName: currentUser?.name || "Anonymous",
      rating,
      comment,
      tags,
      photos,
      date: new Date().toISOString()
    };
    setProductReviews(prev => [newReview, ...prev]);
  };

  /**
   * Simulates an item going out of stock immediately after the order is placed.
   * Triggers a refund process for that item.
   */
  const simulatePostPaymentOOC = (orderId) => {
    setCurrentUser(prevUser => {
      if (!prevUser) return null;

      let simulatedResult = null;
      let updatedOrders = prevUser.orders.map(order => {
        if (order.id === orderId && !order.isOOCMocked && order.items.length > 0) {
          const randomIndex = Math.floor(Math.random() * order.items.length);
          const itemToOOC = order.items[randomIndex];
          let newItems = [...order.items];
          newItems[randomIndex] = { ...itemToOOC, isOOCAfterPayment: true };
          const refundAmount = itemToOOC.price * itemToOOC.cartQuantity;
          const newTotal = (order.revisedTotal || order.originalTotal) - refundAmount;

          simulatedResult = { itemName: itemToOOC.name, paymentMethod: order.paymentMethod, refundAmount, newTotal };

          // Start refund process if Online or Wallet
          const isOnline = order.paymentMethod === 'Online' || order.paymentMethod === 'Wallet';
          const finalStatus = isOnline ? 'Refund Processing' : 'Delivering'; // For COD, we just keep it as Delivering/In Transit

          return { ...order, items: newItems, status: finalStatus, revisedTotal: newTotal, isOOCMocked: true, refundAmount };
        }
        return order;
      });

      if (simulatedResult) {
        const isOnline = simulatedResult.paymentMethod === 'Online' || simulatedResult.paymentMethod === 'Wallet';
        let updatedUser = { ...prevUser, orders: updatedOrders };

        if (isOnline) {
          const newTransaction = {
            id: 'tx_pending_' + Date.now(),
            type: 'Refund',
            amount: simulatedResult.refundAmount,
            date: new Date().toISOString(),
            status: 'Processing',
            itemName: 'Pending refund for ' + simulatedResult.itemName
          };
          updatedUser.transactions = [newTransaction, ...(updatedUser.transactions || [])];
        }

        setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));

        setNotification({
          title: isOnline ? "Refund Initiated" : "Order Updated",
          message: isOnline 
            ? `${simulatedResult.itemName} went out of stock. ₹${simulatedResult.refundAmount} is being processed to your wallet.` 
            : `${simulatedResult.itemName} went out of stock. Bill adjusted to ₹${simulatedResult.newTotal}.`,
          type: 'ooc_post'
        });

        return updatedUser;
      }
      return prevUser;
    });
  };

  /**
   * Marks an order as delivered.
   */
  const markOrderDelivered = (orderId) => {
    setCurrentUser(prevUser => {
      if (!prevUser) return null;
      const updatedOrders = prevUser.orders.map(order =>
        order.id === orderId ? { ...order, status: 'Delivered', delivered: true } : order
      );
      const updatedUser = { ...prevUser, orders: updatedOrders };
      setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
      return updatedUser;
    });
  };

  /**
   * Adds a tip to an existing order.
   */
  const addTipToOrder = (orderId, tipAmount) => {
    setCurrentUser(prevUser => {
      if (!prevUser) return null;
      const updatedOrders = prevUser.orders.map(order => {
        if (order.id === orderId) {
          const currentTip = order.tipAmount || 0;
          const baseTotal = order.revisedTotal || order.originalTotal;
          const newTotal = baseTotal - currentTip + tipAmount;
          return { ...order, tipAmount, revisedTotal: newTotal };
        }
        return order;
      });
      const updatedUser = { ...prevUser, orders: updatedOrders };
      setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
      return updatedUser;
    });
  };

  return (
    <AppContext.Provider value={{
      stock, users, currentUser, login, logout, addToCart, removeFromCart, updateCartQuantity,
      moveItemToPacket, checkout, buyAgain, simulatePostPaymentOOC, markOrderDelivered,
      addTipToOrder, triggerPreOrderOOC, productReviews, submitReview, isEssentialMode, setIsEssentialMode,
      isFragileColdEnabled, setIsFragileColdEnabled, theme, setTheme, resolveImageUrl,
      notification, setNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};