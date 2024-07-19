import { EAnimationType } from './constants';

export type TTouchable = {
  id: number;
  title: string;
  width: number;
  bgColor?: string
};

export type TItem = {
  id: number;
  title: string;
  singer: string;
  imageSrc: string;
  leftTouchables?: TTouchable[];
  rightTouchables?: TTouchable[];
  type?: EAnimationType;
};

export type TListItem = {
  item: TItem;
  deleteItem: (id: number) => void;
};
export type NullableNumber = null | number;
