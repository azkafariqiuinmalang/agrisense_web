export type ReadSection<T> = {
  status: "available" | "unavailable" | "error";
  data: T | null;
  reason?: "not_exposed" | "not_configured" | "temporarily_unavailable";
};

export type FarmerProfile = {
  user_id: string;
  name: string;
  phone: string;
  status: string;
};

export type Farm = {
  id: string;
  name: string;
  area_hectares: string | null;
  soil_type: string | null;
  irrigation_type: string | null;
  active_crop_count: number;
};

export type Crop = {
  id: string;
  farm_id: string;
  crop_type: string;
  seed_variety: string | null;
  planted_at: string;
  age_days: number;
  status: string;
  cultivation_system: string | null;
  cultivation_unit_count: number | null;
  area_hectares: string | null;
  expected_harvest_at: string | null;
};

export type Harvest = {
  id: string;
  farm_id: string;
  crop_id: string;
  yield_kg: string;
  quality_grade: string | null;
  price_per_kg: string | null;
  harvested_at: string;
};

export type Activity = {
  id: string;
  activity_type: string;
  description: string;
  quantity: string | null;
  unit: string | null;
  performed_at: string;
};

export type CreditScore = {
  status: "available" | "expired" | "not_available";
  score: string | null;
  calculated_at: string | null;
  valid_until: string | null;
};

export type FarmerDashboardData = {
  profile: FarmerProfile;
  generated_at: string;
  data_environment: string;
  farms: ReadSection<Farm[]>;
  crops: ReadSection<Crop[]>;
  harvests: ReadSection<Harvest[]>;
  activities: ReadSection<Activity[]>;
  credit_score: ReadSection<CreditScore>;
  finance: ReadSection<never>;
  list_limits: {
    farms: number;
    crops: number;
    harvests: number;
    activities: number;
  };
  activity_scope: "latest_growing_crop";
};
