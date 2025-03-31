import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Calculator, Lightbulb } from 'lucide-react';

const RationalExpression = () => {
  const [numerator, setNumerator] = useState('');
  const [denominator, setDenominator] = useState('');

  const generatePolynomial = (maxDegree) => {
    const degree = Math.floor(Math.random() * maxDegree) + 1;
    let terms = [];
    let isFirst = true;
    let hasTerms = false;
    
    for (let i = degree; i >= 0; i--) {
      let coefficient;
      if (!hasTerms && i === 0) {
        // Ensure non-zero final term if no other terms exist
        do {
          coefficient = Math.floor(Math.random() * 10) - 5;
        } while (coefficient === 0);
      } else {
        coefficient = Math.floor(Math.random() * 10) - 5;
      }
      
      if (coefficient !== 0) {
        hasTerms = true;
        const sign = isFirst ? (coefficient < 0 ? '- ' : '') : (coefficient < 0 ? '- ' : '+ ');
        
        if (i === 0) {
          terms.push(<span key={i} className="pl-2">{sign}{Math.abs(coefficient)}</span>);
        } else if (i === 1) {
          const coef = Math.abs(coefficient) === 1 ? '' : Math.abs(coefficient);
          terms.push(<span key={i} className="pl-2">{sign}{coef}x</span>);
        } else {
          const coef = Math.abs(coefficient) === 1 ? '' : Math.abs(coefficient);
          terms.push(
            <span key={i} className="pl-2">
              {sign}{coef}x<span className="text-sm align-super">{i}</span>
            </span>
          );
        }
        isFirst = false;
      }
    }
    
    return terms;
  };

  const generateExpression = () => {
    setNumerator(generatePolynomial(3));
    setDenominator(generatePolynomial(2));
  };

  // Generate initial expression on component mount
  useEffect(() => {
    generateExpression();
  }, []);

  return (
    <div className="bg-gray-100 p-8 min-h-screen">
      <Card className="w-full max-w-2xl mx-auto shadow-md bg-white">
        <CardHeader className="bg-sky-100 text-sky-800">
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl font-bold">Rational Expression Explorer</CardTitle>
            <Calculator size={40} className="text-sky-600" />
          </div>
          <CardDescription className="text-sky-700 text-lg">Learn what makes a rational expression!</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <Alert className="bg-blue-50 border-blue-100">
            <Lightbulb className="h-4 w-4 text-blue-400" />
            <AlertTitle className="text-blue-700">What is a Rational Expression?</AlertTitle>
            <AlertDescription className="text-blue-600">
              A rational expression is a fraction where both the numerator and denominator are polynomials.
              It can be written in the form P(x)/Q(x), where P(x) and Q(x) are polynomials and Q(x) ≠ 0.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="flex items-center justify-center p-2 min-h-32">
              {numerator || denominator ? (
                <div className="text-2xl flex flex-col items-center">
                  <div className="text-center px-4 flex">{numerator}</div>
                  <div className="w-full border-t-2 border-black my-2 min-w-48"></div>
                  <div className="text-center px-4 flex">{denominator}</div>
                </div>
              ) : (
                <div className="text-gray-500">
                  Click the button below to generate a rational expression
                </div>
              )}
            </div>
            <Button 
              onClick={generateExpression}
              className="w-full bg-emerald-400 hover:bg-emerald-500 text-white text-xl py-6"
            >
              Generate New Expression
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RationalExpression;