export interface Employee {
    id: number;
    first_name: string;
    last_name: string;
    ssn: string;
    visa_type: string;
    cell_phone: string;
    email: string;
  }
  
  export interface EmployeesState {
    employees: Employee[]; 
    selectedEmployee: Employee | null;
    loading: boolean;
    error: string | null;
  }
  
  export const initialState: EmployeesState = {
    employees: [],
    selectedEmployee: null,
    loading: false,
    error: null,
  };
  