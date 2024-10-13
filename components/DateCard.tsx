import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface DateCardProps {
  date: string;
  index: number;
  onPress: () => void;
  isAdded: boolean;
}

const DateCard: React.FC<DateCardProps> = ({ date, index, onPress, isAdded }) => (
  <Animated.View entering={FadeInDown.duration(600).delay(700 + index * 100)}>
    <TouchableOpacity style={styles.dateCard} onPress={onPress}>
      <Text style={styles.dateText}>{date}</Text>
      <Text style={styles.addToCalendarText}>{isAdded ? 'Added to Calendar' : 'Add to Calendar'}</Text>
    </TouchableOpacity>
  </Animated.View>
);

const styles = StyleSheet.create({
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

export default DateCard;
