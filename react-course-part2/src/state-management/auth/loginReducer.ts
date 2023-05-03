interface LogIn {
    type: 'LOGIN';
    userName: string;
}

interface LogOut{
    type: 'LOGOUT';
}

export type AuthAction = LogIn | LogOut

const loginReducer = (loggedUser: string, action: AuthAction): string => {
    switch(action.type){
        case "LOGIN":
            return action.userName;
        case "LOGOUT":
            return ''
        default: 
            return loggedUser
    }
}

export default loginReducer;