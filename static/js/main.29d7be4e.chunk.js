(this.webpackJsonpscnedit=this.webpackJsonpscnedit||[]).push([[0],{16:function(e,t,n){},17:function(e,t,n){},20:function(e,t,n){"use strict";n.r(t);var r=n(1),c=n.n(r),a=n(7),l=n.n(a),i=(n(16),n(11)),u=n(8),s=n(5),o=n(2),j=(n(17),n(9)),b=n.n(j),d=n(10),h=n(0);var f=function(){var e=Object(r.useState)([]),t=Object(o.a)(e,2),n=t[0],c=t[1],a=Object(r.useState)(20),l=Object(o.a)(a,2),j=l[0],f=l[1],O=Object(r.useState)(20),p=Object(o.a)(O,2),v=p[0],x=p[1],y=Object(r.useState)([]),g=Object(o.a)(y,2),m=g[0],I=g[1],w=Object(r.useState)(0),A=Object(o.a)(w,2),S=A[0],C=A[1],k=Object(r.useState)(1),N=Object(o.a)(k,2),E=N[0],U=N[1],z=Object(r.useState)(!1),B=Object(o.a)(z,2),F=B[0],D=B[1],M=Object(r.useState)("0,-1,-1"),V=Object(o.a)(M,2),Z=V[0],J=V[1],L=Object(r.useState)(""),P=Object(o.a)(L,2),R=P[0],T=P[1],q=function(e,t,n){return"#"+b()("".concat(e,",").concat(t,",").concat(n)).toString(16).slice(0,4)},G=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:n;try{var t=0,r=new DataView(e.buffer),c=Array(E).fill().map((function(e){var n=r.getUint32(t,!1);return t+=4,{size:n}}));c.forEach((function(e){var n=t+e.size;for(e.layerId=r.getUint32(t,!1),e.layerZ=r.getUint32(t+4,!1),t+=8,console.groupCollapsed("layer ".concat(e.layerId," (sz ").concat(e.size,", z ").concat(e.layerZ,"):")),e.tiles=[];t<n;t+=8){var c,a=r.getInt16(t,!1),l=r.getInt16(t+2,!1),i=r.getInt16(t+4,!1),u=r.getInt16(t+6,!1);console.log({autotileIdx:a,tilesetId:l,tileId:i,numTiles:u});var o=q(a,l,i);(c=e.tiles).push.apply(c,Object(s.a)(Array(u).fill({autotileIdx:a,tilesetId:l,tileId:i,color:o})))}console.groupEnd()})),I(c)}catch(a){alert("".concat(a," (try a different number of layers?)")),console.groupEnd()}},H=m[S]||{},K=H.tiles?Math.ceil(H.tiles.length/v):0;return Object(h.jsx)("div",{className:"App",children:Object(h.jsxs)("header",{className:"App-header",children:[Object(h.jsxs)("div",{children:[Object(h.jsx)("input",{type:"file",accept:".scn",onChange:function(e){var t=new FileReader,n=e.target.files[0];t.onload=function(){var e=new Uint8Array(t.result);c(e),T(n.name),G(e)},t.readAsArrayBuffer(n)}}),Object(h.jsx)("button",{onClick:function(){return function(){var e,t=[],n=[],r=Object(u.a)(m);try{var c=function(){var r=e.value,c=new DataView(new ArrayBuffer(8));c.setUint32(0,r.layerId,!1),c.setUint32(4,r.layerZ,!1);var a=r.tiles.reduce((function(e,t){var n=e[e.length-4],r=e[e.length-3],c=e[e.length-2];return n===t.autotileIdx&&r===t.tilesetId&&c===t.tileId?e[e.length-1]++:e.push(t.autotileIdx,t.tilesetId,t.tileId,1),e}),[]),l=2*a.length+8,i=new DataView(new ArrayBuffer(2*a.length));a.forEach((function(e,t){return i.setInt16(2*t,e,!1)})),t.push(c,i),n.push(l)};for(r.s();!(e=r.n()).done;)c()}catch(i){r.e(i)}finally{r.f()}var a=new DataView(new ArrayBuffer(4*n.length));n.forEach((function(e,t){return a.setUint32(4*t,e,!1)}));var l=new Blob([a].concat(t));Object(d.saveAs)(l,R)}()},children:"Export changes"})]}),Object(h.jsxs)("div",{children:[Object(h.jsx)("label",{htmlFor:"numLayers",children:"Number of layers: "}),Object(h.jsx)("input",{type:"number",name:"numLayers",value:E,onChange:function(e){return U(Number(e.target.value))}}),Object(h.jsx)("button",{onClick:function(){return G()},children:"Re-calculate layers"})]}),Object(h.jsxs)("div",{children:[Object(h.jsx)("label",{htmlFor:"cols",children:"Columns: "}),Object(h.jsx)("input",{type:"number",name:"cols",value:j,onChange:function(e){return f(Number(e.target.value))}}),Object(h.jsx)("button",{onClick:function(){return x(Number(j))},children:"Set columns"})]}),Object(h.jsxs)("div",{children:[Object(h.jsx)("label",{htmlFor:"layer",children:"Selected layer: "}),Object(h.jsx)("select",{name:"layer",value:S,onChange:function(e){return C(Number(e.target.value))},children:m.map((function(e,t){return Object(h.jsxs)("option",{value:t,children:[e.layerId," (z = ",e.layerZ,")"]},t)}))})]}),Object(h.jsxs)("div",{children:[Object(h.jsx)("label",{htmlFor:"paintMode",children:"Paint mode: "}),Object(h.jsx)("input",{type:"checkbox",name:"paintMode",value:F,onChange:function(){return D(!F)}})]}),Object(h.jsxs)("div",{children:[Object(h.jsx)("label",{htmlFor:"bucket",children:"Paint with: "}),Object(h.jsx)("input",{type:"text",name:"bucket",value:Z,onChange:function(e){return J(e.target.value)}})]}),Object(h.jsx)("table",{onClick:function(e){if(F){var t=Number(e.target.getAttribute("name")),n=Z.split(","),r=Object(o.a)(n,3),c=r[0],a=r[1],l=r[2],u=q(c,a,l),j=Object(s.a)(m),b=Object(i.a)({},m[S]),d=Object(s.a)(b.tiles);j[S]=b,b.tiles=d,d[t]={autotileIdx:c,tilesetId:a,tileId:l,color:u},I(j)}},children:Object(h.jsx)("tbody",{children:v?Array(K).fill().map((function(e,t){return Object(h.jsx)("tr",{children:Array(v).fill().map((function(e,n){return function(e,t){return e?Object(h.jsxs)("td",{name:t,style:{background:e.color},children:[e.autotileIdx,",",e.tilesetId,",",e.tileId]},t):Object(h.jsx)("td",{},t)}(H.tiles[t*v+n],n)}))},t)})):null})})]})})};l.a.render(Object(h.jsx)(c.a.StrictMode,{children:Object(h.jsx)(f,{})}),document.getElementById("root"))}},[[20,1,2]]]);
//# sourceMappingURL=main.29d7be4e.chunk.js.map