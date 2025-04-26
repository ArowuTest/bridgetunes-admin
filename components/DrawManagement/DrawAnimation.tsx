import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrophy, FaCheck, FaTimes } from 'react-icons/fa';

interface DrawAnimationProps {
  isVisible: boolean;
  onComplete: (winner: WinnerType | null) => void;
  drawAmount: number;
  drawType: 'daily' | 'weekly';
  eligibleDigits: number[];
}

export interface WinnerType {
  msisdn: string;
  isOptedIn: boolean;
  amount: number;
  prize: 'jackpot' | '2nd' | '3rd' | 'consolation';
}

const AnimationContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 2rem;
`;

const AnimationContent = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.borderRadius?.medium || '0.375rem'};
  box-shadow: ${({ theme }) => theme.shadows?.large || '0 10px 25px rgba(0, 0, 0, 0.2)'};
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  text-align: center;
  color: white;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const DrawAmount = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const NumbersContainer = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const NumberBall = styled(motion.div)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.dark};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
`;

const WinnerContainer = styled(motion.div)`
  margin-top: 2rem;
`;

const WinnerCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius?.medium || '0.375rem'};
  padding: 1.5rem;
  margin-top: 1rem;
  color: ${({ theme }) => theme.colors.dark};
`;

const WinnerTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const WinnerMSISDN = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const WinnerAmount = styled.div`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  margin-bottom: 1rem;
`;

const WinnerStatus = styled.div<{ isValid: boolean }>`
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-weight: 600;
  background-color: ${({ theme, isValid }) => isValid ? theme.colors.success : theme.colors.danger};
  color: white;
`;

const LoadingText = styled(motion.div)`
  font-size: 1.25rem;
  margin-bottom: 1rem;
`;

// Helper function to mask MSISDN for privacy
const maskMSISDN = (msisdn: string): string => {
  if (!msisdn || msisdn.length < 8) return msisdn;
  return msisdn.substring(0, 4) + '****' + msisdn.substring(msisdn.length - 3);
};

// Helper function to format currency
const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const DrawAnimation: React.FC<DrawAnimationProps> = ({
  isVisible,
  onComplete,
  drawAmount,
  drawType,
  eligibleDigits
}) => {
  const [animationStage, setAnimationStage] = useState<'initial' | 'mixing' | 'selecting' | 'result'>('initial');
  const [winner, setWinner] = useState<WinnerType | null>(null);
  const [numbers, setNumbers] = useState<number[]>([]);
  
  // Reset animation state when visibility changes
  useEffect(() => {
    if (isVisible) {
      setAnimationStage('initial');
      setWinner(null);
      setNumbers(eligibleDigits);
      
      // Start animation sequence
      const sequence = async () => {
        // Initial delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mixing stage
        setAnimationStage('mixing');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Selecting stage
        setAnimationStage('selecting');
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generate mock winner for demo
        const mockWinner: WinnerType = {
          msisdn: '+234' + Math.floor(Math.random() * 9000000000 + 1000000000).toString(),
          isOptedIn: Math.random() > 0.3, // 70% chance of being opted in
          amount: drawAmount,
          prize: 'jackpot'
        };
        
        setWinner(mockWinner);
        setAnimationStage('result');
        
        // Complete animation after showing result
        await new Promise(resolve => setTimeout(resolve, 3000));
        onComplete(mockWinner);
      };
      
      sequence();
    }
  }, [isVisible, eligibleDigits, drawAmount, drawType, onComplete]);
  
  // Animation variants for framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.5 } }
  };
  
  const contentVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
    exit: { scale: 0.8, opacity: 0, transition: { duration: 0.3 } }
  };
  
  const numberVariants = {
    initial: { scale: 1 },
    mixing: (i: number) => ({
      x: Math.sin(i * 0.5) * 50,
      y: Math.cos(i * 0.5) * 50,
      transition: {
        repeat: Infinity,
        repeatType: "reverse" as const,
        duration: 0.5,
        delay: i * 0.1
      }
    }),
    selecting: { scale: 1.2, transition: { duration: 0.3 } },
    result: { scale: 1, transition: { duration: 0.3 } }
  };
  
  const winnerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  const loadingTextVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <AnimationContainer
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <AnimationContent
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Title>
              {animationStage === 'initial' && 'Preparing Draw'}
              {animationStage === 'mixing' && 'Mixing Numbers'}
              {animationStage === 'selecting' && 'Selecting Winner'}
              {animationStage === 'result' && 'Draw Complete!'}
            </Title>
            
            <DrawAmount>{formatAmount(drawAmount)}</DrawAmount>
            
            {animationStage !== 'result' && (
              <LoadingText
                variants={loadingTextVariants}
                initial="hidden"
                animate="visible"
              >
                {animationStage === 'initial' && 'Initializing draw...'}
                {animationStage === 'mixing' && 'Mixing eligible numbers...'}
                {animationStage === 'selecting' && 'Selecting winner...'}
              </LoadingText>
            )}
            
            <NumbersContainer>
              {numbers.map((number, index) => (
                <NumberBall
                  key={index}
                  custom={index}
                  variants={numberVariants}
                  initial="initial"
                  animate={animationStage}
                >
                  {number}
                </NumberBall>
              ))}
            </NumbersContainer>
            
            {animationStage === 'result' && winner && (
              <WinnerContainer
                variants={winnerVariants}
                initial="hidden"
                animate="visible"
              >
                <FaTrophy size={48} color="#FFCC00" />
                <WinnerCard>
                  <WinnerTitle>
                    {winner.prize === 'jackpot' && 'Jackpot Winner'}
                    {winner.prize === '2nd' && '2nd Prize Winner'}
                    {winner.prize === '3rd' && '3rd Prize Winner'}
                    {winner.prize === 'consolation' && 'Consolation Prize Winner'}
                  </WinnerTitle>
                  <WinnerMSISDN>{maskMSISDN(winner.msisdn)}</WinnerMSISDN>
                  <WinnerAmount>{formatAmount(winner.amount)}</WinnerAmount>
                  <WinnerStatus isValid={winner.isOptedIn}>
                    {winner.isOptedIn ? (
                      <>
                        <FaCheck style={{ marginRight: '0.5rem' }} />
                        Valid Opt-In
                      </>
                    ) : (
                      <>
                        <FaTimes style={{ marginRight: '0.5rem' }} />
                        Invalid Winner Not Opted-In
                      </>
                    )}
                  </WinnerStatus>
                </WinnerCard>
              </WinnerContainer>
            )}
          </AnimationContent>
        </AnimationContainer>
      )}
    </AnimatePresence>
  );
};

export default DrawAnimation;
