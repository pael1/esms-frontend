import BaseAPIService from "./BaseAPIService";

class ParameterService extends BaseAPIService {

    async getSectionCodes(params: object): Promise<any> {
        return await this.request(`/parameters`, 'GET', params);
    }
    async getMarkets(params: object): Promise<any> {
        return await this.request(`/parameters`, 'GET', params);
    }
}

export const parameterService = new ParameterService();