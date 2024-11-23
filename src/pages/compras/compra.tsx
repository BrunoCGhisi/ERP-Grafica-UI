import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  InputLabel,
  Select,
  MenuItem,
  Modal,
  Button,
  Stack,
  TextField,
  Typography,
  IconButton,
  Alert,
  Grid,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridLocaleText,
} from "@mui/x-data-grid";
import { ModalStyle, GridStyle, SpaceStyle } from "../../shared/styles";
//Icones
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DoneIcon from "@mui/icons-material/Done";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { getToken } from "../../shared/services/payload";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOpenModal } from "../../shared/hooks/useOpenModal";
import { ModalRoot } from "../../shared/components/ModalRoot";
import { MiniDrawer } from "../../shared/components";
import dayjs from "dayjs";

import {
  compraSchema,
  compraSchemaType,
  CompraDataRow,
  bancoSchemaType,
  insumoSchemaType,
  compraInsumoSchemaType,
  financeiroSchema,
  financeiroSchemaType,
} from "../../shared/services/types";

import {
  getPurchases,
  postPurchases,
  putPurchases,
  deletePurchases,
} from "../../shared/services/compraServices";
import { ModalEditCompra } from "./components/modal-edit-compra";
import { ModalGetCompra } from "./components/modal-get-compra";

const fornecedorSchema = z.object({
  id: z.number(),
  nome: z.string(),
});
type fornecedorSchemaType = z.infer<typeof fornecedorSchema>;

const Compra = () => {
  const [userId, setUserId] = useState<number | null>(null); // Estado para armazenar o userId
  useEffect(() => {
    const fetchToken = async () => {
      const tokenData = await getToken();
      if (tokenData) {
        setUserId(tokenData.userId);
      }
    };
    fetchToken();
  }, []);

  const today = new Date();

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [ci, setCi] = useState<compraInsumoSchemaType[]>([]);
  const [purchases, setPurchases] = useState<compraSchemaType[]>([]);
  const [fornecedores, setFornecedores] = useState<fornecedorSchemaType[]>([]);
  const [bancos, setBancos] = useState<bancoSchemaType[]>([]);
  const [insumos, setInsumos] = useState<insumoSchemaType[]>([]);
  const [idToEdit, setIdToEdit] = useState<any>(null);
  const [financeiros, setFinanceiros] = useState<financeiroSchemaType[]>([]);
  const [selectedRow, setSelectedRow] = useState<GridRowParams | null>(null);
  const { open, toggleModal } = useOpenModal();
  const toggleGetModal = useOpenModal();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<compraSchemaType>({
    resolver: zodResolver(compraSchema),
    defaultValues: {
      compras_insumos: [{ idInsumo: 0, largura: 0, comprimento: 0, preco: 0 }], // Inicializa com um produto
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "compras_insumos",
  });

  const handleAddInsumo = () => {
    append({ idInsumo: 0, largura: 0, comprimento: 0, preco: 0 }); // Adiciona um novo produto com quantidade inicial
  };

  const handleRemoveProduct = (index: number) => {
    remove(index);
  };

  const handleRowClick = (params: GridRowParams) => {
    setSelectedRow(params);
    toggleGetModal.toggleModal();
  };

  // Trazendo fornecedores--------------------------------------------------
  useEffect(() => {
    const getFornecedores = async () => {
      const response = await axios.get(
        "http://localhost:3000/cliente/fornecedores"
      );
      setFornecedores(response.data);
    };
    getFornecedores();
  }, []);

  const getFornecedoresNames = (id: number | undefined) => {
    const fornecedorNome = fornecedores.find((cat) => cat.id === id);
    return fornecedorNome ? fornecedorNome.nome : "Desconhecido";
  };

  // Trazendo bancos--------------------------------------------------
  useEffect(() => {
    const getBancos = async () => {
      const response = await axios.get("http://localhost:3000/banco");
      setBancos(response.data.getBancos);
    };
    getBancos();
  }, []);

  // Trazendo Insumo --------------------------------------------------
  useEffect(() => {
    const getInsumos = async () => {
      const response = await axios.get("http://localhost:3000/insumo/");
      setInsumos(response.data);
      console.log(response);
    };
    getInsumos();
  }, []);

  //CRUD -----------------------------------------------------------------------------------------------------

  const loadPurchases = async () => {
    const response = await axios.get("http://localhost:3000/compra");
    const responseFin = await axios.get("http://localhost:3000/financeiro");
    setCi(response.data.comprasInsumos);
    setFinanceiros(responseFin.data);

    const purchasesData = await getPurchases();
    setPurchases(purchasesData);
  };

  const handleAdd = async (data: compraSchemaType) => {
    const response = await postPurchases(data);

    if (response.data.info) {
      setAlertMessage(response.data.info);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    }

    loadPurchases();
    reset();
    setAdOpen(false);
  };

  const handleDelete = async (id: number) => {
    await deletePurchases(id);
    loadPurchases();
  };

  // População da modal  --------------------------------
  // const handleEdit = (updateData: CompraDataRow) => {
  //   setSelectedData(updateData);
  //   toggleModal();
  // };

  useEffect(() => {
    loadPurchases();
  }, [open]);

  const [adopen, setAdOpen] = useState<boolean>(false);
  const addOn = () => setAdOpen(true);
  const addOf = () => setAdOpen(false);

  // GRID ------------------------------------------------

  const columns: GridColDef<CompraDataRow>[] = [
    {
      field: "idFornecedor",
      headerName: "Fornecedor",
      editable: false,
      flex: 0,
      headerClassName: "gridHeader--header",
      minWidth: 300,
    },
    {
      field: "isCompraOS",
      headerName: "OS",
      editable: false,
      flex: 0,
      headerClassName: "gridHeader--header",
      maxWidth: 100,
    },
    {
      field: "dataCompra",
      headerName: "Data da Compra",
      editable: false,
      flex: 0,
      headerClassName: "gridHeader--header",
      minWidth: 150,
    },
    {
      field: "numNota",
      headerName: "N° Nota",
      editable: false,
      flex: 0,
      headerClassName: "gridHeader--header",
      minWidth: 150,
    },
    {
      field: "desconto",
      headerName: "Desconto",
      editable: false,
      flex: 0,
      headerClassName: "gridHeader--header",
      minWidth: 100,
    },
    {
      field: "acoes",
      headerName: "Ações",
      width: 150,
      align: "center",
      type: "actions",
      flex: 0,
      headerClassName: "gridHeader--header",
      renderCell: ({ row }) => (
        <>
          <div>
            <IconButton
              onClick={() => row.id !== undefined && handleDelete(row.id)}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              onClick={() =>
                row.id !== undefined && [setIdToEdit(row.id), toggleModal()]
              }
            >
              <EditIcon />
            </IconButton>
          </div>
        </>
      ),
    },
  ];

  const rows = purchases.map((compra) => ({
    id: compra.id,
    idFornecedor: getFornecedoresNames(compra.idFornecedor),
    isCompraOS: compra.isCompraOS,
    dataCompra: dayjs(compra.dataCompra).format("DD/MM/YYYY"),
    numNota: compra.numNota,
    desconto: compra.desconto,
  }));
  useEffect(() => {
    reset();
  }, [fornecedorSchema, reset]);

  const waiter = watch("financeiros.0.idFormaPgto");
  useEffect(() => {
    if (waiter === 0 || waiter === 1 || waiter === 4) {
      setValue("financeiros.0.parcelas", 1); // Atualiza o valor de parcelas
    }
  }, [waiter, setValue]);

  const localeText: Partial<GridLocaleText> = {
    toolbarDensity: "Densidade",
    toolbarColumns: "Colunas",
    footerRowSelected: (count) => "", // Remove a mensagem "One row selected"
  };

  

  return (
    <Box>
      <MiniDrawer>
        <Box sx={SpaceStyle}>
          <Grid
            container
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography variant="h6">Compras</Typography>
            </Grid>

            <Grid item>
              <Button
                onClick={addOn}
                variant="outlined"
                startIcon={<AddCircleOutlineIcon />}
              >
                Cadastrar
              </Button>
            </Grid>
          </Grid>

          <Box>
            <Modal
              open={adopen}
              onClose={addOf}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={ModalStyle}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      Nova Compra
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <form onSubmit={handleSubmit(handleAdd)}>
                      <Grid container spacing={1}>
                        <Grid item xs={12} md={5}>
                          {/* Ajustei para 5 ao invés de 6 */}
                          <Grid container spacing={2}>
                            {/* Fornecedor */}

                            <Grid item xs={12}>
                              <Typography variant="subtitle1">
                                Fornecedor
                              </Typography>
                              <Select
                                {...register("idFornecedor")}
                                labelId="select-label"
                                id="demo-simple-select"
                                label="Fornecedor"
                                fullWidth
                                error={!!errors.idFornecedor}
                                defaultValue={
                                  fornecedores.length > 0
                                    ? fornecedores[0].nome
                                    : "Sem Fornecedores"
                                }
                              >
                                {fornecedores.map((fornecedor) => (
                                  <MenuItem
                                    value={fornecedor.id}
                                    key={fornecedor.id}
                                  >
                                    {fornecedor.nome}
                                  </MenuItem>
                                ))}
                              </Select>
                            </Grid>

                            {/* Tipo e Data */}
                            <Grid item xs={6}>
                              <Controller
                                control={control}
                                name="isCompraOS"
                                defaultValue={false}
                                render={({ field }) => (
                                  <Select
                                    sx={{ marginTop: 1 }}
                                    onChange={field.onChange}
                                    value={field.value}
                                    label="Tipo"
                                    fullWidth
                                  >
                                    <MenuItem value={true}>Compra</MenuItem>
                                    <MenuItem value={false}>Orçamento</MenuItem>
                                  </Select>
                                )}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                sx={{ marginTop: 1 }}
                                type="date"
                                label="Data"
                                InputLabelProps={{ shrink: true }}
                                size="medium"
                                helperText={
                                  errors.dataCompra?.message || "Obrigatório"
                                }
                                error={!!errors.dataCompra}
                                defaultValue={dayjs(today).format("YYYY-MM-DD")}
                                {...register("dataCompra")}
                                fullWidth
                              />
                            </Grid>

                            {/* Número da Nota */}
                            <Grid item xs={6}>
                              <TextField
                                id="outlined-numNota"
                                label="N° Nota"
                                placeholder="0"
                                helperText={
                                  errors.numNota?.message || "Obrigatório"
                                }
                                error={!!errors.numNota}
                                {...register("numNota")}
                                fullWidth
                              />
                            </Grid>

                            {/* Desconto */}
                            <Grid item xs={6}>
                              <TextField
                                id="outlined-desconto"
                                label="Desconto"
                                placeholder="0"
                                helperText={
                                  errors.desconto?.message || "Obrigatório"
                                }
                                error={!!errors.desconto}
                                {...register("desconto")}
                                fullWidth
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <InputLabel id="demo-simple-select-label">
                                Banco
                              </InputLabel>
                              <Controller
                                name={`financeiro.0.idBanco`}
                                control={control}
                                render={({ field }) => (
                                  <Select
                                    {...field}
                                    value={field.value || ""} // Valor padrão do idBanco
                                    onChange={(e) =>
                                      field.onChange(e.target.value)
                                    }
                                    fullWidth
                                    
                                  >
                                    {bancos?.map((banco) => (
                                      <MenuItem key={banco.id} value={banco.id}>
                                        {banco.nome}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                )}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <InputLabel>Forma de Pagamento</InputLabel>
                              <Controller
                                name={`financeiro.0.idFormaPgto`}
                                control={control}
                                render={({ field }) => (
                                  <Select
                                    {...field}
                                    value={field.value || ""} // Valor padrão do idForma_pgto
                                    onChange={(e) =>
                                      field.onChange(e.target.value)
                                    }
                                    fullWidth
                                  >
                                    <MenuItem value={1}>Dinheiro</MenuItem>
                                    <MenuItem value={2}>Débito</MenuItem>
                                    <MenuItem value={3}>Crédito</MenuItem>
                                    <MenuItem value={4}>Pix</MenuItem>
                                    <MenuItem value={5}>Boleto</MenuItem>
                                    <MenuItem value={6}>À prazo</MenuItem>
                                    <MenuItem value={7}>Cheque</MenuItem>
                                  </Select>
                                )}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        {/* Espaço entre as colunas */}
                        <Grid item xs={0} md={1} />{" "}
                        {/* Usado como espaçamento */}
                        {/* Coluna 2 */}
                        <Grid item xs={12} md={6}>
                          <Grid container spacing={2} direction={"column"}>
                            {/* Insumos */}
                            <Grid item xs={12}>
                              <Typography variant="subtitle1">
                                Insumos
                              </Typography>
                            </Grid>

                            {fields.map((item, index) => (
                              <Box key={item.id} mb={2}>
                                {/* Linha do Select */}
                                <Grid container spacing={2}>
                                  <Grid item xs={12}>
                                    <Controller
                                      control={control}
                                      name={
                                        `compras_insumos.${index}.idInsumo` as const
                                      }
                                      defaultValue={0}
                                      render={({ field }) => (
                                        <Select {...field} fullWidth>
                                          {insumos.map((insumo) => (
                                            <MenuItem
                                              key={insumo.id}
                                              value={insumo.id}
                                            >
                                              {insumo.nome}
                                            </MenuItem>
                                          ))}
                                        </Select>
                                      )}
                                    />
                                  </Grid>
                                </Grid>

                                {/* Linha de Largura, Comprimento e Preço */}
                                <Grid container spacing={2} mt={1}>
                                  <Grid item xs={4}>
                                    <TextField
                                      {...register(
                                        `compras_insumos.${index}.largura` as const
                                      )}
                                      type="number"
                                      error={
                                        !!errors.compras_insumos?.[index]
                                          ?.largura
                                      }
                                      label="Largura"
                                      defaultValue={1}
                                      InputProps={{ inputProps: { min: 1 } }}
                                      fullWidth
                                    />
                                  </Grid>
                                  <Grid item xs={4}>
                                    <TextField
                                      {...register(
                                        `compras_insumos.${index}.comprimento` as const
                                      )}
                                      type="number"
                                      error={
                                        !!errors.compras_insumos?.[index]
                                          ?.comprimento
                                      }
                                      label="Comprimento"
                                      defaultValue={1}
                                      InputProps={{ inputProps: { min: 1 } }}
                                      fullWidth
                                    />
                                  </Grid>
                                  <Grid item xs={4}>
                                    <TextField
                                      {...register(
                                        `compras_insumos.${index}.preco` as const
                                      )}
                                      type="number"
                                      error={
                                        !!errors.compras_insumos?.[index]?.preco
                                      }
                                      label="Preço"
                                      defaultValue={1}
                                      InputProps={{ inputProps: { min: 1 } }}
                                      fullWidth
                                    />
                                  </Grid>
                                </Grid>

                                {/* Botão de Remover */}
                                <Grid container spacing={2} mt={1}>
                                  <Grid item xs={12}>
                                    <IconButton
                                      onClick={() => handleRemoveProduct(index)}
                                      color="error"
                                      sx={{
                                        display: "block",
                                        marginLeft: "auto",
                                      }}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </Grid>
                                </Grid>
                              </Box>
                            ))}

                            {/* Botão de Adicionar Produto */}
                            <Grid item xs={12}>
                              <Button
                                variant="outlined"
                                startIcon={<AddCircleOutlineIcon />}
                                onClick={handleAddInsumo}
                              >
                                Adicionar Produto
                              </Button>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Button
                        type="submit"
                        variant="outlined"
                        startIcon={<DoneIcon />}
                        sx={{ mt: 2 }}
                      >
                        Cadastrar
                      </Button>
                    </form>
                  </Grid>
                </Grid>
              </Box>
            </Modal>
            {/* ---------UPDATE----------------------------------------------------------------------------------------------------------- */}
            {open && (
              <ModalEditCompra
                bancos={bancos}
                open={open}
                setAlertMessage={setAlertMessage}
                setShowAlert={setShowAlert}
                toggleModal={toggleModal}
                userId={userId}
                idToEdit={idToEdit}
                compras={purchases}
                comprasInsumos={ci}
                loadPurchases={loadPurchases}
                financeiro={financeiros}
                insumos={insumos}
                fornecedores={fornecedores}
              />
            )}
            {toggleGetModal.open && (
              <ModalGetCompra
                comprasInsumos={ci}
                insumos={insumos}
                financeiro={financeiros}
                compras={purchases}
                fornecedores={fornecedores}
                rowData={selectedRow}
                open={toggleGetModal.open}
                toggleModal={toggleGetModal.toggleModal}
              />
            )}
          </Box>
          <Box sx={GridStyle}>
            <DataGrid
              onRowClick={handleRowClick}
              rows={rows}
              columns={columns}
              localeText={localeText}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 6,
                  },
                },
              }}
              pageSizeOptions={[6]}
            />
          </Box>
        </Box>
      </MiniDrawer>
      {showAlert && <Alert severity="info">{alertMessage}</Alert>}
    </Box>
  );
};

export default Compra;
