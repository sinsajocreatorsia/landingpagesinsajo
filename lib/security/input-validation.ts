/**
 * Centralized Zod schemas for API input validation.
 * Replaces manual validation scattered across routes.
 */

import { z } from 'zod'

// ============================================================
// Chat schemas
// ============================================================

export const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().max(4000),
})

export const toneConfigSchema = z.object({
  formality: z.enum(['casual', 'balanced', 'formal']).optional(),
  energy: z.enum(['calm', 'balanced', 'energetic']).optional(),
  detail: z.enum(['concise', 'balanced', 'detailed']).optional(),
  emoji: z.enum(['none', 'moderate', 'frequent']).optional(),
}).optional()

export const hannaChatInputSchema = z.object({
  message: z.string().min(1, 'El mensaje no puede estar vacio').max(4000),
  history: z.array(chatMessageSchema).max(50).optional().default([]),
  mode: z.enum(['workshop', 'saas']).optional(),
  sessionId: z.string().uuid().optional().nullable(),
  toneConfig: toneConfigSchema,
  workshopId: z.string().optional().nullable(),
  registrationId: z.string().optional().nullable(),
})

export const lisaChatInputSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(50),
  language: z.enum(['en', 'es']).optional().default('en'),
})

// ============================================================
// Coupon schemas
// ============================================================

export const couponValidateSchema = z.object({
  code: z.string()
    .min(1, 'Codigo de cupon requerido')
    .max(50)
    .regex(/^[A-Z0-9_-]+$/i, 'Formato de cupon invalido'),
  plan: z.enum(['free', 'pro', 'business']).optional().default('pro'),
})

export const couponRedeemSchema = z.object({
  code: z.string()
    .min(1, 'Codigo de cupon requerido')
    .max(50)
    .regex(/^[A-Z0-9_-]+$/i, 'Formato de cupon invalido'),
})

// ============================================================
// Admin schemas
// ============================================================

export const adminCreateUserSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string()
    .min(12, 'La password debe tener al menos 12 caracteres')
    .max(128, 'La password no puede exceder 128 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una letra mayuscula')
    .regex(/[a-z]/, 'Debe contener al menos una letra minuscula')
    .regex(/[0-9]/, 'Debe contener al menos un numero'),
  full_name: z.string().max(200).optional(),
  plan: z.enum(['free', 'pro']).optional().default('free'),
})

export const adminUpdateUserSchema = z.object({
  email: z.string().email('Email invalido').optional(),
  password: z.string()
    .min(12, 'La password debe tener al menos 12 caracteres')
    .max(128)
    .regex(/[A-Z]/, 'Debe contener al menos una letra mayuscula')
    .regex(/[a-z]/, 'Debe contener al menos una letra minuscula')
    .regex(/[0-9]/, 'Debe contener al menos un numero')
    .optional(),
  full_name: z.string().max(200).optional(),
  plan: z.enum(['free', 'pro']).optional(),
})

// ============================================================
// Workshop schemas
// ============================================================

export const workshopProfileSchema = z.object({
  businessName: z.string().max(200).optional(),
  businessType: z.string().max(200).optional(),
  yearsInBusiness: z.string()
    .transform((v) => parseInt(v))
    .refine((n) => !isNaN(n) && n >= 0 && n <= 100, 'Años invalidos')
    .optional(),
  challenges: z.array(z.string().max(200)).max(20).optional(),
  challengeOther: z.string().max(500)
    .regex(/^[^<>{}[\]]*$/, 'Caracteres no permitidos')
    .optional(),
  goals: z.string().max(1000).optional(),
})

// ============================================================
// Leads schema
// ============================================================

export const leadSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().max(50).optional(),
  message: z.string().max(2000).optional(),
  source: z.string().max(100).optional(),
})
