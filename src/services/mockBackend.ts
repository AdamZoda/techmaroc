import { Product, Category, Order, User, SiteConfig, Store, Partner } from '../types';

// Initial Data
const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'PC Gamer Ultra Instinct',
    price: 15999,
    promoPrice: 14500,
    category: 'PC Gamer',
    subCategory: 'PC Gamer Extreme',
    brand: 'TechMaroc',
    image: 'https://picsum.photos/seed/pc1/400/400',
    images: [
      'https://picsum.photos/seed/pc1/400/400',
      'https://picsum.photos/seed/pc1-2/400/400',
      'https://picsum.photos/seed/pc1-3/400/400'
    ],
    description: 'Le PC Gamer Ultra Instinct est conçu pour les joueurs exigeants qui ne font aucun compromis. Équipé du dernier processeur Intel Core i9 et de la puissante RTX 4090, il offre des performances inégalées en 4K.',
    specs: {
      processor: 'Intel Core i9-13900K',
      gpu: 'RTX 4090 24GB',
      ram: '64GB DDR5',
      storage: '2TB NVMe SSD'
    },
    isNew: true,
    isBestSeller: true,
    stock: 5
  },
  {
    id: '2',
    name: 'PC Gamer Starter Pack',
    price: 8500,
    category: 'PC Gamer',
    subCategory: 'PC Gamer Starter',
    brand: 'TechMaroc',
    image: 'https://picsum.photos/seed/pc2/400/400',
    description: 'Idéal pour débuter dans le gaming, ce PC offre un excellent rapport qualité/prix. Il permet de jouer à tous les jeux compétitifs en 1080p avec fluidité.',
    specs: {
      processor: 'Intel Core i5-12400F',
      gpu: 'RTX 3060 12GB',
      ram: '16GB DDR4',
      storage: '1TB NVMe SSD'
    },
    isBestSeller: true,
    stock: 12
  },
  {
    id: '3',
    name: 'PC Gamer Pro Max',
    price: 22000,
    category: 'PC Gamer',
    subCategory: 'PC Gamer Pro',
    brand: 'TechMaroc',
    image: 'https://picsum.photos/seed/pc3/400/400',
    specs: {
      processor: 'AMD Ryzen 9 7950X',
      gpu: 'RX 7900 XTX',
      ram: '32GB DDR5',
      storage: '2TB NVMe Gen4'
    },
    isPromo: true,
    isBestSeller: true,
    stock: 3
  },
  {
    id: '4',
    name: 'PC Gamer White Edition',
    price: 12500,
    category: 'PC Gamer',
    subCategory: 'PC Gamer Pro',
    brand: 'TechMaroc',
    image: 'https://picsum.photos/seed/pc4/400/400',
    specs: {
      processor: 'Intel Core i7-13700K',
      gpu: 'RTX 4070 12GB',
      ram: '32GB DDR5',
      storage: '1TB NVMe SSD'
    },
    isBestSeller: true,
    stock: 8
  },
  {
    id: '5',
    name: 'MSI GeForce RTX 4060 Ti',
    price: 4500,
    category: 'COMPOSANTS',
    subCategory: 'Cartes Graphiques',
    brand: 'MSI',
    image: 'https://picsum.photos/seed/gpu1/400/400',
    specs: {
      processor: '',
      gpu: 'RTX 4060 Ti',
      ram: '8GB GDDR6',
      storage: ''
    },
    isBestSeller: true,
    stock: 15
  },
  {
    id: '6',
    name: 'AMD Ryzen 7 7800X3D',
    price: 4200,
    category: 'COMPOSANTS',
    subCategory: 'Processeurs',
    brand: 'AMD',
    image: 'https://picsum.photos/seed/cpu1/400/400',
    specs: {
      processor: 'Ryzen 7 7800X3D',
      gpu: '',
      ram: '',
      storage: ''
    },
    isBestSeller: true,
    stock: 20
  },
  {
    id: '7',
    name: 'Samsung Odyssey G7',
    price: 6500,
    category: 'ÉCRANS & MONITEURS PC',
    subCategory: 'Écrans Gamer',
    brand: 'Samsung',
    image: 'https://picsum.photos/seed/monitor1/400/400',
    specs: {
      processor: '',
      gpu: '',
      ram: '',
      storage: ''
    },
    isBestSeller: true,
    stock: 7
  },
  {
    id: '8',
    name: 'Logitech G Pro X Superlight',
    price: 1500,
    category: 'PÉRIPHÉRIQUE PC',
    subCategory: 'Souris Gamer',
    brand: 'Logitech',
    image: 'https://picsum.photos/seed/mouse1/400/400',
    specs: {
      processor: '',
      gpu: '',
      ram: '',
      storage: ''
    },
    isBestSeller: true,
    stock: 25
  },
  {
    id: '9',
    name: 'Corsair K70 RGB PRO',
    price: 1800,
    promoPrice: 1499,
    category: 'PÉRIPHÉRIQUE PC',
    subCategory: 'Claviers Gamer',
    brand: 'Corsair',
    image: 'https://picsum.photos/seed/kb1/400/400',
    specs: { processor: '', gpu: '', ram: '', storage: '' },
    isNew: true,
    isPromo: true,
    stock: 10
  },
  {
    id: '10',
    name: 'Razer BlackShark V2',
    price: 1200,
    category: 'PÉRIPHÉRIQUE PC',
    subCategory: 'Casques Gamer',
    brand: 'Razer',
    image: 'https://picsum.photos/seed/headset1/400/400',
    specs: { processor: '', gpu: '', ram: '', storage: '' },
    isNew: true,
    stock: 20
  },
  {
    id: '11',
    name: 'ASUS ROG Strix G16',
    price: 18500,
    promoPrice: 16999,
    category: 'PC & ORDINATEUR PORTABLE',
    subCategory: 'PC Portable Gamer',
    brand: 'ASUS',
    image: 'https://picsum.photos/seed/laptop1/400/400',
    specs: { processor: 'i7-13650HX', gpu: 'RTX 4060', ram: '16GB', storage: '512GB SSD' },
    isNew: true,
    isPromo: true,
    stock: 4
  },
  {
    id: '12',
    name: 'PlayStation 5 Slim',
    price: 6500,
    category: 'CONSOLES & JEUX & VR',
    subCategory: 'Consoles',
    brand: 'Sony',
    image: 'https://picsum.photos/seed/ps5/400/400',
    specs: { processor: '', gpu: '', ram: '', storage: '1TB' },
    isBestSeller: true,
    stock: 15
  }
];

const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'pc-gamer',
    name: 'PC Gamer',
    icon: 'Monitor',
    subCategories: [
      { id: 'starter', name: 'PC Gamer Starter', image: 'https://picsum.photos/seed/cat1/300/200' },
      { id: 'pro', name: 'PC Gamer Pro', image: 'https://picsum.photos/seed/cat2/300/200' },
      { id: 'extreme', name: 'PC Gamer Extreme', image: 'https://picsum.photos/seed/cat3/300/200' },
      { id: 'ultra', name: 'Ultra PC', image: 'https://picsum.photos/seed/cat4/300/200' }
    ],
    filters: [
      { id: 'price', name: 'Prix', type: 'range', min: 0, max: 50000, step: 1000 },
      { id: 'processor', name: 'Processeur', type: 'checkbox', options: ['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9'] },
      { id: 'gpu', name: 'Carte Graphique', type: 'checkbox', options: ['RTX 3050', 'RTX 3060', 'RTX 4060', 'RTX 4070', 'RTX 4080', 'RTX 4090', 'RX 7600', 'RX 7900 XTX'] },
      { id: 'ram', name: 'RAM', type: 'checkbox', options: ['8GB', '16GB', '32GB', '64GB'] }
    ]
  },
  {
    id: 'components',
    name: 'COMPOSANTS',
    icon: 'Cpu',
    subCategories: [
      { id: 'cpu', name: 'Processeurs', image: 'https://picsum.photos/seed/cpu/300/200' },
      { id: 'gpu', name: 'Cartes Graphiques', image: 'https://picsum.photos/seed/gpu/300/200' },
      { id: 'ram', name: 'Mémoire RAM', image: 'https://picsum.photos/seed/ram/300/200' },
      { id: 'mb', name: 'Cartes Mères', image: 'https://picsum.photos/seed/mb/300/200' }
    ],
    filters: [
      { id: 'price', name: 'Prix', type: 'range', min: 0, max: 20000, step: 100 },
      { id: 'brand', name: 'Marque', type: 'checkbox', options: ['ASUS', 'MSI', 'Gigabyte', 'AMD', 'Intel', 'Corsair', 'Kingston'] },
      { id: 'subCategory', name: 'Type', type: 'checkbox', options: ['Processeurs', 'Cartes Graphiques', 'Mémoire RAM', 'Cartes Mères'] }
    ]
  },
  {
    id: 'peripherals',
    name: 'PÉRIPHÉRIQUE PC',
    icon: 'Keyboard',
    subCategories: [
      { id: 'keyboard', name: 'Claviers Gamer', image: 'https://picsum.photos/seed/kb/300/200' },
      { id: 'mouse', name: 'Souris Gamer', image: 'https://picsum.photos/seed/mouse/300/200' },
      { id: 'headset', name: 'Casques Gamer', image: 'https://picsum.photos/seed/headset/300/200' }
    ],
    filters: [
      { id: 'price', name: 'Prix', type: 'range', min: 0, max: 5000, step: 100 },
      { id: 'brand', name: 'Marque', type: 'checkbox', options: ['Razer', 'Logitech', 'Corsair', 'HyperX', 'SteelSeries'] },
      { id: 'subCategory', name: 'Type', type: 'checkbox', options: ['Claviers Gamer', 'Souris Gamer', 'Casques Gamer'] }
    ]
  },
  {
    id: 'monitors',
    name: 'ÉCRANS & MONITEURS PC',
    icon: 'MonitorPlay',
    subCategories: [
      { id: 'gaming-monitor', name: 'Écrans Gamer', image: 'https://picsum.photos/seed/monitor/300/200' },
      { id: 'office-monitor', name: 'Écrans Bureautique', image: 'https://picsum.photos/seed/monitor2/300/200' }
    ],
    filters: [
      { id: 'price', name: 'Prix', type: 'range', min: 0, max: 20000, step: 500 },
      { id: 'brand', name: 'Marque', type: 'checkbox', options: ['Samsung', 'LG', 'ASUS', 'MSI', 'BenQ', 'Dell'] },
      { id: 'refreshRate', name: 'Fréquence', type: 'checkbox', options: ['60Hz', '144Hz', '165Hz', '240Hz'] }
    ]
  },
  { id: 'config', name: 'CONFIGURATEUR PC', icon: 'Settings', subCategories: [] },
  { id: 'laptop', name: 'PC & ORDINATEUR PORTABLE', icon: 'Laptop', subCategories: [] },
  { id: 'gaming', name: 'CONSOLES & JEUX & VR', icon: 'Gamepad2', subCategories: [] },
  { id: 'furniture', name: 'MOBILIER DE BUREAU', icon: 'Armchair', subCategories: [] },
  { id: 'photo', name: 'UNIVERS PHOTO ET VIDEO', icon: 'Camera', subCategories: [] },
  { id: 'software', name: 'LOGICIEL', icon: 'Disc', subCategories: [] },
  { id: 'tv', name: 'TV, IMAGE & SON', icon: 'Tv', subCategories: [] },
  { id: 'print', name: 'IMPRIMANTE & SCANNER & TRACEUR', icon: 'Printer', subCategories: [] },
  { id: 'gadgets', name: 'ACCESSOIRES & GADGET', icon: 'Headphones', subCategories: [] },
];

const INITIAL_SITE_CONFIG: SiteConfig = {
  logo: 'TECHMAROC',
  logoUrl: '',
  primaryColor: '#7c3aed',
  taxRate: 20,
  hero: {
    title: 'LEVEL UP YOUR GAMING EXPERIENCE',
    subtitle: 'Découvrez nos PC Gamer assemblés avec passion pour des performances extrêmes.',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=2574&auto=format&fit=crop',
    videoUrl: '',
    bgType: 'image'
  },
  contact: {
    phone: '+212 5 22 00 00 00',
    email: 'contact@techmaroc.com',
    address: '123 Boulevard Zerktouni, Casablanca, Maroc'
  }
};

const INITIAL_ORDERS: Order[] = [
  { id: 'ORD-001', customerName: 'Ahmed Benali', date: '2023-10-25', total: 15999, status: 'delivered', items: [] },
  { id: 'ORD-002', customerName: 'Sara Idrissi', date: '2023-10-26', total: 8500, status: 'shipped', items: [] },
  { id: 'ORD-003', customerName: 'Karim Tazi', date: '2023-10-27', total: 22000, status: 'pending', items: [] },
];

const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@techmaroc.com', role: 'admin', status: 'active', avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=7c3aed&color=fff' },
  { id: 'u2', name: 'Client One', email: 'client@gmail.com', role: 'user', status: 'active', phone: '0600000000', avatar: 'https://ui-avatars.com/api/?name=Client+One&background=random' },
];

const INITIAL_STORES: Store[] = [
  {
    id: 'casablanca',
    city: 'Casablanca',
    address: '123 Boulevard Zerktouni, Maarif',
    phone: '05 22 11 11 11',
    hours: 'Lundi - Samedi : 09h00 - 20h00',
    map: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'marrakech',
    city: 'Marrakech',
    address: '45 Avenue Mohammed V, Guéliz',
    phone: '05 24 00 00 00',
    hours: 'Lundi - Samedi : 10h00 - 21h00',
    map: 'https://images.unsplash.com/photo-1597211661940-e0e74f43324e?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'rabat',
    city: 'Rabat',
    address: '12 Rue Arroz, Agdal',
    phone: '05 37 00 00 00',
    hours: 'Lundi - Samedi : 09h30 - 19h30',
    map: 'https://images.unsplash.com/photo-1531846807986-df4636105699?q=80&w=1000&auto=format&fit=crop'
  }
];

const INITIAL_PARTNERS: Partner[] = [
  { id: 'asus', name: 'ASUS ROG', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/de/ROG_logo.png', desc: 'Republic of Gamers' },
  { id: 'msi', name: 'MSI', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/MSI_Logo_2019.svg', desc: 'True Gaming' },
  { id: 'nvidia', name: 'NVIDIA', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg', desc: 'GeForce RTX' },
  { id: 'amd', name: 'AMD', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/AMD_Logo.svg', desc: 'Ryzen & Radeon' },
  { id: 'logitech', name: 'Logitech G', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Logitech_logo.svg', desc: 'Advanced Gaming Gear' },
  { id: 'corsair', name: 'Corsair', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Corsair_logo_2020.svg', desc: 'High Performance Gear' },
  { id: 'razer', name: 'Razer', logo: 'https://upload.wikimedia.org/wikipedia/en/4/40/Razer_snake_logo.svg', desc: 'For Gamers. By Gamers.' },
  { id: 'intel', name: 'Intel', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Intel_logo_2023.svg', desc: 'Intel Core Processors' },
];

// Service
class MockBackendService {
  private get<T>(key: string, initial: T): T {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }

  private set<T>(key: string, data: T) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  getProducts(): Product[] {
    return this.get('products', INITIAL_PRODUCTS);
  }

  saveProduct(product: Product) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.push(product);
    }
    this.set('products', products);
  }

  deleteProduct(id: string) {
    const products = this.getProducts().filter(p => p.id !== id);
    this.set('products', products);
  }

  getCategories(): Category[] {
    return this.get('categories', INITIAL_CATEGORIES);
  }

  saveCategory(category: Category) {
    const categories = this.getCategories();
    const index = categories.findIndex(c => c.id === category.id);
    if (index >= 0) {
      categories[index] = category;
    } else {
      categories.push(category);
    }
    this.set('categories', categories);
  }

  deleteCategory(id: string) {
    const categories = this.getCategories().filter(c => c.id !== id);
    this.set('categories', categories);
  }

  getSiteConfig(): SiteConfig {
    return this.get('siteConfig', INITIAL_SITE_CONFIG);
  }

  saveSiteConfig(config: SiteConfig) {
    this.set('siteConfig', config);
  }

  getOrders(): Order[] {
    return this.get('orders', INITIAL_ORDERS);
  }

  updateOrderStatus(id: string, status: Order['status']) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === id);
    if (order) {
      order.status = status;
      this.set('orders', orders);
    }
  }

  getUsers(): User[] {
    return this.get('users', INITIAL_USERS);
  }

  updateUser(user: User) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
      this.set('users', users);
    }
  }

  getStores(): Store[] {
    return this.get('stores', INITIAL_STORES);
  }

  saveStore(store: Store) {
    const stores = this.getStores();
    const index = stores.findIndex(s => s.id === store.id);
    if (index >= 0) {
      stores[index] = store;
    } else {
      stores.push(store);
    }
    this.set('stores', stores);
  }

  deleteStore(id: string) {
    const stores = this.getStores().filter(s => s.id !== id);
    this.set('stores', stores);
  }

  getPartners(): Partner[] {
    return this.get('partners', INITIAL_PARTNERS);
  }

  savePartner(partner: Partner) {
    const partners = this.getPartners();
    const index = partners.findIndex(p => p.id === partner.id);
    if (index >= 0) {
      partners[index] = partner;
    } else {
      partners.push(partner);
    }
    this.set('partners', partners);
  }

  deletePartner(id: string) {
    const partners = this.getPartners().filter(p => p.id !== id);
    this.set('partners', partners);
  }

  getStats() {
    return {
      sales: this.getOrders().reduce((acc, o) => acc + o.total, 0),
      orders: this.getOrders().length,
      users: this.getUsers().length,
      products: this.getProducts().length
    };
  }
}

export const mockBackend = new MockBackendService();
