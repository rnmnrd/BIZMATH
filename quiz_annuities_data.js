// Question bank - All questions from the Annuities lesson
const questionBank = [
  {
    question: "Which of the following refers to the fixed sum of money paid to someone at regular intervals and subject to a fixed compound interest?",
    options: ["annuity", "simple interest", "compound interest", "annuity certain"],
    correct: 0
  },
  {
    question: "If the interest conversion or compounding period is equal or the same with the payment interval, what type of annuity is illustrated?",
    options: ["annuity certain", "annuity uncertain", "simple annuity", "general annuity"],
    correct: 2
  },
  {
    question: "If the interest conversion or compounding period is unequal or not the same as the payment interval, which type of annuity will be used?",
    options: ["annuity certain", "general annuity", "simple annuity", "annuity uncertain"],
    correct: 1
  },
  {
    question: "Which of the following is NOT an example of annuities?",
    options: ["pension", "educational plan", "car loan", "deposit"],
    correct: 3
  },
  {
    question: "Each payment in an annuity.",
    options: ["interest payment", "periodic payment", "loan payment", "cash payment"],
    correct: 1
  },
  {
    question: "The time between the successive payment dates of annuities.",
    options: ["payment interval", "payment due", "periodic payment", "term"],
    correct: 0
  },
  {
    question: "The interval between the beginning of the first payment period and the end of the last period.",
    options: ["period", "due", "term", "interval"],
    correct: 2
  },
  {
    question: "The sum of all the payments to be made during the entire term of the annuity.",
    options: ["future value", "present value", "loan value", "interest value"],
    correct: 0
  },
  {
    question: "What type of annuity is represented if the payment is made at the end of each month for money borrowed that charge 0.15% interest compounded quarterly?",
    options: ["simple", "general", "ordinary", "annuity due"],
    correct: 1
  },
  {
    question: "What type of annuity is represented by a deposit of ₱10,000.00 that is made at the end of every three months to an account that earns 2.6% interest compounded quarterly?",
    options: ["simple", "general", "ordinary", "annuity due"],
    correct: 0
  },
  {
    question: "Which of the following situations is NOT an example of simple annuity?",
    options: [
      "₱1,500 deposited every month for 15 years at 10% per year compounded annually",
      "₱1,500 deposited every month for 15 years at 10% per year compounded monthly",
      "₱1,500 deposited every six months for 15 years at 10% per year compounded semi-annually",
      "₱1,500 deposited every three months for 15 years at 10% per year compounded quarterly"
    ],
    correct: 0
  },
  {
    question: "Which of the following situations is an example of a general annuity?",
    options: [
      "₱5,000 deposited every month for 5 years at 8% per year compounded annually",
      "₱5,000 deposited every six months for 5 years at 8% per year compounded semi-annually",
      "₱5,000 deposited every three months for 5 years at 8% per year compounded quarterly",
      "₱5,000 deposited every year for 5 years at 8% per year compounded annually"
    ],
    correct: 0
  },
  {
    question: "Given the cash flow diagram showing ₱8,000 payments at periods 1, 2, 3, and 4 years with interest rate factor (1.10), what is the rate of interest?",
    options: ["1.10%", "10%", "0.10%", "0.01%"],
    correct: 1
  },
  {
    question: "Given the cash flow diagram showing ₱8,000 payments at periods 1, 2, 3, and 4 years, what is the term of the payment?",
    options: ["10 years", "4 years", "10 months", "4 months"],
    correct: 1
  },
  {
    question: "Given the cash flow diagram with ₱8,000 payments at periods 1, 2, 3, and 4 years at 10% interest, what is the sum of all the payments of the given annuity?",
    options: ["₱30,218", "₱31,718", "₱32,000", "₱37,128"],
    correct: 3
  },
  {
    question: "What is the present value of the simple annuity of ₱5,000.00 payable semi-annually for 10 years if money is worth 6% compounded semi-annually?",
    options: ["₱74,387.37", "₱67,200.42", "₱81,600.96", "₱34,351.87"],
    correct: 0
  },
  {
    question: "With the same given (₱5,000 semi-annually for 10 years at 6% compounded semi-annually), what is the accumulated amount (future value)?",
    options: ["₱74,387.37", "₱67,200.42", "₱81,600.96", "₱134,351.87"],
    correct: 3
  },
  {
    question: "Mr. Michael's monthly insurance premium is ₱500.00, payable at the end of each month. His policy matures 20 years later, after which he can withdraw all his payments plus the interest earned. If the money is worth 15% compounded monthly, what is being asked in the problem?",
    options: ["Cash Value", "Regular Periodic payment", "Future Value", "Present Value"],
    correct: 2
  },
  {
    question: "Mr. Michael's monthly insurance premium is ₱500.00 for 20 years at 15% compounded monthly. What is the total conversion period of the insurance policy?",
    options: ["20", "12", "120", "240"],
    correct: 3
  },
  {
    question: "Mr. Michael's insurance policy has 15% annual interest compounded monthly. What is the annual interest rate converted to decimal?",
    options: ["0.15", "0.015", "0.125", "0.0125"],
    correct: 3
  },
  {
    question: "Mr. Michael pays ₱500.00 monthly for 20 years at 15% compounded monthly. How much does he expect to withdraw on the maturity of his policy?",
    options: ["₱800,519.00", "₱798,716.74", "₱748,619.74", "₱543,519.84"],
    correct: 2
  },
  {
    question: "Find the present value of an annuity of ₱10,000.00 payable semi-annually for 5 years if money is worth 6% per year compounded quarterly.",
    options: ["₱120,640.00", "₱171,686.39", "₱230,145.19", "₱286,640.00"],
    correct: 1
  },
  {
    question: "A high school student would like to save ₱50,000 for his graduation. He will be depositing on his savings every month for 5.5 years and interest is at 0.25% compounded monthly. What is the interest rate per month converted to decimals?",
    options: ["0.25", "0.025", "0.0025", "0.00025"],
    correct: 2
  },
  {
    question: "A high school student would like to save ₱50,000 for his graduation. He will be depositing on his savings every month for 5.5 years and interest is at 0.25% compounded monthly. How much should he deposit in his bank to get ₱50,000 after 5.5 years?",
    options: ["₱752.46", "₱762.46", "₱764.52", "₱765.42"],
    correct: 0
  },
  {
    question: "The buyer of a car pay ₱300,000.00 cash as downpayment and is going to pay ₱12,000.00 monthly for 5 years if money is worth 12% compounded monthly. How much more will he be disbursing (present value) after paying the downpayment amount?",
    options: ["₱529,360.04", "₱539,460.09", "₱539,730.07", "₱589,733.43"],
    correct: 1
  },
  {
    question: "The buyer of a car pay ₱300,000.00 cash as downpayment and is going to pay ₱12,000.00 monthly for 5 years if money is worth 12% compounded monthly. What is the cash value of the car?",
    options: ["₱829,360.04", "₱839,460.09", "₱839,730.07", "₱889,733.43"],
    correct: 1
  },
  {
    question: "Find the future value of an annuity of ₱10,000.00 payable quarterly for 3 years if money is worth 12% compounded monthly.",
    options: ["₱33,596.60", "₱33,695.60", "₱33,965.60", "₱33,956.60"],
    correct: 2
  },
  {
    question: "What is the present value of an annuity of ₱5,000.00 payable quarterly for 10 years if money is worth 5% per year compounded annually?",
    options: ["₱345,590.98", "₱345,950.98", "₱349,550.98", "₱394,055.98"],
    correct: 2
  },
  {
    question: "Find the future value of an annuity of ₱10,000.00 payable quarterly for 5 years if money is worth 12% compounded monthly.",
    options: ["₱64,395.55", "₱64,935.55", "₱69,435.55", "₱69,534.55"],
    correct: 0
  },
  {
    question: "Find the present value of an annuity of ₱20,000.00 payable semi-annually for 5 years if money is worth 6% per year compounded quarterly.",
    options: ["₱120,640.00", "₱145,022.80", "₱170,408.33", "₱186,640.00"],
    correct: 1
  },
  {
    question: "What is an annuity?",
    options: [
      "A. A single lump sum payment",
      "B. A series of equal payments made at equal time intervals",
      "C. An irregular payment schedule",
      "D. A one-time investment"
    ],
    correctAnswer: "B"
  },
  {
    question: "In a simple annuity, when are payments made?",
    options: [
      "A. At the beginning of each period",
      "B. At irregular intervals",
      "C. At the end of each period",
      "D. Only once at maturity"
    ],
    correctAnswer: "C"
  },
  {
    question: "What is the difference between an ordinary annuity and an annuity due?",
    options: [
      "A. Ordinary annuity payments are made at the end, annuity due at the beginning",
      "B. Ordinary annuity has more payments than annuity due",
      "C. Annuity due earns no interest",
      "D. There is no difference"
    ],
    correctAnswer: "A"
  },
  {
    question: "A deferred annuity starts payments...",
    options: [
      "A. Immediately",
      "B. After a specified waiting period",
      "C. Before the contract begins",
      "D. Only when requested"
    ],
    correctAnswer: "B"
  },
  {
    question: "The present value of an annuity is...",
    options: [
      "A. The sum of all future payments",
      "B. The final payment amount",
      "C. The total value today of all future payments",
      "D. The first payment amount"
    ],
    correctAnswer: "C"
  },
  {
    question: "In the formula FVA = PMT × [(1+r)ⁿ-1]/r, what does 'r' represent?",
    options: [
      "A. Rate per payment period",
      "B. Regular payment amount",
      "C. Number of payments",
      "D. Future value"
    ],
    correctAnswer: "A"
  },
  {
    question: "Which type of annuity has a delay between the contract date and first payment?",
    options: [
      "A. Immediate annuity",
      "B. Simple annuity",
      "C. Deferred annuity",
      "D. Ordinary annuity"
    ],
    correctAnswer: "C"
  },
  {
    question: "The future value of an annuity represents...",
    options: [
      "A. The first payment only",
      "B. The accumulated value of all payments plus interest",
      "C. The present value minus interest",
      "D. The average payment amount"
    ],
    correctAnswer: "B"
  },
  {
    question: "What happens to the future value of an annuity if the interest rate increases?",
    options: [
      "A. It decreases",
      "B. It increases",
      "C. It stays the same",
      "D. It becomes zero"
    ],
    correctAnswer: "B"
  },
  {
    question: "An annuity certain has...",
    options: [
      "A. An uncertain number of payments",
      "B. Variable payment amounts",
      "C. A fixed number of payments",
      "D. No end date"
    ],
    correctAnswer: "C"
  },
  {
    question: "The payment amount in an annuity is also known as...",
    options: [
      "A. Interest rate",
      "B. Present value",
      "C. Future value",
      "D. Periodic rent"
    ],
    correctAnswer: "D"
  },
  {
    question: "Which factor does NOT affect the future value of an annuity?",
    options: [
      "A. Interest rate",
      "B. Payment amount",
      "C. Initial lump sum",
      "D. Number of payments"
    ],
    correctAnswer: "C"
  },
  {
    question: "In a perpetuity, payments continue...",
    options: [
      "A. For 30 years",
      "B. Until retirement",
      "C. Forever",
      "D. Until cancelled"
    ],
    correctAnswer: "C"
  },
  {
    question: "The deferral period in a deferred annuity is the time between...",
    options: [
      "A. Payments",
      "B. Contract date and first payment",
      "C. Last two payments",
      "D. Interest calculations"
    ],
    correctAnswer: "B"
  },
  {
    question: "Which statement about annuities is FALSE?",
    options: [
      "A. Payments must be equal",
      "B. Time intervals must be equal",
      "C. Interest rate must remain constant",
      "D. First payment must be immediate"
    ],
    correctAnswer: "D"
  },
  {
    question: "What is the other term for economic value?",
    options: [
      "A. fair market value",
      "B. future value",
      "C. general annuity",
      "D. present value"
    ],
    correct: 0
  },
  {
    question: "The formula R=((1+i)^n)-1)/i is used to determine the __________ of an ordinary annuity.",
    options: [
      "A. annuity",
      "B. cash flow",
      "C. future value",
      "D. present value"
    ],
    correct: 2
  },
  {
    question: "What is the future value of a semi-annual payments of ₱ 8,000 for 12 years with interest rate of 12% compounded semi-annually?",
    options: [
      "A. ₱ 407,524.60",
      "B. ₱ 408,524.60",
      "C. ₱ 405,524.60",
      "D. ₱ 406,524.60"
    ],
    correct: 3
  },
  {
    question: "Cash ___________ can be presented by positive numbers.",
    options: [
      "A. flows",
      "B. inflows",
      "C. outflows",
      "D. value"
    ],
    correct: 1
  },
  {
    question: "How much is the original selling price of shoes being sell by the vendor if Cedric offers to buy it at ₱ 1,000 and they agreed at its fair market value of ₱ 1,150?",
    options: [
      "A. ₱ 1,200",
      "B. ₱ 1,100",
      "C. ₱ 1,000",
      "D. ₱1,300"
    ],
    correct: 0
  },
  {
    question: "It is the price an asset would sell for on the open market when certain conditions are met.",
    options: [
      "A. annuity",
      "B. cash flow",
      "C. down payment",
      "D. fair market value"
    ],
    correct: 3
  },
  {
    question: "What is the present value of an ordinary annuity having semi-annual payments of ₱8,000 for 12 years with an interest rate of 12% compounded semi-annually?",
    options: [
      "A. ₱ 110,402.90",
      "B. ₱ 100,402.90",
      "C. ₱ 105,402.90",
      "D. ₱ 103,402.90"
    ],
    correct: 1
  },
  {
    question: "Cash ____________ can be represented by a negative number.",
    options: [
      "A. flows",
      "B. inflows",
      "C. outflows",
      "D. value"
    ],
    correct: 2
  },
  {
    question: "It is an annuity where the length of the payment interval is not the same as the length of the interest compounding period.",
    options: [
      "A. cash flow",
      "B. fair market value",
      "C. general annuity",
      "D. general ordinary annuity"
    ],
    correct: 2
  },
  { 
    question: "The formula R=(1-(1+i)^-n))/i is used to determine the __________ of an ordinary annuity.",
    options: [
      "A. future value",
      "B. present value",
      "C. real value",
      "D. zero value"
    ],
    correct: 3
  },
  {
    question: "It is the amount of cash and cash-equivalents being transferred into and out of the business.",
    options: [
      "A. cash flow",
      "B. fair market value",
      "C. general annuity",
      "D. general ordinary annuity"
    ],
    correct: 0
  },
  {
    question: "What is the future value of an ordinary annuity having daily payments of ₱ 50 for 30 days with an interest rate of 20% compounded daily?",
    options: [
      "A. ₱ 1,611.98",
      "B. ₱ 1,511.98",
      "C. ₱ 1,411.98",
      "D. ₱ 1,311.98"
    ],
    correct: 1
  },
  {
    question: "A store sells a washing machine.  Mark offers to give a down payment of ₱5,000 and pay ₱6,000 at the end of every 6 months for two years.  Assuming that the money compounds by 3% monthly.  What is the economic value of the washing machine?",
    options: [
      "A. ₱ 24,545.42",
      "B. ₱ 23,126.31",
      "C. ₱ 20,000",
      "D. ₱ 28,126.31"
    ],
    correct: 3
  },
  {
    question: "What is n in the formula F=R((1+i)^n -1)/i?",
    options: [
      "A. future value",
      "B. present value",
      "C. number of payments",
      "D. regular payment"
    ],
    correct: 2
  },
  {
    question: "What is the present value of an ordinary annuity having daily payments of ₱ 50 for 30 days with an interest rate of 20% compounded daily?",
    options: [
      "A. ₱ 1,587.33",
      "B. ₱ 1,487.33",
      "C. ₱ 1,387.33",
      "D. ₱ 1,687.33"
    ],
    correct: 1
  },
  {
    question: "What is the present value of 10 semi-annual payments of ₱ 2,000.00 if the first payment is due at the end of 3 years and money is worth 8% compounded semi-annually?",
    options: [
      "A. ₱ 10,330.31",
      "B. ₱ 13,333.13",
      "C. ₱ 15,841.12",
      "D. ₱ 17,332.25"
    ],
    correct: 1
  },
  {
    question: "Which of the following statements DOES NOT refer to annuities?",
    options: [
      "A. Annuities do not use the pooling technique to spread risk",
      "B. An owner may change the annuity date, the beneficiary, or the settlement option",
      "C. Once the payout period begins, the annuitant receives periodic payments",
      "D. The accumulation period is the period prior to the annuitization date"
    ],
    correct: 0
  },
  {
    question: "A farmer decided to sell his land and to deposit the fund in a bank. After computing the interest, he learned that he may withdraw ₱ 390,500.00 yearly for 10 years starting at the end of 6 years when it is time for him to retire. How much is the fund deposited if the interest rate is 5% converted annually? What is the number of artificial payments?",
    options: [
      "A. 4",
      "B. 5",
      "C. 6",
      "D. 10"
    ],
    correct: 1
  },
  {
    question: "A farmer decided to sell his land and to deposit the fund in a bank. After computing the interest, he learned that he may withdraw ₱ 390,500.00 yearly for 10 years starting at the end of 6 years when it is time for him to retire. How much is the fund deposited if the interest rate is 5% converted annually?What is the present value of the annuity for withdrawal?",
    options: [
      "A. ₱ 2,005,197.75",
      "B. ₱ 2,344,592.24",
      "C. ₱ 2,362,595.82",
      "D. ₱ 4,215,120.15"
    ],
    correct: 2
  },
  {
    question: "Gladys borrows ₱ 400,000.00 at an interest rate of 4% per year compounded semi-annually. She agreed to settle her loan by making 12 semi-annual payments at the end of each six months. If the first payment is made at the end of 2 years, how much is the periodic payment?",
    options: [
      "A. ₱ 80,756.35",
      "B. ₱ 76,348.25",
      "C. ₱ 40,138.96",
      "D. ₱ 49,165.39"
    ],
    correct: 2
  },
  {
    question: "What is the period of deferral if semi-annual payments of ₱5,000.00 for 13 years that will start 4 years from now?",
    options: [
      "A. 7",
      "B. 8",
      "C. 9",
      "D. 10"
    ],
    correct: 0
  },
  {
    question: "Melwin availed a loan from the bank that gave him an option to pay ₱ 20,000.00 monthly for 2 years. The first payment is due after 4 months. If the interest rate is 10% converted monthly, what is the period of deferral?",
    options: [
      "A. 1",
      "B. 2",
      "C. 3",
      "D. 12"
    ],
    correct: 2
  },
  {
    question: "How many numbers of payments are to be done in the situation in question number 7?",
    options: [
      "A. 16",
      "B. 24",
      "C. 27",
      "D. none"
    ],
    correct: 1
  },
  {
    question: "What is the present value in the situation in question number 7?",
    options: [
      "A. ₱ 422,759.78",
      "B. ₱ 433,655.13",
      "C. ₱ 525,215.16",
      "D. ₱ 625,322.14"
    ],
    correct: 0
  },
  {
    question: "What is the present value of a deferred annuity of ₱1,500.00 every 3 months for 8 years that is deferred 3 years if money is worth 6% converted or compounded quarterly?",
    options: [
      "A. ₱ 15,339.25",
      "B. ₱ 18,231.34",
      "C. ₱ 31,699.67",
      "D. ₱ 43,825.32"
    ],
    correct: 2
  },
  {
    question: "What type of deferred annuity in which a return is based on the performance of a portfolio of mutual funds, or sub-accounts, chosen by the annuity owner.",
    options: [
      "A. fixed annuity",
      "B. variable annuity",
      "C. indexed annuity",
      "D. longevity annuity"
    ],
    correct: 1
  },
  {
    question: "A car is to be purchased in monthly payments of ₱ 17,000.00 for 4 years starting at the end of 4 months. How much is the cash value of the car if the interest rate used is 12% converted monthly?",
    options: [
      "A. ₱ 626,571.56",
      "B. ₱ 657,915.02",
      "C. ₱ 816,000.00",
      "D. ₱ 913,920.05"
    ],
    correct: 1
  },
  {
    question: "A group of employees decided to invest a portion of their 13th-month pay. After 3 months from today, they want to withdraw from this fund ₱5,000.00 monthly for 12 months to fund their travel tour that they decide to do every month. How much is the total deposit now if the interest rate is 5% converted monthly?",
    options: [
      "A. ₱ 58,123.45",
      "B. ₱ 59,234.56",
      "C. ₱ 60,345.67",
      "D. ₱ 61,456.78"
    ],
    correct: 0
  },
  {
    question: "Meghan purchased a laptop for the online class of her kids through the credit cooperative for their company. The cooperative provides an option for a deferred payment.  Meghan decided to pay after 4 months of purchase. Her monthly payment is computed as ₱3,500.00 payable in 12 months. How much is the cash value of the laptop if the interest rate is 8% convertible monthly?",
    options: [
    "A. ₱ 45,360.00", 
    "B. ₱ 42,000.00",
    "C. ₱ 39,441.14",
    "D. ₱ 36,225.15" 
    ],
    correct: 2
  },
  {
    question: "Payments of ₱ 7,000.00 every 2 years for 10 years starting at the end of 6 years. What is the period of deferral?",
    options: [
      "A. 1",
      "B. 2",
      "C. 3",
      "D. 10"
    ],
    correct: 1
  }
];