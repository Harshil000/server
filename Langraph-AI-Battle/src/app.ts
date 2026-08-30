import express from 'express';
import useGraph from "./services/graph.ai.service.js"

const app = express();

app.get('/health', (_req: any, res: any) => {
  res.status(200).json({ status: 'Ok' });
});

app.post("/use-graph", async (_req: any, res: any) => {
  const graphResponse = await useGraph("write me factorial function in javascript")
  res.status(200).json({
    data: graphResponse
  })
})

export default app;
