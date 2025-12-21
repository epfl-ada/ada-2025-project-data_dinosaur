// web/plots_website_timeline/plotRegistry.ts

// Make sure your JSON files are inside: web/plots_website_timeline/
// (same folder as this file)

import topwords_trump from "./nyer_topwords_trump.json";
import topwords_covid from "./nyer_topwords_covid.json";
import topwords_climate from "./nyer_topwords_climate.json";
import topwords_war from "./nyer_topwords_war.json";

import monthlyGroups_trump from "./nyer_event_trump_monthly_groups.json";
import monthlyGroups_covid from "./nyer_event_covid_monthly_groups.json";
import monthlyGroups_climate from "./nyer_event_climate_monthly_groups.json";
import monthlyGroups_war from "./nyer_event_war_monthly_groups.json";

import union_trump from "./nyer_trump_trends_vs_captions_union.json";
import union_covid from "./nyer_covid_trends_vs_captions_union.json";
import union_climate from "./nyer_climate_trends_vs_captions_union.json";
import union_war from "./nyer_war_trends_vs_captions_union.json";

import z_trump from "./nyer_trump_trends_vs_captions_z.json";
import z_covid from "./nyer_covid_trends_vs_captions_z.json";
import z_climate from "./nyer_climate_trends_vs_captions_z.json";
import z_war from "./nyer_war_trends_vs_captions_z.json";

import lagStem_trump from "./nyer_trump_lagcorr_stem.json";
import lagStem_covid from "./nyer_covid_lagcorr_stem.json";
import lagStem_climate from "./nyer_climate_lagcorr_stem.json";
import lagStem_war from "./nyer_war_lagcorr_stem.json";

import lagHeatmap_trump from "./nyer_trump_lagcorr_heatmap.json";
import lagHeatmap_covid from "./nyer_covid_lagcorr_heatmap.json";
import lagHeatmap_climate from "./nyer_climate_lagcorr_heatmap.json";
import lagHeatmap_war from "./nyer_war_lagcorr_heatmap.json";

import lagReport_trump from "./nyer_trump_lagcorr_report.json";
import lagReport_covid from "./nyer_covid_lagcorr_report.json";
import lagReport_climate from "./nyer_climate_lagcorr_report.json";
import lagReport_war from "./nyer_war_lagcorr_report.json";

import trendsUS_trump from "./google_trends_us_2016_2023_Trump.json";
import trendsUS_covid from "./google_trends_us_2016_2023_Covid.json";
import trendsUS_climate from "./google_trends_us_2016_2023_Climate.json";
import trendsUS_war from "./google_trends_us_2016_2023_Wars.json";

import trendsEvent_trump from "./google_trends_event_trump.json";
import trendsEvent_covid from "./google_trends_event_covid.json";
import trendsEvent_climate from "./google_trends_event_climate.json";
import trendsEvent_war from "./google_trends_event_war.json";

import trendsZ_trump from "./google_trends_zseries_trump.json";
import trendsZ_covid from "./google_trends_zseries_covid.json";
import trendsZ_climate from "./google_trends_zseries_climate.json";
import trendsZ_war from "./google_trends_zseries_war.json";


export const PLOTS_BY_EVENT = {
  trump: {
    topwords: topwords_trump,
    trendsVsCaptions_union: union_trump,
    trendsVsCaptions_z: z_trump,
    lag_stem: lagStem_trump,
    lag_heatmap: lagHeatmap_trump,
    lag_report: lagReport_trump,
    monthly_groups: monthlyGroups_trump,
    google_trends_us: trendsUS_trump,
    google_trends_event: trendsEvent_trump,
    google_trends_z: trendsZ_trump,
  },
  covid: {
    topwords: topwords_covid,
    trendsVsCaptions_union: union_covid,
    trendsVsCaptions_z: z_covid,
    lag_stem: lagStem_covid,
    lag_heatmap: lagHeatmap_covid,
    lag_report: lagReport_covid,
    monthly_groups: monthlyGroups_covid,
    google_trends_us: trendsUS_covid,
    google_trends_event: trendsEvent_covid,
    google_trends_z: trendsZ_covid,
  },
  climate: {
    topwords: topwords_climate,
    trendsVsCaptions_union: union_climate,
    trendsVsCaptions_z: z_climate,
    lag_stem: lagStem_climate,
    lag_heatmap: lagHeatmap_climate,
    lag_report: lagReport_climate,
    monthly_groups: monthlyGroups_climate,
    google_trends_us: trendsUS_climate,
    google_trends_event: trendsEvent_climate,
    google_trends_z: trendsZ_climate,
  },
  war: {
    topwords: topwords_war,
    trendsVsCaptions_union: union_war,
    trendsVsCaptions_z: z_war,
    lag_stem: lagStem_war,
    lag_heatmap: lagHeatmap_war,
    lag_report: lagReport_war,
    monthly_groups: monthlyGroups_war,
    google_trends_us: trendsUS_war,
    google_trends_event: trendsEvent_war,
    google_trends_z: trendsZ_war,
  },
} as const;

// ✅ EventId is derived from the keys of PLOTS_BY_EVENT (always consistent)
export type EventId = keyof typeof PLOTS_BY_EVENT;
