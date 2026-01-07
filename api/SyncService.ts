import BaseAPIService from "./BaseAPIService";

class SyncService extends BaseAPIService {

    async getAllSync(params: object): Promise<any> {
        return await this.request(`/sync`, 'GET', params);
    }

    async addData(params: object): Promise<any> {
        return await this.request(`/sync`, 'POST', params);
    }

    async delete(id: any): Promise<any> {
        // const formData = new FormData();
        // formData.append('_method', 'DELETE');
        // return await this.request(`/childrens/${id}`, 'POST', formData);
        return await this.request(`/sync/${id}`, 'DELETE');
    }

    async getArrearsSync(params: object): Promise<any> {
        return await this.request(`/sync/data/arrears`, 'GET', params);
    }

    async paidManually(id: any): Promise<any> {
        return await this.request(`/sync/${id}/paid-manually`, 'POST');
    }
}

export const syncService = new SyncService();