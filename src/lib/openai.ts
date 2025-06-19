import OpenAI from 'openai';
import { Message } from '../types/chat';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('VITE_OPENAI_API_KEY environment variable is not set. Please add it to your .env file.');
}

const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true
});

export const sendMessage = async (messages: Message[]): Promise<string> => {
  try {
    console.log('Sending messages to OpenAI:', messages);
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      max_tokens: 1000,
      temperature: 0.7,
    });

    console.log('OpenAI response:', completion);
    
    return completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to get response from AI assistant');
  }
};
