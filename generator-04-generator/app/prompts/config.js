const git = require('git-info')
const inquirer = require('inquirer')

module.exports = [
  {
    type: 'input',
    name: 'name',
    message: 'Your project name',
    required: true
  },
  {
    type: 'input',
    name: 'description',
    message: 'Your project description'
  },
  {
    type: 'input',
    name: 'title',
    message: 'Your project <title>…</title>',
    required: true
  },
  {
    type: 'input',
    name: 'author',
    message: 'Project author(s)',
    default: function() {
      const done = this.async()
      git('authors', function(err, result) {
        if (err) {
          return done(err)
        }
        done(result.authors)
      })
    },
    required: true
  },
  {
    type: 'input',
    name: 'license',
    message: 'Project license',
    default: 'MIT',
    required: true
  },
  {
    type: 'input',
    name: 'main',
    message: 'Project entry file',
    default: 'app/index.html',
    required: true
  },
  {
    type: 'checkbox',
    name: 'engine',
    message: 'Select engine(s)',
    choices: [
      {
        type: 'node',
        value: '^4.0.0'
      },
      {
        type: 'node',
        value: '^5.0.0',
        checked: true
      },
      new inquirer.Separator(),
      {
        type: 'npm',
        value: '^2.0.0'
      },
      {
        type: 'npm',
        value: '^3.0.0',
        checked: true
      }
    ]
  }
]
