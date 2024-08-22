import { View, Text, Image } from 'react-native';
import React from 'react';
import { images } from '@/constants';
import CustomButton from './CustomButton';
import { router } from 'expo-router';

const EmptyState = ({ title, subTitle }: any) => {
  return (
    <View className="items-center justify-center px-7">
        <Image
            source={images.empty}
            className='w-[270px] h-[215px]'
            resizeMode='contain'
        />
      <Text className="font-psemibold text-xl text-gray-200">{title}</Text> 
      <Text className="font-pregular text-sm text-gray-100">{subTitle}</Text>
      <CustomButton
        title="Create Video"
        handlePress= {() => router.push('/create')}
        containerStyle="w-full my-5 "
      />
    </View>
  );
};

export default EmptyState;
