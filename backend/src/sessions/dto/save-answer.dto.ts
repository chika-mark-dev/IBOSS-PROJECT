import { IsInt, Min } from 'class-validator';

export class SaveAnswerDto {
  @IsInt()
  @Min(0)
  selectedIndex!: number;
}
