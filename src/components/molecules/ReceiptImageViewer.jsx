import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const ReceiptImageViewer = ({ isOpen, onClose, imageUrl, imageName = "Receipt" }) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
      setImageLoaded(false);
    }
  }, [isOpen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        case '0':
          handleZoomReset();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, onClose]);

  // Zoom functions
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.5, 5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.5, 0.5));
    // Reset position if zooming out too much
    if (zoom <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  }, [zoom]);

  const handleZoomReset = useCallback(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  // Mouse wheel zoom
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    setZoom(prev => Math.max(0.5, Math.min(5, prev + delta)));
  }, []);

  // Mouse drag functionality
  const handleMouseDown = useCallback((e) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  }, [zoom, position]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || zoom <= 1) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isDragging, dragStart, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch support for mobile
  const handleTouchStart = useCallback((e) => {
    if (zoom <= 1) return;
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    });
  }, [zoom, position]);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || zoom <= 1) return;
    e.preventDefault();
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    });
  }, [isDragging, dragStart, zoom]);

  if (!isOpen || !imageUrl) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        {/* Header with controls */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ delay: 0.1 }}
          className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent"
        >
          <div className="text-white">
            <h3 className="text-lg font-semibold">{imageName}</h3>
            <p className="text-sm text-gray-300">
              Zoom: {Math.round(zoom * 100)}%
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <ApperIcon name="ZoomOut" size={16} />
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={handleZoomReset}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 min-w-[60px]"
            >
              Reset
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 5}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <ApperIcon name="ZoomIn" size={16} />
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <ApperIcon name="X" size={16} />
            </Button>
          </div>
        </motion.div>

        {/* Image container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ delay: 0.1 }}
          className="relative w-full h-full flex items-center justify-center p-4 pt-20 pb-20"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
        >
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-center">
                <ApperIcon name="Loader" size={32} className="animate-spin mx-auto mb-2" />
                <p>Loading image...</p>
              </div>
            </div>
          )}
          
          <motion.img
            src={imageUrl}
            alt={imageName}
            className="max-w-none select-none"
            style={{
              transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
              transition: isDragging ? 'none' : 'transform 0.1s ease-out'
            }}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              console.error('Failed to load image');
              setImageLoaded(true);
            }}
            draggable={false}
          />
        </motion.div>

        {/* Bottom instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.2 }}
          className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-black/50 to-transparent"
        >
          <div className="text-center text-white">
            <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-300">
              <span className="flex items-center gap-1">
                <ApperIcon name="MousePointer" size={14} />
                Scroll to zoom
              </span>
              <span className="flex items-center gap-1">
                <ApperIcon name="Move" size={14} />
                Drag to pan
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white/10 rounded text-xs">ESC</kbd>
                Close
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReceiptImageViewer;