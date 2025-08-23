import BaseAPIService from "./BaseAPIService";

class OpService extends BaseAPIService {

    async getItems(params: object): Promise<any> {
        return await this.request(`/ops`, 'GET', params);
    }
}

export const opService = new OpService();