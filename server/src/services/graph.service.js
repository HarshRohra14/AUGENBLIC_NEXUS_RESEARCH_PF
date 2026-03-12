const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getProjectGraph(projectId) {
  const [insights, papers, experiments, insightLinks, paperLinks] = await Promise.all([
    prisma.insight.findMany({ where: { projectId } }),
    prisma.paper.findMany({ where: { projectId } }),
    prisma.experiment.findMany({ where: { projectId } }),
    prisma.insightLink.findMany({
      where: {
        OR: [
          { fromInsight: { projectId } },
          { toInsight: { projectId } },
        ],
      },
    }),
    prisma.insightPaperLink.findMany({
      where: {
        OR: [
          { insight: { projectId } },
          { paper: { projectId } },
        ],
      },
    }),
  ]);

  const nodes = [
    ...insights.map((i) => ({
      id: i.id,
      label: i.title,
      type: 'insight',
      data: { description: i.description },
    })),
    ...papers.map((p) => ({
      id: p.id,
      label: p.title,
      type: 'paper',
      data: { authors: p.authors, year: p.year, abstract: p.abstract },
    })),
    ...experiments.map((e) => ({
      id: e.id,
      label: e.name,
      type: 'experiment',
      data: { objective: e.objective, status: e.status },
    })),
  ];

  const edges = [
    ...insightLinks.map((l) => ({
      from: l.fromInsightId,
      to: l.toInsightId,
      label: l.relationshipType,
      strength: l.strength,
    })),
    ...paperLinks.map((l) => ({
      from: l.insightId,
      to: l.paperId,
      label: 'references',
      strength: 0.5,
    })),
  ];

  return { nodes, edges };
}

module.exports = { getProjectGraph };
