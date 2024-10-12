import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to NativeCalendar.web.ts
// and on native platforms to NativeCalendar.ts
import NativeCalendarModule from './src/NativeCalendarModule';
import NativeCalendarView from './src/NativeCalendarView';
import { ChangeEventPayload, NativeCalendarViewProps } from './src/NativeCalendar.types';

// Get the native constant value.
export const PI = NativeCalendarModule.PI;

export function hello(): string {
  return NativeCalendarModule.hello();
}

export async function setValueAsync(value: string) {
  return await NativeCalendarModule.setValueAsync(value);
}

const emitter = new EventEmitter(NativeCalendarModule ?? NativeModulesProxy.NativeCalendar);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { NativeCalendarView, NativeCalendarViewProps, ChangeEventPayload };
