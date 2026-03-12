const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

// GET /api/experiments/project/:projectId
router.get('/project/:projectId', async (req, res, next) => {
  try {
    const project = await prisma.project.findFirst({
      where: { id: req.params.projectId, userId: req.user.id },
    });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const experiments = await prisma.experiment.findMany({
      where: { projectId: req.params.projectId },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { iterations: true } } },
    });

    res.json(experiments);
  } catch (err) {
    next(err);
  }
});

// POST /api/experiments/project/:projectId
router.post('/project/:projectId', async (req, res, next) => {
  try {
    const project = await prisma.project.findFirst({
      where: { id: req.params.projectId, userId: req.user.id },
    });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const { name, objective, methodology, status } = req.body;

    if (!name || !objective) {
      return res.status(400).json({ error: 'Name and objective are required' });
    }

    const experiment = await prisma.experiment.create({
      data: {
        name,
        objective,
        methodology: methodology || null,
        status: status || 'pending',
        projectId: req.params.projectId,
      },
    });

    res.status(201).json(experiment);
  } catch (err) {
    next(err);
  }
});

// PUT /api/experiments/:id
router.put('/:id', async (req, res, next) => {
  try {
    const experiment = await prisma.experiment.findUnique({
      where: { id: req.params.id },
      include: { project: true },
    });

    if (!experiment || experiment.project.userId !== req.user.id) {
      return res.status(404).json({ error: 'Experiment not found' });
    }

    const { name, objective, methodology, results, status } = req.body;

    const updated = await prisma.experiment.update({
      where: { id: req.params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(objective !== undefined && { objective }),
        ...(methodology !== undefined && { methodology }),
        ...(results !== undefined && { results }),
        ...(status !== undefined && { status }),
      },
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/experiments/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const experiment = await prisma.experiment.findUnique({
      where: { id: req.params.id },
      include: { project: true },
    });

    if (!experiment || experiment.project.userId !== req.user.id) {
      return res.status(404).json({ error: 'Experiment not found' });
    }

    await prisma.experiment.delete({ where: { id: req.params.id } });
    res.json({ message: 'Experiment deleted' });
  } catch (err) {
    next(err);
  }
});

// POST /api/experiments/:id/iterations
router.post('/:id/iterations', async (req, res, next) => {
  try {
    const experiment = await prisma.experiment.findUnique({
      where: { id: req.params.id },
      include: { project: true },
    });

    if (!experiment || experiment.project.userId !== req.user.id) {
      return res.status(404).json({ error: 'Experiment not found' });
    }

    const { notes, outcome } = req.body;

    if (!notes) {
      return res.status(400).json({ error: 'Notes are required' });
    }

    const iteration = await prisma.experimentIteration.create({
      data: {
        notes,
        outcome: outcome || null,
        experimentId: req.params.id,
      },
    });

    res.status(201).json(iteration);
  } catch (err) {
    next(err);
  }
});

// GET /api/experiments/:id/iterations
router.get('/:id/iterations', async (req, res, next) => {
  try {
    const experiment = await prisma.experiment.findUnique({
      where: { id: req.params.id },
      include: { project: true },
    });

    if (!experiment || experiment.project.userId !== req.user.id) {
      return res.status(404).json({ error: 'Experiment not found' });
    }

    const iterations = await prisma.experimentIteration.findMany({
      where: { experimentId: req.params.id },
      orderBy: { createdAt: 'desc' },
    });

    res.json(iterations);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
