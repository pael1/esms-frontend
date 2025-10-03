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
        // return await this.request(`/stalls/${id}`, 'PUT', params);
        const form = new FormData()
        for (const [key, value] of Object.entries(params)) {
            form.append(key, value as any)
        }
        form.append('_method', 'PUT')
        return await this.request(`/stalls/${id}`, 'POST', form)
    }
}

export const stallService = new StallService();