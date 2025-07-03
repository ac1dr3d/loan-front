Ext.define('LoanFront.view.login.Login', {
  extend: 'Ext.window.Window',
  xtype: 'login',

  title: 'Login',
  closable: false,
  autoShow: true,
  modal: true,
  width: 400,

  items: [{
    xtype: 'form',
    reference: 'form',
    bodyPadding: 15,
    defaults: {
      xtype: 'textfield',
      allowBlank: false,
      margin: '0 0 10 0'
    },
    items: [{
      name: 'email',
      fieldLabel: 'Email',
      vtype: 'email'
    }, {
      name: 'password',
      fieldLabel: 'Password',
      inputType: 'password'
    }],
    buttons: [{
      text: 'Login',
      formBind: true,
      handler: 'onLoginClick'
    }, {
      text: 'Register',
      handler: 'onRegisterClick'
    }]
  }],

  controller: 'login'
});
