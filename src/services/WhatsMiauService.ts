import axios, { AxiosInstance } from 'axios';

class WhatsMiauService {
    private static instance: WhatsMiauService;
    private api: AxiosInstance;
    private apiKey: string;
    private instanceName: string;

    private constructor() {
        this.apiKey = process.env.WHATSMIAU_API_KEY || '';
        this.instanceName = process.env.WHATSMIAU_INSTANCE_NAME || 'bruno-online';
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
            const response = await this.api.get(`/evolution/instance/connect/${this.instanceName}`);
            return response.data;
        } catch (error: any) {
            console.error(`❌ Erro ao buscar QR Code da instância ${this.instanceName}:`, error?.response?.data || error.message);
            throw new Error('Erro ao buscar QR Code. Verifique se a instância existe e está desconectada.');
        }
    }

    /**
     * Envia uma mensagem de texto simples. Suporta emojis.
     */
    public async sendText(number: string, text: string, options?: { delay?: number; presence?: string }) {
        try {
            const response = await this.api.post(`/message/sendText/${this.instanceName}`, {
                number,
                options: {
                    delay: options?.delay || 1200,
                    presence: options?.presence || 'composing',
                },
                textMessage: {
                    text,
                },
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
    public async sendMedia(number: string, mediaUrl: string, caption?: string, mediaType: 'image' | 'video' = 'image') {
        try {
            const response = await this.api.post(`/message/sendMedia/${this.instanceName}`, {
                number,
                mediaMessage: {
                    mediatype: mediaType,
                    caption: caption || '',
                    media: mediaUrl,
                },
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
            const response = await this.api.post(`/message/sendWhatsAppAudio/${this.instanceName}`, {
                number,
                audioMessage: {
                    audio: audioUrl,
                },
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
