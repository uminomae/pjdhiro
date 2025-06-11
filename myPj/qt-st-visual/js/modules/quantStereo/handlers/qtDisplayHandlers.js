// js/core/handlers/displayHandlers.js
export function getDisplayHandlers(scene) {
  return [
    {
      selector: '#toggle-grid-sphere',
      type: 'change',
      handler: e => {
        const m = scene.getObjectByName('earthGridPoints');
        if (m) m.visible = e.target.checked;
      }
    },
    {
      selector: '#toggle-ground-visibility',
      type: 'change',
      handler: () => {
      // GroundMesh は SceneModule が制御済み
      }
    },
    {
      selector: '#toggle-helper-grid',
      type: 'change',
      handler: e => {
        const o = scene.getObjectByName('HelperGrid');
        if (o) o.visible = e.target.checked;
      }
    },
    {
      selector: '#toggle-helper-axes',
      type: 'change',
      handler: e => {
        const o = scene.getObjectByName('HelperAxes');
        if (o) o.visible = e.target.checked;
      }
    }
  ];
}