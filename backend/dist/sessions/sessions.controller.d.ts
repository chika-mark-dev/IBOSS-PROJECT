import { SaveAnswerDto } from './dto/save-answer.dto';
import { SessionsService } from './sessions.service';
export declare class SessionsController {
    private readonly sessionsService;
    constructor(sessionsService: SessionsService);
    start(examId: string, userId: string): Promise<import("./dto/session-response.dto").SessionResponseDto>;
    getOne(sessionId: string, userId: string): Promise<import("./dto/session-response.dto").SessionResponseDto>;
    saveAnswer(sessionId: string, questionId: string, userId: string, dto: SaveAnswerDto): Promise<import("./dto/save-answer-response.dto").SaveAnswerResponseDto>;
    submit(sessionId: string, userId: string): Promise<import("./dto/result-response.dto").ResultResponseDto>;
    result(sessionId: string, userId: string): Promise<import("./dto/result-response.dto").ResultResponseDto>;
}
