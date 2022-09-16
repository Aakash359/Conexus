import React, {Component} from 'react';
import {StyleSheet, View, Text, StyleProp, ViewStyle} from 'react-native';
import {ConexusIcon} from '../components/conexus-icon';
import Icon from 'react-native-vector-icons/Ionicons';
import variables from '../theme';
import FitImage from 'react-native-fit-image';
import {AppFonts} from '../theme';
import {
  ContentListModel,
  ContentListItemModel,
} from '../stores/content-list-model';

interface ConexusIconListProps {
  styles?: StyleProp<ViewStyle>;
  data: any;
}
const blockPadding = 28;

const ConexusContentList = (props: ConexusIconListProps) => {
  const {styles, data} = props;

  const renderImage = uri => {
    var source = {uri};
    return <FitImage source={source} style={style.contentBlockListItemImage} />;
  };

  const renderText = (text: string) => {
    return <Text style={style.contentBlockListItemText}>{text}</Text>;
  };

  const renderIcon = (name: string, iColor: string) => {
    return (
      <Icon
        style={style.contentBlockListItemIcon}
        name="ios-close-circle-sharp"
        size={27}
        color={iColor}
      />
    );
  };

  const renderContentBlockList = (list: typeof ContentListItemModel.Type[]) => {
    return list.map((item, index) => (
      <View
        key={`content-block-list-item-${index}`}
        style={style.contentBlockListItem}
      >
        {!!item.icon && renderIcon(item.icon, item.iconColor)}
        {!!item.image && renderImage(item.image)}
        {!!item.text && renderText(item.text)}
      </View>
    ));
  };

  const renderContentBlock = (
    item: typeof ContentListModel.Type,
    index: number,
  ) => {
    return (
      <View
        key={`content-block-${index}`}
        style={StyleSheet.flatten([
          style.contentBlock,
          (index + 1) % 2 === 0 ? style.contentBlockEven : {},
        ])}
      >
        <Text style={style.contentBlockTitle}>{item.title}</Text>
        {item.list && renderContentBlockList(item.list)}
      </View>
    );
  };

  return (
    <View style={props.styles}>
      {data.map((item, index) => renderContentBlock(item, index))}
    </View>
  );
};

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

export default ConexusContentList;
