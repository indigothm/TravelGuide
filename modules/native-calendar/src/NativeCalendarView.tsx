import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { NativeCalendarViewProps } from './NativeCalendar.types';

const NativeView: React.ComponentType<NativeCalendarViewProps> =
  requireNativeViewManager('NativeCalendar');

export default function NativeCalendarView(props: NativeCalendarViewProps) {
  return <NativeView {...props} />;
}
