export const VALID_DISCOUNT_CODES: Record<string, { amount: number, expiresAt: string, hidden?: boolean }> = {
    '2025D': {
      amount: 5,
      expiresAt: '2025-12-31'
    },
    'SEBSI2308': {
      amount: 54,
      expiresAt: '2024-12-31',
      hidden: true
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