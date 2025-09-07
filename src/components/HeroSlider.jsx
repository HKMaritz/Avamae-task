import React, { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"

// Fallback images for local development
import Img001 from "../assets/Img_001.jpg"
import Img003 from "../assets/Img_003.jpg"
import ArrowIcon from "../assets/Icon_Arrow.svg"

const API_URL = "https://interview-assessment.api.avamae.co.uk/api/v1/home/banner-details"

export default function HeroSlider() {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [usedFallback, setUsedFallback] = useState(false)
  const [index, setIndex] = useState(0)

  const DEBUG_BADGE = String(process.env.REACT_APP_SHOW_FALLBACK_BADGE || "").toLowerCase() === "true"

  // Minimal static fallback if network fails
  const fallbackSlides = useMemo(
    () => [
      {
        title: "Lorem ipsum dolor",
        subtitle: "Quem vide tincidunt pri ei, id mea omnium denique.",
        imageUrl: Img001,
      },
      {
        title: "Lorem ipsum dolor", 
        subtitle: "Quem vide tincidunt pri ei, id mea omnium denique.",
        imageUrl: Img003,
      },
    ],
    []
  )

  useEffect(() => {
    let isMounted = true

    async function load() {
      setLoading(true)
      try {
        const res = await fetch(API_URL, { method: "GET" })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()

        // Normalize data array of title, subtitle, imageUrl
        const normalized = data?.details?.map((d) => ({
          title: d?.title || "",
          subtitle: d?.subtitle || "",
          imageUrl: d?.imageUrl || "",
        })) ?? []

        if (isMounted) {
          if (normalized.length === 0) {
            console.warn("[HeroSlider] API returned no slides; using fallback content.")
            setSlides(fallbackSlides)
            setUsedFallback(true)
          } else {
            setSlides(normalized)
            setUsedFallback(false)
          }
        }
      } catch (err) {
        console.warn("[HeroSlider] Failed to fetch banner details; using fallback.", err)
        if (isMounted) {
          setSlides(fallbackSlides)
          setUsedFallback(true)
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    load()
    return () => {
      isMounted = false
    }
  }, [fallbackSlides])

  // Auto scroll
  useEffect(() => {
    if (!slides.length) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 6000)
    return () => clearInterval(id)
  }, [slides])

  if (loading) {
    // Skeleton while fetching visible but neutral
    return (
      <section className="hero hero--home" aria-label="Loading homepage hero">
        <div className="slide" style={{ opacity: 1, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
          <div className="overlay">
            <div className="heroContent">
              <div style={{ 
                width: '200px', 
                height: '40px', 
                background: 'rgba(255,255,255,0.3)', 
                borderRadius: '8px',
                marginBottom: '16px',
                animation: 'pulse 2s ease-in-out infinite alternate'
              }}></div>
              <div style={{ 
                width: '300px', 
                height: '20px', 
                background: 'rgba(255,255,255,0.2)', 
                borderRadius: '6px',
                marginBottom: '20px'
              }}></div>
              <div style={{ 
                width: '120px', 
                height: '44px', 
                background: 'rgba(255,255,255,0.2)', 
                borderRadius: '8px'
              }}></div>
            </div>
          </div>
        </div>
        <style>{`
          @keyframes pulse {
            0% { opacity: 0.6; }
            100% { opacity: 1; }
          }
        `}</style>
      </section>
    )
  }

  const current = slides[index] ?? slides[0]

  return (
    <section className="hero hero--home" aria-roledescription="carousel" aria-label="Homepage hero" data-source={usedFallback ? "fallback" : "api"}>
      {/* Dev only badge */}
      {DEBUG_BADGE && usedFallback && (
        <div style={{ 
          position: 'absolute', 
          top: '10px', 
          right: '10px', 
          background: '#e74c3c', 
          color: '#fff', 
          padding: '6px 8px', 
          borderRadius: '4px', 
          fontSize: '12px',
          zIndex: 10
        }}>
          Using fallback content
        </div>
      )}
      
      {/* slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`slide ${i === index ? "is-active" : ""}`}
          style={{
            backgroundImage: `url(${slide.imageUrl})`,
            opacity: i === index ? 1 : 0,
            pointerEvents: i === index ? "auto" : "none",
          }}
          role="group"
          aria-roledescription="slide"
          aria-label={`Slide ${i + 1} of ${slides.length}`}
          aria-hidden={i === index ? "false" : "true"}
        />
      ))}

      {/* text overlay */}
      <div className="overlay">
        <div className="heroContent">
          <h1>{current?.title || "Lorem ipsum dolor"}</h1>
          <p>{current?.subtitle || "Quem vide tincidunt pri ei, id mea omnium denique."}</p>
          <Link to="/contact-us" className="btn btn-primary">Contact us</Link>
        </div>
      </div>

      {/* Navigation arrows only show if multiple slides */}
      {slides.length > 1 && (
        <>
          <button className="chev left" onClick={() => setIndex(v => (v === 0 ? slides.length - 1 : v - 1))} aria-label="Previous slide">
            <img src={ArrowIcon} alt="" />
          </button>
          <button className="chev right" onClick={() => setIndex(v => (v + 1) % slides.length)} aria-label="Next slide">
            <img src={ArrowIcon} alt="" className="flipX" />
          </button>
        </>
      )}

      {/* the dots only show if multiple slides */}
      {slides.length > 1 && (
        <div className="dots" role="tablist" aria-label="Slide navigation">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === index ? "active" : ""}`}
              onClick={() => setIndex(i)}
              role="tab"
              aria-selected={i === index ? "true" : "false"}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
