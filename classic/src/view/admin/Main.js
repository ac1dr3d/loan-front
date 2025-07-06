Ext.define("LoanFront.view.admin.Main", {
  extend: "Ext.tab.Panel",
  xtype: "app-main",

  requires: [
    "Ext.plugin.Viewport",
    "Ext.window.MessageBox",

    "LoanFront.view.main.MainController",
    "LoanFront.view.main.MainModel",
    "LoanFront.view.main.List",
  ],

  controller: "main",
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
        text: "Loan Administration",
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
        text: "Logout",
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
      title: "Home",
      iconCls: "fa-home",
      // The following grid shares a store with the classic version's grid as well!
      items: [
        {
          xtype: "mainlist",
        },
      ],
    },
    {
      title: "Users",
      iconCls: "fa-user",
      bind: {
        html: "{loremIpsum}",
      },
    },
    {
      title: "Groups",
      iconCls: "fa-users",
      bind: {
        html: "{loremIpsum}",
      },
    },
    {
      title: "Settings",
      iconCls: "fa-cog",
      bind: {
        html: "{loremIpsum}",
      },
    },
  ],
});
