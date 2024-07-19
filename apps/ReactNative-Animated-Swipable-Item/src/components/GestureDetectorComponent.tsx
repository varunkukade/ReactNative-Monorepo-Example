import React from 'react';
import {GestureDetector} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import {styles} from './ListItem.styles';
import {Image, Text, View} from 'react-native';
import {usePanXGesture} from '../hooks/usePanXGesture';
import {TListItem} from '../types';

export const GestureDetectorComponent = ({item, deleteItem}: TListItem) => {
  const totalLeftTouchableWidth = item.leftTouchables?.reduce(
    (acc, touchable) => acc + touchable.width,
    0,
  );

  const totalRightTouchableWidth = item.rightTouchables?.reduce(
    (acc, touchable) => acc + touchable.width,
    0,
  );

  const {panXAnimatedStyles, panXGesture} = usePanXGesture(
    totalLeftTouchableWidth,
    totalRightTouchableWidth,
    item,
    deleteItem,
  );
  return (
    <GestureDetector gesture={panXGesture}>
      <Animated.View
        key={item.id}
        style={[styles.itemContainer, panXAnimatedStyles]}>
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
      </Animated.View>
    </GestureDetector>
  );
};
