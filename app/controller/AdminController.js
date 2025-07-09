Ext.define("LoanFront.controller.AdminController", {
  extend: "Ext.app.ViewController",
  alias: "controller.admin",

  init: function () {
    const store = Ext.getStore("pending_loans");

    if (!store) {
      console.error("PendingLoansStore not found");
      return;
    }

    this.loadPendingAndUnderReviewLoans();

    this.pollingInterval = setInterval(() => {
      Ext.Ajax.request({
        url: "http://localhost:5021/api/loan/admin/pending-loans",
        method: "GET",
        success: function (response) {
          const newLoans = Ext.decode(response.responseText);

          const existingIds = new Set(
            store.getData().items.map((record) => record.get("id")),
          );

          const uniqueNewLoans = newLoans.filter(
            (loan) => !existingIds.has(loan.id),
          );

          if (uniqueNewLoans.length > 0) {
            store.insert(0, uniqueNewLoans); // 👈 Prepend new records
          }
        },
        failure: function () {
          console.warn("Failed to fetch pending loans.");
        },
      });
    }, 5000);
  },

  onDestroy: function () {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  },

  loadPendingAndUnderReviewLoans: function (reload = false) {
    const store = Ext.getStore("pending_loans");
    if (!store) return;

    const existingIds = new Set(store.getData().items.map((r) => r.get("id")));

    // Helper to add unique records
    const addUniqueLoans = (loans) => {
      const newLoans = loans.filter((loan) => !existingIds.has(loan.id));
      store.add(newLoans);
    };

    // Fetch under-review loans
    Ext.Ajax.request({
      url: "http://localhost:5021/api/loan/admin/under-review-loans",
      method: "GET",
      success: function (response) {
        const underReviewLoans = Ext.decode(response.responseText);
        if (!reload) {
          addUniqueLoans(underReviewLoans);
        } else {
          store.setData(underReviewLoans);
        }
      },
    });

    // Fetch pending loans
    Ext.Ajax.request({
      url: "http://localhost:5021/api/loan/admin/pending-loans",
      method: "GET",
      success: function (response) {
        const pendingLoans = Ext.decode(response.responseText);
        addUniqueLoans(pendingLoans);
      },
    });
  },

  onApproveLoan: function (btn) {
    var rowIndex = btn.up("gridview").indexOf(btn.el.up("table"));

    const tabPanel = btn.up("tabpanel");
    const grid = tabPanel.down("grid");
    var record = grid.getStore().getAt(rowIndex);

    Ext.Msg.show({
      title: "დასტური",
      message: "დარწმუნებული ხართ, რომ გსურთ სესხის დადასტურება?",
      buttons: Ext.Msg.YESNO,
      buttonText: {
        yes: "დიახ",
        no: "არა",
      },
      icon: Ext.Msg.QUESTION,
      fn: (btn) => {
        if (btn !== "yes") return;

        Ext.Ajax.request({
          url: `http://localhost:5021/api/loan/${record.id}/approve-loan`,
          method: "PUT",
          success: () => {
            Ext.Msg.alert("დადასტურება", "სესხი წარმატებით დადასტურდა.");
            this.loadPendingAndUnderReviewLoans(true);
          },
        });
      },
    });
  },
  onRejectLoan: function (btn) {
    var rowIndex = btn.up("gridview").indexOf(btn.el.up("table"));

    const tabPanel = btn.up("tabpanel");
    const grid = tabPanel.down("grid");
    var record = grid.getStore().getAt(rowIndex);

    Ext.Msg.show({
      title: "უარყოფა",
      message: "დარწმუნებული ხართ, რომ გსურთ სესხის უარყოფა?",
      buttons: Ext.Msg.YESNO,
      buttonText: {
        yes: "დიახ",
        no: "არა",
      },
      icon: Ext.Msg.QUESTION,
      fn: (btn) => {
        if (btn !== "yes") return;

        Ext.Ajax.request({
          url: `http://localhost:5021/api/loan/${record.id}/reject-loan`,
          method: "PUT",
          success: () => {
            Ext.Msg.alert("უარყოფა", "სესხი წარმატებით უარყოფილია.");
            this.loadPendingAndUnderReviewLoans(true);
          },
        });
      },
    });
  },
});
