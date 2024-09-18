import PropTypes from 'prop-types';
import { useState, useRef } from "react";
import "./Hero.css";

const Hero = ({ textBlocks, updateTextBlock }) => {
  const [dragging, setDragging] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [selectedTextArea, setSelectedTextArea] = useState(null);
  const [fontSize, setFontSize] = useState(16); 
  const [textAlign, setTextAlign] = useState("left");
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const textAreaRef = useRef(null);

  const pushHistory = () => {
    setHistory(prevHistory => [
      ...prevHistory,
      textBlocks.map(block => ({ ...block }))
    ]);
    setRedoStack([]);
  };

  const handleDragStart = (e, index) => {
    setDragging(index);
    const element = document.getElementById(index);

    setOffset({
      x: e.clientX - element.getBoundingClientRect().left,
      y: e.clientY - element.getBoundingClientRect().top,
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();

    if (dragging !== null) {
      pushHistory(); 

      const textAreaRect = textAreaRef.current.getBoundingClientRect();
      const newX = e.clientX - textAreaRect.left - offset.x;
      const newY = e.clientY - textAreaRect.top - offset.y;

      const draggedElement = document.getElementById(dragging);
      if (draggedElement) {
        draggedElement.style.position = "absolute";
        draggedElement.style.top = `${Math.max(
          0,
          Math.min(newY, textAreaRect.height - draggedElement.clientHeight)
        )}px`;
        draggedElement.style.left = `${Math.max(
          0,
          Math.min(newX, textAreaRect.width - draggedElement.clientWidth)
        )}px`;
      }

   
      updateTextBlock(dragging, null, { top: newY, left: newX });

      setDragging(null);
    }
  };

  const handleChange = (e, id) => {
    updateTextBlock(id, e.target.value); 
  };

  const handleTextAreaClick = (id) => {
    setSelectedTextArea(id);
    const textarea = document.getElementById(id);
    if (textarea) {
      setFontSize(parseInt(window.getComputedStyle(textarea).fontSize));
      setTextAlign(window.getComputedStyle(textarea).textAlign);
    }
  };

  const applyStyleToSelected = (styleKey, styleValue, toggle = false) => {
    if (selectedTextArea !== null) {
      const textarea = document.getElementById(selectedTextArea);
      if (textarea) {
        const currentStyle = textarea.style[styleKey] || "";

        const newStyleValue = toggle ? (currentStyle === styleValue ? "" : styleValue) : styleValue;

        // Apply style to the element
        textarea.style[styleKey] = newStyleValue;

        // Update the text block with the new style
        updateTextBlock(selectedTextArea, null, { [styleKey]: newStyleValue });
      }
    }
  };

  const handleFontSizeChange = (change) => {
    if (selectedTextArea !== null) {
      const newFontSize = fontSize + change;
      setFontSize(newFontSize);
      applyStyleToSelected("fontSize", `${newFontSize}px`);
    }
  };

  const handleTextAlignToggle = () => {
    const newAlign = textAlign === "center" ? "left" : "center";
    setTextAlign(newAlign);
    applyStyleToSelected("textAlign", newAlign);
  };

  const undo = () => {
    if (history.length > 0) {
      const lastState = history.pop();
      setRedoStack(prevRedoStack => [
        ...prevRedoStack,
        textBlocks.map(block => ({ ...block }))
      ]);
      updateTextBlock(null, null, lastState); 
      setHistory([...history]); 
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const redoState = redoStack.pop();
      setHistory(prevHistory => [
        ...prevHistory,
        textBlocks.map(block => ({ ...block }))
      ]);
      updateTextBlock(null, null, redoState); 
      setRedoStack([...redoStack]); 
    }
  };

  return (
    <div className="heroContainer">
      <div
        className="textArea"
        ref={textAreaRef}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {textBlocks.map((block) => (
          <textarea
            className="block"
            placeholder="Type here"
            key={block.id}
            id={block.id}
            value={block.content}
            onChange={(e) => handleChange(e, block.id)}
            draggable
            onDragStart={(e) => handleDragStart(e, block.id)}
            onClick={() => handleTextAreaClick(block.id)}
            style={{
              position: "absolute",
              top: `${block.top}px`,
              left: `${block.left}px`,
              border: "none",
              padding: "5px",
              backgroundColor: "transparent",
              cursor: "pointer",
              fontSize: `${fontSize}px`,
              textAlign: textAlign,
              ...block.style, 
            }}
          />
        ))}
      </div>

      <div className="toolContainer">
        <select
          onChange={(e) => applyStyleToSelected("fontFamily", e.target.value)}
          className="fontFam"
        >
          <option value='none'>Font</option>
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Verdana">Verdana</option>
          <option value="Georgia">Georgia</option>
          <option value="Tahoma">Tahoma</option>
          <option value="Impact">Impact</option>
          <option value="Comic Sans MS">Comic Sans MS</option>
        </select>

        {/* Font Size Control */}
        <div className="fontSizeControl">
          <button onClick={() => handleFontSizeChange(-1)}>-</button>
          <span>{fontSize}</span>
          <button onClick={() => handleFontSizeChange(1)}>+</button>
        </div>

        {/* Rich Text Editor Tools */}
        <div className="borderlessTools">
          <button onClick={() => applyStyleToSelected("fontWeight", "bold", true)} className="borderless">
            <img src="../src/assets/bold.png" className="boldImg" alt="Bold"/>
          </button>

          <button onClick={() => applyStyleToSelected("fontStyle", "italic", true)} className="borderless">
            <img src="../src/assets/italic.png" className="italicImg" alt="Italic"/>
          </button>

          <button onClick={() => applyStyleToSelected("textDecoration", "underline", true)} className="borderless">
            <img src="../src/assets/underline.png" className="underlineImg" alt="Underline"/>
          </button>

          <button onClick={handleTextAlignToggle} className="borderless">
            <img src="../src/assets/center.png" className="aligncenterImg" alt="Center Align"/>
          </button>
        </div>

      </div>
    </div>
  );
};
Hero.propTypes = {
  textBlocks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      top: PropTypes.number.isRequired,
      left: PropTypes.number.isRequired,
      style: PropTypes.object
    })
  ).isRequired,
  updateTextBlock: PropTypes.func.isRequired
};

export default Hero;














