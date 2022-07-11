
import React from 'react'
import { Container, Text, Textarea, Switch, Left, Right } from 'native-base'
import { Platform, ViewProperties, ActivityIndicator, StyleSheet, View, KeyboardAvoidingView, TouchableOpacity, Alert, ScrollView, Keyboard } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { Calendar } from 'react-native-calendars'
import { inject, observer } from 'mobx-react'
import { AppFonts, AppColors } from '../../../theme';
import { ScreenType } from '../../../common/constants'
import { ConexusIcon, ScreenFooterButton, ModalHeader, ConexusIconButton } from '../../../components'
import { showYesNoAlert } from '../../../common'
let moment = require('moment')

import { logger } from 'react-native-logs'
const log = logger.createLogger();

interface MarkedDateIndex {
    [key: string]: { selected?: boolean, marked?: boolean, color?: string, selectedColor?: string, dotColor?: string }
}

export interface ScheduleAvailabilityContainerProps extends ViewProperties {
    title: string,
    onSave?: () => any,
    onClose?: () => any
}

export interface ScheduleAvailabilityContainerState {
    loading: boolean,
    markedDates: MarkedDateIndex
}

@observer
export class ScheduleAvailabilityContainer extends React.Component<ScheduleAvailabilityContainerProps, ScheduleAvailabilityContainerState>  {

    get onSave() {
        return this.props.onSave || function () { }
    }

    get onClose() {
        return this.props.onClose || function () { }
    }

    get canGoNext() {
        return Object.keys(this.state.markedDates).length > 0
    }

    get selectedDateItems() {
        return Object.keys(this.state.markedDates)
            .filter(key => {
                return this.state.markedDates[key].selected
            })
            .sort()
            .map(key => {
                const day = moment(key)
                return {
                    dateString: key,
                    leftText: day.format('dddd'),
                    rightText: day.format('MMMM Do')
                }
            })
    }

    constructor(props, state) {
        super(props, state);

        this.state = {
            loading: false,
            markedDates: {
                '2018-03-08': {marked: true, dotColor: AppColors.gray, selectedColor: AppColors.blue}, 
                '2018-03-10': {marked: true, dotColor: AppColors.gray, selectedColor: AppColors.blue}
            }
        }
    }

    goNext() {
        log.info('Go Next')
    }

    componentWillUnmount() {
        if (this.onClose) {
            this.onClose();
        }
    }

    componentWillMount() {
        this.setState({ loading: true })
    }

    renderSelections() {
        const items = this.selectedDateItems.map(item => {
            return <View
                    key={item.dateString} 
                    style={styles.dateSelectionItem}>
                    <Text style={styles.dateSelectionItemLeft}>{item.leftText}</Text>
                    <Text style={styles.dateSelectionItemRight}>{item.rightText}</Text>
                </View>
        })

        return (
            <View style={{ flex: 1 }}>
                <Text style={styles.addTimeHeader}>Add Time to These Days</Text>
                {items}
            </View>
        )
    }

    renderCalendar() {
        return (
            <Calendar
                // Initially visible month. Default = Date()

                // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                // minDate={'2012-05-10'}
                // // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                // maxDate={'2012-05-30'}
                // Handler which gets executed on day press. Default = undefined
                onDayPress={(day) => {
                    const markedDates = { ...this.state.markedDates }

                    let selection = markedDates[day.dateString];

                    if (!selection) {
                        selection = markedDates[day.dateString] = {selected: false, selectedColor: AppColors.blue}
                    }

                    selection.selected = !!!selection.selected;

                    if (!selection.selected) {
                        delete markedDates[day.dateString]
                    }

                    if (selection.marked) {
                        // Calendar needs a new reference or it won't update
                        markedDates[day.dateString] = {...selection} 
                    }

                    Object.keys(markedDates).forEach(key => {
                        const markedDate = markedDates[key]

                        if (markedDates[key].selected) {
                            markedDate.dotColor = AppColors.white
                        } else {
                            markedDate.dotColor = AppColors.gray
                        }
                    })

                    this.setState({ markedDates })
                }}
                // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                monthFormat={'MMMM yyyy'}
                // Handler which gets executed when visible month changes in calendar. Default = undefined
                onMonthChange={(month) => { log.info('month changed', month) }}
                // Replace default arrows with custom ones (direction can be 'left' or 'right')
                //renderArrow={(direction) => (<Arrow />)}
                // Do not show days of other months in month page. Default = false
                // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
                // day from another month that is visible in calendar page. Default = false
                disableMonthChange={true}
                // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
                firstDay={1}
                // Hide day names. Default = false
                hideDayNames={false}
                // Show week numbers to the left. Default = false
                // // Handler which gets executed when press arrow icon left. It receive a callback can go back month
                // onPressArrowLeft={substractMonth => substractMonth()}
                // // Handler which gets executed when press arrow icon left. It receive a callback can go next month
                // onPressArrowRight={addMonth => addMonth()}
                markedDates={this.state.markedDates}

                style={{
                    borderBottomWidth: 1,
                    borderColor: AppColors.lightBlue
                }}

                theme={{
                    calendarBackground: AppColors.white,
                    todayTextColor: AppColors.red,                    
                  }}
            />
        )
    }

    render() {
        const { loading } = this.state;

        return (
            <Container>
                <ModalHeader title={this.props.title} right={() =>
                    <ConexusIconButton iconName="cn-x" iconSize={15} onPress={Actions.pop}></ConexusIconButton>
                } />
                <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
                    {this.renderCalendar()}
                    {this.renderSelections()}
                </ScrollView>
                <ScreenFooterButton title="Next" disabled={!this.canGoNext} onPress={this.goNext.bind(this)} />
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    addTimeHeader: {
        ...AppFonts.bodyTextMedium,
        textAlign: 'center',
        marginTop: 18,
        marginBottom: 18
    },
    dateSelectionItem: {
        height: 48,
        backgroundColor: AppColors.white,
        padding: 12,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: AppColors.lightBlue,
        margin: 8,
        marginTop: 0,
        borderRadius: 4
    },
    dateSelectionItemLeft: {
        flex: 1,
        textAlign: 'left'
    },
    dateSelectionItemRight: {
        flex: 1,
        textAlign: 'right'
    }
})

const headerStyle = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: 'center'
    },
    monthText: {
        fontSize: 16, //appStyle.textMonthFontSize,
        fontFamily: AppFonts.family.fontFamily,
        fontWeight: '300',
        color: 'red',
        margin: 10
    },
    arrow: {
        padding: 10
    },
    arrowImage: {
        ...Platform.select({
            ios: {
                tintColor: 'red'
            },
            android: {
                tintColor: 'red'
            }
        })
    },
    week: {
        marginTop: 7,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    dayHeader: {
        marginTop: 2,
        marginBottom: 7,
        width: 32,
        textAlign: 'center',
        fontSize: 16, //appStyle.textDayHeaderFontSize,
        fontFamily: AppFonts.family.fontFamily,
        color: 'green'
    }
})