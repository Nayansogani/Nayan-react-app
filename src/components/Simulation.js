import React, { useState, useRef, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DraggableBuildingIcon, DropZone } from './DraggableComponents'; // Adjust import path as needed
import building1Image from '../assets/building1.png';
import building2Image from '../assets/building2.png';
import manImage from '../assets/man.png';
import manHandImage from '../assets/man_hand.png';
import cameraHandImage from '../assets/camera_in_man_hand.png';
import cameraDisplayImage from '../assets/camera.png';
import boyImage from '../assets/boy_image.png';
import buildingCameraImage from '../assets/building2_pic.png';
import backgroundImage from '../assets/background_image.png';

export const ITEM_TYPE = 'BUILDING_ICON';

const Simulation = () => {
  const [building2Visible, setBuilding2Visible] = useState(false);
  const [building2Height, setBuilding2Height] = useState(400);
  const [handAngle, setHandAngle] = useState(12);
  const [manPosition, setManPosition] = useState(160); // Initial x position within building1
  const [isDragging, setIsDragging] = useState(false);
  const manRef = useRef(null);

  const building1Position = { x: 110, y: 400 };
  const building1Width = 600; // Width of building1

  const building2Position = { x: 1020, y: 400 - building2Height };

  const calculateAngle = () => {
    const deltaY = (400 - building2Height) - (400 - 100); // Using y-coordinate directly
    const deltaX = building2Position.x - manPosition;
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    return angle + 2 * (-angle);
  };

  const distance = Math.abs(building2Position.x - manPosition);
  const calculatedAngle = calculateAngle();

  const handAngleRadians = (handAngle * Math.PI) / 180;
  const lineLength = 300;
  const lineEndX = manPosition + 476 + 70 + lineLength * Math.cos(handAngleRadians);
  const lineEndY = (400 - 100) - 40 - lineLength * Math.sin(handAngleRadians); // Using y-coordinate directly

  const angleBetweenLines = Math.abs(handAngle);

  const handleTakePicture = () => {
    if (Math.abs(calculatedAngle - handAngle) < 2) {
      alert('Picture taken successfully!');
    } else {
      alert('Adjust the camera!');
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const boundingRect = manRef.current.parentElement.getBoundingClientRect();
      const newManPositionX = e.clientX - boundingRect.left;

      // Restrict the man's position within the boundaries of building1
      setManPosition(Math.min(
        Math.max(building1Position.x, newManPositionX),
        building1Position.x + building1Width
      ));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className="simulation-container"
        style={{
          position: 'relative',
          height: '100vh',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <DropZone onDrop={() => setBuilding2Visible(true)} />
        <DraggableBuildingIcon />

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
            ref={manRef}
            className="man"
            style={{
              position: 'absolute',
              left: `${manPosition}px`,
              bottom: '100px',
              width: '100px',
              height: '200px',
              backgroundImage: `url(${manImage})`,
              backgroundSize: 'cover',
              cursor: 'pointer',
            }}
            onMouseDown={handleMouseDown}
          >
            <div
              className="man-hand"
              style={{
                position: 'absolute',
                left: '70px',
                top: '40px',
                width: '60px',
                height: '60px',
                backgroundImage: `url(${manHandImage})`,
                backgroundSize: 'cover',
                transform: `rotate(${-handAngle}deg)`,
                transformOrigin: '10px 20px',
              }}
            >
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
          <text
            x={manPosition + 576}
            y={340}
            fill="black"
            fontSize="16"
            fontWeight="bold"
          >
            {angleBetweenLines.toFixed(2)}°
          </text>
        </svg>

        {building2Visible && (
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
          />
        )}

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

        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            padding: '10px',
            border: '1px solid #ccc',
            backgroundColor: '#f9f9f9',
            borderRadius: '10px',
            width: '250px',
          }}
        >
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
              //value={handAngle}
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
              cursor: 'pointer',
            }}
          >
            Take Picture
          </button>

          <div style={{ marginTop: '20px' }}>
            <p>Building2 Height: {building2Height}px</p>
            <p>Distance between Man and Building2: {distance}px</p>
            <p>Calculated Angle: {calculatedAngle.toFixed(2)}°</p>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default Simulation;
