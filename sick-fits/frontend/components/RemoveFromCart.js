import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import styled from 'styled-components';

/* eslint-disable react/prop-types */
const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;

  &:hover {
    cursor: pointer;
    color: red;
  }
`;

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
    deleteCartItem(id: $id) {
      id
    }
  }
`;

function update(cache, payload) {
  cache.evict(cache.identify(payload.data.deleteCartItem));
}

export default function RemoveFromCart({ id }) {
  const [removeFromCart, { loading }] = useMutation(REMOVE_FROM_CART_MUTATION, {
    variables: { id },
    update,
    // optimisticResponse: {
    //   deleteCartItem: {
    //     __typename: 'CartItem',
    //     id,
    //   },
    // },
  });

  return (
    <BigButton
      onClick={removeFromCart}
      disabled={loading}
      type="button"
      title="Remove item from cart"
    >
      &times;
    </BigButton>
  );
}
