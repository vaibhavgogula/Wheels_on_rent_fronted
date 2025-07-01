'use server';

import { suggestRentalPrice, type SuggestRentalPriceInput, type SuggestRentalPriceOutput } from '@/ai/flows/suggest-rental-price';

type ActionResponse = 
  | { success: true; data: SuggestRentalPriceOutput }
  | { success: false; error: string };

export async function suggestRentalPriceAction(input: SuggestRentalPriceInput): Promise<ActionResponse> {
  try {
    const result = await suggestRentalPrice(input);
    return { success: true, data: result };
  } catch (e) {
    console.error(e);
    // In a real app, you might want to log this error to a service
    return { success: false, error: 'An unexpected error occurred while contacting the AI. Please try again later.' };
  }
}
