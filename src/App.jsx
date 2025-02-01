import React, { useState, useEffect } from 'react';
import { Button, styleReset } from "react95";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { Window, WindowHeader, WindowContent, TextInput, MenuList, MenuListItem, Separator, Frame } from "react95";
import original from "react95/dist/themes/original";
import ms_sans_serif from "react95/dist/fonts/ms_sans_serif.woff2";
import ms_sans_serif_bold from "react95/dist/fonts/ms_sans_serif_bold.woff2";
import SpinningWheel from "./components/SpinningWheel";
import '@react95/icons/icons.css';
import { FiSettings } from 'react-icons/fi';

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
  const [segments, setSegments] = useState(() => {
    const saved = localStorage.getItem('wheelSegments');
    return saved ? JSON.parse(saved) : [
      { name: 'JASON IS', weight: 1 },
      { name: 'FATASSH', weight: 1 }
    ];
  });
  const [newOption, setNewOption] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    localStorage.setItem('wheelSegments', JSON.stringify(segments));
  }, [segments]);

  const handleAddOption = () => {
    if (newOption.trim()) {
      setSegments([...segments, { 
        name: newOption.trim(), 
        weight: 1 
      }]);
      setNewOption('');
    }
  };

  const handleDeleteOption = (index) => {
    setSegments(segments.filter((_, i) => i !== index));
  };

  const handleSpinEnd = (winner) => {
    console.log('Winner:', winner);
  };

  const handlePasswordSubmit = () => {
    if (password === 'pw123') {
      setShowModal(false);
      setShowSettings(true);
      setPassword('');
      setIsPasswordError(false);
    } else {
      setIsPasswordError(true);
    }
  };

  const handleWeightChange = (index, value) => {
    const numValue = parseInt(value) || 1;
    setSegments(segments.map((segment, i) => 
      i === index 
        ? { ...segment, weight: numValue }
        : segment
    ));
  };

  return (
    <>
      <GlobalStyles />
      <ThemeProvider theme={original}>
        <div style={{ padding: '20px', display: 'flex', gap: '10rem' }}>
          <SpinningWheel 
            segments={segments.map(s => s.name)} 
            weights={segments.map(s => s.weight)}
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
                <Button 
                  onClick={() => setShowModal(true)}
                  style={{ 
                    padding: '2px', 
                    height: '28px', 
                    width: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <FiSettings size={16} />
                </Button>
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
                        <span>{segment.name}</span>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <TextInput
                            type="number"
                            value={segment.weight}
                            onChange={(e) => handleWeightChange(index, e.target.value)}
                            style={{ width: '60px' }}
                            min="1"
                          />
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
                      </div>
                    </MenuListItem>
                  ))}
                </MenuList>
              </div>
            </WindowContent>
          </Window>

          {showModal && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Frame 
                style={{
                  width: '300px',
                  height: 'auto',
                  backgroundColor: 'rgb(192,192,192)'
                }}
              >
                <Window style={{width: "100%"}}>
                  <WindowHeader style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                  }}>
                    <span>Settings</span>
                    <Button 
                      onClick={() => {
                        setShowModal(false);
                        setPassword('');
                        setIsPasswordError(false);
                      }}
                      style={{ marginLeft: 2 }}
                    >
                      <span style={{ fontWeight: 'bold', transform: 'translateY(-1px)' }}>×</span>
                    </Button>
                  </WindowHeader>
                  <WindowContent style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <TextInput
                        type="password"
                        placeholder="Enter password..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handlePasswordSubmit();
                          }
                        }}
                        fullWidth
                      />
                      {isPasswordError && (
                        <span style={{ color: 'red', fontSize: '0.875rem' }}>
                          Incorrect password
                        </span>
                      )}
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'flex-end', 
                        gap: '0.5rem',
                        marginTop: '0.5rem'
                      }}>
                        <Button onClick={handlePasswordSubmit}>
                          OK
                        </Button>
                        <Button onClick={() => {
                          setShowModal(false);
                          setPassword('');
                          setIsPasswordError(false);
                        }}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </WindowContent>
                </Window>
              </Frame>
            </div>
          )}

          {showSettings && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Frame 
                style={{
                  width: '400px',
                  height: 'auto',
                  backgroundColor: 'rgb(192,192,192)'
                }}
              >
                <Window style={{width: "100%"}}>
                  <WindowHeader style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                  }}>
                    <span>Wheel Weights</span>
                    <Button 
                      onClick={() => setShowSettings(false)}
                      style={{ marginLeft: 2 }}
                    >
                      <span style={{ fontWeight: 'bold', transform: 'translateY(-1px)' }}>×</span>
                    </Button>
                  </WindowHeader>
                  <WindowContent>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {segments.map((segment, index) => (
                        <div 
                          key={index}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '1rem',
                            justifyContent: 'space-between'
                          }}
                        >
                          <span style={{ flex: 1 }}>{segment.name}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <TextInput
                              type="number"
                              value={segment.weight}
                              onChange={(e) => handleWeightChange(index, e.target.value)}
                              style={{ width: '60px' }}
                              min="1"
                            />
                          </div>
                        </div>
                      ))}
                      <Separator />
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'flex-end', 
                        gap: '0.5rem',
                        marginTop: '1rem'
                      }}>
                        <Button onClick={() => {
                          console.log('Weights saved:', segments);
                          setShowSettings(false);
                        }}>
                          Apply
                        </Button>
                        <Button onClick={() => setShowSettings(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </WindowContent>
                </Window>
              </Frame>
            </div>
          )}
        </div>
      </ThemeProvider>
    </>
  );
};

export default App;
