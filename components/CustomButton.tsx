import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

const CustomButton = ({ title, handlePress, containerStyle, textStyle, isLoading }: any) => {
  return (
    <TouchableOpacity
      className={`min-h-[62px] items-center justify-center rounded-xl bg-secondary-100 ${isLoading ? 'opacity-50' : ''} ${containerStyle}`}
      onPress={handlePress}
      disabled={isLoading ? true : false}>
      <Text className={`font-psemibold text-lg text-primary ${textStyle}`}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
