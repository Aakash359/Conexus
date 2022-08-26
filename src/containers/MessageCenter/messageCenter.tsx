import React, {useState, useEffect} from 'react';
import {
  Alert,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
let moment = require('moment');
import {useSelector} from '../../redux/reducers/index';
import {Avatar} from '../../components/avatar';
import {Circle} from '../../components/circle';
import {ViewHeader} from '../../components/view-header';
import {UserStore} from '../../stores';
import {AppFonts, AppColors} from '../../theme';
import {
  ConversationStore,
  ConversationPositionModel,
} from '../../stores/message-center';
import NavigationService from '../../navigation/NavigationService';
import {conversationsService} from '../../services/MessageCenter/conversationsService';
import FacilitySelectionContainer from '../../components/facility-selection-container';

interface MessageCenterProps {
  conversationStore?: typeof ConversationStore.Type;
  userStore?: UserStore;
}

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

  console.log('Lof===>', conversationData);

  const selectedFacilityId = () => {
    return userInfo?.user?.userFacilities?.[0]?.facilityId;
  };

  const selectedFacility = () => {
    return conversationData.find(
      i => i.facilityId === selectedFacilityId,
      console.log('i===>', i),
    );
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

  const showLoading = (): boolean => {
    if (refreshing) {
      return false;
    }
    return loading;
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
          key={listItemKey}
          style={itemStyles.listItem}
          onPress={() =>
            NavigationService.navigate('ConversationContainer', {
              conversationId: conversation?.conversationId,
            })
          }>
          <View style={itemStyles.itemSection}>
            <Avatar
              size={48}
              source={conversation.hcpPhotoUrl}
              style={{alignSelf: 'center', top: 5}}
            />
            <Text style={(AppFonts.listItemTitleTouchable, itemStyles.title)}>
              {conversation.display.title}
            </Text>
            <Text
              style={[
                {...AppFonts.bodyTextXtraSmall},
                {
                  marginStart: 120,
                  textAlignVertical: 'center',
                  top: 5,
                  marginLeft: 10,
                },
              ]}>
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
      <FlatList
        style={{flex: 1, backgroundColor: AppColors.baseGray}}
        // onRefresh={this.load.bind(this, true)}
        refreshing={refreshing}
        renderItem={renderConversationItem}
        data={conversationData}
      />
    );
  };

  const load = async (refreshing: boolean = false) => {
    try {
      const {data} = await conversationsService();
      setConversationData(data?.[0]?.positions);
      console.log('data===>', data);
      setRefreshing(false);
    } catch (error) {
      console.log(error);
      setRefreshing(false);
      Alert.alert(
        'Message Center Error',
        'We are having trouble loading your conversations. Please try again.',
      );
    }
  };

  return (
    <>{renderConversations()}</>
    // <FacilitySelectionContainer
    //   // showNoData={showNoData()}
    //   // showLoading={showLoading()}
    //   // noDataText="No Conversations Available"
    //   // facilityHeaderCaption="Showing conversations for"
    //   // refreshing={refreshing}
    //   // onRefresh={load()}
    //   onFacilityChosen={(facilityId: string) => forceUpdate()}>
    //   {renderConversations()}
    // </FacilitySelectionContainer>
  );
};

const itemStyles = StyleSheet.create({
  listItem: {
    backgroundColor: AppColors.white,
    paddingLeft: 8,
    paddingRight: 8,
  },
  itemSection: {
    top: 5,
    marginLeft: 5,
    flexDirection: 'row',
    marginBottom: 4,
  },
  title: {
    textAlignVertical: 'center',
    top: 3,
    fontSize: 18,
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
