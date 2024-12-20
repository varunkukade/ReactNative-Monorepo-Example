import React from 'react';
import {Image, Text, View} from 'react-native';

import {GestureDetector} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import {TListItem} from '../types';
import {styles} from './ListItem.styles';
import {useGesture} from '../hooks/useGesture';

export const ListItem = ({
  item,
  isDragging,
  draggedItemId,
  currentSongPositions,
  scrollUp,
  scrollDown,
  scrollY,
  isDragInProgress,
  handleLayout,
  calculateHeightForIndexesBelow,
}: TListItem) => {
  const {animatedStyles, gesture} = useGesture(
    item,
    isDragging,
    draggedItemId,
    currentSongPositions,
    scrollUp,
    scrollDown,
    scrollY,
    isDragInProgress,
    calculateHeightForIndexesBelow,
  );

  return (
    <Animated.View
      onLayout={event => handleLayout(item.id, event)}
      key={item.id}
      style={[styles.animatedItemContainer, animatedStyles]}>
      <View style={styles.itemContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: item.imageSrc,
            }}
            style={styles.image}
            borderRadius={8}
          />
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.description1}>{item.title}</Text>
          <Text style={styles.description2}>{item.singer}</Text>
        </View>
        <GestureDetector gesture={gesture}>
          <Animated.View style={styles.draggerContainer}>
            <View style={[styles.dragger, styles.marginBottom]} />
            <View style={[styles.dragger, styles.marginBottom]} />
            <View style={styles.dragger} />
          </Animated.View>
        </GestureDetector>
      </View>
      {item.extraDesc ? (
        <View style={styles.extraDescContainer}>
          <Text style={styles.description2}>{item.extraDesc}</Text>
        </View>
      ) : null}
    </Animated.View>
  );
};
