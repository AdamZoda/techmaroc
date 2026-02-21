import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Camera, Save, LogOut, Lock, Package } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfile, logout, isAuthenticated, getOrders } = useUser();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    avatar: ''
  });
  const [orders, setOrders] = useState<any[]>([]);

  // Password Change State
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        avatar: user.avatar || ''
      });
      setOrders(getOrders());
    }
  }, [user, isAuthenticated, navigate, getOrders]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }
    // Simulate password change
    alert("Mot de passe modifié avec succès !");
    setIsChangingPassword(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
            <h1 className="text-2xl font-bold font-display text-gray-900">Mon Profil</h1>
            <button 
              onClick={() => { logout(); navigate('/'); }}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-sm font-bold"
            >
              <LogOut size={18} /> Se déconnecter
            </button>
          </div>

          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
                    <img 
                      src={formData.avatar || user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full cursor-pointer shadow-lg hover:bg-primary-dark transition-colors">
                      <Camera size={16} />
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900 text-lg">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.role === 'admin' ? 'Administrateur' : 'Client'}</p>
                </div>
              </div>

              {/* Form Section */}
              <div className="flex-1 w-full">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <User size={16} /> Nom complet
                      </label>
                      <input
                        type="text"
                        disabled={!isEditing}
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <Mail size={16} /> Email
                      </label>
                      <input
                        type="email"
                        disabled
                        value={user.email}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl opacity-60 cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <Phone size={16} /> Téléphone
                      </label>
                      <input
                        type="tel"
                        disabled={!isEditing}
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        placeholder="Ajouter un numéro"
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-100">
                    {isEditing ? (
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            setFormData({
                              name: user.name || '',
                              phone: user.phone || '',
                              avatar: user.avatar || ''
                            });
                          }}
                          className="px-6 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors flex items-center gap-2 shadow-lg shadow-primary/30"
                        >
                          <Save size={18} /> Enregistrer
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2"
                      >
                        Modifier le profil
                      </button>
                    )}
                  </div>
                </form>

                {/* Password Change Section */}
                <div className="mt-12 pt-8 border-t border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Lock size={18} /> Sécurité
                  </h2>
                  
                  {!isChangingPassword ? (
                    <button 
                      onClick={() => setIsChangingPassword(true)}
                      className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors text-sm"
                    >
                      Changer mon mot de passe
                    </button>
                  ) : (
                    <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mot de passe actuel</label>
                        <input 
                          type="password" 
                          required
                          value={passwordData.currentPassword}
                          onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nouveau mot de passe</label>
                        <input 
                          type="password" 
                          required
                          value={passwordData.newPassword}
                          onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                          className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Confirmer le nouveau mot de passe</label>
                        <input 
                          type="password" 
                          required
                          value={passwordData.confirmPassword}
                          onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button 
                          type="button" 
                          onClick={() => setIsChangingPassword(false)}
                          className="px-4 py-2 text-gray-500 hover:text-gray-700 font-bold text-sm"
                        >
                          Annuler
                        </button>
                        <button 
                          type="submit"
                          className="px-6 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark text-sm shadow-lg shadow-primary/20"
                        >
                          Mettre à jour
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Order History Section */}
                <div className="mt-12 pt-8 border-t border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Package size={18} /> Mes Commandes
                  </h2>
                  
                  {orders.length === 0 ? (
                    <p className="text-gray-500 text-sm">Aucune commande passée pour le moment.</p>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order, idx) => (
                        <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-bold text-gray-900">{order.id}</p>
                              <p className="text-xs text-gray-500">{order.date}</p>
                            </div>
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg">
                              {order.status === 'delivered' ? 'Livrée' : 'Confirmée'}
                            </span>
                          </div>
                          <div className="space-y-1">
                            {order.items.map((item: any, i: number) => (
                              <div key={i} className="flex justify-between text-sm">
                                <span className="text-gray-600">{item.quantity}x {item.name}</span>
                                <span className="font-medium">{(item.price * item.quantity).toLocaleString()} MAD</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-sm font-bold text-gray-900">Total</span>
                            <span className="text-primary font-bold">{order.total.toLocaleString()} MAD</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
