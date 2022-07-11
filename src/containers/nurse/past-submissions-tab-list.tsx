
import React  from 'react'
import { Text, ListItem, Left, Body, Icon } from 'native-base'
import { StyleSheet, View, Platform, ViewProperties, ScrollView } from 'react-native'
import { AppFonts, AppColors, AppSizes } from '../../theme'
import Styles from '../../theme/styles'
import { TabBar, TabDetails, Avatar, IconTitleBlock } from '../../components'
import { NurseSubmissionsStore, NurseSubmissionModel } from '../../stores'

interface PastSubmissionsTabListProps extends ViewProperties {
    nurseSubmissionsStore?: NurseSubmissionsStore
}

interface PastSubmissionsTabListState {
    selectedTab: TabDetails
}

const completedTabId = 'completed';
const closedTabId = 'closed';

const tabs = [
    { id: completedTabId, title: 'Completed' },
    { id: closedTabId, title: 'Closed' }
]

export class PastSubmissionsTabList extends React.Component<PastSubmissionsTabListProps, PastSubmissionsTabListState>  {

    constructor(props, state) {
        super(props, state)

        this.state = {
            selectedTab: tabs[0]
        }
    }

    componentWillMount() {

    }

    _renderTabs(completedLength: number, closedLength) {
        let { selectedTab } = this.state


        if (!tabs.filter(i => i.id === selectedTab.id)) {
            selectedTab = tabs[0]
            this.setState({ selectedTab })
        }

        if (selectedTab) {
            return (
                <TabBar  style={styles.tabBar} selectedTabId={selectedTab.id} tabs={tabs} onTabSelection={(tab) => this.setState({ selectedTab: tab })} />
            )
        }

        return {}
    }



    _renderSubmissionItem(submission: typeof NurseSubmissionModel.Type, index: number) {
        return (
            <ListItem key={submission.submissionId.toString() + index}  avatar style={styles.listItem}>
                <Left>
                    <Avatar facility size={48} borderWidth={1} source={submission.facilityImage} />
                </Left>
                <Body style={styles.body}>
                    <Text style={[{ ...AppFonts.listItemTitle }]}>{submission.display.title}</Text>
                    <Text style={[{ ...AppFonts.listItemDescription }]}>{submission.display.description}</Text>
                </Body>
            </ListItem>
        )
    }

    _renderSubmissions(completed: typeof NurseSubmissionModel.Type[], closed: typeof NurseSubmissionModel.Type[]) {
        const { selectedTab } = this.state

        let submissions: typeof NurseSubmissionModel.Type[];
        let showTopBorder = true;

        submissions = selectedTab.id === completedTabId ? completed : closed
        showTopBorder = false

        const noDataMessage = selectedTab.id === completedTabId ? 'You have not completed any interviews.' : 'You have no closed interviews.'

        return (
            <ScrollView style={[{ backgroundColor: AppColors.white, ...getRowShadows() }, showTopBorder ? styles.blueBorderTop : {}]}>
                {!submissions.length && <IconTitleBlock style={styles.emptyBlock} iconName="cn-info" text={noDataMessage}/>}
                {!!submissions.length && submissions.map(this._renderSubmissionItem.bind(this))}
            </ScrollView>
        )
    }


    render() {
        const { nurseSubmissionsStore } = this.props
        const { style } = this.props

        const completed = nurseSubmissionsStore.completedInterviews;
        const closed = nurseSubmissionsStore.closedInterviews

        if (completed.length || closed.length) {
            return (
                <View style={[styles.container, style]}>
                    {this._renderTabs(completed.length, closed.length)}
                    {this._renderSubmissions(completed, closed)}
                </View>
            )
        }

        return <View />
    }
}

const styles = StyleSheet.create({
    container: {
        minHeight: AppSizes.screen.height * .75,
    },
    header: {
        textAlign: 'center',
        paddingTop: 38,
        paddingBottom: 24,
        ...AppFonts.bodyTextMedium,
        color: AppColors.darkBlue
    },
    blueBorderTop: {
        borderTopColor: AppColors.blue,
        borderTopWidth: 4
    },
    tabBar: {
        marginTop: 18,
        backgroundColor: AppColors.white,
        borderTopColor: AppColors.lightBlue,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.lightBlue,
    },
    listItem: {
        backgroundColor: AppColors.white,
        borderBottomWidth: .5,
        borderBottomColor: AppColors.lightBlue
    },
    body: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingTop: 8,
        paddingBottom: 8,
        borderWidth: 0,
        borderBottomWidth: 0
    },
    emptyBlock: {
        paddingVertical: 80
    }
})
const getRowShadows = () => {
    return Platform.OS === 'android' ?
        {
            elevation: 2,
        } :
        {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: .8 },
            shadowOpacity: 0.1,
            shadowRadius: 1,
        }
}