import { requireNativeModule } from 'expo-modules-core';

const NativeCalendarModule = requireNativeModule('NativeCalendar');

export interface CalendarEvent {
  title: string;
  location: string;
  startDate: Date;
  endDate: Date;
}

function formatDateToISO8601(date: Date): string {
  return date.toISOString().split('.')[0] + 'Z';
}

export default {
  async requestPermissions() {
    console.log('Requesting calendar permissions...');
    try {
      const result = await NativeCalendarModule.requestPermissions();
      console.log('Permission request result:', result);
      return result;
    } catch (error) {
      console.error('Error requesting calendar permissions:', error);
      throw error;
    }
  },

  async addEvent(event: CalendarEvent) {
    console.log('Adding event to calendar:', event);
    const { title, location, startDate, endDate } = event;
    try {
      const formattedStartDate = formatDateToISO8601(startDate);
      const formattedEndDate = formatDateToISO8601(endDate);
      console.log('Formatted start date:', formattedStartDate);
      console.log('Formatted end date:', formattedEndDate);
      
      const result = await NativeCalendarModule.addEvent(
        title,
        location,
        formattedStartDate,
        formattedEndDate
      );
      console.log('Event added successfully:', result);
      return result;
    } catch (error) {
      console.error('Error adding event to calendar:', error);
      throw error;
    }
  },
};
