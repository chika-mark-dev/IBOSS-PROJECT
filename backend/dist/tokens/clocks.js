"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemClock = exports.CLOCK = void 0;
exports.CLOCK = 'CLOCK';
class SystemClock {
    now() {
        return new Date();
    }
}
exports.SystemClock = SystemClock;
//# sourceMappingURL=clocks.js.map