import BaseAPIService from "./BaseAPIService";

class ParameterService extends BaseAPIService {

    async getParameter(params: object): Promise<any> {
        return await this.request(`/parameters`, 'GET', params);
    }
    async getMarkets(params: object): Promise<any> {
        return await this.request(`/parameters`, 'GET', params);
    }
    async getSubSection(params: object): Promise<any> {
        return await this.request(`/parameters/sub-section/list`, 'GET', params);
    }
}

export const parameterService = new ParameterService();