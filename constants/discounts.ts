export const VALID_DISCOUNT_CODES: Record<string, { amount: number, expiresAt: string }> = {
    '2025D': {
      amount: 5,
      expiresAt: '2025-12-31'
    }
  }

export const validateVoucherCode = (code: string) => {
  if (!code) return true
  const upperCode = code.toUpperCase()
  const discountData = VALID_DISCOUNT_CODES[upperCode]
  
  if (!discountData) return false
  if (new Date(discountData.expiresAt) < new Date()) return false
  
  return true
}