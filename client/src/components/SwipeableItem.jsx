import { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '../utils/cn';
import { Trash2 } from 'lucide-react';

const SWIPE_THRESHOLD = 40;
const ACTION_WIDTH = 80;
const VERTICAL_THRESHOLD = 10;

// Haptic feedback with visual fallback
const triggerHaptic = () => {
  if (navigator.vibrate) {
    navigator.vibrate(10);
  }
};

export const SwipeableItem = ({
  children,
  onDelete,
  isOpen,
  onOpenChange,
  disabled = false,
  className,
}) => {
  const containerRef = useRef(null);
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  const startX = useRef(0);
  const startY = useRef(0);
  const currentX = useRef(0);
  const isVerticalScroll = useRef(false);

  // Sync with external open state
  useEffect(() => {
    if (isOpen) {
      setTranslateX(-ACTION_WIDTH);
    } else {
      setTranslateX(0);
    }
  }, [isOpen]);

  // Check if device supports fine pointer (desktop)
  const isFinePointer = useCallback(() => {
    return window.matchMedia('(pointer: fine)').matches;
  }, []);

  const handleTouchStart = useCallback((e) => {
    if (disabled || isFinePointer()) return;
    
    const touch = e.touches[0];
    startX.current = touch.clientX;
    startY.current = touch.clientY;
    currentX.current = translateX;
    isVerticalScroll.current = false;
    setIsDragging(true);
  }, [disabled, translateX, isFinePointer]);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || disabled) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - startX.current;
    const deltaY = touch.clientY - startY.current;

    // Detect vertical scroll and cancel swipe
    if (!isVerticalScroll.current && Math.abs(deltaY) > VERTICAL_THRESHOLD && Math.abs(deltaY) > Math.abs(deltaX)) {
      isVerticalScroll.current = true;
      setIsDragging(false);
      setTranslateX(isOpen ? -ACTION_WIDTH : 0);
      return;
    }

    if (isVerticalScroll.current) return;

    // Prevent default to stop scroll while swiping horizontally
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      e.preventDefault();
    }

    let newTranslateX = currentX.current + deltaX;
    
    // Clamp values: can't swipe right past 0, can't swipe left past action width
    newTranslateX = Math.max(-ACTION_WIDTH, Math.min(0, newTranslateX));
    
    setTranslateX(newTranslateX);
  }, [isDragging, disabled, isOpen]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging || isVerticalScroll.current) {
      setIsDragging(false);
      return;
    }

    setIsDragging(false);

    // Determine if we should open or close based on threshold
    if (translateX < -SWIPE_THRESHOLD) {
      setTranslateX(-ACTION_WIDTH);
      onOpenChange?.(true);
      triggerHaptic();
    } else {
      setTranslateX(0);
      onOpenChange?.(false);
    }
  }, [isDragging, translateX, onOpenChange]);

  const handleDelete = useCallback(() => {
    setIsPressed(true);
    triggerHaptic();
    
    setTimeout(() => {
      setIsPressed(false);
      onDelete?.();
    }, 100);
  }, [onDelete]);

  // Close when clicking outside
  const handleClickOutside = useCallback((e) => {
    if (isOpen && containerRef.current && !containerRef.current.contains(e.target)) {
      onOpenChange?.(false);
    }
  }, [isOpen, onOpenChange]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
    >
      {/* Action layer (delete button) */}
      <div
        className="absolute inset-y-0 right-0 flex items-center justify-center bg-destructive"
        style={{ width: ACTION_WIDTH }}
      >
        <button
          onClick={handleDelete}
          className={cn(
            'flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center text-white transition-transform',
            isPressed && 'scale-95'
          )}
          aria-label="Delete"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      {/* Swipeable content */}
      <div
        className={cn(
          'relative bg-background',
          !isDragging && 'transition-transform duration-200 ease-out'
        )}
        style={{ transform: `translateX(${translateX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
};
