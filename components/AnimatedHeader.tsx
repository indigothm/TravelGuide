import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, { FadeInDown, interpolate, useAnimatedStyle } from 'react-native-reanimated';

const HEADER_MAX_HEIGHT = Dimensions.get('window').height / 3;
const HEADER_MIN_HEIGHT = 100;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

interface AnimatedHeaderProps {
  scrollY: Animated.SharedValue<number>;
}

const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({ scrollY }) => {
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE],
      [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      'clamp'
    );
    return { height };
  });

  const headerTitleStyle = useAnimatedStyle(() => {
    const fontSize = interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE],
      [32, 18],
      'clamp'
    );
    const paddingTop = interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE],
      [HEADER_MAX_HEIGHT - 100, 10],
      'clamp'
    );
    const paddingLeft = interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE],
      [20, 16],
      'clamp'
    );
    return { fontSize, paddingTop, paddingLeft };
  });

  return (
    <Animated.View style={[styles.header, headerAnimatedStyle]}>
      <Animated.Text 
        style={[styles.headerTitle, headerTitleStyle]}
        entering={FadeInDown.duration(600)}
      >
        Travel Destinations
      </Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f4511e',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default AnimatedHeader;