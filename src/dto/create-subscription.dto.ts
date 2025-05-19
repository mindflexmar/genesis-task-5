import { IsEmail, IsEnum, IsString } from "class-validator";
import { Frequency } from "src/enums/frequency.enum";

export class CreateSubscriptionDto {
    @IsEmail()    
    email: string;

    @IsEnum(Frequency)
    frequency: string;

    @IsString()
    city: string;
}