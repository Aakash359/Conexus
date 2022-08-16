import React from 'react';
import {Alert, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
// import {Container, Text, ListItem, Left, Right, Body} from 'native-base';
let moment = require('moment');
import {Avatar, Circle} from '../../components';

import {ScreenType} from '../../common';
// import { Actions } from 'react-native-router-flux'
import {UserStore} from '../../stores';
import {AppFonts, AppColors} from '../../theme';
import {
  ConversationStore,
  ConversationModel,
} from '../../stores/message-center';
import {logger} from 'react-native-logs';
const log = logger.createLogger();
interface NurseMessageCenterProps {
  conversationStore?: typeof ConversationStore.Type;
  userStore?: UserStore;
}

interface NurseMessageCenterState {
  refreshing: boolean;
  loaded: boolean;
  loading: boolean;
}

export class NurseMessageCenterContainer extends React.Component<
  NurseMessageCenterProps,
  NurseMessageCenterState
> {
  constructor(props: NurseMessageCenterProps, state: NurseMessageCenterState) {
    super(props, state);
    this.state = {
      refreshing: false,
      loaded: false,
      loading: false,
    };
  }

  componentDidMount() {
    this._loadConversations();
  }

  _renderConversationItem({item, index}) {
    let conversation = item as typeof ConversationModel.Type;
    let lastMessageDate = moment(conversation.recentMessageDateTime).fromNow();

    return (
      <ListItem
        key={`${conversation.conversationId}`}
        avatar
        style={itemStyles.listItem}
        // onPress={() => Actions[ScreenType.MESSAGE_CENTER.CONVERSATION]({
        //     conversationId: conversation.conversationId
        // })}
      >
        <Left style={itemStyles.itemSection}>
          <Circle
            size={10}
            color={conversation.unreadCount ? AppColors.red : 'transparent'}
            style={{marginTop: 19, marginRight: 4}}
          />
          <Avatar size={48} source={conversation.facPhotoUrl} />
        </Left>
        <Body
          style={StyleSheet.flatten([itemStyles.itemSection, itemStyles.body])}>
          <Text style={AppFonts.listItemTitleTouchable}>
            {conversation.display.title}
          </Text>
          <Text style={AppFonts.listItemDescription}>
            {conversation.display.description}
          </Text>
        </Body>
        <Right style={itemStyles.itemSection}>
          <Text style={[{...AppFonts.bodyTextXtraSmall}, {textAlign: 'right'}]}>
            {lastMessageDate}
          </Text>
        </Right>
      </ListItem>
    );
  }

  _loadConversations(refreshing: boolean = false) {
    const {conversationStore} = this.props;
    this.setState({refreshing, loading: !refreshing});

    conversationStore
      .load()
      .then(() => {
        this.setState({refreshing: false, loading: false, loaded: true});
      })
      .catch(error => {
        this.setState({refreshing: false, loading: false});
        log.info(error);
        Alert.alert(
          'Message Center Error',
          'We are having trouble loading your conversations. Please try again.',
        );
      });
  }

  _renderConversationList() {
    const conversationStore = this.props
      .conversationStore as typeof ConversationStore.Type;
    const {refreshing} = this.state;

    this.loadedWithDataOnce = true;

    return (
      <FlatList
        style={{flex: 1}}
        onRefresh={this._loadConversations.bind(this, true)}
        refreshing={refreshing}
        renderItem={this._renderConversationItem.bind(this)}
        data={conversationStore.nurseConversations}
      />
    );
  }

  loadedWithDataOnce: boolean = false;

  render() {
    const conversationStore = this.props
      .conversationStore as typeof ConversationStore.Type;

    if (!this.loadedWithDataOnce && conversationStore.loading) {
      return (
        <Container>
          <ActivityIndicator style={{flex: 1}} color={AppColors.blue} />
        </Container>
      );
    }

    return <Container>{this._renderConversationList()}</Container>;
  }
}

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
