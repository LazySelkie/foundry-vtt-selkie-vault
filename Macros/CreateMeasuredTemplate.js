// Это вариант просто сделать шаблон

await game.canvas.scene.createEmbeddedDocuments("MeasuredTemplate", [{
  "t": "circle",
  "x": token.center.x,
  "y": token.center.y,
  "user": game.user.id,
  "distance": item.system.target.value,
}])

// А это с использованием чего-нибудь из TokenMagicFX

await game.canvas.scene.createEmbeddedDocuments("MeasuredTemplate", [{
  "t": "circle",
  "x": token.center.x,
  "y": token.center.y,
  "user": game.user.id,
  "distance": item.system.target.value,
  flags :
   {
     tokenmagic:
     {
        options:
        {
           tmfxPreset: "Watery Surface",
           tmfxTint: "#a30000",
           tmfxTextureAlpha: 0.80
        }
     }
   }
}])
