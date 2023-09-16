/* eslint-disable */
import { KeystoneContext } from '@keystone-next/types';
import { CartItemCreateInput } from '../.keystone/schema-types';
import { Session } from '../types';

async function addToCart(
  root: any,
  { productId }: { productId: string },
  context: KeystoneContext
): Promise<CartItemCreateInput> {
  console.log('adding to cart');

  // 1. Query the current user see if they are signed in
  const session = context.session as Session;

  if (!session.itemId) {
    throw new Error('Please login and try again');
  }

  // 2. Query the current users cart
  const allCartItems = await context.lists.CartItem.findMany({
    where: { user: { id: session.itemId }, product: { id: productId } },
    resolveFields: 'id,quantity',
  });
  const [existingCartItem] = allCartItems;

  // 3. Query if the current item is already in the cart
  if (existingCartItem) {
    console.log(existingCartItem);
    console.log(
      `This are ${existingCartItem.quantity} item(s) is already in the cart`
    );

    // 4. If item is already in cart - increment by 1
    return await context.lists.CartItem.updateOne({
      id: existingCartItem.id,
      data: { quantity: existingCartItem.quantity + 1 },
      resolveFields: false,
    });
  }

  // 5.  If item is not in cart - create new cart item
  return await context.lists.CartItem.createOne({
    data: {
      product: { connect: { id: productId } },
      user: { connect: { id: session.itemId } },
    },
    resolveFields: false,
  });
}

export default addToCart;
