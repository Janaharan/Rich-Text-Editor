import "./Footer.css";

// eslint-disable-next-line react/prop-types
const Footer = ({ addTextBlock }) => {
  return (
    <div className="buttonContainer">
      <div className="textButton" onClick={addTextBlock}>
        <img className="tImg" src="./src/assets/T.svg" alt="" />
        <p>Add text</p>
      </div>
    </div>
  );
};

export default Footer;
