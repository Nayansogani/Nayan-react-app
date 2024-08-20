import React, { useState } from 'react';
import building1Image from './assets/building1.png';
import building2Image from './assets/building2.png';
import manImage from './assets/man.png';
import manHandImage from './assets/man_hand.png';
import cameraHandImage from './assets/camera_in_man_hand.png';
import cameraDisplayImage from './assets/camera.png';
import boyImage from './assets/boy_image.png';
import buildingCameraImage from './assets/building2_pic.png';
import backgroundImage from './assets/background_image.png';

const Simulation = () => {
  // Adjustable states
  const [building2Height, setBuilding2Height] = useState(400); // Initial height of building2
  const [handAngle, setHandAngle] = useState(12); // Angle of the man's hand

  // Fixed positions
  const building1Position = { x: 110, y: 400 }; // Position of building1 (center)
  const manPosition = { x: building1Position.x + 50, y: building1Position.y - 100 }; // Position of the man standing on building1
  const building2Position = { x: 1020, y: 400 - building2Height }; // Position of building2 (right)

  // Calculate the angle using tan-1(p/h)
  const calculateAngle = () => {
    const deltaY = (400 - building2Height) - manPosition.y; // Vertical distance (building2 top - man)
    const deltaX = building2Position.x - manPosition.x; // Horizontal distance (between buildings)
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI); // Angle in degrees

    return angle+2*(-angle);
  };

  const distance = Math.abs(building2Position.x - manPosition.x); // Distance between man and building2
  const calculatedAngle = calculateAngle(); // Calculated angle between man and building2

  // Convert hand angle to radians for the dotted line's endpoint
  const handAngleRadians = (handAngle * Math.PI) / 180;

  // Calculation of the endpoint of the dotted line based on the hand rotation
  const lineLength = 300; 
  const lineEndX = manPosition.x + 476 + 70 + lineLength * Math.cos(handAngleRadians);
  const lineEndY = manPosition.y - 40 - lineLength * Math.sin(handAngleRadians);

  // Calculation of  the angle between the dotted line and the horizontal line
  const angleBetweenLines = Math.abs(handAngle);

  // taking picture code
  const handleTakePicture = () => {
    if (Math.abs(calculatedAngle - handAngle) < 2) { // Tolerance of 2 degrees
      alert('Picture taken successfully!');
    } else {
      alert('Adjust the camera!');
    }
  };

  return (
    <div
      className="simulation-container"
      style={{
        position: 'relative',
        height: '100vh',
        backgroundImage: `url(${backgroundImage})`, // Setting up of background
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat', 
      }}
    >
     
      <div
        className="building1"
        style={{
          position: 'absolute',
          left: `${building1Position.x}px`,
          bottom: '0px',
          backgroundImage: `url(${building1Image})`,
          width: '600px',
          height: '400px',
          backgroundSize: 'cover',
        }}
      >
        
        <div
          className="man"
          style={{
            position: 'absolute',
            left: '476px',
            bottom: '100px',
            width: '100px',
            height: '200px',
            backgroundImage: `url(${manImage})`,
            backgroundSize: 'cover',
          }}
        >
          {/* Rotatable Hand holding the camera */}
          <div
            className="man-hand"
            style={{
              position: 'absolute',
              left: '70px', // Adjusting the  position the hand relative to the body
              top: '40px',  // Adjusting the position the hand relative to the body
              width: '60px',
              height: '60px',
              backgroundImage: `url(${manHandImage})`,
              backgroundSize: 'cover',
              transform: `rotate(${-handAngle}deg)`,
              transformOrigin: '10px 20px', // simulating shoulder rotation
            }}
          >
            {/* Camera held in the hand */}
            <div
              className="camera-hand"
              style={{
                position: 'absolute',
                left: '43px',
                top: '10px',
                width: '52px',
                height: '40px',
                backgroundImage: `url(${cameraHandImage})`,
                backgroundSize: 'cover',
              }}
            />
          </div>
        </div>
      </div>

      {/* Line representing the angle */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none', 
        }}
      >
        {/* Dotted line from the man's hand representing the angle */}
        <line
          x1={manPosition.x + 476 + 70} // Starting x (adjusted for hand position)
          y1={350} // Starting y (adjusted for hand position)
          x2={lineEndX} // Dynamic end x based on hand angle
          y2={lineEndY+87} // Dynamic end y based on hand angle
          stroke="black"
          strokeWidth="1"
          strokeDasharray="3,3"
        />

        {/* Horizontal reference line from the man's hand */}
        <line
          x1={manPosition.x + 476 + 70} // Starting x
          y1={350} // Starting y
          x2={manPosition.x + 476 + 300} // Horizontal end x
          y2={350} // Keep the y-coordinate the same for a horizontal line
          stroke="black"
          strokeWidth="1"
        />

        {/* Text displaying the angle between the lines */}
        <text
          x={manPosition.x + 576} // Position the text in the middle
          y={340} // Position above the lines
          fill="black"
          fontSize="16"
          fontWeight="bold"
        >
          {angleBetweenLines.toFixed(2)}°
        </text>
      </svg>

      {/* Building2 (Right) */}
      <div
        className="building2"
        style={{
          position: 'absolute',
          left: `${building2Position.x}px`,
          bottom: '0px',
          backgroundImage: `url(${building2Image})`,
          width: '200px',
          height: `${building2Height}px`,
          backgroundSize: 'cover',
        }}
      >
      </div>

      {/* Camera Display (Middle Top) */}
      <div
        className="camera-display"
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          top: '20px',
          width: '150px',
          height: '112px',
          backgroundImage: `url(${cameraDisplayImage})`,
          backgroundSize: 'cover',
        }}
      >
        {/* Displaying the boy image if the hand angle is approximately correct we are taking +- 2 */}
        {Math.abs(calculatedAngle - handAngle) < 2 && (
          <img
            src={boyImage}
            alt="Boy"
            style={{
              position: 'absolute',
              width: '76px',
              height: '63px',
              left: '9px',
              top: '37px',
            }}
          />
        )}
        {/* Displaying the building image if the hand angle is less than the calculated angle */}
        {handAngle < calculatedAngle && Math.abs(calculatedAngle - handAngle) >= 2 && (
          <div
            style={{
              position: 'absolute',
              left: '9px',
              top: '40px',
              width: '74px',
              height: '57px',
              backgroundImage: `url(${buildingCameraImage})`,
              backgroundSize: 'cover',
            }}
          />
        )}
      </div>

      {/* Controls */}
      <div style={{ 
          position: 'absolute', 
          top: '20px', 
          left: '20px', 
          padding: '10px', 
          border: '1px solid #ccc', 
          backgroundColor: '#f9f9f9', 
          borderRadius: '10px',
          width: '250px'
        }}>
        <div>
          <label>Building2 Height: {building2Height}px</label>
          <input
            type="range"
            min="100"
            max="600"
            value={building2Height}
            onChange={(e) => setBuilding2Height(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label>Hand Angle: {handAngle}°</label>
          <input
            type="range"
            min="-90"
            max="90"
            value={handAngle}
            onChange={(e) => setHandAngle(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
        <button 
          onClick={handleTakePicture} 
          style={{
            marginTop: '10px',
            padding: '5px',
            width: '100%',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Take Picture
        </button>

        {/* Displaying Building2 Height, Distance, and Angle */}
        <div style={{ marginTop: '20px' }}>
          <p>Building2 Height: {building2Height}px</p>
          <p>Distance between Man and Building2: {distance}px</p>
          <p>Calculated Angle: {calculatedAngle.toFixed(2)}°</p>
        </div>
      </div>
    </div>
  );
};

export default Simulation;
