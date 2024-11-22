import { Box, InputLabel, Select, MenuItem, Modal, Button, TextField, Typography, IconButton, Grid } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DoneIcon from "@mui/icons-material/Done";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { ModalRoot } from "../../../shared/components/ModalRoot";
import dayjs from "dayjs";
import "../../venda.css";
import { putPurchases } from "../../../shared/services/compraServices";
import { vendaSchema, vendaSchemaType,vendaProdutoSchemaType, financeiroSchemaType, insumoSchemaType, compraSchema } from "../../../shared/services/types";
import { GridDeleteIcon } from "@mui/x-data-grid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
    compraSchemaType,
    compraInsumoSchemaType
} from "../../../shared/services/types";

interface ModalEditCompra {
    open: boolean
    toggleModal: () => void
    loadPurchases: () => void
    idToEdit: number
    userId: number | null
    setAlertMessage: (alertMessage: string) => void
    setShowAlert: (open: boolean) => void
    fornecedores : {
        nome: string; 
        id?: number | undefined;
    }[]
    compras: compraSchemaType[],
    comprasInsumos: compraInsumoSchemaType[]
    insumos: insumoSchemaType[]
    bancos : {
        nome: string;
        valorTotal: number; 
        id?: number | undefined;
    }[]
    financeiro: financeiroSchemaType[]
}

export function ModalEditCompra({financeiro, bancos, insumos, comprasInsumos,compras, fornecedores, open, toggleModal, loadPurchases, idToEdit, setAlertMessage, setShowAlert}: ModalEditCompra){

    const filterCompras = compras.filter((compra) => compra.id === idToEdit);
    const idCompras = filterCompras.map((compra) => compra.id);
   
    const fornecedor = fornecedores.filter((fornecedor) => fornecedor.id === filterCompras[0]?.idFornecedor);
    const compra_insumo = comprasInsumos.filter((ci) => idCompras.includes(ci.idCompra));
    const financeiros = financeiro.filter((fin) => idCompras.includes(fin.idCompra));


    const { register, handleSubmit, reset, control, watch, setValue, formState: { errors } } = useForm<compraSchemaType>({
        resolver: zodResolver(compraSchema),
        defaultValues: {
          idFornecedor: fornecedor[0].id,
          desconto: filterCompras[0].desconto,
          numNota: filterCompras[0].numNota,
          isCompraOS: filterCompras[0].isCompraOS,
          dataCompra: dayjs(filterCompras[0].dataCompra).format("YYYY-MM-DD"),
          financeiros: financeiros.map(fin => ({ idBanco: fin.idBanco, idFormaPgto: fin.idFormaPgto, parcelas: fin.parcelas })),
          compras_insumos: compra_insumo.map(ci => ({ idInsumo: ci?.idInsumo, preco: ci?.preco,  largura: ci?.largura, comprimento: ci?.comprimento }))
        },
      });

    const handleAddSupplie = () => { // pq usamos isso?
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

    async function handleUpdate(data: compraSchemaType){
      try {
          const newData = {...data, id: idToEdit}
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
          console.error("Erro ao atualizar compra ou produtos:", error)
      }
    };


    return(
        <Modal
              open={open}
              onClose={toggleModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <ModalRoot>

                  <form onSubmit={handleSubmit(handleUpdate)}>
                  <Controller
                    name="idFornecedor"
                    control={control}
                    render={({ field }) => (
                      <Select
                        style={{ width: 300 }}
                        labelId="select-label"
                        id="demo-simple-select"
                        error={!!errors.idFornecedor}
                        {...field} 
                      >
                        {fornecedores &&
                          fornecedores.map((fornecedor) => (
                            <MenuItem key={fornecedor.id} value={fornecedor.id}>
                              {fornecedor.nome}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                  />

                    <InputLabel id="demo-simple-select-label">
                      Compra ou OS
                    </InputLabel>

                    <Controller
                      control={control}
                      name="isCompraOS"
                      //defaultValue={0}
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
                      //defaultValue={dayjs(dataC).format("YYYY-MM-DD")}
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
                      type="number"
                      label="Desconto"
                      defaultValue={0}
                      helperText={errors.desconto?.message || "Obrigatório"}
                      error={!!errors.desconto}
                      {...register("desconto", { valueAsNumber: true })}
                    />


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
                                onClick={() => handleRemoveSupplie(index)}
                                color="error"
                              >
                                <GridDeleteIcon />
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
                            onClick={handleAddSupplie}
                            sx={{ mt: 2 }}
                          >
                            Adicionar Produto
                          </Button>
                        </Grid>
                      

                    <Button
                      type="submit"
                      variant="outlined"
                      startIcon={<DoneIcon />}
                    >
                      Atualizar
                    </Button>
                  </form>
                </ModalRoot>
            </Modal>

    )
}



































