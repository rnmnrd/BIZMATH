const questionBank = [
  { question: "What is another term for stock?", options: ["bond", "debenture", "debt instrument", "equity instrument"], correct: 3 },
    { question: "It is a type of stock for which stockholders get first choice in distributed profits.", options: ["common stock", "stock market", "face value stock", "preferred stock"], correct: 3 },
    { question: "Another term for a bond’s face value.", options: ["par value", "coupon", "maturity", "final payment"], correct: 0 },
    { question: "A bond that pays all of its interest and principal at the bond’s maturity date.", options: ["bond fund", "par-value fund", "coupon bond", "zero-coupon bond"], correct: 3 },
    { question: "Which financial assets carries the most risk?", options: ["bond", "stock", "savings deposits"], correct: 1 },
    { question: "Which is the LEAST risky investment?", options: ["stocks", "corporate bond", "Philippines treasury bonds", "checking deposits", "mutual funds"], correct: 2 },
    { question: "A person or agent who trades for you and charges a fee or commission for executing buys and sells of stocks through a stock exchange.", options: ["stockbroker", "stockholder", "entrepreneur", "politician"], correct: 0 },
    { question: "What is stock portfolio?", options: ["The online tool used to track stock prices.", "A list of all the stocks you own.", "The document that you receive for purchasing stock.", "A group of stocks that you can purchase at one time on a stock exchange."], correct: 1 },
    { question: "Why do people buy stocks?", options: ["There is no chance of a loss.", "They expect to earn a return.", "The government encourages them to buy stock.", "They are guaranteed interest payment each year."], correct: 1 },
    { question: "What is the best explanation of a bond?", options: ["It is an ownership interest in a company.", "It is an equity or share in a company.", "It represents a corporate or government debt obligation.", "It is a debt instrument."], correct: 2 },
    { question: "Diversifying can occur by", options: ["buying different stocks and bonds in different industries.", "buying similar stocks and bonds in the same industries.", "buying similar stocks and bonds in different industries.", "buying different stocks and bonds in the same industries."], correct: 0 },
    { question: "Which best defines the risk of a financial asset?", options: ["Investing in several different assets with unrelated risks.", "The amount that will be repaid at the end of a bond’s term.", "The probability that an asset will lose value.", "The uncertainty that an asset might gain or lose value."], correct: 3 },
    { question: "Why would someone choose to put money in stocks as opposed to a savings account that earns interest?", options: ["They are guaranteed a return in stocks.", "There is a potential to earn more money in the stock market.", "They are guaranteed a return in a savings account.", "There is a potential to earn more money in the savings account."], correct: 1 },
    { question: "What happens to the price and interest rate of a bond if the demand for that bond increases?", options: ["Price increases; interest rate is unaffected.", "Price is unaffected; interest rate is unaffected.", "Price increases; interest rate decreases.", "Price decreases; interest rate decreases."], correct: 2 },
    { question: "Several years ago, Company A issued bonds to raise funds so that it could buy equipment. Those bonds were purchased by the Bank of the East. However, the Bank of the East has decided that it doesn’t want to have any assets in the form of bonds, so it is selling off all the bonds that it owns. Which of the following is most likely to be the result of this action?", options: ["The default risk of the bonds will increase.", "Bond prices will increase.", "The face value of the bonds will decrease.", "Interest rates will increase."], correct: 3 },
    { question: "The periodic interest payment that the bondholder receives during the time between purchase date and maturity date. ", options: ["Coupon Amount", "Coupon Rate", "Face Value", "Market Value"], correct: 0 },
    { question: "A certain corporation declared a 4.5% dividend on a stock with a par value of ₱ 400.00. Mr. Reyes owns 100 shares of stocks with a par value of ₱ 400.00 How much is the dividend she received? ", options: ["₱ 1500.00", "₱ 1600.00", "₱ 1700.00", "₱ 1800.00"], correct: 3 },
    { question: "A certain financial institution declared a ₱ 80,000,000.00 dividend for the common stocks. If there is a total of 500,000 shares of common stocks, how much is the dividend per share? ", options: ["₱ 140.00", "₱ 150.00", "₱ 160.00", "₱ 170.00"], correct: 2 },
    { question: "It is the rate per coupon payment period; denoted by r. ", options: ["Coupon Amount", "Coupon Rate", "Face Value", "Market Value"], correct: 1 },
    { question: "It is the interest rate the bond issuer will use in computing the interest payment, usually expressed in percent. ", options: ["Coupon Date", "Dividend", "Dividend Rate", "Maturity Date"], correct: 2 },
    { question: "It is the ratio of the annual dividend per share and the market value per share.  ", options: ["Coupon Amount", "Dividend Rate", "Market Value", "Stock yield ratio"], correct: 3 },
    { question: "A bank declared a dividend of ₱ 35.00 per share for the common stock. If the common stock closes at ₱ 98.00, how large is the stock yield ratio on this investment? ", options: ["0.36", "0.39", "0.63", "0.66"], correct: 0 },
    { question: " Determine the amount of semi-annual coupon paid for a 3% bond with a face value of ₱ 100,000.00 which matures after 8 years. How many coupons are paid? ", options: ["10 times", "13 times", "16 times", "19 times"], correct: 2 },
    { question: "Corporation M, with a current market value of ₱ 65.00, give a dividend of ₱ 11.00 per share of its common stock. Corporation N, with a current market value of ₱ 75.00, give a dividend of ₱ 15.00 per share. Find the stock yield ratio for Corporation M.", options: ["14.56%", "15.76%", "16.92%", "17.08%"], correct: 2 },
    { question: "Corporation M, with a current market value of ₱ 65.00, give a dividend of ₱ 11.00 per share of its common stock. Corporation N, with a current market value of ₱ 75.00, give a dividend of ₱ 15.00 per share.  What is the stock yield ratio for Corporation N?", options: ["18%", "20%", "22%", "24%"], correct: 1 },
    { question: "Corporation M, with a current market value of ₱ 65.00, give a dividend of ₱ 11.00 per share of its common stock. Corporation N, with a current market value of ₱ 75.00, give a dividend of ₱ 15.00 per share. In which corporation will you invest your money? Why?", options: ["Corporation M, because each peso will earn you more if you invest in M than in N.", "Corporation M, the lower the share the higher the stock yield ratio.", "Corporation N, because each peso will earn you more if you invest in N than in M.", "Corporation N, the lower the stock yield ratio the more you earn."], correct: 2 },
    { question: " Determine the amount of the semi-annual coupon for a bond with a face value of ₱ 450,000.00 that pays 12% payable semi-annual for its coupon. ", options: ["₱ 27,000.00", "₱ 24,000.00", "₱ 21,000.00", "₱ 18,000.00"], correct: 0 },
    { question: "Find the value of a ₱ 50,000.00 bond with interest of 12% compounded semi annually which is redeemable at 105% in 3 years that yields the purchaser 8% converted semi-annually. Find the amount of the semi-annual coupon.", options: ["₱ 2500.00", "₱ 2750.00", "₱ 3000.00", "₱3250.00"], correct: 2 },
    { question: "Find the value of a ₱ 50,000.00 bond with interest of 12% compounded semi annually which is redeemable at 105% in 3 years that yields the purchaser 8% converted semi-annually. Find the redemption value of ₱ 50,000.00", options: ["₱ 52,500.00", "₱ 55,200.00", "₱ 56,500.00", "₱ 59,200.00"], correct: 0 },
    { question: "Find the value of a ₱ 50,000.00 bond with interest of 12% compounded semi annually which is redeemable at 105% in 3 years that yields the purchaser 8% converted semi-annually. Find the fair price of the given bond.", options: ["₱ 55,319.56", "₱ 57,217.92", "₱ 59,034.12", "₱ 61,491.41"], correct: 1 },
    { question: "It is a measure of a portion of the stock market ", options: ["stock market", "stock market index", "value of the index", "dividend"], correct: 1 },
    { 
    question: "What is the lowest price for the past 52 weeks of stock RST?",
        image: "stocks1.png",
        options: ["₱ 62.50", "₱ 70.50", "₱ 85", "₱ 92.50"],
    correct: 3
    },
    {
    question: "During the past 52 weeks, which stocks in the table sold at the highest price? ",
        image: "stocks1.png",
        options: ["RST", "XYZ", "OPQ", "LMN"],
    correct: 0
    },
    {
    question: "What was the closing price the day before the last trading day of stock XYZ?",
        image: "stocks1.png",
        options: ["₱ 87.60", "₱ 87", "₱ 78.10", "₱ 78.50"],
    correct: 2
    },
    {
    question: "During the past 52 weeks, which stocks in the table sold at the lowest price?",
        image: "stocks1.png",
        options: ["LMN", "OPQ", "RST", "XYZ"],
    correct: 0
    },
    {
    question: "How many shares of stock OPQ were traded? ",
        image: "stocks1.png",
        options: ["70", "700", "7, 000", "70, 000"],
    correct: 3
    },
    {
    question: "Which stock has the lowest shares were traded for the day? ",
        image: "stocks1.png",
        options: ["XYZ", "LMN", "OPQ", "RST"],
    correct: 1
    },
    {
    question: "What is the net change between the two last trading days of stock XYZ?",
        image: "stocks1.png",
        options: ["−0.20", "0.10", "0.30", "0.40"],
    correct: 3
    },
    {
    question: "What is the total number of trader who wishes to buy a total of 537,500 shares at ₱23.50 per share? ",
        image: "stocks2.png",
        options: ["11", "56", "140", "350"],
    correct: 1
    },
    {
    question: "How many trader/s is willing to sell his/her 22,000 shares for ₱23.80 per share? ",
        image: "stocks2.png",
        options: ["6", "5", "4", "2"],
    correct: 3
    },
    {
    question: "What is the total number of trader who wishes to buy a total of 61,600 shares at ₱23.55 per share?  ",
        image: "stocks2.png",
        options: ["11", "14", "56", "360"],
    correct: 0
    },
    {
    question: "How many trader/s is willing to sell his/her 188,600 shares for ₱23.90 per share? ",
        image: "stocks2.png",
        options: ["1", "2", "5", "11"],
    correct: 2
    },
    { question: "What is the total number of trader who wishes to buy a total of 364,200 shares at ₱23.600 per share? ",
        image: "stocks2.png",
        options: ["11", "56", "140", "360"],
    correct: 3
    },
    {
        question: "It refers to how many individual sell orders have been placed in the online platform and the total number of shares these sellers wish to sell",
        options: ["ask size", "bid size", "ask price", "bid price"],
        correct: 0
    },
    {
        question: "It refers to the price that the sellers of the stock are willing to sell the stock.",
        options: ["ask size", "bid size", "bid price", "ask price"],
        correct: 3 
    }
];  

