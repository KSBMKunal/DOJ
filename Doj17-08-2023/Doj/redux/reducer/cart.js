import * as actionTypes from '../actionTypes/CartActionTypes';

const initialState = {
  forCartData: [],
  cartData: null,
};

const cart = (state = initialState, action) => {
  const {type, payload} = action;
  switch (type) {
    case actionTypes.SET_FOR_CART:
      return {
        ...state,
        forCartData: payload,
      };
    case actionTypes.SET_CART_DATA:
      return {
        ...state,
        cartData: payload,
      };
    default:
      return state;
  }
};

export default cart;
