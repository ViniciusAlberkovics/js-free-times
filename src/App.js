const { useState } = require("react");
const moment = require("moment");

import "./styles.css";
import { makeFreeTime } from "./makeFreeTime";

export default function App() {
  const [unavailable, setUnavailable] = useState([
    {
      id: 1,
      startTime: moment("08:00", "HH:mm"),
      endTime: moment("08:30", "HH:mm")
    },
    {
      id: 2,
      startTime: moment("09:30", "HH:mm"),
      endTime: moment("10:00", "HH:mm")
    },
    {
      id: 3,
      startTime: moment("10:00", "HH:mm"),
      endTime: moment("11:00", "HH:mm")
    },
    {
      id: 4,
      startTime: moment("12:15", "HH:mm"),
      endTime: moment("12:30", "HH:mm")
    },
    {
      id: 5,
      startTime: moment("14:20", "HH:mm"),
      endTime: moment("14:40", "HH:mm")
    },
    {
      id: 6,
      startTime: moment("21:20", "HH:mm"),
      endTime: moment("22:00", "HH:mm")
    },
    {
      id: 7,
      startTime: moment("22:20", "HH:mm"),
      endTime: moment("22:30", "HH:mm")
    }
  ]);
  const { unavailableSorted, groupped, completedGroup } = makeFreeTime(unavailable);
  return (
    <div className="App">
      <h3>Horario Ocupado</h3>
      {unavailableSorted.map((u) => (
        <tr key={u.id}>
          <td style={{ border: "1px solid #000", padding: "3px" }}>
            {u.startTime.format()}
          </td>
          <td style={{ border: "1px solid #000", padding: "3px" }}>
            {u.endTime.format()}
          </td>
        </tr>
      ))}

      <h3>Horario livre</h3>
      {groupped.map((u) => (
        <tr key={u.id}>
          <td style={{ border: "1px solid #000", padding: "3px" }}>
            {u.start.format()}
          </td>
          <td style={{ border: "1px solid #000", padding: "3px" }}>
            {u.end.format()}
          </td>
        </tr>
      ))}

      <h3>Horario Livre Completo</h3>
      {completedGroup.map((u) => (
        <tr key={u.incrementalId}>
          <td style={{ border: "1px solid #000", padding: "3px" }}>
            {u.startDate.format()}
          </td>
          <td style={{ border: "1px solid #000", padding: "3px" }}>
            {u.endDate.format()}
          </td>
        </tr>
      ))}

      <h3>Horario Completo</h3>
      {[...unavailableSorted, ...(completedGroup.map(c => ({
        id: c.incrementalId,
        startTime: c.startDate,
        endTime: c.endDate,
        free: true
      })))].sort((a, b) => a.startTime.diff(b.startTime, 'minutes')).map((u) => (
        <tr key={u.incrementalId} style={{ backgroundColor: u.free ? "green" : "red" }}>
          <td style={{ border: "1px solid #000", padding: "3px" }}>
            {u.startTime.format()}
          </td>
          <td style={{ border: "1px solid #000", padding: "3px" }}>
            {u.endTime.format()}
          </td>
        </tr>
      ))}
    </div>
  );
}
