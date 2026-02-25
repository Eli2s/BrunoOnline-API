import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

// Listar serviços cadastrados
router.get('/', async (_req, res) => {
    try {
        const items = await prisma.serviceItem.findMany({
            orderBy: { name: 'asc' },
        });
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar serviços cadastrados' });
    }
});

// Buscar serviço por ID
router.get('/:id', async (req, res) => {
    try {
        const item = await prisma.serviceItem.findUnique({
            where: { id: Number(req.params.id) },
        });
        if (!item) return res.status(404).json({ error: 'Serviço não encontrado' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar serviço' });
    }
});

// Criar serviço
router.post('/', async (req, res) => {
    try {
        const item = await prisma.serviceItem.create({ data: req.body });
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar serviço' });
    }
});

// Atualizar serviço
router.put('/:id', async (req, res) => {
    try {
        const item = await prisma.serviceItem.update({
            where: { id: Number(req.params.id) },
            data: req.body,
        });
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar serviço' });
    }
});

// Deletar serviço
router.delete('/:id', async (req, res) => {
    try {
        await prisma.serviceItem.delete({ where: { id: Number(req.params.id) } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar serviço' });
    }
});

export default router;
