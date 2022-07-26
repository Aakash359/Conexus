import React from 'react';
import {Alert, StyleSheet, FlatList, View, Text} from 'react-native';
// import {Text, ListItem, Left, Right, Body} from 'native-base';
let moment = require('moment');
import {
  Avatar,
  ViewHeader,
  Circle,
  FacilitySelectionContainer,
} from '../../components';

import {ScreenType} from '../../common';
// import { Actions } from 'react-native-router-flux'
import {UserStore} from '../../stores';
import {AppFonts, AppColors} from '../../theme';
import {
  ConversationStore,
  ConversationPositionModel,
} from '../../stores/message-center';
import {logger} from 'react-native-logs';
const log = logger.createLogger();

interface MessageCenterProps {
  conversationStore?: typeof ConversationStore.Type;
  userStore?: UserStore;
}

interface MessageCenterState {
  refreshing: boolean;
  loading: boolean;
}

const FacilityMessageCenterContainer: React.FC<MessageCenterProps> = ({
  refreshing,
  loading,
}) => {
  // const [ refreshing  setRefreshing]
  // get selectedFacilityId() {
  //   return this.props.userStore.selectedFacilityId;
  // }

  // get selectedFacility() {
  //   return this.props.conversationStore.facilities.find(
  //     i => i.facilityId === this.selectedFacilityId,
  //   );
  // }

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
    // const {conversationStore} = this.props;
    // if (this.state.refreshing) {
    //   return false;
    // }
    // return this.state.loading;
  };

  // constructor(props: MessageCenterProps, state: MessageCenterState) {
  //   super(props, state);
  //   this.state = {
  //     refreshing: false,
  //     loading: true,
  //   };
  // }

  // componentDidMount() {
  //   this.load();
  // }

  // renderConversationItem({item, index}) {
  //   let position = item as typeof ConversationPositionModel.Type;
  //   let i = index;
  //   const result = [];
  //   const needKey = `need-${position.needId}`;

  //   result.push(
  //     <ViewHeader
  //       first={i === 0}
  //       key={needKey}
  //       title={position.display.title}
  //       description={position.display.description}
  //     />,
  //   );

  //   position.conversations.forEach(conversation => {
  //     let lastMessageDate = moment(
  //       conversation.recentMessageDateTime,
  //     ).fromNow();
  //     const listItemKey = `${conversation.conversationId}`;

  //     result.push(
  //       <ListItem
  //         key={listItemKey}
  //         avatar
  //         style={itemStyles.listItem}
  //         // onPress={() =>
  //         //     Actions[ScreenType.MESSAGE_CENTER.CONVERSATION]({
  //         //     conversationId: conversation.conversationId
  //         // })}
  //       >
  //         <Left style={itemStyles.itemSection}>
  //           <Circle
  //             size={10}
  //             color={conversation.unreadCount ? AppColors.red : 'transparent'}
  //             style={{marginTop: 19, marginRight: 4}}
  //           />
  //           <Avatar size={48} source={conversation.hcpPhotoUrl} />
  //         </Left>
  //         <Body
  //           style={StyleSheet.flatten([
  //             itemStyles.itemSection,
  //             itemStyles.body,
  //           ])}>
  //           <Text style={AppFonts.listItemTitleTouchable}>
  //             {conversation.display.title}
  //           </Text>
  //           <Text style={AppFonts.listItemDescription}>
  //             {conversation.display.description}
  //           </Text>
  //         </Body>
  //         <Right style={itemStyles.itemSection}>
  //           <Text
  //             style={[{...AppFonts.bodyTextXtraSmall}, {textAlign: 'right'}]}>
  //             {lastMessageDate}
  //           </Text>
  //         </Right>
  //       </ListItem>,
  //     );
  //   });

  //   return result;
  // }

  // renderConversations() {
  //   return (
  //     <FlatList
  //       style={{flex: 1}}
  //       onRefresh={this.load.bind(this, true)}
  //       refreshing={this.state.refreshing}
  //       renderItem={this.renderConversationItem.bind(this)}
  //       data={this.selectedFacility.positions}
  //     />
  //   );
  // }

  // load(refreshing: boolean = false) {
  //   const {conversationStore} = this.props;
  //   this.setState({refreshing, loading: true});

  //   conversationStore
  //     .load()
  //     .then(() => {
  //       this.setState({refreshing: false, loading: false});
  //     })
  //     .catch(error => {
  //       this.setState({refreshing: false, loading: false});
  //       log.info(error);
  //       Alert.alert(
  //         'Message Center Error',
  //         'We are having trouble loading your conversations. Please try again.',
  //       );
  //     });
  // }

  return (
    <View>
      <Text>hi</Text>
    </View>
    // <FacilitySelectionContainer
    //   showNoData={showNoData}
    //   showLoading={showLoading}
    //   noDataText="No Conversations Available"
    //   facilityHeaderCaption="Showing conversations for"
    //   refreshing={this.state.refreshing}
    //   onRefresh={this.load.bind(this, true)}
    //   // onFacilityChosen={(facilityId: string) => this.forceUpdate()}>
    //   // {!!this.selectedFacility && this.renderConversations()}
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
    borderWidth: 0,
    borderBottomWidth: 0,
  },
  body: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});

export default FacilityMessageCenterContainer;
