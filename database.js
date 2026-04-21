/**
 * 📊 Mock Database
 * Scalable data layer that mirrors a real database
 * All screens import from here instead of hardcoding data
 */

// ══════════════════════════════════════════════════════════════
// PRODUCTS DATABASE
// ══════════════════════════════════════════════════════════════
export const db = {
  // Products catalog with inventory management
  products: [
    {
      id: '1',
      name: 'Amul Full Cream Milk',
      category: 'Dairy',
      qty: '500ml',
      price: 30,
      originalPrice: 35,
      emoji: '🥛',
      lowStock: true,
      inStock: 2,
      maxStock: 10,
      description: 'Fresh full cream milk',
      tags: ['dairy', 'milk', 'essential'],
    },
    {
      id: '2',
      name: 'Banana (Elaichi)',
      category: 'Fruits & Veg',
      qty: '250g',
      price: 29,
      originalPrice: 35,
      emoji: '🍌',
      lowStock: false,
      inStock: 12,
      maxStock: 20,
      description: 'Fresh bananas',
      tags: ['fruits', 'fresh', 'healthy'],
    },
    {
      id: '3',
      name: 'Britannia Wheat Bread',
      category: 'Snacks',
      qty: '400g',
      price: 45,
      originalPrice: 50,
      emoji: '🍞',
      lowStock: true,
      inStock: 1,
      maxStock: 15,
      description: 'Whole wheat bread',
      tags: ['bread', 'snacks', 'wheat'],
    },
    {
      id: '4',
      name: 'Farm Fresh Eggs',
      category: 'Dairy',
      qty: '6 pcs',
      price: 72,
      originalPrice: 80,
      emoji: '🥚',
      lowStock: false,
      inStock: 8,
      maxStock: 25,
      description: 'Fresh organic eggs',
      tags: ['eggs', 'dairy', 'protein'],
    },
    {
      id: '5',
      name: 'Amul Cheese Slices',
      category: 'Dairy',
      qty: '200g',
      price: 110,
      originalPrice: 130,
      emoji: '🧀',
      lowStock: false,
      inStock: 5,
      maxStock: 12,
      description: 'Processed cheese',
      tags: ['cheese', 'dairy', 'cold'],
    },
    {
      id: '6',
      name: 'Coca-Cola Zero',
      category: 'Beverages',
      qty: '750ml',
      price: 55,
      originalPrice: 60,
      emoji: '🥤',
      lowStock: true,
      inStock: 3,
      maxStock: 20,
      description: 'Zero sugar cola',
      tags: ['beverages', 'drinks', 'cold'],
    },
  ],

  // Smart swap suggestions for out-of-stock items
  swaps: {
    '1': [
      {
        id: 's1',
        emoji: '🥛',
        name: 'Amul Toned Milk 500ml',
        price: 28,
        tag: 'Similar nutrition',
        description: 'Lower fat content',
      },
      {
        id: 's2',
        emoji: '🧋',
        name: 'Mother Dairy Full Cream 500ml',
        price: 32,
        tag: 'Same fat content',
        description: 'Alternative brand',
      },
      {
        id: 's3',
        emoji: '🫙',
        name: 'Nestle UHT Milk 200ml ×2',
        price: 38,
        tag: 'No refrigeration',
        description: 'Long shelf life',
      },
    ],
    '3': [
      {
        id: 's4',
        emoji: '🍞',
        name: 'Modern Harvest Brown 400g',
        price: 42,
        tag: 'Same wheat',
        description: 'Healthier option',
      },
      {
        id: 's5',
        emoji: '🥖',
        name: 'Bonn Multi Grain 400g',
        price: 48,
        tag: 'Higher fiber',
        description: 'More nutritious',
      },
      {
        id: 's6',
        emoji: '🫓',
        name: 'Britannia White Bread 400g',
        price: 38,
        tag: 'In stock now',
        description: 'Available immediately',
      },
    ],
    '6': [
      {
        id: 's7',
        emoji: '🥤',
        name: 'Pepsi Black 750ml',
        price: 50,
        tag: 'Zero sugar',
        description: 'Similar taste',
      },
      {
        id: 's8',
        emoji: '🫗',
        name: 'Thums Up Charged 750ml',
        price: 48,
        tag: 'Strong cola',
        description: 'More caffeine',
      },
      {
        id: 's9',
        emoji: '💧',
        name: 'Kinley Soda 750ml',
        price: 20,
        tag: 'Plain sparkling',
        description: 'Budget option',
      },
    ],
  },

  // Categories for filtering
  categories: [
    { id: 'all', name: 'All', icon: '📦' },
    { id: 'fruits_veg', name: 'Fruits & Veg', icon: '🥕' },
    { id: 'dairy', name: 'Dairy', icon: '🥛' },
    { id: 'snacks', name: 'Snacks', icon: '🍪' },
    { id: 'beverages', name: 'Beverages', icon: '🥤' },
    { id: 'personal_care', name: 'Personal Care', icon: '🧴' },
  ],

  // Cart items
  cartItems: {
    cold: [
      { id: 'c1', emoji: '🧀', name: 'Amul Cheese Slices 200g', qty: 1, price: 110, isCold: true },
      { id: 'c2', emoji: '🥛', name: 'Amul Butter 500g', qty: 1, price: 60, isCold: true },
      { id: 'c3', emoji: '🍦', name: "Kwality Wall's Cone", qty: 2, price: 40, isCold: true },
    ],
    regular: [
      { id: 'r1', emoji: '🍌', name: 'Banana (Elaichi) 250g', qty: 1, price: 29, isCold: false },
      { id: 'r2', emoji: '🥚', name: 'Farm Fresh Eggs', qty: 1, price: 72, isCold: false },
      { id: 'r3', emoji: '🍞', name: 'Brown Bread 400g', qty: 1, price: 45, isCold: false },
    ],
  },

  // Delivery tracking data
  deliveries: {
    1: {
      id: 'BAG-001',
      orderId: 'BL2891',
      driver: 'Ravi Kumar',
      phone: '9876543210',
      eta: 4,
      etaUnit: 'mins',
      vehicle: '🛵 Bike',
      status: 'out_for_delivery',
      steps: [
        { label: 'Order Placed', time: '9:38 AM', state: 'done' },
        { label: 'Store Packed', time: '9:42 AM', state: 'done' },
        { label: 'Out for Delivery', time: '9:46 AM · 0.4 km away', state: 'active' },
        { label: 'Delivered', time: 'Est. 9:50 AM', state: 'pending' },
      ],
      items: [
        { emoji: '🍌', name: 'Banana (Elaichi)', status: 'Packed', statusType: 'done' },
        { emoji: '🥚', name: 'Farm Fresh Eggs', status: 'Packed', statusType: 'done' },
        { emoji: '🍞', name: 'Brown Bread', status: 'Packed', statusType: 'done' },
      ],
    },
    2: {
      id: 'BAG-002',
      orderId: 'BL2891',
      driver: 'Suresh Yadav',
      phone: '9876543211',
      eta: 11,
      etaUnit: 'mins',
      vehicle: '🛵 Bike',
      status: 'packing',
      steps: [
        { label: 'Order Placed', time: '9:38 AM', state: 'done' },
        { label: 'Being Packed (Cold Storage)', time: '9:45 AM', state: 'active' },
        { label: 'Out for Delivery', time: 'Est. 9:50', state: 'pending' },
        { label: 'Delivered', time: 'Est. 9:57', state: 'pending' },
      ],
      items: [
        { emoji: '🧀', name: 'Amul Cheese Slices', status: 'Packing', statusType: 'packing' },
        { emoji: '🥛', name: 'Amul Butter', status: 'Packing', statusType: 'packing' },
        { emoji: '🍦', name: "Kwality Wall's Cone", status: 'Packing', statusType: 'packing' },
      ],
    },
  },

  // Orders history with refund tracking
  orders: [
    {
      id: 'BL2773',
      date: 'Apr 15, 2025',
      itemCount: 3,
      items: '🍞 Bread · 🥛 Amul Dahi · 🥤 Sprite 750ml',
      total: 183,
      status: 'refund',
      statusLabel: 'Refund Pending',
      refundAmount: 183,
      refundReason: 'Missing items refund',
      refundStatus: {
        initiated: { done: true, date: 'Apr 15' },
        approved: { done: true, date: 'Apr 15', time: '2 hours' },
        processing: { done: false, date: null, eta: '1–2 working days' },
        credited: { done: false, date: null, eta: 'Apr 17–18' },
      },
    },
    {
      id: 'BL2891',
      date: 'Apr 20, 2025',
      itemCount: 6,
      items: '🍌 Banana · 🥚 Eggs · 🧀 Cheese · +3 more',
      total: 398,
      status: 'delivered',
      statusLabel: 'Delivered',
      deliveredAt: '9:50 AM',
    },
    {
      id: 'BL2610',
      date: 'Apr 12, 2025',
      itemCount: 4,
      items: '🧴 Shampoo · 🪥 Toothbrush · 🧼 Soap · +1',
      total: 210,
      status: 'delivered',
      statusLabel: 'Delivered',
      deliveredAt: '10:30 AM',
    },
  ],

  // Delivery timeline steps
  refundPipeline: [
    {
      icon: '✓',
      label: 'Refund Initiated',
      sub: 'Apr 15 · Your request was confirmed',
      state: 'done',
    },
    {
      icon: '✓',
      label: 'Blinkit Approved',
      sub: 'Apr 15 · Approved within 2 hours',
      state: 'done',
    },
    {
      icon: '⟳',
      label: 'Bank Processing',
      sub: 'In progress · Typically 1–2 working days',
      state: 'active',
    },
    {
      icon: '○',
      label: 'Amount Credited',
      sub: 'Est. Apr 17–18',
      state: 'pending',
    },
  ],

  // User delivery preferences
  userPreferences: {
    location: 'Malviya Nagar',
    essentialsMode: false,
    separateColdItems: true,
    defaultColdSeparation: true,
  },

  // Helper function to get product by ID
  getProductById: function (id) {
    return this.products.find(p => p.id === id);
  },

  // Helper function to get swap suggestions
  getSwaps: function (productId) {
    return this.swaps[productId] || [];
  },

  // Helper function to get order by ID
  getOrderById: function (id) {
    return this.orders.find(o => o.id === id);
  },

  // Helper function to get delivery by bag ID
  getDeliveryByBag: function (bagId) {
    return this.deliveries[bagId];
  },

  // Helper function to filter products by category
  getProductsByCategory: function (categoryId) {
    if (categoryId === 'all') return this.products;
    return this.products.filter(p => p.category.toLowerCase().replace(/ /g, '_') === categoryId);
  },

  // Calculate cart totals
  getCartTotals: function () {
    const allItems = [...this.cartItems.cold, ...this.cartItems.regular];
    const itemsTotal = allItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const deliveryFee = 25;
    const platformFee = 5;
    const total = itemsTotal + deliveryFee + platformFee;

    return {
      itemsTotal,
      deliveryFee,
      platformFee,
      total,
      itemCount: allItems.length,
    };
  },

  // Get low stock products
  getLowStockProducts: function () {
    return this.products.filter(p => p.lowStock);
  },

  // Update product stock (simulating purchase)
  updateProductStock: function (productId, quantity) {
    const product = this.getProductById(productId);
    if (product) {
      product.inStock -= quantity;
      if (product.inStock <= 2) {
        product.lowStock = true;
      }
    }
  },
};

export default db;
