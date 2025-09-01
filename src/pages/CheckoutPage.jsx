import { useCart } from "../context/CartContext";

const CheckoutPage = () => {
  const { cart } = useCart();

  const handleCheckout = () => {
    alert("Checkout not implemented yet!");
  };

  return (
    <div>
      <h2>Checkout</h2>
      {cart.map((item) => (
        <p key={item.id}>
          {item.name} - ${item.price}
        </p>
      ))}
      <button onClick={handleCheckout}>Pay Now</button>
    </div>
  );
};
export default CheckoutPage;
