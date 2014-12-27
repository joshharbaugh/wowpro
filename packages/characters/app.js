'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Characters = new Module('characters');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Characters.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Characters.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  Characters.menus.add({
    'roles': ['authenticated'],
    'title': 'Characters',
    'link': 'all characters'
  });

  //Characters.aggregateAsset('js','/packages/system/public/services/menus.js', {group:'footer', absolute:true, weight:-9999});
  //Characters.aggregateAsset('js', 'test.js', {group: 'footer', weight: -1});

  /*
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Characters.settings({'someSetting':'some value'},function (err, settings) {
      //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Characters.settings({'anotherSettings':'some value'});

    // Get settings. Retrieves latest saved settings
    Characters.settings(function (err, settings) {
      //you now have the settings object
    });
    */
  Characters.aggregateAsset('css', 'characters.css');

  return Characters;
});
