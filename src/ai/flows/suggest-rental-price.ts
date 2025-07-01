'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting rental prices for vehicles.
 *
 * - suggestRentalPrice - A function that uses AI to suggest a rental price.
 * - SuggestRentalPriceInput - The input type for the suggestRentalPrice function.
 * - SuggestRentalPriceOutput - The return type for the suggestRentalPrice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRentalPriceInputSchema = z.object({
  vehicleType: z.string().describe('The type of vehicle (e.g., car, truck, SUV).'),
  location: z.string().describe('The location where the vehicle is being rented.'),
  demand: z.string().describe('The current demand for rental vehicles in the area (e.g., low, medium, high).'),
});
export type SuggestRentalPriceInput = z.infer<typeof SuggestRentalPriceInputSchema>;

const SuggestRentalPriceOutputSchema = z.object({
  suggestedPrice: z.number().describe('The suggested rental price for the vehicle per day.'),
  reasoning: z.string().describe('The reasoning behind the suggested price.'),
});
export type SuggestRentalPriceOutput = z.infer<typeof SuggestRentalPriceOutputSchema>;

export async function suggestRentalPrice(input: SuggestRentalPriceInput): Promise<SuggestRentalPriceOutput> {
  return suggestRentalPriceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRentalPricePrompt',
  input: {schema: SuggestRentalPriceInputSchema},
  output: {schema: SuggestRentalPriceOutputSchema},
  prompt: `You are an expert in rental pricing strategies. Given the following information about a vehicle, suggest a fair and competitive daily rental price.

Vehicle Type: {{{vehicleType}}}
Location: {{{location}}}
Demand: {{{demand}}}

Consider factors such as vehicle type, location, and demand when determining the price. Provide a brief reasoning for your suggestion.

Format your output as a JSON object with "suggestedPrice" (as a number) and "reasoning" (as a string) fields.
`,
});

const suggestRentalPriceFlow = ai.defineFlow(
  {
    name: 'suggestRentalPriceFlow',
    inputSchema: SuggestRentalPriceInputSchema,
    outputSchema: SuggestRentalPriceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
