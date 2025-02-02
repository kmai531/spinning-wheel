import { useEffect, useRef, useState } from "react";
import { Button } from 'react95';
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import styled from '@emotion/styled';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

const WheelContainer = styled.div`
  position: relative;
  width: 550px;
  height: 600px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Arrow = styled.div`
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  
  &:before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-top: 40px solid black;
  }
`;

const StyledButton = styled(Button)`
  width: 150px !important;
  height: 40px !important;
  margin-top: 20px !important;
  font-size: 18px !important;
  padding: 0 !important;
  line-height: 40px !important;
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
  const wheelRef = useRef(null);
  const [result, setResult] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const chartInstance = useRef(null);
  const [fontLoaded, setFontLoaded] = useState(false);

  // Add this useEffect to load font first
  useEffect(() => {
    document.fonts.ready.then(() => {
      setFontLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!fontLoaded) return; // Don't initialize chart until font is ready

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = wheelRef.current.getContext("2d");
    const data = weights || Array(segments.length).fill(1);
    
    // Assign colors to segments, cycling through the SEGMENT_COLORS array
    const colors = segments.map((_, index) => 
      SEGMENT_COLORS[index % SEGMENT_COLORS.length]
    );

    chartInstance.current = new Chart(ctx, {
      plugins: [ChartDataLabels],
      type: "pie",
      data: {
        labels: segments,
        datasets: [{
          backgroundColor: colors,
          data: data,
          rotation: -90,
          borderWidth: 2,
          borderColor: '#000000'
        }]
      },
      options: {
        responsive: true,
        animation: { duration: 1 },
        plugins: {
          tooltip: false,
          legend: { display: false },
          datalabels: {
            color: "#000000",
            formatter: (_, context) => context.chart.data.labels[context.dataIndex],
            font: { 
              size: 24,
              weight: 'bold',
              family: "ms_sans_serif"  // Just use the font name directly
            },
            textAlign: 'center',
            textStrokeWidth: 0.5,
            textStrokeColor: '#ffffff',
            padding: 6
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [segments, fontLoaded]);

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    // Generate a random target segment
    const randomIndex = Math.floor(Math.random() * segments.length);
    const segmentSize = 360 / segments.length;
    // This controls how many times it spins:
    // finalRotation = 360° × number of spins + extra degrees to land on winner
    const minSpins = 6;   // Reduced minimum spins
    const maxSpins = 10;  // Reduced maximum spins
    const randomSpins = minSpins + Math.random() * (maxSpins - minSpins);
    const finalRotation = (360 * randomSpins) + (segmentSize * randomIndex);
    
    let currentRotation = chartInstance.current.config.data.datasets[0].rotation || 0;
    const startTime = performance.now();
    const duration = 4000;
    
    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 3);
      currentRotation = (finalRotation * easeOut);
      
      chartInstance.current.config.data.datasets[0].rotation = -90 + (currentRotation % 360);
      chartInstance.current.update();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        const finalPosition = (-90 + (currentRotation % 360) + 360) % 360;
        const winningIndex = Math.floor(((360 - finalPosition) % 360) / segmentSize);
        const winningSegment = segments[winningIndex];
        
        setResult(winningSegment);
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
        setIsSpinning(false);
      }
    }

    requestAnimationFrame(animate);
  };

  const triggerConfetti = () => {
    // Get the canvas element and its position
    const canvas = wheelRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Calculate the center position relative to the viewport
    const centerX = (rect.left + rect.right) / 2 / window.innerWidth;
    const centerY = (rect.top + rect.bottom) / 2 / window.innerHeight;

    const count = 200;
    const defaults = {
      origin: { x: centerX, y: centerY },
      zIndex: 1000,
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
        spread: 360,
        startVelocity: 30,
      });
    }

    // Fire in a circular pattern
    fire(0.25, {
      spread: 360,
      startVelocity: 30,
    });

    fire(0.2, {
      spread: 360,
      startVelocity: 25,
    });

    fire(0.35, {
      spread: 360,
      decay: 0.91,
      scalar: 0.8,
    });

    fire(0.1, {
      spread: 360,
      startVelocity: 35,
      decay: 0.92,
      scalar: 1.2,
    });

    fire(0.1, {
      spread: 360,
      startVelocity: 40,
    });
  };

  return (
    <WheelContainer>
      <Arrow />
      <canvas ref={wheelRef} style={{ maxWidth: '100%', height: 'auto' }} />
      <StyledButton 
        onClick={spinWheel} 
        disabled={isSpinning}
      >
        {isSpinning ? 'Spinning...' : 'SPIN'}
      </StyledButton>
    </WheelContainer>
  );
};

export default SpinningWheel;