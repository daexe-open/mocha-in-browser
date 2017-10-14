function mochaSetup (mocha, mochaOptions) {
  /* istanbul ignore if */
  if (!mocha) {
    return
  }

  // MUST-HAVE
  // Used to bind functions such as `describe`, `before` and etc. to the window
  'ui' in mocha && mocha.ui('bdd')

  for (var option in mochaOptions) {
      mocha[option](mochaOptions[option])
  }
}

module.exports = mochaSetup
