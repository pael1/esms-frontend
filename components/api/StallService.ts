import BaseAPIService from "./BaseAPIService";

class StallService extends BaseAPIService {

    async getStalls(params: object): Promise<any> {
        return await this.request(`/stalls`, 'GET', params);
    }

    async addData(params: object): Promise<any> {
        return await this.request(`/stalls`, 'POST', params);
    }
}

export const stallService = new StallService();