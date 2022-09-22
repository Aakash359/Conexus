import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  Platform,
  Alert,
} from 'react-native';
import FitImage from 'react-native-fit-image';
import {ComparisonDataModel} from '../stores/comparison-data-model';
// import { Actions } from 'react-native-router-flux'
import {ScreenType} from '../common/constants';
import {AppFonts, AppColors} from '../theme';
import {ConexusContentList} from '../components';
import {ConexusIcon} from '../components/conexus-icon';
import NavigationService from '../navigation/NavigationService';
import {ReviewCandidateContentModal} from './Modals/ReviewCandidateContentModal';

export interface ComparisonListProps {
  index: number;
  count: number;
  cellWidth: number;
  data: Array<typeof ComparisonDataModel.Type>;
}

export const ComparisonList = (props: ComparisonListProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const {index, count, data, cellWidth} = props;

  const renderContentListCellInLightbox = (cell: any) => {
    return <ConexusContentList style={{flex: 1}} data={cell.details} />;
  };

  const renderCellImageInLightbox = (cell: typeof ComparisonDataModel.Type) => {
    const source = {uri: cell.imageUrl};
    return <FitImage resizeMode="contain" source={source} />;
  };

  const handleCellClick = (cell: typeof ComparisonDataModel.Type) => {
    const hasLink = !!cell.details;
    setModalVisible(true);
    if (hasLink) {
      // Actions[ScreenType.CONTENT_LIGHTBOX]
      // ({
      //   title: cell.headerTitle,
      //   renderContent: renderContentListCellInLightbox.bind(this, cell),
      // });
    }

    if (!!cell.imageUrl) {
      Actions[ScreenType.CONTENT_LIGHTBOX]({
        title: cell.headerTitle,
        renderContent: this._renderCellImageInLightbox.bind(this, cell),
      });
    }
  };

  const wrapCell = (cell: any, elements: () => any) => {
    const hasLink = !!cell.details || !!cell.imageUrl;
    if (hasLink) {
      return (
        <TouchableHighlight
          // activeOpacity={1}
          underlayColor="rgba(255,255,255,.87)"
          onPress={handleCellClick.bind(cell)}
        >
          {elements()}
        </TouchableHighlight>
      );
    }

    return <View>{elements()}</View>;
  };

  const renderTextCell = (cell: any) => {
    const lastCell = index + 1 === count;
    const descriptionStyle = StyleSheet.flatten([
      styles.textCellDescription,
      cell.title && {top: -6},
    ]);
    const hasLink = !!cell.details;
    const titleStyle = hasLink
      ? styles.textCellTitleTouchable
      : styles.textCellTitle;

    return (
      <View key={index}>
        {renderHeader(cell)}
        {wrapCell(cell, () => (
          <View
            style={StyleSheet.flatten([
              styles.cell,
              styles.textCell,
              lastCell && {borderRightWidth: 0},
            ])}
          >
            {!!cell.title && (
              <Text style={titleStyle}>{(cell.title || '').toUpperCase()}</Text>
            )}
            {!!cell.description && (
              <Text style={descriptionStyle}>{cell.description}</Text>
            )}
          </View>
        ))}
        {modalVisible && (
          <ReviewCandidateContentModal
            title={'Requested Time Off'}
            onRequestClose={() => setModalVisible(false)}
            onDismiss={() => setModalVisible(false)}
            onClose={() => setModalVisible(false)}
          />
        )}
      </View>
    );
  };

  const renderIconCell = (cell: any) => {
    const lastCell = index + 1 === count;

    return (
      <View key={index}>
        {renderHeader(cell)}
        {wrapCell(cell, () => (
          <View
            style={StyleSheet.flatten([
              styles.cell,
              styles.iconCell,
              lastCell && {borderRightWidth: 0},
            ])}
          >
            {!!cell.icon && (
              <ConexusIcon
                name={cell.icon || ''}
                size={26}
                color={cell.iconColor || AppColors.blue}
              />
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderImageCell = (cell: any) => {
    const source = {uri: cell.imageUrl};
    const lastCell = index + 1 === count;

    return (
      <View key={index}>
        {renderHeader(cell)}
        {wrapCell(cell, () => (
          <View
            style={StyleSheet.flatten([
              styles.cell,
              styles.imageCell,
              lastCell && {borderRightWidth: 0},
            ])}
          >
            {
              <FitImage
                resizeMode="contain"
                source={source}
                style={[{width: cellWidth - 16, height: 84}]}
              />
            }
          </View>
        ))}
      </View>
    );
  };

  const renderHeader = (cell: any) => {
    return (
      <View style={[styles.headerRow, {width: cellWidth}]}>
        <Text
          numberOfLines={1}
          lineBreakMode="clip"
          style={[styles.headerRowText]}
        >
          {index > 0 ? '' : cell.headerTitle || ''}
        </Text>
      </View>
    );
  };

  const cells = data.map((cell, index) => {
    return (
      <View key={index.toString()}>
        {cell.type === 'text' && renderTextCell(cell)}
        {cell.type === 'icon' && renderIconCell(cell)}
        {cell.type === 'image' && renderImageCell(cell)}
      </View>
    );
  });

  return <View style={styles.container}>{cells}</View>;
};

const headerHeight = 26;

const getHeaderRowTextOSStyle = () => {
  return Platform.OS === 'android'
    ? {
        position: 'relative',
        top: -2,
        ...AppFonts.bodyTextXtraSmall,
      }
    : {};
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.white,
  },
  cell: {
    borderColor: AppColors.lightBlue,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: headerHeight,
  },

  textCell: {
    height: 70,
    paddingTop: 5,
  },

  iconCell: {
    height: 60,
  },

  imageCell: {
    height: 90,
  },

  textCellTitle: {
    opacity: 0.9,
    ...AppFonts.candidateComparison.textCellTitle,
  },

  textCellTitleTouchable: {
    opacity: 0.9,
    ...AppFonts.candidateComparison.textCellTitleTouchable,
  },

  textCellDescription: {
    opacity: 0.8,
    position: 'relative',
    ...AppFonts.candidateComparison.textCellDescription,
  },

  headerRow: {
    position: 'absolute',
    paddingLeft: 6,
    left: 0,
    right: 0,
    height: headerHeight,

    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',

    opacity: 0.9,
    backgroundColor: '#FBFCFD',
  },

  headerRowText: {
    ...AppFonts.bodyTextXtraSmall,
    ...getHeaderRowTextOSStyle(),
  },
});
