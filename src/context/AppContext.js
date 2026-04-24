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

  // Helper to resolve high quality images via API if needed
  const resolveImageUrl = (name, currentUrl) => {
    if (!currentUrl || currentUrl.includes('placeholder') || currentUrl.includes('via.placeholder')) {
      // Use LoremFlickr for keyword based real images
      return `https://loremflickr.com/400/400/${encodeURIComponent(name.split(' ')[0])},food`;
    }
    return currentUrl;
  };

  // Enhance stock with better images on load
  useEffect(() => {
    const enhancedStock = initialStock.map(item => ({
      ...item,
      image: resolveImageUrl(item.name, item.image)
    }));
    setStock(enhancedStock);
  }, []);
  
  // Real-time stock simulation
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
    if (!currentUser) return false;

    const currentStockItem = stock.find(s => s.id === product.id);
    if (!currentStockItem || currentStockItem.stock <= 0) return true;
    
    let updatedCart = [...currentUser.cart];
    const existingItem = updatedCart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.cartQuantity += 1;
    } else {
      updatedCart.push({ ...product, cartQuantity: 1, packet: 1 });
    }

    const updatedUser = { ...currentUser, cart: updatedCart };
    setCurrentUser(updatedUser);
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
      if (item.id === productId) return { ...item, packet: packetNumber };
      return item;
    });
    const updatedUser = { ...currentUser, cart: updatedCart };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const checkout = (paymentMethod = 'Online') => {
    if (!currentUser || currentUser.cart.length === 0) return false;
    const newOrder = {
      id: "ord_" + Math.random().toString(36).substr(2, 9),
      items: [...currentUser.cart],
      date: new Date().toISOString(),
      status: 'In Transit',
      paymentMethod: paymentMethod,
      originalTotal: currentUser.cart.reduce((t, i) => t + (i.price * i.cartQuantity), 0),
      isOOCMocked: false,
      tipAmount: 0
    };
    const updatedUser = { ...currentUser, cart: [], orders: [newOrder, ...currentUser.orders] };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    return true;
  };

  const buyAgain = (orderId) => {
    if (!currentUser) return;
    const orderToReorder = currentUser.orders.find(o => o.id === orderId);
    if (!orderToReorder) return;
    let updatedCart = [...currentUser.cart];
    orderToReorder.items.forEach(orderItem => {
      const liveStockItem = stock.find(s => s.id === orderItem.id);
      if (!liveStockItem || liveStockItem.stock <= 0) return;
      const existingItem = updatedCart.find(cartItem => cartItem.id === orderItem.id);
      if (existingItem) existingItem.cartQuantity += orderItem.cartQuantity;
      else {
        const { isOOCAfterPayment, ...cleanItem } = orderItem;
        updatedCart.push({ ...cleanItem, packet: 1 });
      }
    });
    const updatedUser = { ...currentUser, cart: updatedCart };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    return true;
  };

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

  const simulatePostPaymentOOC = (orderId) => {
    if (!currentUser) return null;
    let simulatedResult = null;
    let updatedOrders = currentUser.orders.map(order => {
      if (order.id === orderId && !order.isOOCMocked && order.items.length > 0) {
        const randomIndex = Math.floor(Math.random() * order.items.length);
        const itemToOOC = order.items[randomIndex];
        let newItems = [...order.items];
        newItems[randomIndex] = { ...itemToOOC, isOOCAfterPayment: true };
        const refundAmount = itemToOOC.price * itemToOOC.cartQuantity;
        const newTotal = (order.revisedTotal || order.originalTotal) - refundAmount;
        simulatedResult = { itemName: itemToOOC.name, paymentMethod: order.paymentMethod, refundAmount, newTotal };
        return { ...order, items: newItems, status: order.paymentMethod === 'Online' ? 'Refunded' : 'Processing', revisedTotal: newTotal, isOOCMocked: true };
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
    const updatedOrders = currentUser.orders.map(order => order.id === orderId ? { ...order, status: 'Delivered' } : order);
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
      stock, users, currentUser, login, logout, addToCart, removeFromCart, updateCartQuantity,
      moveItemToPacket, checkout, buyAgain, simulatePostPaymentOOC, markOrderDelivered,
      addTipToOrder, productReviews, submitReview, isEssentialMode, setIsEssentialMode,
      isFragileColdEnabled, setIsFragileColdEnabled, theme, setTheme, resolveImageUrl
    }}>
      {children}
    </AppContext.Provider>
  );
};
