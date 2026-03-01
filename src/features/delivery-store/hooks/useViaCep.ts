import { useCallback, useState } from "react"
import { fetchAddressByCep, isValidCepLength, type ViaCepResponse } from "../services/viaCep"

interface UseViaCepResult {
  /** Busca o endereço pelo CEP e retorna os dados (ou null) */
  fetchByCep: (cep: string) => Promise<ViaCepResponse | null>
  /** Indica se a requisição está em andamento */
  isLoading: boolean
  /** Mensagem de erro, se houver */
  error: string | null
  /** Limpa o estado de erro */
  clearError: () => void
}

export function useViaCep(): UseViaCepResult {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchByCep = useCallback(async (cep: string): Promise<ViaCepResponse | null> => {
    if (!isValidCepLength(cep)) {
      setError("CEP deve ter 8 dígitos")
      return null
    }

    setError(null)
    setIsLoading(true)

    try {
      const data = await fetchAddressByCep(cep)
      if (!data) {
        setError("CEP não encontrado")
        return null
      }
      return data
    } catch {
      setError("Erro ao buscar CEP. Tente novamente.")
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return { fetchByCep, isLoading, error, clearError }
}
