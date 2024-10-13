import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import destinationsData from '../data.json';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import DestinationItem from '../components/DestinationItem';
import AnimatedHeader from '../components/AnimatedHeader';
import { Destination } from '../types';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HEADER_MAX_HEIGHT = Dimensions.get('window').height / 3;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const destinations: Destination[] = destinationsData.destinations;
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const renderDestinationItem = ({ item }: { item: Destination }) => (
    <DestinationItem
      item={item}
      onPress={() => navigation.navigate('Detail', { destination: item })}
    />
  );

  return (
    <View style={styles.container}>
      <AnimatedHeader scrollY={scrollY} />
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  listContainer: {
    padding: 10,
    paddingTop: HEADER_MAX_HEIGHT + 10,
  },
});

export default HomeScreen;