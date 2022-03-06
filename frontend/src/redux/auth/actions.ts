import { IUser } from "./state"

export function loginSuccess(token: string, user: IUser) {
    return {
        type: "@@auth/LOGIN_SUCCESS" as const,
        token,
        user,
    }
}

export function loginFailed(message: string) {
    return {
        type: "@@auth/LOGIN_FAILED" as const,
        message,
    }
}

export function logout() {
    return {
        type: "@@auth/LOGOUT" as const,
    }
}

// export function registerSuccess(token: string, user: IUser) {
//     return {
//         type: "@@auth/REGISTER_SUCCESS" as const,
//         token,
//         user,
//     }
// }

// export function registerFailed(message: string) {
//     return {
//         type: "@@auth/REGISTER_FAILED" as const,
//         message,
//     }
// }


export type IAuthAction =
    | ReturnType<typeof loginSuccess>
    | ReturnType<typeof loginFailed>
    | ReturnType<typeof logout>
    // | ReturnType<typeof registerSuccess>
    // | ReturnType<typeof registerFailed>
