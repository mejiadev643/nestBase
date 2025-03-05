import { IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';


export class SubtaskDto {

    @IsInt()
    @IsNotEmpty()
    taskId: number;

    @IsString()
    @IsNotEmpty()
    subtaskName: string;

    @IsOptional()
    isCompleted: boolean = false;

    @IsOptional()
    assignedTo: number;

    @IsString()
    @IsOptional()
    description: string;

    @IsInt()
    @IsOptional()
    priorityId: number;

    @IsOptional()
    @IsInt()
    taskStatusId: number;

    // @IsOptional()
    // taskComments: string;

}