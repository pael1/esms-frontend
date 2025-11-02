import BaseAPIService from "./BaseAPIService";

class DashboardService extends BaseAPIService {
    
    async getRevenue(params: object): Promise<any> {
        return await this.request(`/dashboard/total`, 'GET', params);
    }
}

export const dashboardService = new DashboardService();