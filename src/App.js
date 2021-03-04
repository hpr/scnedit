import './App.css';
import stringHash from 'string-hash';
import {useState} from 'react';
import {saveAs} from 'file-saver';

function App() {
  const [bytes, setBytes] = useState([]);
  const [proposedCols, setProposedCols] = useState(20);
  const [cols, setCols] = useState(20);
  const [layers, setLayers] = useState([]);
  const [selectedLayer, setSelectedLayer] = useState(0);
  const [numLayers, setNumLayers] = useState(1);
  const [paintMode, setPaintMode] = useState(false);
  const [bucket, setBucket] = useState("0,-1,-1");
  const [filename, setFilename] = useState("");

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
      console.groupEnd();
    }
  }

  const exportScn = () => {
    const layerData = [];
    const layerSizes = [];
    for (const layer of layers) {
      const layerHdr = new DataView(new ArrayBuffer(8));
      layerHdr.setUint32(0, layer.layerId, false);
      layerHdr.setUint32(4, layer.layerZ, false);
      const layerRLEs = layer.tiles.reduce((acc, tile) => {
        const lastAutotileIdx = acc[acc.length - 4];
        const lastTilesetId = acc[acc.length - 3];
        const lastTileId = acc[acc.length - 2];
        if (lastAutotileIdx === tile.autotileIdx && lastTilesetId === tile.tilesetId && lastTileId === tile.tileId) {
          acc[acc.length - 1]++;
        } else {
          acc.push(tile.autotileIdx, tile.tilesetId, tile.tileId, 1);
        }
        return acc;
      }, []);
      const size = layerRLEs.length * 2 + 8;
      const layerRLEsDv = new DataView(new ArrayBuffer(layerRLEs.length * 2));
      layerRLEs.forEach((num, i) => layerRLEsDv.setInt16(i * 2, num, false));
      layerData.push(layerHdr, layerRLEsDv);
      layerSizes.push(size);
    }
    const layerSizesDv = new DataView(new ArrayBuffer(layerSizes.length * 4));
    layerSizes.forEach((sz, i) => layerSizesDv.setUint32(i * 4, sz, false));
    const blob = new Blob([ layerSizesDv, ...layerData ]);
    saveAs(blob, filename);
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
        <div>
          <input type="file" accept=".scn" onChange={(evt) => {
            const reader = new FileReader();
            const file = evt.target.files[0];
            reader.onload = () => {
              const data = new Uint8Array(reader.result);
              setBytes(data);
              setFilename(file.name);
              getLayers(data);
            }
            reader.readAsArrayBuffer(file);
          }} />
          <button onClick={() => exportScn()}>Export changes</button>
        </div>
        <div>
          <label htmlFor="numLayers">Number of layers: </label>
          <input type="number" name="numLayers" value={numLayers} onChange={(e) => setNumLayers(Number(e.target.value))} />
          <button onClick={() => getLayers()}>Re-calculate layers</button>
        </div>
        <div>
          <label htmlFor="cols">Columns: </label>
          <input type="number" name="cols" value={proposedCols} onChange={(e) => setProposedCols(Number(e.target.value))} />
          <button onClick={() => setCols(Number(proposedCols))}>Set columns</button>
        </div>
        <div>
          <label htmlFor="layer">Selected layer: </label>
          <select name="layer" value={selectedLayer} onChange={(e) => setSelectedLayer(Number(e.target.value))}>
            {layers.map((layer, i) => <option key={i} value={i}>{layer.layerId} (z = {layer.layerZ})</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="paintMode">Paint mode: </label>
          <input type="checkbox" name="paintMode" value={paintMode} onChange={() => setPaintMode(!paintMode)}/>
        </div>
        <div><label htmlFor="bucket">Paint with: </label><input type="text" name="bucket" value={bucket} onChange={(e) => setBucket(e.target.value)} /></div>
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
