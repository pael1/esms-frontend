import BaseAPIService from "./BaseAPIService";

class StallService extends BaseAPIService {

    async getStalls(params: object): Promise<any> {
        return await this.request(`/stalls`, 'GET', params);
    }

    async addData(params: object): Promise<any> {
        return await this.request(`/stalls`, 'POST', params);
    }

    async getStallDetails(id: any): Promise<any> {
        return await this.request(`/stalls/${id}`, 'GET');
    }

    async updateStall(params: object, id: any): Promise<any> {
        return await this.request(`/stalls/${id}`, 'PUT', params);
    }
}

export const stallService = new StallService();