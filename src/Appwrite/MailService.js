import { Client, Databases, ID, Query } from "appwrite";
import Config from "../Conf/Config";

export class Mail {
    client = new Client();
    databases;
    constructor(){
        this.client
            .setEndpoint(Config.appwriteURL)
            .setProject(Config.appwriteProjectID)
        this.databases = new Databases(this.client);
    }

    async getMail(limit, offset){
        try {
            const response = await this.databases.listDocuments(
                Config.appwriteDatabaseID,
                Config.appwriteCollectionIDMail,
                [
                    Query.orderDesc("$createdAt"),
                    Query.limit(limit),
                    Query.offset(offset)
                ]
            )
            return response.documents;
        } catch (error) {
            console.log("Appwrite service :: getMail :: error", error);
            throw error;
        }
    }

    async updateMail(mailId){
        try {
            const response = await this.databases.updateDocument(
                Config.appwriteDatabaseID,
                Config.appwriteCollectionIDMail,
                mailId,
                {
                    seen: true
                }
            )
            return response;
        } catch (error) {
            console.log("Appwrite service :: updateMail :: error", error);
            throw error;
        }
    }

    async deleteMail(mailId){
        try {
            const response = await this.databases.deleteDocument(
                Config.appwriteDatabaseID,
                Config.appwriteCollectionIDMail,
                mailId
            )
            return response;
        } catch (error) {
            console.log("Appwrite service :: deleteMail :: error", error);
            throw error;
        }
    }

    async getMailById(mailId){
        try {
            return await this.databases.getDocument(
                Config.appwriteDatabaseID,
                Config.appwriteCollectionIDMail,
                mailId
            )
        } catch (error) {
            console.log("Appwrite service :: getMailById :: error", error);
            throw error;
        }
    }

    // Number of unseen messages
    async getUnseenMailCount(){
        try {
            const response = await this.databases.listDocuments(
                Config.appwriteDatabaseID,
                Config.appwriteCollectionIDMail,
                [
                    Query.orderDesc("$createdAt"),
                    Query.equal("seen", false),
                ]
            )
            return response.documents;
        } catch (error) {
            console.log("Appwrite service :: getUnseenMailCount :: error", error);
            throw error;
        }
    }

}

const MailService = new Mail();
export default MailService;