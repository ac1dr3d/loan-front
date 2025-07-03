/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
  extend: 'LoanFront.Application',

  name: 'LoanFront',

  requires: [
    // This will automatically load all classes in the LoanFront namespace
    // so that application classes do not need to require each other.
    'LoanFront.*',
    'LoanFront.view.login.Login',
    'LoanFront.view.main.Main'
  ],

  // The name of the initial view to create.
  // mainView: 'LoanFront.view.main.Main'
  launch: function() {
    // Check if user is authenticated
    Ext.Ajax.request({
      url: '/api/check-auth',
      success: function() {
        Ext.create('LoanFront.view.main.Main');
      },
      failure: function() {
        Ext.create('LoanFront.view.login.Login');
      }
    });
  }
});
