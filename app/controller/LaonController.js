Ext.define("LoanFront.controller.LoanController", {
  extend: "Ext.app.ViewController",
  alias: "controller.loan",

  init: function () {
    const store = Ext.getStore("loans");

    this.pollingInterval = setInterval(() => {
      Ext.Ajax.request({
        url: "http://localhost:5021/api/loan/all",
        method: "GET",
        success: function (response) {
          const newLoanData = Ext.decode(response.responseText);
          const store = Ext.getStore("loans");

          const existingRecords = store.getData().items;
          const existingMap = {};
          existingRecords.forEach((rec) => {
            existingMap[rec.get("id")] = rec;
          });

          newLoanData.forEach((newLoan) => {
            const existing = existingMap[newLoan.id];
            if (existing) {
              if (existing?.data?.statusId !== newLoan?.statusId) {
                const oldLoanStatus = existing.getLoanStatus();
                oldLoanStatus.set("name", newLoan?.loanStatus?.name);
                existing.set("statusId", newLoan?.statusId);
              }
            }
          });
        },
        failure: function () {
          console.warn("Failed to fetch loan records.");
        },
      });
    }, 5000);
  },
  onCreateLoan: function (btn) {
    const formPanel = btn.up("loan-form");
    const form = formPanel.getForm();
    const formId = Ext.id(); // generates a unique ID
    form.owner.formId = formId;

    if (form.isValid()) {
      const values = form.getValues();
      Ext.Ajax.request({
        url: "http://localhost:5021/api/loan/create",
        method: "POST",
        jsonData: values,
        formId: formId, // custom property
        success: function () {
          Ext.Msg.alert("წარმატება", "სესხი დამატებულია.");
          form.reset();

          const tabPanel = btn.up("tabpanel");
          const grid = tabPanel.down("grid");
          grid.getStore().reload();
          tabPanel.setActiveTab(0);
        },
      });
    }
  },

  onSendLoan: function (btn) {
    var rowIndex = btn.up("gridview").indexOf(btn.el.up("table"));

    const tabPanel = btn.up("tabpanel");
    const grid = tabPanel.down("grid");
    var record = grid.getStore().getAt(rowIndex);

    Ext.Msg.show({
      title: "დასტური",
      message: "დარწმუნებული ხართ, რომ გსურთ სესხის მოთხოვნის გაგზავნა?",
      buttons: Ext.Msg.YESNO,
      buttonText: {
        yes: "დიახ",
        no: "არა",
      },
      icon: Ext.Msg.QUESTION,
      fn: (btn) => {
        if (btn !== "yes") return;

        Ext.Ajax.request({
          url: `http://localhost:5021/api/loan/${record.id}/send-loan-request`,
          method: "PUT",
          success: () => {
            Ext.Msg.alert("წაშლა", "სესხის მოთხოვნა წარმატებით გადაიგზავნა.");
            this.reloadLoans();
          },
        });
      },
    });
  },

  onUpdateLoan: function (btn) {
    const win = btn.up("window");
    const form = win.down("form").getForm();
    if (!form.isValid()) return;
    const formId = Ext.id();
    form.owner.formId = formId;

    const values = form.getValues();

    Ext.Ajax.request({
      url: "http://localhost:5021/api/loan/update",
      method: "PUT",
      jsonData: values,
      formId: formId,
      success: () => {
        Ext.Msg.alert("წარმატება", "სესხი განახლდა.");
        win.close();
        this.reloadLoans();
      },
    });
  },

  onDeleteLoan: function (btn) {
    var rowIndex = btn.up("gridview").indexOf(btn.el.up("table"));

    const tabPanel = btn.up("tabpanel");
    const grid = tabPanel.down("grid");
    var record = grid.getStore().getAt(rowIndex);

    Ext.Msg.show({
      title: "დასტური",
      message: "დარწმუნებული ხართ, რომ გსურთ სესხის წაშლა?",
      buttons: Ext.Msg.YESNO,
      buttonText: {
        yes: "დიახ",
        no: "არა",
      },
      icon: Ext.Msg.QUESTION,
      fn: (btn) => {
        if (btn !== "yes") return;

        Ext.Ajax.request({
          url: `http://localhost:5021/api/loan/${record.id}`,
          method: "DELETE",
          success: () => {
            Ext.Msg.alert("წაშლა", "სესხი წარმატებით წაიშალა.");
            this.reloadLoans();
          },
        });
      },
    });
  },

  reloadLoans: function () {
    const store = Ext.getStore("loans");
    if (store) {
      store.reload();
    }
  },
});
