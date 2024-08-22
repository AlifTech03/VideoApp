import { View, Text, Image, Dimensions } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { icons } from '@/constants';

interface TabIconsType {
  name: string;
  color: string;
  focused: boolean;
  icon: any;
}

const { height } = Dimensions.get('window');
const Tabslayout = () => {
  const TabIcons = ({ name, color, focused, icon }: TabIconsType) => {
    return (
      <View className="items-center justify-center gap-2">
        <Image className="h-6 w-6" source={icon} resizeMode="contain" tintColor={color} />
        <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`} style={{
            color
        }}>{name}</Text>
      </View>
    );
  };
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#FFA001",
        tabBarInactiveTintColor: "#CDCDE0",
        tabBarStyle: {
            backgroundColor: "#161622",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 85
        }
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcons name="Home" color={color} focused={focused} icon={icons.home} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmark"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcons name="Bookmark" color={color} focused={focused} icon={icons.bookmark} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcons name="Create" color={color} focused={focused} icon={icons.plus} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcons name="Profile" color={color} focused={focused} icon={icons.profile} />
          ),
        }}
      />
    </Tabs>
  );
};

export default Tabslayout;
