import { useEffect, useState } from "react";

export default function useTyping( onComplete:()=>void ){

  const paragraphs = [
    "Sarah watched the whirlpool mesmerized. She watched as birds flew past the window bolted shut. She couldn't reach it if she wanted too.",
    "Waiting and watching. It was all she had done for the past weeks. When you're locked in a room with nothing but food and drink, that’s about all you can do anyway. She watched as birds flew past the window bolted shut. She couldn't reach it if she wanted too, with that hole in the floor. She thought she could escape through it but three stories is a bit far down." 
  ];

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