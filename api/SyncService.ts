import BaseAPIService from "./BaseAPIService";

class SyncService extends BaseAPIService {

    async addData(params: object): Promise<any> {
        return await this.request(`/sync`, 'POST', params);
    }

    async getArrearsSync(params: object): Promise<any> {
        return await this.request(`/sync/data/arrears`, 'GET', params);
    }
}

export const syncService = new SyncService();