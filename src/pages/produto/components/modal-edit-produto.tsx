import { Box, InputLabel, Grid, Select, MenuItem, Modal, Button, TextField, Typography, IconButton } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DoneIcon from "@mui/icons-material/Done";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { ModalRoot } from "../../../shared/components/ModalRoot";
import dayjs from "dayjs";
import "../../venda.css";
import { getSupplies, putProducts, putSale} from "../../../shared/services";
import { vendaSchema, vendaSchemaType,vendaProdutoSchemaType, financeiroSchemaType, insumoSchemaType, produtoSchema, proCategorySchemaType } from "../../../shared/services/types";
import { GridDeleteIcon } from "@mui/x-data-grid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  produtoSchemaType,
} from "../../../shared/services/types";
import { NumericFormat } from "react-number-format";



interface ModalEditProduto {
    open: boolean
    toggleModal: () => void
    loadProducts: () => void
    insumos: insumoSchemaType[]
    categoriasProdutos: proCategorySchemaType[]
    setAlertMessage: (alertMessage: string) => void
    setShowAlert: (open: boolean) => void
    idToEdit: any
    produtos: produtoSchemaType[],

}

export function ModalEditProduto({open, loadProducts, toggleModal, clientes, setAlertMessage, setShowAlert, produtos, idToEdit, userId, bancos, produtos, vendasProdutos, financeiro}: ModalEditProduto){
  
    //const today = new Date()
    const filterProdutos = produtos.filter((produto) => produto.id === idToEdit);

    const { register, handleSubmit, reset, control, setValue, formState: { errors } } = useForm<produtoSchemaType>({
      resolver: zodResolver(produtoSchema),
      defaultValues: {
        nome: filterProdutos[0].nome,
        tipo: filterProdutos[0].tipo,
        keyWord: filterProdutos[0].keyWord,
        idCategoria: filterProdutos[0].idCategoria,
        idInsumo:filterProdutos[0].idInsumo,
        largura:filterProdutos[0].largura,
        comprimento:filterProdutos[0].comprimento,
        isActive:filterProdutos[0].isActive,
      },
    });

  async function handleUpdate(data: produtoSchemaType){
    try {
      const newData = {...data, id: idToEdit}
      const response = await putProducts(newData);
      if (response.data) {
        setAlertMessage(response.data);
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 5000);
      }
      loadProducts();
      reset();
      toggleModal();
    } catch (error) {
      console.error("Erro ao atualizar produto:", error)
    }
  }
    return (
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
                      thousandSeparator="."
                      decimalSeparator=","
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
    )
}