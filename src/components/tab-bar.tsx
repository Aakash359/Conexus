
import React, { Component } from 'react'
import { Text } from 'native-base'
import { observer } from 'mobx-react'
import { ViewProperties, StyleSheet, TouchableOpacity, View, Platform } from 'react-native'
import { AppFonts, AppColors } from '../theme'
import { BubbleLabel } from '../components'

export type TabDetails = {
    id: string,
    title: string,
    badge?: string,
    badgeColor?: string,
    badgeTextColor?: string
}

interface TabBarProps extends ViewProperties {
    tabs: TabDetails[],
    selectedTabId?: string,
    onTabSelection: (selectedTab: TabDetails) => any
}

interface TabBarState {
    selectedTab: TabDetails
}

@observer
export class TabBar extends Component<TabBarProps, TabBarState> {

    constructor(props, state) {
        super(props, state);

        this.state = {
            selectedTab: this.props.tabs.find(i => i.id === this.props.selectedTabId) || this.props.tabs[0]
        }
    }

    componentWillMount() {

    }

    componentWillReceiveProps(newProps: TabBarProps) {
        this.setState({
            selectedTab: newProps.tabs.find(i => i.id === newProps.selectedTabId) || newProps.tabs[0]
        })
    }

    _selectTab(tab: TabDetails) {
        this.setState({ selectedTab: tab })
        this.props.onTabSelection(tab)
    }

    renderButton(tab: TabDetails) {
        const { selectedTab } = this.state
        const selected = selectedTab === tab

        return (
            <TouchableOpacity
                key={tab.id} style={selected ? styles.buttonSelected : styles.button}
                onPress={this._selectTab.bind(this, tab)}>
                <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                    <Text style={selected ? styles.buttonSelectedText : styles.buttonText}>{tab.title}</Text>
                    {!!tab.badge &&
                        <BubbleLabel
                            height={16}
                            title={tab.badge}
                            style={
                                StyleSheet.flatten([
                                    styles.badge, {
                                        width: tab.badge.length === 1 ? 16 : 24,
                                        backgroundColor: tab.badgeColor || AppColors.green,
                                    }])
                            }
                            textStyle={StyleSheet.flatten([styles.badgeText, { color: tab.badgeTextColor || AppColors.white }])} />}
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        const { tabs, style } = this.props

        const tabElements = tabs.map(tab => {
            return (
                this.renderButton(tab)
            )
        })

        return (
            <View style={StyleSheet.flatten([styles.container, style])}>
                {tabElements}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 1,
        borderColor: AppColors.lightBlue,
        flexDirection: 'row',
        alignItems: 'stretch'
    },

    button: {
        flex: 1,
        borderBottomWidth: 3.5,
        borderBottomColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },

    buttonSelected: {
        flex: 1,
        borderBottomWidth: 3.5,
        borderBottomColor: AppColors.blue,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },

    buttonText: {
        flex: 1,
        ...AppFonts.bodyTextMedium,
        color: AppColors.darkBlue,
        opacity: .8,
        borderBottomWidth: 0,
        borderBottomColor: 'transparent',
        textAlign: 'center'
    },

    buttonSelectedText: {
        flex: 1,
        ...AppFonts.bodyTextMedium,
        color: AppColors.darkBlue,
        borderBottomWidth: 0,
        borderBottomColor: 'transparent',
        textAlign: 'center'
    },

    badge: {
        position: 'absolute',
        top: -9,
        right: -9,
        borderWidth: 0
    },

    badgeText: {
        ...AppFonts.buttonTextSmall,
        backgroundColor: 'transparent',
        position: 'relative',
        top: Platform.OS === 'android' ? 0 : 1,
        fontSize: 11,
        lineHeight: 13,
        fontWeight: '700'
    }
})