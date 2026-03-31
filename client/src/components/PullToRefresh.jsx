import { useState, useRef, useCallback } from 'react';
import { cn } from '../utils/cn';
import { RefreshCw } from 'lucide-react';

const PULL_THRESHOLD = 80;
const MAX_PULL = 120;

export const PullToRefresh = ({
  children,
  onRefresh,
  disabled = false,
  className,
}) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | pulling | release | refreshing
  
  const containerRef = useRef(null);
  const startY = useRef(0);
  const isPulling = useRef(false);

  const canPull = useCallback(() => {
    if (!containerRef.current) return false;
    // Only allow pull when scrolled to top
    return containerRef.current.scrollTop <= 0;
  }, []);

  const handleTouchStart = useCallback((e) => {
    if (disabled || isRefreshing || !canPull()) return;
    
    startY.current = e.touches[0].clientY;
    isPulling.current = true;
  }, [disabled, isRefreshing, canPull]);

  const handleTouchMove = useCallback((e) => {
    if (!isPulling.current || disabled || isRefreshing) return;
    
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY.current;

    // Only pull down, not up
    if (deltaY < 0) {
      setPullDistance(0);
      setStatus('idle');
      return;
    }

    // Check if we can pull (at top of scroll)
    if (!canPull()) {
      isPulling.current = false;
      setPullDistance(0);
      setStatus('idle');
      return;
    }

    // Apply resistance to pull
    const resistance = 0.5;
    const pull = Math.min(deltaY * resistance, MAX_PULL);
    
    setPullDistance(pull);
    setStatus(pull >= PULL_THRESHOLD ? 'release' : 'pulling');

    // Prevent default scroll when pulling
    if (pull > 0) {
      e.preventDefault();
    }
  }, [disabled, isRefreshing, canPull]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling.current || disabled) return;
    
    isPulling.current = false;

    if (pullDistance >= PULL_THRESHOLD && onRefresh) {
      setStatus('refreshing');
      setIsRefreshing(true);
      setPullDistance(PULL_THRESHOLD);

      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
        setStatus('idle');
      }
    } else {
      setPullDistance(0);
      setStatus('idle');
    }
  }, [pullDistance, onRefresh, disabled]);

  const getStatusText = () => {
    switch (status) {
      case 'pulling':
        return 'Pull to refresh';
      case 'release':
        return 'Release to refresh';
      case 'refreshing':
        return 'Refreshing...';
      default:
        return '';
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-auto', className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div
        className={cn(
          'absolute left-0 right-0 flex flex-col items-center justify-center overflow-hidden transition-opacity',
          pullDistance > 0 ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          height: pullDistance,
          top: 0,
          zIndex: 10,
        }}
      >
        <RefreshCw
          className={cn(
            'h-6 w-6 text-muted-foreground transition-transform',
            status === 'refreshing' && 'animate-spin',
            status === 'release' && 'text-primary'
          )}
          style={{
            transform: status !== 'refreshing' 
              ? `rotate(${(pullDistance / MAX_PULL) * 360}deg)` 
              : undefined,
          }}
        />
        <span className="mt-1 text-xs text-muted-foreground">
          {getStatusText()}
        </span>
      </div>

      {/* Content with transform */}
      <div
        className={cn(
          'relative',
          !isPulling.current && 'transition-transform duration-200 ease-out'
        )}
        style={{
          transform: `translateY(${pullDistance}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
