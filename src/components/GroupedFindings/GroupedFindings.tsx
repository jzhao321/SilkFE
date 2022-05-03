import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Collapse,
  IconButton,
  Typography,
  TableFooter,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import { useCallback } from "react";
import { GroupedFindingsDataIFace } from "../../interfaces/row.interface";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { KeyboardArrowUp, TableRowsTwoTone } from "@mui/icons-material";
import RawFindingsTable from "../RawFindings/RawFindings";

import styles from "./GroupedFindings.module.scss";
import { gql, useQuery } from "@apollo/client";

interface GroupedFindingsRowIFace {
  rowData: GroupedFindingsDataIFace;
}

const GroupedFindingsQuery = gql`
  query GroupedFindings($start: Int, $end: Int) {
    groupedFindings(start: $start, end: $end) {
      id
      grouping_type
      grouping_key
      severity
      grouped_finding_created
      sla
      description
      security_analyst
      owner
      workflow
      status
      progress
    }
  }
`;

const TotalGroupedFindingsQuery = gql`
  query GroupedFindings {
    totalGroupedFindings
  }
`;

const GroupedFindingsRow: React.FC<GroupedFindingsRowIFace> = (props) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <>
      <TableRow className={styles.groupTableRow}>
        <TableCell>
          <IconButton
            onClick={() => {
              setCollapsed(!collapsed);
            }}
          >
            {collapsed ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{props.rowData.severity}</TableCell>
        <TableCell>{props.rowData.grouped_finding_created}</TableCell>
        <TableCell>{props.rowData.sla}</TableCell>
        <TableCell>{props.rowData.description}</TableCell>
        <TableCell>{props.rowData.security_analyst}</TableCell>
        <TableCell>{props.rowData.owner}</TableCell>
        <TableCell>{props.rowData.workflow}</TableCell>
        <TableCell>{props.rowData.status}</TableCell>
      </TableRow>
      <TableRow className={`${styles.collapseTableRow}`}>
        <TableCell colSpan={12} className={styles.collapseTableCell}>
          <Collapse in={!collapsed}>
            <RawFindingsTable
              groupID={props.rowData.id}
              isCollapsed={!collapsed}
            />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const GroupedFindingsTable: React.FC = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [pageNumber, setPage] = useState(0);

  const { loading, data } = useQuery<{
    groupedFindings: GroupedFindingsDataIFace[];
  }>(GroupedFindingsQuery, {
    variables: {
      start: pageNumber * rowsPerPage,
      end: (pageNumber + 1) * rowsPerPage,
    },
  });

  const { loading: totalLoading, data: totalData } = useQuery<{
    totalGroupedFindings: number;
  }>(TotalGroupedFindingsQuery);

  const generateData = useCallback(() => {
    return (
      !loading &&
      data &&
      data.groupedFindings.map((instance, index) => {
        return (
          <GroupedFindingsRow rowData={instance} key={instance.id + index} />
        );
      })
    );
  }, [loading, data]);

  useEffect(() => {
    console.log(data, loading);
  }, [data, loading]);

  return (
    <div id={styles.groupedFindingsTable}>
      <Typography className={styles.headerText}>Grouped Findings</Typography>

      {totalLoading ? (
        <CircularProgress />
      ) : (
        <TableContainer className={styles.tableContainer}>
          <Table className={styles.table}>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell className={styles.headerTableCell}>
                  Severity
                </TableCell>
                <TableCell className={styles.headerTableCell}>Time</TableCell>
                <TableCell className={styles.headerTableCell}>SLA</TableCell>
                <TableCell className={styles.headerTableCell}>
                  Description
                </TableCell>
                <TableCell className={styles.headerTableCell}>
                  Security Analyst
                </TableCell>
                <TableCell className={styles.headerTableCell}>Owner</TableCell>
                <TableCell className={styles.headerTableCell}>
                  Workflow
                </TableCell>
                <TableCell className={styles.headerTableCell}>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody className={styles.tableBody}>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <div className={styles.circularProgressContainer}>
                      <CircularProgress />
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                generateData()
              )}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5]}
                  colSpan={9}
                  count={(totalData && totalData.totalGroupedFindings) || 0}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={(
                    event: React.ChangeEvent<
                      HTMLInputElement | HTMLTextAreaElement
                    >
                  ) => {
                    setRowsPerPage(parseInt(event.target.value));
                  }}
                  page={pageNumber}
                  onPageChange={(
                    event: React.MouseEvent<HTMLButtonElement> | null,
                    newPage: number
                  ) => {
                    setPage(newPage);
                  }}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default GroupedFindingsTable;
