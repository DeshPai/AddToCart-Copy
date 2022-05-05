import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/service/cart.service';
import { CheckoutService } from 'src/app/service/checkout.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  public products : any = [];
  public grandTotal !: number;

  paymentHandler: any = null;

  success: boolean = false
  
  failure:boolean = false
  
  constructor( private cartService:CartService , private checkout: CheckoutService) { }

  ngOnInit(): void {
    this.invokeStripe();
    this.cartService.getProducts()
    .subscribe(res =>{
     this.products = res ;  
    
     this.grandTotal = this.cartService.getTotalPrice();
    })
    
  }

  removeItem(item: any){
   this.cartService.removeCartItem(item);
  }
  emptyCart(){
    this.cartService.removeAllCart();
  }

 
invokeStripe() {
  if (!window.document.getElementById('stripe-script')) {
    const script = window.document.createElement('script');
    script.id = 'stripe-script';
    script.type = 'text/javascript';
    script.src = 'https://checkout.stripe.com/checkout.js';
   
    script.onload = () => {
      this.paymentHandler = (<any>window).StripeCheckout.configure({
        key: 'pk_test_51KRwZESCbCnOPgVGkJtOwhOSepuJpZ0zxGSFdTt4AYvCflz4MsLpcTaMzd4BIj1fw23RRs0oSG7g87pDaFRHYFwS00iAWJjijF',
        locale: 'auto',
        token: function (stripeToken: any) {
          console.log(stripeToken);
        },
      });
    };

    window.document.body.appendChild(script);
  }
}

makePayment(amount: number) {
  const paymentHandler = (<any>window).StripeCheckout.configure({
    key: 'pk_test_51KRwZESCbCnOPgVGkJtOwhOSepuJpZ0zxGSFdTt4AYvCflz4MsLpcTaMzd4BIj1fw23RRs0oSG7g87pDaFRHYFwS00iAWJjijF',
    locale: 'auto',
    token: function (stripeToken: any) {
      console.log(stripeToken);
      paymentstripe(stripeToken);
    },
  });

  const paymentstripe = (stripeToken: any) => {
    this.checkout.makePayment(stripeToken).subscribe((data: any) => {
      console.log(stripeToken);
      console.log(data);
      if (data.data === "success") {
        this.success = true
      }
      else {
        this.failure = true
      }
    });
  };

  paymentHandler.open({
    name: 'P ~ Mart Pay  ',
    description: ' Through Stripe Payment Gateway.',
    amount: amount * 100,
  });
}



}
