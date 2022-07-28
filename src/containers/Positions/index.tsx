import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import React from 'react';

const PositionsScreen = () => {
  const openProfileModal = () => {
    Alert.alert('hji');
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openProfileModal}>
        <Text>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 24,
  },
  screenTitle: {
    fontSize: 24,
    marginTop: 8,
    fontWeight: 'bold',
  },
});

export default PositionsScreen;
