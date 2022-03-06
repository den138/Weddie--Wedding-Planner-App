export interface IUser {
  id: number,
  nickname: string,
  email: string,
  phone: string,
}

export interface ISignupUser {
  email: string,
  password: string,
  nickname: string,
  phone: string,
  gender: 'M' | 'F' | '',
  districtId: number | null,
};

export interface IAuthState {
    isAuthenticated: boolean | null,
    token: string | null,
    user: IUser | null,
    message: string | null,
  }
