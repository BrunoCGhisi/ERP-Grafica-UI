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
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ModalStyle, GridStyle, SpaceStyle } from "../shared/styles";
//Icones
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DoneIcon from "@mui/icons-material/Done";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { getToken } from "../shared/services/payload";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOpenModal } from "../shared/hooks/useOpenModal";
import { ModalRoot } from "../shared/components/ModalRoot";
import { MiniDrawer } from "../shared/components";
import dayjs from "dayjs";

import {
  compraSchema,
  compraSchemaType,
  CompraDataRow,
  bancoSchemaType,
  insumoSchemaType,
} from "../shared/services/types";

import {
  getPurchases,
  postPurchases,
  putPurchases,
  deletePurchases,
} from "../shared/services/compraServices";
import { width } from "@mui/system";

const fornecedorSchema = z.object({
  id: z.number(),
  nome: z.string(),
});
type fornecedorSchemaType = z.infer<typeof fornecedorSchema>;

const Compra = () => {

  const today = new Date();

  const [purchases, setPurchases] = useState<compraSchemaType[]>([]);
  const [fornecedores, setFornecedores] = useState<fornecedorSchemaType[]>([]);
  const [bancos, setBancos] = useState<bancoSchemaType[]>([]);
  const [insumos, setInsumos] = useState<insumoSchemaType[]>([]);
  const [idToEdit, setIdToEdit] = useState<any>(null)
  const [formaPagamento, setFormaPagamento] = useState(0);
  const { open, toggleModal } = useOpenModal();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control, watch,
    formState: { errors },
  } = useForm<compraSchemaType>({
    resolver: zodResolver(compraSchema),
    defaultValues: {
      compras_insumos: [{ idInsumo: 0, tamanho: 0, preco: 0 }], // Inicializa com um produto
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "compras_insumos",
  });

  const handleAddInsumo = () => {
    append({ idInsumo: 0, tamanho: 0, preco: 0 }); // Adiciona um novo produto com quantidade inicial
  };

  const handleRemoveProduct = (index: number) => {
    remove(index);
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

  // Trazendo Produtos    --------------------------------------------------
  useEffect(() => {
    const getInsumos = async () => {
      const response = await axios.get("http://localhost:3000/insumo/itens");
      setInsumos(response.data);
    };
    getInsumos();
  }, []);

  useEffect(() => {
    if (formaPagamento === 0 || formaPagamento === 1) {
      // Define o valor do campo de parcelas para 1 e torna readOnly
      setValue("parcelas", 1);
    }
  }, [formaPagamento, setValue]);

  //CRUD -----------------------------------------------------------------------------------------------------

  const loadPurchases = async () => {
    const purchasesData = await getPurchases();
    setPurchases(purchasesData);
  };

  const handleAdd = async (data: compraSchemaType) => {
    await postPurchases(data);
    loadPurchases();
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
    { field: "idFornecedor", headerName: "Fornecedor", editable: false, flex: 0, headerClassName: "gridHeader--header", minWidth: 300 },
    { field: "isCompraOS", headerName: "OS", editable: false, flex: 0, headerClassName: "gridHeader--header", maxWidth: 100 },
    { field: "dataCompra", headerName: "Data da Compra", editable: false, flex: 0, headerClassName: "gridHeader--header", minWidth: 150 },
    { field: "numNota", headerName: "N° Nota", editable: false, flex: 0, headerClassName: "gridHeader--header", minWidth: 150 },
    { field: "desconto", headerName: "Desconto", editable: false, flex: 0, headerClassName: "gridHeader--header", minWidth: 100 },
    { field: "acoes", headerName: "Ações", width: 150, align: "center", type: "actions", flex: 0, headerClassName: "gridHeader--header",
      renderCell: ({ row }) => (
        <>
          <div>
            <IconButton
              onClick={() => row.id !== undefined && handleDelete(row.id)}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton onClick={() => row.id !== undefined && [setIdToEdit(row.id), toggleModal()]}>
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

          <Box
          style={{width:'900px'}}>
            <Modal
              open={adopen}
              onClose={addOf}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >

              <Box sx={ModalStyle}>
                <Grid container spacing={2} direction="column">
                  <Grid item>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      Nova compra
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <form onSubmit={handleSubmit(handleAdd)}>

                      <Grid container spacing={2}>
                        {/* Coluna 1: Fornecedor até Is Open */}
                        <Grid item xs={12} md={6}>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>

                              <Select
                                {...register("idFornecedor")}
                                labelId="select-label"
                                id="demo-simple-select"
                                label="Fornecedor"
                                fullWidth
                                error={!!errors.idFornecedor}
                                defaultValue={fornecedores.length > 0 ? fornecedores[0].nome : "Sem Fornecedores"}
                              >
                                {fornecedores.map((fornecedor) => (
                                  <MenuItem value={fornecedor.id} key={fornecedor.id}>{fornecedor.nome}</MenuItem>
                                ))}
                              </Select>
                            </Grid>

                            <Grid item xs={12}>
                              <InputLabel id="demo-simple-select-label">
                                Compra ou OS
                              </InputLabel>
                              <Controller
                                control={control}
                                name="isCompraOS"
                                defaultValue={true}
                                render={({ field }) => (
                                  <Select
                                    onChange={field.onChange}
                                    value={field.value}
                                  >
                                    <MenuItem value={true}>Compra</MenuItem>
                                    <MenuItem value={false}>OS</MenuItem>
                                  </Select>
                                )}
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <TextField
                                type="date"
                                label="Data compra"
                                InputLabelProps={{ shrink: true }}
                                size="medium"
                                helperText={
                                  errors.dataCompra?.message || "Obrigatório"
                                }
                                error={!!errors.dataCompra}
                                defaultValue={dayjs(today).format("YYYY-MM-DD")}
                                {...register("dataCompra")}
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <TextField
                                id="outlined-numNota"
                                label="Número da Nota"
                                defaultValue={0}
                                helperText={
                                  errors.numNota?.message || "Obrigatório"
                                }
                                error={!!errors.numNota}
                                {...register("numNota")}
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <TextField
                                id="outlined-desconto"
                                label="Desconto"
                                defaultValue={0}
                                helperText={
                                  errors.desconto?.message || "Obrigatório"
                                }
                                error={!!errors.desconto}
                                {...register("desconto")}
                              />
                            </Grid>
                          </Grid>
                        </Grid>

                        {/* Coluna 2: Compra Produtos */}
                        <Grid item xs={12} md={6}>
                          <Typography variant="h6">
                            Compra de Insumos
                          </Typography>
                          {fields.map((item, index) => (
                            <Box
                              key={item.id}
                              display="flex"
                              alignItems="center"
                              gap={2}
                              mb={2}
                            >
                              <Controller
                                control={control}
                                name={
                                  `compras_insumos.${index}.idInsumo` as const
                                }
                                defaultValue={0}
                                render={({ field }) => (
                                  <Select
                                    {...field}
                                    error={
                                      !!errors.compras_insumos?.[index]
                                        ?.idInsumo
                                    }
                                  >
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

                              <TextField
                                {...register(
                                  `compras_insumos.${index}.largura` as const
                                )}
                                type="number"
                                error={
                                  !!errors.compras_insumos?.[index]?.largura
                                }
                                helperText={
                                  errors.compras_insumos?.[index]?.largura
                                    ?.message || "Largura"
                                }
                                label="Largura"
                                defaultValue={1}
                                InputProps={{ inputProps: { min: 1 } }}
                              />
                              <TextField
                                {...register(
                                  `compras_insumos.${index}.comprimento` as const
                                )}
                                type="number"
                                error={
                                  !!errors.compras_insumos?.[index]?.comprimento
                                }
                                helperText={
                                  errors.compras_insumos?.[index]?.comprimento
                                    ?.message || "Comprimento"
                                }
                                label="Comprimento"
                                defaultValue={1}
                                InputProps={{ inputProps: { min: 1 } }}
                              />

                              <TextField
                                {...register(
                                  `compras_insumos.${index}.preco` as const
                                )}
                                type="number"
                                error={!!errors.compras_insumos?.[index]?.preco}
                                helperText={
                                  errors.compras_insumos?.[index]?.preco
                                    ?.message || "preco"
                                }
                                label="preco"
                                defaultValue={1}
                                InputProps={{ inputProps: { min: 1 } }}
                              />

                              <IconButton
                                onClick={() => handleRemoveProduct(index)}
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          ))}

                          
                        <Grid item xs={12} md={8}>
                            <InputLabel id="demo-simple-select-label">Banco</InputLabel>

                            <Controller
                              name={`financeiros.0.idBanco`}
                              control={control}
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  value={field.value || ""} // Valor padrão do idBanco
                                  onChange={(e) => field.onChange(e.target.value)}
                                  style={{ width: 300 }}
                                >
                                  {bancos?.map((banco) => (
                                    <MenuItem key={banco.id} value={banco.id}>
                                      {banco.nome}
                                    </MenuItem>
                                  ))}
                                </Select>
                              )}/>
                              </Grid>

                               <InputLabel>Forma de Pagamento</InputLabel>
                                <Controller
                                  name={`financeiros.0.idFormaPgto`}
                                  control={control}
                                  render={({ field }) => (
                                    <Select
                                      {...field}
                                      value={field.value || ""} // Valor padrão do idForma_pgto
                                      onChange={(e) => field.onChange(e.target.value)}
                                      style={{ width: 300 }}
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

                            <Typography>Parcelas</Typography>
                              <TextField
                                label="Parcelas"
                                type="number"
                                defaultValue={1}
                                InputProps={{
                                  readOnly: waiter === 2 || waiter === 1 || waiter === 4,
                                }}
                                {...register("financeiros.0.parcelas")}
                              />


                          <Button
                            variant="outlined"
                            startIcon={<AddCircleOutlineIcon />}
                            onClick={handleAddInsumo}
                            sx={{ mt: 2 }}
                          >
                            Adicionar Produto
                          </Button>
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
            
          </Box>
          <Box sx={GridStyle}>
            <DataGrid
              rows={rows}
              columns={columns}
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
    </Box>
  );
};

export default Compra;
