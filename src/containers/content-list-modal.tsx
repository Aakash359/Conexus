import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { StyleProp, ViewProperties, View, ViewStyle } from 'react-native'
import variables from '../theme'
import { Actions } from 'react-native-router-flux'
import { ConexusContentList } from '../components';
import { ContentListModel } from '../stores/content-list-model';
import { ModalHeader, ConexusIconButton } from '../components';

interface ContentListModalProps extends ViewProperties {
    title?: string,
    style?: StyleProp<ViewStyle>
    data: typeof ContentListModel.Type[]
}

interface ContentListModalState {

}

@observer
export class ContentListModal extends Component<ContentListModalProps, ContentListModalState> {

    constructor(props: ContentListModalProps, state: ContentListModalState) {
        super(props, state);
    }

    componentWillMount() {

    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: variables.baseGray}}>
            <ModalHeader title={this.props.title} right={() =>
                <ConexusIconButton iconName="cn-x" iconSize={15} onPress={Actions.pop}></ConexusIconButton>
            } />
            <ConexusContentList style={{ flex: 1 }} data={this.props.data} />
            </View>
        )
    }
}
