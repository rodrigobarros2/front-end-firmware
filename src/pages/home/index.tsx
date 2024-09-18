import { useEffect, useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Header } from "@/components/header";
import {
  ArrowUpDownIcon,
  RefreshCwIcon,
  Table as TableIcon,
} from "lucide-react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  createOlt,
  createOltTxt,
  fetchOlt,
  IOltData,
  IOltDataForCreate,
} from "@/modules/OltInfo";

import { toast } from "react-toastify";
import { standardizeState } from "@/utils/standardizeState";

export function Home() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [oltExtractorModal, setShowOltExtractorModal] = useState(false);
  const [singleCommandOutput, setSingleCommandOutput] = useState<File | null>(
    null
  );
  const [outputOfTwoCommandsIdOne, setOutputOfTwoCommandsIdOne] =
    useState<File | null>(null);
  const [outputOfTwoCommandsIdTwo, setOutputOfTwoCommandsIdTwo] =
    useState<File | null>(null);
  const [oltData, setOltData] = useState<IOltData[]>([]);
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchOlt();
      setOltData(response);
    } catch (error) {
      console.error("Erro ao buscar dados da API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCloseOltModal = () => {
    setShowOltExtractorModal(false);
    reset();
  };

  const handleRefreshTable = () => {
    toast.success("Tabela atualizada!");
    fetchData();
  };

  const onSubmitOntInfo: SubmitHandler<FieldValues> = async (data) => {
    if (data.slot || data.port || data.ont_id || data.sn || data.state) {
      const dataToSend: IOltDataForCreate = {
        data: [
          {
            slot: data.slot,
            port: data.port,
            ont_id: data.ont_id,
            sn: data.sn,
            state: data.state,
            olt_type: data.olt_type,
          },
        ],
      };

      try {
        await createOlt(dataToSend);
        fetchData();
      } catch (error) {
        console.error("Erro ao criar OLT:", error);
        toast.error("Falha ao salvar OLT.");
      }
    }

    handleCloseOltModal();
  };

  const handleCancel = () => {
    reset();
    handleCloseOltModal();
  };

  const handleFileChangeHuawei = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSingleCommandOutput(event.target.files ? event.target.files[0] : null);
  };

  const handleFileChangeZteState = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOutputOfTwoCommandsIdTwo(
      event.target.files ? event.target.files[0] : null
    );
  };

  const handleFileChangeZteSn = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOutputOfTwoCommandsIdOne(
      event.target.files ? event.target.files[0] : null
    );
  };

  const handleSubmitSingleFile = async () => {
    if (!singleCommandOutput) {
      toast.error("Por favor, selecione o arquivo de saída de único comando.");
      return;
    }

    const formData = new FormData();
    formData.append("singleCommandOutput", singleCommandOutput);

    setLoading(true);
    try {
      await createOltTxt(formData);
      setSingleCommandOutput(null);
      fetchData();
    } catch (error) {
      console.error("Erro ao enviar arquivo Huawei:", error);
      toast.error("Falha ao enviar o arquivo Huawei.");
    } finally {
      setLoading(false);
      setFileModalOpen(false);
    }
  };

  const handleSubmitTwoFiles = async () => {
    if (!outputOfTwoCommandsIdTwo || !outputOfTwoCommandsIdOne) {
      toast.error(
        "Por favor, selecione os arquivos de saída de dois comandos."
      );
      return;
    }

    const formData = new FormData();
    formData.append("outputOfTwoCommandsIdTwo", outputOfTwoCommandsIdTwo);
    formData.append("outputOfTwoCommandsIdOne", outputOfTwoCommandsIdOne);

    setLoading(true);
    try {
      await createOltTxt(formData);
      setOutputOfTwoCommandsIdTwo(null);
      setOutputOfTwoCommandsIdOne(null);
      fetchData();
    } catch (error) {
      console.error("Erro ao enviar arquivos ZTE:", error);
      toast.error("Falha ao enviar os arquivos ZTE.");
    } finally {
      setLoading(false);
      setFileModalOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-1 xl:grid-cols-1">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2 overflow-x-auto">
            <Tabs defaultValue="week">
              <TabsContent value="week">
                <Card x-chunk="dashboard-05-chunk-3">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                      Informações OLT
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-4">
                      <div className="flex items-center space-x-2 ml-auto">
                        <Button
                          variant="ghost"
                          onClick={handleRefreshTable}
                          disabled={loading}
                        >
                          <RefreshCwIcon className="w-5 h-5 mr-2" />
                          {loading ? "Carregando..." : "Recarregar"}
                        </Button>

                        <Button
                          className="flex gap-1 h-10"
                          variant="default"
                          onClick={() => setFileModalOpen(true)}
                        >
                          <TableIcon className="w-4 h-4 g-3" />
                          Carregar Arquivos OLT
                        </Button>

                        <Button
                          className="flex gap-1 h-10"
                          variant="default"
                          onClick={() => setShowOltExtractorModal(true)}
                        >
                          <TableIcon className="w-4 h-4 g-3" />
                          Cadastrar OLT
                        </Button>
                      </div>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>
                            slot
                            <Button variant="ghost" size="icon">
                              <ArrowUpDownIcon className="h-4 w-4" />
                              <span className="sr-only">Sort</span>
                            </Button>
                          </TableHead>
                          <TableHead>
                            port
                            <Button variant="ghost" size="icon">
                              <ArrowUpDownIcon className="h-4 w-4" />
                              <span className="sr-only">Sort</span>
                            </Button>
                          </TableHead>

                          <TableHead>
                            ont_id
                            <Button variant="ghost" size="icon">
                              <ArrowUpDownIcon className="h-4 w-4" />
                              <span className="sr-only">Sort</span>
                            </Button>
                          </TableHead>
                          <TableHead>
                            sn
                            <Button variant="ghost" size="icon">
                              <ArrowUpDownIcon className="h-4 w-4" />
                              <span className="sr-only">Sort</span>
                            </Button>
                          </TableHead>
                          <TableHead>
                            state
                            <Button variant="ghost" size="icon">
                              <ArrowUpDownIcon className="h-4 w-4" />
                              <span className="sr-only">Sort</span>
                            </Button>
                          </TableHead>
                          <TableHead>
                            marca
                            <Button variant="ghost" size="icon">
                              <ArrowUpDownIcon className="h-4 w-4" />
                              <span className="sr-only">Sort</span>
                            </Button>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {oltData.map((oltItem, index) => (
                          <TableRow
                            key={index}
                            className={index % 2 === 0 ? "bg-accent" : ""}
                          >
                            <TableCell>{oltItem.slot}</TableCell>
                            <TableCell>{oltItem.port}</TableCell>
                            <TableCell>{oltItem.ont_id}</TableCell>
                            <TableCell>{oltItem.sn}</TableCell>
                            <TableCell>
                              {standardizeState(oltItem.state)}
                            </TableCell>
                            <TableCell>{oltItem.olt_type}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <Pagination className="mt-5">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious>
                            <Button variant="outline">Anterior</Button>
                          </PaginationPrevious>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink>1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink>2</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink>3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationNext>
                            <Button variant="outline">Próxima</Button>
                          </PaginationNext>
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      <Dialog open={oltExtractorModal} onOpenChange={setShowOltExtractorModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cadastro OLT</DialogTitle>
            <DialogDescription>
              Cadastre aqui informações da sua OLT
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmitOntInfo)}>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="olt_type">OLT</Label>
                <Input
                  id="olt_type"
                  placeholder="Digite a OLT"
                  {...register("olt_type", {
                    required: "OLT é obrigatório",
                  })}
                  aria-invalid={errors.olt_type ? "true" : "false"}
                />
                {errors.olt_type && (
                  <span className="text-red-500" role="alert">
                    {String(errors.olt_type.message)}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Label htmlFor="slot">Slot</Label>
                <Input
                  id="slot"
                  placeholder="Digite o Slot"
                  {...register("slot", { required: "Slot é obrigatório" })}
                  aria-invalid={errors.slot ? "true" : "false"}
                />
                {errors.slot && (
                  <span className="text-red-500" role="alert">
                    {String(errors.slot.message)}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Label htmlFor="port">Port</Label>
                <Input
                  id="port"
                  placeholder="Digite o Port"
                  {...register("port", { required: "Port é obrigatório" })}
                  aria-invalid={errors.port ? "true" : "false"}
                />
                {errors.port && (
                  <span className="text-red-500" role="alert">
                    {String(errors.port.message)}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Label htmlFor="ont_id">Ont ID</Label>
                <Input
                  id="ont_id"
                  placeholder="Digite o Ont ID"
                  {...register("ont_id", { required: "Ont ID é obrigatório" })}
                  aria-invalid={errors.ont_id ? "true" : "false"}
                />
                {errors.ont_id && (
                  <span className="text-red-500" role="alert">
                    {String(errors.ont_id.message)}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Label htmlFor="sn">SN</Label>
                <Input
                  id="sn"
                  placeholder="Digite o SN"
                  {...register("sn", { required: "SN é obrigatório" })}
                  aria-invalid={errors.sn ? "true" : "false"}
                />

                {errors.sn && (
                  <span className="text-red-500" role="alert">
                    {String(errors.sn.message)}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="Digite o State"
                  {...register("state", { required: "Estado é obrigatório" })}
                  aria-invalid={errors.state ? "true" : "false"}
                />
                {errors.state && (
                  <span className="text-red-500" role="alert">
                    {String(errors.state.message)}
                  </span>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">Enviar</Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={fileModalOpen} onOpenChange={setFileModalOpen}>
        <DialogContent className="modal-content">
          <DialogHeader>
            <DialogTitle>Carregar Arquivos</DialogTitle>
            <DialogDescription>
              Carregue os arquivos de OLT aqui.
            </DialogDescription>
          </DialogHeader>
          <form className="modal-form">
            <div className="form-grid">
              <div className="form-group mb-4">
                <Label htmlFor="huawei_file">
                  Carregar saída de único comando
                </Label>
                <Input
                  className="cursor-pointer"
                  id="huawei_file"
                  type="file"
                  onChange={handleFileChangeHuawei}
                  aria-invalid={singleCommandOutput ? "false" : "true"}
                />
              </div>
              <Button
                className="submit-button w-full mb-12"
                type="button"
                onClick={handleSubmitSingleFile}
              >
                Enviar saída de dois comandos
              </Button>
              <div className="form-group mb-2">
                <Label htmlFor="zte_state_file">
                  Carregar saída de dois comandos
                </Label>
                <Input
                  className="cursor-pointer"
                  id="zte_state_file"
                  type="file"
                  onChange={handleFileChangeZteState}
                  aria-invalid={outputOfTwoCommandsIdTwo ? "false" : "true"}
                />
              </div>
              <div className="form-group">
                <Label htmlFor="zte_sn_file">
                  Carregar saída de dois comandos
                </Label>
                <Input
                  id="zte_sn_file"
                  type="file"
                  onChange={handleFileChangeZteSn}
                  aria-invalid={outputOfTwoCommandsIdOne ? "false" : "true"}
                  className="cursor-pointer mb-4"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                className="submit-button w-full"
                type="button"
                onClick={handleSubmitTwoFiles}
              >
                Enviar saída de dois comandos
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
