import React, {useRef, useState} from 'react';
import {LayoutChangeEvent, View} from 'react-native';

import Animated, {
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {ListItem} from '../components/ListItem';
import {getInitialPositions, SONGS, SCROLL_SPEED_OFFSET} from '../constants';
import {styles} from './AnimatedList.styles';
import {NullableNumber, TSongPositions} from '../types';

//approx height until we calculate actual height
export const estimatedItemHeight = 100;

export const AnimatedList = () => {
  // Store heights of each item
  const itemHeightsRef = useRef<Record<number, number>>({});

  // Track total height for content container
  const [totalHeight, setTotalHeight] = useState<number>(0);

  const scrollviewRef = useAnimatedRef();

  //will hold the songs position in list at every moment
  const currentSongPositions = useSharedValue<TSongPositions>(
    getInitialPositions(),
  );

  //used to control the animation visual using interpolation
  const isDragging = useSharedValue<0 | 1>(0);

  //this will hold id for item which user started dragging
  const draggedItemId = useSharedValue<NullableNumber>(null);

  //used to stop the automatic scroll once drag is ended by user.
  const isDragInProgress = useSharedValue(false);

  const scrollY = useSharedValue(0);
  // const renderCell = useCallback(
  //   ({index, style, ...props}: any) => {
  //     console.log('In renderCell', index);
  //     const zIndex = {
  //       zIndex: index === currentDragIndex ? 2 : 0,
  //     };

  //     return <View style={[style, zIndex]} {...props} />;
  //   },
  //   [currentDragIndex],
  // );

  const scrollUp = () => {
    'worklet';
    const newY =
      scrollY.value - SCROLL_SPEED_OFFSET < 0
        ? 0
        : scrollY.value - SCROLL_SPEED_OFFSET;
    scrollTo(scrollviewRef, 0, newY, true);
  };

  const scrollDown = () => {
    'worklet';
    scrollTo(scrollviewRef, 0, scrollY.value + SCROLL_SPEED_OFFSET, true);
  };

  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;
  });

  const handleLayout = (id: number, event: LayoutChangeEvent): void => {
    const {height} = event.nativeEvent.layout;

    // Update height in the ref
    itemHeightsRef.current[id] = height;

    // Check if all items are measured
    if (Object.keys(itemHeightsRef.current).length === SONGS.length) {
      // Calculate the total height once all items are measured
      const calculatedTotalHeight = Object.values(
        itemHeightsRef.current,
      ).reduce((sum, h) => sum + h, 0);
      setTotalHeight(calculatedTotalHeight); // Update total height in state
    }
  };

  const calculateHeightForIndexesBelow = (targetIndex: number): number => {
    return Object.keys(currentSongPositions.value)
      .filter(
        key =>
          currentSongPositions.value[Number(key)].updatedIndex < targetIndex,
      ) // Filter items with updatedIndex < targetIndex
      .reduce((sum, key) => {
        const id = Number(key);
        return sum + (itemHeightsRef[id] || 0); // Sum the heights from itemHeights
      }, 0);
  };

  return (
    <View style={styles.listContainer}>
      <Animated.ScrollView
        contentContainerStyle={{
          height: totalHeight || SONGS.length * estimatedItemHeight,
        }}
        ref={scrollviewRef}
        onScroll={scrollHandler}>
        {SONGS.map(eachSong => (
          <ListItem
            item={eachSong}
            key={eachSong.id}
            isDragging={isDragging}
            draggedItemId={draggedItemId}
            currentSongPositions={currentSongPositions}
            scrollUp={scrollUp}
            scrollDown={scrollDown}
            scrollY={scrollY}
            isDragInProgress={isDragInProgress}
            handleLayout={handleLayout}
            calculateHeightForIndexesBelow={calculateHeightForIndexesBelow}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
};
