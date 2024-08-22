import { Account, Avatars, Client, Databases, ID, ImageGravity, Query, Storage } from 'react-native-appwrite';
import * as ImagePicker from 'expo-image-picker';

type CreateUserType = {
    email: string,
    password: string,
    username: string
}
type CreateSessionType = {
    email: string,
    password: string,
}


type FormType = {
    title: string;
    video: ImagePicker.ImagePickerAsset | null;
    thumbnail: ImagePicker.ImagePickerAsset | null;
    prompt: string;
    userId: string
};

const config = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.dev.learningapp",
    projectId: "66b37ba100000963da54",
    databaseId: "66b38ac700399527affa",
    userCollectionId: "66b38ae40030add683ed",
    videosCollectionId: "66b38b020028c7bdca77",
    storageId: "66b39b4d000b4f207130"
}

// Init your React Native SDK
const { endpoint:
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videosCollectionId,
    storageId } = config
const client = new Client();
client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.
    ;

const account = new Account(client);
const avatars = new Avatars(client)
const databases = new Databases(client)
const storage = new Storage(client);

export const CreateUser = async ({ email, password, username }: CreateUserType) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, username);
        if (!newAccount) throw Error();

        const avatarUrl = avatars.getInitials(username)
        await SignIn({
            email, password
        })

        const newUser = await databases.createDocument(
            databaseId,
            userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        )
        return newUser;

    } catch (error) {
        console.log("sign in", error);
        throw new Error(error as string)

    }
}

export const SignIn = async ({ email, password }: CreateSessionType) => {
    console.log(email);

    try {
        const result = await account.createEmailPasswordSession(email, password)
        return result;
    } catch (error) {
        console.log('sign in', error);

        throw new Error(error as string)
    }
}

export const GetUser = async () => {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw new Error;

        const currenctUser = await databases.listDocuments(
            databaseId,
            userCollectionId,
            [
                Query.equal('accountId', currentAccount.$id)
            ]
        )
        if (!currenctUser) throw new Error;
        return currenctUser.documents[0];
    } catch (error) {
        console.log(error)
    }
}

export const GetAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videosCollectionId
        )
        return posts.documents
    } catch (error: any) {
        throw new Error(error)
    }
}
export const GetLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videosCollectionId,
            [
                Query.orderDesc('$createdAt'),
                Query.limit(5)
            ]
        )
        return posts.documents
    } catch (error: any) {
        throw new Error(error)
    }
}

export const SearchPosts = async (query: string) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videosCollectionId,
            [Query.search(
                'title', query
            )]
        )
        return posts.documents
    } catch (error: any) {
        throw new Error(error)
    }
}

export const GetUserPosts = async (userId: string) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videosCollectionId,
            [Query.equal(
                'user', userId
            )]
        )
        return posts.documents
    } catch (error: any) {
        throw new Error(error)
    }
}

export const signOut = async () => {
    try {
        const session = await account.deleteSession('current')
        return session
    } catch (error) {
        console.log("Error", error);

        throw new Error(error as any)
    }
}


const getFilePreview = async (fileId: string, type: string) => {
    let fileUrl
    try {
        if (type === "video") {

            fileUrl = storage.getFileView(
                storageId,
                fileId
            )

        } else if (type === "image") {
            fileUrl = storage.getFilePreview(
                storageId,
                fileId,
                2000, 2000, ImageGravity.Top, 100
            )
        } else {
            throw new Error("Invalid file type")
        }

        if (!fileUrl) throw Error
        return fileUrl
    } catch (error) {

    }
}

const uploadFile = async (file: any, type: string) => {
    if (!file) return;
    const asset = {
        name: file?.fileName,
        type: file?.mimeType,
        size: file?.fileSize,
        uri: file.uri
    }
    try {
        const uploadFile = await storage.createFile(
            storageId,
            ID.unique(),
            asset
        )
        const fileUrl = await getFilePreview(uploadFile.$id, type)
        return fileUrl

    } catch (error: any) {
        throw new Error(error)
    }
}

export const createVideo = async (form: FormType) => {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, "image"),
            uploadFile(form.video, "video"),
        ])
        const newPost = await databases.createDocument(
            databaseId,
            videosCollectionId,
            ID.unique(),
            {
                title: form.title,
                thumbnail: thumbnailUrl,
                prompt: form.prompt,
                video: videoUrl,
                user: form.userId
            }
        )
        return newPost
    } catch (error: any) {
        throw new Error(error.message)
    }
}

export const addFavourites = async (userId: string, itemId: string) => {

    console.log(userId, itemId);

    try {
        const userRecord = await databases.getDocument(databaseId, userCollectionId, userId);

        console.log({ userRecord });
        // Update the favorites list
        const updatedFavorites = [...userRecord.favourites, itemId];


        await databases.updateDocument(databaseId, userCollectionId, userId, {
            favourites: updatedFavorites,
        });
        await GetUser()
        console.log('Item added to favorites');
    } catch (error: any) {
        console.error('Failed to add favorite:', error);
        throw new Error(error)
    }
}
export const removeFavourites = async (userId: string, itemId: string) => {


    try {
        // Retrieve the current user record
        const userRecord = await databases.getDocument(databaseId, userCollectionId, userId);

        // Update the favorites list
        const updatedFavorites = userRecord.favourites.filter(($id: string) => $id !== itemId);

        await databases.updateDocument(databaseId, userCollectionId, userId, {
            favourites: updatedFavorites,
        });

        console.log('Item removed from favorites');
    } catch (error: any) {
        console.error('Failed to remove favorite:', error);
        throw new Error(error)
    }
}


export const getFavItems = async (userId: string) => {
    try {
        const userDocument = await databases.getDocument(databaseId, userCollectionId, userId)
        const favoriteItemIds = userDocument.favourites || [];
        if (favoriteItemIds.length > 0) {
            // Fetch the items using their IDs
            const itemsResponse = await databases.listDocuments(databaseId, videosCollectionId, [
              Query.contains('$id', favoriteItemIds),
            ]);
            return itemsResponse.documents;
          } else {
            return [];
          }
    } catch (error: any) {
        throw new Error(error)
    }
}
