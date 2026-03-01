import 'dotenv/config';
import axios from 'axios';
import * as fs from 'fs';

const API_KEY = '895f1ebb-762e-4c54-bf53-662ad5777c2b';
const INSTANCE_NAME = 'bruno-online_92679e64';
const BASE_URL = 'https://api.whatsmiau.dev';
const TEST_NUMBER = '5517991983701';

const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'apikey': API_KEY, 'Content-Type': 'application/json' },
});

async function main() {
    const results: any = { steps: {} };

    // 1. Verificar status da conexao
    try {
        const r = await api.get('/evolution/instances');
        const inst = r.data?.find((i: any) => i.whatsmiau_instance_id === INSTANCE_NAME);
        results.steps.status = { ok: true, instanceStatus: inst?.status || 'NOT_FOUND', data: inst };
    } catch (e: any) {
        results.steps.status = { ok: false, error: e?.response?.data };
    }

    // 2. Enviar mensagem de teste
    try {
        const r = await api.post(`/message/sendText/${INSTANCE_NAME}`, {
            number: TEST_NUMBER,
            text: 'Teste automatico - Bruno Online API funcionando!',
            delay: 1200,
        });
        results.steps.sendText = { ok: true, status: r.status, data: r.data };
    } catch (e: any) {
        results.steps.sendText = { ok: false, status: e?.response?.status, data: e?.response?.data };
    }

    fs.writeFileSync('test_result.json', JSON.stringify(results, null, 2), 'utf-8');
}

main();
