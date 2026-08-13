'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';
import type OpenSeadragon from 'openseadragon';

interface DeepZoomViewerProps {
  tileSources: string | { type: string; url: string };
  className?: string;
}

/**
 * Visionneuse de zoom profond basée sur OpenSeadragon.
 * Permet de zoomer jusqu'au niveau de détail maximal d'une image très
 * haute résolution (plan via tiles DZI, ou photo via source image unique).
 */
export default function DeepZoomViewer({
  tileSources,
  className = '',
}: DeepZoomViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<OpenSeadragon.Viewer | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    let disposed = false;
    let viewer: OpenSeadragon.Viewer | null = null;

    (async () => {
      const mod = await import('openseadragon');
      const OpenSeadragon: typeof import('openseadragon') = mod.default ?? mod;
      if (disposed || !containerRef.current) return;

      viewer = OpenSeadragon({
        element: containerRef.current,
        tileSources,
        // Contrôles natifs désactivés : on fournit notre propre barre d'outils.
        showNavigationControl: false,
        showNavigator: false,
        showZoomControl: false,
        showHomeControl: false,
        showFullPageControl: false,
        showRotationControl: false,
        showSequenceControl: false,
        immediateRender: true,
        visibilityRatio: 0.7,
        minZoomImageRatio: 0.5,
        maxZoomPixelRatio: 8,
        gestureSettingsMouse: {
          scrollToZoom: true,
          clickToZoom: true,
          dblClickToZoom: true,
          pinchToZoom: true,
        },
        gestureSettingsTouch: {
          scrollToZoom: true,
          pinchToZoom: true,
          flickEnabled: true,
        },
        gestureSettingsPen: {
          scrollToZoom: true,
          clickToZoom: true,
          dblClickToZoom: true,
        },
        gestureSettingsUnknown: {
          scrollToZoom: true,
          clickToZoom: true,
          dblClickToZoom: true,
        },
      });

      viewerRef.current = viewer;
    })();

    return () => {
      disposed = true;
      viewerRef.current?.destroy();
      viewerRef.current = null;
    };
  }, [tileSources]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const zoomIn = useCallback(() => {
    viewerRef.current?.viewport.zoomBy(1.6);
    viewerRef.current?.viewport.applyConstraints();
  }, []);

  const zoomOut = useCallback(() => {
    viewerRef.current?.viewport.zoomBy(1 / 1.6);
    viewerRef.current?.viewport.applyConstraints();
  }, []);

  const reset = useCallback(() => {
    viewerRef.current?.viewport.goHome();
  }, []);

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen?.();
    }
  }, []);

  return (
    <div className={`relative overflow-hidden bg-black ${className}`}>
      <div ref={containerRef} className="absolute inset-0 h-full w-full" />

      {/* Barre d'outils */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-chantier-asphalt/90 px-2 py-1.5 shadow-industrial backdrop-blur-sm">
        <button
          type="button"
          onClick={zoomOut}
          aria-label="Zoom arrière"
          className="rounded-full p-2 text-white transition-colors hover:bg-white/20"
        >
          <ZoomOut size={18} />
        </button>
        <button
          type="button"
          onClick={reset}
          aria-label="Réinitialiser le zoom"
          className="rounded-full p-2 text-white transition-colors hover:bg-white/20"
        >
          <RotateCcw size={18} />
        </button>
        <button
          type="button"
          onClick={zoomIn}
          aria-label="Zoom avant"
          className="rounded-full p-2 text-white transition-colors hover:bg-white/20"
        >
          <ZoomIn size={18} />
        </button>
        <span className="mx-1 h-5 w-px bg-white/30" aria-hidden="true" />
        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
          className="rounded-full p-2 text-white transition-colors hover:bg-white/20"
        >
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>
    </div>
  );
}
