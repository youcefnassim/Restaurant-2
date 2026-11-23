import React, { useState } from 'react';
import { Product, ProductExtra, ProductVariant } from '../../types';
import { useCart } from '../../context/CartContext';
import {
  X,
  Plus,
  Minus,
  Star,
  Clock,
  Check,
  ShoppingBag,
  Sparkles,
  Info,
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  currency: string;
  isOrderingEnabled: boolean;
  language: 'fr' | 'ar' | 'en';
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  currency,
  isOrderingEnabled,
  language,
}) => {
  if (!product) return null;

  const { addItem } = useCart();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants?.find((v) => v.is_default) || product.variants?.[0]
  );
  const [selectedExtras, setSelectedExtras] = useState<ProductExtra[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isRTL = language === 'ar';

  const basePrice = product.price;
  const variantAdjustment = selectedVariant?.price_adjustment || 0;
  const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0);
  const unitPrice = basePrice + variantAdjustment + extrasTotal;
  const totalPrice = unitPrice * quantity;

  const toggleExtra = (extra: ProductExtra) => {
    if (selectedExtras.some((e) => e.id === extra.id)) {
      setSelectedExtras(selectedExtras.filter((e) => e.id !== extra.id));
    } else {
      setSelectedExtras([...selectedExtras, extra]);
    }
  };

  const handleAddToCart = () => {
    addItem(product, selectedVariant, selectedExtras, quantity, instructions);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 600);
  };

  // Localized texts
  const displayName =
    language === 'ar' && product.name_ar ? product.name_ar : language === 'en' && product.name_en ? product.name_en : product.name;
  const displayDescription =
    language === 'ar' && product.description_ar
      ? product.description_ar
      : language === 'en' && product.description_en
      ? product.description_en
      : product.description;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} />

      <div
        dir={isRTL ? 'rtl' : 'ltr'}
        className="relative bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-4 ${
            isRTL ? 'left-4' : 'right-4'
          } z-20 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 backdrop-blur-md transition`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 pb-4">
          {/* Hero Food Photo */}
          <div className="relative h-60 sm:h-72 w-full bg-gray-100">
            <img
              src={product.image_url}
              alt={displayName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            <div className={`absolute bottom-4 ${isRTL ? 'right-4' : 'left-4'} flex flex-wrap gap-2`}>
              {product.is_popular && (
                <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{language === 'ar' ? 'الأكثر طلباً' : 'Populaire'}</span>
                </span>
              )}
              {product.prep_time_minutes && (
                <span className="bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    ~{product.prep_time_minutes} {language === 'ar' ? 'دقيقة' : 'min'}
                  </span>
                </span>
              )}
            </div>
          </div>

          {/* Details Body */}
          <div className="p-5 sm:p-6 space-y-5">
            <div>
              <div className="flex justify-between items-start gap-4">
                <h3 className="text-xl sm:text-2xl font-black text-secondary leading-snug">
                  {displayName}
                </h3>
                <span className="text-lg sm:text-xl font-black text-primary shrink-0">
                  {unitPrice.toLocaleString('fr-FR')} {currency}
                </span>
              </div>

              {displayDescription && (
                <p className="mt-2 text-sm text-text-muted leading-relaxed">
                  {displayDescription}
                </p>
              )}
            </div>

            {/* Variants Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="pt-3 border-t border-gray-100">
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2.5">
                  {language === 'ar' ? 'اختر الحجم أو الوجبة' : 'Choisissez votre portion'}
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {product.variants.map((variant) => {
                    const isSelected = selectedVariant?.id === variant.id;
                    const variantTitle =
                      language === 'ar' && variant.name_ar ? variant.name_ar : variant.name;

                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        className={`p-3 rounded-2xl border text-start transition flex items-center justify-between ${
                          isSelected
                            ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary font-bold'
                            : 'border-gray-200 text-secondary hover:border-gray-300'
                        }`}
                      >
                        <span className="text-xs">{variantTitle}</span>
                        {variant.price_adjustment > 0 && (
                          <span className="text-xs text-text-muted font-bold">
                            +{variant.price_adjustment} {currency}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Extras / Toppings Checklist */}
            {product.extras && product.extras.length > 0 && (
              <div className="pt-3 border-t border-gray-100">
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2.5">
                  {language === 'ar' ? 'إضافات ومقبلات اختيارية' : 'Suppléments & Extras'}
                </label>
                <div className="space-y-2">
                  {product.extras.map((extra) => {
                    const isChecked = selectedExtras.some((e) => e.id === extra.id);
                    const extraTitle =
                      language === 'ar' && extra.name_ar ? extra.name_ar : extra.name;

                    return (
                      <div
                        key={extra.id}
                        onClick={() => toggleExtra(extra)}
                        className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition ${
                          isChecked
                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-lg border flex items-center justify-center transition ${
                              isChecked
                                ? 'bg-primary border-primary text-white'
                                : 'border-gray-300 bg-white'
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span className="text-xs font-semibold text-secondary">
                            {extraTitle}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-primary">
                          +{extra.price} {currency}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Special Instructions (Only if ordering is enabled) */}
            {isOrderingEnabled && (
              <div className="pt-3 border-t border-gray-100">
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1.5">
                  {language === 'ar' ? 'ملاحظات خاصة (بدون بصل، صلصة جانباً...)' : 'Instructions particulières'}
                </label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder={
                    language === 'ar'
                      ? 'مثال: بدون بصل، فلفل حار جانبي...'
                      : 'Ex: Sans oignons, sauce à part...'
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-primary focus:border-primary transition"
                />
              </div>
            )}
          </div>
        </div>

        {/* Sticky Action Footer */}
        {isOrderingEnabled ? (
          <div className="p-4 sm:p-5 bg-white border-t border-gray-100 flex items-center justify-between gap-4">
            {/* Quantity stepper */}
            <div className="flex items-center bg-gray-100 rounded-2xl p-1 gap-2">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-xl bg-white text-secondary flex items-center justify-center font-bold shadow-xs hover:bg-gray-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-6 text-center text-sm font-black text-secondary">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-xl bg-white text-secondary flex items-center justify-center font-bold shadow-xs hover:bg-gray-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to order button */}
            <button
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-bold text-white shadow-md transition duration-200 ${
                addedAnimation
                  ? 'bg-success scale-98'
                  : 'bg-primary hover:bg-primary-hover shadow-primary/20'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                {addedAnimation
                  ? language === 'ar'
                    ? 'تمت الإضافة بنجاح ✓'
                    : 'Ajouté au panier ! ✓'
                  : language === 'ar'
                  ? `أضف للطلب (${totalPrice.toLocaleString('fr-FR')} ${currency})`
                  : `Ajouter (${totalPrice.toLocaleString('fr-FR')} ${currency})`}
              </span>
            </button>
          </div>
        ) : (
          <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
            <button
              onClick={onClose}
              className="w-full py-3 bg-secondary text-white font-bold text-xs rounded-2xl hover:bg-gray-800 transition"
            >
              {language === 'ar' ? 'إغلاق' : 'Fermer'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

