# MENUORA — Plateforme SaaS de Menus Digitaux avec QR Code pour Restaurants

> **MENUORA** est une solution SaaS multi-tenant complète, moderne et responsive permettant aux restaurants, cafés, fast-foods et établissements hôteliers en Algérie (et à l’international) de créer, personnaliser et gérer leur menu digital interactif accessible via un QR Code unique et permanent.

---

## 🌟 Points Forts & Fonctionnalités

1. **Multi-Tenant & Sécurité Maximale :**
   - Isolation stricte des données entre restaurants.
   - Modèle de permissions basé sur les rôles : **Super Admin**, **Restaurant Owner**, **Restaurant Staff**.
   - Politiques de sécurité Supabase **Row Level Security (RLS)** complètes (`supabase/schema.sql`).

2. **Menu Digital Public Exceptionnel (`/menu/:slug`) :**
   - Aucune application requise pour les clients, ouverture instantanée dans le navigateur mobile.
   - **Trilingue natif :** Français, Arabe avec support complet **RTL** (`dir="rtl"` et police Cairo), Anglais.
   - Recherche instantanée, carrousel horizontal des catégories avec badges, photographies culinaires HD.
   - Drawer de personnalisation de plat : Choix des tailles/portions (variantes de prix) et suppléments payants (fromage, sauce...).
   - **Commandes WhatsApp directes :** Panier interactif générant un message structuré avec table, client et total en Dinar Algérien (DZD).

3. **Dashboard Restaurateur Complet :**
   - **Vue générale :** KPIs en temps réel, graphiques de fréquentation sur 7 et 30 jours (Recharts), historique des activités.
   - **Gestion du restaurant :** Nom, logo, bannière, adresse, téléphone, code Wi-Fi client, horaires 7j/7, coordonnées GPS.
   - **Gestion des catégories & carte :** Création, réorganisation, désactivation, photos, plats recommandés ("Populaires").
   - **Studio QR Code :** Générateur haute résolution, intégration du logo au centre, téléchargement PNG & SVG, modèle d’impression PDF pour chevalets de table avec QR dédié par table (Table 1, Table 2, etc.).
   - **Personnalisation graphique en direct :** Palette de couleurs avec presets gourmands, styles de cartes (Moderne, Visuel, Compact), mode sombre/clair avec prévisualisation smartphone en temps réel.
   - **Statistiques & Analytics :** Plats les plus consultés, catégories favorites, scans par table.
   - **Gestion d'équipe & Abonnements :** Rôles gérants/serveurs, suivi des quotas du forfait (Starter, Professional, Business).

4. **Console Super Admin (`/admin`) :**
   - Supervision globale de tous les restaurants (activation, suspension).
   - Modification en direct des grilles tarifaires en Dinars Algériens (DZD).
   - Annuaire des utilisateurs et analytics globaux.

---

## 🚀 Démarrage Rapide

### Prérequis
- **Node.js** >= 18.x
- **npm** >= 9.x

### Installation
```bash
git clone <repo-url>
cd "Restaurant 2"
npm install
```

### Lancement en mode développement
```bash
npm run dev
```
L'application démarre sur `http://localhost:5173/`.

### Construction pour production
```bash
npm run build
```

---

## 🔑 Comptes de Démonstration Inclus

| Rôle | Nom | E-mail | Restaurant associé |
| :--- | :--- | :--- | :--- |
| **Restaurant Owner** | Amine Meziane | `owner@darelbey.dz` | *Dar El Bey* (Hydra, Alger) |
| **Super Admin** | Karim Benali | `admin@menuora.dz` | Console Super Admin |
| **Restaurant Staff** | Sarah Bouzid | `staff@darelbey.dz` | *Dar El Bey* (Service en salle) |
| **Owner (Fast-food)** | Yacine Kaci | `contact@smashburger.dz` | *Le Smash Burger* (Sidi Yahia) |

> 💡 *Une barre d'outils interactive "MENUORA DEMO BAR" est fixée en haut de l'écran pour basculer d'un compte à l'autre en un seul clic lors de vos tests et démonstrations.*

---

## 🗄️ Schéma Base de Données & Supabase

Le fichier SQL complet se trouve dans [`supabase/schema.sql`](file:///d:/Restaurant%202/supabase/schema.sql). Il comprend :
- 14 tables relationnelles avec contraintes de clés étrangères et index de performance.
- Les fonctions de sécurité `is_super_admin()` et `can_manage_restaurant(rest_id)`.
- Les politiques RLS (Row Level Security) protégeant chaque table.

Pour connecter votre projet Supabase Cloud :
1. Créez un projet sur [supabase.com](https://supabase.com).
2. Exécutez le script [`supabase/schema.sql`](file:///d:/Restaurant%202/supabase/schema.sql) dans le SQL Editor de Supabase.
3. Renseignez vos identifiants dans votre fichier `.env` :
   ```env
   VITE_SUPABASE_URL=https://votre-projet.supabase.co
   VITE_SUPABASE_ANON_KEY=votre-cle-anon
   ```

---

## 🎨 Palette de Couleurs & Design System

- **Primary :** `#E76F35` (Orange Gourmet d'Alger)
- **Secondary :** `#222222` (Charbon profond)
- **Background :** `#FAF9F6` (Blanc cassé chaleureux)
- **Success :** `#16A36A`
- **Danger :** `#DC4545`
- **Polices :** `Plus Jakarta Sans`, `Cairo` (Arabe RTL), `Inter`.
