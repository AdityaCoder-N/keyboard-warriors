import React from 'react';

interface ParagraphDisplayProps{
    paragraph:string,
    typedText:string,
    isCorrect:Boolean
}

const ParagraphDisplay = ({ paragraph, typedText, isCorrect } : ParagraphDisplayProps) => {
  return (
    <p className="text-slate-600 p-4 md:text-2xl font-bold bg-white rounded-xl text-justify">
      {paragraph.split('').map((char, index) => {
        let color = 'text-slate-600';
        if (index < typedText.length) {
          color = char === typedText[index] ? 'text-green-500' : 'text-red-500';
        } else if (index === typedText.length) {
          color = isCorrect ? 'underline text-blue-500' : 'text-red-500';
        }
        return (
          <span key={index} className={color}>
            {char}
          </span>
        );
      })}
    </p>
  );
};

export default ParagraphDisplay;
