import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '@/components/FormField';
import { ResizeMode, Video } from 'expo-av';
import { icons } from '@/constants';
import CustomButton from '@/components/CustomButton';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { createVideo } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';

type FormType = {
  title: string;
  video: ImagePicker.ImagePickerAsset | null;
  thumbnail: ImagePicker.ImagePickerAsset | null;
  prompt: string;
};

const Create = () => {
  const {user} = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<FormType>({
    title: '',
    video: null,
    thumbnail: null,
    prompt: '',
  });

  const openPicker = async (selectType: string) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        selectType === 'image'
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      if (selectType === 'image' && result.assets && result.assets.length > 0) {
        setForm({
          ...form,
          thumbnail: result.assets[0],
        });
      }
      if (selectType === 'video' && result.assets && result.assets.length > 0) {
        setForm({
          ...form,
          video: result.assets[0],
        });
      }
    } else {
      setTimeout(() => {
        Alert.alert('Document Picked', JSON.stringify(result, null, 2));
      }, 100);
    }
  };
  const submit = async () => {
    if (!form.title || !form.prompt || !form.thumbnail || !form.video) {
      Alert.alert('Fill up the form field');
    }

    setUploading(true);
    try {
      await createVideo({...form, userId: user.$id})
      Alert.alert("Successfull", "You upload a video successfully")
      router.push('/home')
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setForm({
        title: '',
        video: null,
        thumbnail: null,
        prompt: '',
      });
      setUploading(false);
    }
  };
  return (
    <SafeAreaView
      className="bg-primary"
      style={{
        backgroundColor: '#161622',
        height: '100%',
      }}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 20,
        }}>
        <View className="mx-5 mt-7">
          <Text className="font-psemibold text-2xl text-white">Upload Video</Text>
          <FormField
            title="Video Title"
            value={form.title}
            handleChangeText={(e: string) => setForm({ ...form, title: e })}
            placeHolder="Give a catchy title for the video"
            placeHolderColor="#7b7b7b"
            otherStyle="mt-7"
          />
          <View className="sapce-y-2 mt-7">
            <Text className="py-2 font-pmedium text-base text-gray-100">Upload Video</Text>
            <TouchableOpacity onPress={() => openPicker('video')}>
              {form.video ? (
                <Video
                  source={{
                    uri: form.video.uri,
                  }}
                  resizeMode={ResizeMode.COVER}
                  style={{
                    height: 160,
                    width: '100%',
                    borderRadius: 20,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }}
                />
              ) : (
                <View className="h-40 w-full items-center justify-center rounded-2xl bg-black-100">
                  <View className="h-12 w-12 items-center justify-center rounded-md border border-dashed border-secondary">
                    <Image source={icons.upload} className="h-1/2 w-1/2" resizeMode="cover" />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <View className="sapce-y-2 mt-7">
            <Text className="py-2 font-pmedium text-base text-gray-100">Thumbnail Image</Text>
            <TouchableOpacity onPress={() => openPicker('image')}>
              {form.thumbnail ? (
                <Image
                  source={{
                    uri: form.thumbnail?.uri,
                  }}
                  className="h-40 w-full rounded-2xl"
                  resizeMode="cover"
                />
              ) : (
                <View className="h-16 w-full flex-row items-center justify-center rounded-2xl bg-black-100">
                  <View className="h-12 w-12  items-center justify-center gap-2 rounded-md ">
                    <Image source={icons.upload} className="h-1/2 w-1/2" resizeMode="cover" />
                  </View>
                  <Text className="font-pregular text-sm text-gray-100">Choose a file</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <FormField
            title="Video Prompt"
            value={form.prompt}
            handleChangeText={(e: string) => setForm({ ...form, prompt: e })}
            placeHolder="Promt you use for generate the video"
            placeHolderColor="#7b7b7b"
            otherStyle="mt-7"
          />
          <CustomButton
            title={'Submit & Publish'}
            handlePress={submit}
            containerStyle="mt-5"
            isLoading={uploading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
