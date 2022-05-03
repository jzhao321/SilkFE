import React, { useEffect, useRef } from "react";

import { Chart, registerables } from "chart.js";

import styles from "./FindingsChart.module.scss";
import { gql, useQuery } from "@apollo/client";
import { CircularProgress } from "@mui/material";

Chart.register(...registerables);

const SEVERITY_COUNT_QUERY = gql`
  query GroupedFindings {
    groupedBySeverity {
      count
      groupName
    }
  }
`;

interface SeverityCountIFace {
  count: number;
  groupName: string;
}

const colorLookup = (severityGroup: string): string => {
  switch (severityGroup) {
    case "critical":
      return "rgb(255, 99, 132)";
    case "high":
      return "rgb(255, 171, 114)";
    case "medium":
      return "rgb(255, 249, 145)";
    default:
      return "rgb(192, 255, 159)";
  }
};

const FindingsChart: React.FC = () => {
  const { loading, data: queryData } = useQuery<{
    groupedBySeverity: SeverityCountIFace[];
  }>(SEVERITY_COUNT_QUERY);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    console.log("asdfasdf");
    let chart: Chart;

    if (queryData) {
      chart = new Chart(canvasRef.current, {
        type: "pie",
        data: {
          labels: queryData.groupedBySeverity.map((instance) => {
            return instance.groupName;
          }),
          datasets: [
            {
              label: "First Data set",
              data: queryData.groupedBySeverity.map((instance) => {
                return instance.count;
              }),
              backgroundColor: queryData.groupedBySeverity.map((instance) => {
                return colorLookup(instance.groupName);
              }),
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Grouped Findings by Severity",
            },
          },
        },
      });
    }
    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, [loading, queryData]);

  return (
    <div className={styles.root}>
      {loading ? (
        <CircularProgress />
      ) : (
        <canvas ref={canvasRef} id="chartElement" width={400} height={500} />
      )}
    </div>
  );
};

export default FindingsChart;
