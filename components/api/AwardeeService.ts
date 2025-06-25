import BaseAPIService from "./BaseAPIService";

class AwardeeService extends BaseAPIService {

    async getAwardees(params: object): Promise<any> {
        return await this.request(`/awardees`, 'GET', params);
    }

    async getAwardeeProfile(id: any): Promise<any> {
        return await this.request(`/awardees/${id}`, 'GET');
    }

    async generateCurrentOP(params: any): Promise<any> {
        return await this.request(`/awardees/generate/current-bill`, 'GET', params);
    }

    async getAwardeeProfileLedger(params: object): Promise<any> {
        return await this.request(`/ledgers/`, 'GET', params);
    }

    async getAwardeeChildrens(params: object): Promise<any> {
        return await this.request(`/childrens/`, 'GET', params);
    }

    async getAwardeeTransactions(params: object): Promise<any> {
        return await this.request(`/awardees/transactions/${params.ownerId}`, 'GET', params);
    }

    async getAwardeeFiles(params: object): Promise<any> {
        return await this.request(`/awardees/files/${params.ownerId}`, 'GET', params);
    }

    async getAwardeeEmployeesData(params: object): Promise<any> {
        return await this.request(`/awardees/employees-data/${params.ownerId}`, 'GET', params);
    }

    async createUser(params: object): Promise<any> {
        return await this.request(`/users`, 'POST', params);
    }

    async updateUser(params: object, uuid: any): Promise<any> {
        return await this.request(`/users/${uuid}`, 'PUT', params);
    }
}

export const awardeeService = new AwardeeService();