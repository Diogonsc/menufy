/**
 * Resposta da API Via CEP
 * @see https://viacep.com.br/
 */
export interface ViaCepResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
  erro?: boolean
}

const VIA_CEP_BASE = "https://viacep.com.br/ws"

/**
 * Remove caracteres não numéricos do CEP.
 */
export function sanitizeCep(cep: string): string {
  return cep.replace(/\D/g, "")
}

/**
 * Verifica se o CEP tem 8 dígitos (válido para busca).
 */
export function isValidCepLength(cep: string): boolean {
  return sanitizeCep(cep).length === 8
}

/**
 * Busca endereço pelo CEP na API Via CEP.
 * @param cep - CEP com ou sem formatação (apenas 8 dígitos)
 * @returns Dados do endereço ou null se não encontrado/erro
 */
export async function fetchAddressByCep(
  cep: string
): Promise<ViaCepResponse | null> {
  const digits = sanitizeCep(cep)
  if (digits.length !== 8) return null

  try {
    const res = await fetch(`${VIA_CEP_BASE}/${digits}/json/`)
    const data = (await res.json()) as ViaCepResponse & { erro?: boolean }

    if (data.erro === true || !data.logradouro) return null
    return data
  } catch {
    return null
  }
}
