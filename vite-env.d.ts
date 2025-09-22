/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PORT: string;

  readonly VITE_WS_TARGET: string;

  readonly VITE_STATIC_INFO_API_TARGET: string;
  readonly VITE_DATAP_TARGET: string;
  readonly VITE_API_TARGET: string;

  readonly VITE_VOYAGE_TARGET: string;
  readonly VITE_SECURITY_TARGET: string;
  readonly VITE_SPMS_TARGET: string;
  readonly VITE_EQUIPMENT_TARGET: string;
  readonly VITE_EMISSION_TARGET: string;
  readonly VITE_SEER_TARGET: string;
  readonly VITE_CREW_SUPPORT_TARGET: string;
  readonly VITE_SAFETY_TARGET: string;
  readonly VITE_SETTING_TARGET: string;
  readonly VITE_FLEET_TARGET: string;
  readonly VITE_VOYAGE_API_TARGET: string;
  readonly api: string;
  readonly rims_api: string;
  readonly kdt_api: string;
  readonly unity: string;
  readonly dbdata: string;
  readonly analysis_api: string;
  readonly synth_data: string;
  readonly mrc_api: string;
  readonly mrc_api_amsvdr: string;
  readonly mrc_api_shipinfo: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
