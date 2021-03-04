import './App.css';
import stringHash from 'string-hash';
import {useState} from 'react';

function App() {
  const [bytes, setBytes] = useState([]);
  const [cols, setCols] = useState(20);
  const [layers, setLayers] = useState([]);
  const [selectedLayer, setSelectedLayer] = useState(0);
  const [numLayers, setNumLayers] = useState(1);

  const getLayers = (u8s = bytes) => {
    try {
      let idx = 0;
      const dv = new DataView(u8s.buffer);
      const newLayers = Array(numLayers).fill().map(_ => {
        const size = dv.getUint32(idx, false);
        idx += 4;
        return { size };
      })
      newLayers.forEach(layer => {
        //const groups = (layer.size - 8) / 8;
        const layerEnd = idx + layer.size;
        layer.layerId = dv.getUint32(idx, false);
        layer.layerZ = dv.getUint32(idx + 4, false);
        idx += 8;
        console.groupCollapsed(`layer ${layer.layerId} (sz ${layer.size}, z ${layer.layerZ}):`);
        layer.tiles = [];
        for (; idx < layerEnd; idx += 8) {
          const autotileIdx = dv.getInt16(idx, false);
          const tilesetId = dv.getInt16(idx + 2, false);
          const tileId = dv.getInt16(idx + 4, false);
          const numTiles = dv.getInt16(idx + 6, false);
          console.log({ autotileIdx, tilesetId, tileId, numTiles });
          const color = '#' + stringHash(`${autotileIdx},${tilesetId},${tileId}`).toString(16).slice(0, 4);
          layer.tiles.push(...Array(numTiles).fill({ autotileIdx, tilesetId, tileId, color }))
        }
        console.groupEnd();
      });
      setLayers(newLayers);
    } catch (err) {
      alert(`${err} (try a different number of layers?)`);
    }
  }

  const formatCell = (cell, ci) => {
    if (!cell) return <td key={ci}></td>
    return <td key={ci} style={{background: cell.color}}>{cell.autotileIdx},{cell.tilesetId},{cell.tileId}</td>
  }

  const layer = layers[selectedLayer] || {};
  const rows = layer.tiles ? Math.ceil(layer.tiles.length / cols) : 0;

  return (
    <div className="App">
      <header className="App-header">
        <input type="file" accept=".scn" onChange={(evt) => {
          const reader = new FileReader();
          const file = evt.target.files[0];
          reader.onload = () => {
            const data = new Uint8Array(reader.result);
            setBytes(data);
            getLayers(data);
          }
          reader.readAsArrayBuffer(file);
        }} />
        <div><label htmlFor="numLayers">Number of layers: </label></div>
        <input type="number" name="numLayers" value={numLayers} onChange={(e) => setNumLayers(Number(e.target.value))} />
        <button onClick={() => getLayers()}>Re-calculate layers</button>
        <div><label htmlFor="cols">Columns: </label></div>
        <input type="number" name="cols" value={cols} onChange={(e) => setCols(Number(e.target.value))} />
        <div><label htmlFor="layer">Selected Layer: </label></div>
        <select name="layer" value={selectedLayer} onChange={(e) => setSelectedLayer(Number(e.target.value))}>
          {layers.map((layer, i) => <option key={i} value={i}>{layer.layerId} (z = {layer.layerZ})</option>)}
        </select>
        <table>
          <tbody>
            {cols ? Array(rows).fill().map((_, ri) => <tr key={ri}>
              {Array(cols).fill().map((_, ci) => formatCell(layer.tiles[ri * cols + ci], ci))}
            </tr>) : null}
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default App;
