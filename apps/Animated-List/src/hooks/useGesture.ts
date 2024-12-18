import {
  SharedValue,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  Color_Pallete,
  EDGE_THRESHOLD,
  MAX_BOUNDRY,
  MIN_BOUNDRY,
  SCREEN_HEIGHT,
  SONG_HEIGHT,
} from '../constants';
import {NullableNumber, TSongPositions, TItem} from '../types';
import {Gesture} from 'react-native-gesture-handler';

export const useGesture = (
  item: TItem,
  isDragging: SharedValue<number>,
  draggedItemId: SharedValue<NullableNumber>,
  currentSongPositions: SharedValue<TSongPositions>,
  scrollUp: () => void,
  scrollDown: () => void,
  scrollY: SharedValue<number>,
  isDragInProgress: SharedValue<boolean>,
) => {
  //used for swapping with currentIndex
  const newIndex = useSharedValue<NullableNumber>(null);

  //used for swapping with newIndex
  const currentIndex = useSharedValue<NullableNumber>(null);

  const currentSongPositionsDerived = useDerivedValue(() => {
    return currentSongPositions.value;
  });

  const top = useSharedValue(item.id * SONG_HEIGHT);

  const isDraggingDerived = useDerivedValue(() => {
    return isDragging.value;
  });

  const draggedItemIdDerived = useDerivedValue(() => {
    return draggedItemId.value;
  });

  const isDragInProgressDerived = useDerivedValue(() => {
    return isDragInProgress.value;
  });

  const scrollYDerived = useDerivedValue(() => {
    return scrollY.value;
  });

  const isCurrentDraggingItem = useDerivedValue(() => {
    return (
      draggedItemIdDerived.value !== null &&
      draggedItemIdDerived.value === item.id
    );
  });

  const getKeyOfValue = (
    value: number,
    obj: TSongPositions,
  ): number | undefined => {
    'worklet';
    for (const [key, val] of Object.entries(obj)) {
      if (val.updatedIndex === value) {
        return Number(key);
      }
    }
    return undefined; // Return undefined if the value is not found
  };

  const onGestureUpdate = (newTop: number) => {
    'worklet';

    let localNewTop;
    let topEdge = scrollYDerived.value;
    let bottomEdge =
      scrollYDerived.value + SCREEN_HEIGHT - EDGE_THRESHOLD * 2.5;
    const isUpperEdge = newTop <= topEdge;
    const isBottomEdge = newTop >= bottomEdge;

    if (
      currentIndex.value === null ||
      newTop < MIN_BOUNDRY ||
      newTop > MAX_BOUNDRY
      // isUpperEdge
      // isBottomEdge
    ) {
      //dragging out of bound

      // else if (isBottomEdge) {
      //   // top.value = scrollYDerived.value + SCREEN_HEIGHT - EDGE_THRESHOLD * 2;
      //   runOnJS(scrollDown)();
      // }
      return;
    }

    if (isUpperEdge) {
      top.value = topEdge;
      localNewTop = topEdge;
    } else if (isBottomEdge) {
      top.value = bottomEdge;
      localNewTop = bottomEdge;
    } else {
      top.value = newTop;
      localNewTop = newTop;
    }

    //calculate the new index where drag is headed to
    newIndex.value = Math.floor((localNewTop + SONG_HEIGHT / 2) / SONG_HEIGHT);
    //swap the items present at newIndex and currentIndex
    if (newIndex.value !== currentIndex.value) {
      //find id of the item that currently resides at newIndex
      const newIndexItemKey = getKeyOfValue(
        newIndex.value,
        currentSongPositionsDerived.value,
      );

      //find id of the item that currently resides at currentIndex
      const currentDragIndexItemKey = getKeyOfValue(
        currentIndex.value,
        currentSongPositionsDerived.value,
      );

      if (
        newIndexItemKey !== undefined &&
        currentDragIndexItemKey !== undefined
      ) {
        //we update updatedTop and updatedIndex as next time we want to do calculations from new top value and new index
        currentSongPositions.value = {
          ...currentSongPositionsDerived.value,
          [newIndexItemKey]: {
            ...currentSongPositionsDerived.value[newIndexItemKey],
            updatedIndex: currentIndex.value,
          },
          [currentDragIndexItemKey]: {
            ...currentSongPositionsDerived.value[currentDragIndexItemKey],
            updatedIndex: newIndex.value,
          },
        };

        //update new index as current index
        currentIndex.value = newIndex.value;
      }
    }

    if (isUpperEdge) {
      runOnJS(scrollUp)();
    } else if (isBottomEdge) {
      runOnJS(scrollDown)();
    }
  };

  useAnimatedReaction(
    () => {
      return scrollYDerived.value;
    },
    (currentValue, previousValue) => {
      if (!isDragInProgressDerived.value) {
        //we don't want to trigger automatic scroll when user ends the drag
        return;
      }
      const isScrolledUp = (previousValue || 0) > currentValue;
      onGestureUpdate(
        isScrolledUp
          ? top.value - Math.abs(currentValue - (previousValue || 0))
          : top.value + Math.abs(currentValue - (previousValue || 0)),
      );
    },
  );

  useAnimatedReaction(
    () => {
      return currentSongPositionsDerived.value[item.id].updatedIndex;
    },
    (currentValue, previousValue) => {
      if (currentValue !== previousValue) {
        if (isCurrentDraggingItem) {
          //add separate animation for dragging item
          top.value = withSpring(
            currentSongPositionsDerived.value[item.id].updatedIndex *
              SONG_HEIGHT,
          );
        } else {
          top.value = withTiming(
            currentSongPositionsDerived.value[item.id].updatedIndex *
              SONG_HEIGHT,
            {duration: 500},
          );
        }
      }
    },
  );

  const gesture = Gesture.Pan()
    .onStart(() => {
      //start dragging
      isDragging.value = withSpring(1);

      //keep track of dragged item
      draggedItemId.value = item.id;

      //start dragging
      isDragInProgress.value = true;

      //store dragged item id for future swap
      currentIndex.value =
        currentSongPositionsDerived.value[item.id].updatedIndex;
    })
    .onUpdate(e => {
      onGestureUpdate(scrollYDerived.value + e.absoluteY);
    })
    .onEnd(() => {
      isDragInProgress.value = false;
      if (newIndex.value === null) {
        return;
      }
      top.value = withSpring(newIndex.value * SONG_HEIGHT);
      //stop dragging with delay of 200ms to have nice animation consistent with scale
      isDragging.value = withDelay(200, withSpring(0));
    });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      top: top.value,
      transform: [
        {
          scale: isCurrentDraggingItem.value
            ? interpolate(isDraggingDerived.value, [0, 1], [1, 1.025])
            : interpolate(isDraggingDerived.value, [0, 1], [1, 0.98]),
        },
      ],
      backgroundColor: isCurrentDraggingItem.value
        ? interpolateColor(
            isDraggingDerived.value,
            [0, 1],
            [Color_Pallete.metal_black, Color_Pallete.night_shadow],
          )
        : Color_Pallete.metal_black,

      shadowColor: isCurrentDraggingItem.value
        ? interpolateColor(
            isDraggingDerived.value,
            [0, 1],
            [Color_Pallete.metal_black, Color_Pallete.crystal_white],
          )
        : undefined,
      style: {
        shadowOffset: {
          width: 0,
          height: isCurrentDraggingItem.value
            ? interpolate(isDraggingDerived.value, [0, 1], [0, 7])
            : 0,
        },
      },
      shadowOpacity: isCurrentDraggingItem.value
        ? interpolate(isDraggingDerived.value, [0, 1], [0, 0.2])
        : 0,
      shadowRadius: isCurrentDraggingItem.value
        ? interpolate(isDraggingDerived.value, [0, 1], [0, 10])
        : 0,
      elevation: isCurrentDraggingItem.value
        ? interpolate(isDraggingDerived.value, [0, 1], [0, 5])
        : 0, // For Android,
      zIndex: isCurrentDraggingItem.value ? 1 : 0,
    };
  }, [isCurrentDraggingItem.value, isDraggingDerived.value]);

  return {
    animatedStyles,
    gesture,
  };
};
