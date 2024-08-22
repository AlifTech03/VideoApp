import { View, Text, Image, ScrollView } from 'react-native';
import React from 'react';
import { images } from '@/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/components/CustomButton';
import { StatusBar } from 'expo-status-bar';
import { Redirect, router } from 'expo-router';
import { useGlobalContext } from '@/context/GlobalProvider';
const Index = () => {
  const {isLoggedIn, isLoading} = useGlobalContext();
  
  if(!isLoading && isLoggedIn) return <Redirect href={'/home'}/>
  return (
    <SafeAreaView
      style={{
        height: '100%',
        backgroundColor: '#161622',
      }}>
      <StatusBar backgroundColor="#161622" style="light" />

      <ScrollView
        contentContainerStyle={{
          height: '100%',
        }}>
        <View className="min-h-[85vh] w-full items-center justify-center px-4">
          <Image
            source={images.logo}
            className="h-[50px] w-[136px]"
            resizeMode="contain"
            style={{}}
          />
          <Image
            source={images.cards}
            className="h-[320px] w-full max-w-[400px]"
            resizeMode="contain"
          />
          <View className="relative mt-5">
            <Text className="text-center font-pbold text-3xl text-white">
              Discover Endless Possibilities with <Text className="text-secondary-200">Aora</Text>
            </Text>
            <Image
              source={images.path}
              className="absolute -bottom-1 -right-8 h-[15px] w-[136px]"
              resizeMode="contain"
            />
          </View>
          <Text className="mt-7 text-center font-pregular text-sm text-gray-100">
            Where Creativity Meets Innovation: Embark on a Journey of Limitless Exploration with
            Aora
          </Text>
          <CustomButton
            title={'Continue With Email'}
            handlePress={() => router.push('/sign-in')}
            containerStyle="w-full mt-5"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;
