
import React, { Component } from 'react'
import { Text } from 'native-base'
import { observer } from 'mobx-react'
import { ViewProperties, StyleSheet, View, InteractionManager } from 'react-native'
import variables from '../theme'
import { Actions } from 'react-native-router-flux'
import Gallery from 'react-native-image-gallery'
import { ConexusIconButton, ModalHeader } from '../components'
import { AppFonts } from '../theme'
import { CachedImage } from 'react-native-cached-image'

interface ImageGalleryProps extends ViewProperties {
    images: Array<string>,
    title?: string,
    initialRenderCount?: number
}

interface ImageGalleryState {
    index: number,
    images: Array<any>,
    allImages: Array<any>,
    closeButtonImageSource?: any,
    showGallery: boolean
}

@observer
export class ImageGallery extends Component<ImageGalleryProps, ImageGalleryState> {

    constructor(props, state) {
        super(props, state);
        let displayCount = this.props.initialRenderCount || 2
        const images = this.props.images.map(uri => { return { source: { uri } } });;
        
        // provide the gallery the first 2 images initially so they load quickly. The candiate-detail view should have them cached.

        this.state = {
            index: 0,
            images: images.slice(0, displayCount),
            allImages: images,
            showGallery: false
        };

        InteractionManager.runAfterInteractions(() => {
            this.setState({ showGallery: true });
        })

        this.delayLoadCachedImages(displayCount + 1, images);
    }

    delayLoadCachedImages(displayCount: number, allImages: any[]) {
        setTimeout(() => {
            this.setState({images: allImages.slice(0, displayCount)})

            if (displayCount < allImages.length) {
                this.delayLoadCachedImages(displayCount + 1, allImages)
            }
        }, 1000);
    }

    renderError(error) {
        return (
            <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: 'black', fontSize: 15, fontStyle: 'italic' }}>This image cannot be displayed...</Text>
            </View>
        );
    }

    renderImage(imageProps: any, imageDimensions: any) {
        return (
            <CachedImage { ...imageProps } />
        )
    }

    onChangeImage(index) {
        this.setState({ index });
    }

    componentWillMount() {

    }

    render() {
        const { title } = this.props;
        const { index, allImages } = this.state;
        return (
            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'stretch', backgroundColor: variables.baseGray }} >
                <ModalHeader title={title} right={() =>
                    <ConexusIconButton iconName="cn-x" iconSize={15} onPress={Actions.pop}></ConexusIconButton>
                } />
                <View style={style.modalSubheader}>
                    <Text style={style.modalSubheaderText}>{index + 1} of {allImages.length}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    {
                        this.state.showGallery && <Gallery
                            style={{ flex: 1 }}
                            images={this.state.images}
                            pageMargin={28}
                            imageComponent={this.renderImage.bind(this)}
                            errorComponent={this.renderError.bind(this)}
                            onPageSelected={this.onChangeImage.bind(this)}
                            initialPage={0} />
                    }
                </View>
            </View>
        )
    }
}

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
        paddingRight: 18
    },
    circle: {
        margin: 3
    }
})