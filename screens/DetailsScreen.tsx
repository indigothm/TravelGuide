import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Dimensions, Platform, StatusBar, Alert } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import NativeCalendar, { CalendarEvent } from '../modules/native-calendar';
import LocationMap from '../components/LocationMap';
import DateCard from '../components/DateCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;

const SCREEN_WIDTH = Dimensions.get('window').width;
const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 0;

const DetailScreen: React.FC = () => {
  const route = useRoute<DetailScreenRouteProp>();
  const navigation = useNavigation();
  const { destination } = route.params;
  const [addedEvents, setAddedEvents] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadSavedEvents();
  }, []);

  const loadSavedEvents = async () => {
    try {
      const savedEvents = await AsyncStorage.getItem(`events_${destination.name}`);
      if (savedEvents) {
        setAddedEvents(JSON.parse(savedEvents));
      }
    } catch (error) {
      console.error('Error loading saved events:', error);
    }
  };

  const saveEvents = async (events: { [key: string]: string }) => {
    try {
      await AsyncStorage.setItem(`events_${destination.name}`, JSON.stringify(events));
    } catch (error) {
      console.error('Error saving events:', error);
    }
  };

  const handleAddToCalendar = async (date: string) => {
    try {
      const hasPermission = await NativeCalendar.requestPermissions();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Calendar permission is required to add events.');
        return;
      }

      const [startDate, endDate] = date.split(' - ').map(d => new Date(d));

      const event: CalendarEvent = {
        title: `Trip to ${destination.name}`,
        location: destination.name,
        startDate,
        endDate: endDate || new Date(startDate.getTime() + 24 * 60 * 60 * 1000), 
      };

      const eventId = await NativeCalendar.addEvent(event);
      const newEvents = { ...addedEvents, [date]: eventId };
      setAddedEvents(newEvents);
      await saveEvents(newEvents);
      Alert.alert('Success', `Event added to calendar for ${date}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      Alert.alert('Error', `Failed to add event to calendar: ${errorMessage}`);
      console.error('Calendar error:', error);
    }
  };

  const handleDeleteEvent = async (date: string) => {
    try {
      const eventId = addedEvents[date];
      if (!eventId) {
        Alert.alert('Error', 'No event found for this date');
        return;
      }

      await NativeCalendar.deleteEvent(eventId);
      const newEvents = { ...addedEvents };
      delete newEvents[date];
      setAddedEvents(newEvents);
      await saveEvents(newEvents);
      Alert.alert('Success', `Event deleted from calendar for ${date}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      Alert.alert('Error', `Failed to delete event from calendar: ${errorMessage}`);
      console.error('Calendar error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.imageContainer}>
          <Animated.View
            style={[styles.imageWrapper]}
            sharedTransitionTag={`image-${destination.name}`}
          >
            <Animated.Image 
              source={{ uri: destination.image }}
              style={[styles.image]}
              entering={FadeIn.duration(500)}
            />
          </Animated.View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close-circle" size={32} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.detailsContainer}>
          <Animated.Text entering={FadeInDown.duration(600).delay(200)} style={styles.description}>
            {destination.description}
          </Animated.Text>
          <LocationMap
            latitude={destination.location.latitude}
            longitude={destination.location.longitude}
            name={destination.name}
          />
          <Animated.Text entering={FadeInDown.duration(600).delay(600)} style={styles.subtitle}>
            Suggested Travel Dates
          </Animated.Text>
          {destination.suggestedTravelDates.map((date: string, index: number) => (
            <DateCard
              key={index}
              date={date}
              index={index}
              onPress={() => addedEvents[date] ? handleDeleteEvent(date) : handleAddToCalendar(date)}
              isAdded={!!addedEvents[date]}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  container: {
    flex: 1,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    position: 'relative',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT + 10 : STATUS_BAR_HEIGHT + 5,
    right: 10,
    zIndex: 10,
    padding: 5,
  },
  detailsContainer: {
    paddingTop: 24,
    paddingBottom: 100,
    paddingHorizontal: 24,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
});

export default DetailScreen;
