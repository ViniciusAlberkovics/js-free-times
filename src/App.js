import "./styles.css";
import { makeFreeTime } from "./makeFreeTime";

export default function App() {
  const { unavailableSorted, groupped } = makeFreeTime();
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
    </div>
  );
}
