import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import RestaurantCard from '../../components/RestaurantCard';
import Menu from '../../components/Menu';
import {RouteProp} from '@react-navigation/native';
import NavigationService from '../../navigation/NavigationService';

type ReviewCandidateProp = RouteProp<
  {
    ReviewCandidateHomeScreen: {
      ReviewCandidateHomeScreen: string;
    };
  },
  'ReviewCandidateHomeScreen'
>;

type ReviewCandidateProps = {
  route: ReviewCandidateProp;
};
const ReviewCandidateHomeScreen = ({route}: ReviewCandidateProps) => {
  const opneDrawer = () => {
    NavigationService.navigate('ExploreScreen');
  };
  return (
    <View style={styles.container}>
      {/* <TopDrawerNavigation /> */}
      <Text style={styles.screenTitle}>Restaurants</Text>
      <View>
        <Text style={styles.sectionTitle}>Restaurants Near You</Text>
        <RestaurantCard name="Sushi restaurant" onPress={opneDrawer} />
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
