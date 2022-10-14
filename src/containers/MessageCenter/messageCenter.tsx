import React, {useState, useEffect} from 'react';
import {
  Alert,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  View,
  Text,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
let moment = require('moment');
import {useSelector} from '../../redux/reducers/index';
import {ViewHeader} from '../../components/view-header';
import variables, {AppFonts, AppColors} from '../../theme';
import NavigationService from '../../navigation/NavigationService';
import {conversationsService} from '../../services/MessageCenter/conversationsService';
import FacilitySelectionContainer from '../../components/facility-selection-container';

interface MessageCenterProps {}

interface MessageCenterState {
  refreshing: boolean;
  loading: boolean;
}

const MessageCenter = (
  props: MessageCenterProps,
  state: MessageCenterState,
) => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [conversationData, setConversationData] = useState([]);

  const userInfo = useSelector(state => state.userReducer);

  const selectedFacilityId = () => {
    return userInfo?.user?.userFacilities?.[0]?.facilityId;
  };

  const selectedFacility = () => {
    return conversationData.find(i => i.facilityId === selectedFacilityId);
  };

  const showNoData = (): boolean => {
    // const {conversationStore} = this.props;
    // if (this.state.refreshing || conversationStore.loading) {
    //   return false;
    // }
    // if (!this.selectedFacility) {
    //   return true;
    // }
    // if (this.selectedFacility.positions.length === 0) {
    //   return true;
    // }
    // return !this.selectedFacility.positions.find(position => {
    //   return position.conversations.length > 0;
    // });
  };

  useEffect(() => {
    load();
    // selectedFacility();
  }, []);

  const renderConversationItem = ({item, index}) => {
    let position = item as any;
    let i = index;
    const needKey = `need-${position.needId}`;
    let result: JSX.Element[] = [];

    result.push(
      <ViewHeader
        first={i === 0}
        key={needKey}
        title={position.display.title}
        description={position.display.description}
      />,
    );

    position.conversations.forEach(conversation => {
      let lastMessageDate = moment(
        conversation.recentMessageDateTime,
      ).fromNow();
      const listItemKey = `${conversation.conversationId}`;
      result.push(
        <TouchableOpacity
          activeOpacity={0.8}
          key={listItemKey}
          style={itemStyles.listItem}
          onPress={() =>
            NavigationService.navigate('ConversationContainer', {
              conversationId: conversation?.conversationId,
            })
          }
        >
          <View style={itemStyles.itemSection}>
            {conversation.hcpPhotoUrl ? (
              <Image
                source={{uri: conversation.hcpPhotoUrl}}
                style={itemStyles.circleStyle}
              />
            ) : (
              <Image
                source={require('../../components/Images/bg.png')}
                style={itemStyles.circleStyle}
              />
            )}
            <Text style={(AppFonts.listItemTitleTouchable, itemStyles.title)}>
              {conversation.display.title}
            </Text>
            <Text
              style={[
                {...AppFonts.bodyTextXtraSmall},
                {
                  width: '22%',
                  alignSelf: 'center',
                },
              ]}
            >
              {lastMessageDate}
            </Text>
          </View>

          <View style={itemStyles.wrapper}>
            <Text style={AppFonts.listItemDescription}>
              {conversation.display.description}
            </Text>
          </View>
          <View style={itemStyles.itemSection}></View>
        </TouchableOpacity>,
      );
    });
    return result;
  };

  const renderConversations = () => {
    return (
      <>
        {loading && (
          <ActivityIndicator
            style={{
              flex: 1,
              backgroundColor: AppColors.baseGray,
              alignItems: 'center',
            }}
          />
        )}
        <FlatList
          style={{flex: 1, backgroundColor: AppColors.baseGray}}
          refreshControl={
            <RefreshControl
              tintColor={AppColors.blue}
              colors={[AppColors.blue]}
              refreshing={refreshing}
              onRefresh={() => load(true)}
            />
          }
          renderItem={renderConversationItem}
          data={conversationData}
        />
      </>
    );
  };

  const load = async () => {
    try {
      setLoading(true);
      const {data} = await conversationsService();
      setConversationData(data?.[0]?.positions);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      Alert.alert(
        'Message Center Error',
        'We are having trouble loading your conversations. Please try again.',
      );
    }
  };

  return <>{renderConversations()}</>;
};

const itemStyles = StyleSheet.create({
  listItem: {
    backgroundColor: variables.white,
    paddingLeft: 16,
    paddingRight: 8,
    borderTopWidth: 0.5,
    borderBottomColor: AppColors.gray,
    borderTopColor: AppColors.gray,
    borderRightColor: AppColors.gray,
  },
  itemSection: {
    alignContent: 'center',
    marginTop: 5,
    bottom: -6,
    flexDirection: 'row',
  },
  circleStyle: {
    width: 50,
    height: 50,
    alignSelf: 'center',
    borderRadius: 50 / 2,
    borderWidth: 2,
    borderColor: AppColors.imageColor,
  },
  title: {
    fontSize: 18,
    alignSelf: 'center',
    width: '55%',
    color: AppColors.blue,
    marginLeft: 18,
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  body: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});

export default MessageCenter;
