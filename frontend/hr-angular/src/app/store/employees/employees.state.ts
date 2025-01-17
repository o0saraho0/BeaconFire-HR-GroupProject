export interface Employee {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  middle_name?: string; // Optional field
  preferred_name?: string; // Optional field
  current_address: {
    building: string;
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  cell_phone: string;
  work_phone?: string; // Optional field
  email: string;
  dob: Date;
  gender: string;
  ssn: string;
  visa_type: string;
  car_make?: string; // Optional field
  car_model?: string; // Optional field
  car_color?: string; // Optional field
  reference: {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    relationship: string;
  };
  emergency_contacts: Array<{
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    relationship: string;
  }>;
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
  