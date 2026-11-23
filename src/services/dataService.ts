import {
  Restaurant,
  Category,
  Product,
  RestaurantTheme,
  QrCode,
  SubscriptionPlan,
  Subscription,
  RestaurantMember,
  UserProfile,
  MenuView,
  Order,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_MEMBERS,
  INITIAL_PLANS,
  INITIAL_PRODUCTS,
  INITIAL_QR_CODES,
  INITIAL_RESTAURANTS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_THEMES,
  INITIAL_USERS,
} from './mockData';

const STORAGE_KEYS = {
  USERS: 'menuora_users',
  RESTAURANTS: 'menuora_restaurants',
  CATEGORIES: 'menuora_categories',
  PRODUCTS: 'menuora_products',
  THEMES: 'menuora_themes',
  QR_CODES: 'menuora_qr_codes',
  PLANS: 'menuora_plans',
  SUBSCRIPTIONS: 'menuora_subscriptions',
  MEMBERS: 'menuora_members',
  VIEWS: 'menuora_views',
  ORDERS: 'menuora_orders',
};

function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error loading ${key} from storage:`, e);
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

class DataService {
  // --- USERS & AUTH ---
  getUsers(): UserProfile[] {
    return getStored<UserProfile[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  }

  getUserById(id: string): UserProfile | undefined {
    return this.getUsers().find((u) => u.id === id);
  }

  getUserByEmail(email: string): UserProfile | undefined {
    return this.getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(user: Omit<UserProfile, 'id' | 'created_at'>): UserProfile {
    const users = this.getUsers();
    const newUser: UserProfile = {
      ...user,
      id: `user-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    users.push(newUser);
    setStored(STORAGE_KEYS.USERS, users);
    return newUser;
  }

  updateUser(id: string, updates: Partial<UserProfile>): UserProfile {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error('User not found');
    users[index] = { ...users[index], ...updates };
    setStored(STORAGE_KEYS.USERS, users);
    return users[index];
  }

  // --- RESTAURANTS ---
  getRestaurants(): Restaurant[] {
    return getStored<Restaurant[]>(STORAGE_KEYS.RESTAURANTS, INITIAL_RESTAURANTS);
  }

  getRestaurantBySlug(slug: string): Restaurant | undefined {
    return this.getRestaurants().find((r) => r.slug === slug);
  }

  getRestaurantById(id: string): Restaurant | undefined {
    return this.getRestaurants().find((r) => r.id === id);
  }

  getRestaurantsByOwner(ownerId: string): Restaurant[] {
    return this.getRestaurants().filter((r) => r.owner_id === ownerId);
  }

  createRestaurant(data: Omit<Restaurant, 'id' | 'created_at' | 'updated_at'>): Restaurant {
    const restaurants = this.getRestaurants();
    const newRest: Restaurant = {
      ...data,
      id: `rest-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    restaurants.push(newRest);
    setStored(STORAGE_KEYS.RESTAURANTS, restaurants);

    // Create default theme for this restaurant
    const themes = this.getAllThemes();
    themes[newRest.id] = {
      id: `theme-${newRest.id}`,
      restaurant_id: newRest.id,
      primary_color: '#E76F35',
      secondary_color: '#222222',
      font_family: 'Plus Jakarta Sans',
      card_style: 'modern',
      category_style: 'pill',
      theme_mode: 'light',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setStored(STORAGE_KEYS.THEMES, themes);

    // Create default QR Code
    const qrCodes = this.getAllQrCodes();
    qrCodes.push({
      id: `qr-${Date.now()}`,
      restaurant_id: newRest.id,
      label: 'QR Code Principal',
      qr_slug: newRest.slug,
      scan_count: 0,
      created_at: new Date().toISOString(),
    });
    setStored(STORAGE_KEYS.QR_CODES, qrCodes);

    // Create starter subscription
    const subs = getStored<Subscription[]>(STORAGE_KEYS.SUBSCRIPTIONS, INITIAL_SUBSCRIPTIONS);
    subs.push({
      id: `sub-${Date.now()}`,
      restaurant_id: newRest.id,
      plan_id: 'plan-pro',
      status: 'trial',
      start_date: new Date().toISOString(),
      expires_at: new Date(Date.now() + 14 * 86400000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setStored(STORAGE_KEYS.SUBSCRIPTIONS, subs);

    return newRest;
  }

  updateRestaurant(id: string, updates: Partial<Restaurant>): Restaurant {
    const restaurants = this.getRestaurants();
    const index = restaurants.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Restaurant not found');
    restaurants[index] = {
      ...restaurants[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    setStored(STORAGE_KEYS.RESTAURANTS, restaurants);
    return restaurants[index];
  }

  // --- CATEGORIES ---
  getCategories(restaurantId: string): Category[] {
    const all = getStored<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    return all
      .filter((c) => c.restaurant_id === restaurantId)
      .sort((a, b) => a.sort_order - b.sort_order);
  }

  createCategory(category: Omit<Category, 'id' | 'created_at'>): Category {
    const all = getStored<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const newCat: Category = {
      ...category,
      id: `cat-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    all.push(newCat);
    setStored(STORAGE_KEYS.CATEGORIES, all);
    return newCat;
  }

  updateCategory(id: string, updates: Partial<Category>): Category {
    const all = getStored<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const index = all.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Category not found');
    all[index] = { ...all[index], ...updates };
    setStored(STORAGE_KEYS.CATEGORIES, all);
    return all[index];
  }

  deleteCategory(id: string): void {
    const all = getStored<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const filtered = all.filter((c) => c.id !== id);
    setStored(STORAGE_KEYS.CATEGORIES, filtered);
  }

  // --- PRODUCTS ---
  getProducts(restaurantId: string): Product[] {
    const all = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    return all
      .filter((p) => p.restaurant_id === restaurantId)
      .sort((a, b) => a.sort_order - b.sort_order);
  }

  getProductById(id: string): Product | undefined {
    const all = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    return all.find((p) => p.id === id);
  }

  createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Product {
    const all = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const newProd: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    all.push(newProd);
    setStored(STORAGE_KEYS.PRODUCTS, all);
    return newProd;
  }

  updateProduct(id: string, updates: Partial<Product>): Product {
    const all = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const index = all.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Product not found');
    all[index] = {
      ...all[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    setStored(STORAGE_KEYS.PRODUCTS, all);
    return all[index];
  }

  deleteProduct(id: string): void {
    const all = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const filtered = all.filter((p) => p.id !== id);
    setStored(STORAGE_KEYS.PRODUCTS, filtered);
  }

  duplicateProduct(id: string): Product {
    const original = this.getProductById(id);
    if (!original) throw new Error('Product not found');
    const duplicate: Omit<Product, 'id' | 'created_at' | 'updated_at'> = {
      ...original,
      name: `${original.name} (Copie)`,
      sort_order: original.sort_order + 1,
      variants: original.variants?.map((v) => ({ ...v, id: `v-${Date.now()}-${Math.random()}` })),
      extras: original.extras?.map((e) => ({ ...e, id: `e-${Date.now()}-${Math.random()}` })),
    };
    return this.createProduct(duplicate);
  }

  // --- THEMES ---
  getAllThemes(): Record<string, RestaurantTheme> {
    return getStored<Record<string, RestaurantTheme>>(STORAGE_KEYS.THEMES, INITIAL_THEMES);
  }

  getTheme(restaurantId: string): RestaurantTheme {
    const themes = this.getAllThemes();
    if (!themes[restaurantId]) {
      themes[restaurantId] = {
        id: `theme-${restaurantId}`,
        restaurant_id: restaurantId,
        primary_color: '#E76F35',
        secondary_color: '#222222',
        font_family: 'Plus Jakarta Sans',
        card_style: 'modern',
        category_style: 'pill',
        theme_mode: 'light',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setStored(STORAGE_KEYS.THEMES, themes);
    }
    return themes[restaurantId];
  }

  updateTheme(restaurantId: string, updates: Partial<RestaurantTheme>): RestaurantTheme {
    const themes = this.getAllThemes();
    const current = this.getTheme(restaurantId);
    themes[restaurantId] = {
      ...current,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    setStored(STORAGE_KEYS.THEMES, themes);
    return themes[restaurantId];
  }

  // --- QR CODES ---
  getAllQrCodes(): QrCode[] {
    return getStored<QrCode[]>(STORAGE_KEYS.QR_CODES, INITIAL_QR_CODES);
  }

  getQrCodes(restaurantId: string): QrCode[] {
    return this.getAllQrCodes().filter((q) => q.restaurant_id === restaurantId);
  }

  createQrCode(qr: Omit<QrCode, 'id' | 'scan_count' | 'created_at'>): QrCode {
    const all = this.getAllQrCodes();
    const newQr: QrCode = {
      ...qr,
      id: `qr-${Date.now()}`,
      scan_count: 0,
      created_at: new Date().toISOString(),
    };
    all.push(newQr);
    setStored(STORAGE_KEYS.QR_CODES, all);
    return newQr;
  }

  incrementQrScan(restaurantSlug: string, tableNumber?: number): void {
    const restaurants = this.getRestaurants();
    const rest = restaurants.find((r) => r.slug === restaurantSlug);
    if (!rest) return;

    const allQrs = this.getAllQrCodes();
    const target = allQrs.find(
      (q) => q.restaurant_id === rest.id && (tableNumber ? q.table_number === tableNumber : !q.table_number)
    );
    if (target) {
      target.scan_count += 1;
      setStored(STORAGE_KEYS.QR_CODES, allQrs);
    }

    // Record view in analytics
    this.recordView(rest.id, tableNumber);
  }

  deleteQrCode(id: string): void {
    const all = this.getAllQrCodes().filter((q) => q.id !== id);
    setStored(STORAGE_KEYS.QR_CODES, all);
  }

  // --- ANALYTICS / VIEWS ---
  recordView(restaurantId: string, tableNumber?: number): void {
    const views = getStored<MenuView[]>(STORAGE_KEYS.VIEWS, []);
    views.push({
      id: `view-${Date.now()}`,
      restaurant_id: restaurantId,
      table_number: tableNumber,
      viewed_at: new Date().toISOString(),
      language: navigator.language || 'fr',
    });
    setStored(STORAGE_KEYS.VIEWS, views);
  }

  getAnalytics(restaurantId: string) {
    // Generate realistic historical daily views if empty
    const rawViews = getStored<MenuView[]>(STORAGE_KEYS.VIEWS, []);
    const restViews = rawViews.filter((v) => v.restaurant_id === restaurantId);

    // Synthesize 30-day realistic chart data
    const last30Days: { date: string; views: number; uniqueVisitors: number }[] = [];
    const now = new Date();

    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
      const isWeekend = d.getDay() === 5 || d.getDay() === 6; // Friday / Saturday in DZ
      const base = isWeekend ? 340 : 180;
      const variation = Math.floor(Math.sin(i * 0.5) * 50) + Math.floor(Math.random() * 40);
      const dayViews = Math.max(80, base + variation);
      const unique = Math.floor(dayViews * 0.78);

      last30Days.push({
        date: dateStr,
        views: dayViews,
        uniqueVisitors: unique,
      });
    }

    const totalViews = last30Days.reduce((acc, curr) => acc + curr.views, 0) + restViews.length;
    const todayViews = last30Days[last30Days.length - 1].views;

    const products = this.getProducts(restaurantId);
    const topProducts = products.slice(0, 5).map((p, idx) => ({
      name: p.name,
      views: Math.floor(totalViews * (0.35 / (idx + 1))),
      category: p.category_id,
      price: p.price,
    }));

    const categories = this.getCategories(restaurantId);
    const topCategories = categories.slice(0, 4).map((c, idx) => ({
      name: c.name,
      views: Math.floor(totalViews * (0.4 / (idx + 1))),
    }));

    return {
      totalViews,
      todayViews,
      chartData30Days: last30Days,
      chartData7Days: last30Days.slice(-7),
      topProducts,
      topCategories,
    };
  }

  // --- PLANS & SUBSCRIPTIONS ---
  getPlans(): SubscriptionPlan[] {
    return getStored<SubscriptionPlan[]>(STORAGE_KEYS.PLANS, INITIAL_PLANS);
  }

  updatePlan(id: string, updates: Partial<SubscriptionPlan>): SubscriptionPlan {
    const plans = this.getPlans();
    const index = plans.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Plan not found');
    plans[index] = { ...plans[index], ...updates };
    setStored(STORAGE_KEYS.PLANS, plans);
    return plans[index];
  }

  getSubscription(restaurantId: string): { subscription: Subscription; plan: SubscriptionPlan } {
    const subs = getStored<Subscription[]>(STORAGE_KEYS.SUBSCRIPTIONS, INITIAL_SUBSCRIPTIONS);
    const sub = subs.find((s) => s.restaurant_id === restaurantId) || {
      id: `sub-${restaurantId}`,
      restaurant_id: restaurantId,
      plan_id: 'plan-pro',
      status: 'active' as const,
      start_date: new Date().toISOString(),
      expires_at: new Date(Date.now() + 365 * 86400000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const plans = this.getPlans();
    const plan = plans.find((p) => p.id === sub.plan_id) || plans[1];
    return { subscription: sub, plan };
  }

  // --- TEAM MEMBERS ---
  getMembers(restaurantId: string): RestaurantMember[] {
    const all = getStored<RestaurantMember[]>(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
    return all.filter((m) => m.restaurant_id === restaurantId);
  }

  addMember(member: Omit<RestaurantMember, 'id' | 'created_at'>): RestaurantMember {
    const all = getStored<RestaurantMember[]>(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
    const newMember: RestaurantMember = {
      ...member,
      id: `mem-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    all.push(newMember);
    setStored(STORAGE_KEYS.MEMBERS, all);
    return newMember;
  }

  deleteMember(id: string): void {
    const all = getStored<RestaurantMember[]>(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
    const filtered = all.filter((m) => m.id !== id);
    setStored(STORAGE_KEYS.MEMBERS, filtered);
  }

  // --- ORDERS (Cart / WhatsApp Queue) ---
  getOrders(restaurantId: string): Order[] {
    const all = getStored<Order[]>(STORAGE_KEYS.ORDERS, []);
    return all.filter((o) => o.restaurant_id === restaurantId);
  }

  createOrder(order: Omit<Order, 'id' | 'created_at'>): Order {
    const all = getStored<Order[]>(STORAGE_KEYS.ORDERS, []);
    const newOrder: Order = {
      ...order,
      id: `ord-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    all.push(newOrder);
    setStored(STORAGE_KEYS.ORDERS, all);
    return newOrder;
  }

  updateOrderStatus(orderId: string, status: Order['status']): void {
    const all = getStored<Order[]>(STORAGE_KEYS.ORDERS, []);
    const target = all.find((o) => o.id === orderId);
    if (target) {
      target.status = status;
      setStored(STORAGE_KEYS.ORDERS, all);
    }
  }

  // --- SUPER ADMIN GLOBAL STATS ---
  getSuperAdminStats() {
    const restaurants = this.getRestaurants();
    const users = this.getUsers();
    const activeRest = restaurants.filter((r) => r.status === 'active').length;
    const suspendedRest = restaurants.filter((r) => r.status === 'suspended').length;
    const totalViews = restaurants.reduce((acc, r) => acc + this.getAnalytics(r.id).totalViews, 0);

    return {
      totalRestaurants: restaurants.length,
      activeRestaurants: activeRest,
      suspendedRestaurants: suspendedRest,
      totalUsers: users.length,
      totalViews,
      activeSubscriptions: restaurants.length, // trial or paid
    };
  }

  // --- RESET TO DEFAULTS (For testing) ---
  resetToDefaults(): void {
    localStorage.clear();
    setStored(STORAGE_KEYS.USERS, INITIAL_USERS);
    setStored(STORAGE_KEYS.RESTAURANTS, INITIAL_RESTAURANTS);
    setStored(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    setStored(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    setStored(STORAGE_KEYS.THEMES, INITIAL_THEMES);
    setStored(STORAGE_KEYS.QR_CODES, INITIAL_QR_CODES);
    setStored(STORAGE_KEYS.PLANS, INITIAL_PLANS);
    setStored(STORAGE_KEYS.SUBSCRIPTIONS, INITIAL_SUBSCRIPTIONS);
    setStored(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
    setStored(STORAGE_KEYS.VIEWS, []);
    setStored(STORAGE_KEYS.ORDERS, []);
  }
}

export const dataService = new DataService();

