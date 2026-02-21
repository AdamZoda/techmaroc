import { supabase } from '../lib/supabase';
import { Product, Category, Order, SiteConfig, Store, Partner } from '../types';

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) { console.error('getProducts:', error); return []; }
    return (data || []).map(mapProduct);
}

export async function upsertProduct(product: Partial<Product>): Promise<Product | null> {
    const payload = {
        id: product.id && !product.id.match(/^[0-9]+$/) ? product.id : undefined, // only keep UUID ids
        name: product.name,
        price: product.price,
        promo_price: product.promoPrice ?? null,
        category: product.category,
        sub_category: product.subCategory ?? null,
        brand: product.brand ?? null,
        image: product.image,
        images: product.images ?? [],
        description: product.description ?? null,
        specs: product.specs ?? {},
        is_new: product.isNew ?? false,
        is_best_seller: product.isBestSeller ?? false,
        is_promo: product.isPromo ?? false,
        stock: product.stock ?? 0,
    };

    // Remove undefined id for new products
    if (!payload.id) delete payload.id;

    const { data, error } = await supabase.from('products').upsert(payload).select().single();
    if (error) { console.error('upsertProduct:', error); return null; }
    return mapProduct(data);
}

export async function deleteProduct(id: string): Promise<boolean> {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) { console.error('deleteProduct:', error); return false; }
    return true;
}

// ─── CATEGORIES ───────────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) { console.error('getCategories:', error); return []; }
    return (data || []).map(mapCategory);
}

export async function upsertCategory(category: Category): Promise<boolean> {
    const { error } = await supabase.from('categories').upsert({
        id: category.id,
        name: category.name,
        icon: category.icon,
        sub_categories: category.subCategories,
        filters: category.filters ?? [],
    });
    if (error) { console.error('upsertCategory:', error); return false; }
    return true;
}

export async function deleteCategory(id: string): Promise<boolean> {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) { console.error('deleteCategory:', error); return false; }
    return true;
}

// ─── ORDERS ───────────────────────────────────────────────────────────────────

export async function getAllOrders(): Promise<Order[]> {
    const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });
    if (error) { console.error('getAllOrders:', error); return []; }
    return (data || []).map(mapOrder);
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
    const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    if (error) { console.error('getOrdersByUser:', error); return []; }
    return (data || []).map(mapOrder);
}

export async function createOrder(params: {
    id: string;
    userId: string;
    customerName: string;
    email: string;
    address: string;
    city: string;
    phone: string;
    paymentMethod: string;
    total: number;
    date: string;
    items: { productId: string; quantity: number; price: number; name?: string; image?: string }[];
}): Promise<boolean> {
    const { error: orderError } = await supabase.from('orders').insert({
        id: params.id,
        user_id: params.userId,
        customer_name: params.customerName,
        email: params.email,
        address: params.address,
        city: params.city,
        phone: params.phone,
        payment_method: params.paymentMethod,
        total: params.total,
        date: params.date,
        status: 'pending',
    });
    if (orderError) { console.error('createOrder:', orderError); return false; }

    const itemsPayload = params.items.map(item => ({
        order_id: params.id,
        product_id: item.productId || null,
        quantity: item.quantity,
        price_at_purchase: item.price,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(itemsPayload);
    if (itemsError) { console.error('createOrderItems:', itemsError); return false; }

    return true;
}

export async function updateOrderStatus(id: string, status: string): Promise<boolean> {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) { console.error('updateOrderStatus:', error); return false; }
    return true;
}

// ─── SITE CONFIG ──────────────────────────────────────────────────────────────

export async function getSiteConfig(): Promise<SiteConfig | null> {
    const { data, error } = await supabase.from('site_config').select('*').eq('id', 1).single();
    if (error) { console.error('getSiteConfig:', error); return null; }
    return mapSiteConfig(data);
}

export async function upsertSiteConfig(config: SiteConfig): Promise<boolean> {
    const { error } = await supabase.from('site_config').upsert({
        id: 1,
        logo: config.logo,
        logo_url: config.logoUrl ?? '',
        primary_color: config.primaryColor,
        tax_rate: config.taxRate,
        hero: {
            title: config.hero.title,
            subtitle: config.hero.subtitle,
            image: config.hero.image,
            video_url: config.hero.videoUrl ?? '',
            bg_type: config.hero.bgType ?? 'image',
        },
        contact: config.contact,
    });
    if (error) { console.error('upsertSiteConfig:', error); return false; }
    return true;
}

// ─── STORES ───────────────────────────────────────────────────────────────────

export async function getStores(): Promise<Store[]> {
    const { data, error } = await supabase.from('stores').select('*').order('city');
    if (error) { console.error('getStores:', error); return []; }
    return (data || []).map(mapStore);
}

export async function upsertStore(store: Store): Promise<boolean> {
    const { error } = await supabase.from('stores').upsert({
        id: store.id,
        city: store.city,
        address: store.address,
        phone: store.phone,
        hours: store.hours,
        map_url: store.map ?? '',
    });
    if (error) { console.error('upsertStore:', error); return false; }
    return true;
}

export async function deleteStore(id: string): Promise<boolean> {
    const { error } = await supabase.from('stores').delete().eq('id', id);
    if (error) { console.error('deleteStore:', error); return false; }
    return true;
}

// ─── PARTNERS ─────────────────────────────────────────────────────────────────

export async function getPartners(): Promise<Partner[]> {
    const { data, error } = await supabase.from('partners').select('*').order('name');
    if (error) { console.error('getPartners:', error); return []; }
    return (data || []).map(r => ({ id: r.id, name: r.name, logo: r.logo, desc: r.description ?? '' }));
}

export async function upsertPartner(partner: Partner): Promise<boolean> {
    const { error } = await supabase.from('partners').upsert({
        id: partner.id,
        name: partner.name,
        logo: partner.logo,
        description: partner.desc ?? '',
    });
    if (error) { console.error('upsertPartner:', error); return false; }
    return true;
}

export async function deletePartner(id: string): Promise<boolean> {
    const { error } = await supabase.from('partners').delete().eq('id', id);
    if (error) { console.error('deletePartner:', error); return false; }
    return true;
}

// ─── PROFILES (USERS) ─────────────────────────────────────────────────────────

export async function getAllProfiles() {
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (error) { console.error('getAllProfiles:', error); return []; }
    return data || [];
}

export async function updateProfile(userId: string, updates: { full_name?: string; phone?: string; avatar_url?: string }) {
    const { error } = await supabase.from('profiles').update(updates).eq('id', userId);
    if (error) { console.error('updateProfile:', error); return false; }
    return true;
}

// ─── STATS ────────────────────────────────────────────────────────────────────

export async function getDashboardStats() {
    const [ordersRes, profilesRes, productsRes] = await Promise.all([
        supabase.from('orders').select('total, created_at, status'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('products').select('id', { count: 'exact', head: true }),
    ]);

    const orders = ordersRes.data || [];
    const totalSales = orders.reduce((acc, o) => acc + Number(o.total), 0);

    // Orders per day of week (last 7 days)
    const now = new Date();
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const dailyMap: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        dailyMap[d.toDateString()] = 0;
    }
    orders.forEach(o => {
        const d = new Date(o.created_at).toDateString();
        if (d in dailyMap) dailyMap[d]++;
    });
    const ordersPerDay = Object.entries(dailyMap).map(([dateStr, value]) => ({
        name: days[new Date(dateStr).getDay()],
        value,
    }));

    // Monthly sales (last 6 months)
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const monthlyMap: Record<string, number> = {};
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now);
        d.setMonth(d.getMonth() - i);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        monthlyMap[key] = 0;
    }
    orders.forEach(o => {
        const d = new Date(o.created_at);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (key in monthlyMap) monthlyMap[key] += Number(o.total);
    });
    const salesPerMonth = Object.entries(monthlyMap).map(([key, value]) => {
        const [year, month] = key.split('-');
        return { name: months[Number(month)], value };
    });

    return {
        totalSales,
        totalOrders: orders.length,
        totalUsers: profilesRes.count ?? 0,
        totalProducts: productsRes.count ?? 0,
        ordersPerDay,
        salesPerMonth,
    };
}

// ─── DATA MAPPERS ─────────────────────────────────────────────────────────────

function mapProduct(r: any): Product {
    return {
        id: r.id,
        name: r.name,
        price: Number(r.price),
        promoPrice: r.promo_price ? Number(r.promo_price) : undefined,
        category: r.category,
        subCategory: r.sub_category ?? undefined,
        brand: r.brand ?? undefined,
        image: r.image,
        images: r.images ?? [],
        description: r.description ?? undefined,
        specs: r.specs ?? {},
        isNew: r.is_new ?? false,
        isBestSeller: r.is_best_seller ?? false,
        isPromo: r.is_promo ?? false,
        stock: r.stock ?? 0,
    };
}

function mapCategory(r: any): Category {
    return {
        id: r.id,
        name: r.name,
        icon: r.icon,
        subCategories: r.sub_categories ?? [],
        filters: r.filters ?? [],
    };
}

function mapOrder(r: any): Order {
    const items = (r.order_items || []).map((item: any) => ({
        productId: item.product_id ?? '',
        quantity: item.quantity,
        price: Number(item.price_at_purchase),
        name: item.name ?? '',
        image: item.image ?? '',
    }));
    return {
        id: r.id,
        customerName: r.customer_name,
        email: r.email ?? '',
        address: r.address ?? '',
        city: r.city ?? '',
        phone: r.phone ?? '',
        paymentMethod: r.payment_method ?? 'cod',
        date: r.date ?? new Date(r.created_at).toLocaleDateString('fr-FR'),
        total: Number(r.total),
        status: r.status as Order['status'],
        items,
    };
}

function mapSiteConfig(r: any): SiteConfig {
    const hero = r.hero ?? {};
    return {
        logo: r.logo,
        logoUrl: r.logo_url ?? '',
        primaryColor: r.primary_color,
        taxRate: r.tax_rate,
        hero: {
            title: hero.title ?? '',
            subtitle: hero.subtitle ?? '',
            image: hero.image ?? '',
            videoUrl: hero.video_url ?? '',
            bgType: hero.bg_type ?? 'image',
        },
        contact: r.contact ?? { phone: '', email: '', address: '' },
    };
}

function mapStore(r: any): Store {
    return {
        id: r.id,
        city: r.city,
        address: r.address,
        phone: r.phone ?? '',
        hours: r.hours ?? '',
        map: r.map_url ?? '',
    };
}
