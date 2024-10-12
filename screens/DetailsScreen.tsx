import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Dimensions, Platform, StatusBar, Alert } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import NativeCalendar, { CalendarEvent } from '../modules/native-calendar';

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;

const SCREEN_WIDTH = Dimensions.get('window').width;
const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 0;

const DetailScreen: React.FC = () => {
  const route = useRoute<DetailScreenRouteProp>();
  const navigation = useNavigation();
  const { destination } = route.params;

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
  
      await NativeCalendar.addEvent(event);
      Alert.alert('Success', `Event added to calendar for ${date}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      Alert.alert('Error', `Failed to add event to calendar: ${errorMessage}`);
      console.error('Calendar error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} >
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
          <Animated.Text entering={FadeInDown.duration(600).delay(400)} style={styles.subtitle}>
            Location
          </Animated.Text>
          <Animated.View 
            entering={FadeInDown.duration(600).delay(500)}
            style={styles.mapContainer}
          >
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: destination.location.latitude,
                longitude: destination.location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker
                coordinate={{
                  latitude: destination.location.latitude,
                  longitude: destination.location.longitude,
                }}
                title={destination.name}
              />
            </MapView>
          </Animated.View>
          <Animated.Text entering={FadeInDown.duration(600).delay(600)} style={styles.subtitle}>
            Suggested Travel Dates
          </Animated.Text>
          {destination.suggestedTravelDates.map((date: string, index: number) => (
            <Animated.View
              key={index}
              entering={FadeInDown.duration(600).delay(700 + index * 100)}
            >
              <TouchableOpacity
                style={styles.dateCard}
                onPress={() => handleAddToCalendar(date)}
              >
                <Text style={styles.dateText}>{date}</Text>
                <Text style={styles.addToCalendarText}>Add to Calendar</Text>
              </TouchableOpacity>
            </Animated.View>
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
  mapContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    height: 200,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  dateCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
  },
  addToCalendarText: {
    fontSize: 14,
    color: '#007AFF',
  },
});

export default DetailScreen;
