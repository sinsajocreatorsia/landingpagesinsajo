/**
 * AI Model Pricing Calculator
 * Calculates costs based on OpenRouter pricing (February 2026)
 */

export interface ModelPricing {
  input: number // USD per 1M tokens
  output: number // USD per 1M tokens
}

export interface CostCalculation {
  inputCost: number
  outputCost: number
  totalCost: number
}

// Pricing per 1M tokens (in USD)
export const MODEL_PRICING: Record<string, ModelPricing> = {
  // OpenAI Models
  'openai/gpt-4o-mini': {
    input: 0.15,
    output: 0.60,
  },
  'openai/gpt-4o': {
    input: 2.50,
    output: 10.00,
  },

  // Anthropic Models
  'anthropic/claude-3.5-sonnet': {
    input: 3.00,
    output: 15.00,
  },
  'anthropic/claude-3-opus': {
    input: 15.00,
    output: 75.00,
  },
  'anthropic/claude-3-haiku': {
    input: 0.25,
    output: 1.25,
  },

  // Google Models
  'google/gemini-pro': {
    input: 0.50,
    output: 1.50,
  },
  'google/gemini-pro-1.5': {
    input: 0.50,
    output: 1.50,
  },
}

/**
 * Calculate costs for a given model and token usage
 */
export function calculateCosts(
  model: string,
  inputTokens: number,
  outputTokens: number
): CostCalculation {
  // Default to GPT-4o-mini pricing if model not found
  const pricing = MODEL_PRICING[model] || MODEL_PRICING['openai/gpt-4o-mini']

  const inputCost = (inputTokens / 1_000_000) * pricing.input
  const outputCost = (outputTokens / 1_000_000) * pricing.output
  const totalCost = inputCost + outputCost

  return {
    inputCost: Math.round(inputCost * 1_000_000) / 1_000_000, // Round to 6 decimals
    outputCost: Math.round(outputCost * 1_000_000) / 1_000_000,
    totalCost: Math.round(totalCost * 1_000_000) / 1_000_000,
  }
}

/**
 * Get base monthly price for a plan
 */
export function getPlanPrice(plan: 'free' | 'pro'): number {
  return plan === 'pro' ? 19.99 : 0
}

/**
 * Calculate discount amount from coupon
 */
export function calculateDiscount(
  basePrice: number,
  discountType: 'percentage' | 'fixed',
  discountValue: number
): number {
  if (discountType === 'percentage') {
    return (basePrice * discountValue) / 100
  } else {
    return Math.min(discountValue, basePrice) // Can't discount more than the price
  }
}

/**
 * Calculate final price after discount
 */
export function calculateFinalPrice(
  basePrice: number,
  discountType: 'percentage' | 'fixed',
  discountValue: number
): number {
  const discount = calculateDiscount(basePrice, discountType, discountValue)
  return Math.max(0, basePrice - discount) // Price can't be negative
}
