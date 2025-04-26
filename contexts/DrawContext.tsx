import { createContext, useContext, useState, ReactNode } from 'react';

export interface WinnerType {
  msisdn: string;
  isOptedIn: boolean;
  amount: number;
  prize: 'jackpot' | '2nd' | '3rd' | 'consolation';
}

interface DrawContextType {
  eligibleDigits: number[];
  setEligibleDigits: (digits: number[]) => void;
  selectedDay: string;
  setSelectedDay: (day: string) => void;
  drawAmount: number;
  setDrawAmount: (amount: number) => void;
  drawType: 'daily' | 'weekly';
  setDrawType: (type: 'daily' | 'weekly') => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
  currentWinner: WinnerType | null;
  setCurrentWinner: (winner: WinnerType | null) => void;
}

const DrawContext = createContext<DrawContextType>({
  eligibleDigits: [],
  setEligibleDigits: () => {},
  selectedDay: 'Monday',
  setSelectedDay: () => {},
  drawAmount: 0,
  setDrawAmount: () => {},
  drawType: 'daily',
  setDrawType: () => {},
  isProcessing: false,
  setIsProcessing: () => {},
  currentWinner: null,
  setCurrentWinner: () => {},
});

export const DrawProvider = ({ children }: { children: ReactNode }) => {
  const [eligibleDigits, setEligibleDigits] = useState<number[]>([0, 1]); // Default for Monday
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [drawAmount, setDrawAmount] = useState<number>(0);
  const [drawType, setDrawType] = useState<'daily' | 'weekly'>('daily');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentWinner, setCurrentWinner] = useState<WinnerType | null>(null);

  return (
    <DrawContext.Provider
      value={{
        eligibleDigits,
        setEligibleDigits,
        selectedDay,
        setSelectedDay,
        drawAmount,
        setDrawAmount,
        drawType,
        setDrawType,
        isProcessing,
        setIsProcessing,
        currentWinner,
        setCurrentWinner,
      }}
    >
      {children}
    </DrawContext.Provider>
  );
};

export const useDraw = () => useContext(DrawContext);
