import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {Colors, Sizes} from '../constants/styles';
import AnimatedLinearGradient from 'react-native-animated-linear-gradient';
import {Fonts} from '../constants/styles';
import {BottomSheet, ListItem} from '@rneui/themed';
import {Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import axios from 'axios';
import {
  api_url,
  cart_delete_restaurant_item,
  delete_all_cart,
  get_cart_new,
} from '../constants/api';
import * as CartActions from '../redux/actions/CartActions';
import Loader from './Loader';
import CircleLoader from './CircleLoader';

const {width, height} = Dimensions.get('window');

const CartItems = ({navigation, cartData, customerData, dispatch}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const clear_cart = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + delete_all_cart,
      data: {
        user_id: customerData?.id,
      },
    })
      .then(res => {
        setIsLoading(false);
        console.log(res.data);
        setIsVisible(false);
        dispatch(CartActions.setCartData(null));
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const delete_items = async id => {
    console.log(id)
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + cart_delete_restaurant_item,
      data: {
        restaurant_id: id,
      },
    })
      .then(res => {
        setIsLoading(false);
        get_cart();
        console.log(res.data);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const get_cart = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + get_cart_new,
      data: {
        user_id: customerData?.id,
      },
    })
      .then(res => {
        setIsLoading(false);
        if (res.data.status) {
          if (res.data.data.length != 0) {
            dispatch(CartActions.setCartData(res.data.data));
          } else {
            dispatch(CartActions.setCartData(null));
          }
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  return (
    <View
      style={{
        width: '90%',
        position: 'absolute',
        bottom: 50,
        height: 60,
        // backgroundColor: '#ffffff70',
        alignSelf: 'center',
      }}>
      <CircleLoader visible={isLoading} />
      <View
        style={{
          width: '100%',
          alignSelf: 'center',
          backgroundColor: Colors.whiteColor,
          height: 50,
          borderRadius: Sizes.fixPadding * 0.5,
          overflow: 'hidden',
        }}>
        <AnimatedLinearGradient
          customColors={['#360033', '#0b8793']}
          speed={3000}
          points={{start: {x: 0, y: 0}, end: {x: 1, y: 1}}}
        />
        <View
          style={{
            width: '100%',
            height: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: Sizes.fixPadding,
          }}>
          <View style={{flex: 0.8}}>
            <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons
                name="cart-outline"
                color={Colors.whiteColor}
                size={Sizes.fixPadding * 3}
              />
              <Text
                style={{
                  ...Fonts.whiteColor15Medium,
                  marginLeft: Sizes.fixPadding,
                }}>
                {cartData && Object.keys(cartData).length} Item Added
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setIsVisible(true)}
            activeOpacity={0.8}
            style={{
              backgroundColor: Colors.primaryColor,
              paddingHorizontal: Sizes.fixPadding,
              paddingVertical: Sizes.fixPadding * 0.5,
              borderRadius: Sizes.fixPadding * 0.5,
            }}>
            <Text style={{...Fonts.whiteColor12SemiBold}}>View Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
      <BottomSheet
        modalProps={{animationType: 'fade'}}
        isVisible={isVisible}
        onBackdropPress={() => setIsVisible(false)}>
        <View>
          <TouchableOpacity
            onPress={clear_cart}
            style={{
              flex: 0,
              alignSelf: 'flex-end',
              marginRight: Sizes.fixPadding * 2,
              backgroundColor: Colors.whiteColor + '40',
              padding: Sizes.fixPadding * 0.5,
              marginBottom: Sizes.fixPadding,
              borderRadius: Sizes.fixPadding,
            }}>
            <Text style={{...Fonts.primaryColor14Medium}}>Clear All</Text>
          </TouchableOpacity>
          <View
            style={{
              flex: 0,
              maxHeight: height * 0.7,
              backgroundColor: Colors.whiteColor,
              borderTopLeftRadius: Sizes.fixPadding * 2,
              borderTopRightRadius: Sizes.fixPadding * 2,
              paddingVertical: Sizes.fixPadding * 2,
            }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {cartData &&
                Object.keys(cartData).map((item, index) => (
                  <TouchableOpacity
                    onPress={() => {
                      setIsVisible(false);
                      navigation.push('cartScreen', {restaurant_id: item});
                    }}
                    style={{
                      flex: 0,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      backgroundColor: Colors.whiteColor,
                      elevation: 5,
                      shadowColor: Colors.grayColor,
                      borderRadius: Sizes.fixPadding * 0.5,
                      overflow: 'hidden',
                      marginBottom: Sizes.fixPadding * 2,
                      marginHorizontal: Sizes.fixPadding,
                    }}>
                    <View style={{flex: 0, flexDirection: 'row'}}>
                      <Image
                        source={{uri: cartData[item][0].foodImage}}
                        style={{width: 50, height: 50}}
                      />
                      <View style={{flex: 0, marginLeft: Sizes.fixPadding}}>
                        <Text style={{...Fonts.blackColor13SemiBold}}>
                          {cartData[item][0].foodName}{' '}
                          {cartData[item].length != 1 &&
                            `and ${cartData[item].length - 1} items more`}
                        </Text>
                        <Text style={{...Fonts.grayColor12Medium}}>
                          {cartData[item][0]?.restaurant?.name}
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={{...Fonts.grayColor12Medium}}>
                          {cartData[item][0]?.restaurant?.description}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={()=>delete_items(item)} style={{padding: Sizes.fixPadding*0.3}}>
                      <Text style={{...Fonts.primaryColor12SemiBold}}>Remove</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};

const mapStateToProps = state => ({
  cartData: state.cart.cartData,
  customerData: state.customer.customerData,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(CartItems);
