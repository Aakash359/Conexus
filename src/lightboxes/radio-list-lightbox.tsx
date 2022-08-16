import React from 'react';
// import { ListItem } from 'native-base'
import {
  View,
  Text,
  StyleSheet,
  ViewProperties,
  ActivityIndicator,
  FlatList,
  ScrollView,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {ConexusLightbox} from './base-lightbox';
import {AppFonts, AppColors} from '../theme';
import {ActionButton, ConexusIcon, Avatar} from '../components';

export type RadioListItem = {value: any; title: string; imageUrl: string};

interface RadioListLightboxProps extends ViewProperties {
  title: string;
  actionText?: string;
  data: RadioListItem[] | (() => Promise<Array<RadioListItem>>);
  showImages: boolean;
  facilityImages: boolean;
  hideSelectedIcon: boolean;
  value: any;
  onClose: (value: any) => any;
}

interface RadioListLightboxState {
  value: any;
  data: RadioListItem[];
  loading: boolean;
}

export class RadioListLightbox extends React.Component<
  RadioListLightboxProps,
  RadioListLightboxState
> {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.value,
      data: [],
      loading: false,
    };
  }

  componentWillMount() {
    if (this.props.data && !!this.props.data['call']) {
      this.setState({loading: true, data: []});

      let f = this.props['data'] as () => Promise<Array<RadioListItem>>;
      f().then(items => {
        this.setState({loading: false, data: items});
      });
    } else {
      this.setState({data: (this.props.data as Array<RadioListItem>) || []});
    }
  }

  _selectValue(value: any) {
    const {actionText} = this.props;

    this.setState({value}, () => {
      if (!!!actionText) {
        setTimeout(() => {
          this._close();
        }, 100);
      }
    });
  }

  _close() {
    if (this.props.onClose && this.props.onClose.call) {
      this.props.onClose(this.state.value);
    }

    Actions.pop();
  }

  renderItem({item, index}) {
    const {showImages, facilityImages, hideSelectedIcon} = this.props;

    var i: RadioListItem = item;

    return (
      <ListItem
        key={`${i.value}${index}`}
        style={styles.listItem}
        onPress={this._selectValue.bind(this, i.value)}>
        {showImages && (
          <Avatar
            source={i.imageUrl}
            facility={facilityImages}
            size={45}
            style={styles.listItemAvatar}
          />
        )}
        <View style={styles.listItemTitleWrapper}>
          <Text style={AppFonts.listItemTitle}>{i.title}</Text>
        </View>
        {!hideSelectedIcon && this.state.value === i.value && (
          <ConexusIcon
            style={styles.listItemIcon}
            size={21}
            color={AppColors.blue}
            name="cn-check"
          />
        )}
      </ListItem>
    );
  }
  render() {
    const {title, actionText} = this.props;
    const {value, data, loading} = this.state;

    return (
      <ConexusLightbox
        closeable
        style={{padding: 0}}
        title={title}
        height={380}
        horizontalPercent={0.9}>
        <ScrollView contentContainerStyle={styles.content}>
          {!loading && (
            <FlatList
              style={styles.list}
              contentContainerStyle={styles.listContent}
              data={data}
              renderItem={this.renderItem.bind(this)}
            />
          )}
          {loading && (
            <ActivityIndicator color={AppColors.blue} style={{flex: 1}} />
          )}
        </ScrollView>
        {!!actionText && (
          <View style={styles.lightboxFooter}>
            <ActionButton
              primary
              disabled={value == null || value === ''}
              title={actionText}
              onPress={this._close.bind(this)}></ActionButton>
          </View>
        )}
      </ConexusLightbox>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    //flex: 1,
    flexDirection: 'column',
    alignSelf: 'stretch',
    alignItems: 'stretch',
    padding: 20,
    paddingTop: 0,
  },

  lightboxFooter: {
    backgroundColor: '#F0FAFF',
    borderTopColor: AppColors.lightBlue,
    borderTopWidth: 1,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  list: {},
  listContent: {
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

  listItemAvatar: {
    marginRight: 12,
  },
  listItemTitleWrapper: {
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
