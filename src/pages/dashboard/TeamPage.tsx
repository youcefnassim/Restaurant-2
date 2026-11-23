import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { RestaurantMember } from '../../types';
import { Users, Plus, Trash2, Mail, Shield, CheckCircle2, X } from 'lucide-react';

export const TeamPage: React.FC = () => {
  const { activeRestaurant } = useAuth();

  if (!activeRestaurant) {
    return <div className="text-center py-12">Aucun restaurant sélectionné</div>;
  }

  const [members, setMembers] = useState<RestaurantMember[]>(
    dataService.getMembers(activeRestaurant.id)
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'manager' | 'staff'>('staff');

  const refreshList = () => {
    setMembers(dataService.getMembers(activeRestaurant.id));
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    dataService.addMember({
      restaurant_id: activeRestaurant.id,
      user_id: `user-${Date.now()}`,
      email,
      full_name: fullName,
      role,
    });
    setModalOpen(false);
    setEmail('');
    setFullName('');
    refreshList();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Voulez-vous retirer ce membre de l’équipe ?')) {
      dataService.deleteMember(id);
      refreshList();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-secondary">Équipe & Accès restaurant</h2>
          <p className="text-xs text-text-muted">
            Attribuez des accès sécurisés à vos gérants et serveurs pour mettre à jour la carte et les disponibilités.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm shadow-primary/20 transition self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Inviter un collaborateur</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="divide-y divide-gray-100">
          {members.map((mem) => (
            <div key={mem.id} className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                  {mem.full_name.charAt(0)}
                </div>
                <div className="truncate">
                  <div className="font-extrabold text-sm text-secondary truncate">{mem.full_name}</div>
                  <div className="text-xs text-text-muted flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{mem.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    mem.role === 'owner'
                      ? 'bg-amber-100 text-amber-800'
                      : mem.role === 'manager'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {mem.role === 'owner' ? 'Propriétaire' : mem.role === 'manager' ? 'Gérant' : 'Serveur'}
                </span>

                {mem.role !== 'owner' && (
                  <button
                    onClick={() => handleDelete(mem.id)}
                    className="p-2 text-gray-400 hover:text-danger hover:bg-red-50 rounded-xl transition"
                    title="Retirer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-extrabold text-base text-secondary">Ajouter un membre</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400 hover:text-secondary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1">
                  Nom et prénom
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: Bilal Hadj"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1">
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="bilal@darelbey.dz"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1">
                  Rôle & Permissions
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white"
                >
                  <option value="manager">Gérant (Peut modifier la carte et les prix)</option>
                  <option value="staff">Serveur (Peut basculer les disponibilités en rupture)</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

