export interface BusinessReel {
  id: string;
  businessId: string;
  title: string;
  instagramUrl: string;
  thumbnailUrl: string;
  isActive: boolean;
  viewsCount: number;
  clicksToMenuCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReelFeedItem {
  reelId: string;
  title: string;
  instagramUrl: string;
  thumbnailUrl: string;
  viewsCount: number;
  clicksToMenuCount: number;
  createdAt: string;
  businessId: string;
  businessName: string;
  businessSlug: string;
  businessLogoUrl: string | null;
  businessCategoryId: string | null;
  distanceMeters: number | null;
}

/** Resumen de métricas de Reels por negocio para la tabla de /admin/reels */
export interface BusinessReelsSummary {
  businessId: string;
  businessName: string;
  businessSlug: string;
  businessLogoUrl: string | null;
  businessCity: string | null;
  status: boolean;
  totalReels: number;
  totalViews: number;
  totalClicksToMenu: number;
}

/** Métricas globales consolidadas para la cabecera de /admin/reels */
export interface AdminReelsGlobalStats {
  totalActiveReels: number;
  totalViews: number;
  totalClicksToMenu: number;
  globalConversionRate: number;
  topBusinesses: {
    businessId: string;
    businessName: string;
    totalViews: number;
  }[];
}
