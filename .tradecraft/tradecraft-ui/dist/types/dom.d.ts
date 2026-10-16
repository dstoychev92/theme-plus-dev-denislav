export type LowerCaseFormMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';
export type UpperCaseFormMethod = Uppercase<LowerCaseFormMethod>;
export type FormMethod = UpperCaseFormMethod;
