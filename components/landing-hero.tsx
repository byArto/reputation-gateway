"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"

const stats = [
  { value: 37000, label: "Profiles", sublabel: "Verified on-chain identities", suffix: "+" },
  { value: 640000, label: "Reviews", sublabel: "Community endorsements", suffix: "+" },
  { value: 3.3, label: "TVL", sublabel: "Total value locked", suffix: "m" },
]

const features = [
  {
    icon: "🔒",
    title: "One-Time Tokens",
    description: "Secure access links that can't be shared. Each token works only once and expires in 24 hours."
  },
  {
    icon: "⚡",
    title: "Instant Validation",
    description: "Automatic reputation checks through Ethos Network API. No manual review needed."
  },
  {
    icon: "📊",
    title: "Real-Time Dashboard",
    description: "Monitor applications, acceptance rates, and user scores in one central dashboard."
  },
  {
    icon: "🎯",
    title: "Flexible Criteria",
    description: "Set custom requirements: minimum score, vouches, reviews, and account age."
  }
]

export default function LandingHero() {
  const router = useRouter()
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Create particles (reduced to 20)
    const particlesContainer = document.getElementById('particles')
    if (particlesContainer) {
      const particleTypes = ['particle-1', 'particle-2']

      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div')
        particle.className = `particle ${particleTypes[Math.floor(Math.random() * particleTypes.length)]}`
        particle.style.left = Math.random() * 100 + '%'
        particle.style.top = Math.random() * 100 + '%'
        particle.style.setProperty('--tx', (Math.random() - 0.5) * 300 + 'px')
        particle.style.setProperty('--ty', (Math.random() - 0.5) * 300 + 'px')
        particle.style.animationDelay = Math.random() * 20 + 's'
        particle.style.animationDuration = (15 + Math.random() * 10) + 's'
        particlesContainer.appendChild(particle)
      }
    }

    // Create floating badges (reduced to 5)
    const badges = document.getElementById('floatingBadges')
    if (badges) {
      const badgePositions = [
        { top: '10%', left: '8%' },
        { top: '15%', right: '12%' },
        { bottom: '20%', left: '6%' },
        { bottom: '15%', right: '10%' },
        { top: '50%', right: '8%' }
      ]

      badgePositions.forEach((pos, i) => {
        const badge = document.createElement('div')
        badge.className = 'floating-badge'
        badge.style.top = pos.top || 'auto'
        badge.style.bottom = pos.bottom || 'auto'
        badge.style.left = pos.left || 'auto'
        badge.style.right = pos.right || 'auto'
        badge.style.animationDelay = i * 4 + 's'
        badge.innerHTML = `
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1 14.93l-3.59-3.59L8.83 12 11 14.17l4.59-4.58 1.41 1.42L11 16.93z"/>
          </svg>
        `
        badges.appendChild(badge)
      })
    }

    // Animated counter
    function animateCounter(element: HTMLElement, target: number, suffix: string) {
      const duration = 2000
      const step = target / (duration / 16)
      let current = 0

      const timer = setInterval(() => {
        current += step
        if (current >= target) {
          current = target
          clearInterval(timer)
        }

        if (suffix === 'm') {
          element.textContent = '$' + current.toFixed(1) + 'm+'
        } else if (target >= 1000) {
          element.textContent = Math.floor(current).toLocaleString() + '+'
        } else {
          element.textContent = Math.floor(current) + '%'
        }
      }, 16)
    }

    // Intersection Observer for counter animation
    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statNumbers = entry.target.querySelectorAll('.stat-number')
          statNumbers.forEach((num) => {
            const element = num as HTMLElement
            if (element.textContent === '0') {
              const target = parseFloat(element.getAttribute('data-target') || '0')
              const suffix = element.getAttribute('data-suffix') || ''
              animateCounter(element, target, suffix)
            }
          })
          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current)
      }
    }
  }, [])

  return (
    <>
      <style jsx global>{`
        body {
          background: linear-gradient(135deg, #0a0e27 0%, #1a1443 25%, #2d1b69 50%, #1e3a5f 75%, #0f2744 100%);
          color: #fff;
          overflow-x: hidden;
          position: relative;
          min-height: 100vh;
        }

        .blockchain-grid {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image:
            linear-gradient(rgba(139, 92, 246, 0.06) 1.5px, transparent 1.5px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.06) 1.5px, transparent 1.5px);
          background-size: 60px 60px;
          animation: gridMove 30s linear infinite;
          pointer-events: none;
          z-index: 1;
          will-change: transform;
        }

        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }

        .particles {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 2;
        }

        .particle {
          position: absolute;
          border-radius: 50%;
          animation: particleFloat 20s infinite;
          opacity: 0;
          will-change: transform, opacity;
        }

        .particle-1 {
          width: 5px;
          height: 5px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, transparent 70%);
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.4);
        }

        .particle-2 {
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.6) 0%, transparent 70%);
          box-shadow: 0 0 8px rgba(6, 182, 212, 0.4);
        }

        @keyframes particleFloat {
          0% {
            transform: translate(0, 0) scale(0.5);
            opacity: 0;
          }
          10% { opacity: 0.8; }
          90% { opacity: 0.6; }
          100% {
            transform: translate(var(--tx), var(--ty)) scale(1);
            opacity: 0;
          }
        }

        .header-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(139, 92, 246, 0.15);
          border: 1.5px solid rgba(139, 92, 246, 0.5);
          padding: 10px 20px;
          border-radius: 30px;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 50px;
          backdrop-filter: blur(20px);
          box-shadow:
            0 4px 20px rgba(139, 92, 246, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          animation: badgePulse 4s infinite;
          transition: all 0.3s ease;
        }

        .header-badge:hover {
          transform: translateY(-2px);
          box-shadow:
            0 8px 30px rgba(139, 92, 246, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          border-color: rgba(139, 92, 246, 0.7);
        }

        @keyframes badgePulse {
          0%, 100% {
            box-shadow:
              0 4px 20px rgba(139, 92, 246, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
          }
          50% {
            box-shadow:
              0 4px 30px rgba(139, 92, 246, 0.4),
              0 0 40px rgba(139, 92, 246, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.15);
          }
        }

        .shield-icon {
          width: 22px;
          height: 22px;
          fill: #8b5cf6;
          filter: drop-shadow(0 0 8px rgba(139, 92, 246, 0.6));
        }

        .hero {
          text-align: center;
          margin-bottom: 100px;
          animation: fadeInUp 1s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero h1 {
          font-size: 84px;
          font-weight: 900;
          line-height: 1.2;
          margin-bottom: 30px;
          letter-spacing: -2px;
        }

        .hero-text-normal {
          background: linear-gradient(135deg, #ffffff 0%, #e0d5ff 30%, #a78bfa 70%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-highlight {
          display: inline-block;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.15));
          border: 2px solid rgba(139, 92, 246, 0.6);
          border-radius: 20px;
          padding: 8px 24px;
          margin: 0 8px;
          background-clip: padding-box;
          position: relative;
          box-shadow:
            0 0 30px rgba(139, 92, 246, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .hero-highlight span {
          background: linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 900;
        }

        .hero p {
          font-size: 22px;
          color: #cbd5e1;
          max-width: 700px;
          margin: 0 auto 50px;
          line-height: 1.7;
          font-weight: 400;
          animation: fadeInUp 1s ease-out 0.2s both;
        }

        .hero p strong {
          color: #a78bfa;
          font-weight: 600;
        }

        .cta-buttons {
          display: flex;
          justify-content: center;
          animation: fadeInUp 1s ease-out 0.4s both;
        }

        .btn-primary {
          padding: 22px 56px;
          font-size: 19px;
          font-weight: 700;
          border-radius: 16px;
          border: none;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          position: relative;
          overflow: hidden;
          letter-spacing: 0.3px;
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #06b6d4 100%);
          background-size: 200% 200%;
          color: white;
          box-shadow:
            0 12px 48px rgba(139, 92, 246, 0.5),
            0 0 0 1px rgba(255, 255, 255, 0.1) inset;
        }

        .btn-primary:hover {
          transform: translateY(-4px) scale(1.03);
          box-shadow:
            0 24px 70px rgba(139, 92, 246, 0.7),
            0 0 0 1px rgba(255, 255, 255, 0.2) inset,
            0 0 80px rgba(139, 92, 246, 0.5);
        }

        .btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          transition: left 0.6s;
        }

        .btn-primary:hover::before {
          left: 100%;
        }

        .btn-icon {
          width: 22px;
          height: 22px;
          transition: transform 0.3s;
        }

        .btn-primary:hover .btn-icon {
          transform: translateX(4px);
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          margin-top: 100px;
        }

        .stat-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
          border: 1.5px solid rgba(139, 92, 246, 0.2);
          border-radius: 24px;
          padding: 50px 40px;
          text-align: center;
          backdrop-filter: blur(20px);
          position: relative;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          animation: fadeInUp 1s ease-out both;
        }

        .stat-card:nth-child(1) { animation-delay: 0.6s; }
        .stat-card:nth-child(2) { animation-delay: 0.7s; }
        .stat-card:nth-child(3) { animation-delay: 0.8s; }

        .stat-card::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 24px;
          padding: 2px;
          background: linear-gradient(135deg, #8b5cf6, #06b6d4);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.5s;
        }

        .stat-card:hover::before {
          opacity: 1;
        }

        .stat-card:hover {
          transform: translateY(-8px) scale(1.02);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%);
          box-shadow:
            0 30px 80px rgba(139, 92, 246, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          border-color: rgba(139, 92, 246, 0.5);
        }

        .stat-card-content {
          position: relative;
          z-index: 1;
        }

        .stat-icon {
          width: 56px;
          height: 56px;
          margin: 0 auto 24px;
          padding: 14px;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.2));
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.4s;
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2);
        }

        .stat-card:hover .stat-icon {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 12px 32px rgba(139, 92, 246, 0.4);
        }

        .stat-icon svg {
          width: 28px;
          height: 28px;
          stroke: #a78bfa;
          fill: none;
          stroke-width: 2;
          filter: drop-shadow(0 0 8px rgba(139, 92, 246, 0.6));
        }

        .stat-number {
          font-size: 64px;
          font-weight: 900;
          background: linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 12px;
          display: block;
          line-height: 1;
          letter-spacing: -2px;
        }

        .stat-label {
          font-size: 17px;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .stat-sublabel {
          font-size: 14px;
          color: #64748b;
          font-weight: 400;
        }

        .floating-badges {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 3;
        }

        .floating-badge {
          position: absolute;
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(6, 182, 212, 0.08));
          border: 2px solid rgba(139, 92, 246, 0.25);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: floatBadge 30s infinite;
          backdrop-filter: blur(8px);
          box-shadow: 0 6px 24px rgba(139, 92, 246, 0.15);
          will-change: transform;
        }

        .floating-badge svg {
          width: 35px;
          height: 35px;
          fill: #8b5cf6;
          filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.6));
        }

        @keyframes floatBadge {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(50px, -50px) rotate(90deg);
          }
          50% {
            transform: translate(0, -100px) rotate(180deg);
          }
          75% {
            transform: translate(-50px, -50px) rotate(270deg);
          }
        }

        .glow-orb {
          position: fixed;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.2;
          pointer-events: none;
          z-index: 1;
          will-change: transform;
        }

        .glow-orb-1 {
          top: -200px;
          right: -200px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, transparent 70%);
          animation: float1 20s infinite;
        }

        .glow-orb-2 {
          bottom: -200px;
          left: -200px;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, transparent 70%);
          animation: float2 25s infinite;
        }

        @keyframes float1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-100px, 100px); }
        }

        @keyframes float2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(100px, -100px); }
        }

        .features {
          margin-top: 120px;
          padding-top: 80px;
          border-top: 1px solid rgba(139, 92, 246, 0.2);
        }

        .features-title {
          text-align: center;
          font-size: 42px;
          font-weight: 800;
          margin-bottom: 60px;
          background: linear-gradient(135deg, #ffffff 0%, #a78bfa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(139, 92, 246, 0.15);
          border-radius: 20px;
          padding: 32px;
          backdrop-filter: blur(10px);
          transition: all 0.3s;
        }

        .feature-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(139, 92, 246, 0.3);
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(139, 92, 246, 0.2);
        }

        .feature-card h3 {
          font-size: 20px;
          margin-bottom: 12px;
          color: #e0d5ff;
        }

        .feature-card p {
          font-size: 15px;
          color: #94a3b8;
          line-height: 1.6;
        }

        @media (max-width: 1024px) {
          .hero h1 {
            font-size: 64px;
          }
          .stat-number {
            font-size: 52px;
          }
          .btn-primary {
            padding: 20px 48px;
            font-size: 18px;
          }
        }

        @media (max-width: 768px) {
          .hero h1 {
            font-size: 48px;
            letter-spacing: -1px;
          }
          .hero-highlight {
            padding: 6px 18px;
            border-radius: 16px;
            margin: 0 4px;
          }
          .hero p {
            font-size: 18px;
          }
          .stats {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .stat-card {
            padding: 40px 30px;
          }
          .stat-number {
            font-size: 48px;
          }
          .btn-primary {
            padding: 18px 40px;
            font-size: 17px;
          }
          .floating-badge {
            width: 60px;
            height: 60px;
          }
          .floating-badge svg {
            width: 30px;
            height: 30px;
          }
        }

        @media (max-width: 480px) {
          .hero h1 {
            font-size: 36px;
          }
          .hero-highlight {
            display: block;
            margin: 8px auto;
            width: fit-content;
          }
          .btn-primary {
            width: 100%;
            justify-content: center;
            padding: 18px 32px;
          }
        }
      `}</style>

      {/* Glow orbs */}
      <div className="glow-orb glow-orb-1"></div>
      <div className="glow-orb glow-orb-2"></div>

      {/* Blockchain grid background */}
      <div className="blockchain-grid"></div>

      {/* Particles */}
      <div className="particles" id="particles"></div>

      {/* Floating badges */}
      <div className="floating-badges" id="floatingBadges"></div>

      {/* Main content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-10 py-[60px]">
        <center>
          <div className="header-badge">
            <svg className="shield-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1 14.93l-3.59-3.59L8.83 12 11 14.17l4.59-4.58 1.41 1.42L11 16.93z"/>
            </svg>
            <span>Powered by Ethos Network</span>
          </div>
        </center>

        <div className="hero">
          <h1>
            <span className="hero-text-normal">Filter </span>
            <span className="hero-highlight"><span>Beta Testers</span></span>
            <br />
            <span className="hero-text-normal">by Reputation</span>
          </h1>
          <p>Stop wasting time on low-quality testers. Only accept users with <strong>proven on-chain credibility</strong> and track record.</p>

          <div className="cta-buttons">
            <button onClick={() => router.push("/create")} className="btn-primary">
              <span>Create Access Page</span>
              <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="stats" ref={statsRef}>
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-card-content">
                <div className="stat-icon">
                  {index === 0 && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                  )}
                  {index === 1 && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                    </svg>
                  )}
                  {index === 2 && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  )}
                </div>
                <span className="stat-number" data-target={stat.value} data-suffix={stat.suffix}>0</span>
                <span className="stat-label">{stat.label}</span>
                <span className="stat-sublabel">{stat.sublabel}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Features section */}
        <div className="features">
          <h2 className="features-title">Why Choose Reputation Gateway?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <h3>{feature.icon} {feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
