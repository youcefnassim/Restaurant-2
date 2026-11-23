import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Restaurant, UserRole } from '../types';
import { dataService } from '../services/dataService';

interface AuthContextType {
  user: UserProfile | null;
  activeRestaurant: Restaurant | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (fullName: string, email: string, password?: string, restaurantName?: string) => Promise<{ success: boolean; restaurant?: Restaurant }>;
  logout: () => void;
  setActiveRestaurant: (restaurant: Restaurant) => void;
  refreshRestaurant: () => void;
  switchUserRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = 'menuora_auth_user';
const ACTIVE_REST_KEY = 'menuora_active_restaurant';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeRestaurant, setActiveRestaurantState] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore session
    try {
      const savedUserId = localStorage.getItem(AUTH_USER_KEY);
      const savedRestId = localStorage.getItem(ACTIVE_REST_KEY);

      if (savedUserId) {
        const foundUser = dataService.getUserById(savedUserId);
        if (foundUser) {
          setUser(foundUser);
          if (savedRestId) {
            const foundRest = dataService.getRestaurantById(savedRestId);
            if (foundRest) setActiveRestaurantState(foundRest);
          } else if (foundUser.restaurant_id) {
            const defaultRest = dataService.getRestaurantById(foundUser.restaurant_id);
            if (defaultRest) setActiveRestaurantState(defaultRest);
          }
        }
      } else {
        // Default to Dar El Bey Owner for quick demo exploration
        const defaultOwner = dataService.getUserByEmail('owner@darelbey.dz');
        if (defaultOwner) {
          setUser(defaultOwner);
          const defaultRest = dataService.getRestaurantById('rest-dar-el-bey');
          if (defaultRest) setActiveRestaurantState(defaultRest);
        }
      }
    } catch (e) {
      console.error('Failed to restore auth session:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setActiveRestaurant = (restaurant: Restaurant) => {
    setActiveRestaurantState(restaurant);
    localStorage.setItem(ACTIVE_REST_KEY, restaurant.id);
  };

  const refreshRestaurant = () => {
    if (activeRestaurant) {
      const refreshed = dataService.getRestaurantById(activeRestaurant.id);
      if (refreshed) setActiveRestaurantState(refreshed);
    }
  };

  const login = async (email: string, _password?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const foundUser = dataService.getUserByEmail(email);
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem(AUTH_USER_KEY, foundUser.id);

        if (foundUser.restaurant_id) {
          const rest = dataService.getRestaurantById(foundUser.restaurant_id);
          if (rest) {
            setActiveRestaurantState(rest);
            localStorage.setItem(ACTIVE_REST_KEY, rest.id);
          }
        } else {
          // If super admin, set first restaurant as active context
          const allRest = dataService.getRestaurants();
          if (allRest.length > 0) {
            setActiveRestaurantState(allRest[0]);
          }
        }
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    fullName: string,
    email: string,
    _password?: string,
    restaurantName?: string
  ): Promise<{ success: boolean; restaurant?: Restaurant }> => {
    setIsLoading(true);
    try {
      const existing = dataService.getUserByEmail(email);
      if (existing) {
        throw new Error('Un compte avec cette adresse email existe déjà');
      }

      const newUser = dataService.createUser({
        email,
        full_name: fullName,
        role: 'restaurant_owner',
      });

      let createdRestaurant: Restaurant | undefined;

      if (restaurantName) {
        const slug = restaurantName
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');

        createdRestaurant = dataService.createRestaurant({
          owner_id: newUser.id,
          name: restaurantName,
          slug: `${slug}-${Math.floor(1000 + Math.random() * 9000)}`,
          description: `Bienvenue chez ${restaurantName}. Découvrez nos délicieux plats préparés avec passion.`,
          logo_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80',
          cover_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
          address: 'Alger, Algérie',
          phone: '+213 550 00 00 00',
          opening_hours: {
            monday: '10:00 - 23:00',
            tuesday: '10:00 - 23:00',
            wednesday: '10:00 - 23:00',
            thursday: '10:00 - 23:00',
            friday: '15:00 - 00:00',
            saturday: '10:00 - 00:00',
            sunday: '10:00 - 23:00',
          },
          social_links: {},
          gps_coordinates: { lat: 36.7538, lng: 3.0588 },
          default_language: 'fr',
          currency: 'DZD',
          status: 'active',
          is_ordering_enabled: false,
          table_count: 15,
        });

        // Update user's restaurant_id
        dataService.updateUser(newUser.id, { restaurant_id: createdRestaurant.id });
        newUser.restaurant_id = createdRestaurant.id;
        setActiveRestaurantState(createdRestaurant);
        localStorage.setItem(ACTIVE_REST_KEY, createdRestaurant.id);
      }

      setUser(newUser);
      localStorage.setItem(AUTH_USER_KEY, newUser.id);

      return { success: true, restaurant: createdRestaurant };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setActiveRestaurantState(null);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(ACTIVE_REST_KEY);
  };

  const switchUserRole = (role: UserRole) => {
    if (role === 'super_admin') {
      const admin = dataService.getUserByEmail('admin@menuora.dz');
      if (admin) {
        setUser(admin);
        localStorage.setItem(AUTH_USER_KEY, admin.id);
      }
    } else if (role === 'restaurant_owner') {
      const owner = dataService.getUserByEmail('owner@darelbey.dz');
      if (owner) {
        setUser(owner);
        const rest = dataService.getRestaurantById('rest-dar-el-bey');
        if (rest) setActiveRestaurant(rest);
        localStorage.setItem(AUTH_USER_KEY, owner.id);
      }
    } else if (role === 'restaurant_staff') {
      const staff = dataService.getUserByEmail('staff@darelbey.dz');
      if (staff) {
        setUser(staff);
        const rest = dataService.getRestaurantById('rest-dar-el-bey');
        if (rest) setActiveRestaurant(rest);
        localStorage.setItem(AUTH_USER_KEY, staff.id);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeRestaurant,
        isLoading,
        login,
        signup,
        logout,
        setActiveRestaurant,
        refreshRestaurant,
        switchUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

