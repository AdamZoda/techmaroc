import React, { useState, useEffect } from 'react';
import { mockBackend } from '../services/mockBackend';
import { Product, Order, User, Category, SiteConfig, Store, Partner, FilterOption } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Package, Users, ShoppingCart, DollarSign, Plus, Edit, Trash, Search, BarChart2, Settings, Layers, Image, Type, MapPin, Briefcase, Filter } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'orders' | 'users' | 'content' | 'stores' | 'partners'>('dashboard');
  const [stats, setStats] = useState({ sales: 0, orders: 0, users: 0, products: 0 });
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);

  // Form State for Product
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [productSpecs, setProductSpecs] = useState<{key: string, value: string}[]>([]);

  // ...

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'images', index?: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (field === 'image') {
          setCurrentProduct(prev => ({ ...prev, image: base64 }));
        } else if (field === 'images') {
          const newImages = [...(currentProduct.images || [])];
          if (index !== undefined) {
            newImages[index] = base64; // Replace existing (though usually we append)
          } else {
            newImages.push(base64);
          }
          setCurrentProduct(prev => ({ ...prev, images: newImages }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentProduct.name && currentProduct.price) {
      // Convert specs array back to object
      const specsObject: Record<string, string> = {};
      productSpecs.forEach(spec => {
        if (spec.key && spec.value) {
          specsObject[spec.key] = spec.value;
        }
      });

      const newProduct = {
        ...currentProduct,
        id: currentProduct.id || Math.random().toString(36).substr(2, 9),
        specs: specsObject,
        stock: currentProduct.stock || 0,
        image: currentProduct.image || 'https://picsum.photos/seed/new/400/400'
      } as Product;
      
      mockBackend.saveProduct(newProduct);
      refreshData();
      setIsEditingProduct(false);
      setCurrentProduct({});
      setProductSpecs([]);
    }
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure?')) {
      mockBackend.deleteProduct(id);
      refreshData();
    }
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentCategory.name && currentCategory.icon) {
      const newCategory = {
        ...currentCategory,
        id: currentCategory.id || currentCategory.name.toLowerCase().replace(/\s+/g, '-'),
        subCategories: currentCategory.subCategories || [],
        filters: currentCategory.filters || []
      } as Category;

      mockBackend.saveCategory(newCategory);
      refreshData();
      setIsEditingCategory(false);
      setCurrentCategory({});
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Are you sure?')) {
      mockBackend.deleteCategory(id);
      refreshData();
    }
  };

  const handleSaveStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStore.city && currentStore.address) {
      const newStore = {
        ...currentStore,
        id: currentStore.id || currentStore.city.toLowerCase().replace(/\s+/g, '-'),
      } as Store;
      mockBackend.saveStore(newStore);
      refreshData();
      setIsEditingStore(false);
      setCurrentStore({});
    }
  };

  const handleDeleteStore = (id: string) => {
    if (confirm('Are you sure?')) {
      mockBackend.deleteStore(id);
      refreshData();
    }
  };

  const handleSavePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPartner.name) {
      const newPartner = {
        ...currentPartner,
        id: currentPartner.id || currentPartner.name.toLowerCase().replace(/\s+/g, '-'),
      } as Partner;
      mockBackend.savePartner(newPartner);
      refreshData();
      setIsEditingPartner(false);
      setCurrentPartner({});
    }
  };

  const handleDeletePartner = (id: string) => {
    if (confirm('Are you sure?')) {
      mockBackend.deletePartner(id);
      refreshData();
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (siteConfig) {
      mockBackend.saveSiteConfig(siteConfig);
      window.dispatchEvent(new Event('siteConfigUpdated'));
      alert('Configuration saved!');
    }
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 text-primary rounded-xl">
              <DollarSign size={24} />
            </div>
            <span className="text-green-500 text-sm font-bold">+12%</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Total Sales</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.sales.toLocaleString()} MAD</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <ShoppingCart size={24} />
            </div>
            <span className="text-green-500 text-sm font-bold">+5%</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.orders}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
              <Users size={24} />
            </div>
            <span className="text-green-500 text-sm font-bold">+18%</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.users}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
              <Package size={24} />
            </div>
            <span className="text-gray-400 text-sm font-bold">0%</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.products}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-6">Sales Overview</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { name: 'Jan', value: 4000 }, { name: 'Feb', value: 3000 },
                { name: 'Mar', value: 2000 }, { name: 'Apr', value: 2780 },
                { name: 'May', value: 1890 }, { name: 'Jun', value: 2390 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={3} dot={{r: 4, fill: '#7c3aed'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-6">Orders Summary</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Mon', value: 12 }, { name: 'Tue', value: 19 },
                { name: 'Wed', value: 3 }, { name: 'Thu', value: 5 },
                { name: 'Fri', value: 2 }, { name: 'Sat', value: 3 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f9fafb'}} />
                <Bar dataKey="value" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-bold text-lg">Products Management</h3>
        <button 
          onClick={() => { 
            setCurrentProduct({}); 
            setProductSpecs([
              { key: 'Processor', value: '' },
              { key: 'GPU', value: '' },
              { key: 'RAM', value: '' },
              { key: 'Storage', value: '' }
            ]);
            setIsEditingProduct(true); 
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>
      
      {isEditingProduct ? (
        <div className="p-6 bg-gray-50">
          <form onSubmit={handleSaveProduct} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-2 gap-4">
              <input 
                placeholder="Product Name" 
                value={currentProduct.name || ''} 
                onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})}
                className="p-3 border rounded-lg"
                required
              />
              <input 
                type="number" 
                placeholder="Price" 
                value={currentProduct.price || ''} 
                onChange={e => setCurrentProduct({...currentProduct, price: Number(e.target.value)})}
                className="p-3 border rounded-lg"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <select 
                value={currentProduct.category || ''} 
                onChange={e => {
                  setCurrentProduct({...currentProduct, category: e.target.value, subCategory: ''});
                }}
                className="p-3 border rounded-lg"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              
              <select
                value={currentProduct.subCategory || ''}
                onChange={e => setCurrentProduct({...currentProduct, subCategory: e.target.value})}
                className="p-3 border rounded-lg"
                disabled={!currentProduct.category}
              >
                <option value="">Select Sub Category</option>
                {categories
                  .find(c => c.name === currentProduct.category)
                  ?.subCategories.map(sub => (
                    <option key={sub.id} value={sub.name}>{sub.name}</option>
                  ))
                }
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input 
                placeholder="Brand" 
                value={currentProduct.brand || ''} 
                onChange={e => setCurrentProduct({...currentProduct, brand: e.target.value})}
                className="p-3 border rounded-lg"
              />
              <div className="flex gap-2">
                <input 
                  placeholder="Main Image URL" 
                  value={currentProduct.image || ''} 
                  onChange={e => setCurrentProduct({...currentProduct, image: e.target.value})}
                  className="flex-1 p-3 border rounded-lg"
                />
                <label className="flex items-center justify-center px-4 bg-gray-100 border rounded-lg cursor-pointer hover:bg-gray-200">
                  <Image size={20} />
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'image')} />
                </label>
              </div>
            </div>

            {/* Description & Additional Images */}
            <div className="space-y-4">
              <textarea 
                placeholder="Product Description" 
                value={currentProduct.description || ''} 
                onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})}
                className="w-full p-3 border rounded-lg"
                rows={4}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images</label>
                <div className="space-y-2">
                  {(currentProduct.images || []).map((img, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input 
                        value={img} 
                        readOnly
                        className="flex-1 p-2 border rounded-lg bg-gray-50"
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          const newImages = [...(currentProduct.images || [])];
                          newImages.splice(idx, 1);
                          setCurrentProduct({...currentProduct, images: newImages});
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input 
                      id="newImageUrl"
                      placeholder="Add Image URL" 
                      className="flex-1 p-2 border rounded-lg"
                    />
                    <label className="flex items-center justify-center px-4 bg-gray-100 border rounded-lg cursor-pointer hover:bg-gray-200">
                      <Image size={20} />
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'images')} />
                    </label>
                    <button 
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('newImageUrl') as HTMLInputElement;
                        if (input.value) {
                          setCurrentProduct({
                            ...currentProduct,
                            images: [...(currentProduct.images || []), input.value]
                          });
                          input.value = '';
                        }
                      }}
                      className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Specifications */}
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-gray-500">Specifications</h4>
                <button 
                  type="button"
                  onClick={() => setProductSpecs([...productSpecs, { key: '', value: '' }])}
                  className="text-xs flex items-center gap-1 text-primary font-bold hover:underline"
                >
                  <Plus size={14} /> Add Spec
                </button>
              </div>
              
              <div className="space-y-2">
                {productSpecs.map((spec, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input 
                      placeholder="Spec Name (e.g. Processor)" 
                      value={spec.key} 
                      onChange={e => {
                        const newSpecs = [...productSpecs];
                        newSpecs[idx].key = e.target.value;
                        setProductSpecs(newSpecs);
                      }}
                      className="flex-1 p-2 border rounded-lg text-sm font-medium"
                    />
                    <input 
                      placeholder="Value (e.g. Intel i9)" 
                      value={spec.value} 
                      onChange={e => {
                        const newSpecs = [...productSpecs];
                        newSpecs[idx].value = e.target.value;
                        setProductSpecs(newSpecs);
                      }}
                      className="flex-1 p-2 border rounded-lg text-sm"
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        const newSpecs = [...productSpecs];
                        newSpecs.splice(idx, 1);
                        setProductSpecs(newSpecs);
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg">Save</button>
              <button type="button" onClick={() => setIsEditingProduct(false)} className="px-6 py-2 bg-gray-300 rounded-lg">Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="p-4 flex items-center gap-3">
                    <img src={product.image} alt="" className="w-10 h-10 rounded bg-gray-100 object-cover" />
                    <span className="font-medium text-gray-900">{product.name}</span>
                    {product.isBestSeller && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Best Seller</span>}
                  </td>
                  <td className="p-4 text-gray-500">{product.category}</td>
                  <td className="p-4 font-medium">{product.price.toLocaleString()} MAD</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => { 
                          setCurrentProduct(product); 
                          // Convert specs object to array for editing
                          const specsArray = Object.entries(product.specs || {}).map(([key, value]) => ({ key, value: value || '' }));
                          if (specsArray.length === 0) {
                             // Default specs if empty
                             specsArray.push({ key: 'Processor', value: '' });
                             specsArray.push({ key: 'GPU', value: '' });
                             specsArray.push({ key: 'RAM', value: '' });
                             specsArray.push({ key: 'Storage', value: '' });
                          }
                          setProductSpecs(specsArray);
                          setIsEditingProduct(true); 
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash size={16} />
                      </button>
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

  const renderCategories = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-bold text-lg">Categories Management</h3>
        <button 
          onClick={() => { setCurrentCategory({}); setIsEditingCategory(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      {isEditingCategory ? (
        <div className="p-6 bg-gray-50">
          <form onSubmit={handleSaveCategory} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-2 gap-4">
              <input 
                placeholder="Category Name" 
                value={currentCategory.name || ''} 
                onChange={e => setCurrentCategory({...currentCategory, name: e.target.value})}
                className="p-3 border rounded-lg"
                required
              />
              <input 
                placeholder="Icon Name (Lucide)" 
                value={currentCategory.icon || ''} 
                onChange={e => setCurrentCategory({...currentCategory, icon: e.target.value})}
                className="p-3 border rounded-lg"
                required
              />
            </div>

            {/* Subcategories Management */}
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-bold text-sm text-gray-500">Subcategories</h4>
              
              <div className="space-y-2">
                {currentCategory.subCategories?.map((sub, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded border">
                    <img src={sub.image} alt="" className="w-8 h-8 rounded object-cover bg-gray-100" />
                    <span className="flex-1 text-sm font-medium">{sub.name}</span>
                    <button 
                      type="button"
                      onClick={() => {
                        const newSubs = [...(currentCategory.subCategories || [])];
                        newSubs.splice(idx, 1);
                        setCurrentCategory({...currentCategory, subCategories: newSubs});
                      }}
                      className="text-red-500 hover:bg-red-50 p-1 rounded"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input 
                  id="newSubName"
                  placeholder="Subcategory Name" 
                  className="flex-1 p-2 border rounded text-sm"
                />
                <input 
                  id="newSubImage"
                  placeholder="Image URL" 
                  className="flex-1 p-2 border rounded text-sm"
                />
                <button 
                  type="button"
                  onClick={() => {
                    const nameInput = document.getElementById('newSubName') as HTMLInputElement;
                    const imageInput = document.getElementById('newSubImage') as HTMLInputElement;
                    
                    if (nameInput.value && imageInput.value) {
                      const newSub = {
                        id: nameInput.value.toLowerCase().replace(/\s+/g, '-'),
                        name: nameInput.value,
                        image: imageInput.value
                      };
                      setCurrentCategory({
                        ...currentCategory, 
                        subCategories: [...(currentCategory.subCategories || []), newSub]
                      });
                      nameInput.value = '';
                      imageInput.value = '';
                    }
                  }}
                  className="px-4 py-2 bg-gray-900 text-white rounded text-sm hover:bg-gray-800"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Filters Management */}
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-bold text-sm text-gray-500">Filters Management</h4>
              <div className="space-y-2">
                {currentCategory.filters?.map((filter, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded border">
                    <span className="font-bold text-xs uppercase bg-gray-100 px-2 py-1 rounded">{filter.type}</span>
                    <span className="flex-1 text-sm font-medium">{filter.name} (ID: {filter.id})</span>
                    <button 
                      type="button"
                      onClick={() => {
                        const newFilters = [...(currentCategory.filters || [])];
                        newFilters.splice(idx, 1);
                        setCurrentCategory({...currentCategory, filters: newFilters});
                      }}
                      className="text-red-500 hover:bg-red-50 p-1 rounded"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <input id="newFilterId" placeholder="ID (e.g., brand)" className="p-2 border rounded text-sm" />
                <input id="newFilterName" placeholder="Name (e.g., Marque)" className="p-2 border rounded text-sm" />
                <select id="newFilterType" className="p-2 border rounded text-sm">
                  <option value="checkbox">Checkbox</option>
                  <option value="range">Range</option>
                </select>
              </div>
              <div className="flex gap-2">
                <input id="newFilterOptions" placeholder="Options (comma separated) or Min-Max-Step" className="flex-1 p-2 border rounded text-sm" />
                <button 
                  type="button"
                  onClick={() => {
                    const idInput = document.getElementById('newFilterId') as HTMLInputElement;
                    const nameInput = document.getElementById('newFilterName') as HTMLInputElement;
                    const typeInput = document.getElementById('newFilterType') as HTMLSelectElement;
                    const optionsInput = document.getElementById('newFilterOptions') as HTMLInputElement;

                    if (idInput.value && nameInput.value) {
                      let newFilter: FilterOption = {
                        id: idInput.value,
                        name: nameInput.value,
                        type: typeInput.value as 'checkbox' | 'range'
                      };

                      if (newFilter.type === 'checkbox') {
                        newFilter.options = optionsInput.value.split(',').map(s => s.trim());
                      } else {
                        const [min, max, step] = optionsInput.value.split('-').map(Number);
                        newFilter.min = min || 0;
                        newFilter.max = max || 10000;
                        newFilter.step = step || 100;
                      }

                      setCurrentCategory({
                        ...currentCategory,
                        filters: [...(currentCategory.filters || []), newFilter]
                      });

                      idInput.value = '';
                      nameInput.value = '';
                      optionsInput.value = '';
                    }
                  }}
                  className="px-4 py-2 bg-gray-900 text-white rounded text-sm hover:bg-gray-800"
                >
                  Add Filter
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg">Save</button>
              <button type="button" onClick={() => setIsEditingCategory(false)} className="px-6 py-2 bg-gray-300 rounded-lg">Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Icon</th>
                <th className="p-4 font-medium">Subcategories</th>
                <th className="p-4 font-medium">Filters</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map(cat => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{cat.name}</td>
                  <td className="p-4 text-gray-500">{cat.icon}</td>
                  <td className="p-4 text-gray-500">{cat.subCategories.length}</td>
                  <td className="p-4 text-gray-500">{cat.filters?.length || 0}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => { setCurrentCategory(cat); setIsEditingCategory(true); }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash size={16} />
                      </button>
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

  const renderContent = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="font-bold text-lg mb-6">Content Management</h3>
      {siteConfig && (
        <form onSubmit={handleSaveConfig} className="space-y-8 max-w-3xl">
          {/* General */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-gray-500 uppercase flex items-center gap-2">
              <Settings size={16} /> General
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo Text</label>
                <input 
                  value={siteConfig.logo} 
                  onChange={e => setSiteConfig({...siteConfig, logo: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL (Optional)</label>
                <input 
                  value={siteConfig.logoUrl || ''} 
                  onChange={e => setSiteConfig({...siteConfig, logoUrl: e.target.value})}
                  placeholder="https://..."
                  className="w-full p-3 border rounded-lg"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                <div className="flex gap-2">
                  <input 
                    type="color"
                    value={siteConfig.primaryColor || '#7c3aed'} 
                    onChange={e => setSiteConfig({...siteConfig, primaryColor: e.target.value})}
                    className="h-12 w-20 p-1 border rounded-lg cursor-pointer"
                  />
                  <input 
                    type="text"
                    value={siteConfig.primaryColor || '#7c3aed'} 
                    onChange={e => setSiteConfig({...siteConfig, primaryColor: e.target.value})}
                    className="flex-1 p-3 border rounded-lg uppercase"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                <input 
                  type="number"
                  value={siteConfig.taxRate || 20} 
                  onChange={e => setSiteConfig({...siteConfig, taxRate: Number(e.target.value)})}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Hero */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-gray-500 uppercase flex items-center gap-2">
              <Image size={16} /> Hero Section
            </h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input 
                value={siteConfig.hero.title} 
                onChange={e => setSiteConfig({...siteConfig, hero: {...siteConfig.hero, title: e.target.value}})}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              <textarea 
                value={siteConfig.hero.subtitle} 
                onChange={e => setSiteConfig({...siteConfig, hero: {...siteConfig.hero, subtitle: e.target.value}})}
                className="w-full p-3 border rounded-lg"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Background Image URL</label>
              <input 
                value={siteConfig.hero.image} 
                onChange={e => setSiteConfig({...siteConfig, hero: {...siteConfig.hero, image: e.target.value}})}
                className="w-full p-3 border rounded-lg"
              />
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-gray-500 uppercase flex items-center gap-2">
              <Type size={16} /> Contact Info
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input 
                  value={siteConfig.contact.phone} 
                  onChange={e => setSiteConfig({...siteConfig, contact: {...siteConfig.contact, phone: e.target.value}})}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  value={siteConfig.contact.email} 
                  onChange={e => setSiteConfig({...siteConfig, contact: {...siteConfig.contact, email: e.target.value}})}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input 
                value={siteConfig.contact.address} 
                onChange={e => setSiteConfig({...siteConfig, contact: {...siteConfig.contact, address: e.target.value}})}
                className="w-full p-3 border rounded-lg"
              />
            </div>
          </div>

          <button type="submit" className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors">
            Save Changes
          </button>
        </form>
      )}
    </div>
  );

  const renderStores = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-bold text-lg">Store Management</h3>
        <button 
          onClick={() => { setCurrentStore({}); setIsEditingStore(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus size={18} /> Add Store
        </button>
      </div>

      {isEditingStore ? (
        <div className="p-6 bg-gray-50">
          <form onSubmit={handleSaveStore} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-2 gap-4">
              <input 
                placeholder="City" 
                value={currentStore.city || ''} 
                onChange={e => setCurrentStore({...currentStore, city: e.target.value})}
                className="p-3 border rounded-lg"
                required
              />
              <input 
                placeholder="Phone" 
                value={currentStore.phone || ''} 
                onChange={e => setCurrentStore({...currentStore, phone: e.target.value})}
                className="p-3 border rounded-lg"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input 
                placeholder="Hours" 
                value={currentStore.hours || ''} 
                onChange={e => setCurrentStore({...currentStore, hours: e.target.value})}
                className="p-3 border rounded-lg"
                required
              />
              <input 
                placeholder="Map Image URL" 
                value={currentStore.map || ''} 
                onChange={e => setCurrentStore({...currentStore, map: e.target.value})}
                className="p-3 border rounded-lg"
              />
            </div>
            <div>
              <input 
                placeholder="Address" 
                value={currentStore.address || ''} 
                onChange={e => setCurrentStore({...currentStore, address: e.target.value})}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            <div className="flex gap-4">
              <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg">Save</button>
              <button type="button" onClick={() => setIsEditingStore(false)} className="px-6 py-2 bg-gray-300 rounded-lg">Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-4 font-medium">City</th>
                <th className="p-4 font-medium">Address</th>
                <th className="p-4 font-medium">Phone</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stores.map(store => (
                <tr key={store.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{store.city}</td>
                  <td className="p-4 text-gray-500">{store.address}</td>
                  <td className="p-4 text-gray-500">{store.phone}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => { setCurrentStore(store); setIsEditingStore(true); }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteStore(store.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash size={16} />
                      </button>
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

  const renderPartners = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-bold text-lg">Partner Management</h3>
        <button 
          onClick={() => { setCurrentPartner({}); setIsEditingPartner(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus size={18} /> Add Partner
        </button>
      </div>

      {isEditingPartner ? (
        <div className="p-6 bg-gray-50">
          <form onSubmit={handleSavePartner} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-2 gap-4">
              <input 
                placeholder="Partner Name" 
                value={currentPartner.name || ''} 
                onChange={e => setCurrentPartner({...currentPartner, name: e.target.value})}
                className="p-3 border rounded-lg"
                required
              />
              <input 
                placeholder="Description" 
                value={currentPartner.desc || ''} 
                onChange={e => setCurrentPartner({...currentPartner, desc: e.target.value})}
                className="p-3 border rounded-lg"
              />
            </div>
            <div>
              <input 
                placeholder="Logo URL" 
                value={currentPartner.logo || ''} 
                onChange={e => setCurrentPartner({...currentPartner, logo: e.target.value})}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            <div className="flex gap-4">
              <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg">Save</button>
              <button type="button" onClick={() => setIsEditingPartner(false)} className="px-6 py-2 bg-gray-300 rounded-lg">Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-4 font-medium">Partner</th>
                <th className="p-4 font-medium">Description</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {partners.map(partner => (
                <tr key={partner.id} className="hover:bg-gray-50">
                  <td className="p-4 flex items-center gap-3">
                    <img src={partner.logo} alt="" className="w-10 h-10 object-contain bg-white border rounded p-1" />
                    <span className="font-medium text-gray-900">{partner.name}</span>
                  </td>
                  <td className="p-4 text-gray-500">{partner.desc}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => { setCurrentPartner(partner); setIsEditingPartner(true); }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeletePartner(partner.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash size={16} />
                      </button>
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-10 overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold font-display text-gray-900">TECH<span className="text-primary">ADMIN</span></h2>
        </div>
        <nav className="p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'dashboard' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <BarChart2 size={20} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'products' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Package size={20} /> Products
          </button>
          <button 
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'categories' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Layers size={20} /> Categories
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'orders' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <ShoppingCart size={20} /> Orders
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'users' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Users size={20} /> Users
          </button>
          <button 
            onClick={() => setActiveTab('stores')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'stores' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <MapPin size={20} /> Stores
          </button>
          <button 
            onClick={() => setActiveTab('partners')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'partners' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Briefcase size={20} /> Partners
          </button>
          <button 
            onClick={() => setActiveTab('content')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'content' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Settings size={20} /> Content
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 capitalize">{activeTab}</h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
              <img src="https://ui-avatars.com/api/?name=Admin+User" alt="Admin" />
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'categories' && renderCategories()}
        {activeTab === 'stores' && renderStores()}
        {activeTab === 'partners' && renderPartners()}
        {activeTab === 'content' && renderContent()}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-lg mb-4">Recent Orders</h3>
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50">
                  <div>
                    <p className="font-bold text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-500">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{order.total.toLocaleString()} MAD</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
