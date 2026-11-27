import API from "../../../services/http";
import type { EnterpriseSettings } from "../types/enterpriseSettings";

export const getEnterpriseSettings = () =>
  API.get<EnterpriseSettings>("/enterpriseSettings");