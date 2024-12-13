import React from "react";

const PictureCard = ({ url }) => {
  return (
    <div className="pictureCard">
      <figure>
        <img className="Image" src={`${url}`} />
        <figcaption
          style={{
            position: "absolute",
            bottom: "10px",
            left: "30px",
            color: "white",
          }}
        >
          <h3>
            HOW ABOUT
            <br /> THIS PHOTO?
          </h3>
        </figcaption>
      </figure>
    </div>
  );
};

export default PictureCard;
