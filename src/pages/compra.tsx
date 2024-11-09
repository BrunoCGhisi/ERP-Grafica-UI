import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Modal,
  InputLabel,
  Select,
  Button,
  Typography,
  TextField,
  Stack,
  IconButton,
  MenuItem,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ModalStyle, GridStyle, SpaceStyle } from "../shared/styles";
import { MiniDrawer } from "../shared/components";
import dayjs from "dayjs";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOpenModal } from "../shared/hooks/useOpenModal";
import { ModalRoot } from "../shared/components/ModalRoot";

import {
  compraSchema,
  compraSchemaType,
  CompraDataRow,
  bancoSchemaType, 
  produtoSchemaType,
  insumoSchemaType
} from "../shared/services/types";

import {getPurchases, postPurchases, putPurchases, deletePurchases } from "../shared/services/compraServices";

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
  const today = new Date();
  const formatDate = (dateString: "dataCompra") => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };
  const [selectedData, setSelectedData] = useState<CompraDataRow | null>(null);
  const [purchases, setPurchases] = useState<compraSchemaType[]>([]);
  //const [compras_produtos, setCompras_produtos] = 

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
      compras_produtos: [{ idInsumo: 0, tamanho: 0, preco: 0 }], // Inicializa com um produto
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "compras_produtos",
  });

  const handleAddInsumo = () => {
    append({ idInsumo: 0, tamanho: 0, preco: 0 }); // Adiciona um novo produto com quantidade inicial
  };

  const handleRemoveProduct = (index: number) => {
    remove(index);
  };

  // Modal ADD --------------------------------
  const [adopen, setAdOpen] = useState<boolean>(false);
  const addOn = () => {
    setAdOpen(true), reset();
  };
  const addOf = () => setAdOpen(false);

  // População da modal  --------------------------------
  const handleEdit = (updateData: CompraDataRow) => {
    setSelectedData(updateData);
    toggleModal();
  };

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
    }
  }, [selectedData, setValue]);

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
      setBancos(response.data);
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

  useEffect(() => {
    loadPurchases();
  }, [open]);

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

                  <Typography variant="h6">Produtos da Venda</Typography>
                  {fields.map((item, index) => (
                    <Box
                      key={item.id}
                      display="flex"
                      alignItems="center"
                      gap={2}
                    >
                      <Controller
                        control={control}
                        name={`compras_produtos.${index}.idInsumo` as const}
                        defaultValue={0}
                        render={({ field }) => (
                          <Select
                            {...field}
                            error={!!errors.compras_produtos?.[index]?.idInsumo}
                          >
                            {compras_produtos.map((compra_produto) => (
                              <MenuItem key={compra_produto.id} value={compra_produto.id}>
                                {compra_produto.nome}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />

                      <TextField
                        {...register(
                          `compras_produtos.${index}.tamanho` as const
                        )}
                        type="number"
                        error={!!errors.compras_produtos?.[index]?.tamanho}
                        helperText={
                          errors.compras_produtos?.[index]?.tamanho
                            ?.message || "Tamanho"
                        }
                        label="Tamanho"
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
                    <TextField
                      id="outlined-idFornecedor"
                      label="IDs Fornecedor"
                      inputProps={{ readOnly: true }}
                      helperText={errors.idFornecedor?.message || "Obrigatório"}
                      error={!!errors.idFornecedor?.message}
                      {...register("idFornecedor")}
                    />
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
                      defaultValue={dayjs("dataCompra").format("DD-MM-YYYY")}
                      helperText={errors.dataCompra?.message || "Obrigatório"}
                      error={!!errors.dataCompra}
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
                      defaultValue={
                        selectedData !== null && selectedData["desconto"]
                      }
                      helperText={errors.desconto?.message || "Obrigatório"}
                      error={!!errors.desconto}
                      {...register("desconto")}
                    />

                    <InputLabel id="demo-simple-select-label">
                      Em aberto?
                    </InputLabel>

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
