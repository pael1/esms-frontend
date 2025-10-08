import BaseAPIService from "./BaseAPIService";

class FileService extends BaseAPIService {
    
    async getFiles(params: object): Promise<any> {
        return await this.request(`/files`, 'GET', params);
    }

    async delete(id: any): Promise<any> {
        const formData = new FormData();
        formData.append('_method', 'DELETE');
        return await this.request(`/files/${id}`, 'POST', formData);
        // return await this.request(`/files/${id}`, 'DELETE');
    }
}

export const fileService = new FileService();