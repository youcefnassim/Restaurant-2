import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { dataService } from '../../services/dataService';
import { useCart } from '../../context/CartContext';
import { Product, Category, Restaurant, RestaurantTheme } from '../../types';
import { ProductDetailModal } from '../../components/menu/ProductDetailModal';
import { CartDrawer } from '../../components/menu/CartDrawer';
import { FoodARViewerModal } from '../../components/menu/FoodARViewerModal';
import {
  Search,
  MapPin,
  Clock,
  Phone,
  Wifi,
  Globe,
  Share2,
  Star,
  ChevronUp,
  Info,
  QrCode,
  Utensils,
  X,
  AlertCircle,
  ShoppingBag,
  Camera,
} from 'lucide-react';

export const MenuPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const tableParam = searchParams.get('table');

  const { setTableNumber } = useCart();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [theme, setTheme] = useState<RestaurantTheme | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);
  const [arProduct, setArProduct] = useState<Product | null>(null);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Language state: 'fr' | 'ar' | 'en'
  const [language, setLanguage] = useState<'fr' | 'ar' | 'en'>('fr');

  useEffect(() => {
    if (!slug) return;
    const rest = dataService.getRestaurantBySlug(slug);
    if (rest) {
      setRestaurant(rest);
      setLanguage(rest.default_language || 'fr');
      setTheme(dataService.getTheme(rest.id));
      setCategories(dataService.getCategories(rest.id).filter((c) => c.is_active));
      setProducts(dataService.getProducts(rest.id));

      const parsedTable = tableParam ? parseInt(tableParam) : null;
      if (parsedTable) {
        setTableNumber(parsedTable);
      }

      // Record scan in analytics
      dataService.recordView(rest.id, parsedTable || undefined);
    }
  }, [slug, tableParam, setTableNumber]);

  // Handle scroll to top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isRTL = language === 'ar';
  const primaryColor = theme?.primary_color || '#E76F35';
  const isDark = theme?.theme_mode === 'dark';

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const name = language === 'ar' && p.name_ar ? p.name_ar : p.name;
      const desc = language === 'ar' && p.description_ar ? p.description_ar : p.description || '';

      const matchesSearch =
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        desc.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || p.category_id === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory, language]);

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
          <Utensils className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-secondary">Menu introuvable</h2>
        <p className="text-sm text-text-muted mt-2 max-w-sm">
          Le restaurant associé à ce QR Code n'existe pas ou a été déplacé.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 bg-primary text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md"
        >
          <span>Retour à l'accueil MENUORA</span>
        </Link>
      </div>
    );
  }

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`min-h-screen pb-32 transition-colors ${
        isDark ? 'bg-gray-950 text-white' : 'bg-[#FAF9F6] text-[#242424]'
      }`}
      style={{
        fontFamily: isRTL ? 'Cairo, Tajawal, sans-serif' : 'Plus Jakarta Sans, sans-serif',
      }}
    >
      {/* Top Floating Control Bar: Language Switcher & Info */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 py-2.5 flex items-center justify-between shadow-xs">
        {/* Table number indicator if present */}
        <div className="flex items-center gap-2">
          {tableParam ? (
            <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-black">
              <QrCode className="w-3.5 h-3.5" />
              <span>
                {language === 'ar' ? `طاولة رقم ${tableParam}` : `Table N° ${tableParam}`}
              </span>
            </span>
          ) : (
            <span className="text-xs font-extrabold text-secondary dark:text-white truncate">
              {restaurant.name}
            </span>
          )}
        </div>

        {/* Trilingual Switcher */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setLanguage('fr')}
              className={`px-2 py-1 rounded-lg transition ${
                language === 'fr'
                  ? 'bg-white dark:bg-gray-700 text-secondary dark:text-white shadow-xs'
                  : 'text-gray-500'
              }`}
            >
              FR
            </button>
            <button
              onClick={() => setLanguage('ar')}
              className={`px-2.5 py-1 rounded-lg transition ${
                language === 'ar'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-gray-500'
              }`}
            >
              العربية
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded-lg transition ${
                language === 'en'
                  ? 'bg-white dark:bg-gray-700 text-secondary dark:text-white shadow-xs'
                  : 'text-gray-500'
              }`}
            >
              EN
            </button>
          </div>

          <button
            onClick={() => setInfoModalOpen(true)}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-secondary dark:text-white hover:bg-gray-200 transition"
            title="Informations restaurant"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cover Image Banner */}
      <div className="relative h-48 sm:h-64 lg:h-80 w-full overflow-hidden bg-gray-900">
        <img
          src={restaurant.cover_url}
          alt={restaurant.name}
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

        {/* Floating Restaurant Identity */}
        <div className="absolute bottom-4 inset-x-4 max-w-4xl mx-auto flex items-end gap-3 sm:gap-5">
          <img
            src={restaurant.logo_url}
            alt={restaurant.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white shadow-xl bg-white shrink-0"
          />
          <div className="text-white min-w-0">
            <h1 className="text-xl sm:text-3xl font-black tracking-tight leading-tight truncate">
              {restaurant.name}
            </h1>
            <p className="text-xs sm:text-sm text-gray-200 line-clamp-1 mt-0.5">
              {restaurant.description}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Info Bar */}
      <div className="max-w-4xl mx-auto px-4 py-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-text-muted dark:text-gray-400 border-b border-gray-200/60 dark:border-gray-800">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="truncate">{restaurant.address}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-green-500 shrink-0" />
          <span>{language === 'ar' ? 'مفتوح الآن' : 'Ouvert aujourd\'hui'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
          <a href={`tel:${restaurant.phone}`} className="hover:underline font-semibold">
            {restaurant.phone}
          </a>
        </div>
        {restaurant.wifi_password && (
          <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md text-[11px] font-mono">
            <Wifi className="w-3 h-3 text-primary" />
            <span>Wi-Fi: {restaurant.wifi_password}</span>
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="max-w-4xl mx-auto px-4 pt-4">
        <div className="relative">
          <Search
            className={`w-4 h-4 text-gray-400 absolute ${
              isRTL ? 'right-3.5' : 'left-3.5'
            } top-1/2 -translate-y-1/2`}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'ar'
                ? 'ابحث عن طبقك المفضل، مكونات...'
                : 'Rechercher un plat, une boisson, un ingrédient...'
            }
            className={`w-full ${
              isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
            } py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs sm:text-sm focus:ring-2 focus:ring-primary focus:border-primary shadow-xs transition`}
          />
        </div>
      </div>

      {/* Horizontally Scrollable Category Bar */}
      <div className="sticky top-12 z-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 py-3 mt-3 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 flex gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all ${
              selectedCategory === 'all'
                ? 'text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-800 text-secondary dark:text-gray-300 hover:bg-gray-200'
            }`}
            style={{
              backgroundColor: selectedCategory === 'all' ? primaryColor : undefined,
            }}
          >
            {language === 'ar' ? 'الكل' : 'Tous les plats'} ({products.length})
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const catName =
              language === 'ar' && cat.name_ar ? cat.name_ar : language === 'en' && cat.name_en ? cat.name_en : cat.name;
            const count = products.filter((p) => p.category_id === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-secondary dark:text-gray-300 hover:bg-gray-200'
                }`}
                style={{
                  backgroundColor: isSelected ? primaryColor : undefined,
                }}
              >
                <span>{catName}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Catalog */}
      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8">
            <Utensils className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <h3 className="font-extrabold text-base text-secondary dark:text-white">
              {language === 'ar' ? 'لا توجد نتائج مطابقة' : 'Aucun plat correspondant'}
            </h3>
            <p className="text-xs text-text-muted mt-1">
              {language === 'ar'
                ? 'جرب البحث بكلمات أخرى أو اختر قسماً مختلفاً.'
                : 'Essayez une autre recherche ou sélectionnez une autre catégorie.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {filteredProducts.map((product) => {
              const productName =
                language === 'ar' && product.name_ar ? product.name_ar : language === 'en' && product.name_en ? product.name_en : product.name;
              const productDesc =
                language === 'ar' && product.description_ar
                  ? product.description_ar
                  : language === 'en' && product.description_en
                  ? product.description_en
                  : product.description;

              const isAvailable = product.is_available;

              return (
                <div
                  key={product.id}
                  onClick={() => isAvailable && setActiveModalProduct(product)}
                  className={`group relative bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between ${
                    isAvailable ? 'cursor-pointer hover:border-primary/40' : 'opacity-60 cursor-not-allowed bg-gray-50'
                  }`}
                >
                  <div>
                    {/* Food Photo Container */}
                    <div className="relative h-44 sm:h-48 w-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <img
                        src={product.image_url}
                        alt={productName}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                      {/* Badges */}
                      <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} flex flex-wrap gap-1.5`}>
                        {product.is_popular && (
                          <span className="bg-amber-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                            <Star className="w-3 h-3 fill-current" />
                            <span>{language === 'ar' ? 'الأكثر طلباً' : 'Populaire'}</span>
                          </span>
                        )}
                        {/* Direct AR Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setArProduct(product);
                          }}
                          className="bg-primary/95 hover:bg-primary text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md backdrop-blur-md transition hover:scale-105 active:scale-95"
                          title={language === 'ar' ? 'عرض على الطاولة بالواقع المعزز' : 'Voir sur ma table (AR 3D)'}
                        >
                          <Camera className="w-3 h-3" />
                          <span>3D AR</span>
                        </button>
                        {!isAvailable && (
                          <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md">
                            {language === 'ar' ? 'غير متوفر حالياً' : 'Épuisé'}
                          </span>
                        )}
                      </div>

                      {/* Price badge right bottom */}
                      <div
                        className={`absolute bottom-3 ${
                          isRTL ? 'left-3' : 'right-3'
                        } bg-secondary/95 dark:bg-black/90 backdrop-blur-md text-white px-3 py-1 rounded-xl text-xs sm:text-sm font-black shadow-md`}
                      >
                        {product.price.toLocaleString('fr-FR')} {restaurant.currency}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 space-y-1.5">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-extrabold text-sm sm:text-base text-secondary dark:text-white leading-snug group-hover:text-primary transition-colors">
                          {productName}
                        </h4>
                      </div>

                      {productDesc && (
                        <p className="text-xs text-text-muted dark:text-gray-400 line-clamp-2 leading-relaxed">
                          {productDesc}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bottom details indicators */}
                  <div className="p-4 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] text-text-muted">
                    {product.prep_time_minutes ? (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>~{product.prep_time_minutes} min</span>
                      </span>
                    ) : (
                      <span></span>
                    )}

                    {isAvailable && (
                      <span
                        className="font-bold text-xs group-hover:underline flex items-center gap-1"
                        style={{ color: primaryColor }}
                      >
                        <span>{language === 'ar' ? 'التفاصيل والخيارات' : 'Personnaliser'}</span>
                        <span>→</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Scroll to Top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-20 ${
            isRTL ? 'left-4' : 'right-4'
          } z-30 w-11 h-11 rounded-full bg-secondary text-white flex items-center justify-center shadow-xl hover:bg-black transition`}
          aria-label="Retour en haut"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={activeModalProduct}
        onClose={() => setActiveModalProduct(null)}
        currency={restaurant.currency}
        isOrderingEnabled={restaurant.is_ordering_enabled}
        language={language}
      />

      {/* Direct Food AR Table Viewer Modal */}
      {arProduct && (
        <FoodARViewerModal
          product={arProduct}
          onClose={() => setArProduct(null)}
          currency={restaurant.currency}
          language={language}
        />
      )}

      {/* Cart Drawer for WhatsApp checkout */}
      {restaurant.is_ordering_enabled && (
        <CartDrawer
          restaurantName={restaurant.name}
          restaurantPhone={restaurant.phone}
          whatsappNumber={restaurant.whatsapp_number}
          currency={restaurant.currency}
          language={language}
        />
      )}

      {/* Restaurant Info & Hours Modal */}
      {infoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-800 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
              <h3 className="font-extrabold text-base text-secondary dark:text-white">
                {language === 'ar' ? 'معلومات المطعم' : 'Informations de l\'établissement'}
              </h3>
              <button
                onClick={() => setInfoModalOpen(false)}
                className="p-1 text-gray-400 hover:text-secondary rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <strong className="block text-secondary dark:text-white font-bold mb-1">Adresse</strong>
                <p className="text-text-muted dark:text-gray-400">{restaurant.address}</p>
              </div>

              <div>
                <strong className="block text-secondary dark:text-white font-bold mb-1">Téléphone</strong>
                <p className="text-primary font-bold">{restaurant.phone}</p>
              </div>

              {restaurant.wifi_password && (
                <div>
                  <strong className="block text-secondary dark:text-white font-bold mb-1">Code Wi-Fi</strong>
                  <p className="font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded-lg text-secondary dark:text-white inline-block">
                    {restaurant.wifi_password}
                  </p>
                </div>
              )}

              <div>
                <strong className="block text-secondary dark:text-white font-bold mb-2">
                  Horaires de service
                </strong>
                <div className="space-y-1 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                  {Object.entries(restaurant.opening_hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-gray-600 dark:text-gray-300">
                      <span className="capitalize">{day}</span>
                      <span className="font-semibold">{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

