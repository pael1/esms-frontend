import BaseAPIService from "./BaseAPIService";

class UserService extends BaseAPIService {
    async getUsers(params: object): Promise<any> {
        return await this.request(`/users`, 'GET', params);
    }

    async getAwardees(params: object): Promise<any> {
        return await this.request(`/awardees`, 'GET', params);
    }

    async getOffices(): Promise<any> {
        return await this.request(`/users/data/offices`, 'GET');
    }

    async getUser(id: any): Promise<any> {
        return await this.request(`/users/${id}`, 'GET');
    }

    async createUser(params: object): Promise<any> {
        return await this.request(`/users`, 'POST', params);
    }

    async updateUser(params: object, id: any): Promise<any> {
        // return await this.request(`/users/${id}`, 'PUT', params);
        return await this.request(`/users/${id}`, 'PATCH', params);
    }
}

export const userService = new UserService();