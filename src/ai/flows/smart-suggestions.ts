'use server';

/**
 * @fileOverview Smart suggestion and auto-completion AI agent.
 *
 * - getSmartSuggestion - A function that provides smart suggestions based on the input message.
 * - SmartSuggestionInput - The input type for the getSmartSuggestion function.
 * - SmartSuggestionOutput - The return type for the getSmartSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartSuggestionInputSchema = z.object({
  message: z.string().describe('The current message being typed by the user.'),
  context: z.string().optional().describe('Additional context about the conversation.'),
});
export type SmartSuggestionInput = z.infer<typeof SmartSuggestionInputSchema>;

const SmartSuggestionOutputSchema = z.object({
  suggestion: z.string().describe('The suggested auto-completion or next word(s).'),
});
export type SmartSuggestionOutput = z.infer<typeof SmartSuggestionOutputSchema>;

export async function getSmartSuggestion(input: SmartSuggestionInput): Promise<SmartSuggestionOutput> {
  return smartSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartSuggestionPrompt',
  input: {schema: SmartSuggestionInputSchema},
  output: {schema: SmartSuggestionOutputSchema},
  prompt: `You are a helpful assistant that provides smart suggestions and auto-completions for chat messages.

  Given the current message and context, suggest the most relevant auto-completion or next word(s) to help the user communicate more quickly and effectively.

  Current message: {{{message}}}
  Context: {{{context}}}

  Suggestion:`,
});

const smartSuggestionFlow = ai.defineFlow(
  {
    name: 'smartSuggestionFlow',
    inputSchema: SmartSuggestionInputSchema,
    outputSchema: SmartSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
