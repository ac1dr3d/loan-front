Ext.define("LoanFront.view.register.Register", {
  extend: "Ext.window.Window",
  xtype: "register",

  title: "რეგისტრაციის ფორმა",
  closable: false,
  autoShow: true,
  modal: true,
  width: 600, // wider window
  layout: "fit", // ensures form fills the window

  items: [
    {
      xtype: "container",
      layout: {
        type: "vbox",
        align: "center", // center the form horizontally
      },
      items: [
        {
          xtype: "form",
          reference: "form",
          width: 600, // fixed width for the form
          bodyPadding: 15,
          defaults: {
            xtype: "textfield",
            allowBlank: false,
            anchor: "100%",
            margin: "0 0 10 0",
            labelStyle: "white-space: nowrap;",
            labelWidth: 160,
          },
          items: [
            {
              name: "firstName",
              fieldLabel: "სახელი",
              vtype: "alpha",
              msgTarget: "side",
            },
            {
              name: "lastName",
              fieldLabel: "გვარი",
              vtype: "alpha",
              msgTarget: "side",
            },
            {
              name: "idNumber",
              fieldLabel: "პირადი ნომერი",
              vtype: "numeric",
              msgTarget: "side",
            },
            {
              xtype: "autoslashdatefield",
              name: "birthDate",
              fieldLabel: "დაბადების თარიღი",
              format: "d/m/Y", // or "d.m.Y", etc.
              submitFormat: "Y-m-d", // format sent to backend
              maxValue: new Date(), // can't pick future
              allowBlank: false,
              msgTarget: "side",
            },
            {
              name: "email",
              fieldLabel: "ელ-ფოსტა",
              vtype: "email",
              msgTarget: "side",
            },
            {
              name: "password",
              fieldLabel: "პაროლი",
              inputType: "password",
              msgTarget: "side",
            },

            {
              name: "confirmPassword",
              inputType: "password",
              fieldLabel: "პაროლის დადასტურება",
              allowBlank: false,
              msgTarget: "side",
              validator: function (value) {
                const passwordField = this.up("form")
                  .getForm()
                  .findField("password");
                const password = passwordField.getValue();
                if (value !== password) {
                  return "პაროლი და დადასტურება არ ემთხვევა";
                }
                return true;
              },
            },
          ],
          buttons: [
            { text: "< უკან", handler: "onBackToLogin" },
            {
              text: "რეგისტრაცია",
              handler: "onRegisterSubmit",
            },
          ],
        },
      ],
    },
  ],

  controller: "register",
});
