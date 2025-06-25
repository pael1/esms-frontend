import BaseAPIService from "./BaseAPIService";

class UserService extends BaseAPIService {
    async getUsers(params: object): Promise<any> {
        return await this.request(`/users`, 'GET', params);
    }

    async getAwardees(params: object): Promise<any> {
        return await this.request(`/awardees`, 'GET', params);
    }

    async getAgencyUsers(params: object): Promise<any> {
        return await this.request(`/users/agency/personnel`, 'GET', params);
    }

    async getUser(uuid: any): Promise<any> {
        return await this.request(`/users/${uuid}`, 'GET');
    }

    async createUser(params: object): Promise<any> {
        return await this.request(`/users`, 'POST', params);
    }

    async updateUser(params: object, uuid: any): Promise<any> {
        return await this.request(`/users/${uuid}`, 'PUT', params);
    }
}

export const userService = new UserService();