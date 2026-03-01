import 'dotenv/config';
import axios from 'axios';
import * as fs from 'fs';

const API_KEY = process.env.WHATSMIAU_API_KEY || '895f1ebb-762e-4c54-bf53-662ad5777c2b';
const INSTANCE_NAME = process.env.WHATSMIAU_INSTANCE_NAME || 'bruno-online_92679e64';
const BASE_URL = process.env.WHATSMIAU_BASE_URL || 'https://api.whatsmiau.dev';
const TEST_NUMBER = '5517991983701';

const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'apikey': API_KEY, 'Content-Type': 'application/json' },
});

async function main() {
    const results: any = { config: { BASE_URL, INSTANCE_NAME }, steps: {} };

    // 1. Conectar / pegar QR Code
    try {
        const r = await api.get(`/evolution/instance/connect/${INSTANCE_NAME}`);
        results.steps.connect = { ok: true, status: r.status, data: r.data };
    } catch (e: any) {
        results.steps.connect = { ok: false, status: e?.response?.status, data: e?.response?.data };
    }

    // 2. Verificar status
    try {
        const r = await api.get(`/evolution/instance/connectionState/${INSTANCE_NAME}`);
        results.steps.connectionState = { ok: true, status: r.status, data: r.data };
    } catch (e: any) {
        results.steps.connectionState = { ok: false, status: e?.response?.status, data: e?.response?.data };
    }

    // 3. Tentar enviar mensagem
    try {
        const r = await api.post(`/message/sendText/${INSTANCE_NAME}`, {
            number: TEST_NUMBER,
            options: { delay: 1200, presence: 'composing' },
            textMessage: { text: 'Teste automatico - Bruno Online API funcionando!' },
        });
        results.steps.sendMessage = { ok: true, status: r.status, data: r.data };
    } catch (e: any) {
        results.steps.sendMessage = { ok: false, status: e?.response?.status, data: e?.response?.data };
    }

    fs.writeFileSync('test_result.json', JSON.stringify(results, null, 2), 'utf-8');
}

main();
