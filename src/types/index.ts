export interface Product {
  id: string;
  name: string;
  price: number;
  promoPrice?: number;
  category: string;
  subCategory?: string;
  brand?: string;
  image: string;
  images?: string[];
  description?: string;
  specs: {
    processor?: string;
    gpu?: string;
    ram?: string;
    storage?: string;
    [key: string]: string | undefined;
  };
  isNew?: boolean;
  isPromo?: boolean;
  isBestSeller?: boolean;
  stock: number;
}

export interface FilterOption {
  id: string;
  name: string;
  type: 'checkbox' | 'range';
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  subCategories: { id: string; name: string; image: string }[];
  filters?: FilterOption[];
}

export interface Store {
  id: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
  map: string;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  desc: string;
}

export interface SiteConfig {
  logo: string;
  logoUrl?: string;
  primaryColor: string;
  taxRate: number;
  hero: {
    title: string;
    subtitle: string;
    image: string;
    videoUrl?: string;
    bgType?: 'image' | 'video';
  };
  contact: {
    phone: string;
    email: string;
    address: string;
  };
}

export interface Order {
  id: string;
  customerName: string;
  email?: string;
  address?: string;
  city?: string;
  phone?: string;
  paymentMethod?: string;
  date: string;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: {
    productId: string;
    quantity: number;
    name?: string;
    price?: number;
    image?: string;
  }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin' | 'user';
  status: 'active' | 'blocked';
  phone?: string;
  avatar?: string;
}
