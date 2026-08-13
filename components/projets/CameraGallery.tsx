'use client';

import { useCallback, useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import DeepZoomViewer from './DeepZoomViewer';

export interface CameraView {
  id: string;
  label: string;
  title: string;
  description: string;
  tag?: string;
  src: string;
}

export interface CameraGroup {
  id: string;
  name: string;
  subtitle?: string;
  note?: string;
  views: CameraView[];
}

interface CameraGalleryProps {
  groups: CameraGroup[];
}

function Lightbox({
  views,
  index,
  onClose,
  onNavigate,
}: {
  views: CameraView[];
  index: number;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
}) {
  const current = views[index];

  const prev = useCallback(() => {
    onNavigate((index - 1 + views.length) % views.length);
  }, [index, views.length, onNavigate]);

  const next = useCallback(() => {
    onNavigate((index + 1) % views.length);
  }, [index, views.length, onNavigate]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, prev, next]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/95"
      role="dialog"
      aria-modal="true"
      aria-label={current.title}
    >
      {/* En-tête */}
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-widest text-chantier-yellow">
            {current.label}
          </p>
          <h3 className="truncate text-lg font-bold text-white">{current.title}</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="flex-shrink-0 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/25"
        >
          <X size={22} />
        </button>
      </div>

      {/* Image */}
      <div className="relative min-h-0 flex-1">
        <DeepZoomViewer
          tileSources={{ type: 'image', url: current.src }}
          className="h-full w-full"
        />

        {/* Navigation */}
        {views.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Vue précédente"
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition-colors hover:bg-black/75"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Vue suivante"
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition-colors hover:bg-black/75"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* Légende */}
      <div className="border-t border-white/10 px-4 py-4 sm:px-6">
        <p className="mx-auto max-w-3xl text-sm leading-relaxed text-gray-300">
          {current.description}
        </p>
      </div>
    </div>
  );
}

export default function CameraGallery({ groups }: CameraGalleryProps) {
  const [lightbox, setLightbox] = useState<{ groupIndex: number; viewIndex: number } | null>(null);

  const openLightbox = (groupIndex: number, viewIndex: number) =>
    setLightbox({ groupIndex, viewIndex });

  const closeLightbox = useCallback(() => setLightbox(null), []);

  const navigate = useCallback(
    (nextViewIndex: number) => {
      setLightbox((current) =>
        current ? { ...current, viewIndex: nextViewIndex } : current,
      );
    },
    [],
  );

  return (
    <div className="space-y-14">
      {groups.map((group, groupIndex) => (
        <section key={group.id} id={group.id}>
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-chantier-yellow text-chantier-asphalt">
                <Camera size={20} />
              </span>
              <h2 className="text-2xl font-bold text-chantier-asphalt sm:text-3xl">
                {group.name}
              </h2>
            </div>
            {group.subtitle && (
              <p className="mt-2 max-w-3xl text-chantier-concrete">{group.subtitle}</p>
            )}
            {group.note && (
              <p className="mt-3 rounded-lg border border-chantier-yellow/40 bg-chantier-yellow/10 px-4 py-3 text-sm text-chantier-asphalt">
                {group.note}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {group.views.map((view, viewIndex) => (
              <button
                key={view.id}
                type="button"
                onClick={() => openLightbox(groupIndex, viewIndex)}
                className="group overflow-hidden rounded-xl border border-chantier-light-grey bg-white text-left shadow-industrial transition-all duration-300 hover:-translate-y-1 hover:shadow-industrial-lg"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={view.src}
                    alt={`${view.label} — ${view.title}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-chantier-yellow px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-chantier-asphalt shadow-industrial">
                    {view.label}
                  </span>
                  {view.tag && (
                    <span className="absolute right-3 top-3 rounded-full bg-chantier-asphalt/85 px-3 py-1 text-xs font-bold text-white">
                      {view.tag}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-chantier-asphalt">{view.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-chantier-concrete">
                    {view.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      ))}

      {lightbox && (
        <Lightbox
          views={groups[lightbox.groupIndex].views}
          index={lightbox.viewIndex}
          onClose={closeLightbox}
          onNavigate={navigate}
        />
      )}
    </div>
  );
}
