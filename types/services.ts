export type ServicePackage = {
  id: string;
  name: string;
  price: string;
  summary: string;
  features: string[];
  limitations?: string[];
  badge?: string;
  ctaLabel: string;
};

export type ServiceAddon = {
  name: string;
  price: string;
  description: string;
};
