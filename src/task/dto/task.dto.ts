import { IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';


export class TaskDto{

    // @IsInt()
    // @IsNotEmpty()
    // userId: number;
    
    @IsInt()
    @IsNotEmpty()
    projectId: number;

    @IsInt()
    @IsOptional()
    priorityId: number;

    @IsString()
    @IsNotEmpty()
    taskName: string;

    @IsString()
    @IsOptional()
    taskDescription: string;

    @IsOptional()
    taskStartDate: Date;

    @IsOptional()
    taskEndDate: Date;

    @IsOptional()
    taskComments: string;

    @IsOptional()
    @IsInt()
    taskStatusId: number;

}