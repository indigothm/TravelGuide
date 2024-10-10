import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, Image, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import destinationsData from '../data.json';
import Animated, { FadeIn, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, interpolate, runOnJS, FadeInDown } from 'react-native-reanimated';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Destination {
  name: string;
  image: string;
  description: string;
}

const HEADER_MAX_HEIGHT = Dimensions.get('window').height / 3;
const HEADER_MIN_HEIGHT = 100;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const destinations: Destination[] = destinationsData.destinations;
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

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

  const renderDestinationItem = ({ item, index }: { item: Destination; index: number }) => (
    <TouchableOpacity
      style={styles.destinationItem}
      
      onPress={() => navigation.navigate('Detail', { destination: item })}
    >
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <Animated.Text 
            style={[styles.headerTitle, headerTitleStyle]}
            entering={FadeInDown.duration(600)}
          >
            Travel Destinations
          </Animated.Text>
        </Animated.View>
        <Animated.FlatList
          data={destinations}
          renderItem={renderDestinationItem}
          keyExtractor={(item) => item.name}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        />
      </View>
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
    backgroundColor: '#f0f0f0',
  },
  listContainer: {
    padding: 10,
    paddingTop: HEADER_MAX_HEIGHT + 10,
  },
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

export default HomeScreen;
