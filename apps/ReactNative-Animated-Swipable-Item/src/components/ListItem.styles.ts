import {StyleSheet} from 'react-native';
import {Color_Pallete, ITEM_WIDTH, SONG_HEIGHT} from '../constants';

export const styles = StyleSheet.create({
  container: {
    height: SONG_HEIGHT,
    flexDirection: 'row',
    position: 'relative',
  },
  itemContainer: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    zIndex: 100,
    elevation: 100,
    flexDirection: 'row',
    backgroundColor: Color_Pallete.metal_black,
  },
  leftContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  deleteContainer: {
    backgroundColor: 'red',
    width: ITEM_WIDTH,
  },
  leftDelete: {
    alignItems: 'flex-start',
    paddingLeft: 20,
  },
  rightDelete: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 20,
  },
  imageContainer: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: '3%',
    paddingVertical: '3%',
  },
  descriptionContainer: {
    width: '80%',
    justifyContent: 'space-evenly',
  },
  description1: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Color_Pallete.crystal_white,
  },
  description2: {color: Color_Pallete.silver_storm},
  image: {
    height: SONG_HEIGHT - 20,
    width: '97%',
  },
  touchableContainer: {
    flexDirection: 'row',
  },
  rightContainer: {right: 0, position: 'absolute', height: '100%'},
});
