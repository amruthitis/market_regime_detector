import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: { 'Content-Type': 'application/json' },
})

export interface PredictionResponse {
  date: string
  regime: 'Bullish' | 'Bearish' | 'Crisis' | 'Sideways'
  confidence: number
  source: string
}

export interface PredictionRequest {
  date?: string
}

export async function getPrediction(date?: string): Promise<PredictionResponse> {
  const body: PredictionRequest = {}
  if (date) body.date = date
  const { data } = await api.post<PredictionResponse>('/predict', body)
  return data
}

export async function healthCheck(): Promise<{ [key: string]: string }> {
  const { data } = await api.get('/')
  return data
}
