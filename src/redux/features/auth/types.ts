export interface User {
  id: number;
  user_name: string;
  name: string;
  role:  string; 
  token: string | null;
  profile_image : string;
  first_name :string;
  last_name :string;
  department : string;
}


export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  otherData: string | null;
  token: string | null;
}