import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  ImageBackground,
  RefreshControl,
} from 'react-native';
import {Colors, Fonts, Sizes} from '../../constants/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SharedElement} from 'react-navigation-shared-element';
import {Icon} from '@rneui/themed';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import Key from '../../constants/key';
import {connect} from 'react-redux';
import * as UserActions from '../../redux/actions/CustomerActions';
import {api_url, get_banner, get_nearest_restaurant} from '../../constants/api';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import LinearGradient from 'react-native-linear-gradient';
import HomeBannerPlaceHolder from '../../simmers/HomeSimmer';
import CartItems from '../../components/CartItems';

const {width} = Dimensions.get('window');

const todaysSpecialList = [
  {
    id: 't1',
    foodImage: require('../../assets/images/food/food11.png'),
    foodName: 'Chicken italiano cheezy periperi pizza',
    amount: 14.99,
    isVeg: false,
  },
  {
    id: 't2',
    foodImage: require('../../assets/images/food/food14.png'),
    foodName: 'Paneer Khurchan',
    amount: 19.99,
    isVeg: true,
  },
];

const foodCategoriesList = [
  {
    id: '1',
    category: 'Fast Food',
    foodImage: require('../../assets/images/food/food3.png'),
  },
  {
    id: '2',
    category: 'South Indian',
    foodImage: require('../../assets/images/food/food4.png'),
  },
  {
    id: '3',
    category: 'Chinese',
    foodImage: require('../../assets/images/food/food5.png'),
  },
  {
    id: '4',
    category: 'Diet Food',
    foodImage: require('../../assets/images/food/food6.png'),
  },
  {
    id: '5',
    category: 'Italian',
    foodImage: require('../../assets/images/food/food7.png'),
  },
  {
    id: '6',
    category: 'Sea Food',
    foodImage: require('../../assets/images/food/food8.png'),
  },
  {
    id: '7',
    category: 'Ice Cream',
    foodImage: require('../../assets/images/food/food9.png'),
  },
  {
    id: '8',
    category: 'Dessert',
    foodImage: require('../../assets/images/food/food10.png'),
  },
];

const foodTypeList = [
  {
    id: '1',
    category: 'All',
    foodImage: require('../../assets/images/food/food3.png'),
  },
  {
    id: '2',
    category: 'Panner',
    foodImage: require('../../assets/images/food/food4.png'),
  },
  {
    id: '3',
    category: 'Chiken',
    foodImage: require('../../assets/images/food/food5.png'),
  },
  {
    id: '4',
    category: 'Veg',
    foodImage: require('../../assets/images/food/food6.png'),
  },
];

const offersBannersList = [
  {
    id: 'o1',
    bannerImage: require('../../assets/images/offer_banner/Offer1.png'),
  },
  // {
  //   id: 'o2',
  //   bannerImage: require('../../assets/images/offer_banner/Offer2.png'),
  // },
];

const nearByRestaurantsList = [
  {
    id: '1',
    restaurantName: 'Marine Rise Restaurant',
    ratedPeopleCount: 198,
    restaurantAddress: '1124, Old Chruch Street, New york, USA',
    rating: 4.3,
  },
  {
    id: '2',
    restaurantName: 'Sliver Leaf Restaurant',
    ratedPeopleCount: 170,
    restaurantAddress: '1124, Old Chruch Street, New york, USA',
    rating: 4.0,
  },
  {
    id: '3',
    restaurantName: 'Johson Foods',
    ratedPeopleCount: 130,
    restaurantAddress: '1124, Old Chruch Street, New york, USA',
    rating: 3.5,
  },
  {
    id: '4',
    restaurantName: 'Lepord Cafe',
    ratedPeopleCount: 100,
    restaurantAddress: '1124, Old Chruch Street, New york, USA',
    rating: 3.0,
  },
  {
    id: '5',
    restaurantName: 'King Of Foods',
    ratedPeopleCount: 80,
    restaurantAddress: '1124, Old Chruch Street, New york, USA',
    rating: 2.0,
  },
];

const filterTypeList = [
  {
    id: 1,
    text: 'Filter',
    icon: 'tune',
  },
  {
    id: 2,
    text: 'Sort by',
    icon: 'expand-more',
  },
  {
    id: 3,
    text: 'Fast Delivery',
    icon: 'speed',
  },
  {
    id: 4,
    text: 'Custome',
    icon: 'tune',
  },
];

const HomeScreen = ({navigation, dispatch, location, isLocationDefined, cartData}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [topBanners, setTopBanners] = useState(null);
  const [nearestRestaurantData, setNearestRestaurantData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    get_top_banner();
    if(location){
      get_near_by_restaurant(location?.latitude, location?.longitude);
    }
  }, []);

  const get_top_banner = async () => {
    setIsLoading(true);
    await axios({
      method: 'get',
      url: api_url + get_banner,
    })
      .then(res => {
        setIsLoading(false);
        setTopBanners(res.data);
      })
      .catch(err => {
        setIsLoading(false);
      });
  };

  const get_near_by_restaurant = async (latitude, longitude) => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + get_nearest_restaurant,
      data: {
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      },
    })
      .then(res => {
        setIsLoading(false);
        setNearestRestaurantData(res.data.nearestRestaurant);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const get_near_by_restaurant_on_refresh = async () => {
    setIsRefreshing(true);
    await axios({
      method: 'post',
      url: api_url + get_nearest_restaurant,
      data: {
        latitude: location?.latitude.toString(),
        longitude: location?.longitude.toString(),
      },
    })
      .then(res => {
        setIsRefreshing(false);
        setNearestRestaurantData(res.data.nearestRestaurant);
      })
      .catch(err => {
        setIsRefreshing(false);
        console.log(err);
      });
  };

  const like_restaurant = async()=>{
    await axios({
      method: 'post',
      url: api_url 
    })
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.whiteColor}}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{flex: 1}}>
        {isLoading ? (
          <HomeBannerPlaceHolder />
        ) : (
          <FlatList
            ListHeaderComponent={
              <>
                {header()}
                {searchInfo()}
                {banners()}
                {filterType()}
                {foodTypeInfo()}
                {nearestRestaurantData && restaurantToExplore()}
                {foodOffDelivery()}
                {foodCategoriesInfo()}
                {offersInfo()}
                {nearByRestaurantsInfo()}
                {todaysSpecialInfo()}
              </>
            }
            contentContainerStyle={{paddingBottom: Sizes.fixPadding * 6.0}}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={get_near_by_restaurant_on_refresh} colors={[Colors.primaryColor]} />}
          />
        )}
      </View>
      {cartData && <CartItems navigation={navigation} />}
    </SafeAreaView>
  );

  function todaysSpecialInfo() {
    const renderItem = ({item}) => (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.push('OfferDetail', {item: item})}
        style={{
          backgroundColor: Colors.lightGrayColor,
          borderRadius: Sizes.fixPadding,
          marginBottom: Sizes.fixPadding + 5.0,
        }}>
        <SharedElement id={item.id}>
          <Image
            source={item.foodImage}
            style={styles.todaysSpecialFoodImageStyle}
          />
        </SharedElement>
        <View style={styles.todaysSpecialFoodInfoWrapStyle}>
          <Text
            numberOfLines={2}
            style={{flex: 1, ...Fonts.blackColor13Medium}}>
            {item.foodName}
          </Text>
          <View
            style={{flex: 0.5, alignItems: 'flex-end', alignSelf: 'center'}}>
            <View
              style={{
                borderColor: item.isVeg ? Colors.greenColor : Colors.redColor,
                ...styles.vegOrnonVegIconOuterStyle,
              }}>
              <View
                style={{
                  ...styles.vegOrnonVegIconInnerStyle,
                  backgroundColor: item.isVeg
                    ? Colors.greenColor
                    : Colors.redColor,
                }}
              />
            </View>
          </View>
        </View>
        <Text
          style={{
            position: 'absolute',
            top: 5.0,
            right: 5.0,
            ...Fonts.whiteColor14Bold,
          }}>
          {item.amount.toFixed(2)}$
        </Text>
      </TouchableOpacity>
    );
    return (
      <View style={{margin: Sizes.fixPadding * 2.0}}>
        <Text
          style={{
            marginBottom: Sizes.fixPadding,
            ...Fonts.blackColor16SemiBold,
          }}>
          Today's Special
        </Text>
        <FlatList
          data={todaysSpecialList}
          keyExtractor={item => `${item.id}`}
          renderItem={renderItem}
          scrollEnabled={false}
        />
      </View>
    );
  }

  function nearByRestaurantsInfo() {
    const renderItem = ({item}) => (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.push('RestaurantDetail', {id: item.id})}
        style={styles.nearByRestaurantsWrapStyle}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <SharedElement id={item.id}>
              <View style={styles.nearByRestaurantsIconWrapStyle}>
                <Image
                  source={require('../../assets/images/icons/restaurant_icon.png')}
                  style={{
                    width: '100%',
                    height: '100%',
                    flex: 1,
                    resizeMode: 'contain',
                  }}
                />
              </View>
            </SharedElement>
            <View style={{flex: 1, marginLeft: Sizes.fixPadding}}>
              <Text style={{...Fonts.blackColor12SemiBold}}>
                {item.restaurantName}
              </Text>
              <Text style={{...Fonts.grayColor12Medium}}>
                {item.ratedPeopleCount} People Rated
              </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                marginRight: Sizes.fixPadding - 5.0,
                ...Fonts.primaryColor12SemiBold,
              }}>
              {item.rating.toFixed(1)}
            </Text>
            <MaterialIcons name="star" color={Colors.primaryColor} size={14} />
          </View>
        </View>
        <View
          style={{
            marginTop: Sizes.fixPadding - 5.0,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <MaterialIcons
            name="location-on"
            color={Colors.primaryColor}
            size={16}
          />
          <Text
            style={{
              marginLeft: Sizes.fixPadding - 5.0,
              ...Fonts.grayColor12Medium,
            }}>
            {item.restaurantAddress}
          </Text>
        </View>
      </TouchableOpacity>
    );
    return (
      <View>
        <View
          style={{
            marginBottom: Sizes.fixPadding,
            marginTop: Sizes.fixPadding * 2.0,
            marginHorizontal: Sizes.fixPadding * 2.0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{...Fonts.blackColor16SemiBold}}>
            Restaurants Near You
          </Text>
          <Text
            onPress={() => navigation.push('RestaurantsList')}
            style={{...Fonts.primaryColor12SemiBold}}>
            see all
          </Text>
        </View>
        <FlatList
          listKey="nearByRestaurants"
          data={nearByRestaurantsList}
          keyExtractor={item => `${item.id}`}
          renderItem={renderItem}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }

  function offersInfo() {
    const renderItem = ({item}) => (
      <SharedElement id={item.id}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.push('OfferDetail', {item: item})}
          style={styles.offerBannerWrapStyle}>
          <Image
            source={item.bannerImage}
            style={styles.offerBannerImageStyle}
          />
        </TouchableOpacity>
      </SharedElement>
    );
    return (
      <View style={{marginTop: Sizes.fixPadding * 2.0}}>
        <View
          style={{
            marginHorizontal: Sizes.fixPadding * 2.0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{...Fonts.blackColor16SemiBold}}>Offers For You</Text>
          <Text style={{...Fonts.primaryColor12SemiBold}}>see all</Text>
        </View>
        <FlatList
          data={offersBannersList}
          keyExtractor={item => `${item.id}`}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingLeft: Sizes.fixPadding * 2.0,
            paddingTop: Sizes.fixPadding,
          }}
        />
      </View>
    );
  }

  function foodCategoriesInfo() {
    const renderItem = ({item}) => (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.push('RestaurantsList')}
        style={{alignItems: 'center', marginRight: Sizes.fixPadding + 5.0}}>
        <Image
          source={item.foodImage}
          style={{
            width: width * 0.18,
            height: width * 0.19,
            borderRadius: Sizes.fixPadding,
          }}
        />
        <Text
          style={{
            marginTop: Sizes.fixPadding - 5.0,
            ...Fonts.blackColor11SemiBold,
          }}>
          {item.category}
        </Text>
      </TouchableOpacity>
    );
    return (
      <View>
        <Text
          style={{
            marginTop: Sizes.fixPadding * 2.0,
            marginHorizontal: Sizes.fixPadding * 2.0,
            ...Fonts.blackColor16SemiBold,
          }}>
          Food Categories
        </Text>
        <FlatList
          data={foodCategoriesList}
          keyExtractor={item => `${item.id}`}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingLeft: Sizes.fixPadding * 2.0,
            paddingTop: Sizes.fixPadding,
          }}
        />
      </View>
    );
  }

  function filterType() {
    const renderItem = ({item}) => (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.push('RestaurantsList')}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: Sizes.fixPadding + 5.0,
          backgroundColor: Colors.whiteColor,
          paddingHorizontal: Sizes.fixPadding,
          paddingVertical: Sizes.fixPadding * 0.4,
          borderRadius: 1000,
          borderWidth: 1,
          borderColor: Colors.grayColor,
        }}>
        <Text
          style={{
            ...Fonts.grayColor12Regular,
            marginRight: 5,
          }}>
          {item.text}
        </Text>
        <Icon
          type="MaterialIcons"
          name={item.icon}
          color={Colors.grayColor}
          size={14}
        />
      </TouchableOpacity>
    );
    return (
      <View>
        <FlatList
          data={filterTypeList}
          keyExtractor={item => `${item.id}`}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingLeft: Sizes.fixPadding * 2.0,
            paddingTop: Sizes.fixPadding,
          }}
        />
      </View>
    );
  }

  function foodTypeInfo() {
    const renderItem = ({item}) => (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.push('RestaurantsList')}
        style={{
          alignItems: 'center',
          marginRight: Sizes.fixPadding * 2.1,
          backgroundColor: item.id == 1 ? Colors.blueColor : Colors.whiteColor,
          elevation: 5,
          shadowColor: Colors.grayColor,
          marginBottom: Sizes.fixPadding,
          padding: Sizes.fixPadding,
          borderRadius: 1000,
        }}>
        <Image
          source={item.foodImage}
          style={{
            width: width * 0.11,
            height: width * 0.11,
            borderRadius: 1000,
          }}
        />
        <Text
          style={{
            marginVertical: Sizes.fixPadding - 5.0,
            ...Fonts.blackColor11Regular,
            color: item.id == 1 ? Colors.whiteColor : Colors.grayColor,
          }}>
          {item.category}
        </Text>
      </TouchableOpacity>
    );
    return (
      <View style={{marginTop: Sizes.fixPadding * 1.0}}>
        <FlatList
          data={foodTypeList}
          keyExtractor={item => `${item.id}`}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingLeft: Sizes.fixPadding * 2.0,
            paddingTop: Sizes.fixPadding,
          }}
        />
      </View>
    );
  }

  function banners() {
    const renderItem = ({item}) => (
      <Image
        source={{uri: item.banner_photo_url}}
        style={styles.bannerImageStyle}
      />
    );
    return (
      <View style={{height: 120}}>
        {topBanners && (
          <FlatList
            data={topBanners}
            keyExtractor={item => `${item.id}`}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingLeft: Sizes.fixPadding * 2.0}}
          />
        )}
      </View>
    );
  }

  function foodOffDelivery() {
    const renderItem = ({item}) => (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.push('OfferDetail', {item: item})}
        style={{
          width: width * 0.22,
          borderRadius: Sizes.fixPadding,
          marginBottom: Sizes.fixPadding + 5.0,
          alignItems: 'center',
        }}>
        <View
          style={{
            elevation: 8,
            width: width * 0.15,
            height: width * 0.15,
            marginBottom: 10,
          }}>
          <Image
            source={item.foodImage}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: Sizes.fixPadding * 10,
              borderWidth: 1,
              borderColor: Colors.whiteColor,
            }}
          />
        </View>

        <Text style={{...Fonts.grayColor13Medium}}>{item.category}</Text>
      </TouchableOpacity>
    );
    return (
      <View style={{marginHorizontal: Sizes.fixPadding * 2.0}}>
        <Text
          style={{
            marginBottom: Sizes.fixPadding,
            ...Fonts.blackColor14SemiBold,
          }}>
          20% off on food delivery
        </Text>
        <FlatList
          data={foodCategoriesList}
          keyExtractor={item => `${item.id}`}
          renderItem={renderItem}
          numColumns={4}
          scrollEnabled={false}
        />
      </View>
    );
  }

  function restaurantToExplore() {
    const renderItem = ({item}) => (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          navigation.push('RestaurantDetail', {item: item, id: item.id})
        }
        style={{
          backgroundColor: Colors.lightGrayColor,
          borderRadius: Sizes.fixPadding,
          marginBottom: Sizes.fixPadding + 5.0,
          overflow: 'hidden',
        }}>
        <ImageBackground
          source={{uri: item?.restaurant_image}}
          style={styles.restaurantToExplore}>
          <LinearGradient
            colors={['#00000099', '#ffffff00', '#00000099']}
            style={{
              height: 140,
              width: '100%',
              justifyContent: 'space-between',
              flex: 1,
              borderTopLeftRadius: Sizes.fixPadding,
              borderTopRightRadius: Sizes.fixPadding,
            }}>
            <View
              style={{
                flex: 0,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: Sizes.fixPadding * 0.7,
              }}>
              <View
                style={{
                  flex: 0,
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: Colors.whiteColor,
                  borderRadius: 1000,
                  paddingHorizontal: Sizes.fixPadding * 0.5,
                }}>
                <MaterialIcons name="star-rate" color={'#fca311'} size={16} />
                <Text style={{...Fonts.blackColor13SemiBold}}>5.0</Text>
              </View>
              <View
                style={{
                  flex: 0,
                  width: 25,
                  height: 25,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: Colors.whiteColor,
                  borderRadius: 1000,
                }}>
                <Ionicons
                  name="heart-outline"
                  color={Colors.blueColor}
                  size={18}
                />
              </View>
            </View>
            <View
              style={{
                flex: 0,
                flexDirection: 'row',
                alignItems: 'flex-end',
                padding: Sizes.fixPadding,
              }}>
              <Image
                source={{uri: item.restaurant_image}}
                style={{
                  width: width * 0.15,
                  height: width * 0.15,
                  borderRadius: Sizes.fixPadding * 0.5,
                  borderWidth: 1,
                  borderColor: Colors.whiteColor,
                }}
              />
              <View style={{marginLeft: Sizes.fixPadding}}>
                <Text style={{...Fonts.whiteColor12SemiBold}}>{item.name}</Text>
                <Text style={{...Fonts.whiteColor12SemiBold}}>
                  ₹ 150 per plate 10 mint{' '}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    );
    return (
      <View style={{margin: Sizes.fixPadding * 2.0}}>
        <Text
          style={{
            marginBottom: Sizes.fixPadding,
            ...Fonts.blackColor14SemiBold,
          }}>
          Restaurant to explore
        </Text>
        <FlatList
          data={nearestRestaurantData}
          keyExtractor={item => `${item.id}`}
          renderItem={renderItem}
          scrollEnabled={false}
        />
      </View>
    );
  }

  function searchInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('homeSearch')}
        style={styles.searchInfoWrapStyle}>
        <Text style={{...Fonts.grayColor12Medium}}>
          Search for restaurant,food...
        </Text>
        <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
          <MaterialIcons name="search" color={Colors.blackColor} size={18} />
          <View
            style={{
              height: 20,
              width: 1,
              backgroundColor: Colors.blackColor,
              marginHorizontal: Sizes.fixPadding,
            }}
          />
          <MaterialIcons
            name="keyboard-voice"
            color={Colors.primaryColor}
            size={18}
          />
        </View>
      </TouchableOpacity>
    );
  }

  function header() {
    return (
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginTop: Sizes.fixPadding,
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('selectAddress')}
          style={{width: '70%'}}>
          <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
            <Icon
              name="navigate"
              type="ionicon"
              color={Colors.primaryColor}
              size={18}
            />
            <Text style={{...Fonts.blackColor15Medium, marginHorizontal: 5}}>
              {location && location?.city}
            </Text>
            <Icon
              name="chevron-down-outline"
              type="ionicon"
              color={Colors.grayColor}
              size={18}
            />
          </View>
          <Text numberOfLines={1} style={{...Fonts.grayColor12Regular}}>
            {location && location?.currentLocation}
          </Text>
        </TouchableOpacity>
        <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            // onPress={() => navigation.push('cartScreen')}
            style={{paddingHorizontal: Sizes.fixPadding * 0.3}}>
            <Icon
              type="MaterialIcons"
              name="g-translate"
              size={18}
              color={Colors.blackColor}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{paddingHorizontal: Sizes.fixPadding * 0.3}}>
            <Icon
              type="MaterialIcons"
              name="headset-mic"
              size={18}
              color={Colors.blackColor}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('profile')}
            style={{paddingHorizontal: Sizes.fixPadding * 0.3}}>
            <Icon
              type="Ionicons"
              name="person"
              size={18}
              color={Colors.blackColor}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  searchInfoWrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.grayColor1,
    borderRadius: Sizes.fixPadding - 5.0,
    margin: Sizes.fixPadding * 2.0,
    padding: Sizes.fixPadding + 5.0,
    // elevation: 2.0,
  },
  bannerImageStyle: {
    width: 320,
    height: 120,
    resizeMode: 'stretch',
    borderRadius: Sizes.fixPadding * 0.5,
    marginRight: Sizes.fixPadding * 2.0,
  },
  offerBannerWrapStyle: {
    borderRadius: Sizes.fixPadding,
    backgroundColor: Colors.whiteColor,
    marginRight: Sizes.fixPadding * 2.0,
    height: width - 270.0,
    width: width - 140.0,
  },
  offerBannerImageStyle: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  vegOrnonVegIconOuterStyle: {
    width: 12.0,
    height: 12.0,
    borderWidth: 1.0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vegOrnonVegIconInnerStyle: {
    width: 6.5,
    height: 6.5,
    borderRadius: 3.5,
  },

  restaurantToExplore: {
    height: 140,
    width: '100%',
    justifyContent: 'space-between',
    flex: 1,
    borderTopLeftRadius: Sizes.fixPadding,
    borderTopRightRadius: Sizes.fixPadding,
  },
  todaysSpecialFoodImageStyle: {
    height: 120,
    width: '100%',
    flex: 1,
    borderTopLeftRadius: Sizes.fixPadding,
    borderTopRightRadius: Sizes.fixPadding,
  },
  todaysSpecialFoodInfoWrapStyle: {
    padding: Sizes.fixPadding,
    height: 55.0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nearByRestaurantsWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    padding: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding * 2.0,
  },
  nearByRestaurantsIconWrapStyle: {
    width: 35.0,
    height: 35.0,
    backgroundColor: '#E6E6E6',
    borderRadius: Sizes.fixPadding - 5.0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Sizes.fixPadding - 6.0,
  },
});

const mapStateToProps = state => ({
  location: state.customer.location,
  isLocationDefined: state.customer.isLocationDefined,
  cartData: state.cart.cartData
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
