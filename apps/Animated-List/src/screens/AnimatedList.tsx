import React, {useRef} from 'react';
import {View} from 'react-native';

import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {ListItem} from '../components/ListItem';
import {
  getInitialPositions,
  SONGS,
  SONG_HEIGHT,
  SCROLL_SPEED_OFFSET,
} from '../constants';
import {styles} from './AnimatedList.styles';
import {NullableNumber, TSongPositions} from '../types';

export const AnimatedList = () => {
  const scrollviewRef = useRef<any>(null);

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
    scrollviewRef.current?.scrollTo({
      y: Math.max(0, scrollY.value - SCROLL_SPEED_OFFSET),
      animated: true,
    });
  };

  const scrollDown = () => {
    scrollviewRef.current?.scrollTo({
      y: scrollY.value + SCROLL_SPEED_OFFSET,
      animated: true,
    });
  };

  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;
  });

  return (
    <View style={styles.listContainer}>
      <Animated.ScrollView
        ref={scrollviewRef}
        onScroll={scrollHandler}
        contentContainerStyle={{height: SONGS.length * SONG_HEIGHT}}>
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
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
};
