"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface Pipe {
  x: number;
  topHeight: number;
  bottomHeight: number;
  passed: boolean;
}

export default function Home() {
  const [gameState, setGameState] = useState<
    "waiting" | "playing" | "gameOver"
  >("waiting");
  const [score, setScore] = useState(0);
  const [birdY, setBirdY] = useState(200);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState<Pipe[]>([]);

  const gameWidth = 400;
  const gameHeight = 600;
  const birdSize = 40;
  const pipeWidth = 50;
  const pipeGap = 120;
  const gravity = 0.5;
  const jumpForce = -8;
  const pipeSpeed = 2;

  const jump = useCallback(() => {
    if (gameState === "waiting") {
      setGameState("playing");
      setBirdVelocity(jumpForce);
    } else if (gameState === "playing") {
      setBirdVelocity(jumpForce);
    } else if (gameState === "gameOver") {
      setGameState("waiting");
      setBirdY(200);
      setBirdVelocity(0);
      setPipes([]);
      setScore(0);
    }
  }, [gameState, jumpForce]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [jump]);

  useEffect(() => {
    if (gameState !== "playing") return;

    const gameLoop = setInterval(() => {
      setBirdY((prevY) => {
        const newY = prevY + birdVelocity;
        if (newY < 0 || newY > gameHeight - birdSize) {
          setGameState("gameOver");
          return prevY;
        }
        return newY;
      });

      setBirdVelocity((prevVelocity) => prevVelocity + gravity);

      setPipes((prevPipes) => {
        const newPipes = prevPipes
          .map((pipe) => ({
            ...pipe,
            x: pipe.x - pipeSpeed,
          }))
          .filter((pipe) => pipe.x > -pipeWidth);

        if (
          newPipes.length === 0 ||
          newPipes[newPipes.length - 1].x < gameWidth - 180
        ) {
          const topHeight = Math.random() * (gameHeight - pipeGap - 120) + 60;
          newPipes.push({
            x: gameWidth,
            topHeight,
            bottomHeight: gameHeight - topHeight - pipeGap,
            passed: false,
          });
        }

        newPipes.forEach((pipe) => {
          if (!pipe.passed && pipe.x + pipeWidth < gameWidth / 2) {
            pipe.passed = true;
            setScore((prevScore) => prevScore + 1);
          }

          const birdLeft = gameWidth / 2 - birdSize / 2 + 6;
          const birdRight = gameWidth / 2 + birdSize / 2 - 6;
          const birdTop = birdY + 6;
          const birdBottom = birdY + birdSize - 6;

          if (
            birdRight > pipe.x + 5 &&
            birdLeft < pipe.x + pipeWidth - 5 &&
            (birdTop < pipe.topHeight - 5 ||
              birdBottom > gameHeight - pipe.bottomHeight + 5)
          ) {
            setGameState("gameOver");
          }
        });

        return newPipes;
      });
    }, 16);

    return () => clearInterval(gameLoop);
  }, [gameState, birdVelocity, birdY]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{ background: 'linear-gradient(180deg, #BF5700 0%, #404040 100%)' }}>
      <div
        className="relative overflow-hidden cursor-pointer shadow-2xl"
        style={{ 
          width: gameWidth, 
          height: gameHeight,
          background: 'linear-gradient(180deg, #BF5700 0%, #404040 100%)'
        }}
        onClick={jump}
      >
        <Image
          src="/bevo.png"
          alt="Bevo"
          width={birdSize}
          height={birdSize}
          className="absolute z-20 drop-shadow-md"
          style={{
            left: gameWidth / 2 - birdSize / 2,
            top: birdY,
            transform: `rotate(${Math.min(
              Math.max(birdVelocity * 2, -20),
              20
            )}deg)`,
          }}
        />


        {pipes.map((pipe, index) => (
          <div key={index}>
            <img
              src="/tower.png"
              alt="Tower Top"
              className="absolute z-10 drop-shadow-md rotate-180"
              style={{
                left: pipe.x,
                top: 0,
                width: pipeWidth,
                height: pipe.topHeight,
              }}
            />
            <img
              src="/tower.png"
              alt="Tower Bottom"
              className="absolute z-10 drop-shadow-md"
              style={{
                left: pipe.x,
                top: gameHeight - pipe.bottomHeight,
                width: pipeWidth,
                height: pipe.bottomHeight,
              }}
            />

          </div>
        ))}

        <div className="absolute top-6 left-4 font-bold z-30 text-2xl text-white font-mono text-outline-black">
          {score}
        </div>

        {gameState === "waiting" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-40">
            <div className="text-center px-6 py-4 rounded-lg bg-black/80 border-4 border-white">
              <div className="text-white text-3xl font-bold font-mono mb-4 text-outline-black">
                FLAPPY BEVO
              </div>
              <div className="text-white text-base font-mono text-outline-black">
                TAP TO PLAY
              </div>
            </div>
          </div>
        )}

        {gameState === "gameOver" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-40">
            <div className="text-center px-6 py-4 rounded-lg bg-black/80 border-4 border-white">
              <div className="text-white text-2xl font-bold font-mono mb-2 text-outline-black">
                GAME OVER
              </div>
              <div className="text-white text-xl font-mono mb-4 text-outline-black">
                SCORE: {score}
              </div>
              <div className="text-white text-base font-mono text-outline-black">
                TAP TO RESTART
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
