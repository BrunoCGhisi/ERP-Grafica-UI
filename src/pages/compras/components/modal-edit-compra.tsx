import {
  Box,
  InputLabel,
  Select,
  MenuItem,
  Modal,
  Button,
  TextField,
  Typography,
  IconButton,
  Grid,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DoneIcon from "@mui/icons-material/Done";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { ModalRoot } from "../../../shared/components/ModalRoot";
import dayjs from "dayjs";
import "../../venda.css";
import { putPurchases } from "../../../shared/services/compraServices";
import {
  vendaSchema,
  vendaSchemaType,
  vendaProdutoSchemaType,
  financeiroSchemaType,
  insumoSchemaType,
  compraSchema,
} from "../../../shared/services/types";
import { GridDeleteIcon } from "@mui/x-data-grid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  compraSchemaType,
  compraInsumoSchemaType,
} from "../../../shared/services/types";

import { ModalStyle } from "../../../shared/styles";

const today = new Date();
import DeleteIcon from "@mui/icons-material/Delete";
import { ModalRootFull } from "../../../shared/components/ModalRootFull";
interface ModalEditCompra {
  open: boolean;
  toggleModal: () => void;
  loadPurchases: () => void;
  idToEdit: number;
  userId: number | null;
  setAlertMessage: (alertMessage: string) => void;
  setShowAlert: (open: boolean) => void;
  fornecedores: {
    nome: string;
    id?: number | undefined;
  }[];
  compras: compraSchemaType[];
  comprasInsumos: compraInsumoSchemaType[];
  insumos: insumoSchemaType[];
  bancos: {
    nome: string;
    valorTotal: number;
    id?: number | undefined;
  }[];
  financeiro: financeiroSchemaType[];
}

export function ModalEditCompra({
  financeiro,
  bancos,
  insumos,
  comprasInsumos,
  compras,
  fornecedores,
  open,
  toggleModal,
  loadPurchases,
  idToEdit,
  setAlertMessage,
  setShowAlert,
}: ModalEditCompra) {
  const filterCompras = compras.filter((compra) => compra.id === idToEdit);
  const idCompras = filterCompras.map((compra) => compra.id);

  const fornecedor = fornecedores.filter(
    (fornecedor) => fornecedor.id === filterCompras[0]?.idFornecedor
  );
  const compra_insumo = comprasInsumos.filter((ci) =>
    idCompras.includes(ci.idCompra)
  );
  const financeiros = financeiro.filter((fin) =>
    idCompras.includes(fin.idCompra)
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<compraSchemaType>({
    resolver: zodResolver(compraSchema),
    defaultValues: {
      idFornecedor: fornecedor[0].id,
      desconto: filterCompras[0].desconto,
      numNota: filterCompras[0].numNota,
      isCompraOS: filterCompras[0].isCompraOS,
      dataCompra: dayjs(filterCompras[0].dataCompra).format("YYYY-MM-DD"),
      financeiros: financeiros.map((fin) => ({
        idBanco: fin.idBanco,
        idFormaPgto: fin.idFormaPgto,
        parcelas: fin.parcelas,
      })),
      compras_insumos: compra_insumo.map((ci) => ({
        idInsumo: ci?.idInsumo,
        preco: ci?.preco,
        largura: ci?.largura,
        comprimento: ci?.comprimento,
      })),
    },
  });

  const handleAddSupplie = () => {
    // pq usamos isso?
    append({ idInsumo: 0, largura: 0, comprimento: 0, preco: 0 });
  };
  const { fields, append, remove } = useFieldArray({
    control,
    name: "compras_insumos",
  });
  const handleRemoveSupplie = (index: number) => {
    remove(index);
  };

  const waiter = watch("financeiros.0.idFormaPgto");
  useEffect(() => {
    if (waiter === 0 || waiter === 1 || waiter === 4) {
      setValue("financeiros.0.parcelas", 1); // Atualiza o valor de parcelas
    }
  }, [waiter, setValue]);

  async function handleUpdate(data: compraSchemaType) {
    try {
      const newData = { ...data, id: idToEdit };
      const response = await putPurchases(newData);
      if (response.data) {
        setAlertMessage(response.data);
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 5000);
      }

      loadPurchases();
      reset();
      toggleModal();
    } catch (error) {
      console.error("Erro ao atualizar compra ou produtos:", error);
    }
  }

  return (
    <Modal
      open={open}
      onClose={toggleModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <ModalRootFull>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Nova Compra
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <form onSubmit={handleSubmit(handleUpdate)}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={5}>
                  <Grid container spacing={2}>
                    {/* Fornecedor */}
                    <Grid item xs={12} sm={12}>
                      <InputLabel id="demo-simple-select-label">
                        Fornecedor
                      </InputLabel>
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
                          <MenuItem value={fornecedor.id} key={fornecedor.id}>
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
                        helperText={errors.dataCompra?.message || "Obrigatório"}
                        error={!!errors.dataCompra}
                        defaultValue={dayjs(today).format("YYYY-MM-DD")}
                        {...register("dataCompra")}
                        fullWidth
                      />
                    </Grid>

                    {/* Número da Nota */}
                    <Grid item xs={4}>
                      <TextField
                        id="outlined-numNota"
                        label="N° Nota"
                        placeholder="0"
                        helperText={errors.numNota?.message || "Obrigatório"}
                        error={!!errors.numNota}
                        {...register("numNota")}
                        fullWidth
                      />
                    </Grid>

                    {/* Desconto */}
                    <Grid item xs={4}>
                      <TextField
                        id="outlined-desconto"
                        label="Desconto"
                        placeholder="0"
                        helperText={errors.desconto?.message || "Obrigatório"}
                        error={!!errors.desconto}
                        {...register("desconto")}
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={4}>
                      <TextField
                        id="outlined-parcelas"
                        label="Parcelas"
                        placeholder="1"
                        helperText={
                          errors.financeiros?.[0]?.parcelas?.message ||
                          "Obrigatório"
                        }
                        error={!!errors.financeiros?.[0]?.parcelas}
                        {...register("financeiros.0.parcelas")}
                        fullWidth
                      />
                    </Grid>

                    {/* Banco */}
                    <Grid item xs={6}>
                      <InputLabel id="demo-simple-select-label">
                        Banco
                      </InputLabel>
                      <Controller
                        name={`financeiros.0.idBanco`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value)}
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

                    {/* Forma de Pagamento */}
                    <Grid item xs={6}>
                      <InputLabel>Forma de Pagamento</InputLabel>
                      <Controller
                        name={`financeiros.0.idFormaPgto`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value)}
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

                {/* Coluna 2 */}
                <Grid item xs={12} md={6} sx={{ marginTop: 2, marginLeft: 3 }}>
                  <Grid container spacing={2} direction="column">
                    {/* Insumos */}
                    <Grid container spacing={2}>
                      {fields.map((item, index) => (
                        <Grid
                          key={item.id}
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Grid container spacing={2} alignItems="center">
                            {/* Select Insumo */}
                            <Grid item xs={9}>
                              <InputLabel id={`insumo-label-${index}`}>
                                Insumo
                              </InputLabel>

                              <Controller
                                control={control}
                                name={`compras_insumos.${index}.idInsumo`}
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

                            {/* Botão Remover */}
                            <Grid item xs={3}>
                              <IconButton
                                onClick={() => handleRemoveSupplie(index)}
                                color="error"
                                sx={{ alignSelf: "flex-end", mt: 1 }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Grid>
                          </Grid>

                          {/* Largura, Comprimento, Preço */}
                          <Grid container spacing={2} mt={1}>
                            <Grid item xs={4}>
                              <TextField
                                {...register(
                                  `compras_insumos.${index}.largura`
                                )}
                                type="number"
                                error={
                                  !!errors.compras_insumos?.[index]?.largura
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
                                  `compras_insumos.${index}.comprimento`
                                )}
                                type="number"
                                error={
                                  !!errors.compras_insumos?.[index]?.comprimento
                                }
                                label="Comprimento"
                                defaultValue={1}
                                InputProps={{ inputProps: { min: 1 } }}
                                fullWidth
                              />
                            </Grid>
                            <Grid item xs={4}>
                              <TextField
                                {...register(`compras_insumos.${index}.preco`)}
                                type="number"
                                error={!!errors.compras_insumos?.[index]?.preco}
                                label="Preço"
                                defaultValue={1}
                                InputProps={{ inputProps: { min: 1 } }}
                                fullWidth
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              {/* Botões de Submit */}
              <Grid item xs={12} sx={{ textAlign: "right", mt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={handleAddSupplie}
                >
                  Adicionar Insumo
                </Button>

                <Button
                  type="submit"
                  variant="outlined"
                  startIcon={<DoneIcon />}
                  sx={{ ml: 2 }}
                >
                  Cadastrar
                </Button>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </ModalRootFull>
    </Modal>
  );
}
