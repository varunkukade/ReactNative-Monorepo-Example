import React from 'react';
import {TItem} from '../types';
import {Color_Pallete, EAnimationType} from '../constants';
import Animated from 'react-native-reanimated';
import {styles} from './ListItem.styles';
import {getRandomColor} from '../helpers';
import {Text, TouchableOpacity} from 'react-native';

type TLeftTouchable = {
  item: TItem;
};

export const LeftTouchable = ({item}: TLeftTouchable) => {
  return item.type === EAnimationType['left-touchable'] ||
    item.type === EAnimationType['left-right-touchable'] ? (
    <Animated.View style={styles.touchableContainer}>
      {item.leftTouchables?.map(eachTouchable => {
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
              <Text style={{color: Color_Pallete.metal_black}}>
                {eachTouchable.title}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </Animated.View>
  ) : null;
};
