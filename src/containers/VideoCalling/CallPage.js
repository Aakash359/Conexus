import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import {
  checkMultiple,
  request,
  requestMultiple,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

const API_URL =
  'https://c138-2405-201-4-b871-88b2-36ec-df0-ed5a.ngrok-free.app';

const CallScreen = navigation => {
  const {userName, roomId, callerName} = navigation.route.params;

  const _checkPermissions = callback => {
    const iosPermissions = [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE];
    const androidPermissions = [
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.RECORD_AUDIO,
    ];
    checkMultiple(
      Platform.OS === 'ios' ? iosPermissions : androidPermissions,
    ).then(statuses => {
      const [CAMERA, AUDIO] =
        Platform.OS === 'ios' ? iosPermissions : androidPermissions;
      if (
        statuses[CAMERA] === RESULTS.UNAVAILABLE ||
        statuses[AUDIO] === RESULTS.UNAVAILABLE
      ) {
        Alert.alert(
          'Error',
          'Hardware to support video calls is not available',
        );
      } else if (
        statuses[CAMERA] === RESULTS.BLOCKED ||
        statuses[AUDIO] === RESULTS.BLOCKED
      ) {
        Alert.alert(
          'Error',
          'Permission to access hardware was blocked, please grant manually',
        );
      } else {
        if (
          statuses[CAMERA] === RESULTS.DENIED &&
          statuses[AUDIO] === RESULTS.DENIED
        ) {
          requestMultiple(
            Platform.OS === 'ios' ? iosPermissions : androidPermissions,
          ).then(newStatuses => {
            if (
              newStatuses[CAMERA] === RESULTS.GRANTED &&
              newStatuses[AUDIO] === RESULTS.GRANTED
            ) {
              callback && callback();
            } else {
              Alert.alert('Error', 'One of the permissions was not granted');
            }
          });
        } else if (
          statuses[CAMERA] === RESULTS.DENIED ||
          statuses[AUDIO] === RESULTS.DENIED
        ) {
          request(statuses[CAMERA] === RESULTS.DENIED ? CAMERA : AUDIO).then(
            result => {
              if (result === RESULTS.GRANTED) {
                callback && callback();
              } else {
                Alert.alert('Error', 'Permission not granted');
              }
            },
          );
        } else if (
          statuses[CAMERA] === RESULTS.GRANTED ||
          statuses[AUDIO] === RESULTS.GRANTED
        ) {
          callback && callback();
        }
      }
    });
  };

  const onAcceptClick = () => {
    _checkPermissions(() => {
      fetch(`${API_URL}/getToken?userName=${userName}&room=${roomId}`)
        .then(response => {
          if (response.ok) {
            response.text().then(jwt => {
              navigation.navigation.navigate('MeetingRoom', {
                token: jwt,
                roomName: roomId,
              });
              return true;
            });
          } else {
            response.text().then(error => {
              Alert.alert(error);
            });
          }
        })
        .catch(error => {
          Alert.alert('API not available');
        });
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.absoluteView}>
        <Image source={require('../../../assets/bg.jpeg')} style={styles.container} />
      </View>
      <View style={styles.mainView}>
        <Image
          source={require('../../../assets/profile.png')}
          style={styles.profileStyle}
        />
        <Text style={styles.callerName}>{callerName}</Text>
        <View style={styles.bottomView}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigation.goBack();
            }}
            style={styles.bottomImageView}>
            <Image
              source={require('../../../assets/decline.png')}
              style={styles.callStyle}
            />
            <Text style={styles.callText}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              onAcceptClick();
            }}
            style={styles.bottomImageView}>
            <Image
              source={require('../../../assets/accept.png')}
              style={styles.callStyle}
            />
            <Text style={styles.callText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  absoluteView: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  mainView: {
    flex: 1,
    zIndex: 99,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileStyle: {
    height: 150,
    width: 150,
    borderRadius: 75,
  },
  callerName: {
    fontSize: 20,
    color: 'white',
    marginTop: 10,
  },
  bottomView: {
    marginTop: 100,
    flexDirection: 'row',
  },
  bottomImageView: {
    flex: 1,
    alignItems: 'center',
  },
  callStyle: {
    height: 70,
    width: 70,
    borderRadius: 35,
  },
  callText: {
    fontSize: 14,
    color: 'white',
    marginTop: 10,
  },
});
export default CallScreen;
