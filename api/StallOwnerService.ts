import BaseAPIService from "./BaseAPIService";

class StallOwnerService extends BaseAPIService {

    async getOwners(params: object): Promise<any> {
        return await this.request(`/stallowner`, 'GET', params);
    }

    async create(params: object): Promise<any> {
        return await this.request(`/stallowner`, 'POST', params);
    }

    async update(params: object, id: any): Promise<any> {
        
        // If params is FormData, adjust headers + method override
        if (params instanceof FormData) {
            params.append('_method', 'PUT') // Laravel will treat it as PUT
            return await this.request(`/stallowner/${id}`, 'POST', params)
        }

        // Otherwise, send JSON normally
        return await this.request(`/stallowner/${id}`, 'PUT', params)
    }

    async getOwner(id: any, rentalId: any): Promise<any> {
        return await this.request(`/stallowner/${id}/details/${rentalId}`, 'GET');
    }
}

export const stallOwnerService = new StallOwnerService();