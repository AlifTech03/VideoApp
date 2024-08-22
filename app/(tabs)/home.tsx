import { View, Text, FlatList, Image, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { images } from '@/constants';
import SearchInput from '@/components/SearchInput';
import Trending from '@/components/Trending';
import EmptyState from '@/components/EmptyState';
import useAppWrite from '@/lib/useAppWrite';
import { GetAllPosts, GetLatestPosts } from '@/lib/appwrite';
import VideoCard from '@/components/VideoCard';
import { useGlobalContext } from '@/context/GlobalProvider';
import { useSQLiteContext } from 'expo-sqlite';

const Home = () => {
  const db = useSQLiteContext();
  const [medicines, setMedicines] = useState<any[]>([]);
  const getData = async () => {
    try {
      const allrows = await db.getAllAsync('SELECT * FROM medicines');
      setMedicines(allrows);
    } catch (error) {
      console.log('Error', error);
    }
  };

  const updateMed = async () => {};
  
  useEffect(() => {
    db.withTransactionAsync(async () => {
      await getData();
    });
  }, [db]);

  console.log('medicines', medicines[0]);

  const { user } = useGlobalContext();
  const [refresh, setRefresh] = useState(false);
  const { data, refetch } = useAppWrite(GetAllPosts);
  const { data: latestPosts } = useAppWrite(GetLatestPosts);
  const onRefresh = () => {
    setRefresh(true);
    refetch();
    setRefresh(false);
  };
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
        renderItem={({ item }) => <VideoCard videoItem={item} screenName="Home" />}
        ListHeaderComponent={() => (
          <View className="mb-7 px-7 py-5">
            <View className="flex-row items-center justify-between ">
              <View className="item-center">
                <Text className="font-pregular text-sm text-gray-100">Welcome Back</Text>
                <Text className="font-psemibold text-2xl text-gray-200">{user?.username}</Text>
              </View>
              <Image source={images.logoSmall} className="h-12 w-10" resizeMode="contain" />
            </View>
            <SearchInput />
            <View className="mt-7">
              <Text className="mb-7 font-pregular text-gray-100">Latest Videos</Text>
              <Trending posts={latestPosts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState title="No Videos Found" subTitle="Be the first one to upload a video" />
        )}
        refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  );
};

export default Home;
