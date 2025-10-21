import BaseAPIService from "./BaseAPIService";

class StallService extends BaseAPIService {

    async getStalls(params: object): Promise<any> {
        return await this.request(`/stalls`, 'GET', params);
    }

    //get stall using stallNoID
    async getStall(id: any): Promise<any> {
        return await this.request(`/stalls/${id}/description`, 'GET');
    }

    async addData(params: object): Promise<any> {
        return await this.request(`/stalls`, 'POST', params);
    }

    // get stall using id -- usage for editing/viewing stall details
    async getStallDetails(id: any): Promise<any> {
        return await this.request(`/stalls/${id}`, 'GET');
    }

    async updateStall(params: object, id: any): Promise<any> {
        // return await this.request(`/stalls/${id}`, 'PUT', params);
        return await this.request(`/stalls/${id}`, 'PATCH', params);
    }
}

export const stallService = new StallService();