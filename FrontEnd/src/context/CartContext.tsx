import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// انواع داده‌ها
export interface Tour {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  duration: string;
  location: string;
  category: string;
}

export interface CartItem {
  tour: Tour;
  quantity: number;
  selectedDate?: string;
  travelers: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: { tour: Tour; date?: string; travelers?: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'UPDATE_TRAVELERS'; payload: { id: string; travelers: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

// ایجاد Context
const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

// Reducer برای مدیریت state
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => 
        item.tour.id === action.payload.tour.id && 
        item.selectedDate === action.payload.date
      );

      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.tour.id === action.payload.tour.id && item.selectedDate === action.payload.date
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        
        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.tour.price * item.quantity), 0),
          itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        };
      }

      const newItem: CartItem = {
        tour: action.payload.tour,
        quantity: 1,
        selectedDate: action.payload.date,
        travelers: action.payload.travelers || 1
      };

      const newItems = [...state.items, newItem];
      
      return {
        ...state,
        items: newItems,
        total: newItems.reduce((sum, item) => sum + (item.tour.price * item.quantity), 0),
        itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0)
      };

    case 'REMOVE_FROM_CART':
      const filteredItems = state.items.filter(item => 
        !(item.tour.id === action.payload && item.selectedDate === action.payload)
      );
      
      return {
        ...state,
        items: filteredItems,
        total: filteredItems.reduce((sum, item) => sum + (item.tour.price * item.quantity), 0),
        itemCount: filteredItems.reduce((sum, item) => sum + item.quantity, 0)
      };

    case 'UPDATE_QUANTITY':
      const quantityUpdatedItems = state.items.map(item =>
        item.tour.id === action.payload.id && item.selectedDate === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
      
      return {
        ...state,
        items: quantityUpdatedItems,
        total: quantityUpdatedItems.reduce((sum, item) => sum + (item.tour.price * item.quantity), 0),
        itemCount: quantityUpdatedItems.reduce((sum, item) => sum + item.quantity, 0)
      };

    case 'UPDATE_TRAVELERS':
      const travelerUpdatedItems = state.items.map(item =>
        item.tour.id === action.payload.id
          ? { ...item, travelers: action.payload.travelers }
          : item
      );
      
      return {
        ...state,
        items: travelerUpdatedItems
      };

    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        itemCount: 0
      };

    case 'LOAD_CART':
      return {
        items: action.payload,
        total: action.payload.reduce((sum, item) => sum + (item.tour.price * item.quantity), 0),
        itemCount: action.payload.reduce((sum, item) => sum + item.quantity, 0)
      };

    default:
      return state;
  }
};

// Provider Component
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0
  });

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook برای استفاده از Cart
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};