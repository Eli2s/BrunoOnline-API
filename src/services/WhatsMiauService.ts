import axios, { AxiosInstance } from 'axios';

class WhatsMiauService {
    private static instance: WhatsMiauService;
    private api: AxiosInstance;
    private apiKey: string;
    private instanceName: string;
    private instanceId: string; // ObjectID retornado por GET /evolution/instances

    private constructor() {
        this.apiKey = process.env.WHATSMIAU_API_KEY || '';
        this.instanceName = process.env.WHATSMIAU_INSTANCE_NAME || 'bruno-online_92679e64';
        this.instanceId = process.env.WHATSMIAU_INSTANCE_ID || '69a4b6e99cf22707df138d3d';
        const baseURL = process.env.WHATSMIAU_BASE_URL || 'https://api.whatsmiau.dev';

        if (!this.apiKey) {
            console.warn('⚠️ WHATSMIAU_API_KEY não está definida no ambiente.');
        }

        this.api = axios.create({
            baseURL,
            headers: {
                'apikey': this.apiKey,
                'Content-Type': 'application/json',
            },
        });
    }

    public static getInstance(): WhatsMiauService {
        if (!WhatsMiauService.instance) {
            WhatsMiauService.instance = new WhatsMiauService();
        }
        return WhatsMiauService.instance;
    }

    /**
     * Cria uma nova instância no WhatsMiau. Se qrcode for true, ela já estará pronta para leitura.
     */
    public async createInstance() {
        try {
            const response = await this.api.post('/evolution/instance/create', {
                instanceName: this.instanceName,
                qrcode: true,
                integration: 'WHATSAPP-BAILEYS',
            });
            console.info(`✅ Instância ${this.instanceName} criada com sucesso.`);
            return response.data;
        } catch (error: any) {
            console.error(`❌ Erro ao criar instância ${this.instanceName}:`, error?.response?.data || error.message);
            throw new Error(error?.response?.data?.response?.message || 'Erro ao criar instância no WhatsMiau');
        }
    }

    /**
     * Recupera o QR Code (base64) para conectar uma instância criada.
     */
    public async getQRCode() {
        try {
            // Conforme docs: connect usa ObjectID da instância
            const response = await this.api.get(`/evolution/instance/connect/${this.instanceId}`);
            return response.data;
        } catch (error: any) {
            console.error(`❌ Erro ao buscar QR Code da instância ${this.instanceId}:`, error?.response?.data || error.message);
            throw new Error('Erro ao buscar QR Code. Verifique se a instância existe e está desconectada.');
        }
    }

    /**
     * Deleta a instância do WhatsMiau (desconecta e apaga registros da API).
     */
    public async deleteInstance() {
        try {
            // Requisição DELETE para remover a instância completamente. Pode ser também logout
            const response = await this.api.delete(`/evolution/instance/delete/${this.instanceName}`);
            console.info(`✅ Instância ${this.instanceName} removida/deslogada com sucesso.`);
            return response.data;
        } catch (error: any) {
            console.warn(`Aviso ao deletar instância ${this.instanceName}, já pode ter sido deletada:`, error?.response?.data || error.message);
            return { success: true, message: 'Considerada deletada/deslogada' };
        }
    }

    /**
     * Envia uma mensagem de texto simples. Suporta emojis.
     */
    public async sendText(number: string, text: string, options?: { delay?: number }) {
        try {
            // Conforme docs: body é { number, text, delay } diretamente
            const response = await this.api.post(`/message/sendText/${this.instanceName}`, {
                number,
                text,
                delay: options?.delay || 1200,
            });
            console.info(`✅ Mensagem de texto enviada para ${number}`);
            return response.data;
        } catch (error: any) {
            console.error(`❌ Erro ao enviar mensagem de texto para ${number}:`, error?.response?.data || error.message);
            throw new Error('Erro ao enviar mensagem de texto');
        }
    }

    /**
     * Envia imagens ou vídeos via URL ou Base64.
     */
    public async sendMedia(number: string, mediaUrl: string, caption?: string, mediaType: 'image' | 'video' | 'document' = 'image') {
        try {
            // Conforme docs: body é { number, mediatype, media, caption } diretamente
            const response = await this.api.post(`/message/sendMedia/${this.instanceName}`, {
                number,
                mediatype: mediaType,
                media: mediaUrl,
                caption: caption || '',
            });
            console.info(`✅ Mídia enviada para ${number}`);
            return response.data;
        } catch (error: any) {
            console.error(`❌ Erro ao enviar mídia para ${number}:`, error?.response?.data || error.message);
            throw new Error('Erro ao enviar mídia');
        }
    }

    /**
     * Envia um arquivo de áudio como se fosse gravado na hora (Push-To-Talk).
     */
    public async sendAudio(number: string, audioUrl: string) {
        try {
            // Conforme docs: body é { number, audio } diretamente
            const response = await this.api.post(`/message/sendWhatsAppAudio/${this.instanceName}`, {
                number,
                audio: audioUrl,
            });
            console.info(`✅ Áudio enviado para ${number}`);
            return response.data;
        } catch (error: any) {
            console.error(`❌ Erro ao enviar áudio para ${number}:`, error?.response?.data || error.message);
            throw new Error('Erro ao enviar áudio');
        }
    }

    /**
     * Envia uma reação a uma mensagem.
     */
    public async sendReaction(number: string, reaction: string, messageId: string) {
        try {
            const response = await this.api.post(`/message/sendReaction/${this.instanceName}`, {
                number,
                reactionMessage: {
                    key: {
                        id: messageId,
                        fromMe: false, // ajustar conforme necessário ou parametrizar
                    },
                    reaction,
                },
            });
            return response.data;
        } catch (error: any) {
            console.error(`❌ Erro ao enviar reação para ${number}:`, error?.response?.data || error.message);
            throw new Error('Erro ao enviar reação');
        }
    }

    /**
     * Marca mensagens como lidas
     */
    public async markAsRead(remoteJid: string, messageIds: string[]) {
        try {
            const response = await this.api.post(`/chat/markMessageAsRead/${this.instanceName}`, {
                readMessages: messageIds.map(id => ({
                    remoteJid,
                    fromMe: false,
                    id
                }))
            });
            return response.data;
        } catch (error: any) {
            console.error(`❌ Erro ao marcar como lido para ${remoteJid}:`, error?.response?.data || error.message);
            throw new Error('Erro ao marcar como lido');
        }
    }
}

export default WhatsMiauService.getInstance();
