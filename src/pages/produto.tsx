import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  InputLabel,
  Select,
  MenuItem,
  Modal,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import { DataGrid, GridColDef, GridLocaleText } from "@mui/x-data-grid";
import { ModalStyle, GridStyle, SpaceStyle } from "../shared/styles";
import { MiniDrawer } from "../shared/components";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModalRoot } from "../shared/components/ModalRoot";
import { useOpenModal } from "../shared/hooks/useOpenModal";
import { Controller, useForm } from "react-hook-form";

import {
  produtoSchema,
  produtoSchemaType,
  ProdutoDataRow,
} from "../shared/services/types";
import Insumo from "./insumo";
import {
  deleteProducts,
  getProducts,
  postProducts,
  putProducts,
} from "../shared/services";
import { NumericFormat } from "react-number-format";

const insumoSchema = z.object({
  id: z.number(),
  nome: z.string(),
});
type insumoSchemaType = z.infer<typeof insumoSchema>;

const categoriaSchema = z.object({
  id: z.number(),
  categoria: z.string(),
});
type categoriaSchemaType = z.infer<typeof categoriaSchema>;

const Produto = () => {
  const {
    register,
    setValue,
    reset,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<produtoSchemaType>({
    resolver: zodResolver(produtoSchema),
  });
  const [products, setProducts] = useState<produtoSchemaType[]>([]);
  const [insumos, setInsumos] = useState<insumoSchemaType[]>([]);
  const [categorias, setCategorias] = useState<categoriaSchemaType[]>([]);
  const [selectedData, setSelectedData] = useState<ProdutoDataRow | null>(null);
  const { toggleModal, open } = useOpenModal();

  const handleEdit = (updateDate: ProdutoDataRow) => {
    setSelectedData(updateDate);
    toggleModal();
  };

  // Modal ADD
  const [adopen, setAdOpen] = useState<boolean>(false);
  const addOn = () => {
    setAdOpen(true), reset();
  };
  const addOf = () => setAdOpen(false);

  // Trazendo isnumos e categoria  --------------------------------
  useEffect(() => {
    const getInsumos = async () => {
      const response = await axios.get("http://localhost:3000/insumo/itens");
      setInsumos(response.data);
    };
    getInsumos();
  }, []);

  useEffect(() => {
    const getCategorias = async () => {
      const response = await axios.get(
        "http://localhost:3000/categoria_produto/itens"
      );
      setCategorias(response.data);
    };
    getCategorias();
  }, []);

  const loadProducts = async () => {
    const productsData = await getProducts();
    setProducts(productsData);
  };

  const handleAdd = async (data: produtoSchemaType) => {
    console.log("Data enviada:", data);
    await postProducts(data);
    loadProducts();
    setAdOpen(false);
  };

  const handleUpdate = async (data: produtoSchemaType) => {
    await putProducts(data);
    loadProducts();
    toggleModal();
  };

  const handleDelete = async (id: number) => {
    await deleteProducts(id);
    loadProducts();
  };

  useEffect(() => {
    loadProducts();
  }, [open]);

  const getInsumoNome = (id: number | undefined) => {
    const insumoNome = insumos.find((cat) => cat.id === id);
    return insumoNome ? insumoNome.nome : "Desconhecido";
  };

  const getCategoriaNome = (id: number | undefined) => {
    const categoriaNome = categorias.find((cat) => cat.id === id);
    return categoriaNome ? categoriaNome.categoria : "Desconhecido";
  };

  const columns: GridColDef<ProdutoDataRow>[] = [
    {
      field: "nome",
      headerName: "Nome",
      editable: false,
      flex: 0,
      minWidth: 150,
      width: 150,
      headerClassName: "gridHeader--header",
    },
    {
      field: "keyWord",
      headerName: "Palavra Chave",
      editable: false,
      flex: 0,
      minWidth: 150,
      width: 150,
      headerClassName: "gridHeader--header",
    },
    {
      field: "tipo",
      headerName: "Tipo",
      editable: false,
      flex: 0,
      minWidth: 70,
      width: 100,
      headerClassName: "gridHeader--header",
      valueGetter: ({ value }) => (value ? "Serviço" : "Produto"),
    },
    {
      field: "idCategoria",
      headerName: "Categoria",
      editable: false,
      flex: 0,
      minWidth: 100,
      width: 100,
      headerClassName: "gridHeader--header",
    },
    {
      field: "idInsumo",
      headerName: "Insumo",
      editable: false,
      flex: 0,
      minWidth: 130,
      width: 110,
      headerClassName: "gridHeader--header",
    },
    {
      field: "preco",
      headerName: "Preço",
      editable: false,
      flex: 0,
      minWidth: 90,
      width: 90,
      headerClassName: "gridHeader--header",
      renderCell: (params) => {
        const formattedValue = new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(params.value);
        return <span>{formattedValue}</span>;
      },
    },
    {
      field: "largura",
      headerName: "Largura",
      editable: false,
      flex: 0,
      minWidth: 70,
      width: 70,
      headerClassName: "gridHeader--header",
      renderCell: (params) => <span>{params.value} cm</span>,
    },
    {
      field: "comprimento",
      headerName: "Comprimento",
      editable: false,
      flex: 0,
      minWidth: 110,
      width: 110,
      headerClassName: "gridHeader--header",
      renderCell: (params) => <span>{params.value} cm</span>,
    },

    {
      field: "acoes",
      headerName: "Ações",
      width: 150,
      minWidth: 150,
      align: "center",
      type: "actions",
      flex: 0,
      headerClassName: "gridHeader--header",
      renderCell: ({ row }) => (
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
      ),
    },
  ];

  const rows = products.map((produto) => ({
    id: produto.id,
    nome: produto.nome,
    tipo: produto.tipo,
    keyWord: produto.keyWord,
    idCategoria: getCategoriaNome(produto.idCategoria),
    idInsumo: getInsumoNome(produto.idInsumo),
    preco: produto.preco,
    largura: produto.largura,
    comprimento: produto.comprimento,
  }));
  useEffect(() => {
    reset();
  }, [insumoSchema, categoriaSchema, reset]);

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
              <Typography variant="h6">Produtos</Typography>
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
                <Grid container spacing={2} direction="column">
                  <Grid item>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      Novo Produto
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <form onSubmit={handleSubmit(handleAdd)}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            id="outlined-helperText"
                            label="Nome"
                            helperText={errors.nome?.message || "Obrigatório"}
                            error={!!errors.nome}
                            fullWidth
                            {...register("nome")}
                          />

                          <InputLabel id="insumo-label">Insumos</InputLabel>
                          <Select
                            {...register("idInsumo")}
                            labelId="insumo-label"
                            id="insumo-select"
                            fullWidth
                            defaultValue={
                              insumos.length > 0 ? insumos[0].nome : ""
                            }
                            error={!!errors.idInsumo}
                          >
                            {insumos.map((insumo) => (
                              <MenuItem key={insumo.id} value={insumo.id}>
                                {insumo.nome}
                              </MenuItem>
                            ))}
                          </Select>

                          <InputLabel id="categoria-label">
                            Categorias
                          </InputLabel>
                          <Select
                            {...register("idCategoria")}
                            labelId="categoria-label"
                            id="categoria-select"
                            fullWidth
                            defaultValue={
                              categorias.length > 0
                                ? categorias[0].categoria
                                : ""
                            }
                            error={!!errors.idCategoria}
                          >
                            {categorias.map((categoria) => (
                              <MenuItem key={categoria.id} value={categoria.id}>
                                {categoria.categoria}
                              </MenuItem>
                            ))}
                          </Select>

                          <InputLabel id="tipo-label">Tipo</InputLabel>
                          <Controller
                            control={control}
                            name="tipo"
                            defaultValue={true}
                            render={({ field }) => (
                              <Select
                                {...field}
                                labelId="tipo-label"
                                id="tipo-select"
                                fullWidth
                              >
                                <MenuItem value={true}>Não</MenuItem>
                                <MenuItem value={false}>Sim</MenuItem>
                              </Select>
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          {/* Campo KeyWord */}
                          <TextField
                            id="outlined-helperText"
                            label="KeyWord"
                            helperText={
                              errors.keyWord?.message || "Obrigatório"
                            }
                            error={!!errors.keyWord}
                            fullWidth
                            {...register("keyWord")}
                          />

                          <NumericFormat
                            customInput={TextField}
                            sx={{ marginTop: 2.8 }}
                            prefix="R$"
                            fullWidth
                            id="outlined-helperText"
                            label="Preço"
                            thousandSeparator=","
                            decimalSeparator="."
                            allowLeadingZeros
                            onValueChange={(values) => {
                              const { floatValue } = values;
                              setValue("preco", floatValue ?? 0);
                            }}
                            helperText={errors.preco?.message || "Obrigatório"}
                            error={!!errors.preco}
                          />

                          <NumericFormat
                            customInput={TextField}
                            suffix="cm"
                            fullWidth
                            id="outlined-helperText"
                            label="Largura"
                            thousandSeparator=","
                            decimalSeparator="."
                            allowLeadingZeros
                            onValueChange={(values) => {
                              const { floatValue } = values;
                              setValue("largura", floatValue ?? 0);
                            }}
                            helperText={
                              errors.largura?.message || "Obrigatório"
                            }
                            error={!!errors.largura}
                          />

                          <NumericFormat
                            customInput={TextField}
                            suffix="cm"
                            fullWidth
                            id="outlined-helperText"
                            label="Comprimento"
                            thousandSeparator=","
                            decimalSeparator="."
                            allowLeadingZeros
                            onValueChange={(values) => {
                              const { floatValue } = values;
                              setValue("comprimento", floatValue ?? 0);
                            }}
                            helperText={
                              errors.comprimento?.message || "Obrigatório"
                            }
                            error={!!errors.comprimento}
                          />
                        </Grid>

                        <Grid item xs={12} sx={{ textAlign: "right" }}>
                          <Button
                            type="submit"
                            variant="outlined"
                            startIcon={<DoneIcon />}
                          >
                            Cadastrar
                          </Button>
                        </Grid>
                      </Grid>
                    </form>
                  </Grid>
                </Grid>
              </Box>
            </Modal>
            {/* ------------------------------------------------------------------------------------------------------- */}

            <Modal
              open={open}
              onClose={toggleModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <ModalRoot>
                <Grid container spacing={2} direction="column">
                  <Grid item>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      Editar Produto
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <form onSubmit={handleSubmit(handleUpdate)}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            id="outlined-helperText"
                            label="Nome"
                            helperText={errors.nome?.message || "Obrigatório"}
                            error={!!errors.nome}
                            fullWidth
                            {...register("nome")}
                          />

                          <InputLabel id="insumo-label">Insumos</InputLabel>
                          <Select
                            {...register("idInsumo")}
                            labelId="insumo-label"
                            id="insumo-select"
                            fullWidth
                            defaultValue={
                              insumos.length > 0 ? insumos[0].nome : ""
                            }
                            error={!!errors.idInsumo}
                          >
                            {insumos.map((insumo) => (
                              <MenuItem key={insumo.id} value={insumo.id}>
                                {insumo.nome}
                              </MenuItem>
                            ))}
                          </Select>

                          <InputLabel id="categoria-label">
                            Categorias
                          </InputLabel>
                          <Select
                            {...register("idCategoria")}
                            labelId="categoria-label"
                            id="categoria-select"
                            fullWidth
                            defaultValue={
                              categorias.length > 0
                                ? categorias[0].categoria
                                : ""
                            }
                            error={!!errors.idCategoria}
                          >
                            {categorias.map((categoria) => (
                              <MenuItem key={categoria.id} value={categoria.id}>
                                {categoria.categoria}
                              </MenuItem>
                            ))}
                          </Select>

                          <InputLabel id="tipo-label">Tipo</InputLabel>
                          <Controller
                            control={control}
                            name="tipo"
                            defaultValue={true}
                            render={({ field }) => (
                              <Select
                                {...field}
                                labelId="tipo-label"
                                id="tipo-select"
                                fullWidth
                              >
                                <MenuItem value={true}>Não</MenuItem>
                                <MenuItem value={false}>Sim</MenuItem>
                              </Select>
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          {/* Campo KeyWord */}
                          <TextField
                            id="outlined-helperText"
                            label="KeyWord"
                            helperText={
                              errors.keyWord?.message || "Obrigatório"
                            }
                            error={!!errors.keyWord}
                            fullWidth
                            {...register("keyWord")}
                          />

                          <NumericFormat
                            customInput={TextField}
                            sx={{ marginTop: 2.8 }}
                            prefix="R$"
                            fullWidth
                            id="outlined-helperText"
                            label="Preço"
                            thousandSeparator=","
                            decimalSeparator="."
                            allowLeadingZeros
                            onValueChange={(values) => {
                              const { floatValue } = values;
                              setValue("preco", floatValue ?? 0);
                            }}
                            helperText={errors.preco?.message || "Obrigatório"}
                            error={!!errors.preco}
                          />

                          <TextField
                            id="outlined-helperText"
                            label="Largura"
                            helperText={
                              errors.largura?.message || "Obrigatório"
                            }
                            error={!!errors.largura}
                            fullWidth
                            {...register("largura")}
                          />

                          <TextField
                            id="outlined-helperText"
                            label="Comprimento"
                            helperText={
                              errors.comprimento?.message || "Obrigatório"
                            }
                            error={!!errors.comprimento}
                            fullWidth
                            {...register("comprimento")}
                          />
                        </Grid>

                        <Grid item xs={12} sx={{ textAlign: "right" }}>
                          <Button
                            type="submit"
                            variant="outlined"
                            startIcon={<DoneIcon />}
                          >
                            Editar
                          </Button>
                        </Grid>
                      </Grid>
                    </form>
                  </Grid>
                </Grid>
              </ModalRoot>
            </Modal>
          </Box>
          <Box sx={GridStyle}>
            <DataGrid
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
    </Box>
  );
};

export default Produto;
