import { Question } from '../entities/question.entity';

export class AdminQuestionDto {
  id!: string;
  examId!: string;
  text!: string;
  options!: string[];
  correctIndex!: number;
  position!: number;

  static from(question: Question): AdminQuestionDto {
    const dto = new AdminQuestionDto();
    dto.id = question.id;
    dto.examId = question.examId;
    dto.text = question.text;
    dto.options = [...question.options];
    dto.correctIndex = question.correctIndex;
    dto.position = question.position;
    return dto;
  }
}
