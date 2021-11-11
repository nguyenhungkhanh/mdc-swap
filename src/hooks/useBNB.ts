import { useCallback, useEffect, useState } from 'react'
import axios from "axios"

export default function useBNB() {
  const [value, setValue] = useState(null)
  const [loading, setLoading] = useState(false)

  const getValue = useCallback(async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BINANCE_URL}/ticker/price?symbol=BNBUSDT`)
      setValue(response?.data?.price)
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!value && !loading) {
      getValue()
    }
  }, [value, loading, getValue])

  return { value }
}