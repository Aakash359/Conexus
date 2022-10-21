import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import FitImage from 'react-native-fit-image';
import {ScreenType} from '../common/constants';
import {AppFonts, AppColors} from '../theme';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationService from '../navigation/NavigationService';
import {ReviewCandidateContentModal} from './Modals/ReviewCandidateContentModal';
import ConexusContentList from './conexus-content-list';

export interface ComparisonListProps {
  index: number;
  count: number;
  cellWidth: number;
  data: any;
}

export const ComparisonList = (props: ComparisonListProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const {index, count, data, cellWidth} = props;

  const renderContentList = (cell: any) => {
    if (cell.details && cell.details.length > 0 && cell.details != undefined) {
      return <ConexusContentList style={{flex: 1}} data={cell.details} />;
    }
  };

  const renderCellImageInLightbox = (cell: any) => {
    const source = {uri: cell.imageUrl};
    return <FitImage resizeMode="contain" source={source} />;
  };

  const handleCellClick = (cell: any) => {
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
    const hasLink = cell.details || cell.imageUrl;
    if (hasLink) {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          underlayColor="rgba(255,255,255,.87)"
          onPress={handleCellClick.bind(cell)}
        >
          {elements()}
          {modalVisible && (
            <ReviewCandidateContentModal
              title={cell.headerTitle}
              renderContent={() => renderContentList(cell)}
              onRequestClose={() => setModalVisible(false)}
              onDismiss={() => setModalVisible(false)}
              onClose={() => setModalVisible(false)}
            />
          )}
        </TouchableOpacity>
      );
    }

    return (
      <View>
        {elements()}
        {modalVisible && (
          <ReviewCandidateContentModal
            title={cell.headerTitle}
            renderContent={() => renderContentList(cell)}
            onRequestClose={() => setModalVisible(false)}
            onDismiss={() => setModalVisible(false)}
            onClose={() => setModalVisible(false)}
          />
        )}
      </View>
    );
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
              <Icon
                color={cell.iconColor || AppColors.blue}
                size={26}
                name="checkmark-circle"
              />
            )}
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
