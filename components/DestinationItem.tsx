import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Destination } from '../types';

interface DestinationItemProps {
  item: Destination;
  onPress: () => void;
}

const DestinationItem: React.FC<DestinationItemProps> = ({ item, onPress }) => (
  <TouchableOpacity style={styles.destinationItem} onPress={onPress}>
    <Animated.View
      style={[styles.destinationImageContainer, { backgroundColor: '#ccc' }]}
      sharedTransitionTag={`image-${item.name}`}
    >
      <Animated.Image 
        source={{ uri: item.image }}
        style={[StyleSheet.absoluteFill, styles.destinationImage]}
        entering={FadeIn.duration(500)}
      />
    </Animated.View>
    <Text style={styles.destinationName}>{item.name}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  destinationItem: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  destinationImageContainer: {
    width: '100%',
    height: 150,
    overflow: 'hidden',
  },
  destinationImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  destinationName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
  },
});

export default DestinationItem;