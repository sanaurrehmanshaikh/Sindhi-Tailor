import { Customer, MeasurementProfile, ShopSettings, TailorOrder, TailorUser } from '../types';
import { INITIAL_CUSTOMERS, INITIAL_ORDERS, INITIAL_PROFILES, INITIAL_SHOP_SETTINGS } from '../data/sampleData';

const STORAGE_KEYS = {
  SETTINGS: 'sindhi_tailor_settings',
  CUSTOMERS: 'sindhi_tailor_customers',
  PROFILES: 'sindhi_tailor_profiles',
  ORDERS: 'sindhi_tailor_orders',
  PENDING_SYNC: 'sindhi_tailor_pending_sync',
  IS_ONLINE: 'sindhi_tailor_is_online',
  USER_SESSION: 'sindhi_tailor_user_session',
};

export class StorageService {
  static getUserSession(): TailorUser | null {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
    if (!raw) {
      // By default create an active session for the shop master
      const defaultOwner: TailorUser = {
        id: 'usr-master',
        name: 'استاد درزي',
        phone: '0300-1234567',
        role: 'master',
        pin: '1234',
      };
      localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(defaultOwner));
      return defaultOwner;
    }
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.name === 'string' && (parsed.name.includes('علي بخش') || parsed.name.includes('چانڊيو'))) {
        parsed.name = 'استاد درزي';
        localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(parsed));
      }
      return parsed;
    } catch {
      return null;
    }
  }

  static setUserSession(user: TailorUser | null) {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
    } else {
      localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(user));
    }
  }
  static getSettings(): ShopSettings {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SHOP_SETTINGS));
      return INITIAL_SHOP_SETTINGS;
    }
    try {
      const parsed = JSON.parse(raw);
      // Remove any previously stored references to Sachal Sarmast or Ali Bux
      if (
        parsed && 
        (
          (typeof parsed.shopName === 'string' && parsed.shopName.includes('سچل')) ||
          (typeof parsed.ownerName === 'string' && parsed.ownerName.includes('علي بخش'))
        )
      ) {
        parsed.shopName = 'سنڌ جينٽس ٽيلرز';
        parsed.ownerName = 'استاد درزي';
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsed));
      }
      return parsed;
    } catch {
      return INITIAL_SHOP_SETTINGS;
    }
  }

  static saveSettings(settings: ShopSettings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  static getCustomers(): Customer[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify([]));
      return [];
    }
    try {
      const parsed = JSON.parse(raw);
      // Purge dummy sample customers if present
      if (Array.isArray(parsed) && parsed.some(c => typeof c.id === 'string' && c.id.startsWith('cust-'))) {
        localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify([]));
        return [];
      }
      return parsed;
    } catch {
      return [];
    }
  }

  static saveCustomers(customers: Customer[]) {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }

  static addCustomer(customer: Customer): Customer {
    const customers = this.getCustomers();
    customers.unshift(customer);
    this.saveCustomers(customers);
    return customer;
  }

  static getProfiles(): MeasurementProfile[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify([]));
      return [];
    }
    try {
      const parsed = JSON.parse(raw);
      // Purge dummy sample profiles if present
      if (Array.isArray(parsed) && parsed.some(p => typeof p.id === 'string' && p.id.startsWith('meas-'))) {
        localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify([]));
        return [];
      }
      return parsed;
    } catch {
      return [];
    }
  }

  static saveProfiles(profiles: MeasurementProfile[]) {
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
  }

  static addProfile(profile: MeasurementProfile): MeasurementProfile {
    const profiles = this.getProfiles();
    profiles.unshift(profile);
    this.saveProfiles(profiles);
    return profile;
  }

  static updateProfile(profile: MeasurementProfile) {
    const profiles = this.getProfiles().map(p => p.id === profile.id ? profile : p);
    this.saveProfiles(profiles);
  }

  static getOrders(): TailorOrder[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
      return [];
    }
    try {
      const parsed = JSON.parse(raw);
      // Purge dummy sample orders (ord-101, ord-102 etc.) to give a clean empty slate
      if (Array.isArray(parsed) && parsed.some(o => typeof o.id === 'string' && o.id.startsWith('ord-10'))) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
        return [];
      }
      return parsed;
    } catch {
      return [];
    }
  }

  static saveOrders(orders: TailorOrder[]) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }

  static addOrder(order: TailorOrder, isOnline: boolean): TailorOrder {
    const orders = this.getOrders();
    const newOrder = {
      ...order,
      syncedWithCloud: isOnline,
    };
    orders.unshift(newOrder);
    this.saveOrders(orders);

    // Update customer's total order count
    const customers = this.getCustomers().map(c => {
      if (c.id === order.customerId) {
        return { ...c, totalOrdersCount: (c.totalOrdersCount || 0) + 1 };
      }
      return c;
    });
    this.saveCustomers(customers);

    return newOrder;
  }

  static updateOrderStatus(orderId: string, status: TailorOrder['status'], isOnline: boolean): TailorOrder[] {
    const orders = this.getOrders().map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status,
          syncedWithCloud: isOnline ? true : false,
        };
      }
      return o;
    });
    this.saveOrders(orders);
    return orders;
  }

  static updateOrder(order: TailorOrder, isOnline: boolean): TailorOrder[] {
    const orders = this.getOrders().map(o => o.id === order.id ? { ...order, syncedWithCloud: isOnline } : o);
    this.saveOrders(orders);
    return orders;
  }

  static deleteOrder(orderId: string): TailorOrder[] {
    const orders = this.getOrders().filter(o => o.id !== orderId);
    this.saveOrders(orders);
    return orders;
  }

  static syncAllUnsynced(): TailorOrder[] {
    const orders = this.getOrders().map(o => ({ ...o, syncedWithCloud: true }));
    this.saveOrders(orders);
    return orders;
  }

  static clearAllToFresh(customShop?: Partial<ShopSettings>) {
    const freshShop: ShopSettings = {
      shopName: customShop?.shopName || 'منهنجو نئون درزي دڪان',
      ownerName: customShop?.ownerName || 'درزي ماسٽر',
      phone: customShop?.phone || '',
      whatsappNumber: customShop?.whatsappNumber || '',
      address: customShop?.address || '',
      city: customShop?.city || 'سنڌ، پاڪستان',
      termsAndConditions: '30 ڏينهن اندر ڪپڙا کڻڻ لازمي آهن. تيار ٿيل ڪپڙن جي ذميواري 30 ڏينهن تائين هوندي.',
      currency: 'روپيا (PKR)',
    };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(freshShop));
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
  }

  static resetSampleData() {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SHOP_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(INITIAL_PROFILES));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  }
}
