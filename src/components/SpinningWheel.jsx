import { Wheel } from 'react-custom-roulette';
import styled from '@emotion/styled';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import { useState } from 'react';

const WheelContainer = styled.div`
  position: relative;
  width: 550px;
  height: 600px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Win95Button = styled.button`
  width: 150px;
  height: 40px;
  margin-top: 20px;
  font-size: 18px;
  font-family: 'ms_sans_serif';
  background-color: #c3c3c3;
  border: 2px solid #000000;
  border-left-color: #ffffff;
  border-top-color: #ffffff;
  box-shadow: inset -1px -1px #858585;
  cursor: pointer;
  
  &:active {
    border: 2px solid #000000;
    border-right-color: #ffffff;
    border-bottom-color: #ffffff;
    box-shadow: inset 1px 1px #858585;
  }
  
  &:disabled {
    color: #858585;
    cursor: not-allowed;
  }
`;

// Define an array of colors for the segments
const SEGMENT_COLORS = [
  '#FF6B6B',  // Coral
  '#4ECDC4',  // Turquoise
  '#45B7D1',  // Sky Blue
  '#96CEB4',  // Mint
  '#FFEEAD',  // Cream
  '#F7A072',  // Peach
  '#6C5B7B',  // Purple
  '#FFD93D',  // Yellow
  '#FF8B94',  // Pink
  '#A8E6CF',  // Light Green
  '#DCD6F7',  // Lavender
  '#F4A261',  // Orange
];

const SpinningWheel = ({ segments, weights, onSpinEnd }) => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const handleSpinClick = () => {
    if (!mustSpin) {
      // Use weights directly since they're already numbers
      const weightArray = weights || Array(segments.length).fill(1);
      const totalWeight = weightArray.reduce((sum, weight) => sum + weight, 0);
      
      // Generate random value
      const random = Math.random() * totalWeight;
      
      // Find winning index
      let accumulatedWeight = 0;
      let winningIndex = 0;
      
      for (let i = 0; i < weightArray.length; i++) {
        accumulatedWeight += weightArray[i];
        if (random <= accumulatedWeight) {
          winningIndex = i;
          break;
        }
      }
      
      console.log('Weights:', weightArray);
      console.log('Total Weight:', totalWeight);
      console.log('Random Value:', random);
      console.log('Winning Index:', winningIndex);
      console.log('Winning Segment:', segments[winningIndex]);
      
      setPrizeNumber(winningIndex);
      setMustSpin(true);
    }
  };

  const handleStopSpinning = () => {
    setMustSpin(false);
    const winningSegment = segments[prizeNumber];
    
    if (onSpinEnd) {
      onSpinEnd(winningSegment);
    }

    toast.success(`🎉 We are playing: ${winningSegment} 🎉`, {
      icon: '🎰',
      style: {
        background: '#c3c3c3',
        border: '2px solid #000000',
        borderLeft: '2px solid #ffffff',
        borderTop: '2px solid #ffffff',
        boxShadow: 'inset 1px 1px #dfdfdf',
        fontFamily: 'ms_sans_serif',
        fontSize: '20px',
        padding: '16px',
      },
    });
    
    triggerConfetti();
  };

  const wheelData = segments.map(segment => ({
    option: segment,
    style: { backgroundColor: SEGMENT_COLORS[segments.indexOf(segment) % SEGMENT_COLORS.length] }
  }));

  return (
    <WheelContainer>
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={wheelData}
        onStopSpinning={handleStopSpinning}
        spinDuration={0.5}           // Reduced from default 1.0
        fontSize={24}
        fontFamily={'ms_sans_serif'}
        textColors={['#000000']}
        outerBorderColor={'#000000'}
        radiusLineColor={'#000000'}
        radiusLineWidth={2}
        perpendicularText={true}
        textDistance={85}
      />
      <Win95Button 
        onClick={handleSpinClick}
        disabled={mustSpin}
      >
        {mustSpin ? 'Spinning...' : 'SPIN'}
      </Win95Button>
    </WheelContainer>
  );
};

export default SpinningWheel;