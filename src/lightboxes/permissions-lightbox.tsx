// import {Text, Content, Icon, Button} from 'native-base';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  Clipboard,
  TouchableOpacity,
} from 'react-native';
import {logger} from 'react-native-logs';
import DeviceInfo from 'react-native-device-info';
import Permissions from 'react-native-permissions';
import {AppColors, AppFonts} from '../theme';
import {ConexusLightbox} from './base-lightbox';
import {DeviceStore} from '../stores/deviceStore';
import _ from 'lodash';
import {ActionButton} from '../components';
const log = logger.createLogger();
interface InfoItemProps {
  data: {
    label: string;
    value: string | object;
  }[];
}
const InfoList: React.SFC<InfoItemProps> = ({data}) => {
  const onCopy = (value: string) => {
    Clipboard.setString(value);
  };

  return (
    <Content>
      {data.map((item, i) => {
        return (
          <TouchableOpacity
            key={`info-${i}`}
            onPressOut={() =>
              onCopy(
                !_.isObject(item.value)
                  ? item.value.toString()
                  : JSON.stringify(item.value),
              )
            }>
            <View style={{marginTop: i === 0 ? 0 : 10}}>
              <View key={`info-${i}-l`} style={{flexDirection: 'row'}}>
                <Text style={{fontSize: 14}}>{item.label + '  '}</Text>
                <Icon name="ios-copy" style={{marginLeft: 6, fontSize: 14}} />
              </View>
              {!_.isObject(item.value) ? (
                <Text style={{fontSize: 8}} textBreakStrategy="simple">
                  {item.value}
                </Text>
              ) : (
                Object.keys(item.value).map(key => (
                  <Text
                    key={`details-${i}-${key}-l`}
                    style={{fontSize: 8}}
                    textBreakStrategy="simple">{`${key}: ${item.value[key]}`}</Text>
                ))
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </Content>
  );
};
interface PermissionsLightboxProps extends ViewProperties {
  deviceStore?: DeviceStore;
}

interface PermissionsLightboxState {
  title?: string;
  loading?: boolean;
  actionText?: string;
  cameraPermission?: boolean;
  photoPermission?: boolean;
  permissions?: any;
}

export class PermissionsLightbox extends React.Component<
  PermissionsLightboxProps,
  PermissionsLightboxState
> {
  componentDidMount() {
    log.info('SCENE', 'Mounted Call');
    // this.props.deviceStore.checkPermissions();
    // _.keyBy(this.props.deviceStore.permissions, k => {
    //   return true;
    // });
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: false,
      actionText: 'ok',
      // permissions: Permissions.getTypes(),
    };
  }
  render() {
    let {loading, title} = this.state;
    let {pushToken, authToken, permissions} = this.props.deviceStore;
    title = 'Device Info';
    let items = [
      {label: 'User Id', value: pushToken},
      {label: 'Device Id', value: DeviceInfo.getUniqueId()},
      {label: 'API Token', value: authToken},
      {label: 'Phone', value: DeviceInfo.getPhoneNumber()},
      {label: 'Permissions', value: permissions},
    ];
    log.info('auth', authToken);
    log.info('permissions', permissions);
    return (
      <ConexusLightbox
        closeable
        style={{padding: 0}}
        title={title}
        height={420}
        horizontalPercent={0.9}>
        <View style={styles.content}>
          {!loading && <InfoList data={items} />}

          {loading && (
            <ActivityIndicator color={AppColors.blue} style={{flex: 1}} />
          )}
        </View>
      </ConexusLightbox>
    );
  }
}
const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 18,
    alignSelf: 'stretch',
    alignItems: 'stretch',
    padding: 20,
  },

  lightboxFooter: {
    backgroundColor: '#F0FAFF',
    borderTopColor: AppColors.lightBlue,
    borderTopWidth: 1,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  list: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
  },

  listItem: {
    backgroundColor: AppColors.white,
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.lightBlue,
  },

  litsItemTitleWrapper: {
    flex: 1,
    justifyContent: 'center',
  },

  listItemTitle: {
    ...AppFonts.listItemTitleTouchable,
  },

  listItemIcon: {
    alignSelf: 'flex-end',
  },
});

export default PermissionsLightbox;
