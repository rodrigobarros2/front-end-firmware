import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  loadStripe,
  StripeCardElement,
  StripeElementLocale,
} from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutForm({ firmware, clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(
      CardElement
    ) as StripeCardElement | null;
    if (!cardElement) {
      toast({
        title: "Erro no pagamento",
        description: "Elemento do cartão não encontrado.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: "Nome do Cliente",
        },
      },
    });

    if (result.error) {
      toast({
        title: "Erro no pagamento",
        description: result.error.message,
        variant: "destructive",
      });
    } else {
      if (result.paymentIntent.status === "succeeded") {
        toast({
          title: "Pagamento realizado com sucesso!",
          description: `Você adquiriu o firmware ${firmware.name}.`,
        });
        navigate("/dashboard");
      }
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
      <Button
        className="w-full mt-4"
        type="submit"
        disabled={!stripe || isLoading}
      >
        {isLoading ? "Processando..." : "Pagar"}
      </Button>
    </form>
  );
}

export function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const firmware = location.state?.firmware;
  const { toast } = useToast();

  useEffect(() => {
    if (firmware) {
      // Create PaymentIntent as soon as the page loads
      axios
        .post("http://localhost:3333/api/payment/create-payment-intent", {
          amount: firmware.price * 100, // Stripe expects the price in cents
          currency: "brl",
        })
        .then((response) => {
          setClientSecret(response.data.clientSecret);
        })
        .catch((error) => {
          console.error("Error creating PaymentIntent:", error);
          toast({
            title: "Erro ao iniciar o pagamento",
            description: "Por favor, tente novamente mais tarde.",
            variant: "destructive",
          });
        });
    }
  }, [firmware, toast]);

  if (!firmware) {
    navigate("/dashboard");
    return null;
  }

  const appearance = {
    theme: "stripe" as const,
    variables: {
      colorPrimary: "#28a745",
      colorBackground: "#f8f9fa",
      borderRadius: "8px",
      colorText: "#212529",
      fontFamily: "Arial, sans-serif",
      spacingUnit: "4px",
      fontSizeBase: "16px",
    },
    rules: {
      ".Input": {
        backgroundColor: "#fff",
        border: "1px solid #ced4da",
        padding: "12px",
        borderRadius: "4px",
      },
      ".Label": {
        color: "#495057",
        fontWeight: "bold",
      },
      ".Error": {
        color: "#dc3545",
      },
    },
  };

  const options = {
    clientSecret: clientSecret,
    appearance,
    locale: "auto" as StripeElementLocale, // Locale para o Brasil
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
        <CardDescription>Complete sua compra do firmware</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Firmware:</h3>
            <p>{firmware.name}</p>
          </div>
          <div>
            <h3 className="font-semibold">Marca:</h3>
            <p>{firmware.brand}</p>
          </div>
          <div>
            <h3 className="font-semibold">Versão:</h3>
            <p>{firmware.version}</p>
          </div>
          <div>
            <h3 className="font-semibold">Preço:</h3>
            <p>R$ {firmware.price.toFixed(2)}</p>
          </div>
        </div>

        {clientSecret && (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm firmware={firmware} clientSecret={clientSecret} />
          </Elements>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate("/dashboard")}
        >
          Cancelar
        </Button>
      </CardFooter>
    </Card>
  );
}
