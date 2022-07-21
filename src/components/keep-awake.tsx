import React from 'react';
// import RNKeepAwake from 'react-native-keep-awake';
// import { inject, observer } from 'mobx-react'
import {DeviceStore} from '../stores/deviceStore';

interface KeepAwakeProps {
  deviceStore?: DeviceStore;
}
// export const KeepAwake = inject('deviceStore')(
//   observer(
//     (props: KeepAwakeProps) => props.deviceStore.isKeepAwake && <RNKeepAwake />,
//   ),
// );
