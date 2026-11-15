export type ChurchPhoto = {
  /** Path without the size suffix or extension, e.g. /assets/church/church-front-wide */
  base: string;
  alt: string;
};

export const churchPhotos = {
  frontWide: {
    base: "/assets/church/church-front-wide",
    alt: "Burning Bush Ministries church building in Meru, with a red iron-sheet roof, a cross on the gable and yellow-trimmed entrances",
  },
  angle: {
    base: "/assets/church/church-angle",
    alt: "Burning Bush Ministries church building in Meru seen from the side, with its red roof, cross and flower beds along the front",
  },
  frontHedge: {
    base: "/assets/church/church-front-hedge",
    alt: "Front of the Burning Bush Ministries church in Meru, with a trimmed hedge beside the entrance",
  },
  frontPeople: {
    base: "/assets/church/church-front-people",
    alt: "Two people walking past the front of the Burning Bush Ministries church in Meru",
  },
} satisfies Record<string, ChurchPhoto>;

/** Photos used, in order, on the sermon placeholder cards. */
export const sermonPhotos: ChurchPhoto[] = [
  churchPhotos.frontWide,
  churchPhotos.angle,
  churchPhotos.frontHedge,
  churchPhotos.frontPeople,
];

export const photoSrc = (photo: ChurchPhoto, width: 800 | 1600) => `${photo.base}-${width}.webp`;

export const photoSrcSet = (photo: ChurchPhoto) =>
  `${photoSrc(photo, 800)} 800w, ${photoSrc(photo, 1600)} 1600w`;
