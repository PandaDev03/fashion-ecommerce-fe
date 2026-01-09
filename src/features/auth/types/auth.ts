export interface ISignUp {
  email: string;
  name: string;
  password: string;
}

export type ISignIn = Pick<ISignUp, 'email' | 'password'>;

export interface ISignInWithGoogle {
  accessToken: string;
}

export interface IRequestPasswordReset {
  email: string;
}

export interface IResetPassword {
  token: string;
  newPassword: string;
}
