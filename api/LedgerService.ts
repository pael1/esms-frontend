import BaseAPIService from "./BaseAPIService";

class LedgerService extends BaseAPIService {

    async getAll(params: object): Promise<any> {
        return await this.request(`/ledgers`, 'GET', params);
    }

    async getArrears(params: object): Promise<any> {
        return await this.request(`/ledgers/data/arrears`, 'GET', params);
    }
}

export const ledgerService = new LedgerService();