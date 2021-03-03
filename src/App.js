import './App.css';
import stringHash from 'string-hash';
import {useState} from 'react';

function App() {
  const [u8s, setU8s] = useState([]);
  const [cols, setCols] = useState(20);
  const [layers, setLayers] = useState([]);
  const [numTiles, setNumTiles] = useState(0);
  const [selectedLayer, setSelectedLayer] = useState(0);

  const getLayers = (u8s) => {
    let idx = 0;
    let maxTiles = 0;
    const newLayers = [];
    while (idx < u8s.length - 12) {
      const dv = new DataView(u8s.buffer.slice(idx, idx + 12));
      const layerSize = dv.getUint32(0, false);
      const layerId = dv.getUint32(4, false);
      const layerZ = dv.getUint32(8, false);
      const layerEnd = idx + layerSize + 4;
      idx += 12;
      console.group(`layer ${layerId} (sz ${layerSize}, z ${layerZ}):`);
      const tiles = [];
      let totalTiles = 0;
      while (idx < layerEnd) {
        const dv = new DataView(u8s.buffer.slice(idx, idx + 8));
        const autotileIdx = dv.getInt16(0, false);
        const tilesetId = dv.getInt16(2, false);
        const tileId = dv.getInt16(4, false);
        const numTiles = dv.getInt16(6, false);
        totalTiles += numTiles;
        console.log(autotileIdx, tilesetId, tileId, numTiles);
        const color = '#' + stringHash(`${autotileIdx},${tilesetId},${tileId}`).toString(16).slice(0, 4);
        tiles.push(...Array(numTiles).fill({ autotileIdx, tilesetId, tileId, color }))
        idx += 8;
      }
      newLayers.push({layerId, layerZ, tiles});
      if (totalTiles > maxTiles) maxTiles = totalTiles;
      console.groupEnd();
      idx = layerEnd; //?
      console.log("i", idx, "/", u8s.length);
    }
    setLayers(newLayers);
    setNumTiles(maxTiles);
    console.log('layers', layers);
    console.log(maxTiles);
  }

  const formatCell = (cell, ci) => {
    if (!cell) return <td key={ci}></td>
    return <td key={ci} style={{background: cell.color}}>{cell.autotileIdx},{cell.tilesetId},{cell.tileId}</td>
  }

  const rows = Math.floor(numTiles / cols);

  return (
    <div className="App">
      <header className="App-header">
        <input type="file" accept=".scn" onChange={(evt) => {
          const reader = new FileReader();
          const file = evt.target.files[0];
          reader.onload = () => {
            const bytes = new Uint8Array(reader.result);
            setU8s(bytes);
            getLayers(bytes);
          }
          reader.readAsArrayBuffer(file);
        }} />
        <div><label htmlFor="cols">Columns: </label></div>
        <input type="number" name="cols" value={cols} onChange={(e) => setCols(Number(e.target.value))} />
        <div><label htmlFor="layer">Selected Layer: </label></div>
        <select name="layer" value={selectedLayer} onChange={(e) => setSelectedLayer(Number(e.target.value))}>
          {layers.map((layer, i) => <option key={i} value={i}>{layer.layerId} (z = {layer.layerZ})</option>)}
        </select>
        <table>
          <tbody>
            {cols && Array(rows).fill().map((_, ri) => <tr key={ri}>
              {Array(cols).fill().map((_, ci) => formatCell(layers[selectedLayer].tiles[ri * cols + ci], ci))}
            </tr>)}
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default App;
