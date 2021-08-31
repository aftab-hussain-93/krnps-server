import { IsEmail, IsNotEmpty, IsDate } from 'class-validator';

export class CreateEventDto {
    @IsNotEmpty()
    title: string;
    description: string;
    @IsNotEmpty()
    fullAddress: string;
    @IsNotEmpty()
    city: string;
    @IsNotEmpty()
    state: string;
    @IsNotEmpty()
    country: string;
    @IsNotEmpty()
    eventDate: number; // UTC Epoch timestamp in milliseconds
    image: string;
}
