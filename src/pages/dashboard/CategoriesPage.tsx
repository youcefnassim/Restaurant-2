import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { Category } from '../../types';
import {
  Layers,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  ArrowUpDown,
  X,
  Save,
  Image as ImageIcon,
} from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const { activeRestaurant } = useAuth();

  if (!activeRestaurant) {
    return <div className="text-center py-12">Aucun restaurant sélectionné</div>;
  }

  const [categories, setCategories] = useState<Category[]>(
    dataService.getCategories(activeRestaurant.id)
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [sortOrder, setSortOrder] = useState('1');
  const [isActive, setIsActive] = useState(true);

  const refreshList = () => {
    setCategories(dataService.getCategories(activeRestaurant.id));
  };

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('');
    setNameAr('');
    setNameEn('');
    setDescription('');
    setImageUrl('');
    setSortOrder((categories.length + 1).toString());
    setIsActive(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setNameAr(cat.name_ar || '');
    setNameEn(cat.name_en || '');
    setDescription(cat.description || '');
    setImageUrl(cat.image_url || '');
    setSortOrder(cat.sort_order.toString());
    setIsActive(cat.is_active);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette catégorie ? Les produits associés devront être reclassés.')) {
      dataService.deleteCategory(id);
      refreshList();
    }
  };

  const handleToggleActive = (cat: Category) => {
    dataService.updateCategory(cat.id, { is_active: !cat.is_active });
    refreshList();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      dataService.updateCategory(editingCategory.id, {
        name,
        name_ar: nameAr,
        name_en: nameEn,
        description,
        image_url: imageUrl,
        sort_order: parseInt(sortOrder) || 1,
        is_active: isActive,
      });
    } else {
      dataService.createCategory({
        restaurant_id: activeRestaurant.id,
        name,
        name_ar: nameAr,
        name_en: nameEn,
        description,
        image_url: imageUrl,
        sort_order: parseInt(sortOrder) || 1,
        is_active: isActive,
      });
    }
    setModalOpen(false);
    refreshList();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-secondary">Catégories de votre carte</h2>
          <p className="text-xs text-text-muted">
            Organisez vos menus en sections cohérentes : Entrées, Plats traditionnels, Grillades, Desserts...
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm shadow-primary/20 transition self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle catégorie</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`bg-white rounded-2xl border p-5 transition shadow-xs flex flex-col justify-between ${
              cat.is_active ? 'border-gray-100 hover:border-primary/40' : 'border-gray-200/60 opacity-60 bg-gray-50'
            }`}
          >
            <div>
              <div className="flex items-start gap-4">
                {cat.image_url ? (
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="w-16 h-16 rounded-xl object-cover border border-gray-100 shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Layers className="w-7 h-7" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-extrabold text-sm text-secondary truncate">{cat.name}</h4>
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                      #{cat.sort_order}
                    </span>
                  </div>

                  {cat.name_ar && (
                    <p className="text-xs font-medium text-primary mt-0.5" dir="rtl">
                      {cat.name_ar}
                    </p>
                  )}

                  {cat.description && (
                    <p className="text-xs text-text-muted line-clamp-2 mt-1">{cat.description}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => handleToggleActive(cat)}
                className={`text-xs font-semibold flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition ${
                  cat.is_active
                    ? 'bg-success/10 text-success hover:bg-success/20'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {cat.is_active ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Masquée</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition"
                  title="Modifier"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-1.5 text-gray-400 hover:text-danger hover:bg-red-50 rounded-lg transition"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <h3 className="font-extrabold text-lg text-secondary">
                {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-gray-400 hover:text-secondary rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1">
                  Nom (Français)
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Plats Traditionnels, Pizzas, Boissons..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1">
                    Nom (العربية)
                  </label>
                  <input
                    type="text"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    dir="rtl"
                    placeholder="الأطباق التقليدية"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1">
                    Nom (English)
                  </label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="Traditional Dishes"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1">
                  Description courte
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Couscous, rechta et tajines mijotés au feu doux..."
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1">
                  URL de l'image représentative
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-center pt-1">
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1">
                    Ordre d'affichage
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="catIsActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <label htmlFor="catIsActive" className="text-xs font-bold text-secondary">
                    Afficher sur le menu
                  </label>
                </div>
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
                  <span>{editingCategory ? 'Mettre à jour' : 'Enregistrer'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

