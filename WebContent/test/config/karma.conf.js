module.exports = function(config){
    config.set({
    basePath : '../../',

    files : [
      'app/lib/angular/angular.js',
      'app/lib/angular/angular-*.js',
      'test/lib/angular/angular-mocks.js',
      'app/js/**/*.js',
      'test/unit/**/*.js',
      'app/dist/js/underscore-min.js',
      'app/dist/js/angular-google-maps.js'
    ],

    exclude : [
      'app/lib/angular/angular-loader.js',
      'app/lib/angular/*.min.js',
      'app/lib/angular/angular-scenario.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine'
            ],

    junitReporter : {
      outputFile: 'unit.xml',
      suite: 'unit'
    },
    
    vendor: [
             'http://maps.googleapis.com/maps/api/js?sensor=false&language=en'
    ]
})}
