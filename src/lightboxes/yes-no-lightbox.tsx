import React from 'react'
import { View, StyleSheet, ViewProperties } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { ConexusLightbox } from './base-lightbox'
import { ActionButton } from '../components';

interface YesNoLightboxProps extends ViewProperties {
  yesTitle: string,
  yesDanger?: boolean,
  noTitle: string,
  noDanger?: boolean,
  title: string,
  onAnswer: (result: boolean) => {},
  closeable
}

interface YesNoLightboxState {

}

export class YesNoLightbox extends React.Component<YesNoLightboxProps, YesNoLightboxState> {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    const { yesTitle, noTitle, title, onAnswer, yesDanger, noDanger } = this.props;

    return (
      <ConexusLightbox title={title} closeable height={280} horizontalPercent={0.9}>
        <View style={styles.container}>
          <ActionButton danger={yesDanger}  style={{width: '80%'}} primary title={yesTitle} onPress={() => { onAnswer(true); Actions.pop() }} />
          <ActionButton danger={noDanger} style={{width: '80%', marginTop: 18}} secondary title={noTitle} onPress={() => { onAnswer(false); Actions.pop() }} />
        </View>
      </ConexusLightbox>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 24,
    alignSelf: 'center',
  },
});