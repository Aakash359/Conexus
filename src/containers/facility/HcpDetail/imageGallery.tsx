import React, {useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  InteractionManager,
  TouchableOpacity,
  Button,
} from 'react-native';
import variables from '../../../theme';
// import {
//   ImageGallery,
//   ImageObject,
// } from '@georstat/react-native-image-gallery';
import {ImageGallery} from '@georstat/react-native-image-gallery';
import {ConexusIconButton} from '../../../components/conexus-icon-button';
import {ModalHeader} from '../../../components/modal-header';
import {AppFonts} from '../../../theme';
import {CachedImage} from 'react-native-cached-image';
import NavigationService from '../../../navigation/NavigationService';

interface ImageGalleryProps extends ViewProperties {
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
  const {initialRenderCount, title} = props;

  //   const Images = props.images.map((uri: any) => {
  //     return {source: {uri}};
  //   });

  const [index, setIndex] = useState(0);
  const [images, setImages] = useState(props?.route?.params?.images || '');
  const [allImages, setAllImages] = useState('');
  const [showGallery, setShowGallery] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const openGallery = () => setIsOpen(true);
  const closeGallery = () => setIsOpen(false);

  let displayCount = initialRenderCount || 2;

  // provide the gallery the first 2 images initially so they load quickly. The candiate-detail view should have them cached.

  // this.state = {
  //   index: 0,
  //   images: images.slice(0, displayCount),
  //   allImages: images,
  //   showGallery: false,
  // };

  //   InteractionManager.runAfterInteractions(() => setShowGallery(true));

  //     this.delayLoadCachedImages(displayCount + 1, images);
  //   }

  //   delayLoadCachedImages(displayCount: number, allImages: any[]) {
  //     setTimeout(() => {
  //       this.setState({images: allImages.slice(0, displayCount)});

  //       if (displayCount < allImages.length) {
  //         this.delayLoadCachedImages(displayCount + 1, allImages);
  //       }
  //     }, 1000);
  //   }

  const renderError = error => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{color: 'black', fontSize: 15, fontStyle: 'italic'}}>
          This image cannot be displayed...
        </Text>
      </View>
    );
  };

  const renderImage = (imageProps: any, imageDimensions: any) => {
    return <CachedImage {...imageProps} />;
  };

  const onChangeImage = index => {
    setIndex(index);
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
        backgroundColor: variables.baseGray,
      }}>
      <ModalHeader
        title={title}
        right={() => (
          <ConexusIconButton
            iconName="cn-x"
            iconSize={22}
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
      <View>
        <Button onPress={openGallery} title="Open Gallery" />
        <ImageGallery
          close={() => closeGallery()}
          isOpen={isOpen}
          images={images}
          // renderFooterComponent={renderFooterComponent}
          // renderHeaderComponent={renderHeaderComponent}
        />
      </View>
      {/* {showGallery && (
          <Gallery
            style={{flex: 1}}
            images={images}
            pageMargin={28}
            imageComponent={renderImage}
            errorComponent={renderError}
            onPageSelected={onChangeImage}
            initialPage={0}
          />
        )} */}
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
    color: variables.white,
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
});

export default ImageGalleries;
