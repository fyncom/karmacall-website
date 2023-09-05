document.addEventListener("DOMContentLoaded", function () {
  let url = "https://server.fyncom.com/";
  const stripe = Stripe(
    "pk_test_51Hs4deKTHvS3mtWxJdvaodvRgyXXOjobqGkPfehhE6LEpLM7kHXAAiDJpVitXbs0WklRVa1P8pDSK6uoRuopykGN00ByEwFm49"
  );
  const elements = stripe.elements();

  // Create an instance of the card Element.
  const card = elements.create("card");

  // Add an instance of the card Element into the `card-element` div.
  card.mount("#card-element");

  // Handle form submission
  const form = document.getElementById("payment-form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Use fetch to send a request to your server to create a PaymentIntent
    fetch(url + "v2/payment/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        blockedEmailId: "f7c91019-b4d7-411c-8da0-64ad4462aa80",
        paymentAmount: "100",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const clientSecret = data.clientSecret;
        stripe
          .confirmCardPayment(clientSecret, {
            payment_method: { card: card },
          })
          .then((result) => {
            if (result.error) {
              // Show error to your customer
              console.error(result.error.message);
            } else {
              // Payment succeeded
              console.log("Payment succeeded!");
            }
          });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});
