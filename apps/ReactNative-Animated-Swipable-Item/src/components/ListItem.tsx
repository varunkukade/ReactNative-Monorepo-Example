import React, {memo} from 'react';
import {Text} from 'react-native';

import Animated from 'react-native-reanimated';
import {TListItem} from '../types';
import {styles} from './ListItem.styles';
import {Color_Pallete, EAnimationType} from '../constants';
import {GestureDetectorComponent} from './GestureDetectorComponent';
import {LeftTouchable} from './LeftTouchable';
import {RightTouchable} from './RightTouchable';

const MemoizedLeftTouchable = memo(LeftTouchable);
const MemoizedGestureDetector = memo(GestureDetectorComponent);
const MemoizedRightTouchable = memo(RightTouchable);

export const ListItem = ({item, deleteItem}: TListItem) => {
  return (
    <Animated.View style={styles.container}>
      <MemoizedLeftTouchable item={item} />
      {item.type === EAnimationType['swipe-right-to-delete'] ? (
        <Animated.View
          style={[
            styles.leftContainer,
            styles.deleteContainer,
            styles.leftDelete,
          ]}>
          <Text style={{color: Color_Pallete.crystal_white}}>{'Delete'}</Text>
        </Animated.View>
      ) : null}
      <MemoizedGestureDetector item={item} deleteItem={deleteItem} />
      {item.type === EAnimationType['swipe-left-to-delete'] ? (
        <Animated.View
          style={[
            styles.rightContainer,
            styles.deleteContainer,
            styles.rightDelete,
          ]}>
          <Text style={{color: Color_Pallete.crystal_white}}>{'Delete'}</Text>
        </Animated.View>
      ) : null}
      <MemoizedRightTouchable item={item} />
    </Animated.View>
  );
};
