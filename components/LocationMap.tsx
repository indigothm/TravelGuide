import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import MapView, { Marker } from 'react-native-maps';

interface LocationMapProps {
  latitude: number;
  longitude: number;
  name: string;
}

const LocationMap: React.FC<LocationMapProps> = ({ latitude, longitude, name }) => {
  if (Platform.OS !== 'ios') return null;

  return (
    <>
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
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{ latitude, longitude }}
            title={name}
          />
        </MapView>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
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
});

export default LocationMap;