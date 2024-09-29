import React from 'react'

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="relative w-10 h-10">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="absolute w-2 h-2 bg-green-600 rounded-full transform"
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${index * 45}deg) translate(0, -150%)`,
              opacity: 1 - index * 0.1,
              animation: `spin 1s linear infinite`,
              animationDelay: `${index * 0.125}s`,
            }}
          />
        ))}
      </div>
      <style jsx>{`
        @keyframes spin {
          0% {
            opacity: 0.1;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}