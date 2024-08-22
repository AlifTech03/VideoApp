import { View, Text, Image, Pressable, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { icons } from '@/constants';
import { router, usePathname } from 'expo-router';
const SearchInput = ({
}: any) => {
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState('')
  const pathname = usePathname();
  return (
    <View
      className={`h-16 w-full my-5 flex-row items-center justify-center rounded-2xl border-2 border-black-200 bg-black-100 px-3 ${focused ? 'border-secondary' : ''}`}>
      <TextInput
        className="flex-1 font-psemibold text-base text-white "
        value={query}
        onChangeText={(e) => setQuery(e)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={'Search for a video topic'}
        placeholderTextColor={"#CDCDE0"}
        cursorColor={"#CDCDE0"}
      />
      <TouchableOpacity onPress={()=> {
        if(!query) {
          return Alert.alert('Missing Queary', "Please input something to search results")
        }
        if(pathname.startsWith('/search')) router.setParams({query})
        else router.push(`/search/${query}`)
      }}> 
        <Image
            source={icons.search}
            resizeMode='contain'
            className='h-5 w-5'
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
