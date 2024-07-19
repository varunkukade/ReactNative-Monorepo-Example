import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {EAnimationType} from '../constants';
import {getRandomColor} from '../helpers';
import {styles} from './ListItem.styles';
import {TItem} from '../types';
import Animated from 'react-native-reanimated';

type TRightTouchable = {
  item: TItem;
};

export const RightTouchable = ({item}: TRightTouchable) => {
  return item.type === EAnimationType['right-touchable'] ||
    item.type === EAnimationType['left-right-touchable'] ? (
    <Animated.View style={[styles.touchableContainer, styles.rightContainer]}>
      {item.rightTouchables?.map(eachTouchable => {
        return (
          <Animated.View
            key={eachTouchable.id}
            style={[
              styles.leftContainer,
              {
                backgroundColor: eachTouchable.bgColor || getRandomColor(),
                width: eachTouchable.width,
              },
            ]}>
            <TouchableOpacity onPress={() => {}}>
              <Text>{eachTouchable.title}</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </Animated.View>
  ) : null;
};
