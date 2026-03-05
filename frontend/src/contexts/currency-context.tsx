'use client';

import { DEFAULT_CURRENCY, type SupportedCurrency } from '@/lib/currency';
import { getFxRates } from '@/lib/fx';
import { createContext, useContext, useEffect, useState } from 'react';

interface CurrencyContextValue {
  currency: SupportedCurrency;
  setCurrency: (c: SupportedCurrency) => void;
  convert: (nairaAmount: number) => number;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<SupportedCurrency>(DEFAULT_CURRENCY);
  const [rates, setRates] = useState<{ USD: number; NGN: number }>({
    USD: 1,
    NGN: 1,
  });

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (tz.includes('Africa')) {
      setCurrency('NGN');
    } else {
      setCurrency('USD');
    }
  }, []);

  // 💱 load FX rates
  useEffect(() => {
    getFxRates().then(setRates);
  }, []);

  // Always treat input as NGN
  const convert = (nairaAmount: number) => {
    if (currency === 'NGN') return nairaAmount;
    // Convert NGN to USD
    return nairaAmount / rates.NGN;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convert }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error('useCurrency must be used inside CurrencyProvider');
  }
  return ctx;
}
