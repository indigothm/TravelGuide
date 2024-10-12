import * as React from 'react';

import { NativeCalendarViewProps } from './NativeCalendar.types';

export default function NativeCalendarView(props: NativeCalendarViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
