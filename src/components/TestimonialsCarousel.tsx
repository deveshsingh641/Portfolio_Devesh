import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
  theme: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({
  testimonials,
  theme,
  autoPlay = true,
  autoPlayInterval = 5000,
}) => {
  const [current, setCurrent] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(autoPlay);

  useEffect(() => {
    if (!isAutoPlay || testimonials.length <= 1) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isAutoPlay, testimonials.length, autoPlayInterval]);

  if (testimonials.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    setIsAutoPlay(false);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setIsAutoPlay(false);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlay(false);
    setCurrent(index);
  };

  const testimonial = testimonials[current];

  return (
    <div className="space-y-8">
      {/* Main testimonial card */}
      <div
        className={`relative rounded-2xl border overflow-hidden transition-all duration-500 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-slate-900/80 via-slate-900/70 to-slate-950/80 border-slate-800/50'
            : 'bg-gradient-to-br from-white via-slate-50/80 to-slate-100/50 border-slate-200'
        }`}
      >
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
          style={{
            background: current % 2 === 0 ? 'rgba(139, 92, 246, 0.3)' : 'rgba(34, 211, 238, 0.3)',
          }}
        />

        <div className="relative p-8 md:p-12">
          {/* Quote icon */}
          <div className={`mb-6 ${theme === 'dark' ? 'text-slate-700/50' : 'text-slate-300/50'}`}>
            <Quote size={48} />
          </div>

          {/* Quote text */}
          <blockquote className={`text-xl md:text-2xl font-semibold mb-8 leading-relaxed ${
            theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
          }`}>
            "{testimonial.quote}"
          </blockquote>

          {/* Author info */}
          <div className="flex items-center gap-4 pt-6 border-t border-slate-700/20">
            {testimonial.avatar && (
              <img
                src={testimonial.avatar}
                alt={testimonial.author}
                className="w-14 h-14 rounded-full object-cover border-2 border-slate-700/30"
              />
            )}
            <div>
              <p className={`font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                {testimonial.author}
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                {testimonial.role}
                {testimonial.company && ` at ${testimonial.company}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation controls */}
      <div className="flex items-center justify-between">
        {/* Previous button */}
        <button
          onClick={goToPrevious}
          className={`p-2 rounded-lg border transition-all hover:scale-110 ${
            theme === 'dark'
              ? 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-700/50 hover:text-cyan-300'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-cyan-600'
          }`}
          aria-label="Previous testimonial"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Dot indicators */}
        <div className="flex items-center gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${
                index === current
                  ? `h-2 ${theme === 'dark' ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50' : 'bg-cyan-600'} rounded-full w-8`
                  : `h-2 ${theme === 'dark' ? 'bg-slate-700/50 hover:bg-slate-600' : 'bg-slate-300 hover:bg-slate-400'} rounded-full w-2`
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={goToNext}
          className={`p-2 rounded-lg border transition-all hover:scale-110 ${
            theme === 'dark'
              ? 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-700/50 hover:text-cyan-300'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-cyan-600'
          }`}
          aria-label="Next testimonial"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Counter */}
      <p className={`text-center text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-slate-600'}`}>
        {current + 1} / {testimonials.length}
      </p>
    </div>
  );
};

export default TestimonialsCarousel;
