import { useState } from "react";
import { useNavigate } from "react-router-dom";

import CartItem from "../components/CartItem";
import { PATH } from '~/shared/utils/path';

type CartItemType = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

const initialCart: CartItemType[] = [
  {
    id: 1,
    name: "Men Hoodie",
    price: 250000,
    image:
      "https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fancient%2F2.jpg&w=384&q=100",
    quantity: 1,
  },
  {
    id: 2,
    name: "Women Jacket",
    price: 420000,
    image:
      "https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fancient%2F2.jpg&w=384&q=100",
    quantity: 2,
  },
];

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItemType[]>(initialCart);

  const updateQty = (id: number, qty: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, qty) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="css-dev-only-do-not-override-11mmrso ant-space-vertical ant-space-gap-row-small ant-space-gap-col-small max-w-[1920px] mt-5 md:mt-8 gap-y-6! lg:gap-y-16! px-4! md:px-8! 2xl:px-16!">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CART ITEMS */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onQtyChange={updateQty}
              onRemove={removeItem}
            />
          ))}
        </div>

        {/* SUMMARY */}
        <div className="border rounded-xl p-6 h-fit">
          <h2 className="text-lg font-semibold mb-4">
            Order Summary
          </h2>

          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>{total.toLocaleString()} ₫</span>
          </div>

          <div className="flex justify-between mb-4">
            <span>Shipping</span>
            <span>Free</span>
          </div>

          <hr className="mb-4" />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{total.toLocaleString()} ₫</span>
          </div>

          <button
            onClick={() => navigate(PATH.CHECKOUT)}
            className="w-full mt-6 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
