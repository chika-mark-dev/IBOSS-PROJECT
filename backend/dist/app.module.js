"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const exams_module_1 = require("./exams/exams.module");
const questions_module_1 = require("./questions/questions.module");
const sessions_module_1 = require("./sessions/sessions.module");
const grading_module_1 = require("./grading/grading.module");
const timer_module_1 = require("./timer/timer.module");
const common_module_1 = require("./common/common.module");
const tokens_module_1 = require("./tokens/tokens.module");
const typeorm_naming_strategies_1 = require("typeorm-naming-strategies");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'postgres',
                    url: config.getOrThrow(process.env.NODE_ENV === 'test'
                        ? 'DATABASE_URL_TEST'
                        : 'DATABASE_URL'),
                    ssl: true,
                    autoLoadEntities: true,
                    synchronize: config.get('DB_SYNC') === 'true',
                    namingStrategy: new typeorm_naming_strategies_1.SnakeNamingStrategy(),
                    retryAttempts: 5,
                    retryDelay: 3000,
                    extra: { connectionTimeoutMillis: 15000 },
                }),
            }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            exams_module_1.ExamsModule,
            questions_module_1.QuestionsModule,
            sessions_module_1.SessionsModule,
            grading_module_1.GradingModule,
            timer_module_1.TimerModule,
            common_module_1.CommonModule,
            tokens_module_1.TokensModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map