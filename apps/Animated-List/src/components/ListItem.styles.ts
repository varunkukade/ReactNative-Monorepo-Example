import {StyleSheet} from 'react-native';
import {Color_Pallete} from '../constants';

export const styles = StyleSheet.create({
  animatedItemContainer: {
    paddingTop: 15,
    position: 'absolute',
  },
  itemContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  imageContainer: {
    marginRight: 10,
  },
  descriptionContainer: {
    width: '64%',
    justifyContent: 'space-evenly',
  },
  description1: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Color_Pallete.crystal_white,
  },
  description2: {color: Color_Pallete.silver_storm},
  draggerContainer: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  marginBottom: {
    marginBottom: 5,
  },
  dragger: {
    width: '30%',
    height: 2,
    backgroundColor: Color_Pallete.crystal_white,
  },
  image: {
    height: 60,
    width: 60,
  },
  extraDescContainer: {
    paddingHorizontal: 15,
    marginTop: 5,
  },
});
