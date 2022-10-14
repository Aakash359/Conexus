import React, {
  useState,
  useRef,
  forwardRef,
  useEffect,
  createRef,
  useCallback,
} from 'react';
import {
  View,
  findNodeHandle,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  FlatList,
  Animated,
} from 'react-native';
import {AppFonts, AppSizes, AppColors} from '../theme';
import {windowDimensions} from '../common';

const {width, height} = Dimensions.get('window');

const Tabs = props => {
  const [activetab, setActiveTab] = useState(props.data[0].key);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef();

  //   useEffect(() => {
  //     if (props.route && props.route.params && props.route.params.parentTab) {
  //       if (props.route.params.parentTab == 'faqs') {
  //       } else if (props.route.params.parentTab == 'supportTicket') {
  //         onItemPress(1);
  //       }
  //     }
  //   }, []);

  const OneTab = forwardRef(({item, onItemPress}, ref) => {
    return (
      <TouchableOpacity
        onPress={onItemPress}
        style={activetab == item.key ? styles.activeTab : styles.inActiveTab}
      >
        <View ref={ref}>
          <Text
            style={
              activetab == item.key
                ? styles.activeTabText
                : styles.inActiveTabText
            }
          >
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  });

  const CustomTabs = ({data, scrollX, onItemPress}) => {
    const containerRef = useRef();
    return (
      <View
        style={{
          position: 'absolute',
          top: -5,
          width: windowDimensions.width,
        }}
      >
        <View
          ref={containerRef}
          style={{
            justifyContent: 'space-evenly',
            flex: 1,
            flexDirection: 'row',
            borderBottomColor: 'grey',
            borderBottomWidth: 1,
          }}
        >
          {data.map((item, index) => {
            return (
              <OneTab
                key={item.key}
                item={item}
                ref={item.ref}
                onItemPress={() => onItemPress(index)}
              />
            );
          })}
        </View>
      </View>
    );
  };

  const onItemPress = useCallback(itemIndex => {
    flatListRef?.current?.scrollToOffset({
      offset: itemIndex * windowDimensions.width,
    });
  });

  const onViewableItemsChanged = useCallback(({viewableItems, changed}) => {
    setActiveTab(viewableItems[0].key);
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={props.data}
        scrollEnabled={!props.hideScroll}
        keyExtractor={item => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: false},
        )}
        bounces={false}
        renderItem={({item}) => {
          return (
            <View
              style={{
                width: windowDimensions.width,
                height: windowDimensions.height,
              }}
            >
              <item.component
                onItemPress={onItemPress}
                {...item}
                navigation={props.navigation}
              />
            </View>
          );
        }}
      />
      <CustomTabs
        scrollX={scrollX}
        data={props.data}
        onItemPress={onItemPress}
      />
    </View>
  );
};

export default Tabs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: AppColors.white,
    borderBottomWidth: 1,
  },

  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    width: '100%',
  },
  activeTab: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    width: '50%',
    borderBottomColor: AppColors.blue,
    borderBottomWidth: 3,
  },
  inActiveTab: {
    backgroundColor: '#fff',
    borderBottomColor: AppColors.white,
    borderBottomWidth: 3,
    width: '50%',
    paddingVertical: 12,
  },
  activeTabText: {
    alignSelf: 'center',
    color: AppColors.blue,
    // fontFamily: Dimension.CustomRegularFont,
    fontSize: 14,
  },
  inActiveTabText: {
    alignSelf: 'center',
    color: AppColors.mediumGray,
    // fontFamily: Dimension.CustomRegularFont,
    fontSize: 14,
  },
});
