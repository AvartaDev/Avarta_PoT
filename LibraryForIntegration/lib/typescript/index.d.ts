declare type RnsolusType = {
    // multiply(a: number, b: number): Promise<number>;
    onCreate(PrivateKey:string,PublicKey:string,Url:string,OrganizationKey:string);
    EnrollProcess(Username:string,Password:string);
    AuthenticationProcess(Username:string,Password:string);
    DeEnrollProcess(Username:string,Password:string);
};
declare const _default: RnsolusType;
export default _default;
