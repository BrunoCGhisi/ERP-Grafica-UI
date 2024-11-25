import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  InputLabel,
  Select,
  MenuItem,
  Modal,
  Button,
  IconButton, TextField,
  Typography,
  Grid,
  Alert
} from "@mui/material";
import { DataGrid, GridColDef, GridLocaleText } from "@mui/x-data-grid";
import { ModalStyle, GridStyle, SpaceStyle } from "../../shared/styles";
import { MiniDrawer } from "../../shared/components";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";

import { zodResolver } from "@hookform/resolvers/zod";
import { useOpenModal } from "../../shared/hooks/useOpenModal";
import { Controller, useForm } from "react-hook-form";

import {
  produtoSchema,
  produtoSchemaType,
  ProdutoDataRow, vendaProdutoSchemaType,
  proCategorySchemaType,
  insumoSchemaType,
  insumoSchema,
  proCategorySchema
} from "../../shared/services/types";
import {
  deleteProducts,
  getProducts, getSalesProd,
  getSupplies,
  getSuppliesAll,
  postProducts,
  putProducts
} from "../../shared/services";
import { NumericFormat } from "react-number-format";
import { ModalEditProduto } from "./components/modal-edit-produto";
import { ModalDeactivateProduto } from "./components/modal-deactivate-produtos";
import ArchiveIcon from '@mui/icons-material/Archive';

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
  const [insumosAll, setInsumosAll] = useState<insumoSchemaType[]>([]);
  const [categorias, setCategorias] = useState<proCategorySchemaType[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [idToEdit, setIdToEdit] = useState<any>(null);
  const { toggleModal, open } = useOpenModal();
  const toggleModalDeactivate = useOpenModal();

  // Modal ADD
  const [adopen, setAdOpen] = useState<boolean>(false);
  const addOn = () => {
    setAdOpen(true), reset();
  };
  const addOf = () => setAdOpen(false);

  // Trazendo isnumos e categoria  --------------------------------
  const loadSupplies = async () => {
    const response = await getSupplies();
    const responseAll = await getSuppliesAll();
    setInsumos(response);
    setInsumosAll(responseAll)
  };
  useEffect(() => {
    loadSupplies();
  }, []);

  useEffect(() => {
    const getCategorias = async () => {
      const response = await axios.get(
        "http://localhost:3000/categoria_produto"
      );
      setCategorias(response.data.catProdAtivos);
    };
    getCategorias();
  }, []);

  const loadProducts = async () => {
    const productsData = await getProducts();
    setProducts(productsData);
  };

  const handleAdd = async (data: produtoSchemaType) => {
    console.log(data)
    const response = await postProducts(data);
    if (response) {
      setAlertMessage(`${response.data}`);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    }
    loadProducts();
    setAdOpen(false);
  };

  const handleDelete = async (data: produtoSchemaType) => {
    try {
      const vendas = await getSalesProd();
      const filterVendas = vendas.filter((venda: vendaProdutoSchemaType) => venda.idProduto === data.id)
      if (filterVendas.length === 0){
        await deleteProducts(data.id!);
      }
      else{
        const deactivate = {...data, isActive: false}
        await putProducts(deactivate);
      }
      
      
    } catch (error) {
      await deleteProducts(data.id!);
    }
    loadProducts();
  };

  useEffect(() => {
    loadProducts();
  }, [open]);

  const getInsumoNome = (id: number | undefined) => {
    const insumoNome = insumosAll.find((cat) => cat.id === id);
    return insumoNome ? insumoNome.nome : "Desconhecido";
  };

  const getCategoriaNome = (id: number | undefined) => {
    const categoriaNome = categorias.find((cat) => cat.id === id);
    return categoriaNome ? categoriaNome.categoria : "Desconhecido";
  };

  const columns: GridColDef<ProdutoDataRow>[] = [
    {field: "nome", headerName: "Nome", editable: false, flex: 0, minWidth: 150, width: 200, headerClassName: "gridHeader--header",},
    {field: "keyWord", headerName: "Descrição", editable: false, flex: 0, minWidth: 150, width: 190, headerClassName: "gridHeader--header",},
    {field: "tipo", headerName: "Tipo", editable: false, flex: 0, minWidth: 70, width: 100, headerClassName: "gridHeader--header", valueGetter: ({ value }) => (value ? "Serviço" : "Produto"),},
    {field: "idCategoria", headerName: "Categoria", editable: false, flex: 0, minWidth: 100, width: 100, headerClassName: "gridHeader--header", renderCell: (params) => <span>{getCategoriaNome(params.value)}</span>,},
    {field: "idInsumo", headerName: "Insumo", editable: false, flex: 0, minWidth: 130, width: 110, headerClassName: "gridHeader--header", renderCell: (params) => <span>{getInsumoNome(params.value)}</span>,},
    {field: "largura", headerName: "Largura", editable: false, flex: 0, minWidth: 70, width: 70, headerClassName: "gridHeader--header", renderCell: (params) => <span>{params.value} cm</span>,},
    {field: "comprimento", headerName: "Comprimento", editable: false, flex: 0, minWidth: 110, width: 110, headerClassName: "gridHeader--header", renderCell: (params) => <span>{params.value} cm</span>,},
    {field: "acoes", headerName: "Ações", width: 150, minWidth: 150, align: "center", type: "actions", flex: 0, headerClassName: "gridHeader--header",
      renderCell: ({ row }) => (
        <div>
          <IconButton
            onClick={() => row.id !== undefined && handleDelete(row)}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => row.id !== undefined && [setIdToEdit(row.id), toggleModal()]}>
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
    idCategoria: produto.idCategoria,
    idInsumo: produto.idInsumo,
    largura: produto.largura,
    comprimento: produto.comprimento,
    isActive: produto.isActive == true ? 'Ativo' : 'Inativo'
  }));
  useEffect(() => {
    reset();
  }, [insumoSchema, proCategorySchema, reset]);

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
              <Grid container spacing={2} direction={"row"}>
                <Grid item>
                  <Button
                    onClick={() => toggleModalDeactivate.toggleModal()}
                    variant="outlined"
                    startIcon={<ArchiveIcon />}
                  >
                    Arquivados
                  </Button>
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
                      Cadastro Produto
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
                                <MenuItem value={true}>Serviço</MenuItem>
                                <MenuItem value={false}>Produto</MenuItem>
                              </Select>
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          {/* Campo KeyWord */}
                          <TextField
                            id="outlined-helperText"
                            label="Descrição"
                            helperText={
                              errors.keyWord?.message
                            }
                            error={!!errors.keyWord}
                            fullWidth
                            {...register("keyWord")}
                          />

                        <Controller
                          name="largura"
                          control={control}
                          defaultValue={0} // Valor padrão
                          rules={{ required: "Largura é obrigatória" }}
                          render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <NumericFormat
                              customInput={TextField}
                              sx={{ marginTop: 2.9 }}
                              suffix="cm"
                              fullWidth
                              id="outlined-helperText"
                              label="Largura"
                              thousandSeparator="."
                              decimalSeparator=","
                              allowLeadingZeros
                              value={value} // Valor atual
                              onValueChange={(values) => {
                                const { floatValue } = values;
                                onChange(floatValue ?? 0); // Atualiza o valor no react-hook-form
                              }}
                              helperText={error ? error.message : "Obrigatório"}
                              error={!!error}
                            />
                          )}
                        />

                        <Controller
                          name="comprimento"
                          control={control}
                          defaultValue={0} // Valor padrão
                          rules={{ required: "Comprimento é obrigatório" }}
                          render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <NumericFormat
                              customInput={TextField}
                              sx={{ marginTop: 2.9 }}
                              suffix="cm"
                              fullWidth
                              id="outlined-helperText"
                              label="Comprimento"
                              thousandSeparator="."
                              decimalSeparator=","
                              allowLeadingZeros
                              value={value} // Valor atual
                              onValueChange={(values) => {
                                const { floatValue } = values;
                                onChange(floatValue ?? 0); // Atualiza o valor no react-hook-form
                              }}
                              helperText={error ? error.message : "Obrigatório"}
                              error={!!error}
                            />
                          )}
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
            {open && (
              <ModalEditProduto
                open={open}
                idToEdit={idToEdit}
                loadProducts={loadProducts}
                insumos={insumos}
                insumosAll={insumosAll}
                produtos={products}
                categoriasProdutos={categorias}
                setAlertMessage={setAlertMessage}
                setShowAlert={setShowAlert}
                toggleModal={toggleModal}
                
              />
            )}
            { toggleModalDeactivate.open && (
              <ModalDeactivateProduto
                open={toggleModalDeactivate.open}
                toggleModal={toggleModalDeactivate.toggleModal}
                getCategoriaNome={getCategoriaNome}
                getInsumoNome={getInsumoNome}
                loadProducts={loadProducts}
              />
            )}
           
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
      {showAlert && <Alert severity="info">{alertMessage}</Alert>}
    </Box>
  );
};

export default Produto;
