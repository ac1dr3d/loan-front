/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define("LoanFront.Application", {
  extend: "Ext.app.Application",

  name: "LoanFront",

  quickTips: false,
  platformConfig: {
    desktop: {
      quickTips: true,
    },
  },

  onAppUpdate: function () {
    Ext.Msg.confirm(
      "Application Update",
      "This application has an update, reload?",
      function (choice) {
        if (choice === "yes") {
          window.location.reload();
        }
      },
    );
  },
});

Ext.Ajax.on("requestexception", function (conn, response, options) {
  const res = Ext.decode(response.responseText, true);
  if (!res || (!res.errors && !res.error)) return;

  if (res?.errors) {
    const allMessages = [];
    const errorMap = {};

    for (let field in res.errors) {
      const lower = field.charAt(0).toLowerCase() + field.slice(1);
      const message = res.errors[field][0];

      errorMap[lower] = message;
      allMessages.push(message);
    }

    // Try to find and mark form if formId was passed
    if (options.formId) {
      const allForms = Ext.ComponentQuery.query("form");
      const matchingForm = allForms.find((f) => f.formId === options.formId);
      if (matchingForm) {
        matchingForm.getForm().markInvalid(errorMap);
      }
    }

    Ext.Msg.alert("შეცდომა", allMessages.join("<br>"));
  }

  if (res?.error) {
    Ext.Msg.alert("შეცდომა", res.error);
  }
});
