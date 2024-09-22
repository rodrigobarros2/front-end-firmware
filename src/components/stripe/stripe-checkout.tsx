import { useState } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";

export function StripeCheckout({ amount, clientSecret, disabled, children }) {
  const stripe = useStripe();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (!stripe) return;

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (error) {
        console.error("Payment failed:", error);
        // Adicione aqui a lógica para lidar com erros de pagamento
      }
    } catch (e) {
      console.error("An unexpected error occurred:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleCheckout} disabled={disabled || isLoading}>
      {isLoading ? "Processando..." : children}
    </Button>
  );
}
