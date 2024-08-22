import { View, Text, Image, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '@/constants';
import FormField from '@/components/FormField';
import { StatusBar } from 'expo-status-bar';
import CustomButton from '@/components/CustomButton';
import { Link, router } from 'expo-router';
import { GetUser, SignIn } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';

const SingIn = () => {
  const {setUser, setIsLoggedIn} = useGlobalContext();
  const [fieldValue, setfieldValue] = useState({
    email: '',
    password: '',
  });
  const [submitting, setSubmitting] = useState(false)
  const submit = async() => {
    if ( !fieldValue.email || !fieldValue.password) {
      Alert.alert('Error', 'Please fill up every field');
    }
    setSubmitting(true)
    try {
      await SignIn({
        email: fieldValue.email,
        password: fieldValue.password
      })
      const result = await GetUser();
      setUser(result)
      setIsLoggedIn(true)
      router.replace('/home')
    } catch (error) {
      throw new Error(error as string)
    }finally{
      setSubmitting(false)
    }
  }
  return (
    <SafeAreaView
      style={{
        height: '100%',
        backgroundColor: '#161622',
      }}>
      <StatusBar backgroundColor="#161622" style="light" />
      <ScrollView>
        <View className="w-full min-h-[80vh] px-4 justify-center">
          <Image source={images.logo} className="h-[40px] w-[130px]" resizeMode="contain" />
          <Text className="my-7 font-psemibold text-3xl text-white">Log in to Aora</Text>
          <FormField
            title="Email"
            value={fieldValue.email}
            handleChangeText={(e: any) =>
              setfieldValue({
                ...fieldValue,
                email: e,
              })
            }
            placeHolder="Unique Username"
            placeHolderColor="#7b7b7b"
            keyboardType='email-address'
          />
          <FormField
            title="Password"
            value={fieldValue.password}
            handleChangeText={(e: any) =>
              setfieldValue({
                ...fieldValue,
                password: e,
              })
            }
            placeHolder="Password"
            placeHolderColor="#7b7b7b"
          />
          <CustomButton title={'Log In'} handlePress={submit} containerStyle="w-full mt-5" />
          <Text className="font-pregular text-center py-5 text-lg text-white">
            Don't have an account?{' '}
            <Link href={'/sign-up'} className="font-psemibold text-secondary">
              Sign Up
            </Link>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SingIn;
