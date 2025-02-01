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

    async createProject(name, description, image, githubLink = '', liveLink = '', category, isPinned = false, pinnedOrder = null) {
        try {
            // Validate pinned order if pinned
            if (isPinned) {
                if (pinnedOrder === null || pinnedOrder < 1 || pinnedOrder > 4) {
                    throw new Error('Pinned order must be between 1 and 4.');
                }

                // Check for existing pinned projects with the same order
                const existing = await this.database.listDocuments(
                    Config.appwriteDatabaseID,
                    Config.appwriteCollectionID,
                    [
                        Query.equal('isPinned', true),
                        Query.equal('pinnedOrder', pinnedOrder)
                    ]
                );
                if (existing.total > 0) {
                    throw new Error('Another project already has this pinned position.');
                }

                // Check total pinned projects don't exceed 4
                const pinnedProjects = await this.database.listDocuments(
                    Config.appwriteDatabaseID,
                    Config.appwriteCollectionID,
                    [Query.equal('isPinned', true)]
                );
                if (pinnedProjects.total >= 4) {
                    throw new Error('Maximum of 4 pinned projects allowed.');
                }
            }

            const projectData = {
                Project_Name: name,
                Description: description,
                Image: image,
                category: category,
                isPinned: isPinned,
                pinnedOrder: isPinned ? pinnedOrder : null,
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
                Query.orderAsc("$createdAt"),
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

    async updateProject(projectID, name, description, image, githubLink = '', liveLink = '', category, isPinned = false, pinnedOrder = null) {
        try {
            const existingProject = await this.getProject(projectID);
            const wasPinned = existingProject.isPinned || false;

            if (isPinned) {
                if (pinnedOrder === null || pinnedOrder < 1 || pinnedOrder > 4) {
                    throw new Error('Pinned order must be between 1 and 4.');
                }

                // Check for existing pinned order conflicts
                const existing = await this.database.listDocuments(
                    Config.appwriteDatabaseID,
                    Config.appwriteCollectionID,
                    [
                        Query.equal('isPinned', true),
                        Query.equal('pinnedOrder', pinnedOrder)
                    ]
                );
                const conflict = existing.documents.find(doc => doc.$id !== projectID);
                if (conflict) {
                    throw new Error('Another project already has this pinned position.');
                }

                // If wasn't pinned before, check total pinned count
                if (!wasPinned) {
                    const pinnedProjects = await this.database.listDocuments(
                        Config.appwriteDatabaseID,
                        Config.appwriteCollectionID,
                        [Query.equal('isPinned', true)]
                    );
                    if (pinnedProjects.total >= 4) {
                        throw new Error('Maximum of 4 pinned projects allowed.');
                    }
                }
            }

            const projectData = {
                Project_Name: name,
                Description: description,
                Image: image,
                category: category,
                isPinned: isPinned,
                pinnedOrder: isPinned ? pinnedOrder : null,
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

    async getPinnedProjects() {
        try {
            const queries = [
                Query.equal('isPinned', true),
                Query.orderAsc("pinnedOrder"),
                Query.limit(4)
            ];
            const response = await this.database.listDocuments(
                Config.appwriteDatabaseID,
                Config.appwriteCollectionID,
                queries
            );
            return response.documents;
        } catch (error) {
            console.log("Appwrite service :: getPinnedProjects :: error", error);
            throw error;
        }
    }

}

const projectService = new ProjectService();
export default projectService;
