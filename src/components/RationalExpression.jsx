import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../components/ui/button';

const RationalExpression = () => {
  // Predefined expressions
  const expressions = [
    { numerator: 'x² + 2x + 1', denominator: 'x + 1' },
    { numerator: '3x³ - 2x', denominator: 'x² + 1' },
    { numerator: '√x + 2', denominator: 'x - 1' },
    { numerator: 'x² + 3x + 2', denominator: 'sin(x)' },
    { numerator: '2x + 1', denominator: 'x² - 4' }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPolynomialInput, setIsPolynomialInput] = useState('');
  const [isRationalInput, setIsRationalInput] = useState('');
  const [isPolynomialChecked, setIsPolynomialChecked] = useState(false);
  const [isRationalChecked, setIsRationalChecked] = useState(false);
  const [hasError, setHasError] = useState({
    polynomial: false,
    rational: false
  });

  const numeratorRef = useRef(null);
  const denominatorRef = useRef(null);
  const [fractionBarWidth, setFractionBarWidth] = useState('min-w-48');

  // Add polynomial check calculations
  const currentExp = expressions[currentIndex];
  const isNumeratorPolynomial = !currentExp.numerator.includes('√') && !currentExp.numerator.includes('sin');
  const isDenominatorPolynomial = !currentExp.denominator.includes('√') && !currentExp.denominator.includes('sin');

  const updateFractionBarWidth = () => {
    if (numeratorRef.current && denominatorRef.current) {
      const numeratorWidth = numeratorRef.current.offsetWidth;
      const denominatorWidth = denominatorRef.current.offsetWidth;
      const maxWidth = Math.max(numeratorWidth, denominatorWidth);
      setFractionBarWidth(`${maxWidth + 16}px`); // Add 16px padding (8px on each side)
    }
  };

  useEffect(() => {
    updateFractionBarWidth();
    // Add resize listener to update width when window size changes
    window.addEventListener('resize', updateFractionBarWidth);
    return () => window.removeEventListener('resize', updateFractionBarWidth);
  }, [currentIndex]); // Update when question changes

  const resetPractice = () => {
    setCurrentIndex(0);
    setIsPolynomialInput('');
    setIsRationalInput('');
    setIsPolynomialChecked(false);
    setIsRationalChecked(false);
    setHasError({
      polynomial: false,
      rational: false
    });
    // Reset fraction bar width to initial state
    setFractionBarWidth('min-w-48');
    // Force a re-render of the fraction bar
    setTimeout(() => {
      updateFractionBarWidth();
    }, 0);
  };

  const nextQuestion = () => {
    const nextIndex = (currentIndex + 1) % expressions.length;
    setCurrentIndex(nextIndex);
    setIsPolynomialInput('');
    setIsRationalInput('');
    setIsPolynomialChecked(false);
    setIsRationalChecked(false);
    setHasError({ polynomial: false, rational: false });
  };

  const checkPolynomial = (answer, isRational = false) => {
    const isCorrect = (answer.toLowerCase() === 'yes' && isNumeratorPolynomial && isDenominatorPolynomial) ||
                     (answer.toLowerCase() === 'no' && (!isNumeratorPolynomial || !isDenominatorPolynomial));
    
    setHasError(prev => ({ 
      ...prev, 
      [isRational ? 'rational' : 'polynomial']: !isCorrect 
    }));
    
    if (isCorrect) {
      if (isRational) {
        setIsRationalChecked(true);
        setTimeout(() => {
          document.getElementById('success-box')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        setIsPolynomialChecked(true);
      }
    }
  };

  return (
    <>
      <style>{`
        @property --r {
          syntax: '<angle>';
          inherits: false;
          initial-value: 0deg;
        }

        .glow-button { 
          min-width: auto; 
          height: auto; 
          position: relative; 
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
          transition: all .3s ease;
          padding: 7px;
        }

        .glow-button::before {
          content: "";
          display: block;
          position: absolute;
          background: rgb(250, 245, 255);
          inset: 2px;
          border-radius: 4px;
          z-index: -2;
        }

        .simple-glow {
          background: conic-gradient(
            from var(--r),
            transparent 0%,
            rgb(0, 255, 132) 2%,
            rgb(0, 214, 111) 8%,
            rgb(0, 174, 90) 12%,
            rgb(0, 133, 69) 14%,
            transparent 15%
          );
          animation: rotating 3s linear infinite;
          transition: animation 0.3s ease;
        }

        .simple-glow.stopped {
          animation: none;
          background: none;
        }

        @keyframes rotating {
          0% {
            --r: 0deg;
          }
          100% {
            --r: 360deg;
          }
        }
      `}</style>
      <div className="w-[500px] h-auto mx-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] bg-white rounded-lg overflow-hidden">
        <div className="p-4 w-[500px]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[#5750E3] text-sm font-medium select-none">Rational Expression Practice</h2>
            <button
              onClick={resetPractice}
              className="text-gray-500 hover:text-gray-700 text-sm px-3 py-1 rounded border border-gray-300 hover:border-gray-400 transition-colors"
            >
              Reset
            </button>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 w-[468px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-purple-900 font-bold">Question {currentIndex + 1}</h2>
              <div className="flex gap-2">
                {expressions.map((_, idx) => (
                  <div
                    key={idx}
                    className={`rounded-full transition-all duration-300 ${
                      idx < currentIndex ? 'w-3 h-3 bg-[#008545]' : 
                      idx === currentIndex ? 
                        (isPolynomialChecked && isRationalChecked ? 'w-3 h-3 bg-[#008545]' : 'w-2 h-2 bg-[#5750E3] mt-0.5') : 
                        'w-3 h-3 bg-purple-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm mb-4 w-[436px]">
              <p className="font-medium text-sm select-none">Analyze the following expression:</p>
              <div className="mt-2 text-center">
                <div className="text-2xl flex flex-col items-center">
                  <div ref={numeratorRef} className="text-center px-4 flex">{expressions[currentIndex].numerator}</div>
                  <div className={`border-t-2 border-black my-2`} style={{ width: fractionBarWidth }}></div>
                  <div ref={denominatorRef} className="text-center px-4 flex">{expressions[currentIndex].denominator}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4 w-[436px]">
              <div>
                <p className="text-purple-900 mb-2 select-none">1. Are both the numerator and denominator polynomials?</p>
                {!isPolynomialChecked ? (
                  <div className="flex gap-2 items-center">
                    <Button
                      onClick={() => {
                        setIsPolynomialInput('yes');
                        checkPolynomial('yes');
                      }}
                      className={`${hasError.polynomial && isPolynomialInput === 'yes' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-[#008545] hover:bg-[#00703d]'} text-white text-sm px-4 py-2 rounded-md`}
                    >
                      Yes
                    </Button>
                    <Button
                      onClick={() => {
                        setIsPolynomialInput('no');
                        checkPolynomial('no');
                      }}
                      className={`${hasError.polynomial && isPolynomialInput === 'no' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-[#008545] hover:bg-[#00703d]'} text-white text-sm px-4 py-2 rounded-md`}
                    >
                      No
                    </Button>
                    {hasError.polynomial && (
                      <span className="text-yellow-500 font-medium ml-2">Try again!</span>
                    )}
                  </div>
                ) : (
                  <div className="bg-[#008545]/10 border border-[#008545] p-4 rounded-lg w-[436px]">
                    <p className="text-[#008545] font-bold select-none">
                      {isNumeratorPolynomial && isDenominatorPolynomial ? 'Yes' : 'No'}
                    </p>
                  </div>
                )}
              </div>

              {isPolynomialChecked && (
                <div>
                  <p className="text-purple-900 mb-2 select-none">2. Is this a rational expression?</p>
                  {!isRationalChecked ? (
                    <div className="flex gap-2 items-center">
                      <Button
                        onClick={() => {
                          setIsRationalInput('yes');
                          checkPolynomial('yes', true);
                        }}
                        className={`${hasError.rational && isRationalInput === 'yes' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-[#008545] hover:bg-[#00703d]'} text-white text-sm px-4 py-2 rounded-md`}
                      >
                        Yes
                      </Button>
                      <Button
                        onClick={() => {
                          setIsRationalInput('no');
                          checkPolynomial('no', true);
                        }}
                        className={`${hasError.rational && isRationalInput === 'no' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-[#008545] hover:bg-[#00703d]'} text-white text-sm px-4 py-2 rounded-md`}
                      >
                        No
                      </Button>
                      {hasError.rational && (
                        <span className="text-yellow-500 font-medium ml-2">Try again!</span>
                      )}
                    </div>
                  ) : (
                    <div className="bg-[#008545]/10 border border-[#008545] p-4 rounded-lg w-[436px]">
                      <p className="text-[#008545] font-bold select-none">
                        {isNumeratorPolynomial && isDenominatorPolynomial ? 'Yes' : 'No'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {isRationalChecked && (
                <div className="flex justify-end items-center gap-2 mt-4">
                  <span className="text-[#008545] font-medium select-none">Great Job!</span>
                  <div className="glow-button simple-glow">
                    <Button
                      onClick={currentIndex === expressions.length - 1 ? resetPractice : nextQuestion}
                      className="bg-[#008545] hover:bg-[#00703d] text-white text-sm px-4 py-2 rounded select-none"
                    >
                      {currentIndex === expressions.length - 1 ? 'Start Over' : 'Next Question'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RationalExpression;