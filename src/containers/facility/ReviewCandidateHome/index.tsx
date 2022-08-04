import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavigationService from '../../../navigation/NavigationService';
import {useSelector} from '../../../redux/index';
//d ckd
const ReviewCandidateHomeScreen = () => {
  const userInfo = useSelector(state => state.userReducer);

  useEffect(() => {
    saveToken();
    getToken();
  });
  const saveToken = async () => {
    await AsyncStorage.setItem('authToken', userInfo?.user?.authToken);
  };

  const getToken = async () => {
    let token = await AsyncStorage.getItem('authToken');
    console.log('Mil gya token', token);
  };
  return (
    <View style={styles.container}>
      {/* <TopDrawerNavigation /> */}
      <Text style={styles.screenTitle}>Restaurants</Text>
      <View>
        <Text style={styles.sectionTitle}>Restaurants Near You</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 24,
  },
  restaurantCard: {
    backgroundColor: '#efefef',
  },
  sectionTitle: {
    fontSize: 16,
    marginTop: 16,
  },
  screenTitle: {
    fontSize: 24,
    marginTop: 8,
    fontWeight: 'bold',
  },
});

export default ReviewCandidateHomeScreen;
