import {
  InputLabel,
  Select,
  MenuItem,
  Modal,
  Button,
  TextField,
  Typography,
  IconButton,
  Grid,
  InputAdornment
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DoneIcon from "@mui/icons-material/Done";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import dayjs from "dayjs";
import "../../venda.css";
import { putPurchases } from "../../../shared/services/compraServices";
import {
  financeiroSchemaType,
  insumoSchemaType,
  compraSchema,
  bancoSchemaType
} from "../../../shared/services/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  compraSchemaType,
  compraInsumoSchemaType,
} from "../../../shared/services/types";

import DeleteIcon from "@mui/icons-material/Delete";
import { ModalRootFull } from "../../../shared/components/ModalRootFull";
import { NumericFormat } from "react-number-format";

const today = new Date();
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
  insumosAll: insumoSchemaType[];
  bancos: bancoSchemaType[];
  bancosAll: bancoSchemaType[]
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
  setShowAlert, insumosAll, bancosAll
}: ModalEditCompra) {
  const filterCompras = compras.filter((compra) => compra.id === idToEdit);
  const idCompras = filterCompras.map((compra) => compra.id);

  const fornecedor = fornecedores.filter(
    (fornecedor) => fornecedor.id === filterCompras[0]?.idFornecedor
  );
  console.log(fornecedores)
  const compra_insumo = comprasInsumos.filter((ci) =>
    idCompras.includes(ci.idCompra)
  );
  const financeiros = financeiro.filter((fin) =>
    idCompras.includes(fin.idCompra)
  );

  const bancosAssociado = financeiros[0].idBanco ? bancosAll.find((banco) => banco.id === financeiros[0].idBanco) : null
  const bancosAtivos = bancos.filter((banco) => banco.isActive);
  const bancosSelect = bancosAssociado && !bancosAssociado.isActive ? [...bancosAtivos, bancosAssociado ] : bancosAtivos


  const insumoAssociado = compra_insumo[0]?.idInsumo
  ? insumosAll.find((insumo) => insumo.id === compra_insumo[0]?.idInsumo) : null;
  const insumosAtivos = insumos.filter((insumo) => insumo.isActive);
  const insumosParaSelect = insumoAssociado && !insumoAssociado.isActive
    ? [...insumosAtivos, insumoAssociado]  
    : insumosAtivos;


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
              Editar Compra
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
                        defaultValue={fornecedor[0]?.id || ""}
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
                      type="date"
                      label={"Data compra"}
                      InputLabelProps={{ shrink: true }}
                      size="medium"
                      helperText={errors.dataCompra?.message || "Obrigatório"}
                      error={!!errors.dataCompra}
                      //defaultValue={dayjs(dataC).format("YYYY-MM-DD")}
                      {...register("dataCompra")}
                      sx={{mt: 1}}
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
                            {bancosSelect?.map((banco) => (
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
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">
                              %
                            </InputAdornment>
                          ),
                        }}
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
                        type="number"
                        placeholder="1"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          readOnly:
                            waiter === 2 || waiter === 1 || waiter === 4,
                        }}
                        helperText={
                          errors.financeiros?.[0]?.parcelas?.message ||
                          "Obrigatório"
                        }
                        error={!!errors.financeiros?.[0]?.parcelas}
                        {...register("financeiros.0.parcelas")}
                        fullWidth
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
                                defaultValue={item.idInsumo}  // Definir corretamente o valor do insumo associado
                                render={({ field }) => (
                                  <Select {...field} fullWidth>
                                    {insumosParaSelect.map((insumo) => (
                                      <MenuItem key={insumo.id} value={insumo.id}>
                                        {insumo.nome} {!insumo.isActive && "(Inativo)"}
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
                                color="primary"
                                sx={{ alignSelf: "flex-end", mt: 1 }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Grid>
                          </Grid>

                          {/* Largura, Comprimento, Preço */}
                          <Grid container spacing={2} mt={1}>
                                <Grid item xs={4}>
                                  <Controller
                                  name={`compras_insumos.${index}.largura`}
                                  control={control}
                                  defaultValue={1} // Valor padrão
                                  rules={{ required: "Largura é obrigatória" }}
                                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <NumericFormat
                                      customInput={TextField}
                                      sx={{ marginTop: 2.9 }}
                                      suffix="m"
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
                                      error={!!error}
                                    />
                                  )}
                                />
                                </Grid>

                                <Grid item xs={4}>
                                  <Controller
                                  name={`compras_insumos.${index}.comprimento`}
                                  control={control}
                                  defaultValue={1} // Valor padrão
                                  rules={{ required: "Comprimento é obrigatório" }}
                                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <NumericFormat
                                      customInput={TextField}
                                      sx={{ marginTop: 2.9 }}
                                      suffix="m"
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
                                      error={!!error}
                                    />
                                  )}
                                />
                                </Grid>

                                <Grid item xs={4}>
                                  <Controller
                                  name={`compras_insumos.${index}.preco`}
                                  control={control}
                                  defaultValue={1} // Valor padrão
                                  rules={{ required: "Preço é obrigatório" }}
                                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <NumericFormat
                                      customInput={TextField}
                                      sx={{ marginTop: 2.9 }}
                                      prefix="R$"
                                      fullWidth
                                      id="outlined-helperText"
                                      label="Preço por m²"
                                      thousandSeparator="."
                                      decimalSeparator=","
                                      allowLeadingZeros
                                      value={value} // Valor atual
                                      onValueChange={(values) => {
                                        const { floatValue } = values;
                                        onChange(floatValue ?? 0); // Atualiza o valor no react-hook-form
                                      }}
                                      error={!!error}
                                    />
                                  )}
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
                  Editar
                </Button>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </ModalRootFull>
    </Modal>
  );
}
