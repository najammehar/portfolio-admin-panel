import { Account, Client } from 'appwrite';
import Config from '../Conf/Config'

class AuthService{
    client = new Client();
    account;

    constructor(){
        this.client
            .setEndpoint(Config.appwriteURL)
            .setProject(Config.appwriteProjectID)
        this.account = new Account(this.client);
    }

    async login(email, password){
        try {
            const response = await this.account.createEmailPasswordSession(email, password);
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async logout(){
        try {
            return await this.account.deleteSessions();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getAccount(){
        try {
            return await this.account.get();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

}

const authService = new AuthService();
export default authService;