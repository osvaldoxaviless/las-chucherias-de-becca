import React from 'react';

interface Props {
  atmosphere?: 'none' | 'snow' | 'hearts' | 'flowers' | 'bats' | 'sparkles';
  enabled?: boolean;
}

export const SeasonalAtmosphere: React.FC<Props> = ({ atmosphere = 'none', enabled = true }) => {
  if (!enabled || atmosphere === 'none') return null;

  const getParticles = () => {
    switch (atmosphere) {
      case 'snow':
        return [
          { symbol: '❄', className: 'animate-seasonal-fall', style: { left: '8%', top: '5%', animationDuration: '6s', animationDelay: '0s', fontSize: '18px' } },
          { symbol: '❅', className: 'animate-seasonal-fall', style: { left: '22%', top: '10%', animationDuration: '8s', animationDelay: '2s', fontSize: '14px' } },
          { symbol: '❄', className: 'animate-seasonal-fall', style: { left: '45%', top: '2%', animationDuration: '7s', animationDelay: '1s', fontSize: '20px' } },
          { symbol: '❅', className: 'animate-seasonal-fall', style: { left: '72%', top: '8%', animationDuration: '7.5s', animationDelay: '3s', fontSize: '16px' } },
          { symbol: '❄', className: 'animate-seasonal-fall', style: { left: '88%', top: '4%', animationDuration: '6.5s', animationDelay: '1.5s', fontSize: '18px' } },
          { symbol: '✨', className: 'animate-seasonal-fall', style: { left: '60%', top: '15%', animationDuration: '9s', animationDelay: '2.5s', fontSize: '12px' } },
        ];
      case 'hearts':
        return [
          { symbol: '💕', className: 'animate-seasonal-rise', style: { left: '12%', bottom: '15%', animationDuration: '6s', animationDelay: '0.5s', fontSize: '16px' } },
          { symbol: '💖', className: 'animate-seasonal-rise', style: { left: '28%', bottom: '25%', animationDuration: '7.5s', animationDelay: '2s', fontSize: '14px' } },
          { symbol: '♥', className: 'animate-seasonal-rise', style: { left: '52%', bottom: '10%', animationDuration: '6.5s', animationDelay: '1s', fontSize: '18px', color: '#ff4d6d' } },
          { symbol: '💕', className: 'animate-seasonal-rise', style: { left: '78%', bottom: '20%', animationDuration: '8s', animationDelay: '2.8s', fontSize: '15px' } },
          { symbol: '✨', className: 'animate-seasonal-rise', style: { left: '88%', bottom: '30%', animationDuration: '7s', animationDelay: '1.8s', fontSize: '14px' } },
        ];
      case 'flowers':
        return [
          { symbol: '🌸', className: 'animate-seasonal-fall', style: { left: '10%', top: '5%', animationDuration: '7s', animationDelay: '0s', fontSize: '18px' } },
          { symbol: '🌼', className: 'animate-seasonal-fall', style: { left: '30%', top: '12%', animationDuration: '8.5s', animationDelay: '2.2s', fontSize: '15px' } },
          { symbol: '🌸', className: 'animate-seasonal-fall', style: { left: '58%', top: '2%', animationDuration: '6.8s', animationDelay: '1.2s', fontSize: '16px' } },
          { symbol: '🌷', className: 'animate-seasonal-fall', style: { left: '82%', top: '8%', animationDuration: '7.8s', animationDelay: '3.1s', fontSize: '17px' } },
        ];
      case 'bats':
        return [
          { symbol: '🦇', className: 'animate-seasonal-rise', style: { left: '15%', bottom: '20%', animationDuration: '6s', animationDelay: '0s', fontSize: '16px' } },
          { symbol: '🎃', className: 'animate-seasonal-fall', style: { left: '35%', top: '5%', animationDuration: '7.5s', animationDelay: '1.5s', fontSize: '16px' } },
          { symbol: '✨', className: 'animate-seasonal-fall', style: { left: '65%', top: '10%', animationDuration: '6.8s', animationDelay: '2s', fontSize: '14px' } },
          { symbol: '🦇', className: 'animate-seasonal-rise', style: { left: '85%', bottom: '15%', animationDuration: '8s', animationDelay: '2.7s', fontSize: '15px' } },
        ];
      case 'sparkles':
      default:
        return [
          { symbol: '✨', className: 'animate-float-slow', style: { left: '14%', top: '18%', fontSize: '15px', opacity: 0.6 } },
          { symbol: '✨', className: 'animate-float-delayed', style: { right: '18%', top: '25%', fontSize: '16px', opacity: 0.6 } },
          { symbol: '✨', className: 'animate-float-gentle', style: { left: '32%', bottom: '22%', fontSize: '13px', opacity: 0.5 } },
          { symbol: '✨', className: 'animate-float-slow', style: { right: '35%', bottom: '15%', fontSize: '14px', opacity: 0.55 } },
        ];
    }
  };

  const particles = getParticles();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {particles.map((p, index) => (
        <span
          key={index}
          className={`absolute opacity-60 ${p.className}`}
          style={p.style}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
};
