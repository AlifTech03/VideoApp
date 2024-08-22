import { View, Text, Image, Pressable, TextInput } from 'react-native';
import React, { useState } from 'react';
import { icons } from '@/constants';
const FormField = ({
  title,
  value,
  placeHolder,
  placeHolderColor,
  handleChangeText,
  keyboardType,
  otherStyle,
  ...props
}: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <View className={`my-5 ${otherStyle}`}>
      <Text className="py-2 font-pmedium text-base text-gray-100">{title}</Text>
      <View
        className={`h-16 w-full flex-row items-center justify-center rounded-2xl border-2 border-black-200 bg-black-100 px-3 ${focused ? 'border-secondary' : ''}`}>
        <TextInput
          className="flex-1 font-psemibold text-base text-white"
          value={value}
          onChangeText={handleChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeHolder}
          placeholderTextColor={placeHolderColor}
          cursorColor={placeHolderColor}
          secureTextEntry={title === 'Password' && !showPassword ? true : false}
          keyboardType={keyboardType}
        />
        {title === 'Password' && (
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={showPassword ? icons.eyeHide : icons.eye}
              className="h-7 w-7 items-center "
            />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default FormField;
