import BaseAPIService from "./BaseAPIService";

class EmployeeService extends BaseAPIService {
    
    async getEmployees(params: object): Promise<any> {
        return await this.request(`/employees`, 'GET', params);
    }

    async delete(id: any): Promise<any> {
        const formData = new FormData();
        formData.append('_method', 'DELETE');
        return await this.request(`/employees/${id}`, 'POST', formData);
        // return await this.request(`/employees/${id}`, 'DELETE');
    }
}

export const employeeService = new EmployeeService();