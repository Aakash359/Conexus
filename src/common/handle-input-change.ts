import React, { ReactElement } from 'react'
import { defineBoundAction } from 'mobx/lib/api/action';

export const handleInputChange = function(name: string, value: { nativeEvent: { text: string, contentSize: { width: number, height: number }, target: number, eventCount: number}}) {
    this.setState({
        [name]: value.nativeEvent.text
    })
}

export const creatInputChangeHandler = function(context: React.Component, stateName: string): (() => void) {
    return handleInputChange.bind(context, stateName);
}