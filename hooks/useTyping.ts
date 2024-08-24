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


  const handleKeyPress = (e:React.KeyboardEvent<HTMLTextAreaElement>) => {
    
    const { key } = e;
    console.log(key);
    if (key==='CapsLock') return;
    
    const nextTypedTextLength = typedText.length + 1;

    if (key === currentParagraph[typedText.length]) {
      setTypedText((prev) => prev + key);
      setIsCorrect(true);
      setCorrectCharacters((prev)=>prev+1);

        // Check if the next length matches the paragraph length
      if (nextTypedTextLength === currentParagraph.length) {
        onComplete();
      }
    } else {
      setIsCorrect(false)
      // play sound
      e.preventDefault();
    }
  };

  return{currentParagraph, handleKeyPress, typedText, isCorrect, correctCharacters, setCorrectCharacters, setTypedText}

}