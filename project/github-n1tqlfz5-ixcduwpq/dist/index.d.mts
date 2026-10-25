//#region src/index.d.ts
type StudentVueSoapCredentials = {
  baseUrl: string;
  userId: string;
  password: string;
};
type StudentVueSoapFetch = (url: string, args: {
  method: string;
  body: URLSearchParams;
  headers: Record<string, string>;
}) => Promise<Response>;
declare class StudentVueSoapError extends Error {
  readonly code: "http" | "malformed" | "service" | "auth" | "deprecated";
  constructor(message: string, code: "http" | "malformed" | "service" | "auth" | "deprecated");
}
declare function requestStudentVueSoapAtBase(credentials: StudentVueSoapCredentials, methodName: string, params: Record<string, string>, specificFetch?: StudentVueSoapFetch): Promise<Record<string, unknown>>;
declare const getStudentVueBase: (email: string) => string;
declare const _default: ({
  email,
  password
}: {
  email: string;
  password: string;
}, onInvalidAuth: () => never, methodName: string, params?: Record<string, string>, specificFetch?: (url: string, args: {
  method: string;
  body: URLSearchParams;
  headers: Record<string, string>;
}) => Promise<Response>) => Promise<Record<string, unknown>>;
//#endregion
export { StudentVueSoapCredentials, StudentVueSoapError, StudentVueSoapFetch, _default as default, getStudentVueBase, requestStudentVueSoapAtBase };