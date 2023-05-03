interface LogIn {
    type: 'LOGIN';
    userName: string;
}

interface LogOut{
    type: 'LOGOUT';
}

type Action = LogIn | LogOut

const loginReducer = (loggedUser: string, action: Action): string => {
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