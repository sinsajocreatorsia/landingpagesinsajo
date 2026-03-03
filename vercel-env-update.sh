#!/bin/bash
# Script para actualizar variables de entorno en Vercel

echo "Actualizando variables de entorno en Vercel..."

# Lisa API Key
vercel env add OPENROUTER_API_KEY_LISA production
# Pega: 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

vercel env add OPENROUTER_API_KEY_LISA preview  
# Pega: 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

# Workshop API Key
vercel env add OPENROUTER_API_KEY_WORKSHOP production
# Pega: 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

vercel env add OPENROUTER_API_KEY_WORKSHOP preview
# Pega: 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

# SaaS API Key
vercel env add OPENROUTER_API_KEY_SAAS production
# Pega: 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

vercel env add OPENROUTER_API_KEY_SAAS preview
# Pega: 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

echo "Variables de entorno actualizadas!"
