import "./App.css";
import React from "react";
import GroupedFindingsTable from "../GroupedFindings/GroupedFindings";
import FindingsChart from "../FindingsChart/FindingsChart";

function App() {
  return (
    <div className="App">
      <GroupedFindingsTable />
      <FindingsChart />
    </div>
  );
}

export default App;
