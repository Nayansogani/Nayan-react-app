import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ITEM_TYPE } from './Simulation'; // Adjust the import path as needed
import buildingIcon from '../assets/buildingicon.png';

// DraggableBuildingIcon Component
export const DraggableBuildingIcon = () => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <img
      ref={drag}
      src={buildingIcon}
      alt="Building Icon"
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        width: '50px',
        height: '50px',
        cursor: 'pointer',
        opacity: isDragging ? 0.5 : 1,
      }}
    />
  );
};

// DropZone Component
export const DropZone = ({ onDrop }) => {
  const [, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: () => onDrop(),
  }));

  return (
    <div
      ref={drop}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    />
  );
};
