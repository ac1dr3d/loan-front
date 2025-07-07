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
        listeners: {
          specialkey: function (field, e) {
            if (e.getKey() === e.ENTER) {
              const formCmp = field.up("form");
              const controller = formCmp.lookupController();
              if (controller && typeof controller.onLoginClick === "function") {
                controller.onLoginClick();
              }
            }
          },
        },
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
        {
          xtype: "container",
          layout: {
            type: "hbox",
            align: "middle",
          },
          defaults: {
            flex: 0,
          },
          margin: "20 0 0 0",
          items: [
            {
              xtype: "button",
              text: "სისტემაში რეგისტრაცია",
              handler: "onRegisterClick",
              flex: 2,
            },
            {
              xtype: "component",
              flex: 1,
            },
            {
              xtype: "button",
              text: "შესვლა",
              formBind: true,
              handler: "onLoginClick",
              flex: 1,
              style: {
                textAlign: "right",
              },
            },
          ],
        },
      ],
    },
  ],

  controller: "login",
});
