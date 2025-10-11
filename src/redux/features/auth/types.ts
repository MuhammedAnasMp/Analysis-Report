export interface User {
  id: number;
  user_name: string;
  name: string;
  role: 'ADMIN' | 'USER' | string; 
  token: string | null;
}


export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  otherData: string | null;
  token: string | null;
}