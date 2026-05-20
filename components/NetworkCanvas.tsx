'use client';

import { useEffect, useRef } from 'react';

interface CanvasNode {
  x: number; y: number; baseRadius: number; radius: number;
  vx: number; vy: number; color: string;
}

export default function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      
      canvas.width = newWidth * dpr;
      canvas.height = newHeight * dpr;
      
      canvasWidth = newWidth;
      canvasHeight = newHeight;
      
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();

    const nodes: CanvasNode[] = [];
    const numNodes = 90;
    let mouseX: number | null = null;
    let mouseY: number | null = null;
    const attractionRadius = 190;
    const attractionStrength = 0.04;

    function createNode(x: number, y: number): CanvasNode {
      return {
        x, y,
        baseRadius: Math.random() * 2 + 1,
        radius: 0,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        color: `rgba(100, 100, 100, ${Math.random() * 0.7 + 0.3})`,
      };
    }

    function updateNode(node: CanvasNode) {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x + node.radius > canvasWidth || node.x - node.radius < 0) node.vx *= -1;
      if (node.y + node.radius > canvasHeight || node.y - node.radius < 0) node.vy *= -1;

      if (mouseX !== null && mouseY !== null) {
        const dx = mouseX - node.x;
        const dy = mouseY - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < attractionRadius) {
          const angle = Math.atan2(dy, dx);
          node.x += Math.cos(angle) * attractionStrength * (attractionRadius - distance);
          node.y += Math.sin(angle) * attractionStrength * (attractionRadius - distance);
          node.radius = node.baseRadius * 1.2;
        } else {
          node.radius = node.baseRadius;
        }
      } else {
        node.radius = node.baseRadius;
      }

      if (!ctx) return;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.fill();
      ctx.closePath();
    }

    function connectNodes() {
      if (!ctx) return;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 80) {
            const alpha = 1 - distance / 80;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(100, 100, 100, ${alpha * 1})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            ctx.closePath();
          }
        }
      }
    }

    function init() {
      nodes.length = 0;
      for (let i = 0; i < numNodes; i++) {
        const node = createNode(Math.random() * canvasWidth, Math.random() * canvasHeight);
        node.radius = node.baseRadius;
        nodes.push(node);
      }
    }

    function animate() {
      requestAnimationFrame(animate);
      if (!ctx) return;
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      for (let i = 0; i < nodes.length; i++) {
        updateNode(nodes[i]);
      }

      connectNodes();
    }

    init();
    animate();

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const handleMouseOut = () => {
      mouseX = null;
      mouseY = null;
    };

    let resizeTimeout: ReturnType<typeof setTimeout>;
    
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
        init();
      }, 100);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas 
    ref={canvasRef} 
    className="network-canvas" 
    style={{ 
      display: 'block',
      width: '100vw', 
      height: '100vh' 
    }} 
  />;
}
