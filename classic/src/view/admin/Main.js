Ext.define("LoanFront.view.admin.Main", {
  extend: "Ext.tab.Panel",
  xtype: "app-admin-main",

  requires: [
    "Ext.plugin.Viewport",
    "Ext.window.MessageBox",

    "LoanFront.controller.AdminController",
  ],

  controller: "admin",
  viewModel: "main",

  ui: "navigation",

  tabBarHeaderPosition: 1,
  titleRotation: 0,
  tabRotation: 0,

  header: {
    layout: {
      align: "stretchmax",
    },
    title: {
      bind: {
        text: "ადმინისტრირება",
      },
      flex: 0,
    },
    iconCls: "fa-th-list",
  },
  tabBar: {
    flex: 1,
    layout: {
      align: "stretch",
      overflowHandler: "none",
    },
    items: [
      {
        xtype: "tbfill", // pushes the next item to the bottom
      },
      {
        xtype: "button",
        text: "გასვლა",
        iconCls: "fa fa-sign-out",
        margin: 5,
        handler: function () {
          localStorage.removeItem("authToken");
          location.reload(); // or redirect to login
        },
      },
    ],
  },
  responsiveConfig: {
    tall: {
      headerPosition: "top",
    },
    wide: {
      headerPosition: "left",
    },
  },

  defaults: {
    bodyPadding: 20,
    tabConfig: {
      responsiveConfig: {
        wide: {
          iconAlign: "left",
          textAlign: "left",
        },
        tall: {
          iconAlign: "top",
          textAlign: "center",
          width: 120,
        },
      },
    },
  },

  items: [
    {
      title: "მოთხოვნილი სესხები",
      iconCls: "fa-clipboard-list",
      items: [
        {
          xtype: "grid",
          title: "სესხები",
          store: {
            type: "pending_loans",
          },

          columns: [
            {
              text: "თარიღი",
              dataIndex: "createdAt",
              xtype: "datecolumn",
              format: "d/m/Y H:i:s",
              flex: 1,
            },
            {
              text: "თანხა",
              dataIndex: "amount",
              xtype: "numbercolumn",
              flex: 1,
            },
            {
              text: "ვალუტა",
              renderer: function (value, meta, record) {
                return record?.data?.currency?.name;
              },
              flex: 1,
            },
            {
              text: "სესხის ტიპი",
              renderer: function (value, meta, record) {
                return record?.data?.loanType?.name;
              },
              flex: 1,
            },
            {
              text: "სტატუსი",
              renderer: function (value, meta, record) {
                return record?.data?.loanStatus?.name;
              },
              width: 200,
            },
            {
              text: "ვადა (თვე)",
              dataIndex: "monthsTerm",
              flex: 1,
            },
            {
              xtype: "widgetcolumn",
              text: "მოქმედებები",
              width: 210,
              widget: {
                xtype: "container",
                layout: {
                  type: "hbox",
                  align: "middle",
                  pack: "end",
                },
                defaults: {
                  margin: "0 4",
                },
                items: [
                  {
                    xtype: "button",
                    text: "დამტკიცება",
                    handler: "onApproveLoan",
                    itemId: "approveBtn",
                  },
                  {
                    xtype: "button",
                    text: "უარყოფა", // Delete
                    itemId: "rejectBtn",
                    handler: "onRejectLoan",
                  },
                ],
              },
            },
          ],
          height: 700,
          width: 1200,
          scrollable: true,
        },
      ],
    },
  ],
});
