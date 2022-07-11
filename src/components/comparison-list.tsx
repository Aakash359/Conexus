
import React from 'react'
import { Text } from 'native-base'
import { StyleSheet, View, TouchableHighlight, Platform } from 'react-native'
import FitImage from 'react-native-fit-image'
import { ComparisonDataModel } from '../stores/comparison-data-model'
import { Actions } from 'react-native-router-flux'
import { ScreenType } from '../common/constants'
import { AppFonts, AppColors } from '../theme'
import { ConexusContentList, ConexusIcon } from '../components'
import { logger } from 'react-native-logs'
export interface ComparisonListProps {
    index: number,
    count: number,
    cellWidth: number,
    data: Array<typeof ComparisonDataModel.Type>
}

export interface ComparisonListState {

}
const log = logger.createLogger()
export class ComparisonList extends React.Component<ComparisonListProps, ComparisonListState>  {
    constructor(props: ComparisonListProps, state: ComparisonListState) {
        super(props, state);
        this.state = state || {}
    }

    componentWillMount() {

    }

    private _renderContentListCellInLightbox(cell: typeof ComparisonDataModel.Type) {
        log.info('Render list contents');
        log.info(cell.details);
        return (<ConexusContentList style={{ flex: 1 }} data={cell.details} />)
    }

    private _renderCellImageInLightbox(cell: typeof ComparisonDataModel.Type) {
        const source = { uri: cell.imageUrl }
        return <FitImage resizeMode="contain" source={source} />
    }

    private _handleCellClick(cell: typeof ComparisonDataModel.Type) {
        const hasLink = !!cell.details;

        if (hasLink) {
            log.info(cell);
            Actions[ScreenType.CONTENT_LIGHTBOX]({ title: cell.headerTitle, renderContent: this._renderContentListCellInLightbox.bind(this, cell) });
        }

        if (!!cell.imageUrl) {
            Actions[ScreenType.CONTENT_LIGHTBOX]({ title: cell.headerTitle, renderContent: this._renderCellImageInLightbox.bind(this, cell) });
        }
    }

    private wrapCell(cell: typeof ComparisonDataModel.Type, elements: () => any) {
        const hasLink = !!cell.details || !!cell.imageUrl;
        if (hasLink) {
            return (
                <TouchableHighlight underlayColor="rgba(255,255,255,.87)" onPress={this._handleCellClick.bind(this, cell)}>
                    {elements()}
                </TouchableHighlight>
            )
        }

        return (
            <View>
                {elements()}
            </View>
        )
    }


    private _renderTextCell(cell: typeof ComparisonDataModel.Type) {
        const { index, count } = this.props;
        const lastCell = index + 1 === count
        const descriptionStyle = StyleSheet.flatten([styles.textCellDescription, cell.title && { top: -6 }])
        const hasLink = !!cell.details
        const titleStyle = hasLink ? styles.textCellTitleTouchable : styles.textCellTitle

        return (
            <View key={index}>
                {this._renderHeader(cell)}
                {this.wrapCell(cell, () =>
                    <View style={StyleSheet.flatten([styles.cell, styles.textCell, lastCell && { borderRightWidth: 0 }])}>
                        {!!cell.title && <Text style={titleStyle}>{(cell.title || '').toUpperCase()}</Text>}
                        {!!cell.description && <Text style={descriptionStyle}>{cell.description}</Text>}
                    </View>
                )}
            </View>
        )
    }

    private _renderIconCell(cell: typeof ComparisonDataModel.Type) {
        const { index, count } = this.props;
        const lastCell = index + 1 === count
        
        return (
            <View key={index}>
                {this._renderHeader(cell)}
                {this.wrapCell(cell, () =>
                    <View style={StyleSheet.flatten([styles.cell, styles.iconCell, lastCell && { borderRightWidth: 0 }])}>
                        {!!cell.icon && 
                            <ConexusIcon name={(cell.icon || "")} size={26} color={cell.iconColor || AppColors.blue} />
                        }
                    </View>
                )}
            </View>
        )
    }
    private _renderImageCell(cell: typeof ComparisonDataModel.Type) {
        const { cellWidth, index, count } = this.props;

        const source = { uri: cell.imageUrl }
        const lastCell = index + 1 === count

        return (
            <View key={index}>
                {this._renderHeader(cell)}
                {this.wrapCell(cell, () =>
                    <View style={StyleSheet.flatten([styles.cell, styles.imageCell, lastCell && { borderRightWidth: 0 }])}>
                        {<FitImage resizeMode="contain" source={source} style={[{ width: cellWidth - 16, height: 84 }]} />}
                    </View>
                )}
            </View>
        )
    }

    private _renderHeader(cell: typeof ComparisonDataModel.Type) {
        const { cellWidth, index } = this.props

        return (
            <View style={[styles.headerRow, {width: cellWidth }]}>
                <Text numberOfLines={1} lineBreakMode="clip" style={[styles.headerRowText]}>{index > 0 ? '' : cell.headerTitle || ''}</Text>
            </View>
        )
    }

    render() {
        const { data } = this.props;
        
        var cells = data.map((cell, index) => {
            return (
                <View key={index.toString()}>
                    {cell.type === 'text' && this._renderTextCell(cell)}
                    {cell.type === 'icon' && this._renderIconCell(cell)}
                    {cell.type === 'image' && this._renderImageCell(cell)}
                </View>
            )
        });

        return (
            <View style={styles.container}>
                {cells}
            </View>
        )
    }
}


const headerHeight = 26;

const getHeaderRowTextOSStyle = () => {
    return Platform.OS === 'android' ?
        {
            position: 'relative',
            top: -2,
            ...AppFonts.bodyTextXtraSmall,
        } :
        {
            
        }
}

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

        marginTop: headerHeight
    },

    textCell: {
        height: 70,
        paddingTop: 5
    },

    iconCell: {
        height: 60
    },

    imageCell: {
        height: 90
    },

    textCellTitle: {
        opacity: .9,
        ...AppFonts.candidateComparison.textCellTitle
    },

    textCellTitleTouchable: {
        opacity: .9,
        ...AppFonts.candidateComparison.textCellTitleTouchable
    },

    textCellDescription: {
        opacity: .8,
        position: 'relative',
        ...AppFonts.candidateComparison.textCellDescription
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

        opacity: .9,
        backgroundColor: '#FBFCFD',
    },

    headerRowText: {
        ...AppFonts.bodyTextXtraSmall,
        ...getHeaderRowTextOSStyle()
    }
})

