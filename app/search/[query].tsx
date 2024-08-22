import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import SearchInput from '@/components/SearchInput';
import EmptyState from '@/components/EmptyState';
import useAppWrite from '@/lib/useAppWrite';
import { SearchPosts } from '@/lib/appwrite';
import VideoCard from '@/components/VideoCard';
import { router, useLocalSearchParams } from 'expo-router';
import { icons } from '@/constants';

const SearchScreen = () => {
  const { query } = useLocalSearchParams();
  const { data, refetch } = useAppWrite(() => SearchPosts(query as any));

  useEffect(() => {
    refetch();
  }, [query]);

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
            <TouchableOpacity className="mb-5" onPress={() => router.back()}>
              <Image source={icons.leftArrow} className="h-7 w-5 " resizeMode="contain" />
            </TouchableOpacity>
            <View className="flex-row items-center justify-between ">
              <View className="item-center">
                <Text className="font-pregular text-base text-gray-100">Search Results</Text>
                <Text className="font-psemibold text-2xl text-gray-200">{query}</Text>
              </View>
            </View>
            <SearchInput />
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState title="No Videos Found" subTitle="Be the first one to upload a video" />
        )}
      />
    </SafeAreaView>
  );
};

export default SearchScreen;
