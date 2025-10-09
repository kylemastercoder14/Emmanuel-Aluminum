import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  color: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  selectedForCheckout: CartItem[];
  addItem: (data: CartItem) => void;
  removeItem: (id: string, color: string) => void;
  updateQuantity: (id: string, color: string, quantity: number) => void;
  removeAll: () => void;
  setSelectedForCheckout: (items: CartItem[]) => void;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      selectedForCheckout: [],
      addItem: (data: CartItem) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.id === data.id && item.color === data.color
        );

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.id === data.id && item.color === data.color
                ? { ...item, quantity: item.quantity + data.quantity }
                : item
            ),
          });
          toast.success("Quantity updated in cart");
        } else {
          set({ items: [...currentItems, data] });
          toast.success("Item added to cart");
        }
      },
      removeItem: (id: string, color: string) => {
        set({
          items: get().items.filter(
            (item) => !(item.id === id && item.color === color)
          ),
        });
        toast.success("Item removed from cart");
      },
      updateQuantity: (id: string, color: string, quantity: number) => {
        set({
          items: get().items.map((item) =>
            item.id === id && item.color === color
              ? { ...item, quantity }
              : item
          ),
        });
        toast.success("Quantity updated");
      },
      removeAll: () => {
        set({ items: [] });
      },
      setSelectedForCheckout: (checkoutItems: CartItem[]) => {
        set({ selectedForCheckout: checkoutItems });
      },
    }),
    {
      name: "cart-storage-emmanuel-aluminum-fabrication",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;
