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

const clienteSchema = z.object({
  id: z.number().optional(),
  nome: z.string(),
});
type clienteSchemaType = z.infer<typeof clienteSchema>;

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

  const [selectedData, setSelectedData] = useState<CompraDataRow | null>(null);
  const [purchases, setPurchases] = useState<compraSchemaType[]>([]);

  const [fornecedores, setFornecedores] = useState<fornecedorSchemaType[]>([]);
  const [bancos, setBancos] = useState<bancoSchemaType[]>([]);
  const [clientes, setClientes] = useState<clienteSchemaType[]>([]);
  const [insumos, setInsumos] = useState<insumoSchemaType[]>([]);
  const [formaPagamento, setFormaPagamento] = useState(0);
  const { open, toggleModal } = useOpenModal();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
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

  const handleUpdate = async (data: compraSchemaType) => {
    await putPurchases(data);
    loadPurchases();
    toggleModal();
  };

  const handleDelete = async (id: number) => {
    await deletePurchases(id);
    loadPurchases();
  };

  // População da modal  --------------------------------
  const handleEdit = (updateData: CompraDataRow) => {
    setSelectedData(updateData);
    toggleModal();
  };

  useEffect(() => {
    loadPurchases();
  }, [open]);

  useEffect(() => {
    if (selectedData) {
      setValue("id", selectedData.id);
      setValue("idFornecedor", selectedData.idFornecedor);
      setValue("isCompraOS", selectedData.isCompraOS);
      setValue(
        "dataCompra",
        dayjs(selectedData.dataCompra).format("YYYY-MM-DD")
      ); // Formato ISO
      setValue("numNota", selectedData.numNota);
      setValue("desconto", selectedData.desconto);
      setValue("isOpen", selectedData.isOpen);
      if (
        selectedData.compras_insumos &&
        selectedData.compras_insumos.length > 0
      ) {
        selectedData.compras_insumos.forEach((insumo) => {
          append({
            idInsumo: insumo.idInsumo,
            preco: insumo.preco,
            tamanho: insumo.tamanho,
          });
        });
      }
    }
  }, [selectedData, setValue, append]);

  const [adopen, setAdOpen] = useState<boolean>(false);
  const addOn = () => setAdOpen(true);
  const addOf = () => setAdOpen(false);

  // GRID ------------------------------------------------

  const columns: GridColDef<CompraDataRow>[] = [
    { field: "id", headerName: "id", editable: false, flex: 0 },
    {
      field: "idFornecedor",
      headerName: "IdFornecedor",
      editable: false,
      flex: 0,
    },
    { field: "isCompraOS", headerName: "IsCompraOS", editable: false, flex: 0 },
    { field: "dataCompra", headerName: "DataCompra", editable: false, flex: 0 },
    { field: "numNota", headerName: "NumNota", editable: false, flex: 0 },
    { field: "desconto", headerName: "Desconto", editable: false, flex: 0 },
    { field: "isOpen", headerName: "isOpen", editable: false, flex: 0 },

    {
      field: "acoes",
      headerName: "Ações",
      width: 150,
      align: "center",
      type: "actions",
      flex: 0,
      renderCell: ({ row }) => (
        <>
          <div>
            <IconButton
              onClick={() => row.id !== undefined && handleDelete(row.id)}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton onClick={() => row.id !== undefined && handleEdit(row)}>
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
    isOpen: compra.isOpen,
  }));
  useEffect(() => {
    reset();
  }, [fornecedorSchema, reset]);

  return (
    <Box>
      <MiniDrawer>
        <Box sx={SpaceStyle}>
          <Typography>Estamos dentro do banco </Typography>
          <Typography>(Não iremos cometer nenhum assalto...)</Typography>
          <Box>
            <Stack direction="row" spacing={2}>
              <Button
                onClick={addOn}
                variant="outlined"
                startIcon={<AddCircleOutlineIcon />}
              >
                Adicionar
              </Button>
            </Stack>

            <Modal
              open={adopen}
              onClose={addOf}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={ModalStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Nova compra
                </Typography>
                <form onSubmit={handleSubmit(handleAdd)}>
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
                    {fornecedores &&
                      fornecedores.map((fornecedor) => (
                        <MenuItem value={fornecedor.id} key={fornecedor.id}>
                          {" "}
                          {fornecedor.nome}{" "}
                        </MenuItem>
                      ))}
                  </Select>

                  <InputLabel id="demo-simple-select-label">
                    Compra ou OS
                  </InputLabel>

                  <Controller
                    control={control}
                    name="isCompraOS"
                    defaultValue={true}
                    render={({ field }) => (
                      <Select onChange={field.onChange} value={field.value}>
                        <MenuItem value={true}>Compra</MenuItem>
                        <MenuItem value={false}>OS</MenuItem>
                      </Select>
                    )}
                  />

                  <TextField
                    type="date"
                    label={"Data compra"}
                    InputLabelProps={{ shrink: true }}
                    size="medium"
                    helperText={errors.dataCompra?.message || "Obrigatório"}
                    error={!!errors.dataCompra}
                    defaultValue={dayjs(today).format("YYYY-MM-DD")}
                    {...register("dataCompra")}
                  />

                  <TextField
                    id="outlined-numNota"
                    label="Número da Nota"
                    defaultValue={0}
                    helperText={errors.numNota?.message || "Obrigatório"}
                    error={!!errors.numNota}
                    {...register("numNota")}
                  />
                  <TextField
                    id="outlined-desconto"
                    label="Desconto"
                    defaultValue={0}
                    helperText={errors.desconto?.message || "Obrigatório"}
                    error={!!errors.desconto}
                    {...register("desconto")}
                  />

                  <InputLabel id="demo-simple-select-label">IsOpen</InputLabel>

                  <Controller
                    control={control}
                    name="isOpen"
                    defaultValue={true}
                    render={({ field }) => (
                      <Select
                        onChange={field.onChange}
                        labelId="select-label"
                        id="demo-simple-select"
                        label="isOpen"
                        value={field.value}
                      >
                        <MenuItem value={true}>Open</MenuItem>
                        <MenuItem value={false}>Close</MenuItem>
                      </Select>
                    )}
                  />

                  <Typography variant="h6">Compra de Insumos</Typography>
                  {fields.map((item, index) => (
                    <Box
                      key={item.id}
                      display="flex"
                      alignItems="center"
                      gap={2}
                    >
                      <Controller
                        control={control}
                        name={`compras_insumos.${index}.idInsumo` as const}
                        defaultValue={0}
                        render={({ field }) => (
                          <Select
                            {...field}
                            error={!!errors.compras_insumos?.[index]?.idInsumo}
                          >
                            {insumos.map((insumo) => (
                              <MenuItem key={insumo.id} value={insumo.id}>
                                {insumo.nome}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />

                      <TextField
                        {...register(
                          `compras_insumos.${index}.tamanho` as const
                        )}
                        type="number"
                        error={!!errors.compras_insumos?.[index]?.tamanho}
                        helperText={
                          errors.compras_insumos?.[index]?.tamanho?.message ||
                          "Tamanho"
                        }
                        label="Tamanho"
                        defaultValue={1}
                        InputProps={{ inputProps: { min: 1 } }}
                      />

                      <TextField
                        {...register(`compras_insumos.${index}.preco` as const)}
                        type="number"
                        error={!!errors.compras_insumos?.[index]?.preco}
                        helperText={
                          errors.compras_insumos?.[index]?.preco?.message ||
                          "preco"
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

                  <Typography>Financeiro</Typography>
                  <TextField
                    label="Parcelas"
                    type="number"
                    defaultValue={1}
                    InputProps={{
                      readOnly: formaPagamento === 0 || formaPagamento === 1,
                    }}
                    {...register("parcelas")}
                  />

                  <Button
                    variant="outlined"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={handleAddInsumo}
                  >
                    Adicionar Produto
                  </Button>

                  <Button
                    type="submit"
                    variant="outlined"
                    startIcon={<DoneIcon />}
                  >
                    Cadastrar
                  </Button>
                </form>
              </Box>
            </Modal>
            {/* ---------UPDATE----------------------------------------------------------------------------------------------------------- */}
            <Modal
              open={open}
              onClose={toggleModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <ModalRoot
                title="Editando Compra"
                children={
                  // meu componente

                  <form onSubmit={handleSubmit(handleUpdate)}>
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
                    {fornecedores &&
                      fornecedores.map((fornecedor) => (
                        <MenuItem value={fornecedor.id} key={fornecedor.id}>
                          {" "}
                          {fornecedor.nome}{" "}
                        </MenuItem>
                      ))}
                  </Select>

                  <InputLabel id="demo-simple-select-label">
                    Compra ou OS
                  </InputLabel>

                  <Controller
                    control={control}
                    name="isCompraOS"
                    defaultValue={true}
                    render={({ field }) => (
                      <Select onChange={field.onChange} value={field.value}>
                        <MenuItem value={true}>Compra</MenuItem>
                        <MenuItem value={false}>OS</MenuItem>
                      </Select>
                    )}
                  />

                  <TextField
                    type="date"
                    label={"Data compra"}
                    InputLabelProps={{ shrink: true }}
                    size="medium"
                    helperText={errors.dataCompra?.message || "Obrigatório"}
                    error={!!errors.dataCompra}
                    defaultValue={dayjs(today).format("YYYY-MM-DD")}
                    {...register("dataCompra")}
                  />

                  <TextField
                    id="outlined-numNota"
                    label="Número da Nota"
                    defaultValue={0}
                    helperText={errors.numNota?.message || "Obrigatório"}
                    error={!!errors.numNota}
                    {...register("numNota")}
                  />
                  <TextField
                    id="outlined-desconto"
                    label="Desconto"
                    defaultValue={0}
                    helperText={errors.desconto?.message || "Obrigatório"}
                    error={!!errors.desconto}
                    {...register("desconto")}
                  />

                  <InputLabel id="demo-simple-select-label">IsOpen</InputLabel>

                  <Controller
                    control={control}
                    name="isOpen"
                    defaultValue={true}
                    render={({ field }) => (
                      <Select
                        onChange={field.onChange}
                        labelId="select-label"
                        id="demo-simple-select"
                        label="isOpen"
                        value={field.value}
                      >
                        <MenuItem value={true}>Open</MenuItem>
                        <MenuItem value={false}>Close</MenuItem>
                      </Select>
                    )}
                  />

                  <Typography variant="h6">Compra de Insumos</Typography>
                  {fields.map((item, index) => (
                    <Box
                      key={item.id}
                      display="flex"
                      alignItems="center"
                      gap={2}
                    >
                      <Controller
                        control={control}
                        name={`compras_insumos.${index}.idInsumo` as const}
                        defaultValue={0}
                        render={({ field }) => (
                          <Select
                            {...field}
                            error={!!errors.compras_insumos?.[index]?.idInsumo}
                          >
                            {insumos.map((insumo) => (
                              <MenuItem key={insumo.id} value={insumo.id}>
                                {insumo.nome}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />

                      <TextField
                        {...register(
                          `compras_insumos.${index}.tamanho` as const
                        )}
                        type="number"
                        error={!!errors.compras_insumos?.[index]?.tamanho}
                        helperText={
                          errors.compras_insumos?.[index]?.tamanho?.message ||
                          "Tamanho"
                        }
                        label="Tamanho"
                        defaultValue={1}
                        InputProps={{ inputProps: { min: 1 } }}
                      />

                      <TextField
                        {...register(`compras_insumos.${index}.preco` as const)}
                        type="number"
                        error={!!errors.compras_insumos?.[index]?.preco}
                        helperText={
                          errors.compras_insumos?.[index]?.preco?.message ||
                          "preco"
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

                  <Typography>Financeiro</Typography>
                  <TextField
                    label="Parcelas"
                    type="number"
                    defaultValue={1}
                    InputProps={{
                      readOnly: formaPagamento === 0 || formaPagamento === 1,
                    }}
                    {...register("parcelas")}
                  />

                  <Button
                    variant="outlined"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={handleAddInsumo}
                  >
                    Adicionar Produto
                  </Button>

                  <Button
                    type="submit"
                    variant="outlined"
                    startIcon={<DoneIcon />}
                  >
                    Atualizar
                  </Button>
                  </form>
                }
              />
            </Modal>
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
