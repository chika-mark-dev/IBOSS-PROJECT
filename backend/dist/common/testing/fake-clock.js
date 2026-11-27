"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeClock = void 0;
const common_service_1 = require("../common.service");
class FakeClock extends common_service_1.CommonService {
    current;
    constructor(current) {
        super();
        this.current = current;
    }
    now() {
        return new Date(this.current.getTime());
    }
    set(date) {
        this.current = date;
    }
    advanceSeconds(seconds) {
        this.current = new Date(this.current.getTime() + seconds * 1000);
    }
}
exports.FakeClock = FakeClock;
//# sourceMappingURL=fake-clock.js.map