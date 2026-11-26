import { Test, TestingModule } from '@nestjs/testing';
import { TokensService } from './tokens.service';
import assert from 'node:assert/strict';
import { describe, beforeEach, it } from 'node:test';

describe('TokensService', () => {
  let service: TokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokensService],
    }).compile();

    service = module.get<TokensService>(TokensService);
  });

  it('should be defined', () => {
    assert.ok(service);
  });
});
