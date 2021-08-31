type userTypeStatus = 'email' | 'google' | 'facebook' | 'phone';

export class CreateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isAdmin: boolean;
    userType: userTypeStatus
}


export class UserDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isAdmin: boolean;
    userType: userTypeStatus;
    createdBy: string;
}

export class LoginUserDto {
    isAdmin: boolean;
    id: number;
}
