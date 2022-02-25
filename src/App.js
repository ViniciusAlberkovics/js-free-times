import "./styles.css";
import { makeFreeTime } from "./makeFreeTime";

export default function App() {
  const { unavailableSorted, groupped, completedGroup } = makeFreeTime();
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
