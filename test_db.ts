import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    const results: any = {};

    try {
        results.clients = await prisma.client.count();
        results.services = await prisma.service.count();
        results.products = await prisma.product.count();
        results.plans = await prisma.plan.count();
        results.orders = await prisma.order.count();
        results.barbers = await prisma.barber.count();
        results.serviceItems = await prisma.serviceItem.count();
        results.templates = await prisma.messageTemplate.count();
        results.settings = await prisma.appSettings.count();
        results.cashbacks = await prisma.cashback.count();
        results.whatsmiauMessages = await prisma.whatsmiauMessage.count();
        results.ok = true;
    } catch (e: any) {
        results.ok = false;
        results.error = e.message;
    }

    fs.writeFileSync('db_test.json', JSON.stringify(results, null, 2), 'utf-8');
    await prisma.$disconnect();
}

main();
