import express from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API endpoint for Daily Devotional / Verse Insight
app.post('/api/devotional', async (req, res) => {
  try {
    const { reference, version, topic } = req.body;
    const prompt = `Gere um devocionante cristão profundo, inspirador e acolhedor baseado em ${reference || 'Mateus 5:1-12'} (versão ${version || 'NVI'}), com foco em "${topic || 'Alegria no Reino'}". 
    Retorne estritamente um JSON com a seguinte estrutura:
    {
      "title": "Título do Devocional",
      "verseText": "Texto completo do versículo na versão solicitada",
      "reflection": "Parágrafo reflexivo e edificante (cerca de 150 palavras)",
      "application": "Dica prática para o dia a dia",
      "prayer": "Oração curta e sincera"
    }`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || '{}';
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error('Error generating devotional:', error);
    res.status(500).json({ error: error.message || 'Erro ao gerar devocional' });
  }
});

// API endpoint for Ask Bible / Verse Commentary
app.post('/api/ask-bible', async (req, res) => {
  try {
    const { question, context } = req.body;
    const prompt = `Você é um teólogo e conselheiro bíblico experiente e acolhedor. Responda à seguinte pergunta sobre a Bíblia de forma clara, fundamentada nas Escrituras, respeitosa e edificante.
    Contexto da leitura atual: ${context || 'Geral'}
    Pergunta: ${question}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Você é um assistente teológico acolhedor e profundo para o aplicativo Bíblia Multiversões.',
      }
    });

    res.json({ answer: response.text || 'Não foi possível gerar a resposta no momento.' });
  } catch (error: any) {
    console.error('Error in ask-bible:', error);
    res.status(500).json({ error: error.message || 'Erro ao consultar assistente' });
  }
});

// Vite middleware for development or static serving for production
async function setupVite() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }
}

const PORT = Number(process.env.PORT) || 3000;
setupVite().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
});
