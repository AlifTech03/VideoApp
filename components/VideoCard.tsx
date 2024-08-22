import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { icons } from '@/constants';
import { ResizeMode, Video } from 'expo-av';
import AntDesign from '@expo/vector-icons/AntDesign';
import { addFavourites, removeFavourites } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';

const VideoCard = ({
  videoItem: {
    $id,
    title,
    thumbnail,
    video,
    user: { username, avatar },
  },
  screenName
}: any) => {
  const {user} = useGlobalContext();
  const [play, setPlay] = useState(false);
  const [favourites, setFavourites] = useState(user.favourites.includes($id));

  const setToFavourite = async () => { 
      if (favourites) {
        await removeFavourites(user.$id, $id);
      } else {
        await addFavourites(user.$id, $id);
      }
      setFavourites(!favourites);
  };
  
  return (
    <View className="mb-14 px-7">
      <View className="flex-row ">
        <View className="flex-1 flex-row items-center gap-4 ">
          <View className="h-12 w-12 items-center justify-center rounded-lg border border-secondary p-0.5">
            <Image
              source={{ uri: avatar }}
              className="h-full w-full rounded-lg"
              resizeMode="cover"
            />
          </View>
          <View>
            <Text className="font-pregular text-white" numberOfLines={1}>
              {title}
            </Text>
            <Text className="font-psemibold text-gray-200" numberOfLines={1}>
              {username}
            </Text>
          </View>
        </View>
        <View className="pt-2">
          <Image source={icons.menu} className="h-7 w-7" resizeMode="contain" />
        </View>
      </View>
      {play ? (
        <Video
          source={{
            uri: video,
          }}
          style={{
            marginTop: 12,
            height: 240,
            width: '100%',
            borderRadius: 33,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          useNativeControls
          onPlaybackStatusUpdate={(status) => {
            if (status.isLoaded && status.didJustFinish) {
              setPlay(false);
            }
          }}
          onError={(error) => {
            console.error('Video error:', error);
          }}
        />
      ) : (
        <View className="mt-5">
          {screenName ==="Home" && <TouchableOpacity className="absolute right-3 top-2 z-50" onPress={setToFavourite}>
            <AntDesign
              name={favourites ? 'heart' : 'hearto'}
              size={24}
              color="#FF9C01"
            />
          </TouchableOpacity>}
          <TouchableOpacity
            className="h-60 w-full items-center justify-center"
            activeOpacity={0.7}
            onPress={() => setPlay(true)}>
            <Image
              source={{
                uri: thumbnail,
              }}
              className="h-full w-full rounded-xl"
              resizeMode="cover"
            />
            <Image source={icons.play} className="absolute h-12 w-12" resizeMode="contain" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default VideoCard;
