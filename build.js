({
  baseUrl:'app',
  name: 'require_main',
  out: 'dist/main.js',
  mainConfigFile: 'app/require_main.js',

  // Uniquement si vous avez envie
  // de faire de la minification
  //optimize: "uglify2", //problème de compatibilité avec for of
  optimize: "none",
  generateSourceMaps: true,
  findNestedDependencies: true,
})
