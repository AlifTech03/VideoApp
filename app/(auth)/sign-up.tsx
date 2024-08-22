import { View, Text, Image, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '@/constants';
import FormField from '@/components/FormField';
import { StatusBar } from 'expo-status-bar';
import CustomButton from '@/components/CustomButton';
import { Link, router } from 'expo-router';
import { CreateUser } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';

const SingUp = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [submitting, setSubmitting] = useState(false);
  const [fieldValue, setfieldValue] = useState({
    username: '',
    email: '',
    password: '',
  });

  const submit = async () => {
    if (!fieldValue.username || !fieldValue.email || !fieldValue.password) {
      Alert.alert('Error', 'Please fill up every field');
    }

    setSubmitting(true);
    try {
      const user = await CreateUser({
        email: fieldValue.email,
        password: fieldValue.password,
        username: fieldValue.username,
      });
      setUser(user);
      setIsLoggedIn(true);
      router.replace('/home');
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <SafeAreaView
      style={{
        height: '100%',
        backgroundColor: '#161622',
      }}>
      <StatusBar backgroundColor="#161622" style="light" />
      <ScrollView>
        <View className="min-h-[80vh] w-full justify-center px-4">
          <Image source={images.logo} className="h-[40px] w-[130px]" resizeMode="contain" />
          <Text className="my-7 font-psemibold text-3xl text-white">Sign Up to Aora</Text>
          <FormField
            title="User Name"
            value={fieldValue.username}
            handleChangeText={(e: any) =>
              setfieldValue({
                ...fieldValue,
                username: e,
              })
            }
            placeHolder="Unique Username"
            placeHolderColor="#7b7b7b"
          />
          <FormField
            title="Email"
            value={fieldValue.email}
            handleChangeText={(e: any) =>
              setfieldValue({
                ...fieldValue,
                email: e,
              })
            }
            placeHolder="Email Address"
            placeHolderColor="#7b7b7b"
            keyboardType="email-address"
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
          <CustomButton title={'Sign Up'} handlePress={submit} containerStyle="w-full mt-5" />
          <Text className="py-5 text-center font-pregular text-lg text-white">
            Already have an account?{' '}
            <Link href={'/sign-in'} className="font-psemibold text-secondary">
              Login
            </Link>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SingUp;
