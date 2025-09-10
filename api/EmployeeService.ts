import BaseAPIService from "./BaseAPIService";

class EmployeeService extends BaseAPIService {
    
    async getEmployees(params: object): Promise<any> {
        return await this.request(`/employees`, 'GET', params);
    }

    async delete(id: any): Promise<any> {
        return await this.request(`/employees/${id}`, 'DELETE');
    }
}

export const employeeService = new EmployeeService();