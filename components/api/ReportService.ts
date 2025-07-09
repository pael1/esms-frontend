import BaseAPIService from "./BaseAPIService";

class ReportService extends BaseAPIService {

    async masterlist(params: object): Promise<any> {
        return await this.request(`/reports`, 'GET', params);
    }
    async masterlist_print(params: object): Promise<any> {
        return await this.request(`/reports/print/masterlist`, 'GET', params);
    }
}

export const reportService = new ReportService();