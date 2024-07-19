import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import {
  ANIMATION_DURATION,
  EDraggingDirection,
  EAnimationType,
  ITEM_WIDTH,
  SCREEN_PADDING,
} from '../constants';
import { TItem } from '../types';

export const usePanXGesture = (
  totalLeftTouchableWidth: number | undefined,
  totalRightTouchableWidth: number | undefined,
  item: TItem,
  deleteItem: (id: number) => void,
) => {
  //this is used to make scrollview active with pangesture
  const initialTouchLocation = useSharedValue<{
    x: number;
    y: number;
  } | null>(null);

  const doesLeftTouchableExist =
    (item.type === EAnimationType['left-touchable'] ||
      item.type === EAnimationType['left-right-touchable']) &&
    totalLeftTouchableWidth;
  const doesRightTouchableExist =
    (item.type === EAnimationType['right-touchable'] ||
      item.type === EAnimationType['left-right-touchable']) &&
    totalRightTouchableWidth;
  const doesSwipeLeftToDeleteExist =
    item.type === EAnimationType['swipe-left-to-delete'];
  const doesSwipeRightToDeleteExist =
    item.type === EAnimationType['swipe-right-to-delete'];

  const offsetX = useSharedValue(0);
  const startX = useSharedValue(0);

  const dragDirectionShared = useSharedValue(EDraggingDirection.none);

  const resetOffsets = (duration?: number) => {
    'worklet';
    if (duration) {
      offsetX.value = withTiming(0, { duration });
    } else {
      offsetX.value = 0;
    }
    startX.value = 0;
  };

  const getLeftPanX = (value: number) => {
    'worklet';
    //in case user drags from right to left, values will always be negative.
    //in order to avoid dealing with negative values, convert them to positive
    return -value;
  };

  const handlePanX = (e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
    'worklet';
    const dragX = startX.value + e.translationX;
    /*
    dragX > 0 -> dragging to right side.
    dragX < 0 -> dragging to left side.
    here in one drag, we want to let user drag only one touchable either left or right
    User cannot see both touchables in one drag
    */
    if (dragDirectionShared.value === EDraggingDirection.right) {
      if (!doesLeftTouchableExist && !doesSwipeRightToDeleteExist) {
        return;
      }
      if (dragX > 0) {
        if (doesLeftTouchableExist && dragX > totalLeftTouchableWidth) {
          return;
        }
        //drag item to right
        offsetX.value = dragX;
      } else {
        //while dragging right, if dragged to leftmost end reset values
        resetOffsets();
      }
    }
    if (dragDirectionShared.value === EDraggingDirection.left) {
      if (!doesRightTouchableExist && !doesSwipeLeftToDeleteExist) {
        return;
      }
      if (dragX < 0) {
        if (
          doesRightTouchableExist &&
          getLeftPanX(dragX) > totalRightTouchableWidth
        ) {
          return;
        }
        //drag item to left
        offsetX.value = dragX;
      } else {
        //while dragging left, if dragged to rightmost end reset values
        resetOffsets();
      }
    }
  };

  const panXGesture = Gesture.Pan()
    .manualActivation(true)
    .onTouchesDown(e => {
      initialTouchLocation.value = {
        x: e.changedTouches[0].x,
        y: e.changedTouches[0].y,
      };
    })
    .onTouchesMove((evt, state) => {
      // Sanity checks
      if (!initialTouchLocation.value || !evt.changedTouches.length) {
        state.fail();
        return;
      }

      /*
      https://github.com/software-mansion/react-native-gesture-handler/issues/1933#issuecomment-2081857102
      Here we will decide if user is scrolling or swiping item horizontally.

      Case 1 : When user scrolled down the list, x values didn't change and y values changed.
      Before scroll
      initialTouchLocation.value.x = 118
      After scroll
      evt.changedTouches[0].x = 118

      Before scroll
      initialTouchLocation.value.y = 14.3
      After scroll
      evt.changedTouches[0].y = 15

      Here as only y values changed we can conclude user was scrolling vertically.

      Case 2: When item swiped horizontally right y values didn't change, x values changed
      Before scroll
      initialTouchLocation.value.x = 33.3
      After scroll
      evt.changedTouches[0].x = 32.6

      Before scroll
      initialTouchLocation.value.y = 25
      After scroll
      evt.changedTouches[0].y = 25

      Here as only x values changed we can conclude user was swiping item horizontally.
      Also I added additional check of isDragging. If user is dragging the item, state will never fail unless user end the drag.
      */
      const xDiff = Math.abs(
        evt.changedTouches[0].x - initialTouchLocation.value.x,
      );
      const yDiff = Math.abs(
        evt.changedTouches[0].y - initialTouchLocation.value.y,
      );
      const isHorizontalPanning = xDiff > yDiff;
      if (isHorizontalPanning) {
        state.activate();
      } else {
        if (dragDirectionShared.value === EDraggingDirection.none) {
          state.fail();
        } else {
          state.activate();
        }
      }
    })
    .onStart(e => {
      //set drag direction at start
      const dragX = e.translationX + startX.value;
      dragDirectionShared.value =
        dragX > 0
          ? EDraggingDirection.right
          : dragX < 0
            ? EDraggingDirection.left
            : EDraggingDirection.none;
    })
    .onUpdate(e => {
      handlePanX(e);
    })
    .onEnd(() => {
      if (dragDirectionShared.value === EDraggingDirection.right) {
        //moving to right side

        if (doesLeftTouchableExist) {
          if (offsetX.value >= totalLeftTouchableWidth / 2) {
            //move to right drag boundary
            offsetX.value = withTiming(totalLeftTouchableWidth, {
              duration: ANIMATION_DURATION,
            });
            startX.value = totalLeftTouchableWidth;
          } else if (offsetX.value < totalLeftTouchableWidth / 2) {
            //move to leftmost end
            resetOffsets(ANIMATION_DURATION);
          }
        }

        if (doesSwipeRightToDeleteExist) {
          if (offsetX.value >= ITEM_WIDTH / 2) {
            //move to rightmost side and remove item
            offsetX.value = withTiming(
              ITEM_WIDTH + SCREEN_PADDING,
              {
                duration: ANIMATION_DURATION,
              },
              () => {
                runOnJS(deleteItem)(item.id);
              },
            );
            startX.value = ITEM_WIDTH + SCREEN_PADDING;
          } else if (offsetX.value < ITEM_WIDTH / 2) {
            //move to leftmost end
            resetOffsets(ANIMATION_DURATION);
          }
        }
      } else if (dragDirectionShared.value === EDraggingDirection.left) {
        //moving to left side

        if (doesRightTouchableExist) {
          if (getLeftPanX(offsetX.value) >= totalRightTouchableWidth / 2) {
            //move to left drag boundary

            //we set -totalRightTouchableWidth, as moving from left to right, values should be negative.
            offsetX.value = withTiming(-totalRightTouchableWidth, {
              duration: ANIMATION_DURATION,
            });
            startX.value = -totalRightTouchableWidth;
          } else if (
            getLeftPanX(offsetX.value) <
            totalRightTouchableWidth / 2
          ) {
            //move to rightmost end
            resetOffsets(ANIMATION_DURATION);
          }
        }

        if (doesSwipeLeftToDeleteExist) {
          if (getLeftPanX(offsetX.value) >= ITEM_WIDTH / 2) {
            //move to leftmost end and remove item

            //we set -ITEM_WIDTH+ SCREEN_PADDING, as moving from left to right, values should be negative.
            offsetX.value = withTiming(
              -(ITEM_WIDTH + SCREEN_PADDING),
              {
                duration: ANIMATION_DURATION,
              },
              () => {
                runOnJS(deleteItem)(item.id);
              },
            );
            startX.value = -(ITEM_WIDTH + SCREEN_PADDING);
          } else if (getLeftPanX(offsetX.value) < ITEM_WIDTH / 2) {
            //move to rightmost end
            resetOffsets(ANIMATION_DURATION);
          }
        }
      } else {
        //reset all values
        resetOffsets(ANIMATION_DURATION);
        dragDirectionShared.value = EDraggingDirection.none;
      }
    });

  const panXAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: offsetX.value,
        },
      ],
    };
  }, []);

  return {
    panXAnimatedStyles,
    panXGesture,
  };
};
