Ext.define("LoanFront.view.login.Login", {
  extend: "Ext.window.Window",
  xtype: "login",

  title: "ავტორიზაცია",
  closable: false,
  autoShow: true,
  modal: true,
  width: 400,

  initComponent: function () {
    this.callParent(arguments);

    if (this.emailPrefill) {
      const form = this.down("form");
      const emailField = form.getForm().findField("email");
      if (emailField) {
        emailField.setValue(this.emailPrefill);
      }
    }
  },

  items: [
    {
      xtype: "form",
      reference: "form",
      bodyPadding: 15,
      defaults: {
        xtype: "textfield",
        allowBlank: false,
        margin: "0 0 10 0",
      },
      items: [
        {
          name: "email",
          fieldLabel: "ელ.ფოსტა",
          vtype: "email",
        },
        {
          name: "password",
          fieldLabel: "პაროლი",
          inputType: "password",
        },
      ],
      buttons: [
        {
          text: "შესვლა",
          formBind: true,
          handler: "onLoginClick",
        },
        {
          text: "სისტემაში რეგისტრაცია",
          handler: "onRegisterClick",
        },
      ],
    },
  ],

  controller: "login",
});
