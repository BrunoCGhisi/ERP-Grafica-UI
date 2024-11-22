import { useState, useEffect } from "react";

import axios from "axios";
import {
  Box,
  Modal,
  Button,
  Typography,
  TextField,
  Stack,
  IconButton,
  Grid,
} from "@mui/material";
import { DataGrid, GridColDef, GridLocaleText } from "@mui/x-data-grid";
import { ModalStyle, GridStyle, SpaceStyle } from "../shared/styles";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import InputAdornment from "@mui/material/InputAdornment";
import { MiniDrawer } from "../shared/components";
import { getToken } from "../shared/services";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOpenModal } from "../shared/hooks/useOpenModal";
import { ModalRoot } from "../shared/components/ModalRoot";
import { NumericFormat } from "react-number-format";

import {
  bancoSchema,
  BancoDataRow,
  bancoSchemaType,
} from "../shared/services/types";
import { getBanks, postBank, putBank, deleteBank } from "../shared/services";

const Banco = () => {
  const [selectedData, setSelectedData] = useState<BancoDataRow | null>(null);
  const [banks, setBanks] = useState<bancoSchemaType[]>([]);
  const { open, toggleModal } = useOpenModal();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<bancoSchemaType>({
    resolver: zodResolver(bancoSchema),
  });

  // Modal ADD -----------------------------------------------------------------------------------------------------
  const [adopen, setAdOpen] = useState<boolean>(false);
  const addOn = () => {
    setAdOpen(true), reset();
  };
  const addOf = () => setAdOpen(false);

  // População da Modal ----------------------------

  const handleEdit = (updateData: BancoDataRow) => {
    setSelectedData(updateData);
    toggleModal();
  };

  useEffect(() => {
    if (selectedData) {
      setValue("id", selectedData.id);
      setValue("nome", selectedData.nome);
      setValue("valorTotal", selectedData.valorTotal);
    }
  }, [selectedData, setValue]);

  //CRUD -----------------------------------------------------------------------------------------------------

  const loadBanks = async () => {
    const banksData = await getBanks();
    setBanks(banksData);
  };

  const handleAdd = async (data: bancoSchemaType) => {
    await postBank(data);
    loadBanks();
    setAdOpen(false);
  };

  const handleUpdate = async (data: bancoSchemaType) => {
    await putBank(data);
    loadBanks();
    toggleModal();
  };

  const handleDelete = async (id: number) => {
    await deleteBank(id);
    loadBanks();
  };

  useEffect(() => {
    loadBanks();
  }, [open]);

  

  const columns: GridColDef<BancoDataRow>[] = [
    {
      field: "nome",
      headerName: "Nome da Instituição Bancária",
      editable: false,
      flex: 0,
      minWidth: 700,
      maxWidth: 800,
      width: 700,
      headerClassName: "gridHeader--header",
    },
    {
      field: "valorTotal",
      headerName: "Saldo",
      editable: false,
      flex: 0,

      minWidth: 200,
      width: 200,
      maxWidth: 250,
      headerClassName: "gridHeader--header",

      renderCell: (params) => {
        const formattedValue = new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(params.value);

        return (
          <Box
            sx={{
              backgroundColor: params.value < 0 ? "error.light" : "transparent",
              color: params.value < 0 ? "#fff" : "#000",
              opacity: params.value < 0 ? "60%" : "100%",
              width: "100%",
              height: "100%",
              display: "flex",
            }}
          >
            {formattedValue}
          </Box>
        );
      },
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

  const rows = banks.map((banco) => ({
    id: banco.id,
    nome: banco.nome,
    valorTotal: banco.valorTotal,
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
              <Typography variant="h6">Bancos</Typography>
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
                      gutterBottom
                    >
                      Cadastro Banco
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <form onSubmit={handleSubmit(handleAdd)}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                          
                          <TextField
                            fullWidth
                            id="outlined-helperText"
                            label="Nome da Instituição Bancária"
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
                            label="Saldo"
                            thousandSeparator="."
                            decimalSeparator=","
                            allowLeadingZeros
                            onValueChange={(values) => {
                              const { floatValue } = values;
                              setValue("valorTotal", floatValue ?? 0);
                            }}
                            helperText={
                              errors.valorTotal?.message || "Obrigatório"
                            }
                            error={!!errors.valorTotal}
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
                      gutterBottom
                    >
                      Editar Banco
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <form onSubmit={handleSubmit(handleUpdate)}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                          <TextField
                            fullWidth
                            id="outlined-helperText"
                            label="Nome da Instituição Bancária"
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
                            label="Saldo"
                            thousandSeparator=","
                            decimalSeparator="."
                            allowLeadingZeros
                            value={watch("valorTotal")} // Obtém o valor atual do formulário
                            onValueChange={(values) => {
                              const { floatValue } = values;
                              setValue("valorTotal", floatValue ?? 0); // Atualiza o valor no formulário
                            }}
                            helperText={
                              errors.valorTotal?.message || "Obrigatório"
                            }
                            error={!!errors.valorTotal}
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

export default Banco;
