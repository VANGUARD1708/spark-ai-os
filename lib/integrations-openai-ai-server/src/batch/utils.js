"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRateLimitError = isRateLimitError;
exports.batchProcess = batchProcess;
exports.batchProcessWithSSE = batchProcessWithSSE;
var p_limit_1 = require("p-limit");
var p_retry_1 = require("p-retry");
function isRateLimitError(error) {
    var errorMsg = error instanceof Error ? error.message : String(error);
    return (errorMsg.includes("429") ||
        errorMsg.includes("RATELIMIT_EXCEEDED") ||
        errorMsg.toLowerCase().includes("quota") ||
        errorMsg.toLowerCase().includes("rate limit"));
}
function batchProcess(items_1, processor_1) {
    return __awaiter(this, arguments, void 0, function (items, processor, options) {
        var _a, concurrency, _b, retries, _c, minTimeout, _d, maxTimeout, onProgress, limit, completed, promises;
        var _this = this;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_e) {
            _a = options.concurrency, concurrency = _a === void 0 ? 2 : _a, _b = options.retries, retries = _b === void 0 ? 7 : _b, _c = options.minTimeout, minTimeout = _c === void 0 ? 2000 : _c, _d = options.maxTimeout, maxTimeout = _d === void 0 ? 128000 : _d, onProgress = options.onProgress;
            limit = (0, p_limit_1.default)(concurrency);
            completed = 0;
            promises = items.map(function (item, index) {
                return limit(function () {
                    return (0, p_retry_1.default)(function () { return __awaiter(_this, void 0, void 0, function () {
                        var result, error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, processor(item, index)];
                                case 1:
                                    result = _a.sent();
                                    completed++;
                                    onProgress === null || onProgress === void 0 ? void 0 : onProgress(completed, items.length, item);
                                    return [2 /*return*/, result];
                                case 2:
                                    error_1 = _a.sent();
                                    if (isRateLimitError(error_1)) {
                                        throw error_1;
                                    }
                                    throw new p_retry_1.default.AbortError(error_1 instanceof Error ? error_1 : new Error(String(error_1)));
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); }, { retries: retries, minTimeout: minTimeout, maxTimeout: maxTimeout, factor: 2 });
                });
            });
            return [2 /*return*/, Promise.all(promises)];
        });
    });
}
function batchProcessWithSSE(items_1, processor_1, sendEvent_1) {
    return __awaiter(this, arguments, void 0, function (items, processor, sendEvent, options) {
        var _a, retries, _b, minTimeout, _c, maxTimeout, results, errors, _loop_1, index;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = options.retries, retries = _a === void 0 ? 5 : _a, _b = options.minTimeout, minTimeout = _b === void 0 ? 1000 : _b, _c = options.maxTimeout, maxTimeout = _c === void 0 ? 15000 : _c;
                    sendEvent({ type: "started", total: items.length });
                    results = [];
                    errors = 0;
                    _loop_1 = function (index) {
                        var item, result, error_2;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    item = items[index];
                                    sendEvent({ type: "processing", index: index, item: item });
                                    _e.label = 1;
                                case 1:
                                    _e.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, (0, p_retry_1.default)(function () { return processor(item, index); }, {
                                            retries: retries,
                                            minTimeout: minTimeout,
                                            maxTimeout: maxTimeout,
                                            factor: 2,
                                            onFailedAttempt: function (error) {
                                                if (!isRateLimitError(error)) {
                                                    throw new p_retry_1.default.AbortError(error instanceof Error ? error : new Error(String(error)));
                                                }
                                            },
                                        })];
                                case 2:
                                    result = _e.sent();
                                    results.push(result);
                                    sendEvent({ type: "progress", index: index, result: result });
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_2 = _e.sent();
                                    errors++;
                                    results.push(undefined);
                                    sendEvent({
                                        type: "progress",
                                        index: index,
                                        error: error_2 instanceof Error ? error_2.message : "Processing failed",
                                    });
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    };
                    index = 0;
                    _d.label = 1;
                case 1:
                    if (!(index < items.length)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1(index)];
                case 2:
                    _d.sent();
                    _d.label = 3;
                case 3:
                    index++;
                    return [3 /*break*/, 1];
                case 4:
                    sendEvent({ type: "complete", processed: items.length, errors: errors });
                    return [2 /*return*/, results];
            }
        });
    });
}
