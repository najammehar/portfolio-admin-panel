import {Client, ID, Databases, Storage, Query } from 'appwrite';
import Config from '../Conf/Config'

class ProjectService{
    client = new Client();
    database;
    storage;

    constructor(){
        this.client
            .setEndpoint(Config.appwriteURL)
            .setProject(Config.appwriteProjectID)
        this.database = new Databases(this.client);
        this.storage = new Storage(this.client);
    }

    // async createProject(name, description, image, githubLink, liveLink, category){
    //     try {
    //         const response = await this.database.createDocument(
    //             Config.appwriteDatabaseID,
    //             Config.appwriteCollectionID, 
    //             ID.unique(),
    //             {
    //             Project_Name: name,
    //             Description: description,
    //             Image: image,
    //             github: githubLink,
    //             preview: liveLink,
    //             category: category
    //         });
    //         return response;
    //     } catch (error) {
    //         console.log(error);
    //         throw error;
    //     }
    // }

    async createProject(name, description, image, githubLink = '', liveLink = '', category) {
        try {
            const projectData = {
                Project_Name: name,
                Description: description,
                Image: image,
                category: category,
            };
    
            // Include GitHub link and live link only if they are provided
            if (githubLink) {
                projectData.github = githubLink;
            }
    
            if (liveLink) {
                projectData.preview = liveLink;
            }
    
            const response = await this.database.createDocument(
                Config.appwriteDatabaseID,
                Config.appwriteCollectionID,
                ID.unique(),
                projectData
            );
            return response;
        } catch (error) {
            console.log('Appwrite service :: createProject :: error', error);
            throw error;
        }
    }
    

    async getProjects(limit, offset){
        try {
            const queries = [
                Query.orderDesc("$createdAt"),
                Query.limit(limit),
                Query.offset(offset)
            ]
            let response = await this.database.listDocuments(
                Config.appwriteDatabaseID,
                Config.appwriteCollectionID,
                queries
            );
            return response.documents;
        } catch (error) {
            console.log("Appwrite service :: getProjects :: error", error);
            throw error;
        }
    }

    async getProject(projectID){
        try {
            return await this.database.getDocument(
                Config.appwriteDatabaseID,
                Config.appwriteCollectionID,  
                projectID
            );
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async deleteProject(projectID){
        try {
            return await this.database.deleteDocument(
                Config.appwriteDatabaseID,
                Config.appwriteCollectionID, 
                projectID
            );
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    // async updateProject(projectID, name, description, image, githubLink, liveLink, category){
    //     try {
    //         return await this.database.updateDocument(
    //             Config.appwriteDatabaseID,
    //             Config.appwriteCollectionID, 
    //             projectID,
    //             {
    //                 Project_Name: name,
    //                 Description: description,
    //                 Image: image,
    //                 github: githubLink,
    //                 preview: liveLink,
    //                 category: category
    //             }
    //         );
    //     } catch (error) {
    //         console.log(error);
    //         throw error;
    //     }
    // }
    async updateProject(projectID, name, description, image, githubLink = '', liveLink = '', category) {
        try {
            const projectData = {
                Project_Name: name,
                Description: description,
                Image: image,
                category: category,
            };
    
            // Include GitHub link and live link only if they are provided
            if (githubLink) {
                projectData.github = githubLink;
            }
    
            if (liveLink) {
                projectData.preview = liveLink;
            }
    
            const response = await this.database.updateDocument(
                Config.appwriteDatabaseID,
                Config.appwriteCollectionID,
                projectID,
                projectData
            );
            return response;
        } catch (error) {
            console.log('Appwrite service :: updateProject :: error', error);
            throw error;
        }
    }
    

    async uploadImage(file){
        try {
            return await this.storage.createFile(
                Config.appwriteBucketID,
                ID.unique(),
                file
            );
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async deleteImage(fileID){
        try {
            return await this.storage.deleteFile(
                Config.appwriteBucketID,
                fileID
            );
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getImageURL(fileID){
        try {
            const response = this.storage.getFilePreview(
                Config.appwriteBucketID,
                fileID
            )
            return response;
        } catch (error) {
            console.log("Appwrite service :: getImageURL :: error", error);
            throw error;
            
        }
    }

}

const projectService = new ProjectService();
export default projectService;
