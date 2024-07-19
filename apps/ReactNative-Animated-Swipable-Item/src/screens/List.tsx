import React, {memo, useCallback, useState} from 'react';
import {FlatList, View} from 'react-native';

import {ListItem} from '../components/ListItem';
import {SCREEN_PADDING, SONGS} from '../constants';
import {styles} from './List.styles';
import {ReusableButton} from 'common-components-1/components/ReusableButton';

const MemoizedListItem = memo(ListItem);

export const List = () => {
  const [songs, setSongs] = useState(SONGS);

  const deleteItem = useCallback((id: number) => {
    setSongs(prevSongs => prevSongs.filter(eachSong => eachSong.id !== id));
  }, []);

  return (
    <View style={styles.listContainer}>
      <ReusableButton />
      <FlatList
        data={songs}
        style={{paddingHorizontal: SCREEN_PADDING}}
        renderItem={({item}) => (
          <MemoizedListItem item={item} key={item.id} deleteItem={deleteItem} />
        )}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};
