import { useState, useEffect, useCallback, type ChangeEvent, type FormEvent } from 'react';
import { Product, Order, Category, SiteConfig, Store, Partner, FilterOption } from '../types';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import {
  getProducts, upsertProduct, deleteProduct,
  getCategories, upsertCategory, deleteCategory,
  getAllOrders, updateOrderStatus,
  getSiteConfig, upsertSiteConfig,
  getStores, upsertStore, deleteStore,
  getPartners, upsertPartner, deletePartner,
  getAllProfiles, getDashboardStats,
} from '../services/supabaseService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Package, Users, ShoppingCart, DollarSign, Plus, Edit, Trash, Search, BarChart2, Settings, Layers, Image, Type, MapPin, Briefcase, Filter, LogOut, RefreshCw, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: 'Confirmée', color: 'bg-blue-100 text-blue-700' },
  shipped: { label: 'Expédiée', color: 'bg-purple-100 text-purple-700' },
  delivered: { label: 'Livrée', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-700' },
};

export default function AdminDashboard() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'orders' | 'users' | 'content' | 'stores' | 'partners'>('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, totalUsers: 0, totalProducts: 0, ordersPerDay: [] as any[], salesPerMonth: [] as any[] });
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);

  // Form State for Product
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [productSpecs, setProductSpecs] = useState<{ key: string, value: string }[]>([]);

  // Form State for Category
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Partial<Category>>({});

  // Form State for Store
  const [isEditingStore, setIsEditingStore] = useState(false);
  const [currentStore, setCurrentStore] = useState<Partial<Store>>({});

  // Form State for Partner
  const [isEditingPartner, setIsEditingPartner] = useState(false);
  const [currentPartner, setCurrentPartner] = useState<Partial<Partner>>({});

  // Product search
  const [productSearch, setProductSearch] = useState('');

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [prods, cats, ords, profs, cfg, strs, parts, statsData] = await Promise.all([
        getProducts(),
        getCategories(),
        getAllOrders(),
        getAllProfiles(),
        getSiteConfig(),
        getStores(),
        getPartners(),
        getDashboardStats(),
      ]);
      setProducts(prods);
      setCategories(cats);
      setOrders(ords);
      setUsers(profs);
      setSiteConfig(cfg);
      setStores(strs);
      setPartners(parts);
      setStats(statsData);
    } catch (e) {
      console.error('refreshData error:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // ─── Image Upload (Base64 preview for products) ────────────────────────────
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>, field: 'image' | 'images') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (field === 'image') {
          setCurrentProduct(prev => ({ ...prev, image: base64 }));
        } else {
          setCurrentProduct(prev => ({ ...prev, images: [...(prev.images || []), base64] }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // ─── PRODUCT CRUD ──────────────────────────────────────────────────────────
  const handleSaveProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentProduct.name || !currentProduct.price) return;
    setIsSaving(true);

    const specsObject: Record<string, string> = {};
    productSpecs.forEach(spec => { if (spec.key && spec.value) specsObject[spec.key] = spec.value; });

    const productToSave: Partial<Product> = {
      ...currentProduct,
      specs: specsObject,
      stock: currentProduct.stock ?? 0,
      image: currentProduct.image || 'https://picsum.photos/seed/new/400/400',
    };

    await upsertProduct(productToSave);
    await refreshData();
    setIsSaving(false);
    setIsEditingProduct(false);
    setCurrentProduct({});
    setProductSpecs([]);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return;
    await deleteProduct(id);
    await refreshData();
  };

  // ─── CATEGORY CRUD ─────────────────────────────────────────────────────────
  const handleSaveCategory = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentCategory.name || !currentCategory.icon) return;
    setIsSaving(true);
    const cat: Category = {
      id: currentCategory.id || currentCategory.name!.toLowerCase().replace(/\s+/g, '-'),
      name: currentCategory.name!,
      icon: currentCategory.icon!,
      subCategories: currentCategory.subCategories || [],
      filters: currentCategory.filters || [],
    };
    await upsertCategory(cat);
    await refreshData();
    setIsSaving(false);
    setIsEditingCategory(false);
    setCurrentCategory({});
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Supprimer cette catégorie ?')) return;
    await deleteCategory(id);
    await refreshData();
  };

  // ─── STORE CRUD ────────────────────────────────────────────────────────────
  const handleSaveStore = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentStore.city || !currentStore.address) return;
    setIsSaving(true);
    const store: Store = {
      id: currentStore.id || currentStore.city.toLowerCase().replace(/\s+/g, '-'),
      city: currentStore.city!,
      address: currentStore.address!,
      phone: currentStore.phone || '',
      hours: currentStore.hours || '',
      map: currentStore.map || '',
    };
    await upsertStore(store);
    await refreshData();
    setIsSaving(false);
    setIsEditingStore(false);
    setCurrentStore({});
  };

  const handleDeleteStore = async (id: string) => {
    if (!confirm('Supprimer ce magasin ?')) return;
    await deleteStore(id);
    await refreshData();
  };

  // ─── PARTNER CRUD ──────────────────────────────────────────────────────────
  const handleSavePartner = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentPartner.name) return;
    setIsSaving(true);
    const partner: Partner = {
      id: currentPartner.id || currentPartner.name.toLowerCase().replace(/\s+/g, '-'),
      name: currentPartner.name!,
      logo: currentPartner.logo || '',
      desc: currentPartner.desc || '',
    };
    await upsertPartner(partner);
    await refreshData();
    setIsSaving(false);
    setIsEditingPartner(false);
    setCurrentPartner({});
  };

  const handleDeletePartner = async (id: string) => {
    if (!confirm('Supprimer ce partenaire ?')) return;
    await deletePartner(id);
    await refreshData();
  };

  // ─── SITE CONFIG ───────────────────────────────────────────────────────────
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteConfig) return;
    setIsSaving(true);
    await upsertSiteConfig(siteConfig);
    window.dispatchEvent(new Event('siteConfigUpdated'));
    setIsSaving(false);
    alert('Configuration sauvegardée !');
  };

  // ─── ORDER STATUS ──────────────────────────────────────────────────────────
  const handleUpdateOrderStatus = async (id: string, status: string) => {
    await updateOrderStatus(id, status);
    await refreshData();
  };

  // ─── LOGOUT ────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // ─── RENDER DASHBOARD ─────────────────────────────────────────────────────
  const renderDashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Ventes', value: `${stats.totalSales.toLocaleString()} MAD`, icon: DollarSign, color: 'bg-purple-100 text-primary' },
          { label: 'Total Commandes', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-blue-100 text-blue-600' },
          { label: 'Total Clients', value: stats.totalUsers, icon: Users, color: 'bg-orange-100 text-orange-600' },
          { label: 'Total Produits', value: stats.totalProducts, icon: Package, color: 'bg-green-100 text-green-600' },
        ].map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.color}`}>
                <card.icon size={24} />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{card.label}</h3>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-6">Ventes (6 derniers mois)</h3>
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.salesPerMonth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: any) => `${Number(v).toLocaleString()} MAD`} />
                <Line type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4, fill: '#7c3aed' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-6">Commandes (7 derniers jours)</h3>
          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.ordersPerDay}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f9fafb' }} />
                <Bar dataKey="value" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders on Dashboard */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-lg mb-4">Dernières commandes</h3>
        <div className="space-y-3">
          {orders.slice(0, 5).map(order => (
            <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="font-bold text-sm text-gray-900">{order.id}</p>
                <p className="text-xs text-gray-500">{order.customerName}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-bold text-primary text-sm">{Number(order.total).toLocaleString()} MAD</p>
                <span className={`text-xs px-2 py-1 rounded-full font-bold ${STATUS_LABELS[order.status]?.color || 'bg-gray-100 text-gray-700'}`}>
                  {STATUS_LABELS[order.status]?.label || order.status}
                </span>
              </div>
            </div>
          ))}
          {orders.length === 0 && <p className="text-gray-400 text-sm text-center py-4">Aucune commande pour l'instant</p>}
        </div>
      </div>
    </div>
  );

  // ─── RENDER PRODUCTS ──────────────────────────────────────────────────────
  const renderProducts = () => {
    const filtered = products.filter(p =>
      !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.category.toLowerCase().includes(productSearch.toLowerCase())
    );
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <h3 className="font-bold text-lg">Produits</h3>
            <div className="relative flex-1 max-w-xs">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Rechercher..."
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm"
              />
            </div>
          </div>
          <button
            onClick={() => {
              setCurrentProduct({});
              setProductSpecs([{ key: 'Processor', value: '' }, { key: 'GPU', value: '' }, { key: 'RAM', value: '' }, { key: 'Storage', value: '' }]);
              setIsEditingProduct(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shrink-0"
          >
            <Plus size={18} /> Ajouter
          </button>
        </div>

        {isEditingProduct ? (
          <div className="p-6 bg-gray-50">
            <form onSubmit={handleSaveProduct} className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Nom du produit" value={currentProduct.name || ''} onChange={e => setCurrentProduct({ ...currentProduct, name: e.target.value })} className="p-3 border rounded-lg" required />
                <input type="number" placeholder="Prix (MAD)" value={currentProduct.price || ''} onChange={e => setCurrentProduct({ ...currentProduct, price: Number(e.target.value) })} className="p-3 border rounded-lg" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Prix promo (MAD, optionnel)" value={currentProduct.promoPrice || ''} onChange={e => setCurrentProduct({ ...currentProduct, promoPrice: e.target.value ? Number(e.target.value) : undefined })} className="p-3 border rounded-lg" />
                <input type="number" placeholder="Stock" value={currentProduct.stock || 0} onChange={e => setCurrentProduct({ ...currentProduct, stock: Number(e.target.value) })} className="p-3 border rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <select value={currentProduct.category || ''} onChange={e => setCurrentProduct({ ...currentProduct, category: e.target.value, subCategory: '' })} className="p-3 border rounded-lg">
                  <option value="">Catégorie</option>
                  {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                </select>
                <select value={currentProduct.subCategory || ''} onChange={e => setCurrentProduct({ ...currentProduct, subCategory: e.target.value })} className="p-3 border rounded-lg" disabled={!currentProduct.category}>
                  <option value="">Sous-catégorie</option>
                  {categories.find(c => c.name === currentProduct.category)?.subCategories.map(sub => <option key={sub.id} value={sub.name}>{sub.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Marque" value={currentProduct.brand || ''} onChange={e => setCurrentProduct({ ...currentProduct, brand: e.target.value })} className="p-3 border rounded-lg" />
                <div className="flex gap-2">
                  <input placeholder="URL image principale" value={currentProduct.image || ''} onChange={e => setCurrentProduct({ ...currentProduct, image: e.target.value })} className="flex-1 p-3 border rounded-lg" />
                  <label className="flex items-center justify-center px-4 bg-gray-100 border rounded-lg cursor-pointer hover:bg-gray-200">
                    <Image size={20} />
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'image')} />
                  </label>
                </div>
              </div>
              <textarea placeholder="Description" value={currentProduct.description || ''} onChange={e => setCurrentProduct({ ...currentProduct, description: e.target.value })} className="w-full p-3 border rounded-lg" rows={3} />

              {/* Images supplémentaires */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Images supplémentaires</label>
                <div className="space-y-2">
                  {(currentProduct.images || []).map((img, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input value={img} readOnly className="flex-1 p-2 border rounded-lg bg-gray-50 text-xs" />
                      <button type="button" onClick={() => { const newImgs = [...(currentProduct.images || [])]; newImgs.splice(idx, 1); setCurrentProduct({ ...currentProduct, images: newImgs }); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash size={16} /></button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input id="newImageUrl" placeholder="Ajouter URL image" className="flex-1 p-2 border rounded-lg text-sm" />
                    <label className="flex items-center justify-center px-4 bg-gray-100 border rounded-lg cursor-pointer hover:bg-gray-200"><Image size={20} /><input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'images')} /></label>
                    <button type="button" onClick={() => { const input = document.getElementById('newImageUrl') as HTMLInputElement; if (input.value) { setCurrentProduct({ ...currentProduct, images: [...(currentProduct.images || []), input.value] }); input.value = ''; } }} className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm">Ajouter</button>
                  </div>
                </div>
              </div>

              {/* Flags */}
              <div className="flex gap-6 flex-wrap">
                {[['isNew', 'Nouveau'], ['isBestSeller', 'Best Seller'], ['isPromo', 'Promo']].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={!!(currentProduct as any)[key]} onChange={e => setCurrentProduct({ ...currentProduct, [key]: e.target.checked })} className="w-4 h-4 text-primary rounded" />
                    {label}
                  </label>
                ))}
              </div>

              {/* Specs */}
              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-gray-500">Spécifications</h4>
                  <button type="button" onClick={() => setProductSpecs([...productSpecs, { key: '', value: '' }])} className="text-xs flex items-center gap-1 text-primary font-bold hover:underline"><Plus size={14} /> Ajouter</button>
                </div>
                {productSpecs.map((spec, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input placeholder="Nom (ex: Processeur)" value={spec.key} onChange={e => { const s = [...productSpecs]; s[idx].key = e.target.value; setProductSpecs(s); }} className="flex-1 p-2 border rounded-lg text-sm font-medium" />
                    <input placeholder="Valeur (ex: Intel i9)" value={spec.value} onChange={e => { const s = [...productSpecs]; s[idx].value = e.target.value; setProductSpecs(s); }} className="flex-1 p-2 border rounded-lg text-sm" />
                    <button type="button" onClick={() => { const s = [...productSpecs]; s.splice(idx, 1); setProductSpecs(s); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash size={16} /></button>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button type="submit" disabled={isSaving} className="px-6 py-2 bg-primary text-white rounded-lg disabled:opacity-60">{isSaving ? 'Sauvegarde...' : 'Sauvegarder'}</button>
                <button type="button" onClick={() => setIsEditingProduct(false)} className="px-6 py-2 bg-gray-300 rounded-lg">Annuler</button>
              </div>
            </form>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="p-4 font-medium">Produit</th>
                  <th className="p-4 font-medium">Catégorie</th>
                  <th className="p-4 font-medium">Prix</th>
                  <th className="p-4 font-medium">Stock</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="p-4 flex items-center gap-3">
                      <img src={product.image} alt="" className="w-10 h-10 rounded bg-gray-100 object-cover shrink-0" />
                      <div>
                        <span className="font-medium text-gray-900">{product.name}</span>
                        {product.isBestSeller && <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Best Seller</span>}
                        {product.isNew && <span className="ml-1 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Nouveau</span>}
                      </div>
                    </td>
                    <td className="p-4 text-gray-500">{product.category}</td>
                    <td className="p-4 font-medium">
                      {product.promoPrice ? (
                        <span><span className="line-through text-gray-400 mr-1">{product.price.toLocaleString()}</span><span className="text-red-600">{product.promoPrice.toLocaleString()}</span> MAD</span>
                      ) : `${product.price.toLocaleString()} MAD`}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.stock > 0 ? `${product.stock} en stock` : 'Rupture'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setCurrentProduct(product); const specsArray = Object.entries(product.specs || {}).map(([key, value]) => ({ key, value: value || '' })); setProductSpecs(specsArray.length ? specsArray : [{ key: 'Processor', value: '' }, { key: 'GPU', value: '' }]); setIsEditingProduct(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
                        <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <p className="text-center text-gray-400 py-8">Aucun produit trouvé</p>}
          </div>
        )}
      </div>
    );
  };

  // ─── RENDER ORDERS ────────────────────────────────────────────────────────
  const renderOrders = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="font-bold text-lg">Gestion des Commandes</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="p-4 font-medium">ID</th>
              <th className="p-4 font-medium">Client</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Total</th>
              <th className="p-4 font-medium">Statut</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">{order.id}</td>
                <td className="p-4">
                  <div>
                    <p className="font-medium text-gray-900">{order.customerName}</p>
                    {order.phone && <p className="text-xs text-gray-400">{order.phone}</p>}
                  </div>
                </td>
                <td className="p-4 text-gray-500">{order.date}</td>
                <td className="p-4 font-bold text-primary">{Number(order.total).toLocaleString()} MAD</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${STATUS_LABELS[order.status]?.color || 'bg-gray-100 text-gray-700'}`}>
                    {STATUS_LABELS[order.status]?.label || order.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <select
                    value={order.status}
                    onChange={e => handleUpdateOrderStatus(order.id, e.target.value)}
                    className="text-sm p-2 border rounded-lg bg-white"
                  >
                    <option value="pending">En attente</option>
                    <option value="confirmed">Confirmée</option>
                    <option value="shipped">Expédiée</option>
                    <option value="delivered">Livrée</option>
                    <option value="cancelled">Annulée</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="text-center text-gray-400 py-8">Aucune commande pour l'instant</p>}
      </div>
    </div>
  );

  // ─── RENDER USERS ─────────────────────────────────────────────────────────
  const renderUsers = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="font-bold text-lg">Utilisateurs ({users.length})</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="p-4 font-medium">Nom</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Rôle</th>
              <th className="p-4 font-medium">Statut</th>
              <th className="p-4 font-medium">Inscription</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u: any) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="p-4 flex items-center gap-3">
                  <img src={u.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.full_name || u.email)}&background=7c3aed&color=fff`} alt="" className="w-8 h-8 rounded-full object-cover" />
                  <span className="font-medium text-gray-900">{u.full_name || '(sans nom)'}</span>
                </td>
                <td className="p-4 text-gray-500">{u.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.role === 'admin' || u.role === 'superadmin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {u.status === 'active' ? 'Actif' : 'Bloqué'}
                  </span>
                </td>
                <td className="p-4 text-gray-500">{new Date(u.created_at).toLocaleDateString('fr-FR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p className="text-center text-gray-400 py-8">Aucun utilisateur</p>}
      </div>
    </div>
  );

  // ─── RENDER CATEGORIES ────────────────────────────────────────────────────
  const renderCategories = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-bold text-lg">Catégories</h3>
        <button onClick={() => { setCurrentCategory({}); setIsEditingCategory(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
          <Plus size={18} /> Ajouter
        </button>
      </div>
      {isEditingCategory ? (
        <div className="p-6 bg-gray-50">
          <form onSubmit={handleSaveCategory} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Nom de la catégorie" value={currentCategory.name || ''} onChange={e => setCurrentCategory({ ...currentCategory, name: e.target.value })} className="p-3 border rounded-lg" required />
              <input placeholder="Icône Lucide (ex: Monitor)" value={currentCategory.icon || ''} onChange={e => setCurrentCategory({ ...currentCategory, icon: e.target.value })} className="p-3 border rounded-lg" required />
            </div>
            {/* Subcategories */}
            <div className="space-y-2 border-t pt-4">
              <h4 className="font-bold text-sm text-gray-500">Sous-catégories</h4>
              {currentCategory.subCategories?.map((sub, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded border">
                  <span className="flex-1 text-sm font-medium">{sub.name}</span>
                  <button type="button" onClick={() => { const s = [...(currentCategory.subCategories || [])]; s.splice(idx, 1); setCurrentCategory({ ...currentCategory, subCategories: s }); }} className="text-red-500 p-1 rounded hover:bg-red-50"><Trash size={14} /></button>
                </div>
              ))}
              <div className="flex gap-2">
                <input id="newSubName" placeholder="Nom sous-catégorie" className="flex-1 p-2 border rounded text-sm" />
                <input id="newSubImage" placeholder="URL image" className="flex-1 p-2 border rounded text-sm" />
                <button type="button" onClick={() => { const n = (document.getElementById('newSubName') as HTMLInputElement); const img = (document.getElementById('newSubImage') as HTMLInputElement); if (n.value) { setCurrentCategory({ ...currentCategory, subCategories: [...(currentCategory.subCategories || []), { id: n.value.toLowerCase().replace(/\s+/g, '-'), name: n.value, image: img.value }] }); n.value = ''; img.value = ''; } }} className="px-4 py-2 bg-gray-900 text-white rounded text-sm">Ajouter</button>
              </div>
            </div>
            <div className="flex gap-4">
              <button type="submit" disabled={isSaving} className="px-6 py-2 bg-primary text-white rounded-lg disabled:opacity-60">{isSaving ? 'Sauvegarde...' : 'Sauvegarder'}</button>
              <button type="button" onClick={() => setIsEditingCategory(false)} className="px-6 py-2 bg-gray-300 rounded-lg">Annuler</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500"><tr><th className="p-4 font-medium">Nom</th><th className="p-4 font-medium">Icône</th><th className="p-4 font-medium">Sous-catégories</th><th className="p-4 font-medium text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map(cat => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{cat.name}</td>
                  <td className="p-4 text-gray-500">{cat.icon}</td>
                  <td className="p-4 text-gray-500">{cat.subCategories.length}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setCurrentCategory(cat); setIsEditingCategory(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
                      <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // ─── RENDER STORES ─────────────────────────────────────────────────────────
  const renderStores = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-bold text-lg">Magasins</h3>
        <button onClick={() => { setCurrentStore({}); setIsEditingStore(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg"><Plus size={18} /> Ajouter</button>
      </div>
      {isEditingStore ? (
        <div className="p-6 bg-gray-50">
          <form onSubmit={handleSaveStore} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Ville" value={currentStore.city || ''} onChange={e => setCurrentStore({ ...currentStore, city: e.target.value })} className="p-3 border rounded-lg" required />
              <input placeholder="Téléphone" value={currentStore.phone || ''} onChange={e => setCurrentStore({ ...currentStore, phone: e.target.value })} className="p-3 border rounded-lg" />
            </div>
            <input placeholder="Adresse" value={currentStore.address || ''} onChange={e => setCurrentStore({ ...currentStore, address: e.target.value })} className="w-full p-3 border rounded-lg" required />
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Horaires" value={currentStore.hours || ''} onChange={e => setCurrentStore({ ...currentStore, hours: e.target.value })} className="p-3 border rounded-lg" />
              <input placeholder="URL Image carte" value={currentStore.map || ''} onChange={e => setCurrentStore({ ...currentStore, map: e.target.value })} className="p-3 border rounded-lg" />
            </div>
            <div className="flex gap-4">
              <button type="submit" disabled={isSaving} className="px-6 py-2 bg-primary text-white rounded-lg disabled:opacity-60">{isSaving ? 'Sauvegarde...' : 'Sauvegarder'}</button>
              <button type="button" onClick={() => setIsEditingStore(false)} className="px-6 py-2 bg-gray-300 rounded-lg">Annuler</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500"><tr><th className="p-4 font-medium">Ville</th><th className="p-4 font-medium">Adresse</th><th className="p-4 font-medium">Téléphone</th><th className="p-4 font-medium text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {stores.map(store => (
                <tr key={store.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium">{store.city}</td>
                  <td className="p-4 text-gray-500">{store.address}</td>
                  <td className="p-4 text-gray-500">{store.phone}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setCurrentStore(store); setIsEditingStore(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
                      <button onClick={() => handleDeleteStore(store.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // ─── RENDER PARTNERS ──────────────────────────────────────────────────────
  const renderPartners = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-bold text-lg">Partenaires</h3>
        <button onClick={() => { setCurrentPartner({}); setIsEditingPartner(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg"><Plus size={18} /> Ajouter</button>
      </div>
      {isEditingPartner ? (
        <div className="p-6 bg-gray-50">
          <form onSubmit={handleSavePartner} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Nom du partenaire" value={currentPartner.name || ''} onChange={e => setCurrentPartner({ ...currentPartner, name: e.target.value })} className="p-3 border rounded-lg" required />
              <input placeholder="Description" value={currentPartner.desc || ''} onChange={e => setCurrentPartner({ ...currentPartner, desc: e.target.value })} className="p-3 border rounded-lg" />
            </div>
            <input placeholder="URL du logo" value={currentPartner.logo || ''} onChange={e => setCurrentPartner({ ...currentPartner, logo: e.target.value })} className="w-full p-3 border rounded-lg" required />
            <div className="flex gap-4">
              <button type="submit" disabled={isSaving} className="px-6 py-2 bg-primary text-white rounded-lg disabled:opacity-60">{isSaving ? 'Sauvegarde...' : 'Sauvegarder'}</button>
              <button type="button" onClick={() => setIsEditingPartner(false)} className="px-6 py-2 bg-gray-300 rounded-lg">Annuler</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500"><tr><th className="p-4 font-medium">Partenaire</th><th className="p-4 font-medium">Description</th><th className="p-4 font-medium text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {partners.map(partner => (
                <tr key={partner.id} className="hover:bg-gray-50">
                  <td className="p-4 flex items-center gap-3">
                    <img src={partner.logo} alt="" className="w-10 h-10 object-contain bg-white border rounded p-1" />
                    <span className="font-medium">{partner.name}</span>
                  </td>
                  <td className="p-4 text-gray-500">{partner.desc}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setCurrentPartner(partner); setIsEditingPartner(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
                      <button onClick={() => handleDeletePartner(partner.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // ─── RENDER CONTENT ───────────────────────────────────────────────────────
  const renderContent = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="font-bold text-lg mb-6">Configuration du Site</h3>
      {siteConfig && (
        <form onSubmit={handleSaveConfig} className="space-y-8 max-w-3xl">
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-gray-500 uppercase flex items-center gap-2"><Settings size={16} /> Général</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo Texte</label>
                <input value={siteConfig.logo} onChange={e => setSiteConfig({ ...siteConfig, logo: e.target.value })} className="w-full p-3 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL (Optionnel)</label>
                <input value={siteConfig.logoUrl || ''} onChange={e => setSiteConfig({ ...siteConfig, logoUrl: e.target.value })} placeholder="https://..." className="w-full p-3 border rounded-lg" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Couleur Principale</label>
                <div className="flex gap-2">
                  <input type="color" value={siteConfig.primaryColor || '#7c3aed'} onChange={e => setSiteConfig({ ...siteConfig, primaryColor: e.target.value })} className="h-12 w-20 p-1 border rounded-lg cursor-pointer" />
                  <input type="text" value={siteConfig.primaryColor || '#7c3aed'} onChange={e => setSiteConfig({ ...siteConfig, primaryColor: e.target.value })} className="flex-1 p-3 border rounded-lg uppercase" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Taux de TVA (%)</label>
                <input type="number" value={siteConfig.taxRate || 20} onChange={e => setSiteConfig({ ...siteConfig, taxRate: Number(e.target.value) })} className="w-full p-3 border rounded-lg" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-sm text-gray-500 uppercase flex items-center gap-2"><Image size={16} /> Section Hero</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
              <input value={siteConfig.hero.title} onChange={e => setSiteConfig({ ...siteConfig, hero: { ...siteConfig.hero, title: e.target.value } })} className="w-full p-3 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sous-titre</label>
              <textarea value={siteConfig.hero.subtitle} onChange={e => setSiteConfig({ ...siteConfig, hero: { ...siteConfig.hero, subtitle: e.target.value } })} className="w-full p-3 border rounded-lg" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de fond</label>
                <select value={siteConfig.hero.bgType || 'image'} onChange={e => setSiteConfig({ ...siteConfig, hero: { ...siteConfig.hero, bgType: e.target.value as 'image' | 'video' } })} className="w-full p-3 border rounded-lg">
                  <option value="image">Image URL</option>
                  <option value="video">Vidéo URL</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{siteConfig.hero.bgType === 'video' ? 'URL Vidéo' : 'URL Image'}</label>
                <input
                  value={siteConfig.hero.bgType === 'video' ? siteConfig.hero.videoUrl || '' : siteConfig.hero.image}
                  onChange={e => {
                    if (siteConfig.hero.bgType === 'video') {
                      setSiteConfig({ ...siteConfig, hero: { ...siteConfig.hero, videoUrl: e.target.value } });
                    } else {
                      setSiteConfig({ ...siteConfig, hero: { ...siteConfig.hero, image: e.target.value } });
                    }
                  }}
                  className="w-full p-3 border rounded-lg"
                  placeholder={siteConfig.hero.bgType === 'video' ? 'https://example.com/video.mp4' : 'https://example.com/image.jpg'}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-sm text-gray-500 uppercase flex items-center gap-2"><Type size={16} /> Informations de Contact</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input value={siteConfig.contact.phone} onChange={e => setSiteConfig({ ...siteConfig, contact: { ...siteConfig.contact, phone: e.target.value } })} className="w-full p-3 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input value={siteConfig.contact.email} onChange={e => setSiteConfig({ ...siteConfig, contact: { ...siteConfig.contact, email: e.target.value } })} className="w-full p-3 border rounded-lg" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
              <input value={siteConfig.contact.address} onChange={e => setSiteConfig({ ...siteConfig, contact: { ...siteConfig.contact, address: e.target.value } })} className="w-full p-3 border rounded-lg" />
            </div>
          </div>

          <button type="submit" disabled={isSaving} className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-60">
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
          </button>
        </form>
      )}
    </div>
  );

  // ─── MAIN RENDER ──────────────────────────────────────────────────────────
  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
    { id: 'products', label: 'Produits', icon: Package },
    { id: 'categories', label: 'Catégories', icon: Layers },
    { id: 'orders', label: 'Commandes', icon: ShoppingCart },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'stores', label: 'Magasins', icon: MapPin },
    { id: 'partners', label: 'Partenaires', icon: Briefcase },
    { id: 'content', label: 'Contenu', icon: Settings },
  ] as const;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-10 overflow-y-auto flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold font-display text-gray-900">TECH<span className="text-primary">ADMIN</span></h2>
        </div>
        <nav className="p-4 space-y-1 flex-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === id ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Icon size={20} /> {label}
              {id === 'orders' && orders.filter(o => o.status === 'pending').length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {orders.filter(o => o.status === 'pending').length}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-sm font-medium">
            <LogOut size={20} /> Se déconnecter
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 capitalize">
            {NAV_ITEMS.find(n => n.id === activeTab)?.label || activeTab}
          </h1>
          <div className="flex items-center gap-4">
            <button onClick={refreshData} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Actualiser">
              <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
            </button>
            <div className="flex items-center gap-3">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Admin')}&background=7c3aed&color=fff`}
                alt={user?.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
              />
              <div className="text-sm">
                <p className="font-bold text-gray-900">{user?.name}</p>
                <p className="text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'products' && renderProducts()}
            {activeTab === 'categories' && renderCategories()}
            {activeTab === 'orders' && renderOrders()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'stores' && renderStores()}
            {activeTab === 'partners' && renderPartners()}
            {activeTab === 'content' && renderContent()}
          </>
        )}
      </main>
    </div>
  );
}
