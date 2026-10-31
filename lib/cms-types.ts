export type CmsUser = {
  id: string; name: string; role: string; status: string; phone_masked: string;
  region: string | null; created_at: string; last_active_at: string | null;
  farm_count: number; active_crop_count: number;
};
export type CmsData = {
  data_environment: string; generated_at: string; read_only: boolean;
  profile: { user_id: string; name: string; role: string; status: string };
  period: { from: string; to: string; summary_scope: string; chart_scope: string };
  summary: { user_count: number; farmer_count: number; active_user_count: number; farm_count: number;
    active_crop_count: number; activity_count: number; harvest_total_kg: string; expense_total_idr: string; revenue_total_idr: string };
  pagination: { page: number; page_size: number; total: number; total_pages: number };
  users: CmsUser[];
  user_statuses: { status: string; count: number }[];
  activity_categories: { activity_type: string; count: number }[];
  monthly: { month: string; expense_idr: string; revenue_idr: string; harvest_kg: string }[];
  selected_user: null | {
    profile: CmsUser;
    farms: { id: string; name: string; area_hectares: string; timezone: string }[];
    crops: { id: string; farm_name: string; crop_type: string; seed_variety: string | null; status: string; planted_at: string; age_days: number }[];
    activities: { id: string; farm_name: string; activity_type: string; description: string | null; performed_at: string; quantity: string | null; unit: string | null }[];
    finance: { expense_idr: string; revenue_idr: string; harvest_kg: string };
    list_limits: { farms: number; crops: number; activities: number };
  };
};
