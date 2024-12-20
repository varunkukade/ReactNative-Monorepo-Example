import {LayoutChangeEvent} from 'react-native';
import {SharedValue} from 'react-native-reanimated';

export type TItem = {
  id: number;
  title: string;
  singer: string;
  imageSrc: string;
  extraDesc?: string;
};

export type TListItem = {
  item: TItem;
  isDragging: SharedValue<number>;
  draggedItemId: SharedValue<NullableNumber>;
  currentSongPositions: SharedValue<TSongPositions>;
  scrollUp: () => void;
  scrollDown: () => void;
  scrollY: SharedValue<number>;
  isDragInProgress: SharedValue<boolean>;
  handleLayout: (id: number, event: LayoutChangeEvent) => void;
  calculateHeightForIndexesBelow: (targetIndex: number) => number;
};

export type TSongPositions = {
  [key: number]: {
    updatedIndex: number;
    updatedTop: number;
    // songHeight: number;
  };
};

export type NullableNumber = null | number;
