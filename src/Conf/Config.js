const Config = {
    appwriteURL: String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectID: String(import.meta.env.VITE_APPWRITE_PROJECT),
    appwriteDatabaseID: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteCollectionID: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
    appwriteCollectionIDMail: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID_MAIL),
    appwriteBucketID: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
}

export default Config;