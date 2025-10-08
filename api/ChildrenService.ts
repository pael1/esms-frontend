import BaseAPIService from "./BaseAPIService";

class ChildrenService extends BaseAPIService {
    
    async getAwardeeChildrens(params: object): Promise<any> {
        return await this.request(`/childrens`, 'GET', params);
    }

    async delete(id: any): Promise<any> {
        const formData = new FormData();
        formData.append('_method', 'DELETE');
        return await this.request(`/childrens/${id}`, 'POST', formData);
        // return await this.request(`/childrens/${id}`, 'DELETE');
    }
}

export const childrenService = new ChildrenService();