/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const tslib_1 = __webpack_require__(3);
const common_1 = __webpack_require__(4);
const drugs_module_1 = __webpack_require__(5);
const prisma_module_1 = __webpack_require__(13);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, drugs_module_1.DrugsModule],
    })
], AppModule);


/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DrugsModule = void 0;
const tslib_1 = __webpack_require__(3);
const common_1 = __webpack_require__(4);
const drugs_controller_1 = __webpack_require__(6);
const drugs_service_1 = __webpack_require__(7);
const prisma_module_1 = __webpack_require__(13);
let DrugsModule = class DrugsModule {
};
exports.DrugsModule = DrugsModule;
exports.DrugsModule = DrugsModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [drugs_controller_1.DrugsController],
        providers: [drugs_service_1.DrugsService],
    })
], DrugsModule);


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DrugsController = void 0;
const tslib_1 = __webpack_require__(3);
const common_1 = __webpack_require__(4);
const drugs_service_1 = __webpack_require__(7);
const get_drugs_query_dto_1 = __webpack_require__(10);
let DrugsController = class DrugsController {
    constructor(service) {
        this.service = service;
    }
    // GET /api/table-config - simple route provided here for convenience
    getTableConfig() {
        return this.service.getTableConfig();
    }
    // GET /api/drugs
    async findAll(query) {
        return this.service.findAll(query);
    }
};
exports.DrugsController = DrugsController;
tslib_1.__decorate([
    (0, common_1.Get)('/table-config'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], DrugsController.prototype, "getTableConfig", null);
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof get_drugs_query_dto_1.GetDrugsQueryDto !== "undefined" && get_drugs_query_dto_1.GetDrugsQueryDto) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], DrugsController.prototype, "findAll", null);
exports.DrugsController = DrugsController = tslib_1.__decorate([
    (0, common_1.Controller)('drugs'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof drugs_service_1.DrugsService !== "undefined" && drugs_service_1.DrugsService) === "function" ? _a : Object])
], DrugsController);


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DrugsService = void 0;
const tslib_1 = __webpack_require__(3);
const common_1 = __webpack_require__(4);
const prisma_service_1 = __webpack_require__(8);
let DrugsService = class DrugsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getTableConfig() {
        return {
            columns: [
                { key: 'id', label: 'Id', visible: true },
                { key: 'code', label: 'Code', visible: true },
                { key: 'name', label: 'Name', visible: true },
                { key: 'company', label: 'Company', visible: true },
                { key: 'launchDate', label: 'Launch Date', visible: true },
            ],
        };
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const skip = (page - 1) * limit;
        const where = {};
        // Search
        if (query.search) {
            const s = query.search.trim();
            where.OR = [
                { brandName: { contains: s, mode: 'insensitive' } },
                { genericName: { contains: s, mode: 'insensitive' } },
                { code: { contains: s, mode: 'insensitive' } },
            ];
        }
        // Company filter
        if (query.company) {
            where.company = {
                is: {
                    name: { equals: query.company, mode: 'insensitive' },
                },
            };
        }
        const [total, data, companies] = await Promise.all([
            this.prisma.drug.count({ where }),
            this.prisma.drug.findMany({
                where,
                orderBy: { launchDate: 'desc' },
                skip,
                take: limit,
                select: {
                    id: true,
                    code: true,
                    genericName: true,
                    brandName: true,
                    launchDate: true,
                    company: {
                        select: { name: true },
                    },
                },
            }),
            this.prisma.company.findMany({
                select: { name: true },
                orderBy: { name: 'asc' },
            }),
        ]);
        const companyList = companies.map(c => c.name);
        const mapped = data.map(d => ({
            id: d.id,
            code: d.code,
            name: `${d.genericName}${d.brandName ? ` (${d.brandName})` : ''}`,
            company: d.company?.name ?? null,
            launchDate: d.launchDate,
        }));
        return {
            data: mapped,
            companies: companyList,
            pagination: {
                page,
                limit,
                total,
            },
        };
    }
};
exports.DrugsService = DrugsService;
exports.DrugsService = DrugsService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], DrugsService);


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaService = void 0;
const tslib_1 = __webpack_require__(3);
const common_1 = __webpack_require__(4);
const client_1 = __webpack_require__(9);
let PrismaService = class PrismaService extends client_1.PrismaClient {
    async onModuleInit() {
        await this.$connect();
    }
    async enableShutdownHooks(app) {
        this.$on('beforeExit', async () => {
            await app.close();
        });
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], PrismaService);


/***/ }),
/* 9 */
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetDrugsQueryDto = void 0;
const tslib_1 = __webpack_require__(3);
const class_validator_1 = __webpack_require__(11);
const class_transformer_1 = __webpack_require__(12);
class GetDrugsQueryDto {
    constructor() {
        this.page = 1;
        this.limit = 20;
    }
}
exports.GetDrugsQueryDto = GetDrugsQueryDto;
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], GetDrugsQueryDto.prototype, "search", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], GetDrugsQueryDto.prototype, "company", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    tslib_1.__metadata("design:type", Number)
], GetDrugsQueryDto.prototype, "page", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    tslib_1.__metadata("design:type", Number)
], GetDrugsQueryDto.prototype, "limit", void 0);


/***/ }),
/* 11 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 12 */
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaModule = void 0;
const tslib_1 = __webpack_require__(3);
const common_1 = __webpack_require__(4);
const prisma_service_1 = __webpack_require__(8);
let PrismaModule = class PrismaModule {
};
exports.PrismaModule = PrismaModule;
exports.PrismaModule = PrismaModule = tslib_1.__decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [prisma_service_1.PrismaService],
        exports: [prisma_service_1.PrismaService],
    })
], PrismaModule);


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(1);
const app_module_1 = __webpack_require__(2);
const common_1 = __webpack_require__(4);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true }));
    await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
    console.log(`Server listening on http://localhost:${process.env.PORT ?? 3000}/api`);
}
bootstrap();

})();

/******/ })()
;
//# sourceMappingURL=main.js.map