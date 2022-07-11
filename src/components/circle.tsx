import React, {Component} from "react";
import {View} from "react-native";

export class Circle extends Component {

    props: {
        size: number,
        color: string,
        children?: any,
        style?: any
    }

    render(): React.ReactElement<any>  {
        const {size, color, style} = this.props;
        const circleStyle = {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
            alignItems: "center",
            justifyContent: "center"
        };
        return <View style={[circleStyle, style]}>{this.props.children}</View>;
    }
}
