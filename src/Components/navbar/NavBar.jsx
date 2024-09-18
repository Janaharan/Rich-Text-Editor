/* eslint-disable react/prop-types */
import './NavBar.css';

const NavBar = ({ onUndo, onRedo }) => {
  return (
    <nav className='navContainer'>
      <div className="navLeft">
      </div>

      <div className="navRight">
        <div onClick={onUndo}>
          <img className='undo-icon' src="src/assets/undo.png" alt="undo icon" />
          <p>Undo</p>
        </div>
        <div onClick={onRedo}>
          <img className='redo-icon' src="src/assets/redo.png" alt="redo icon" />
          <p>Redo</p>
        </div>
      </div>
    </nav>
  )
}

export default NavBar;
