import {
  View,
  Text,
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
  ViewToken,
  Dimensions,
} from 'react-native';
import React, { useState } from 'react';
import * as Animatable from 'react-native-animatable';
import { icons } from '@/constants';
import { Video, ResizeMode } from 'expo-av';

const { width } = Dimensions.get('window');
const zoomIn = {
  0: {
    scale: 0.9,
  },
  0.5: {
    scale: 1,
  },
  1: {
    scale: 1.2,
  },
};
const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  },
};

const indicatorScaleUp = {
  0: {
    scaleX: 1,
  },
  1: {
    scaleX: 1.5,
  },
};
const indicatorScaleDown = {
  0: {
    scaleX: 1.5,
  },
  1: {
    scaleX: 1,
  },
};

const Indicator = ({ activeItem, item }: any) => {
  return (
    <Animatable.View
      key={item.$id}
      className={`h-2 w-2  ${activeItem === item.$id ? 'mx-2 rounded-[3px] bg-secondary px-2' : 'mx-1 rounded-full bg-gray-400'}`}
      animation={activeItem === item.$id ? (indicatorScaleUp as any) : (indicatorScaleDown as any)}
    />
  );
};

const TrendingItem = ({ activeItem, item, index }: any) => {
  const [play, setPlay] = useState(false);
  return (
    <Animatable.View
      key={index}
      className="px-5 py-5"
      animation={activeItem === item.$id ? (zoomIn as any) : (zoomOut as any)}
      easing={'ease-in'}
      duration={500}>
      {play ? (
        <Video
          source={{
            uri: item.video,
          }}
          style={{
            marginTop: 12,
            height: 250,
            width: 185,
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
        <TouchableOpacity
        key={index}
          className="items-center justify-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}>
          <ImageBackground
            source={{
              uri: item.thumbnail,
            }}
            className="my-5 h-72 w-52 overflow-hidden rounded-[35px] shadow-lg shadow-black/40"
            resizeMode="cover"
          />
          <Image source={icons.play} className="absolute h-12 w-12" resizeMode="contain" />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

const Trending = ({ posts }: any) => {
  const [activeItem, setActiveItem] = useState(posts[0]);
  const viewableItemChanged = ({
    viewableItems,
    changed,
  }: {
    viewableItems: ViewToken[];
    changed: ViewToken[];
  }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };
  return (
    <View className="items-center justify-center">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item, index }) => <TrendingItem activeItem={activeItem} item={item} index={index} />}
        onViewableItemsChanged={viewableItemChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 70,
        }}
        contentOffset={{
          x: width * 0.9,
          y: 150,
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
      <View className="mt-5 flex-row">
        {posts.map((item: any) => (
          <Indicator activeItem={activeItem} item={item} />
        ))}
      </View>
    </View>
  );
};

export default Trending;
