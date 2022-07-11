import { BackHandler, Platform } from 'react-native'
import React, { Component } from 'react'

interface BackButtonPressed {
  backButtonPressed?: () => boolean,
}

type BackButtonPressedComponent =  React.ComponentClass<any> &  BackButtonPressed

let WrappedComponent: BackButtonPressedComponent

class BackButtonComponent extends Component {
  componentDidMount() {
    const { backButtonPressed } = this.targetComponentRef
    this.backButtonPressedSubscription = BackHandler.addEventListener(
      'hardwareBackPress',
      backButtonPressed,
    )
  }

  componentWillUnmount() {
    if (this.backButtonPressedSubscription) {
      this.backButtonPressedSubscription.remove()
    }
  }

  targetComponentRef: any;

  backButtonPressedSubscription?: void | { remove: () => void }

  render() {
    
    return (
      <WrappedComponent ref={(component) => { this.targetComponentRef = component; }} 
        {...this.props}
      />
    )
  }
}

export const handleBackButton = (component: BackButtonPressedComponent): any => {
  WrappedComponent = component
  return Platform.select({
    ios: WrappedComponent,
    android: BackButtonComponent,
  })
}

