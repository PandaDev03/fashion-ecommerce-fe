export interface ISignUp {
  email: string;
  name: string;
  password: string;
}

export type ISignIn = Pick<ISignUp, 'email' | 'password'>;

export interface ISignInWithGoogle {
  accessToken: string;
}
