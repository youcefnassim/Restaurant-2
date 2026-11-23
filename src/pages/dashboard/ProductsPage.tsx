import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { Product, ProductExtra, ProductVariant } from '../../types';
import {
  UtensilsCrossed,
  Plus,
  Search,
  Filter,
  Pencil,
  Copy,
  Trash2,
  CheckCircle2,
  XCircle,
  Star,
  Clock,
  X,
  Save,
  Sliders,
  Layers,
  Sparkles,
} from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const { activeRestaurant } = useAuth();

  if (!activeRestaurant) {
    return <div className="text-center py-12">Aucun restaurant sélectionné</div>;
  }

  const [products, setProducts] = useState<Product[]>(
    dataService.getProducts(activeRestaurant.id)
  );
  const categories = dataService.getCategories(activeRestaurant.id);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterAvailability, setFilterAvailability] = useState<'all' | 'available' | 'unavailable'>('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isPopular, setIsPopular] = useState(false);
  const [prepTime, setPrepTime] = useState('15');
  const [sortOrder, setSortOrder] = useState('1');

  // Variants and extras
  const [variants, setVariants] = useState<Omit<ProductVariant, 'id' | 'product_id'>[]>([]);
  const [extras, setExtras] = useState<Omit<ProductExtra, 'id' | 'product_id'>[]>([]);

  const refreshList = () => {
    setProducts(dataService.getProducts(activeRestaurant.id));
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName('');
    setNameAr('');
    setCategoryId(categories[0]?.id || '');
    setPrice('1500');
    setDescription('');
    setDescriptionAr('');
    setImageUrl('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80');
    setIsAvailable(true);
    setIsPopular(false);
    setPrepTime('15');
    setSortOrder((products.length + 1).toString());
    setVariants([]);
    setExtras([]);
    setModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setNameAr(p.name_ar || '');
    setCategoryId(p.category_id);
    setPrice(p.price.toString());
    setDescription(p.description || '');
    setDescriptionAr(p.description_ar || '');
    setImageUrl(p.image_url);
    setIsAvailable(p.is_available);
    setIsPopular(p.is_popular);
    setPrepTime(p.prep_time_minutes?.toString() || '15');
    setSortOrder(p.sort_order.toString());
    setVariants(p.variants?.map((v) => ({ name: v.name, name_ar: v.name_ar, price_adjustment: v.price_adjustment, is_default: v.is_default })) || []);
    setExtras(p.extras?.map((e) => ({ name: e.name, name_ar: e.name_ar, price: e.price, is_active: e.is_active })) || []);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce plat de votre carte ?')) {
      dataService.deleteProduct(id);
      refreshList();
    }
  };

  const handleDuplicate = (id: string) => {
    dataService.duplicateProduct(id);
    refreshList();
  };

  const handleToggleAvailability = (p: Product) => {
    dataService.updateProduct(p.id, { is_available: !p.is_available });
    refreshList();
  };

  const handleTogglePopular = (p: Product) => {
    dataService.updateProduct(p.id, { is_popular: !p.is_popular });
    refreshList();
  };

  const addVariantRow = () => {
    setVariants([...variants, { name: 'Grande Portion', price_adjustment: 300, is_default: false }]);
  };

  const removeVariantRow = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const addExtraRow = () => {
    setExtras([...extras, { name: 'Fromage supplémentaire', price: 150, is_active: true }]);
  };

  const removeExtraRow = (index: number) => {
    setExtras(extras.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedVariants = variants.map((v, i) => ({
      id: `var-${Date.now()}-${i}`,
      product_id: editingProduct?.id || '',
      ...v,
    }));

    const formattedExtras = extras.map((ex, i) => ({
      id: `ext-${Date.now()}-${i}`,
      product_id: editingProduct?.id || '',
      ...ex,
    }));

    if (editingProduct) {
      dataService.updateProduct(editingProduct.id, {
        category_id: categoryId,
        name,
        name_ar: nameAr,
        description,
        description_ar: descriptionAr,
        price: parseFloat(price) || 0,
        image_url: imageUrl,
        is_available: isAvailable,
        is_popular: isPopular,
        prep_time_minutes: parseInt(prepTime) || 15,
        sort_order: parseInt(sortOrder) || 1,
        variants: formattedVariants,
        extras: formattedExtras,
      });
    } else {
      dataService.createProduct({
        restaurant_id: activeRestaurant.id,
        category_id: categoryId,
        name,
        name_ar: nameAr,
        description,
        description_ar: descriptionAr,
        price: parseFloat(price) || 0,
        image_url: imageUrl,
        is_available: isAvailable,
        is_popular: isPopular,
        prep_time_minutes: parseInt(prepTime) || 15,
        sort_order: parseInt(sortOrder) || 1,
        variants: formattedVariants,
        extras: formattedExtras,
      });
    }

    setModalOpen(false);
    refreshList();
  };

  // Filtered items
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.name_ar && p.name_ar.includes(searchQuery));
    const matchesCategory = selectedCategory === 'all' || p.category_id === selectedCategory;
    const matchesAvailability =
      filterAvailability === 'all' ||
      (filterAvailability === 'available' && p.is_available) ||
      (filterAvailability === 'unavailable' && !p.is_available);

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-secondary">Carte & Plats ({products.length})</h2>
          <p className="text-xs text-text-muted">
            Gérez vos plats, tarifs, photos, tailles et suppléments en temps réel.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm shadow-primary/20 transition self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un plat</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un plat..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-primary focus:border-primary transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
          >
            <option value="all">Toutes les catégories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={filterAvailability}
            onChange={(e) => setFilterAvailability(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
          >
            <option value="all">Tous les états</option>
            <option value="available">Disponibles</option>
            <option value="unavailable">En rupture</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((p) => {
          const categoryName = categories.find((c) => c.id === p.category_id)?.name || 'Général';

          return (
            <div
              key={p.id}
              className={`bg-white rounded-2xl border overflow-hidden shadow-xs flex flex-col justify-between transition ${
                p.is_available
                  ? 'border-gray-100 hover:border-primary/40'
                  : 'border-gray-200/60 bg-gray-50/70 opacity-70'
              }`}
            >
              <div>
                {/* Photo & Badges */}
                <div className="relative h-44 overflow-hidden bg-gray-100">
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-extrabold bg-secondary/80 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg">
                      {categoryName}
                    </span>
                    {p.is_popular && (
                      <span className="text-[10px] font-extrabold bg-amber-500 text-white px-2 py-1 rounded-lg flex items-center gap-1 shadow-xs">
                        <Star className="w-3 h-3 fill-white" />
                        <span>Populaire</span>
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => handleTogglePopular(p)}
                      title={p.is_popular ? 'Retirer des populaires' : 'Marquer comme populaire'}
                      className={`p-1.5 rounded-lg shadow-sm transition ${
                        p.is_popular
                          ? 'bg-amber-400 text-white'
                          : 'bg-white/80 backdrop-blur-xs text-gray-500 hover:text-amber-500'
                      }`}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <div className="absolute bottom-3 right-3 bg-secondary/90 backdrop-blur-xs text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-sm">
                    {p.price.toLocaleString('fr-FR')} {activeRestaurant.currency}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-extrabold text-sm text-secondary truncate">{p.name}</h4>
                  </div>
                  {p.name_ar && (
                    <div className="text-xs font-semibold text-primary" dir="rtl">
                      {p.name_ar}
                    </div>
                  )}
                  <p className="text-xs text-text-muted line-clamp-2">{p.description}</p>

                  {/* Variants and Extras tags */}
                  {(p.variants?.length || p.extras?.length) ? (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {p.variants && p.variants.length > 0 && (
                        <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-md">
                          {p.variants.length} variante(s)
                        </span>
                      )}
                      {p.extras && p.extras.length > 0 && (
                        <span className="text-[10px] bg-purple-50 text-purple-700 font-semibold px-2 py-0.5 rounded-md">
                          {p.extras.length} supplément(s)
                        </span>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Action bar */}
              <div className="p-4 pt-2 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => handleToggleAvailability(p)}
                  className={`text-xs font-semibold flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition ${
                    p.is_available
                      ? 'bg-success/10 text-success hover:bg-success/20'
                      : 'bg-danger/10 text-danger hover:bg-danger/20'
                  }`}
                >
                  {p.is_available ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Disponible</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Rupture de stock</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDuplicate(p.id)}
                    className="p-1.5 text-gray-500 hover:text-secondary hover:bg-gray-100 rounded-lg transition"
                    title="Dupliquer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition"
                    title="Modifier"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1.5 text-gray-400 hover:text-danger hover:bg-red-50 rounded-lg transition"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <h3 className="font-extrabold text-lg text-secondary">
                {editingProduct ? 'Modifier le plat' : 'Ajouter un nouveau plat'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-gray-400 hover:text-secondary rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1">
                    Nom du plat (Français)
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Couscous Royal, Smash Burger..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1">
                    Nom du plat (العربية)
                  </label>
                  <input
                    type="text"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    dir="rtl"
                    placeholder="كسكسي عاصمي فاخر"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1">
                    Catégorie
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1">
                    Prix ({activeRestaurant.currency})
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1">
                    Temps prép. (min)
                  </label>
                  <input
                    type="number"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1">
                  Description détaillée (Français)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Détaillez les ingrédients, la préparation..."
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1">
                  Description (العربية)
                </label>
                <textarea
                  rows={2}
                  value={descriptionAr}
                  onChange={(e) => setDescriptionAr(e.target.value)}
                  dir="rtl"
                  placeholder="الوصف بالعربية..."
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1">
                  URL de la photo (Haute résolution)
                </label>
                <div className="flex gap-3">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
                  />
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-12 h-10 rounded-lg object-cover border border-gray-200 shrink-0"
                    />
                  )}
                </div>
              </div>

              {/* Status and toggles */}
              <div className="flex flex-wrap gap-6 p-4 bg-bg rounded-2xl border border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-secondary">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <span>Produit disponible en salle</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-secondary">
                  <input
                    type="checkbox"
                    checked={isPopular}
                    onChange={(e) => setIsPopular(e.target.checked)}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <span className="flex items-center gap-1 text-amber-600">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>Mettre en avant (Badge Populaire)</span>
                  </span>
                </label>
              </div>

              {/* Variants Section */}
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h5 className="font-extrabold text-xs text-secondary uppercase tracking-wider">
                      Variantes de taille / portion (facultatif)
                    </h5>
                    <p className="text-[11px] text-text-muted">Ex: Petite, Moyenne, Grande taille, Plat Duo</p>
                  </div>
                  <button
                    type="button"
                    onClick={addVariantRow}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Ajouter variante</span>
                  </button>
                </div>

                {variants.map((v, idx) => (
                  <div key={idx} className="flex gap-2 items-center mb-2">
                    <input
                      type="text"
                      placeholder="Nom (ex: Grande)"
                      value={v.name}
                      onChange={(e) => {
                        const copy = [...variants];
                        copy[idx].name = e.target.value;
                        setVariants(copy);
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs"
                    />
                    <input
                      type="number"
                      placeholder="+ Prix DA"
                      value={v.price_adjustment}
                      onChange={(e) => {
                        const copy = [...variants];
                        copy[idx].price_adjustment = parseFloat(e.target.value) || 0;
                        setVariants(copy);
                      }}
                      className="w-24 px-3 py-1.5 rounded-lg border border-gray-200 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => removeVariantRow(idx)}
                      className="text-gray-400 hover:text-danger p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Extras Section */}
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h5 className="font-extrabold text-xs text-secondary uppercase tracking-wider">
                      Suppléments payants (facultatif)
                    </h5>
                    <p className="text-[11px] text-text-muted">Ex: Fromage supplémentaire, sauce, garnitures</p>
                  </div>
                  <button
                    type="button"
                    onClick={addExtraRow}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Ajouter supplément</span>
                  </button>
                </div>

                {extras.map((ex, idx) => (
                  <div key={idx} className="flex gap-2 items-center mb-2">
                    <input
                      type="text"
                      placeholder="Nom (ex: Fromage extra)"
                      value={ex.name}
                      onChange={(e) => {
                        const copy = [...extras];
                        copy[idx].name = e.target.value;
                        setExtras(copy);
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs"
                    />
                    <input
                      type="number"
                      placeholder="Prix DA"
                      value={ex.price}
                      onChange={(e) => {
                        const copy = [...extras];
                        copy[idx].price = parseFloat(e.target.value) || 0;
                        setExtras(copy);
                      }}
                      className="w-24 px-3 py-1.5 rounded-lg border border-gray-200 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => removeExtraRow(idx)}
                      className="text-gray-400 hover:text-danger p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm shadow-primary/20 transition"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingProduct ? 'Mettre à jour' : 'Enregistrer le plat'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

