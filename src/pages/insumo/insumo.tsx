import { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Button,
  Typography,
  TextField,
  IconButton,
  Grid,
  Alert,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ModalStyle, GridStyle, SpaceStyle } from "../../shared/styles";
import { MiniDrawer } from "../../shared/components";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOpenModal } from "../../shared/hooks/useOpenModal";
import ArchiveIcon from "@mui/icons-material/Archive";

import {
  insumoSchema,
  InsumoDataRow,
  insumoSchemaType,
  produtoSchemaType,
} from "../../shared/services/types";

import {
  deleteSupplie,
  getProducts,
  getSupplies,
  postSupplie,
  putSupplie,
} from "../../shared/services";
import { ModalEditInsumo } from "./components/modal-edit-insumos";
import { NumericFormat } from "react-number-format";
import { ModalDeactivateInsumo } from "./components/modal-deactivate-insumos";

const Insumo = () => {
  const [supplies, setSupplies] = useState<insumoSchemaType[]>([]);
  const { open, toggleModal } = useOpenModal();
  const toggleModalDeactivate = useOpenModal();
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [idToEdit, setIdToEdit] = useState<any>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<insumoSchemaType>({
    resolver: zodResolver(insumoSchema),
  });

  // Modal ADD -----------------------------------------------------------------------------------------------------
  const [adopen, setAdOpen] = useState<boolean>(false);
  const addOn = () => {
    setAdOpen(true), reset();
  };
  const addOf = () => setAdOpen(false);

  //CRUD -----------------------------------------------------------------------------------------------------
  const loadSupplies = async () => {
    const productCategoriesData = await getSupplies();
    setSupplies(productCategoriesData);
  };

  const handleAdd = async (data: insumoSchemaType) => {
    const response = await postSupplie(data);
    console.log(response);

    if (response) {
      setAlertMessage(`${response.data}`);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    }

    loadSupplies();
    setAdOpen(false);
  };

  const handleDelete = async (data: insumoSchemaType) => {
    const produtos = await getProducts();
    const filterProdutos = produtos.filter(
      (produto: produtoSchemaType) => produto.idInsumo === data.id
    );
    if (filterProdutos.length === 0) {
      await deleteSupplie(data.id!);
    } else {
      const deactivate = { ...data, isActive: false };
      await putSupplie(deactivate);
    }
    loadSupplies();
  };

  useEffect(() => {
    loadSupplies();
  }, [open]);

  const columns: GridColDef<InsumoDataRow>[] = [
    {
      field: "nome",
      headerName: "Nome",
      editable: false,
      flex: 0,
      width: 500,
      minWidth: 500,
      headerClassName: "gridHeader--header",
    },
    {
      field: "estoque",
      headerName: "Estoque",
      editable: false,
      flex: 0,
      width: 200,
      minWidth: 200,
      headerClassName: "gridHeader--header",
    },
    
    {
      field: "valorM2",
      headerName: "Valor Metro Quadrado",
      editable: false,
      flex: 0,
      width: 200,
      minWidth: 200,
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
      field: "isActive",
      headerName: "Status",
      editable: false,
      flex: 0,
      width: 200,
      minWidth: 200,
      headerClassName: "gridHeader--header",
      valueGetter: ({ value }) => (value ? "Desativado" : "Ativo"),
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
        <div>
          <IconButton onClick={() => row.id !== undefined && handleDelete(row)}>
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
      ),
    },
  ];

  const rows = supplies.map((supplie) => ({
    id: supplie.id,
    nome: supplie.nome,
    estoque: supplie.estoque,
    isActive: supplie.isActive,
    valorM2: supplie.valorM2,
  }));

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
              <Typography variant="h6">Insumos</Typography>
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
                <Grid container spacing={2}>
                  <Grid item>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      Cadastro Insumo
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <form onSubmit={handleSubmit(handleAdd)}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={100}>
                          <TextField
                            sx={{width: 450}}
                            id="outlined-helperText"
                            label="Nome"
                            helperText={errors.nome?.message || "Obrigatório"}
                            error={!!errors.nome}
                            {...register("nome")}
                          />
                        </Grid>

                        <Grid item xs={12} md={8}>
                          <NumericFormat
                            customInput={TextField}
                            prefix="R$"
                            fullWidth
                            id="outlined-helperText"
                            label="Valor Metro Quadrado"
                            thousandSeparator="."
                            decimalSeparator=","
                            allowLeadingZeros
                            onValueChange={(values) => {
                              const { floatValue } = values;
                              setValue("valorM2", floatValue ?? 0);
                            }}
                            helperText={
                              errors.valorM2?.message || "Obrigatório"
                            }
                            error={!!errors.valorM2}
                          />
                        </Grid>

                        <Grid item xs={12} md={100}>
                          <TextField
                            sx={{width: 450}}
                            id="outlined-helperText"
                            label="Estoque"
                            type="number"
                            helperText={
                              errors.estoque?.message || "Obrigatório"
                            }
                            error={!!errors.estoque}
                            {...register("estoque", { valueAsNumber: true })}
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
            {/* ---------UPDATE----------------------------------------------------------------------------------------------------------- */}
            {open && (
              <ModalEditInsumo
                open={open}
                toggleModal={toggleModal}
                loadSupplies={loadSupplies}
                setAlertMessage={setAlertMessage}
                setShowAlert={setShowAlert}
                insumos={supplies}
                idToEdit={idToEdit}
              />
            )}
            {toggleModalDeactivate.open && (
              <ModalDeactivateInsumo
                open={toggleModalDeactivate.open}
                toggleModal={toggleModalDeactivate.toggleModal}
                loadSupplies={loadSupplies}
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

export default Insumo;
