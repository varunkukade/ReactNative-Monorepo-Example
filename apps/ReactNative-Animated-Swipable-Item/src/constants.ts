import {Dimensions} from 'react-native';
import {TItem} from './types';
import {getRandomColor} from './helpers';

export const SONG_HEIGHT = 80;
export enum EAnimationType {
  'left-touchable',
  'right-touchable',
  'left-right-touchable',
  'swipe-right-to-delete',
  'swipe-left-to-delete',
}
export const SONGS: TItem[] = [
  {
    id: 0,
    title: 'Hymn for the Weekend',
    singer: 'Coldplay',
    imageSrc:
      'https://i.scdn.co/image/ab67616d0000b2738ff7c3580d429c8212b9a3b6',
    leftTouchables: [
      {
        id: 0,
        title: 'Left1',
        width: 60,
        bgColor: getRandomColor(),
      },
      {
        id: 1,
        title: 'Left2',
        width: 40,
        bgColor: getRandomColor(),
      },
    ],
    type: EAnimationType['left-touchable'],
  },
  {
    id: 1,
    title: 'Paradise',
    singer: 'Coldplay',
    imageSrc:
      'https://i.scdn.co/image/ab67616d0000b273de0cd11d7b31c3bd1fd5983d',
    rightTouchables: [
      {
        id: 0,
        title: 'Right1',
        width: 40,
        bgColor: getRandomColor(),
      },
      {
        id: 1,
        title: 'Right2',
        width: 40,
        bgColor: getRandomColor(),
      },
    ],
    type: EAnimationType['right-touchable'],
  },
  {
    id: 2,
    title: 'Viva La Vida',
    singer: 'Coldplay',
    imageSrc: 'https://i.ytimg.com/vi/dvgZkm1xWPE/maxresdefault.jpg',
    leftTouchables: [
      {
        id: 0,
        title: 'Left1',
        width: 60,
        bgColor: getRandomColor(),
      },
      {
        id: 1,
        title: 'Left2',
        width: 60,
        bgColor: getRandomColor(),
      },
      {
        id: 2,
        title: 'Left3',
        width: 60,
        bgColor: getRandomColor(),
      },
    ],
    rightTouchables: [
      {
        id: 0,
        title: 'Right1',
        width: 60,
        bgColor: getRandomColor(),
      },
      {
        id: 1,
        title: 'Right2',
        width: 60,
        bgColor: getRandomColor(),
      },
      {
        id: 2,
        title: 'Right3',
        width: 60,
        bgColor: getRandomColor(),
      },
    ],
    type: EAnimationType['left-right-touchable'],
  },
  {
    id: 3,
    title: 'A Sky Full of Stars',
    singer: 'Coldplay',
    imageSrc:
      'https://i.scdn.co/image/ab67616d0000b273e5a95573f1b91234630fd2cf',
    type: EAnimationType['swipe-right-to-delete'],
  },
  {
    id: 4,
    title: 'Clocks',
    singer: 'Coldplay',
    imageSrc:
      'https://i.scdn.co/image/ab67616d0000b273de09e02aa7febf30b7c02d82',
    type: EAnimationType['swipe-left-to-delete'],
  },
  {
    id: 5,
    title: 'The Scientist',
    singer: 'Coldplay',
    imageSrc:
      'https://i.scdn.co/image/ab67616d0000b273de09e02aa7febf30b7c02d82',
  },
  {
    id: 6,
    title: 'Dusk Till Dawn (feat. Sia)',
    singer: 'ZAYN, Sia',
    imageSrc:
      'https://i.scdn.co/image/ab67616d0000b27323852b7ef0ecfe29d38d97ee',
  },
  {
    id: 7,
    title: 'Titanium (feat. Sia)',
    singer: 'David Guetta, Sia',
    imageSrc:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnwB_jMjMFnQkQOPvENr-diiJfDWFripRHBMSdeaHZyA&s',
  },
  {
    id: 8,
    title: 'Chandelier',
    singer: 'Sia',
    imageSrc:
      'https://i.scdn.co/image/ab67616d0000b273297b2c53224bd19162f526e3',
  },
  {
    id: 9,
    title: 'Unstoppable',
    singer: 'Sia',
    imageSrc:
      'https://i.scdn.co/image/ab67616d0000b273754b2fddebe7039fdb912837',
  },
  {
    id: 10,
    title: 'Cheap Thrills',
    singer: 'Sia, Sean Paul',
    imageSrc:
      'https://i.scdn.co/image/ab67616d0000b2731e6901561bb0cd5697cbfded',
  },
  {
    id: 11,
    title: 'Elastic Heart',
    singer: 'Sia',
    imageSrc:
      'https://i.scdn.co/image/ab67616d0000b2735d199c9f6e6562aafa5aa357',
  },
  {
    id: 12,
    title: 'Believer',
    singer: 'Imagine Dragons',
    imageSrc:
      'https://i.scdn.co/image/ab67616d0000b273156aeddf54ed40b1d9d30c9f',
  },
  {
    id: 13,
    title: 'Let me love you',
    singer: 'DJ Snake, Justin Bieber',
    imageSrc:
      'https://i.scdn.co/image/ab67616d0000b273212d776c31027c511f0ee3bc',
  },
  {
    id: 14,
    title: 'Lean On',
    singer: 'Major Lazer',
    imageSrc:
      'https://i.scdn.co/image/ab67616d0000b273548910835dbfaf3f79a1dc46',
  },
  {
    id: 15,
    title: 'Taki Taki',
    singer: 'DJ Snake',
    imageSrc:
      'https://i.scdn.co/image/ab67616d0000b273e105c410a7b390c61a58cbf8',
  },
];

export const Color_Pallete = {
  metal_black: '#0E0C0A',
  night_shadow: '#1C1C1C',
  crystal_white: '#FFFFFF',
  silver_storm: '#808080',
};

export const SCREEN_PADDING = 10;
export const ITEM_WIDTH = Dimensions.get('window').width - SCREEN_PADDING * 2;

export const ANIMATION_DURATION = 200;

export enum EDraggingDirection {
  'left',
  'right',
  'none',
}
