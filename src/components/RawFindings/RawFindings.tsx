import { gql, useLazyQuery, useQuery } from "@apollo/client";
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Box,
  TableBody,
  CircularProgress,
} from "@mui/material";
import React, { useEffect } from "react";
import { useCallback } from "react";
import { RawFindingsDataIFace } from "../../interfaces/row.interface";

import styles from "./RawFindings.module.scss";

interface RawFindingsRowIFace {
  rowData: RawFindingsDataIFace;
}

const RawFindingsQuery = gql`
  query RawFindings($groupedFindingId: Int!) {
    rawFindings(grouped_finding_id: $groupedFindingId) {
      id
      source_security_tool_name
      source_security_tool_id
      source_collbartion_tool_name
      source_collbartion_tool_id
      severity
      finding_created
      ticket_created
      description
      asset
      status
      remediation_url
      remediation_text
      grouped_finding_id
    }
  }
`;

const RawFindingsRow: React.FC<RawFindingsRowIFace> = (props) => {
  return (
    <TableRow>
      <TableCell>{props.rowData.severity}</TableCell>
      <TableCell>{props.rowData.finding_created}</TableCell>
      <TableCell>{props.rowData.source_collbartion_tool_name}</TableCell>
      <TableCell>{props.rowData.description}</TableCell>
      <TableCell>{props.rowData.asset}</TableCell>
      <TableCell>{props.rowData.source_security_tool_name}</TableCell>
    </TableRow>
  );
};

interface RawFindingsTableIFace {
  groupID: number;
  isCollapsed: boolean;
}

const RawFindingsTable: React.FC<RawFindingsTableIFace> = (props) => {
  const [fetchData, { loading, data }] = useLazyQuery<{
    rawFindings: RawFindingsDataIFace[];
  }>(RawFindingsQuery, {
    variables: {
      groupedFindingId: props.groupID,
    },
  });

  const generateRows = useCallback(() => {
    return (
      !loading &&
      data &&
      data.rawFindings.map((instance, index) => {
        return <RawFindingsRow rowData={instance} key={instance.id + index} />;
      })
    );
  }, [loading, data]);

  useEffect(() => {
    if (props.isCollapsed) {
      fetchData();
    }
  }, [fetchData, props.isCollapsed]);

  return (
    <Box className={styles.root}>
      <Typography className={styles.headerText}>Raw Findings</Typography>
      {loading ? (
        <Box className={styles.progressContainer}>
          <CircularProgress />
        </Box>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Severity</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Asset</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{generateRows()}</TableBody>
        </Table>
      )}
    </Box>
  );
};

export default RawFindingsTable;
