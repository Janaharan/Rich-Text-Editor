import "./App.css";
import { useState } from "react";
import Footer from "./Components/footer/Footer";
import Hero from "./Components/hero/Hero";
import NavBar from "./Components/navbar/NavBar";

function App() {
  const [textBlocks, setTextBlocks] = useState([]); 
  const [undoStack, setUndoStack] = useState([]); 
  const [redoStack, setRedoStack] = useState([]); 

  const addTextBlock = () => {
    const newTextBlock = { id: textBlocks.length, content: "", top: 0, left: 0, style: {} }; 
    

    setUndoStack([...undoStack, textBlocks]);
    

    setRedoStack([]);
    setTextBlocks((prevBlocks) => [...prevBlocks, newTextBlock]);
  };

  const updateTextBlock = (id, content = null, newStyle = null) => {
    setUndoStack([...undoStack, textBlocks]); 
    setRedoStack([]); 

    setTextBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === id
          ? {
              ...block,
              content: content !== null ? content : block.content,
              style: newStyle !== null ? { ...block.style, ...newStyle } : block.style,
            }
          : block
      )
    );
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return; 
    
    const lastState = undoStack[undoStack.length - 1];
    setRedoStack([...redoStack, textBlocks]); 
    setUndoStack(undoStack.slice(0, -1)); 
    setTextBlocks(lastState);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return; 

    const nextState = redoStack[redoStack.length - 1];
    setUndoStack([...undoStack, textBlocks]); 
    setRedoStack(redoStack.slice(0, -1)); 
    setTextBlocks(nextState); 
  };

  return (
    <div className="main-container">
      <NavBar onUndo={handleUndo} onRedo={handleRedo} />
      <Hero textBlocks={textBlocks} updateTextBlock={updateTextBlock} />
      <Footer addTextBlock={addTextBlock} />
    </div>
  );
}

export default App;
