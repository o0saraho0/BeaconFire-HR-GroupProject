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
  visa_start_date?: Date;
  visa_end_date?: Date;
  car_make?: string; 
  car_model?: string; 
  car_color?: string; 
  driver_licence_number?: string,
  driver_license_expire_date?: Date,
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
  profile_picture_url: string
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
  