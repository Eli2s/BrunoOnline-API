import { Router } from 'express';
import whatsMiauService from '../services/WhatsMiauService';

const router = Router();

// Middleware simples para proteger a rota admin (pode ser ajustado conforme a autenticação da aplicação)
const adminAuth = (req: any, res: any, next: any) => {
    // const authHeader = req.headers.authorization;
    // Aqui você pode inserir sua lógica de validação de token ou admin
    // if (!authHeader) return res.status(401).json({ error: 'Não autorizado' });
    next();
};

router.use(adminAuth);

router.get('/qrcode', async (req, res) => {
    try {
        const qrCodeData = await whatsMiauService.getQRCode();
        res.json(qrCodeData);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Erro ao obter QR Code' });
    }
});

router.post('/create-instance', async (req, res) => {
    try {
        const instanceData = await whatsMiauService.createInstance();
        res.status(201).json(instanceData);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Erro ao criar instância' });
    }
});

export default router;
