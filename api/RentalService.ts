import BaseAPIService from "./BaseAPIService";

class RentalService extends BaseAPIService {

    async getRental(params: object): Promise<any> {
        return await this.request(`/rentals`, 'GET', params);
    }

    async addData(params: object): Promise<any> {
        return await this.request(`/rentals`, 'POST', params);
    }

    async getRentalDetails(id: any): Promise<any> {
        return await this.request(`/rentals/${id}`, 'GET');
    }

    async updateRental(params: object, id: any): Promise<any> {
        return await this.request(`/rentals/${id}`, 'PUT', params);
        // return await this.request(`/rentals/${id}`, 'PATCH', params);
    }

    //cancel rental
    async cancelRental(id: any): Promise<any> {
        return await this.request(`/rentals/cancel/${id}`, 'PUT');
        // return await this.request(`/rentals/cancel/${id}`, 'PATCH');
    }
}

export const rentalService = new RentalService();