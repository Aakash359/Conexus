import React, {useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableHighlight,
  Falsy,
  ImageStyle,
  RecursiveArray,
  RegisteredStyle,
  ViewStyle,
} from 'react-native';
import variables, {AppColors} from '../../../theme';
import ImageSlider from 'react-native-image-slider';
import {ConexusIconButton} from '../../../components/conexus-icon-button';
import {ModalHeader} from '../../../components/modal-header';
import {AppFonts} from '../../../theme';
import {CachedImage} from 'react-native-cached-image';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationService from '../../../navigation/NavigationService';

interface ImageGalleryProps {
  images: Array<string>;
  title?: string;
  initialRenderCount?: number;
}

interface ImageGalleryState {
  index: number;
  images: Array<any>;
  allImages: Array<any>;
  closeButtonImageSource?: any;
  showGallery: boolean;
}

// const images = [
//   {
//     id: 1,
//     url: 'https://i.picsum.photos/id/100/2500/1656.jpg?hmac=gWyN-7ZB32rkAjMhKXQgdHOIBRHyTSgzuOK6U0vXb1w',
//     // any other extra info you want
//   },
// ];

const ImageGalleries = (props: ImageGalleryProps, state: ImageGalleryState) => {
  const [index, setIndex] = useState(0);
  let displayCount = props?.route?.params?.initialRenderCount || 2;
  const images = props?.route?.params?.images;

  const [image, setImages] = useState(images.slice(0, displayCount));
  const [showGallery, setShowGallery] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const openGallery = () => setIsOpen(true);
  const closeGallery = () => setIsOpen(false);
  const {title} = props?.route?.params;

  console.log('displayCount====>', props);

  const Images = [
    'https://placeimg.com/640/640/nature',
    'https://placeimg.com/640/640/people',
    'https://placeimg.com/640/640/animals',
    'https://placeimg.com/640/640/beer',
  ];

  const renderError = (error: any) => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            color: 'black',
            fontSize: 15,
            fontStyle: 'italic',
          }}
        >
          This image cannot be displayed...
        </Text>
      </View>
    );
  };

  const renderImage = (imageProps: any, imageDimensions: any) => {
    return <CachedImage {...imageProps} />;
  };

  const onChangeImage = (index: React.SetStateAction<number>) => {
    setIndex(index);
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
        backgroundColor: variables.baseGray,
      }}
    >
      <ModalHeader
        title={title}
        right={() => (
          <Icon
            name="close-outline"
            size={30}
            color={AppColors.blue}
            onPress={() => NavigationService.goBack()}
          />
        )}
      />
      <View style={style.modalSubheader}>
        <Text style={style.modalSubheaderText}>
          Index of number
          {/* {index + 1} of {allImages.length} */}
        </Text>
      </View>
      <ImageSlider
        loopBothSides
        autoPlayWithInterval={3000}
        images={Images}
        customSlide={({index, item, width}) => (
          <>
            <View key={index} style={[style, style.customSlide]}>
              <Image
                source={{
                  uri: item,
                }}
                style={style.customImage}
              />
            </View>
          </>
        )}
        customButtons={(position: number, move: (arg0: number) => void) => (
          <View style={style.buttons}>
            {Images.map((image, index) => {
              return (
                <TouchableHighlight
                  key={index}
                  underlayColor="#ccc"
                  onPress={() => move(index)}
                  style={style.button}
                >
                  <Text style={position === index && style.buttonSelected}>
                    {index + 1}
                  </Text>
                </TouchableHighlight>
              );
            })}
          </View>
        )}
      />
    </View>
  );
};

const style = StyleSheet.create({
  modalSubheader: {
    backgroundColor: variables.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingLeft: 18,
    paddingBottom: 8,
    paddingRight: 18,
  },
  modalSubheaderText: {
    ...AppFonts.bodyTextNormal,
    color: AppColors.white,
  },
  footer: {
    backgroundColor: variables.blue,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 18,
    paddingLeft: 18,
    paddingBottom: 18,
    paddingRight: 18,
  },
  circle: {
    margin: 3,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  slider: {backgroundColor: '#000', height: 350},
  content1: {
    width: '100%',
    height: 50,
    marginBottom: 10,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content2: {
    width: '100%',
    height: 100,
    marginTop: 10,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentText: {color: '#fff'},
  buttons: {
    zIndex: 1,
    height: 15,
    marginTop: -25,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    margin: 3,
    width: 15,
    height: 15,
    opacity: 0.9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSelected: {
    opacity: 1,
    color: AppColors.red,
  },
  customSlide: {
    backgroundColor: AppColors.baseGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customImage: {
    width: 392,
    height: 500,
  },
});

export default ImageGalleries;
