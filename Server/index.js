const express = require("express");
const bodyparser = require('body-parser')
const app = express();
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())
const stripe = require("stripe")("sk_test_51KRwZESCbCnOPgVGm3YejkXTboRcTp3NcPICDRGKnzA4LdBjsdH22PGaoezHfgtho5YoGaM4dU4t7lDWOnvL7WDr00sb4h3TvN");
const cors = require('cors')

app.use(cors())

 app.post('/checkout', async(req, res) => {
   console.log(req.body);
  try {
       
        token = req.body.token
      const customer = stripe.customers
        .create({
          email: req.body.email,
          source: token.id
        })
        .then((customer) => {
          console.log(customer);
          return stripe.charges.create({
            amount: 1000,
            description: "Enjoy Purchasing Using P ~ Mart",
            currency: "USD",
            customer: customer.id,
          });
        })
        .then((charge) => {
         console.log(charge);
            res.json({
              data:"success"
          })
        })
        .catch((err) => {
            res.json({
              data: "failure",
            });
        });
      return true;
    } catch (error) { 
      return false;
    }
// console.log(req.body);
 })

app.listen(5000, () => {
    console.log("App is listening on Port 5000");
})