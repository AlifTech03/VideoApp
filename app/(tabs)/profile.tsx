import { View, Text, FlatList, Image, RefreshControl, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { icons, images } from '@/constants';
import SearchInput from '@/components/SearchInput';
import Trending from '@/components/Trending';
import EmptyState from '@/components/EmptyState';
import useAppWrite from '@/lib/useAppWrite';
import { GetUserPosts, signOut } from '@/lib/appwrite';
import VideoCard from '@/components/VideoCard';
import { useGlobalContext } from '@/context/GlobalProvider';
import { router } from 'expo-router';

const Profile = () => {

  const {
    user: { $id, username, avatar },
    setUser,
    setIsLoggedIn,
  } = useGlobalContext();
  const { data: userPosts } = useAppWrite(() => GetUserPosts($id));

  const logOut = async () => {
    try {
      await signOut();
      router.replace('/sign-in');
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setUser(null);
      setIsLoggedIn(false);
    }
  };
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#161622',
        height: '100%',
      }}>
      <StatusBar backgroundColor="#161622" style="light" />
      <FlatList
        data={userPosts}
        keyExtractor={(item: any) => item?.$id}
        renderItem={({ item }) => <VideoCard videoItem={item} />}
        ListHeaderComponent={() => (
          <View className="items-center justify-center px-5 py-5">
            <TouchableOpacity className="w-full items-end" onPress={logOut}>
              <Image source={icons.logout} className="h-8 w-8" resizeMode="contain" />
            </TouchableOpacity>
            <View className="mb-9 h-[70px] w-[70px] rounded-lg border border-secondary p-1">
              <Image
                source={{
                  uri: avatar,
                }}
                className="h-full w-full rounded-lg"
                resizeMode="cover"
              />
              <Text className="pt-5 text-center font-psemibold text-2xl text-white">
                {username}
              </Text>
            </View>
            <View className="mt-9 flex-row gap-5">
              <View className="items-center">
                <Text className="font-pbold text-2xl text-white">{userPosts.length}</Text>
                <Text className="font-pregular text-xl text-white">Posts</Text>
              </View>
              <View className="items-center">
                <Text className="font-pbold text-2xl text-white">1.2k</Text>
                <Text className="font-pregular text-xl text-white">Followers</Text>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState title="No Videos Found" subTitle="Be the first one to upload a video" />
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;
