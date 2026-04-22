import React, { createContext, useState, useEffect, useContext } from 'react';
import initialStock from '../data/stock.json';
import initialUsers from '../data/users.json';

export const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [stock, setStock] = useState(initialStock);
  const [users, setUsers] = useState(initialUsers);
  const [currentUser, setCurrentUser] = useState(null);
  
  // App Toggles & Theme
  const [isEssentialMode, setIsEssentialMode] = useState(false);
  const [isFragileColdEnabled, setIsFragileColdEnabled] = useState(false);
  const [theme, setTheme] = useState('light');
  
  // Reviews State
  const [productReviews, setProductReviews] = useState([]);
  
  // Real-time stock simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setStock(currentStock => {
        return currentStock.map(item => {
          // Randomly reduce stock or make out of stock
          if (Math.random() > 0.8) {
            const reduction = Math.floor(Math.random() * 3);
            return { ...item, stock: Math.max(0, item.stock - reduction) };
          }
          return item;
        });
      });
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addToCart = (product) => {
    if (!currentUser) return false; // Needs login

    const currentStockItem = stock.find(s => s.id === product.id);
    if (!currentStockItem || currentStockItem.stock <= 0) return true; // Handled but out of stock
    
    let updatedCart = [...currentUser.cart];
    const existingItem = updatedCart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.cartQuantity += 1;
    } else {
      updatedCart.push({ ...product, cartQuantity: 1, packet: 1 });
    }

    const updatedUser = { ...currentUser, cart: updatedCart };
    setCurrentUser(updatedUser);
    
    // Update users array
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    return true;
  };

  const removeFromCart = (productId) => {
    if (!currentUser) return;
    
    let updatedCart = currentUser.cart.filter(item => item.id !== productId);
    const updatedUser = { ...currentUser, cart: updatedCart };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
  };
  
  const updateCartQuantity = (productId, delta) => {
    if (!currentUser) return;
    
    let updatedCart = [...currentUser.cart];
    const existingItem = updatedCart.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.cartQuantity += delta;
      if (existingItem.cartQuantity <= 0) {
         updatedCart = updatedCart.filter(item => item.id !== productId);
      }
    }
    
    const updatedUser = { ...currentUser, cart: updatedCart };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const moveItemToPacket = (productId, packetNumber) => {
    if (!currentUser) return;
    
    let updatedCart = currentUser.cart.map(item => {
      if (item.id === productId) {
        if (packetNumber === 2 && !item.isCold) return item; // Only cold items in packet 2
        return { ...item, packet: packetNumber };
      }
      return item;
    });

    const updatedUser = { ...currentUser, cart: updatedCart };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const checkout = (paymentMethod = 'Online') => {
    if (!currentUser || currentUser.cart.length === 0) return false;
    
    // Process order
    const newOrder = {
      id: "ord_" + Date.now(),
      items: [...currentUser.cart],
      date: new Date().toISOString(),
      status: 'Processing', // Start of refund pipeline mock if needed
      paymentMethod: paymentMethod,
      originalTotal: currentUser.cart.reduce((t, i) => t + (i.price * i.cartQuantity), 0),
      isOOCMocked: false
    };
    
    const updatedUser = { 
      ...currentUser, 
      cart: [], 
      orders: [newOrder, ...currentUser.orders] 
    };
    
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    return true;
  };

  const buyAgain = (orderId) => {
    if (!currentUser) return;
    const orderToReorder = currentUser.orders.find(o => o.id === orderId);
    if (!orderToReorder) return;

    let updatedCart = [...currentUser.cart];

    // Add each item from the old order to the cart
    orderToReorder.items.forEach(orderItem => {
      // Don't add items that are globally out of stock
      const liveStockItem = stock.find(s => s.id === orderItem.id);
      if (!liveStockItem || liveStockItem.stock <= 0) return;

      const existingItem = updatedCart.find(cartItem => cartItem.id === orderItem.id);
      if (existingItem) {
        existingItem.cartQuantity += orderItem.cartQuantity;
      } else {
        // Strip out order-specific flags when adding to cart
        const { isOOCAfterPayment, ...cleanItem } = orderItem;
        updatedCart.push({ ...cleanItem, packet: 1 });
      }
    });

    const updatedUser = { ...currentUser, cart: updatedCart };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    return true;
  };

  const submitReview = (productId, rating, comment) => {
    const newReview = {
      id: "rev_" + Date.now(),
      productId,
      userId: currentUser?.id,
      userName: currentUser?.name || "Anonymous",
      rating,
      comment,
      date: new Date().toISOString()
    };
    setProductReviews([...productReviews, newReview]);
  };

  const simulatePostPaymentOOC = (orderId) => {
    if (!currentUser) return null;
    
    let simulatedResult = null;
    let updatedOrders = currentUser.orders.map(order => {
      if (order.id === orderId && !order.isOOCMocked && order.items.length > 0) {
        // Pick a random item to be OOC
        const randomIndex = Math.floor(Math.random() * order.items.length);
        const itemToOOC = order.items[randomIndex];
        
        let newItems = [...order.items];
        newItems[randomIndex] = { ...itemToOOC, isOOCAfterPayment: true };
        
        const refundAmount = itemToOOC.price * itemToOOC.cartQuantity;
        const newTotal = order.originalTotal - refundAmount;
        
        simulatedResult = {
          itemName: itemToOOC.name,
          paymentMethod: order.paymentMethod,
          refundAmount: refundAmount,
          newTotal: newTotal
        };

        return {
          ...order,
          items: newItems,
          status: order.paymentMethod === 'Online' ? 'Refund Initiated' : 'Processing',
          revisedTotal: newTotal,
          isOOCMocked: true
        };
      }
      return order;
    });

    if (simulatedResult) {
      const updatedUser = { ...currentUser, orders: updatedOrders };
      setCurrentUser(updatedUser);
      setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    }
    
    return simulatedResult;
  };

  const markOrderDelivered = (orderId) => {
    if (!currentUser) return;
    const updatedOrders = currentUser.orders.map(order => 
      order.id === orderId ? { ...order, status: 'Delivered' } : order
    );
    const updatedUser = { ...currentUser, orders: updatedOrders };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const addTipToOrder = (orderId, tipAmount) => {
    if (!currentUser) return;
    const updatedOrders = currentUser.orders.map(order => {
      if (order.id === orderId) {
        const currentTip = order.tipAmount || 0;
        const baseTotal = order.revisedTotal || order.originalTotal;
        // Calculate new total by removing old tip and adding new tip
        const newTotal = baseTotal - currentTip + tipAmount;
        return { ...order, tipAmount, revisedTotal: newTotal };
      }
      return order;
    });
    const updatedUser = { ...currentUser, orders: updatedOrders };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  return (
    <AppContext.Provider value={{
      stock,
      users,
      currentUser,
      login,
      logout,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      moveItemToPacket,
      checkout,
      buyAgain,
      simulatePostPaymentOOC,
      markOrderDelivered,
      addTipToOrder,
      productReviews,
      submitReview,
      isEssentialMode,
      setIsEssentialMode,
      isFragileColdEnabled,
      setIsFragileColdEnabled,
      theme,
      setTheme
    }}>
      {children}
    </AppContext.Provider>
  );
};
