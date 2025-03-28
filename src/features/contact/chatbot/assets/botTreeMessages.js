export const botTreeMessages = {
  myOrders: {
    transKey: "Bot.MyOrder.title",
    questionTransKey: "Bot.MyOrder.question",
    questions: {
      missing: {
        transKey: "Bot.MyOrder.Questions.missing",
        responseTransKey: "Bot.MyOrder.Responses.missing",
        action: null,
        link: null,
      },
      delay: {
        transKey: "Bot.MyOrder.Questions.delay",
        responseTransKey: "Bot.MyOrder.Responses.delay",
        link: null,
      },
      question: {
        transKey: "Bot.MyOrder.Questions.question",
        responseTransKey: "Bot.MyOrder.Responses.question",
      },
      cancel: {
        transKey: "Bot.MyOrder.Questions.cancel",
        responseTransKey: "Bot.MyOrder.Responses.cancel",
        link: {
          href: "/help/cancel-order",
          type: "internal",
        },
      },
      refund: {
        transKey: "Bot.MyOrder.Questions.refund",
        responseTransKey: "Bot.MyOrder.Responses.refund",
        link: {
          href: "https://refund-policy.example.com",
          type: "external",
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
      },
      how: {
        transKey: "Bot.Subscriptions.Questions.how",
        responseTransKey: "Bot.Subscriptions.Responses.how",
      },
      question: {
        transKey: "Bot.Subscriptions.Questions.question",
        responseTransKey: "Bot.Subscriptions.Responses.question",
      },
      cancel: {
        transKey: "Bot.Subscriptions.Questions.cancel",
        responseTransKey: "Bot.Subscriptions.Responses.cancel",
      },
      refund: {
        transKey: "Bot.Subscriptions.Questions.refund",
        responseTransKey: "Bot.Subscriptions.Responses.refund",
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
      },
      negociate: {
        transKey: "Bot.Shop.Questions.negociate",
        responseTransKey: "Bot.Shop.Responses.negociate",
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
      },
      contact: {
        transKey: "Bot.CustomerService.Questions.contact",
        responseTransKey: "Bot.CustomerService.Responses.contact",
      },
      tickets: {
        transKey: "Bot.CustomerService.Questions.tickets",
        responseTransKey: "Bot.CustomerService.Responses.tickets",
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
      },
      confirm: {
        transKey: "Bot.Account.Questions.confirm",
        responseTransKey: "Bot.Account.Responses.confirm",
      },
      reset: {
        transKey: "Bot.Account.Questions.reset",
        responseTransKey: "Bot.Account.Responses.reset",
      },
      blocked: {
        transKey: "Bot.Account.Questions.blocked",
        responseTransKey: "Bot.Account.Responses.blocked",
      },
    },
  },
}
