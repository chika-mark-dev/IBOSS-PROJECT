import { Repository } from 'typeorm';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Exam } from './entities/exams.entity';
export declare class ExamsService {
    private readonly exams;
    constructor(exams: Repository<Exam>);
    create(dto: CreateExamDto): Promise<Exam>;
    findReleased(): Promise<Exam[]>;
    findById(id: string): Promise<Exam>;
    update(id: string, dto: UpdateExamDto): Promise<Exam>;
    remove(id: string): Promise<void>;
    release(id: string): Promise<Exam>;
    lock(id: string): Promise<void>;
    findAll(): Promise<Exam[]>;
    private assertEditable;
}
