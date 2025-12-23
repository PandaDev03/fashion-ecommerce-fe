import { useState } from "react";

type PaymentMethod = "COD" | "BANK" | "MOMO";

type CartItemType = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

const cartMock: CartItemType[] = [
  {
    id: 1,
    name: "Men Hoodie",
    price: 250000,
    quantity: 1,
    image:
      "https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fancient%2F2.jpg&w=96&q=100",
  },
  {
    id: 2,
    name: "Women Jacket",
    price: 420000,
    quantity: 2,
    image:
      "https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fancient%2F2.jpg&w=96&q=100",
  },
];

const PAYMENT_FEE: Record<PaymentMethod, number> = {
  COD: 0,
  BANK: 0,
  MOMO: 15000,
};

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("COD");

  const subtotal = cartMock.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  const paymentFee = PAYMENT_FEE[paymentMethod];
  const total = subtotal + paymentFee;

  const paymentLabel = {
    COD: "COD",
    BANK: "Chuyển khoản",
    MOMO: "MoMo",
  };

  return (
    <div className="max-w-screen-2xl mx-auto mt-6 ">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* SHIPPING */}
          {/* SHIPPING */}
<div className="rounded-2xl border bg-white p-8 shadow-sm">
  <h2 className="text-xl font-semibold mb-6">
    Thông tin giao hàng
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Họ tên */}
    <div className="relative">
      <label className="block mb-1 text-sm font-medium text-gray-600">
        Họ và tên
      </label>
      <input
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition
                   focus:border-black focus:bg-white focus:ring-2 focus:ring-black/10"
        placeholder="Nguyễn Văn A"
      />
    </div>

    {/* SĐT */}
    <div className="relative">
      <label className="block mb-1 text-sm font-medium text-gray-600">
        Số điện thoại
      </label>
      <input
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition
                   focus:border-black focus:bg-white focus:ring-2 focus:ring-black/10"
        placeholder="0123 456 789"
      />
    </div>

    {/* Email */}
    <div className="relative md:col-span-2">
      <label className="block mb-1 text-sm font-medium text-gray-600">
        Email
      </label>
      <input
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition
                   focus:border-black focus:bg-white focus:ring-2 focus:ring-black/10"
        placeholder="email@example.com"
      />
    </div>

    {/* Địa chỉ */}
    <div className="relative md:col-span-2">
      <label className="block mb-1 text-sm font-medium text-gray-600">
        Địa chỉ giao hàng
      </label>
      <textarea
        rows={4}
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none resize-none transition
                   focus:border-black focus:bg-white focus:ring-2 focus:ring-black/10"
        placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành"
      />
    </div>
  </div>
</div>

        </div>

        {/* RIGHT */}
        <div className="border rounded-xl p-6 h-fit">
          <h2 className="font-semibold text-lg mb-4">
            Đơn hàng của bạn
          </h2>

          {/* PRODUCT SUMMARY */}
          <div className="space-y-4 mb-4">
            {cartMock.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3"
              >
                <img
                  src={item.image}
                  className="w-14 h-14 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    SL: {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-medium">
                  {(item.price * item.quantity).toLocaleString()} ₫
                </p>
              </div>
            ))}
          </div>

          <hr className="my-4" />

          <div className="flex justify-between text-sm mb-2">
            <span>Tạm tính</span>
            <span>{subtotal.toLocaleString()} ₫</span>
          </div>

          <div className="flex justify-between text-sm mb-2">
            <span>Phí thanh toán</span>
            <span>
              {paymentFee === 0
                ? "Miễn phí"
                : paymentFee.toLocaleString() + " ₫"}
            </span>
          </div>

          <hr className="my-4" />

          <div className="flex justify-between font-bold text-lg mb-6">
            <span>Tổng cộng</span>
            <span>{total.toLocaleString()} ₫</span>
          </div>
          <div className="mb-4">
            <h2 className="font-semibold text-lg mb-4">
              Hình thức thanh toán
            </h2>

            <div className="space-y-3">
              {(
                [
                  ["COD", "Thanh toán khi nhận hàng"],
                  ["BANK", "Chuyển khoản ngân hàng"],
                  ["MOMO", "Ví MoMo (+15.000 ₫)"],
                ] as [PaymentMethod, string][]
              ).map(([value, label]) => (
                <label
                  key={value}
                  className="flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer hover:border-black"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      checked={paymentMethod === value}
                      onChange={() => setPaymentMethod(value)}
                    />
                    <span>{label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* ORDER BUTTON */}
          <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition">
            Đặt hàng • {paymentLabel[paymentMethod]} •{" "}
            {total.toLocaleString()} ₫
          </button>
        </div>
      </div>
    </div>
  );
}
