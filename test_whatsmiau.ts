import 'dotenv/config';
import axios from 'axios';

const API_KEY = process.env.WHATSMIAU_API_KEY || '895f1ebb-762e-4c54-bf53-662ad5777c2b';
const INSTANCE_NAME = process.env.WHATSMIAU_INSTANCE_NAME || 'bruno-online';
const BASE_URL = process.env.WHATSMIAU_BASE_URL || 'https://api.whatsmiau.dev';
const TEST_NUMBER = '5517991983701'; // Número com código do país

const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'apikey': API_KEY, 'Content-Type': 'application/json' },
});

async function main() {
    console.log('🔧 Configuração:');
    console.log(`   BASE_URL: ${BASE_URL}`);
    console.log(`   INSTANCE: ${INSTANCE_NAME}`);
    console.log(`   API_KEY: ${API_KEY.substring(0, 8)}...`);
    console.log('');

    // 1. Verificar instância / listar instâncias
    console.log('📋 1. Listando instâncias...');
    try {
        const r = await api.get('/evolution/instances');
        console.log(`   ✅ Status: ${r.status}`);
        console.log(`   📦 Data:`, JSON.stringify(r.data, null, 2));
    } catch (e: any) {
        console.log(`   ❌ Erro: ${e?.response?.status}`);
        console.log(`   📦 Data:`, JSON.stringify(e?.response?.data, null, 2));
    }
    console.log('');

    // 2. Verificar status da conexão da instância
    console.log('🔌 2. Verificando status da conexão...');
    try {
        const r = await api.get(`/evolution/instance/connectionState/${INSTANCE_NAME}`);
        console.log(`   ✅ Status: ${r.status}`);
        console.log(`   📦 Data:`, JSON.stringify(r.data, null, 2));
    } catch (e: any) {
        console.log(`   ❌ Erro: ${e?.response?.status}`);
        console.log(`   📦 Data:`, JSON.stringify(e?.response?.data, null, 2));
    }
    console.log('');

    // 3. Enviar mensagem de teste
    console.log(`📤 3. Enviando mensagem de teste para ${TEST_NUMBER}...`);
    try {
        const r = await api.post(`/message/sendText/${INSTANCE_NAME}`, {
            number: TEST_NUMBER,
            options: {
                delay: 1200,
                presence: 'composing',
            },
            textMessage: {
                text: '🧪 Teste automático - Bruno Online API funcionando! ✅',
            },
        });
        console.log(`   ✅ Status: ${r.status}`);
        console.log(`   📦 Data:`, JSON.stringify(r.data, null, 2));
    } catch (e: any) {
        console.log(`   ❌ Erro: ${e?.response?.status}`);
        console.log(`   📦 Data:`, JSON.stringify(e?.response?.data, null, 2));
    }

    console.log('\n🏁 Teste finalizado!');
}

main();
