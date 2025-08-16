import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {groq} from 'groq-sdk';
import {OpenAI} from 'openai';
import {Plugin} from 'genkit';

const groqPlugin = (apiKey: string): Plugin<any> => {
  const groqClient = new groq({ apiKey });
  return {
    name: 'groq',
    configure: (config) => {},
    model: (name: string) => ({
      name,
      async generate(input) {
        const response = await groqClient.chat.completions.create({
          messages: input.messages.map(m => ({role: m.role as any, content: m.content[0].text})),
          model: name,
        });
        return {
          candidates: response.choices.map(c => ({
            index: c.index,
            finish_reason: c.finish_reason as any,
            message: {
              role: 'model',
              content: [{ text: c.message.content || '' }],
            },
          })),
        };
      },
    }),
  };
};

const openAIPlugin = (apiKey: string): Plugin<any> => {
  const openaiClient = new OpenAI({ apiKey });
  return {
    name: 'openai',
    configure: (config) => {},
    model: (name: string) => ({
      name,
      async generate(input) {
        const response = await openaiClient.chat.completions.create({
          messages: input.messages.map(m => ({role: m.role as any, content: m.content[0].text})),
          model: name,
        });
        return {
          candidates: response.choices.map(c => ({
            index: c.index,
            finish_reason: c.finish_reason as any,
            message: {
              role: 'model',
              content: [{ text: c.message.content || '' }],
            },
          })),
        };
      },
    }),
  };
}

export const ai = genkit({
  plugins: [
    process.env.GROQ_API_KEY ? groqPlugin(process.env.GROQ_API_KEY) : undefined,
    process.env.OPENAI_API_KEY ? openAIPlugin(process.env.OPENAI_API_KEY) : undefined,
    googleAI(),
  ].filter(p => p) as Plugin<any>[],
  model: 'gemma-7b-it',
});
