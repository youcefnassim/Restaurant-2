import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  Send,
  MessageCircle,
  Table,
  User,
  Phone,
  FileText,
  CheckCircle2,
} from 'lucide-react';

interface CartDrawerProps {
  restaurantName: string;
  restaurantPhone: string;
  whatsappNumber?: string;
  currency: string;
  language: 'fr' | 'ar' | 'en';
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  restaurantName,
  restaurantPhone,
  whatsappNumber,
  currency,
  language,
}) => {
  const {
    items,
    totalCount,
    totalAmount,
    updateQuantity,
    removeItem,
    clearCart,
    tableNumber,
    setTableNumber,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    orderType,
    setOrderType,
    notes,
    setNotes,
    generateWhatsAppLink,
  } = useCart();

  const [isOpen, setIsOpen] = useState(false);
  const isRTL = language === 'ar';

  if (totalCount === 0 && !isOpen) return null;

  const targetPhone = whatsappNumber || restaurantPhone;

  const handleSendOrder = () => {
    const waUrl = generateWhatsAppLink(targetPhone, restaurantName, currency);
    window.open(waUrl, '_blank');
  };

  return (
    <>
      {/* Sticky Bottom Floating Bar when closed */}
      {totalCount > 0 && !isOpen && (
        <div className="fixed bottom-4 inset-x-4 sm:max-w-md sm:mx-auto z-40 animate-in slide-in-from-bottom duration-300">
          <button
            onClick={() => setIsOpen(true)}
            className="w-full bg-secondary hover:bg-gray-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-white/10 group transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-black text-sm shadow-md">
                {totalCount}
              </div>
              <div className="text-left" dir="ltr">
                <div className="text-xs font-semibold text-gray-300">
                  {language === 'ar' ? 'طلبك الحالي' : 'Votre sélection'}
                </div>
                <div className="text-sm font-extrabold text-white">
                  {totalAmount.toLocaleString('fr-FR')} {currency}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-primary hover:bg-primary-hover px-4 py-2 rounded-xl text-xs font-bold transition">
              <span>{language === 'ar' ? 'مراجعة الطلب' : 'Voir le panier'}</span>
              <ShoppingBag className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Full Modal Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="fixed inset-0" onClick={() => setIsOpen(false)} />

          <div
            dir={isRTL ? 'rtl' : 'ltr'}
            className="relative bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[92vh] flex flex-col animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
          >
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-secondary">
                    {language === 'ar' ? 'طلبك عبر الواتساب' : 'Votre commande en cours'}
                  </h3>
                  <p className="text-[11px] text-text-muted">
                    {totalCount} {language === 'ar' ? 'عناصر' : 'articles sélectionnés'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-400 hover:text-secondary rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Items & Customer Form */}
            <div className="overflow-y-auto flex-1 p-5 space-y-6">
              {/* Order Items List */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl border border-gray-100 bg-bg/50 flex items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-secondary truncate">
                          {item.product_name}
                        </span>
                        <span className="text-xs font-black text-primary shrink-0 ml-2">
                          {(item.unit_price * item.quantity).toLocaleString('fr-FR')} {currency}
                        </span>
                      </div>

                      {item.selected_variant && (
                        <div className="text-[11px] text-text-muted">
                          Portion: {item.selected_variant.name}
                        </div>
                      )}

                      {item.selected_extras.length > 0 && (
                        <div className="text-[10px] text-gray-500">
                          + {item.selected_extras.map((e) => e.name).join(', ')}
                        </div>
                      )}

                      {item.instructions && (
                        <div className="text-[10px] text-primary italic mt-0.5">
                          Note: {item.instructions}
                        </div>
                      )}
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center bg-white border border-gray-200 rounded-xl p-0.5 gap-1 shrink-0">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-lg text-secondary flex items-center justify-center hover:bg-gray-100"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-secondary">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-lg text-secondary flex items-center justify-center hover:bg-gray-100"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Options */}
              <div className="space-y-4 pt-3 border-t border-gray-100">
                <h4 className="font-extrabold text-xs text-secondary uppercase tracking-wider">
                  {language === 'ar' ? 'بيانات التوصيل أو الطاولة' : 'Coordonnées & Type de commande'}
                </h4>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderType('dine_in')}
                    className={`py-2 px-2 text-center rounded-xl text-xs font-bold transition border ${
                      orderType === 'dine_in'
                        ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    {language === 'ar' ? 'على الطاولة' : 'Sur place'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('takeaway')}
                    className={`py-2 px-2 text-center rounded-xl text-xs font-bold transition border ${
                      orderType === 'takeaway'
                        ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    {language === 'ar' ? 'استلام سفري' : 'À emporter'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('delivery')}
                    className={`py-2 px-2 text-center rounded-xl text-xs font-bold transition border ${
                      orderType === 'delivery'
                        ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    {language === 'ar' ? 'توصيل' : 'Livraison'}
                  </button>
                </div>

                {orderType === 'dine_in' && (
                  <div>
                    <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1">
                      {language === 'ar' ? 'رقم الطاولة' : 'Numéro de Table'}
                    </label>
                    <input
                      type="number"
                      value={tableNumber || ''}
                      onChange={(e) => setTableNumber(parseInt(e.target.value) || null)}
                      placeholder={language === 'ar' ? 'مثال: 5' : 'Ex: 4'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-primary focus:border-primary transition"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1">
                      {language === 'ar' ? 'الاسم واللقب' : 'Votre nom'}
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ex: Yacine"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-primary focus:border-primary transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1">
                      {language === 'ar' ? 'رقم الهاتف' : 'Téléphone'}
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="0550..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-primary focus:border-primary transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1">
                    {language === 'ar' ? 'ملاحظات إضافية' : 'Instructions / Remarques'}
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={
                      language === 'ar'
                        ? 'أي تفاصيل ترغب في إبلاغ المطعم بها...'
                        : 'Instructions spéciales pour la cuisine...'
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-primary focus:border-primary transition"
                  />
                </div>
              </div>
            </div>

            {/* Footer Summary & WhatsApp Send */}
            <div className="p-5 bg-bg border-t border-gray-100 space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="font-extrabold text-sm text-secondary">
                  {language === 'ar' ? 'المجموع الإجمالي' : 'Total de la commande :'}
                </span>
                <span className="text-xl font-black text-primary">
                  {totalAmount.toLocaleString('fr-FR')} {currency}
                </span>
              </div>

              <button
                onClick={handleSendOrder}
                className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-black text-sm text-white bg-[#25D366] hover:bg-[#20BD5A] shadow-lg shadow-[#25D366]/20 transition duration-200"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>
                  {language === 'ar'
                    ? 'إرسال الطلب عبر WhatsApp'
                    : 'Envoyer ma commande via WhatsApp'}
                </span>
              </button>

              <div className="flex justify-between items-center text-[11px] text-text-muted px-1">
                <span>Paiement au comptoir ou à table</span>
                <button
                  onClick={clearCart}
                  className="text-danger hover:underline font-semibold"
                >
                  {language === 'ar' ? 'إفراغ السلة' : 'Vider le panier'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

