import { Question } from '../entities/question.entity';

export class StudentQuestionDto {
  id!: string;
  text!: string;
  options!: string[];

  static from(question: Question): StudentQuestionDto {
    const dto = new StudentQuestionDto();
    dto.id = question.id;
    dto.text = question.text;
    dto.options = [...question.options];
    return dto;
  }
}
