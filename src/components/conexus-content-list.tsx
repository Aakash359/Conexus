import React, {Component} from 'react';
import {Text} from 'native-base';
import {
  StyleSheet,
  View,
  ViewProperties,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {ConexusIcon} from '../components/conexus-icon';
import variables from '../theme';
import FitImage from 'react-native-fit-image';
import {AppFonts} from '../theme';
import {logger} from 'react-native-logs';
import {
  ContentListModel,
  ContentListItemModel,
} from '../stores/content-list-model';

interface ConexusIconListProps extends ViewProperties {
  style?: StyleProp<ViewStyle>;
  data: typeof ContentListModel.Type[];
}
const log = logger.createLogger();

export class ConexusContentList extends Component<ConexusIconListProps> {
  componentWillMount() {}

  render() {
    return (
      <View style={this.props.style}>
        {this.props.data.map((item, index) =>
          this.renderContentBlock(item, index),
        )}
      </View>
    );
  }

  renderContentBlock(item: typeof ContentListModel.Type, index: number) {
    return (
      <View
        key={`content-block-${index}`}
        style={StyleSheet.flatten([
          style.contentBlock,
          (index + 1) % 2 === 0 ? style.contentBlockEven : {},
        ])}>
        <Text style={style.contentBlockTitle}>{item.title}</Text>
        {item.list && this.renderContentBlockList(item.list)}
      </View>
    );
  }

  renderContentBlockList(list: typeof ContentListItemModel.Type[]) {
    log.info('block list', list);
    return list.map((item, index) => (
      <View
        key={`content-block-list-item-${index}`}
        style={style.contentBlockListItem}>
        {!!item.icon && this.renderIcon(item.icon, item.iconColor)}
        {!!item.image && this.renderImage(item.image)}
        {!!item.text && this.renderText(item.text)}
      </View>
    ));
  }

  renderImage(uri) {
    var source = {uri};
    return <FitImage source={source} style={style.contentBlockListItemImage} />;
  }

  renderIcon(name: string, iColor: string) {
    return (
      <ConexusIcon
        name={name}
        color={iColor}
        size={24}
        style={style.contentBlockListItemIcon}
      />
    );
  }

  renderText(text: string) {
    return <Text style={style.contentBlockListItemText}>{text}</Text>;
  }
}

const blockPadding = 28;
const style = StyleSheet.create({
  rootView: {
    flex: 1,
  },

  contentBlock: {
    backgroundColor: variables.baseGray,
    padding: blockPadding,
    paddingBottom: blockPadding / 2,
  },

  contentBlockEven: {
    backgroundColor: variables.white,
  },

  contentBlockTitle: {
    ...AppFonts.bodyTextLarge,
  },

  contentBlockListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 14,
  },

  contentBlockListItemIcon: {
    paddingRight: 14,
  },

  contentBlockListItemText: {
    ...AppFonts.bodyTextNormal,
  },

  contentBlockListItemImage: {
    flex: 1,
  },
});
