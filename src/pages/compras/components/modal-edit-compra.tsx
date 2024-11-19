import { Box, InputLabel, Select, MenuItem, Modal, Button, TextField, Typography, IconButton } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DoneIcon from "@mui/icons-material/Done";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { ModalRoot } from "../../../shared/components/ModalRoot";
import dayjs from "dayjs";
import "../../venda.css";
import { putPurchases } from "../../../shared/services/compraServices";
import { vendaSchema, vendaSchemaType,vendaProdutoSchemaType, financeiroSchemaType } from "../../../shared/services/types";
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
    setAlertMessage: (alertMessage: string) => void
    setShowAlert: (open: boolean) => void
    fornecedores : {
        nome: string; 
        id?: number | undefined;
    }[]
    compras: compraSchemaType[],
    comprasInsumos: compraInsumoSchemaType[]
}

export function ModalEditCompra({comprasInsumos,compras, fornecedores, open, toggleModal, loadPurchases, idToEdit, setAlertMessage, setShowAlert}: ModalEditCompra){

    const filterCompras = compras.filter((compra) => compra.id === idToEdit);
    const idCompras = filterCompras.map((compra) => compra.id);
    const fornecedor = fornecedores.filter((fornecedor) => fornecedor.id === filterCompras[0]?.idFornecedor);
    const compra_insumo = comprasInsumos.filter((ci) => idCompras.includes(ci.idCompra));


    const { register, handleSubmit, reset, control, formState: { errors } } = useForm<compraSchemaType>({
        resolver: zodResolver(vendaSchema),
        defaultValues: {
          idFornecedor: fornecedor[0].id,
          desconto: filterCompras[0].desconto,
          numNota: filterCompras[0].numNota,
          isCompraOS: filterCompras[0].isCompraOS,
          dataCompra: dayjs(filterCompras[0].dataCompra).format("YYYY-MM-DD"),
          compras_insumos: compra_insumo.map(vp => ({ idProduto: vp?.idProduto, quantidade: vp?.quantidade }))
        },
      });

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
              reset();
              loadPurchases();
              toggleModal();
        } catch (error) {
            console.error("Erro ao atualizar venda ou produtos:", error)
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

                    <InputLabel id="demo-simple-select-label">
                      IsOpen
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
                              error={
                                !!errors.compras_insumos?.[index]?.idInsumo
                              }
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
                          {...register(
                            `compras_insumos.${index}.preco` as const
                          )}
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
                
                </ModalRoot>
            </Modal>

    )
}



































