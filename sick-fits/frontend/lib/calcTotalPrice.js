export default function calcTotalPrice(cart) {
  return cart.reduce((total, cartItem) => {
    // products can be deleted, but they could still be in your cart
    if (!cartItem.product) return total;
    return total + cartItem.quantity * cartItem.product.price;
  }, 0);
}
