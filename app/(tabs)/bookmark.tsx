import { View, Text, FlatList, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import SearchInput from '@/components/SearchInput';
import EmptyState from '@/components/EmptyState';
import VideoCard from '@/components/VideoCard';
import useAppWrite from '@/lib/useAppWrite';
import { getFavItems } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';

const Bookmark = () => {
  const {user} = useGlobalContext();
  const {data, isloading, refetch} = useAppWrite(() => getFavItems(user.$id))
  const [refereshing, setRefereshing] = useState(false)
  const onRefresh = () => {
    setRefereshing(true)
    refetch()
    setRefereshing(false)
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#161622',
        height: '100%',
      }}>
      <StatusBar backgroundColor="#161622" style="light" />
      <FlatList
        data={data}
        keyExtractor={(item: any) => item?.$id}
        renderItem={({ item }) => <VideoCard videoItem={item} />}
        ListHeaderComponent={() => (
          <View className="mb-7 px-7 py-5">
            <View className="flex-row items-center justify-between mb-5">
              <View className="item-center">
                <Text className="font-pregular text-base text-gray-100">Saved Videos</Text>
              </View>
            </View>
            <SearchInput />
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState title="No Videos Found" subTitle="Be the first one to upload a video" />
        )}
        refreshControl={<RefreshControl
        refreshing = {refereshing}
        onRefresh={onRefresh}
        />}
      />
    </SafeAreaView>
  );
};

export default Bookmark;
