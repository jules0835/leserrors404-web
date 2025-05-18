export const botTreeMessages = {
  myOrders: {
    transKey: "Bot.MyOrder.title",
    questionTransKey: "Bot.MyOrder.question",
    questions: {
      missing: {
        transKey: "Bot.MyOrder.Questions.missing",
        responseTransKey: "Bot.MyOrder.Responses.missing",
        link: {
          href: "/user/dashboard/business/orders",
          type: "internal",
          needLogin: true,
        },
      },
      delay: {
        transKey: "Bot.MyOrder.Questions.delay",
        responseTransKey: "Bot.MyOrder.Responses.delay",
        link: {
          href: "/user/dashboard/business/orders",
          type: "internal",
          needLogin: true,
        },
      },
      question: {
        transKey: "Bot.MyOrder.Questions.question",
        responseTransKey: "Bot.MyOrder.Responses.question",
        action: "CONTACT_HUMAN",
        needLogin: true,
      },
      cancel: {
        transKey: "Bot.MyOrder.Questions.cancel",
        responseTransKey: "Bot.MyOrder.Responses.cancel",
        link: {
          href: "/user/dashboard/business/orders",
          type: "internal",
          needLogin: true,
        },
      },
      refund: {
        transKey: "Bot.MyOrder.Questions.refund",
        responseTransKey: "Bot.MyOrder.Responses.refund",
        link: {
          href: "/user/dashboard/business/orders",
          type: "internal",
          needLogin: true,
        },
      },
    },
  },

  subscriptions: {
    transKey: "Bot.Subscriptions.title",
    questionTransKey: "Bot.Subscriptions.question",
    questions: {
      where: {
        transKey: "Bot.Subscriptions.Questions.where",
        responseTransKey: "Bot.Subscriptions.Responses.where",
        link: {
          href: "/user/dashboard/business/subscriptions",
          type: "internal",
          needLogin: true,
        },
      },
      how: {
        transKey: "Bot.Subscriptions.Questions.how",
        responseTransKey: "Bot.Subscriptions.Responses.how",
        link: {
          href: "/user/dashboard/business/subscriptions",
          type: "internal",
          needLogin: true,
        },
      },
      question: {
        transKey: "Bot.Subscriptions.Questions.question",
        responseTransKey: "Bot.Subscriptions.Responses.question",
        action: "CONTACT_HUMAN",
      },
      cancel: {
        transKey: "Bot.Subscriptions.Questions.cancel",
        responseTransKey: "Bot.Subscriptions.Responses.cancel",
        link: {
          href: "/user/dashboard/business/subscriptions",
          type: "internal",
          needLogin: true,
        },
      },
      refund: {
        transKey: "Bot.Subscriptions.Questions.refund",
        responseTransKey: "Bot.Subscriptions.Responses.refund",
        link: {
          href: "/user/dashboard/business/subscriptions",
          type: "internal",
          needLogin: true,
        },
      },
    },
  },

  shop: {
    transKey: "Bot.Shop.title",
    questionTransKey: "Bot.Shop.question",
    questions: {
      difference: {
        transKey: "Bot.Shop.Questions.difference",
        responseTransKey: "Bot.Shop.Responses.difference",
      },
      pay: {
        transKey: "Bot.Shop.Questions.pay",
        responseTransKey: "Bot.Shop.Responses.pay",
      },
      methods: {
        transKey: "Bot.Shop.Questions.methods",
        responseTransKey: "Bot.Shop.Responses.methods",
      },
      product: {
        transKey: "Bot.Shop.Questions.product",
        responseTransKey: "Bot.Shop.Responses.product",
        link: {
          href: "/shop/products",
          type: "internal",
          needLogin: false,
        },
      },
      negociate: {
        transKey: "Bot.Shop.Questions.negociate",
        responseTransKey: "Bot.Shop.Responses.negociate",
        action: "CONTACT_HUMAN",
      },
      voucher: {
        transKey: "Bot.Shop.Questions.voucher",
        responseTransKey: "Bot.Shop.Responses.voucher",
      },
    },
  },

  customerService: {
    transKey: "Bot.CustomerService.title",
    questionTransKey: "Bot.CustomerService.question",
    questions: {
      legal: {
        transKey: "Bot.CustomerService.Questions.legal",
        responseTransKey: "Bot.CustomerService.Responses.legal",
        link: {
          href: "/legals",
          type: "internal",
          needLogin: false,
        },
      },
      contact: {
        transKey: "Bot.CustomerService.Questions.contact",
        responseTransKey: "Bot.CustomerService.Responses.contact",
        action: "CONTACT_HUMAN",
      },
      tickets: {
        transKey: "Bot.CustomerService.Questions.tickets",
        responseTransKey: "Bot.CustomerService.Responses.tickets",
        link: {
          href: "/user/dashboard/support/tickets",
          type: "internal",
          needLogin: true,
        },
      },
      human: {
        transKey: "Bot.CustomerService.Questions.human",
        responseTransKey: "Bot.CustomerService.Responses.human",
        action: "CONTACT_HUMAN",
      },
    },
  },

  account: {
    transKey: "Bot.Account.title",
    questionTransKey: "Bot.Account.question",
    questions: {
      create: {
        transKey: "Bot.Account.Questions.create",
        responseTransKey: "Bot.Account.Responses.create",
        link: {
          href: "/auth/register",
          type: "internal",
          needLogin: false,
        },
      },
      confirm: {
        transKey: "Bot.Account.Questions.confirm",
        responseTransKey: "Bot.Account.Responses.confirm",
      },
      reset: {
        transKey: "Bot.Account.Questions.reset",
        responseTransKey: "Bot.Account.Responses.reset",
        link: {
          href: "/auth/password",
          type: "internal",
          needLogin: false,
        },
      },
      blocked: {
        transKey: "Bot.Account.Questions.blocked",
        responseTransKey: "Bot.Account.Responses.blocked",
        action: "CONTACT_HUMAN",
      },
    },
  },
}
