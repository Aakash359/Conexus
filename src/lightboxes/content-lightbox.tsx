import React from 'react'
import { View, StyleSheet, ViewProperties } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { ConexusLightbox } from './base-lightbox'
import { AppSizes } from '../theme'

interface ContentLightboxProps extends ViewProperties {
    title: string,
    renderContent?: () => any,
    onClose: (value?: any) => any
}

interface ContentLightboxState {
}

export class ContentLightbox extends React.Component<ContentLightboxProps, ContentLightboxState> {
    constructor(props) {
        super(props);

        this.state = {
        };
    }


    _close() {
        if (this.props.onClose && this.props.onClose.call) {
            this.props.onClose();
        }

        Actions.pop()
    }

    render() {
        const { title, renderContent } = this.props;

        return (
            <ConexusLightbox closeable style={{ padding: 0 }} title={title} height={AppSizes.screen.height * .75} horizontalPercent={0.9}>
                <View style={styles.content}>
                    {renderContent && renderContent()}
                </View>
            </ConexusLightbox>
        )
    }
}


const styles = StyleSheet.create({
    content: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 18,
        alignSelf: 'stretch',
        alignItems: 'stretch',
        padding: 20
    },

});