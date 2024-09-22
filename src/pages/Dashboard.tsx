import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/AuthContext";

interface TVFirmware {
  id: string;
  name: string;
  brand: string;
  version: string;
  releaseDate: string;
  price: number;
}

const mockData: TVFirmware[] = [
  {
    id: "1",
    name: "Firmware A",
    brand: "Samsung",
    version: "1.0.0",
    releaseDate: "2023-01-15",
    price: 9.99,
  },
  {
    id: "2",
    name: "Firmware B",
    brand: "LG",
    version: "2.1.0",
    releaseDate: "2023-02-20",
    price: 14.99,
  },
  {
    id: "3",
    name: "Firmware C",
    brand: "Sony",
    version: "1.5.0",
    releaseDate: "2023-03-10",
    price: 12.99,
  },
  {
    id: "4",
    name: "Firmware D",
    brand: "Samsung",
    version: "2.0.1",
    releaseDate: "2023-04-05",
    price: 19.99,
  },
  {
    id: "5",
    name: "Firmware E",
    brand: "LG",
    version: "3.0.0",
    releaseDate: "2023-05-12",
    price: 24.99,
  },
];

export function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [firmwares, setFirmwares] = useState<TVFirmware[]>(mockData);
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [nameFilter, setNameFilter] = useState<string>("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleFirmwareClick = (firmware: TVFirmware) => {
    navigate(`/checkout/${firmware.id}`, { state: { firmware } });
  };

  useEffect(() => {
    const filteredFirmwares = mockData.filter(
      (firmware) =>
        (brandFilter === "all" || firmware.brand === brandFilter) &&
        (nameFilter === "" ||
          firmware.name.toLowerCase().includes(nameFilter.toLowerCase()))
    );
    setFirmwares(filteredFirmwares);
  }, [brandFilter, nameFilter]);

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Dashboard</CardTitle>
        <CardDescription>
          Bem-vindo ao seu painel de controle, {user?.name}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Select onValueChange={setBrandFilter} value={brandFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por marca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as marcas</SelectItem>
                <SelectItem value="Samsung">Samsung</SelectItem>
                <SelectItem value="LG">LG</SelectItem>
                <SelectItem value="Sony">Sony</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Filtrar por nome"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead>Versão</TableHead>
              <TableHead>Data de Lançamento</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {firmwares.map((firmware) => (
              <TableRow key={firmware.id}>
                <TableCell>{firmware.name}</TableCell>
                <TableCell>{firmware.brand}</TableCell>
                <TableCell>{firmware.version}</TableCell>
                <TableCell>{firmware.releaseDate}</TableCell>
                <TableCell>R$ {firmware.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Button onClick={() => handleFirmwareClick(firmware)}>
                    Comprar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </CardFooter>
    </Card>
  );
}
