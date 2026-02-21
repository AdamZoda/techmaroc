import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, CreditCard, Truck, ArrowRight, Download, Home, ChevronRight } from 'lucide-react';

// OTP Input Component
const OtpInput = ({ length, onComplete }: { length: number; onComplete: (otp: string) => void }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.value && element.nextSibling) {
      (element.nextSibling as HTMLInputElement).focus();
    }

    if (newOtp.every(v => v !== '')) {
      onComplete(newOtp.join(''));
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {otp.map((data, index) => (
        <input
          className="w-12 h-12 text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-xl font-bold"
          type="text"
          name="otp"
          maxLength={1}
          key={index}
          value={data}
          onChange={e => handleChange(e.target, index)}
          onFocus={e => e.target.select()}
        />
      ))}
    </div>
  );
};

export default function CheckoutPage() {
  const { items, total, clearCart, isCartLoading } = useCart();
  const { user, saveOrder, isLoading: isUserLoading } = useUser();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<'info' | 'phone' | 'payment' | 'success'>('info');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    phone: ''
  });
  
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [orderId, setOrderId] = useState('');
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [orderTotal, setOrderTotal] = useState(0);

  useEffect(() => {
    if (isUserLoading || isCartLoading) return;

    if (!user) {
      navigate('/login');
      return;
    }
    if (items.length === 0 && step !== 'success') {
      navigate('/');
    }
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
        phone: user.phone || ''
      }));
    }
  }, [user, items, navigate, step, isUserLoading, isCartLoading]);

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('phone');
  };

  const sendOtp = () => {
    if (!formData.phone) {
      alert('Veuillez entrer un numéro de téléphone');
      return;
    }
    setOtpSent(true);
    // Simulate OTP send
    alert(`Code de vérification envoyé au ${formData.phone}: 1234`);
  };

  const verifyOtp = (otp: string) => {
    if (otp === '1234') {
      setOtpVerified(true);
      setStep('payment');
    } else {
      alert('Code incorrect');
    }
  };

  const handlePlaceOrder = () => {
    const newOrderId = `ORD-${Math.floor(Math.random() * 100000)}`;
    setOrderId(newOrderId);
    setOrderItems([...items]);
    setOrderTotal(total);
    
    // Save order to user history
    if (user) {
      saveOrder({
        id: newOrderId,
        customerName: user.name,
        date: new Date().toLocaleDateString(),
        total: total,
        status: 'confirmed',
        items: items.map(i => ({ ...i, productId: i.id })) // Store full item details for simplicity in this mock
      });
    }
    
    clearCart();
    setStep('success');
  };

  const generatePDF = async () => {
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;

      // ... (Header and Customer Info same as before)
      doc.setFontSize(20);
      doc.setTextColor(124, 58, 237); // Primary color
      doc.text('TECHMAROC', 14, 22);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text('Facture & Confirmation de Commande', 14, 28);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 14, 22, { align: 'right' });
      doc.text(`Commande #: ${orderId}`, pageWidth - 14, 28, { align: 'right' });

      // Customer Info
      doc.setDrawColor(200);
      doc.line(14, 35, pageWidth - 14, 35);
      
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text('Informations Client:', 14, 45);
      doc.setFontSize(10);
      doc.text(`Nom: ${formData.name}`, 14, 52);
      doc.text(`Email: ${formData.email}`, 14, 58);
      doc.text(`Téléphone: ${formData.phone}`, 14, 64);
      doc.text(`Adresse: ${formData.address}, ${formData.city}`, 14, 70);

      // Items Table
      const tableRows = orderItems.map(item => [
        item.name,
        `${item.quantity}`,
        `${item.price.toLocaleString()} MAD`,
        `${(item.price * item.quantity).toLocaleString()} MAD`
      ]);

      autoTable(doc, {
        startY: 80,
        head: [['Produit', 'Qté', 'Prix Unitaire', 'Total']],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [124, 58, 237] },
        styles: { fontSize: 9 },
      });

      // Totals
      // @ts-ignore
      const finalY = doc.lastAutoTable.finalY + 10;
      doc.text(`Sous-total: ${orderTotal.toLocaleString()} MAD`, pageWidth - 14, finalY, { align: 'right' });
      doc.text(`Livraison: Gratuite`, pageWidth - 14, finalY + 6, { align: 'right' });
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`TOTAL: ${orderTotal.toLocaleString()} MAD`, pageWidth - 14, finalY + 14, { align: 'right' });

      // ... (Terms & Footer same as before)
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100);
      const termsY = finalY + 30;
      doc.text('Conditions et Restrictions:', 14, termsY);
      doc.text('- Les produits électroniques bénéficient d\'une garantie de 1 an.', 14, termsY + 5);
      doc.text('- Les retours sont acceptés sous 7 jours dans l\'emballage d\'origine.', 14, termsY + 10);
      doc.text('- Pour toute assistance, contactez support@techmaroc.com.', 14, termsY + 15);

      doc.save(`commande-${orderId}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Erreur lors de la génération du PDF.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-primary flex items-center gap-1"><Home size={14} /> Accueil</Link>
          <ChevronRight size={14} />
          <span className="text-primary font-bold">Paiement</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Info */}
            <div className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${step === 'info' ? 'border-primary ring-1 ring-primary' : 'border-gray-100 opacity-60'}`}>
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step === 'info' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>1</div>
                <h2 className="text-lg font-bold">Informations de livraison</h2>
              </div>
              
              {step === 'info' && (
                <form onSubmit={handleInfoSubmit} className="space-y-4 ml-12">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                      <input 
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full p-3 border rounded-xl focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input 
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full p-3 border rounded-xl focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                    <input 
                      required
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                      className="w-full p-3 border rounded-xl focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                    <input 
                      required
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                      className="w-full p-3 border rounded-xl focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div className="flex justify-end pt-4">
                    <button type="submit" className="px-6 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors">
                      Continuer
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Step 2: Phone Verification */}
            <div className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${step === 'phone' ? 'border-primary ring-1 ring-primary' : 'border-gray-100 opacity-60'}`}>
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step === 'phone' ? 'bg-primary text-white' : step === 'payment' || step === 'success' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {step === 'payment' || step === 'success' ? <CheckCircle size={18} /> : '2'}
                </div>
                <h2 className="text-lg font-bold">Vérification Mobile</h2>
              </div>

              {step === 'phone' && (
                <div className="ml-12 space-y-6">
                  {!otpSent ? (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">Veuillez entrer votre numéro de téléphone pour recevoir un code de vérification.</p>
                      <div className="flex gap-2">
                        <input 
                          type="tel"
                          placeholder="06 00 00 00 00"
                          value={formData.phone}
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                          className="flex-1 p-3 border rounded-xl focus:ring-primary focus:border-primary"
                        />
                        <button 
                          onClick={sendOtp}
                          className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
                        >
                          Vérifier
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-4">Entrez le code à 4 chiffres envoyé au {formData.phone}</p>
                        <OtpInput length={4} onComplete={verifyOtp} />
                        <button onClick={() => setOtpSent(false)} className="text-xs text-primary mt-4 hover:underline">
                          Changer de numéro
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Step 3: Payment */}
            <div className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${step === 'payment' ? 'border-primary ring-1 ring-primary' : 'border-gray-100 opacity-60'}`}>
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step === 'payment' ? 'bg-primary text-white' : step === 'success' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {step === 'success' ? <CheckCircle size={18} /> : '3'}
                </div>
                <h2 className="text-lg font-bold">Paiement</h2>
              </div>

              {step === 'payment' && (
                <div className="ml-12 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <Truck size={24} />
                      <span className="font-bold text-sm">Paiement à la livraison</span>
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <CreditCard size={24} />
                      <span className="font-bold text-sm">Carte Bancaire</span>
                    </button>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button 
                      onClick={handlePlaceOrder}
                      className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
                    >
                      CONFIRMER LA COMMANDE <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-32">
              <h3 className="font-bold text-lg mb-4">Récapitulatif</h3>
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <img src={item.image} alt="" className="w-16 h-16 rounded-lg object-cover bg-gray-50" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900 line-clamp-2">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.quantity} x {item.price.toLocaleString()} MAD</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Sous-total</span>
                  <span className="font-bold">{total.toLocaleString()} MAD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Livraison</span>
                  <span className="text-green-600 font-bold">Gratuite</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-100 mt-2">
                  <span>Total</span>
                  <span className="text-primary">{total.toLocaleString()} MAD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal Overlay */}
      {step === 'success' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-fade-in">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold font-display text-gray-900 mb-2">Commande Confirmée !</h2>
            <p className="text-gray-600 mb-8">
              Merci pour votre commande. Votre numéro de suivi est <span className="font-bold text-gray-900">{orderId}</span>.
            </p>
            
            <div className="space-y-3">
              <button 
                onClick={generatePDF}
                className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <Download size={18} /> Télécharger la facture (PDF)
              </button>
              <button 
                onClick={() => navigate('/')}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
