
import { useCart } from "../App";
const CartPage = () => {
  const { cart, setCart } = useCart();

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.length === 0 ? <p>No items in cart</p> : null}
      <ul>
        {cart.map((item) => (
          <li key={item.id}>
            {item.name} - ${item.price}{" "}
            <button onClick={() => removeFromCart(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default CartPage;
