type CartItemType = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartItemProps = {
  item: CartItemType;
  onQtyChange: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
};

const CartItem = ({ item, onQtyChange, onRemove }: CartItemProps) => {
  return (
    <div className="flex gap-4 border rounded-xl p-4 items-center">
      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-lg"
      />

      <div className="flex-1">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-gray-500">
          {item.price.toLocaleString()} ₫
        </p>
      </div>

      {/* Quantity */}
      <div className="flex items-center border rounded-lg overflow-hidden">
        <button
          onClick={() => onQtyChange(item.id, item.quantity - 1)}
          className="px-3 py-1 hover:bg-gray-100"
        >
          -
        </button>

        <input
          type="number"
          value={item.quantity}
          onChange={(e) =>
            onQtyChange(item.id, Number(e.target.value))
          }
          className="w-12 text-center outline-none"
        />

        <button
          onClick={() => onQtyChange(item.id, item.quantity + 1)}
          className="px-3 py-1 hover:bg-gray-100"
        >
          +
        </button>
      </div>

      <button
        onClick={() => onRemove(item.id)}
        className="text-red-500 hover:underline ml-4"
      >
        Remove
      </button>
    </div>
  );
};

export default CartItem;
