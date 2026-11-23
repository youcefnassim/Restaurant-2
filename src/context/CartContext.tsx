import React, { createContext, useContext, useState } from 'react';
import { OrderItem, Product, ProductExtra, ProductVariant } from '../types';

interface CartContextType {
  items: OrderItem[];
  tableNumber: number | null;
  setTableNumber: (table: number | null) => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
  orderType: 'dine_in' | 'takeaway' | 'delivery';
  setOrderType: (type: 'dine_in' | 'takeaway' | 'delivery') => void;
  notes: string;
  setNotes: (notes: string) => void;
  addItem: (
    product: Product,
    selectedVariant?: ProductVariant,
    selectedExtras?: ProductExtra[],
    quantity?: number,
    instructions?: string
  ) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  totalCount: number;
  totalAmount: number;
  generateWhatsAppLink: (restaurantPhone: string, restaurantName: string, currency: string) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderType, setOrderType] = useState<'dine_in' | 'takeaway' | 'delivery'>('dine_in');
  const [notes, setNotes] = useState('');

  const addItem = (
    product: Product,
    selectedVariant?: ProductVariant,
    selectedExtras: ProductExtra[] = [],
    quantity: number = 1,
    instructions: string = ''
  ) => {
    const variantPrice = selectedVariant?.price_adjustment || 0;
    const extrasPrice = selectedExtras.reduce((sum, e) => sum + e.price, 0);
    const unitPrice = product.price + variantPrice + extrasPrice;

    const newItem: OrderItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      product_id: product.id,
      product_name: product.name,
      selected_variant: selectedVariant
        ? { name: selectedVariant.name, price_adjustment: selectedVariant.price_adjustment }
        : undefined,
      selected_extras: selectedExtras.map((e) => ({ name: e.name, price: e.price })),
      unit_price: unitPrice,
      quantity,
      instructions,
    };

    setItems((prev) => [...prev, newItem]);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
    setNotes('');
  };

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

  const generateWhatsAppLink = (
    restaurantPhone: string,
    restaurantName: string,
    currency: string = 'DZD'
  ): string => {
    const cleanPhone = restaurantPhone.replace(/[^\d+]/g, '');

    let text = `👋 Bonjour *${restaurantName}*, je souhaite passer une commande depuis votre menu digital MENUORA :\n\n`;

    if (tableNumber) {
      text += `📍 *Table N° :* ${tableNumber}\n`;
    }
    if (customerName) {
      text += `👤 *Client :* ${customerName}\n`;
    }
    if (customerPhone) {
      text += `📞 *Téléphone :* ${customerPhone}\n`;
    }
    text += `📦 *Type :* ${orderType === 'dine_in' ? 'Sur place' : orderType === 'takeaway' ? 'À emporter' : 'Livraison'}\n\n`;

    text += `*Détail de la commande :*\n`;
    items.forEach((item, index) => {
      text += `${index + 1}. *${item.quantity}x* ${item.product_name}`;
      if (item.selected_variant) {
        text += ` (${item.selected_variant.name})`;
      }
      text += ` — ${item.unit_price * item.quantity} ${currency}\n`;

      if (item.selected_extras && item.selected_extras.length > 0) {
        text += `   + Suppléments: ${item.selected_extras.map((e) => e.name).join(', ')}\n`;
      }
      if (item.instructions) {
        text += `   📝 Note: ${item.instructions}\n`;
      }
    });

    text += `\n💰 *Total :* ${totalAmount} ${currency}\n`;
    if (notes) {
      text += `\n📝 *Instructions globales :* ${notes}\n`;
    }
    text += `\n_Envoyé via le menu digital MENUORA_`;

    return `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(text)}`;
  };

  return (
    <CartContext.Provider
      value={{
        items,
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
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        totalCount,
        totalAmount,
        generateWhatsAppLink,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

