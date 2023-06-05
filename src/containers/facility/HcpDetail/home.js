import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  StatusBar,
  Image,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import AuthService from '../../../services/connectycubeServices/auth-service';
import PermissionsService from '../../../services/connectycubeServices/permissions-service';
import {users} from '../../../components/config.user';
import {store} from '../../../redux/store';
import {setCurrentUser} from '../../../redux/actions/currentUser';
import NavigationService from '../../../navigation/NavigationService';

const Home = () => {
  const [isLogging, setIsLogging] = useState(false);

  useEffect(() => {
    AuthService.getStoredUser().then(storedUser => {
      if (storedUser) {
        // auto login
        console.log('StoredUser', storedUser);
      }
    });

    // Android: for accepting calls in background you should provide access to show System Alerts from the background
    PermissionsService.checkAndRequestDrawOverlaysPermission();
  }, []);

  const login = async user => {
    setIsLogging(true);
    // console.log('user===>', CallService.init());

    store.dispatch(setCurrentUser(user));

    // CallService.init();
    // PushNotificationsService.init();

    // setIsLogging(false);

    const opponents = users.filter(opponent => opponent.id !== user.id);
    // console.log(
    //   'opponents====>',
    //   NavigationService.push('Callpage', {opponents}),
    // );
    NavigationService.navigate('Callpage');
  };
  return (
    <View style={{flex: 1}}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <SafeAreaView style={[styles.centeredChildren, styles.f1]}>
        <View
          style={[styles.f1, styles.centeredChildren, {flexDirection: 'row'}]}
        >
          <Text style={styles.logoText}>
            {isLogging ? '' : 'P2P Video Chat'}
          </Text>
          {isLogging && <ActivityIndicator size="small" color="#1198d4" />}
        </View>
      </SafeAreaView>
      <SafeAreaView style={[styles.authBtns, styles.f1]}>
        {users.map(user => (
          <TouchableOpacity key={user.id} onPress={() => login(user)}>
            <View style={[styles.authBtn(user.color), styles.centeredChildren]}>
              <Text style={styles.authBtnText}>
                {`Log in as ${user.full_name}`}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  f1: {
    flex: 1,
  },
  centeredChildren: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
  },
  logoImg: {
    width: '90%',
    height: '80%',
  },
  logoText: {
    fontSize: 30,
    color: 'black',
  },
  authBtns: {
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  authBtn: backgroundColor => ({
    backgroundColor,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 25,
    marginVertical: 5,
  }),
  authBtnText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
});

export default Home;
