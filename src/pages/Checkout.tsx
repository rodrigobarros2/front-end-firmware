import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const plans = [
  { id: "monthly", name: "Mensal", price: 20.9, interval: "month" },
  { id: "quarterly", name: "Trimestral", price: 56.7, interval: "quarter" },
  { id: "yearly", name: "Anual", price: 209.0, interval: "year" },
];

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  console.log("🚀 ~ CheckoutForm ~ clientSecret:", clientSecret);
  const [selectedPlan, setSelectedPlan] = useState(plans[0]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Create a PaymentIntent as soon as the page loads
    axios
      .post("http://localhost:3333/api/payment/create-subscription-intent", {
        priceId: selectedPlan.id,
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
  }, [selectedPlan, toast]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
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
          title: "Assinatura realizada com sucesso!",
          description: `Você assinou o plano ${selectedPlan.name}.`,
        });
        navigate("/dashboard");
      }
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <RadioGroup
        defaultValue={selectedPlan.id}
        onValueChange={(value) =>
          setSelectedPlan(plans.find((plan) => plan.id === value))
        }
        className="grid grid-cols-3 gap-4 mb-4"
      >
        {plans.map((plan) => (
          <div key={plan.id}>
            <RadioGroupItem
              value={plan.id}
              id={plan.id}
              className="peer sr-only"
            />
            <Label
              htmlFor={plan.id}
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <span className="text-lg font-semibold">{plan.name}</span>
              <span className="text-sm text-muted-foreground">
                R$ {plan.price}
              </span>
            </Label>
          </div>
        ))}
      </RadioGroup>
      <CardElement />
      <Button className="w-full mt-4" type="submit">
        {`Assinar por R$ ${selectedPlan.price}/${
          selectedPlan.interval === "month"
            ? "mês"
            : selectedPlan.interval === "quarter"
            ? "trimestre"
            : "ano"
        }`}
      </Button>
    </form>
  );
}

export function Checkout() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Assine o Plano de Atualizações</CardTitle>
        <CardDescription>Escolha o melhor plano para você</CardDescription>
      </CardHeader>
      <CardContent>
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
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
