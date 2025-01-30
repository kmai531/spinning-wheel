import React, { useState } from 'react';
import { Button, Hourglass, styleReset, TextInput } from "react95";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { Window, WindowHeader, WindowContent, TextField, MenuList, MenuListItem, Separator } from "react95";
import original from "react95/dist/themes/original";
import ms_sans_serif from "react95/dist/fonts/ms_sans_serif.woff2";
import ms_sans_serif_bold from "react95/dist/fonts/ms_sans_serif_bold.woff2";
import SpinningWheel from "./components/SpinningWheel";

const GlobalStyles = createGlobalStyle`
  ${styleReset}
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif}') format('woff2');
    font-weight: 400;
    font-style: normal
  }
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif_bold}') format('woff2');
    font-weight: bold;
    font-style: normal
  }
  body {
    font-family: 'ms_sans_serif';
  }
`;

const App = () => {
  const [segments, setSegments] = useState([
    'JASON IS',
    'FATASSH'
  ]);
  const [newOption, setNewOption] = useState('');

  const handleAddOption = () => {
    if (newOption.trim()) {
      setSegments([...segments, newOption.trim()]);
      setNewOption('');
    }
  };

  const handleDeleteOption = (index) => {
    setSegments(segments.filter((_, i) => i !== index));
  };

  const handleSpinEnd = (winner) => {
    console.log('Winner:', winner);
  };

  return (
    <>
      <GlobalStyles />
      <ThemeProvider theme={original}>
        <div style={{ padding: '20px', display: 'flex', gap: '10rem' }}>
          <SpinningWheel 
            segments={segments} 
            onSpinEnd={handleSpinEnd}
          />
          
          <Window style={{ width: '500px' }}>
            <WindowHeader 
              style={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '24px',
                padding: '8px',
                height: 'auto',
              }}
              className="window-title"
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                Wheel Options
              </span>
              <Button>
                <span style={{ 
                  fontWeight: 'bold', 
                  transform: 'translateY(-1px)',
                  fontSize: '20px'
                }}>x</span>
              </Button>
            </WindowHeader>
            <WindowContent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <TextInput 
                    placeholder="Add new option..."
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddOption();
                      }
                    }}
                    style={{ 
                      flex: 1, 
                      fontSize: '18px',
                      height: '50px'
                    }}
                  />
                  <Button 
                    onClick={handleAddOption}
                    style={{ height: '50px' }}
                  >
                    Add
                  </Button>
                </div>
                <Separator />
                <MenuList style={{ gap: '8px' }}>
                  {segments.map((segment, index) => (
                    <MenuListItem
                      key={index}
                      size="sm"
                      style={{ 
                        marginBottom: '8px',
                        fontSize: '20px',
                        padding: '8px',
                        height: '50px'
                      }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%'
                      }}>
                        {segment}
                        <Button 
                          onClick={() => handleDeleteOption(index)}
                          size="sm"
                        >
                          <span style={{ 
                            fontWeight: 'bold', 
                            transform: 'translateY(-1px)'
                          }}>x</span>
                        </Button>
                      </div>
                    </MenuListItem>
                  ))}
                </MenuList>
              </div>
            </WindowContent>
          </Window>
        </div>
      </ThemeProvider>
    </>
  );
};

export default App;
