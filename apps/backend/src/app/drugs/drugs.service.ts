import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetDrugsQueryDto } from './dto/get-drugs-query.dto';

@Injectable()
export class DrugsService {
    constructor(private prisma: PrismaService) { }

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

    async findAll(query: GetDrugsQueryDto) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const skip = (page - 1) * limit;

        const where: any = {};

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
}
