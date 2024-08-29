import { useEffect, useState } from "react";
import { paragraphs } from "@/utils/paragraphs";

export default function useTyping( onComplete:()=>void ){

  useEffect(()=>{
    const randomIndex = Math.floor(Math.random() * paragraphs.length);
    setCurrentParagraph(paragraphs[randomIndex]);
  },[])

  const [currentParagraph, setCurrentParagraph] = useState<string>(paragraphs[0]);
  const [typedText, setTypedText] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean>(true);
  const [correctCharacters,setCorrectCharacters] = useState<number>(0);


  const handleKeyPress = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setTypedText(value);
  
    // Determining the length of the input
    const nextTypedTextLength = value.length;
  
    // Checking if the input so far matches the corresponding portion of the paragraph
    if (value === currentParagraph.slice(0, nextTypedTextLength)) {

      setIsCorrect(true);
        // Only incrementing correctCharacters when the user types forward
      if (nextTypedTextLength > typedText.length) {
        setCorrectCharacters((prev) => prev + 1);
      } else if (nextTypedTextLength < typedText.length) {
        // Decrementing correctCharacters when the user presses backspace
        setCorrectCharacters((prev) => prev - 1);
      }

      if (nextTypedTextLength === currentParagraph.length && value === currentParagraph) {
        onComplete();
      }
    } else {
      setIsCorrect(false);
      // Handle incorrect typing (e.g., play sound)
    }
  };

  return{currentParagraph, handleKeyPress, typedText, isCorrect, correctCharacters, setCorrectCharacters, setTypedText, setCurrentParagraph}

}