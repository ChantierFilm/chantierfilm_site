import DeepZoomViewer from '@/components/projets/DeepZoomViewer';
import CameraGallery, {
  type CameraGroup,
} from '@/components/projets/CameraGallery';

const base = '/projets/e-leclerc-remiremont';

const cameraGroups: CameraGroup[] = [
  {
    id: 'camera-a',
    name: 'Caméra A — Façade principale',
    subtitle:
      "Quatre emplacements possibles. L'emplacement A1 nécessite un perçage de la toiture (tôle) ; les emplacements A2 et A3 évitent ce perçage mais ne couvrent pas la phase 2. L'emplacement A4 couvre la phase 2 mais impose également un perçage de la tôle.",
    note: "À noter : pour couvrir la phase 2 du chantier, un perçage de la tôle est de toute façon nécessaire (en A1 directement, ou en A4 après un déplacement).",
    views: [
      {
        id: 'A1',
        label: 'A1',
        title: 'Emplacement A1 — Perçage toiture',
        description:
          "Option de référence : fixation directe sur la toiture. Nécessite de percer la tôle, mais offre le meilleur angle de vue et couvre la phase 2 sans déplacement.",
        tag: 'Phase 1 & 2',
        src: `${base}/A1.jpg`,
      },
      {
        id: 'A2',
        label: 'A2',
        title: 'Emplacement A2 — Sans perçage',
        description:
          "Alternative sans perçage de la tôle. Ne permet pas de couvrir la phase 2 : la caméra devra être déplacée en A4 pour la phase 2.",
        tag: 'Phase 1',
        src: `${base}/A2.jpg`,
      },
      {
        id: 'A3',
        label: 'A3',
        title: 'Emplacement A3 — Sans perçage',
        description:
          "Alternative sans perçage de la tôle. Ne permet pas de couvrir la phase 2 : la caméra devra être déplacée en A4 pour la phase 2.",
        tag: 'Phase 1',
        src: `${base}/A3.jpg`,
      },
      {
        id: 'A4',
        label: 'A4',
        title: 'Emplacement A4 — Phase 2',
        description:
          "Emplacement prévu pour la phase 2. Impose également un perçage de la tôle (même contrainte qu'en A1).",
        tag: 'Phase 2',
        src: `${base}/A4.jpg`,
      },
    ],
  },
  {
    id: 'camera-b',
    name: 'Caméra B — Phase 1',
    subtitle:
      "Trois emplacements possibles pour la phase 1. En l'absence de possibilité de percer la tôle, la fixation peut se faire directement sur les supports métalliques existants.",
    note: "La caméra B est la caméra 2. Si elle est placée en B1, elle sera déplacée en C1 pour la phase 2.",
    views: [
      {
        id: 'B1',
        label: 'B1',
        title: 'Emplacement B1 — Phase 1',
        description:
          "Option de référence pour la phase 1. Fixation sur supports métalliques possible si le perçage de la tôle n'est pas envisageable. Déplacée en C1 pour la phase 2.",
        tag: 'Phase 1',
        src: `${base}/B1.jpg`,
      },
      {
        id: 'B2',
        label: 'B2',
        title: 'Emplacement B2 — Phase 1',
        description:
          "Option alternative pour la phase 1. Fixation sur supports métalliques possible si le perçage de la tôle n'est pas envisageable.",
        tag: 'Phase 1',
        src: `${base}/B2.jpg`,
      },
      {
        id: 'B3',
        label: 'B3',
        title: 'Emplacement B3 — Phase 1',
        description:
          "Option alternative pour la phase 1. Fixation sur supports métalliques possible si le perçage de la tôle n'est pas envisageable.",
        tag: 'Phase 1',
        src: `${base}/B3.jpg`,
      },
    ],
  },
  {
    id: 'camera-c',
    name: 'Caméra C — Phase 2',
    subtitle:
      "Pour la phase 2, la caméra 2 est déplacée sur le candélabre de la rue, offrant un bel angle de vue sur l'ensemble du chantier.",
    note: "Une autorisation sera demandée à la mairie (aucune difficulté attendue).",
    views: [
      {
        id: 'C1',
        label: 'C1',
        title: 'Emplacement C1 — Candélabre (Phase 2)',
        description:
          "Fixation sur le candélabre de la rue. Nécessite une autorisation de la mairie. Offre un bel angle de vue sur la phase 2.",
        tag: 'Phase 2',
        src: `${base}/C1.jpg`,
      },
    ],
  },
];

export default function ProjetLeclercPage() {
  return (
    <main className="min-h-screen bg-chantier-off-white">
      {/* En-tête */}
      <section className="border-b border-chantier-light-grey bg-white pb-10 pt-32 lg:pb-14 lg:pt-40">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <span className="inline-block rounded-full bg-chantier-asphalt px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-chantier-yellow">
            Document confidentiel
          </span>
          <h1 className="mt-4 text-3xl font-bold leading-tight text-chantier-asphalt sm:text-4xl lg:text-5xl">
            Projet E. Leclerc Remiremont
          </h1>
          <p className="mt-4 max-w-3xl text-base text-chantier-concrete sm:text-lg">
            Étude d&apos;implantation des caméras de suivi de chantier. Plan général
            interactif puis rendus des vues pour chaque emplacement proposé.
          </p>
        </div>
      </section>

      {/* Plan */}
      <section className="py-10 lg:py-14">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <h2 className="text-2xl font-bold text-chantier-asphalt sm:text-3xl">
            Plan d&apos;implantation
          </h2>
          <p className="mt-2 max-w-3xl text-chantier-concrete">
            Zoomez sur le plan pour localiser précisément chaque emplacement (points
            rouges A1 à A4, B1 à B3 et C1). Utilisez la molette ou pincez pour zoomer,
            et faites glisser pour vous déplacer.
          </p>

          <div className="mt-6 overflow-hidden rounded-xl border border-chantier-light-grey shadow-industrial">
            <DeepZoomViewer
              tileSources={`${base}/plan-dzi.dzi`}
              className="h-[60vh] min-h-[420px] w-full sm:h-[70vh]"
            />
          </div>
        </div>
      </section>

      {/* Vues caméras */}
      <section className="py-10 lg:py-14">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <h2 className="text-2xl font-bold text-chantier-asphalt sm:text-3xl">
            Rendu des vues par emplacement
          </h2>
          <p className="mt-2 max-w-3xl text-chantier-concrete">
            Cliquez sur une vue pour l&apos;agrandir et zoomer dans le détail.
          </p>

          <div className="mt-8">
            <CameraGallery groups={cameraGroups} />
          </div>
        </div>
      </section>
    </main>
  );
}
