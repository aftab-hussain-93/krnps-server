import { IsNotEmpty } from 'class-validator';

export class CreatePersonalityDto {
    @IsNotEmpty()
    fullName: string;

    designation: string;
}

