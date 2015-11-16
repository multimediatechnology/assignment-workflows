'use strict'

const generators = require('yeoman-generator')
const promptConfig = require('./prompts/config')

module.exports = generators.Base.extend({
  constructor: function() {
    generators.Base.apply(this, arguments)
  },
  initializing() {
    // this.destinationRoot('tmp')
  },
  prompting() {
    const done = this.async()
    this.prompt(promptConfig, function(userConfig) {
      this.userConfig = userConfig
      this.config.set(userConfig)
      done()
    }.bind(this))
  },
  writing() {
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      this.userConfig
    )

    this.fs.copy(
      this.templatePath('_Gruntfile.js'),
      this.destinationPath('Gruntfile.js')
    )

    this.fs.copy(
      this.templatePath('editorconfig'),
      this.destinationPath('.editorconfig')
    )
    this.fs.copy(
      this.templatePath('eslintrc'),
      this.destinationPath('.eslintrc')
    )
    this.fs.copy(
      this.templatePath('gitattributes'),
      this.destinationPath('.gitattributes')
    )
    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore')
    )
    this.fs.copy(
      this.templatePath('nvmrc'),
      this.destinationPath('.nvmrc')
    )

    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('app/index.html'),
      this.userConfig
    )

    this.fs.copy(
      this.templatePath('scripts/app.js'),
      this.destinationPath('app/scripts/app.js')
    )

    this.fs.copy(
      this.templatePath('styles/app.scss'),
      this.destinationPath('app/styles/app.scss')
    )

    this.fs.copy(
      this.templatePath('icons/*'),
      this.destinationPath('app/icons/')
    )

    this.fs.copy(
      this.templatePath('images/*'),
      this.destinationPath('app/images/')
    )
  },
  install() {
    this.npmInstall()
  }
})
