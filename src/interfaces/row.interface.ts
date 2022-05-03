export interface GroupedFindingsDataIFace {
  id: number;
  grouping_type: string;
  grouping_key: string;
  severity: string;
  grouped_finding_created: string;
  sla: string;
  description: string;
  security_analyst: string;
  owner: string;
  workflow: string;
  status: string;
  progress: number;
  numFindings: number;
}

export interface RawFindingsDataIFace {
  id: number;
  source_security_tool_name: string;
  source_security_tool_id: string;
  source_collbartion_tool_name: string;
  source_collbartion_tool_id: string;
  severity: string;
  finding_created: string;
  ticket_created: string;
  description: string;
  asset: string;
  status: string;
  remediation_url: string;
  remediation_text: string;
  grouped_finding_id: number;
}
