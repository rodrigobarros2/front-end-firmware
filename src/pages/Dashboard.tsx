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
import { getFirmwareList } from "@/services/api";

interface TVFirmware {
  id: string;
  modelo: string;
  descricao: string;
  comoAtualizar: string;
}

export function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [firmwares, setFirmwares] = useState<TVFirmware[]>([]);
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [nameFilter, setNameFilter] = useState<string>("");

  useEffect(() => {
    const fetchFirmwares = async () => {
      try {
        const data = await getFirmwareList();
        setFirmwares(data);
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        } else {
          console.log("An unknown error occurred");
        }
      }
    };

    fetchFirmwares();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleFirmwareClick = (firmware: TVFirmware) => {
    navigate(`/checkout/${firmware.id}`, { state: { firmware } });
  };

  const filteredFirmwares = firmwares.filter(
    (firmware) =>
      (brandFilter === "all" || firmware.modelo === brandFilter) &&
      (nameFilter === "" ||
        firmware.modelo.toLowerCase().includes(nameFilter.toLowerCase()))
  );

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
              <TableHead>Modelo</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Como Atualizar</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFirmwares.map((firmware) => (
              <TableRow key={firmware.id}>
                <TableCell>{firmware.modelo}</TableCell>
                <TableCell>{firmware.descricao}</TableCell>
                <TableCell>{firmware.comoAtualizar}</TableCell>
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
